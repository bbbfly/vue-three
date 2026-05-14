import { inject, ref, onMounted, onBeforeUnmount, watch, provide } from 'vue'
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

  // 使用普通变量存储 Three.js 对象
  let renderer: CSS3DRenderer | null = null
  const container = ref<HTMLElement | null>(null)

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

  onMounted(() => {
    renderer = new CSS3DRenderer()
    container.value = renderer.domElement

    container.value.style.position = 'absolute'
    container.value.style.top = '0'
    container.value.style.left = '0'
    container.value.style.width = '100%'
    container.value.style.height = '100%'
    container.value.style.pointerEvents = 'none'
    container.value.style.overflow = 'hidden'

    // 注册场景和渲染器到 ThreeContext
    ctx.registerScene('css3d', scene)
    ctx.registerRenderer('css3d', renderer)

    setSize(ctx.size.width, ctx.size.height)
    if (ctx.canvas?.parentNode) {
      ctx.canvas.parentNode.appendChild(container.value)
    }
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

    if (container.value && container.value.parentNode) {
      container.value.parentNode.removeChild(container.value)
    }

    renderer = null
    container.value = null
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
