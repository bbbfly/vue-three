import { inject, onBeforeUnmount, watch } from 'vue'
import { toValue } from 'vue'
import type { MaybeRef } from 'vue'
import { EffectComposerContextKey, ThreeContextKey } from '../core/context'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'

export interface RenderPassConfig {
  clear?: boolean
  clearDepth?: boolean
}

export function useRenderPass(config: MaybeRef<RenderPassConfig> = {}) {
  const composerCtx = inject(EffectComposerContextKey)
  const threeCtx = inject(ThreeContextKey)

  if (!composerCtx) {
    throw new Error('useRenderPass must be used within a TEffectComposer component')
  }

  if (!threeCtx) {
    throw new Error('useRenderPass must be used within a TCanvas component')
  }

  let renderPass: RenderPass | null = null

  const updateConfig = (newConfig: RenderPassConfig) => {
    if (!renderPass) return

    if (newConfig.clear !== undefined) {
      renderPass.clear = newConfig.clear
    }
    if (newConfig.clearDepth !== undefined) {
      renderPass.clearDepth = newConfig.clearDepth
    }
  }

  const init = () => {
    const pass = new RenderPass(threeCtx.scene, threeCtx.camera)
    renderPass = pass
    composerCtx.addPass(pass)
    updateConfig(toValue(config))
  }

  init()

  watch(
    () => toValue(config),
    newConfig => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (renderPass) {
      composerCtx.removePass(renderPass)
      renderPass = null
    }
  })

  return {
    renderPass
  }
}
