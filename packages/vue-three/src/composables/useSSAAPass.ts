import { inject, onBeforeUnmount, watch } from 'vue'
import { toValue } from 'vue'
import type { MaybeRef } from 'vue'
import { EffectComposerContextKey, ThreeContextKey } from '../core/context'
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js'

export interface SSAAPassConfig {
  sampleLevel?: number
  unbiased?: boolean
}

export function useSSAAPass(config: MaybeRef<SSAAPassConfig> = {}) {
  const composerCtx = inject(EffectComposerContextKey)
  const threeCtx = inject(ThreeContextKey)

  if (!composerCtx) {
    throw new Error('useSSAAPass must be used within a TEffectComposer component')
  }

  if (!threeCtx) {
    throw new Error('useSSAAPass must be used within a TCanvas component')
  }

  let ssaaPass: SSAARenderPass | null = null

  const updateConfig = (newConfig: SSAAPassConfig) => {
    if (!ssaaPass) return

    if (newConfig.sampleLevel !== undefined) {
      ssaaPass.sampleLevel = newConfig.sampleLevel
    }
    if (newConfig.unbiased !== undefined) {
      ssaaPass.unbiased = newConfig.unbiased
    }
  }

  const init = () => {
    const pass = new SSAARenderPass(threeCtx.scene, threeCtx.camera)
    pass.sampleLevel = 2
    pass.unbiased = true
    ssaaPass = pass
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
    if (ssaaPass) {
      composerCtx.removePass(ssaaPass)
      ssaaPass = null
    }
  })

  return {
    ssaaPass
  }
}
