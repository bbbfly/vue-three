import { inject, onBeforeUnmount, watch } from 'vue'
import { toValue } from 'vue'
import type { MaybeRef } from 'vue'
import { EffectComposerContextKey, ThreeContextKey } from '../core/context'
import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass.js'

export interface TAARenderPassConfig {
  sampleLevel?: number
  unbiased?: boolean
}

export function useTAARenderPass(config: MaybeRef<TAARenderPassConfig> = {}) {
  const composerCtx = inject(EffectComposerContextKey)
  const threeCtx = inject(ThreeContextKey)

  if (!composerCtx) {
    throw new Error('useTAARenderPass must be used within a TEffectComposer component')
  }

  if (!threeCtx) {
    throw new Error('useTAARenderPass must be used within a TCanvas component')
  }

  let taaRenderPass: TAARenderPass | null = null

  const updateConfig = (newConfig: TAARenderPassConfig) => {
    if (!taaRenderPass) return

    if (newConfig.sampleLevel !== undefined) {
      taaRenderPass.sampleLevel = newConfig.sampleLevel
    }
    if (newConfig.unbiased !== undefined) {
      taaRenderPass.unbiased = newConfig.unbiased
    }
  }

  const init = () => {
    const pass = new TAARenderPass(threeCtx.scene, threeCtx.camera)
    pass.sampleLevel = 2
    pass.unbiased = true
    taaRenderPass = pass
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
    if (taaRenderPass) {
      composerCtx.removePass(taaRenderPass)
      taaRenderPass = null
    }
  })

  return {
    taaRenderPass
  }
}
