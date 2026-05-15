import { inject, onMounted, watch } from 'vue'
import { WebGLRenderer, Color, ShadowMapType } from 'three'
import { ThreeContextKey } from '../core/context'
import type { RendererConfig } from '../types'

export interface RendererOptions extends RendererConfig {
  pixelRatio?: number
  autoClear?: boolean
  autoClearColor?: boolean
  autoClearDepth?: boolean
  autoClearStencil?: boolean
}

export function useRenderer(config: RendererOptions = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useRenderer must be used within a TCanvas component')
  }

  let renderer: WebGLRenderer | null = null

  const render = () => {
    if (renderer && ctx.scene && ctx.camera) {
      renderer.render(ctx.scene, ctx.camera)
    }
  }

  const setClearColor = (color: string | number, alpha = 1) => {
    if (renderer) {
      renderer.setClearColor(new Color(color), alpha)
    }
  }

  const setSize = (width: number, height: number) => {
    if (renderer) {
      renderer.setSize(width, height)
    }
  }

  const setPixelRatio = (ratio: number) => {
    if (renderer) {
      renderer.setPixelRatio(ratio)
    }
  }

  const setShadowMap = (enabled: boolean, type?: ShadowMapType) => {
    if (renderer) {
      renderer.shadowMap.enabled = enabled
      if (type !== undefined) {
        renderer.shadowMap.type = type
      }
    }
  }

  const updateConfig = (newConfig: RendererOptions) => {
    if (!renderer) return

    if (newConfig.clearColor !== undefined) {
      setClearColor(newConfig.clearColor, newConfig.clearAlpha ?? 1)
    }

    if (newConfig.shadowMap !== undefined) {
      setShadowMap(
        newConfig.shadowMap.enabled,
        newConfig.shadowMap.type as ShadowMapType | undefined
      )
    }

    if (newConfig.pixelRatio !== undefined) {
      setPixelRatio(newConfig.pixelRatio)
    }

    if (newConfig.autoClear !== undefined) {
      renderer.autoClear = newConfig.autoClear
    }

    if (newConfig.autoClearColor !== undefined) {
      renderer.autoClearColor = newConfig.autoClearColor
    }

    if (newConfig.autoClearDepth !== undefined) {
      renderer.autoClearDepth = newConfig.autoClearDepth
    }

    if (newConfig.autoClearStencil !== undefined) {
      renderer.autoClearStencil = newConfig.autoClearStencil
    }
  }

  onMounted(() => {
    renderer = ctx.renderer

    if (Object.keys(config).length > 0) {
      updateConfig(config)
    }
  })

  // 监听 renderer 变化（响应式 context 更新）
  watch(
    () => ctx.renderer,
    (newRenderer) => {
      renderer = newRenderer
      if (renderer && Object.keys(config).length > 0) {
        updateConfig(config)
      }
    }
  )

  watch(
    () => config,
    newConfig => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  return {
    renderer,
    render,
    setClearColor,
    setSize,
    setPixelRatio,
    setShadowMap
  }
}
