import { inject, onBeforeUnmount, watch, provide } from 'vue'
import { Scene } from 'three'
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
import type { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import { ThreeContextKey, CSS3DContextKey } from '../core/context'
import type { CSS3DObjectConfig } from '../core/context'

export function useCSS3DRenderer() {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useCSS3DRenderer must be used within a TCanvas component')
  }

  // 使用普通变量存储 Three.js 对象，在组件初始化时创建
  let renderer: CSS3DRenderer = new CSS3DRenderer()
  const container = renderer.domElement

  // 创建独立的 CSS3D 场景
  const scene = new Scene()

  const objects = new Map<CSS3DObject, CSS3DObjectConfig>()

  const addObject = (object: CSS3DObject, config?: CSS3DObjectConfig) => {
    if (config) {
      objects.set(object, config)
      applyObjectConfig(object, config)
    }
    // 添加到 CSS3D 独立场景
    scene.add(object)
  }

  const removeObject = (object: CSS3DObject) => {
    objects.delete(object)
    scene.remove(object)
  }

  const applyObjectConfig = (object: CSS3DObject, config: CSS3DObjectConfig) => {
    object.position.set(...config.position)

    if (config.rotation) {
      object.rotation.set(...config.rotation)
    }

    if (config.scale) {
      object.scale.set(...config.scale)
    }

    const el = object.element

    if (config.className) {
      el.className = `css3d-object ${config.className}`
    } else {
      el.className = 'css3d-object'
    }

    if (config.style) {
      Object.entries(config.style).forEach(([key, value]) => {
        el.style.setProperty(key, value)
      })
    }
  }

  const setSize = (width: number, height: number) => {
    if (renderer) {
      renderer.setSize(width, height)
    }
  }

  // 使用 ctx.ready() 确保 canvas 已准备好再进行 DOM 操作
  ctx.ready(({ canvas, size }) => {
    container.style.position = 'absolute'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.pointerEvents = 'none'
    container.style.overflow = 'hidden'
    container.style.zIndex = '2'

    canvas.parentNode?.appendChild(container)
    setSize(size.width, size.height)
    // 注册场景和渲染器到 ThreeContext
    ctx.registerScene('css3d', scene)
    ctx.registerRenderer('css3d', renderer)
  })

  watch(
    () => ctx.size,
    size => {
      setSize(size.width, size.height)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    // 取消注册场景和渲染器
    ctx.unregisterScene('css3d')
    ctx.unregisterRenderer('css3d')

    objects.forEach((_, object) => {
      scene.remove(object)
    })
    objects.clear()

    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  provide(CSS3DContextKey, {
    renderer,
    container,
    scene,
    addObject,
    removeObject
  })

  return {
    renderer,
    container,
    scene,
    objects,
    addObject,
    removeObject,
    setSize
  }
}
