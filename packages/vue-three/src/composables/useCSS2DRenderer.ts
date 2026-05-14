import { inject, onBeforeUnmount, watch, provide } from 'vue'
import { Scene } from 'three'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import type { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { ThreeContextKey, CSS2DContextKey } from '../core/context'
import type { CSS2DLabelConfig } from '../core/context'

export function useCSS2DRenderer() {
  const ctx = inject(ThreeContextKey)
  if (!ctx) {
    throw new Error('useCSS2DRenderer must be used within a TCanvas component')
  }

  // 使用普通变量存储 Three.js 对象
  let renderer: CSS2DRenderer = new CSS2DRenderer()
  const labelContainer = renderer.domElement

  // 创建独立的 CSS2D 场景
  const scene = new Scene()

  const labels = new Map<CSS2DObject, CSS2DLabelConfig>()

  const addLabel = (label: CSS2DObject, config?: CSS2DLabelConfig) => {
    if (config) {
      labels.set(label, config)
      applyLabelConfig(label, config)
    }
    // 添加到 CSS2D 独立场景
    scene.add(label)
  }

  const updateLabelConfig = (label: CSS2DObject, config: Partial<CSS2DLabelConfig>) => {
    const existingConfig = labels.get(label)
    if (existingConfig) {
      const newConfig = { ...existingConfig, ...config }
      labels.set(label, newConfig)
      applyLabelConfig(label, newConfig)
    }
  }

  const removeLabel = (label: CSS2DObject) => {
    labels.delete(label)
    scene.remove(label)
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

  const applyDistanceEffects = () => {
    if (!ctx.camera) return

    labels.forEach((config, label) => {
      const distance = label.position.distanceTo(ctx.camera.position)

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
    if (renderer) {
      renderer.setSize(width, height)
    }
  }
  ctx.ready(({ canvas }) => {
    labelContainer.style.position = 'absolute'
    labelContainer.style.top = '0'
    labelContainer.style.left = '0'
    labelContainer.style.width = '100%'
    labelContainer.style.height = '100%'
    labelContainer.style.pointerEvents = 'none'
    labelContainer.style.overflow = 'hidden'
    labelContainer.style.zIndex = '2'

    const { width, height } = canvas.getBoundingClientRect()
    canvas.parentNode.appendChild(labelContainer)

    setSize(width, height)
    // 注册场景和渲染器到 ThreeContext
    ctx.registerScene('css2d', scene)
    ctx.registerRenderer('css2d', renderer)
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
    ctx.unregisterScene('css2d')
    ctx.unregisterRenderer('css2d')

    labels.forEach((_, label) => {
      scene.remove(label)
    })
    labels.clear()

    if (labelContainer && labelContainer.parentNode) {
      labelContainer.parentNode.removeChild(labelContainer)
    }
  })

  // 距离效果需要在每次渲染后调用，通过全局渲染循环调度
  const renderComplete = () => {
    applyDistanceEffects()
  }

  provide(CSS2DContextKey, {
    renderer,
    labelContainer,
    scene,
    addLabel,
    updateLabelConfig,
    removeLabel
  })

  return {
    renderer,
    labelContainer,
    scene,
    labels,
    addLabel,
    updateLabelConfig,
    removeLabel,
    setSize,
    renderComplete
  }
}
