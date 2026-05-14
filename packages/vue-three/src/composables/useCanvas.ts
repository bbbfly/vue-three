import { ref, onMounted, onBeforeUnmount } from 'vue'
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
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import type { Pass } from 'three/addons/postprocessing/Pass.js'
import type { RendererConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

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
}
type Config = {
  options: CanvasOptions
  animateFn: AnimateFn
  renderFn?: AnimateFn
}
export type AnimateFn = ({
  scene,
  camera,
  delta
}: {
  scene: Scene
  camera: Camera
  delta: number
  renderer?: WebGLRenderer
  renderers?: Map<string, THREE.Renderer>
}) => void

type ReadyResolve = (context: ThreeContext) => void

export function useCanvas({ options = {}, animateFn, renderFn }: Config) {
  let readyResolve: ReadyResolve | null = null
  const readyPromise = new Promise(resolve => {
    readyResolve = resolve
  })
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let renderer: WebGLRenderer | null = null
  const scene = new Scene()
  const size = ref({
    width: options.width || 300,
    height: options.height || 150
  })

  let camera: Camera = new PerspectiveCamera(
    options.camera?.fov || 75,
    size.value.width / size.value.height,
    options.camera?.near || 0.1,
    options.camera?.far || 1000
  )

  let controls: OrbitControls | null = null
  let composer: EffectComposer | null = null

  let animationFrameId: number | null = null
  const animationMixers = new Set<AnimationMixer>()
  const renderPasses = new Set<Pass>()
  const clock = new Clock()
  let postProcessingEnabled = false

  // 场景注册表 - 支持多场景渲染
  const scenes = new Map<string, Scene>([['main', scene]])

  // 渲染器注册表 - 支持多渲染器
  const renderers = new Map<string, THREE.Renderer>()

  const registerAnimationMixer = (mixer: AnimationMixer) => {
    animationMixers.add(mixer)
  }

  const unregisterAnimationMixer = (mixer: AnimationMixer) => {
    animationMixers.delete(mixer)
  }

  const registerRenderPass = (pass: Pass) => {
    renderPasses.add(pass)
    if (composer) {
      composer.addPass(pass)
    }
  }

  const unregisterRenderPass = (pass: Pass) => {
    renderPasses.delete(pass)
    if (composer) {
      const passes = composer.passes
      const index = passes.indexOf(pass)
      if (index > -1) {
        passes.splice(index, 1)
      }
      pass.dispose()
    }
  }

  // 场景注册表方法
  const registerScene = (name: string, sceneInstance: Scene) => {
    scenes.set(name, sceneInstance)
  }

  const getScene = (name: string) => scenes.get(name)

  const unregisterScene = (name: string) => {
    scenes.delete(name)
  }

  // 渲染器注册表方法
  const registerRenderer = (name: string, rendererInstance: THREE.Renderer) => {
    renderers.set(name, rendererInstance)
  }

  const getRenderer = (name: string) => renderers.get(name)

  const unregisterRenderer = (name: string) => {
    renderers.delete(name)
  }

  const enablePostProcessing = () => {
    if (postProcessingEnabled || !renderer) return

    postProcessingEnabled = true

    composer = new EffectComposer(renderer)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    renderPasses.forEach(pass => {
      composer!.addPass(pass)
    })

    handleResize()
  }

  if (options.clearColor !== undefined) {
    scene.background = new Color(options.clearColor)
  }

  const cameraPos = options.camera?.position || [0, 0, 5]
  camera.position.set(...cameraPos)

  const setCamera = (newCamera: Camera) => {
    camera = newCamera

    // 同步更新 OrbitControls 的相机引用
    if (controls) {
      controls.object = newCamera
    }

    // 同步更新 EffectComposer 的 RenderPass 相机引用
    if (composer) {
      const passes = composer.passes
      const renderPass = passes.find(p => (p as any).camera)
      if (renderPass) {
        ;(renderPass as any).camera = newCamera
      }
    }

    // 立即执行一次 resize 让新相机适配画布尺寸
    handleResize()
  }

  const renderAll = (delta: number) => {
    if (!renderer || !camera) return

    // 1. 渲染 WebGL 主场景
    if (options.autoClear !== false) {
      renderer.clear()
    }
    // 调用自定义渲染函数
    if (renderFn) {
      return renderFn({
        scene,
        camera,
        delta,
        renderers,
        renderer
      })
    }
    // 貌景处理
    if (postProcessingEnabled && composer) {
      composer.render(delta)
    } else {
      renderer.render(scene, camera)
    }

    // 2. 渲染其他注册的场景（CSS3D, CSS2D 等）
    renderers.forEach((customRenderer, name) => {
      const customScene = scenes.get(name)
      if (customScene) {
        customRenderer.render(customScene, camera)
      }
    })
  }

  const startRenderLoop = () => {
    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      const delta = clock.getDelta()
      animateFn({ scene, camera, delta })

      animationMixers.forEach(mixer => {
        mixer.update(delta)
      })

      // 统一更新所有控制器（OrbitControls、FirstPersonControls、FlyControls 等）
      if (controls && (controls as any).update) {
        ;(controls as any).update(delta)
      }

      // 统一渲染调度
      renderAll(delta)
    }
    render()
  }

  let resizeObserver: ResizeObserver | null = null

  const handleResize = () => {
    if (!camera || !renderer || !canvasRef.value) return
    const container = canvasRef.value.parentElement || canvasRef.value
    const newWidth = options.width || container.clientWidth || 300
    const newHeight = options.height || container.clientHeight || 150

    size.value = { width: newWidth, height: newHeight }
    canvasRef.value.style.width = newWidth + 'px'
    canvasRef.value.style.height = newHeight + 'px'
    canvasRef.value.width = newWidth
    canvasRef.value.height = newHeight

    const perspectiveCamera = camera as PerspectiveCamera
    if (perspectiveCamera.aspect !== undefined) {
      perspectiveCamera.aspect = newWidth / newHeight
      perspectiveCamera.updateProjectionMatrix()
    }

    renderer.setSize(newWidth, newHeight, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if (composer) {
      composer.setSize(newWidth, newHeight)
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
  }

  onMounted(async () => {
    if (!canvasRef.value) return

    renderer = new WebGLRenderer({
      canvas: canvasRef.value,
      antialias: options.antialias !== false,
      alpha: options.alpha || false
    })

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

    if (options.enableControls !== false) {
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
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

    if (controls) {
      controls.dispose()
    }

    while (scene.children.length > 0) {
      const child = scene.children[0]
      disposeObject3D(child, false)
      scene.remove(child)
    }

    if (renderer) {
      renderer.dispose()
      renderer.forceContextLoss()
    }

    canvasRef.value = null
    renderer = null
    controls = null
    composer = null
  })
  const ready = (fn?: ReadyResolve) => {
    if (fn) {
      readyPromise.then(fn)
    } else {
      return readyPromise
    }
  }
  const context = {
    ready,
    renderer,
    scene,
    camera,
    controls,
    canvas: canvasRef.value,
    size: size.value,
    composer,

    // 场景注册表
    scenes,
    registerScene,
    getScene,
    unregisterScene,

    // 渲染器注册表
    renderers,
    registerRenderer,
    getRenderer,
    unregisterRenderer,

    registerAnimationMixer,
    unregisterAnimationMixer,
    registerRenderPass,
    unregisterRenderPass,
    enablePostProcessing,
    setCamera
  }

  return {
    canvasRef,
    context
  }
}
