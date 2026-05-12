import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
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
type AnimateFn = ({ scene, camera, delta }: { scene: Scene; camera: Camera; delta: number }) => void
export function useCanvas(options: CanvasOptions = {}, animateFn: AnimateFn) {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const renderer = shallowRef<WebGLRenderer | null>(null)
  const scene = shallowRef<Scene>(new Scene())
  const size = ref({
    width: options.width || 300,
    height: options.height || 150
  })

  const camera = shallowRef<Camera>(
    new PerspectiveCamera(
      options.camera?.fov || 75,
      size.value.width / size.value.height,
      options.camera?.near || 0.1,
      options.camera?.far || 1000
    )
  )

  const controls = shallowRef<OrbitControls | null>(null)
  const composer = shallowRef<EffectComposer | null>(null)

  let animationFrameId: number | null = null
  const animationMixers = new Set<AnimationMixer>()
  const renderPasses = new Set<Pass>()
  const clock = new Clock()
  let postProcessingEnabled = false

  // 场景注册表 - 支持多场景渲染
  const scenes = shallowRef<Map<string, Scene>>(new Map([['main', scene.value]]))

  // 渲染器注册表 - 支持多渲染器
  const renderers = shallowRef<Map<string, THREE.Renderer>>(new Map())

  const registerAnimationMixer = (mixer: AnimationMixer) => {
    animationMixers.add(mixer)
  }

  const unregisterAnimationMixer = (mixer: AnimationMixer) => {
    animationMixers.delete(mixer)
  }

  const registerRenderPass = (pass: Pass) => {
    renderPasses.add(pass)
    if (composer.value) {
      composer.value.addPass(pass)
    }
  }

  const unregisterRenderPass = (pass: Pass) => {
    renderPasses.delete(pass)
    if (composer.value) {
      const passes = composer.value.passes
      const index = passes.indexOf(pass)
      if (index > -1) {
        passes.splice(index, 1)
      }
      pass.dispose()
    }
  }

  // 场景注册表方法
  const registerScene = (name: string, sceneInstance: Scene) => {
    scenes.value.set(name, sceneInstance)
  }

  const getScene = (name: string) => scenes.value.get(name)

  const unregisterScene = (name: string) => {
    scenes.value.delete(name)
  }

  // 渲染器注册表方法
  const registerRenderer = (name: string, rendererInstance: THREE.Renderer) => {
    renderers.value.set(name, rendererInstance)
  }

  const getRenderer = (name: string) => renderers.value.get(name)

  const unregisterRenderer = (name: string) => {
    renderers.value.delete(name)
  }

  const enablePostProcessing = () => {
    if (postProcessingEnabled || !renderer.value) return

    postProcessingEnabled = true

    composer.value = new EffectComposer(renderer.value)

    const renderPass = new RenderPass(scene.value, camera.value)
    composer.value.addPass(renderPass)

    renderPasses.forEach(pass => {
      composer.value!.addPass(pass)
    })

    handleResize()
  }

  if (options.clearColor !== undefined) {
    scene.value.background = new Color(options.clearColor)
  }

  const cameraPos = options.camera?.position || [0, 0, 5]
  camera.value.position.set(...cameraPos)

  const setCamera = (newCamera: Camera) => {
    camera.value = newCamera

    // 同步更新 OrbitControls 的相机引用
    if (controls.value) {
      controls.value.object = newCamera
    }

    // 同步更新 EffectComposer 的 RenderPass 相机引用
    if (composer.value) {
      const passes = composer.value.passes
      const renderPass = passes.find(p => (p as any).camera)
      if (renderPass) {
        ;(renderPass as any).camera = newCamera
      }
    }

    // 立即执行一次 resize 让新相机适配画布尺寸
    handleResize()
  }

  const renderAll = (delta: number) => {
    if (!renderer.value || !camera.value) return

    // 1. 渲染 WebGL 主场景
    if (options.autoClear !== false) {
      renderer.value.clear()
    }

    if (postProcessingEnabled && composer.value) {
      composer.value.render(delta)
    } else {
      renderer.value.render(scene.value, camera.value)
    }

    // 2. 渲染其他注册的场景（CSS3D, CSS2D 等）
    renderers.value.forEach((customRenderer, name) => {
      const customScene = scenes.value.get(name)
      if (customScene) {
        customRenderer.render(customScene, camera.value)
      }
    })
  }

  const startRenderLoop = () => {
    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      const delta = clock.getDelta()
      animateFn({ scene: scene.value, camera: camera.value, delta })

      animationMixers.forEach(mixer => {
        mixer.update(delta)
      })

      // 统一更新所有控制器（OrbitControls、FirstPersonControls、FlyControls 等）
      if (controls.value && (controls.value as any).update) {
        ;(controls.value as any).update(delta)
      }

      // 统一渲染调度
      renderAll(delta)
    }

    render()
  }

  let resizeObserver: ResizeObserver | null = null

  const handleResize = () => {
    if (!camera.value || !renderer.value || !canvasRef.value) return

    const container = canvasRef.value.parentElement || canvasRef.value
    const newWidth = options.width || container.clientWidth || 300
    const newHeight = options.height || container.clientHeight || 150

    size.value = { width: newWidth, height: newHeight }
    canvasRef.value.style.width = newWidth + 'px'
    canvasRef.value.style.height = newHeight + 'px'
    canvasRef.value.width = newWidth
    canvasRef.value.height = newHeight

    const perspectiveCamera = camera.value as PerspectiveCamera
    if (perspectiveCamera.aspect !== undefined) {
      perspectiveCamera.aspect = newWidth / newHeight
      perspectiveCamera.updateProjectionMatrix()
    }

    renderer.value.setSize(newWidth, newHeight, false)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if (composer.value) {
      composer.value.setSize(newWidth, newHeight)
      composer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
  }

  onMounted(() => {
    if (!canvasRef.value) return

    renderer.value = new WebGLRenderer({
      canvas: canvasRef.value,
      antialias: options.antialias !== false,
      alpha: options.alpha || false
    })

    handleResize()

    if (options.clearColor !== undefined) {
      renderer.value.setClearColor(new Color(options.clearColor), options.clearAlpha ?? 1)
    }

    if (options.shadowMap) {
      renderer.value.shadowMap.enabled =
        options.shadowMap === true || (options.shadowMap as any).enabled === true
      if (typeof options.shadowMap === 'object' && options.shadowMap.type) {
        renderer.value.shadowMap.type = options.shadowMap.type as any
      }
    }

    if (options.enableControls !== false) {
      controls.value = new OrbitControls(camera.value, renderer.value.domElement)
      controls.value.enableDamping = true
      controls.value.dampingFactor = 0.05
    }

    if (!options.width || !options.height) {
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      const observeTarget = canvasRef.value.parentElement || canvasRef.value
      resizeObserver.observe(observeTarget)
    }

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

    if (controls.value) {
      controls.value.dispose()
    }

    if (scene.value) {
      while (scene.value.children.length > 0) {
        const child = scene.value.children[0]
        disposeObject3D(child, false)
        scene.value.remove(child)
      }
    }

    if (renderer.value) {
      renderer.value.dispose()
      renderer.value.forceContextLoss()
    }

    canvasRef.value = null
    renderer.value = null
    controls.value = null
  })

  const context = {
    renderer,
    scene,
    camera,
    controls,
    canvas: canvasRef,
    size,
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
