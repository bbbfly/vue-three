import { inject, shallowRef, onMounted, watch } from 'vue'
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

  const renderer = shallowRef<WebGLRenderer | null>(null)

  const render = () => {
    if (renderer.value && ctx.scene.value && ctx.camera.value) {
      renderer.value.render(ctx.scene.value, ctx.camera.value)
    }
  }

  const setClearColor = (color: string | number, alpha = 1) => {
    if (renderer.value) {
      renderer.value.setClearColor(new Color(color), alpha)
    }
  }

  const setSize = (width: number, height: number) => {
    if (renderer.value) {
      renderer.value.setSize(width, height)
    }
  }

  const setPixelRatio = (ratio: number) => {
    if (renderer.value) {
      renderer.value.setPixelRatio(ratio)
    }
  }

  const setShadowMap = (enabled: boolean, type?: ShadowMapType) => {
    if (renderer.value) {
      renderer.value.shadowMap.enabled = enabled
      if (type !== undefined) {
        renderer.value.shadowMap.type = type
      }
    }
  }

  const updateConfig = (newConfig: RendererOptions) => {
    if (!renderer.value) return

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
      renderer.value.autoClear = newConfig.autoClear
    }

    if (newConfig.autoClearColor !== undefined) {
      renderer.value.autoClearColor = newConfig.autoClearColor
    }

    if (newConfig.autoClearDepth !== undefined) {
      renderer.value.autoClearDepth = newConfig.autoClearDepth
    }

    if (newConfig.autoClearStencil !== undefined) {
      renderer.value.autoClearStencil = newConfig.autoClearStencil
    }
  }

  onMounted(() => {
    renderer.value = ctx.renderer.value

    if (Object.keys(config).length > 0) {
      updateConfig(config)
    }
  })

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
