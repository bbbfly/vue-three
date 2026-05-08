import { inject, ref, shallowRef, onMounted, onBeforeUnmount, watch, provide } from 'vue'
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

  const renderer = shallowRef<CSS3DRenderer | null>(null)
  const container = ref<HTMLElement | null>(null)

  // 创建独立的 CSS3D 场景
  const scene = shallowRef<Scene>(new Scene())

  const objects = shallowRef<Map<CSS3DObject, CSS3DObjectConfig>>(new Map())

  const addObject = (object: CSS3DObject, config?: CSS3DObjectConfig) => {
    if (config) {
      objects.value.set(object, config)
      applyObjectConfig(object, config)
    }
    // 添加到 CSS3D 独立场景
    scene.value.add(object)
  }

  const removeObject = (object: CSS3DObject) => {
    objects.value.delete(object)
    scene.value.remove(object)
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
    if (renderer.value) {
      console.log(width, height, '---')
      renderer.value.setSize(width, height)
    }
  }

  renderer.value = new CSS3DRenderer()
  container.value = renderer.value.domElement

  container.value.style.position = 'absolute'
  container.value.style.top = '0'
  container.value.style.left = '0'
  container.value.style.width = '100%'
  container.value.style.height = '100%'
  container.value.style.pointerEvents = 'none'
  container.value.style.overflow = 'hidden'
  // 注册场景和渲染器到 ThreeContext
  ctx.registerScene('css3d', scene.value)
  ctx.registerRenderer('css3d', renderer.value)
  onMounted(() => {
    // container.value.style.zIndex = '2'
    setSize(ctx.size.value.width, ctx.size.value.height)
    console.log(ctx.canvas.value?.parentNode, 'useCSS3DRenderer')
    if (ctx.canvas.value?.parentNode) {
      ctx.canvas.value.parentNode.appendChild(container.value)
    }
  })

  watch(
    () => ctx.size.value,
    size => {
      setSize(size.width, size.height)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    // 取消注册场景和渲染器
    ctx.unregisterScene('css3d')
    ctx.unregisterRenderer('css3d')

    objects.value.forEach((_, object) => {
      scene.value.remove(object)
    })
    objects.value.clear()

    if (container.value && container.value.parentNode) {
      container.value.parentNode.removeChild(container.value)
    }

    renderer.value = null
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
