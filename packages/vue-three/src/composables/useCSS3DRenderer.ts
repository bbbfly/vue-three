import { inject, ref, shallowRef, onMounted, onBeforeUnmount, watch, provide } from 'vue'
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
import type { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import { ThreeContextKey, CSS3DContextKey } from '../core/context'
import type { CSS3DObjectConfig } from '../core/context'

/**
 * CSS3D 渲染器 Composable
 * 管理 CSS3DRenderer 实例生命周期、对象注册与渲染更新
 */
export function useCSS3DRenderer() {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useCSS3DRenderer must be used within a TCanvas component')
  }

  const renderer = shallowRef<CSS3DRenderer | null>(null)
  const container = ref<HTMLElement | null>(null)

  const objects = shallowRef<Map<CSS3DObject, CSS3DObjectConfig>>(new Map())

  const addObject = (object: CSS3DObject, config?: CSS3DObjectConfig) => {
    if (config) {
      objects.value.set(object, config)
      applyObjectConfig(object, config)
    }
    ctx.scene.value.add(object)
  }

  const removeObject = (object: CSS3DObject) => {
    objects.value.delete(object)
    ctx.scene.value.remove(object)
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

  const render = () => {
    if (renderer.value && ctx.scene.value && ctx.camera.value) {
      renderer.value.render(ctx.scene.value, ctx.camera.value)
    }
  }

  const setSize = (width: number, height: number) => {
    if (renderer.value) {
      renderer.value.setSize(width, height)
    }
  }

  let animationFrameId: number | null = null

  const startRenderLoop = () => {
    const animate = () => {
      render()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  const stopRenderLoop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  onMounted(() => {
    renderer.value = new CSS3DRenderer()
    container.value = renderer.value.domElement

    container.value.style.position = 'absolute'
    container.value.style.top = '0'
    container.value.style.left = '0'
    container.value.style.width = '100%'
    container.value.style.height = '100%'
    container.value.style.pointerEvents = 'none'
    container.value.style.overflow = 'hidden'
    container.value.style.zIndex = '2'

    if (ctx.canvas.value?.parentNode) {
      ctx.canvas.value.parentNode.appendChild(container.value)
    }

    setSize(ctx.size.value.width, ctx.size.value.height)

    startRenderLoop()
  })

  watch(
    () => ctx.size.value,
    size => {
      setSize(size.width, size.height)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    stopRenderLoop()

    objects.value.forEach((_, object) => {
      ctx.scene.value.remove(object)
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
    addObject,
    removeObject
  })

  return {
    renderer,
    container,
    objects,
    addObject,
    removeObject,
    render,
    setSize,
    startRenderLoop,
    stopRenderLoop
  }
}