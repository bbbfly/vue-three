import { inject, ref, shallowRef, onMounted, onBeforeUnmount, watch, provide } from 'vue'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import type { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { ThreeContextKey, CSS2DContextKey } from '../core/context'
import type { CSS2DLabelConfig } from '../core/context'

/**
 * CSS2D 渲染器 Composable
 * 管理 CSS2DRenderer 实例生命周期、标签注册与渲染更新
 */
export function useCSS2DRenderer() {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useCSS2DRenderer must be used within a TCanvas component')
  }

  const renderer = shallowRef<CSS2DRenderer | null>(null)
  const labelContainer = ref<HTMLElement | null>(null)

  const labels = shallowRef<Map<CSS2DObject, CSS2DLabelConfig>>(new Map())

  const addLabel = (label: CSS2DObject, config?: CSS2DLabelConfig) => {
    if (config) {
      labels.value.set(label, config)
      applyLabelConfig(label, config)
    }
    ctx.scene.value.add(label)
  }

  const updateLabelConfig = (label: CSS2DObject, config: Partial<CSS2DLabelConfig>) => {
    const existingConfig = labels.value.get(label)
    if (existingConfig) {
      const newConfig = { ...existingConfig, ...config }
      labels.value.set(label, newConfig)
      applyLabelConfig(label, newConfig)
    }
  }

  const removeLabel = (label: CSS2DObject) => {
    labels.value.delete(label)
    ctx.scene.value.remove(label)
  }

  const applyLabelConfig = (label: CSS2DObject, config: CSS2DLabelConfig) => {
    label.position.set(...config.position)

    label.center.set(0.5, 0.5)
    label.element.style.marginLeft = config.offset ? `${config.offset[0]}px` : '0px'
    label.element.style.marginTop = config.offset ? `${config.offset[1]}px` : '0px'

    if (config.className) {
      label.element.className = `css2d-label ${config.className}`
    } else {
      label.element.className = 'css2d-label'
    }

    if (config.style) {
      Object.entries(config.style).forEach(([key, value]) => {
        label.element.style.setProperty(key, value)
      })
    }

    label.element.style.opacity = String(config.opacity ?? 1)
    label.element.style.pointerEvents = 'auto'
    label.element.style.userSelect = 'none'
  }

  const render = () => {
    if (renderer.value && ctx.scene.value && ctx.camera.value) {
      renderer.value.render(ctx.scene.value, ctx.camera.value)
      applyDistanceEffects()
    }
  }

  const applyDistanceEffects = () => {
    if (!ctx.camera.value) return

    labels.value.forEach((config, label) => {
      const distance = label.position.distanceTo(ctx.camera.value!.position)

      let visible = true

      if (config.minDistance !== undefined && distance < config.minDistance) {
        visible = false
      }
      if (config.maxDistance !== undefined && distance > config.maxDistance) {
        visible = false
      }

      label.element.style.display = visible ? '' : 'none'

      if (!visible) return

      if (config.scaleByDistance) {
        const baseScale = config.scaleFactor || 1
        const scale = baseScale * (1 / Math.max(distance * 0.1, 0.5))
        const currentTransform = label.element.style.transform || ''
        label.element.style.transform = `${currentTransform} scale(${scale})`
      }

      if (config.maxDistance !== undefined) {
        const baseOpacity = config.opacity ?? 1
        const distanceOpacity = Math.max(0, 1 - (distance / config.maxDistance) * 0.5)
        label.element.style.opacity = String(baseOpacity * distanceOpacity)
      }
    })
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
    renderer.value = new CSS2DRenderer()
    labelContainer.value = renderer.value.domElement

    labelContainer.value.style.position = 'absolute'
    labelContainer.value.style.top = '0'
    labelContainer.value.style.left = '0'
    labelContainer.value.style.width = '100%'
    labelContainer.value.style.height = '100%'
    labelContainer.value.style.pointerEvents = 'none'
    labelContainer.value.style.overflow = 'hidden'
    labelContainer.value.style.zIndex = '2'

    if (ctx.canvas.value?.parentNode) {
      ctx.canvas.value.parentNode.appendChild(labelContainer.value)
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

    labels.value.forEach((_, label) => {
      ctx.scene.value.remove(label)
    })
    labels.value.clear()

    if (labelContainer.value && labelContainer.value.parentNode) {
      labelContainer.value.parentNode.removeChild(labelContainer.value)
    }

    renderer.value = null
    labelContainer.value = null
  })

  provide(CSS2DContextKey, {
    renderer,
    labelContainer,
    addLabel,
    updateLabelConfig,
    removeLabel
  })

  return {
    renderer,
    labelContainer,
    labels,
    addLabel,
    updateLabelConfig,
    removeLabel,
    render,
    setSize,
    startRenderLoop,
    stopRenderLoop
  }
}
