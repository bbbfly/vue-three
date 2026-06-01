import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Camera,
  AnimationMixer,
  Clock
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import type { Pass } from 'three/addons/postprocessing/Pass.js'
import type { RendererConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'
import type { ThreeContext } from '../core/context'

export interface CanvasOptions extends RendererConfig {
  width?: number
  height?: number
  camera?: {
    fov?: number
    near?: number
    far?: number
    position?: [number, number, number]
  }
  autoClear?: boolean
  enableControls?: boolean
  stencil?: boolean
  toneMapping?: number
  toneMappingExposure?: number
}
type Config = {
  options: CanvasOptions
  animateFn: AnimateFn
  renderFn?: AnimateFn
}
export type AnimateFn = ({
  scene,
  camera,
  delta,
  size
}: {
  scene: Scene
  camera: Camera
  delta: number
  renderer?: WebGLRenderer
  renderers?: Map<string, THREE.Renderer>
  size: { width: number; height: number }
}) => void

type ReadyResolve = (context: ThreeContext) => void

export function useCanvas({ options = {}, animateFn, renderFn }: Config) {
  let readyResolve: ReadyResolve | null = null
  const readyPromise: Promise<ThreeContext> = new Promise(resolve => {
    readyResolve = resolve
  })
  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const scene = new Scene()
  const initialWidth = options.width || 300
  const initialHeight = options.height || 150

  const camera = new PerspectiveCamera(
    options.camera?.fov || 75,
    initialWidth / initialHeight,
    options.camera?.near || 0.1,
    options.camera?.far || 1000
  )

  let animationFrameId: number | null = null
  const animationMixers = new Set<AnimationMixer>()
  const renderPasses = new Set<Pass>()
  const clock = new Clock()
  let postProcessingEnabled = false

  // 场景注册表 - 支持多场景渲染
  const scenes = new Map<string, Scene>([['main', scene]])

  // 渲染器注册表 - 支持多渲染器
  const renderers = new Map<string, THREE.Renderer>()

  // 创建响应式 context 对象
  const context = reactive<ThreeContext>({
    ready: fn => {
      if (fn) {
        readyPromise.then(fn)
      } else {
        return readyPromise
      }
    },
    renderer: null,
    scene,
    camera,
    controls: null,
    canvas: null,
    size: { width: initialWidth, height: initialHeight },
    composer: null,

    // 场景注册表
    scenes,
    registerScene: (name: string, sceneInstance: Scene) => scenes.set(name, sceneInstance),
    getScene: (name: string) => scenes.get(name),
    unregisterScene: (name: string) => scenes.delete(name),

    // 渲染器注册表
    renderers,
    registerRenderer: (name: string, rendererInstance: THREE.Renderer) =>
      renderers.set(name, rendererInstance),
    getRenderer: (name: string) => renderers.get(name),
    unregisterRenderer: (name: string) => renderers.delete(name),

    registerAnimationMixer: (mixer: AnimationMixer) => animationMixers.add(mixer),
    unregisterAnimationMixer: (mixer: AnimationMixer) => animationMixers.delete(mixer),
    registerRenderPass: (pass: Pass) => {
      renderPasses.add(pass)
      if (context.composer) {
        context.composer.addPass(pass)
      } else if (context.renderer) {
        postProcessingEnabled = true
        context.composer = new EffectComposer(context.renderer)
        renderPasses.forEach(p => {
          context.composer!.addPass(p)
        })
        handleResize()
      }
    },
    unregisterRenderPass: (pass: Pass) => {
      renderPasses.delete(pass)
      if (context.composer) {
        const passes = context.composer.passes
        const index = passes.indexOf(pass)
        if (index > -1) {
          passes.splice(index, 1)
        }
        pass.dispose()
      }
    },
    enablePostProcessing: () => {
      if (postProcessingEnabled || !context.renderer) return

      postProcessingEnabled = true

      context.composer = new EffectComposer(context.renderer)

      renderPasses.forEach(pass => {
        context.composer!.addPass(pass)
      })

      handleResize()
    },
    setCamera: (newCamera: Camera) => {
      context.camera = newCamera

      // 同步更新 OrbitControls 的相机引用
      if (context.controls) {
        context.controls.object = newCamera
      }

      // 同步更新 EffectComposer 的 RenderPass 相机引用
      if (context.composer) {
        const passes = context.composer.passes
        const renderPass = passes.find(p => (p as any).camera)
        if (renderPass) {
          ;(renderPass as any).camera = newCamera
        }
      }

      // 立即执行一次 resize 让新相机适配画布尺寸
      handleResize()
    }
  })

  if (options.clearColor !== undefined) {
    scene.background = new Color(options.clearColor)
  }

  const cameraPos = options.camera?.position || [0, 0, 5]
  camera.position.set(...cameraPos)

  const renderAll = (delta: number) => {
    if (!context.renderer || !context.camera) return

    // 1. 渲染 WebGL 主场景
    if (options.autoClear !== false) {
      context.renderer.clear()
    }
    // 调用自定义渲染函数
    if (renderFn) {
      return renderFn({
        scene,
        camera: context.camera,
        delta,
        renderers,
        renderer: context.renderer,
        size: context.size
      })
    }
    // 后期处理
    if (postProcessingEnabled && context.composer) {
      context.composer.render(delta)
    } else {
      context.renderer.render(scene, context.camera)
    }

    // 2. 渲染其他注册的场景（CSS3D, CSS2D 等）
    renderers.forEach((customRenderer, name) => {
      const customScene = scenes.get(name)
      if (customScene) {
        customRenderer.render(customScene, context.camera)
      }
    })
  }

  const startRenderLoop = () => {
    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      const delta = clock.getDelta()
      animateFn({ scene, camera: context.camera, delta, size: context.size })

      animationMixers.forEach(mixer => {
        mixer.update(delta)
      })

      // 统一更新所有控制器（OrbitControls、FirstPersonControls、FlyControls 等）
      if (context.controls && (context.controls as any).update) {
        ;(context.controls as any).update(delta)
      }

      // 统一渲染调度
      renderAll(delta)
    }
    render()
  }

  let resizeObserver: ResizeObserver | null = null

  const handleResize = () => {
    if (!context.camera || !context.renderer || !canvasRef.value) return
    const container = canvasRef.value.parentElement || canvasRef.value
    const newWidth = options.width || container.clientWidth || 300
    const newHeight = options.height || container.clientHeight || 150

    // 更新响应式 size
    context.size = { width: newWidth, height: newHeight }
    canvasRef.value.style.width = newWidth + 'px'
    canvasRef.value.style.height = newHeight + 'px'
    canvasRef.value.width = newWidth
    canvasRef.value.height = newHeight

    const perspectiveCamera = context.camera as PerspectiveCamera
    if (perspectiveCamera.aspect !== undefined) {
      perspectiveCamera.aspect = newWidth / newHeight
      perspectiveCamera.updateProjectionMatrix()
    }

    context.renderer.setSize(newWidth, newHeight, false)
    context.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if (context.composer) {
      context.composer.setSize(newWidth, newHeight)
      context.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
  }

  onMounted(async () => {
    if (!canvasRef.value) return

    const renderer = new WebGLRenderer({
      canvas: canvasRef.value,
      antialias: options.antialias !== false,
      alpha: options.alpha || false,
      stencil: options.stencil || false
    })
    context.renderer = renderer

    if (options.clearColor !== undefined) {
      renderer.setClearColor(new Color(options.clearColor), options.clearAlpha ?? 1)
    }

    if (options.shadowMap) {
      renderer.shadowMap.enabled =
        options.shadowMap === true || (options.shadowMap as any).enabled === true
      if (typeof options.shadowMap === 'object' && options.shadowMap.type) {
        renderer.shadowMap.type = options.shadowMap.type as any
      }
    }

    if (options.localClippingEnabled !== undefined) {
      renderer.localClippingEnabled = options.localClippingEnabled
    }

    if (options.clippingPlanes !== undefined) {
      renderer.clippingPlanes = options.clippingPlanes
    }

    if (options.toneMapping !== undefined) {
      renderer.toneMapping = options.toneMapping
    }

    if (options.toneMappingExposure !== undefined) {
      renderer.toneMappingExposure = options.toneMappingExposure
    }

    if (options.enableControls !== false) {
      context.controls = new OrbitControls(context.camera, renderer.domElement)
      context.controls.enableDamping = true
      context.controls.dampingFactor = 0.05
    }

    if (!options.width || !options.height) {
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      const observeTarget = canvasRef.value.parentElement || canvasRef.value
      resizeObserver.observe(observeTarget)
    }

    handleResize()
    context.canvas = canvasRef.value
    readyResolve!(context)
    startRenderLoop()
  })

  onBeforeUnmount(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    if (context.controls) {
      context.controls.dispose()
      context.controls = null
    }

    while (scene.children.length > 0) {
      const child = scene.children[0]
      disposeObject3D(child, false)
      scene.remove(child)
    }

    if (context.renderer) {
      context.renderer.dispose()
      context.renderer.forceContextLoss()
      context.renderer = null
    }

    canvasRef.value = null
    context.canvas = null
    context.composer = null
  })

  return {
    canvasRef,
    context
  }
}
