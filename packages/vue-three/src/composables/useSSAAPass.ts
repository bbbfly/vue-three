import { inject, onBeforeUnmount, watch } from 'vue'
import { shallowRef, toValue } from 'vue'
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

  const ssaaPass = shallowRef<SSAARenderPass | null>(null)

  const updateConfig = (newConfig: SSAAPassConfig) => {
    if (!ssaaPass.value) return

    if (newConfig.sampleLevel !== undefined) {
      ssaaPass.value.sampleLevel = newConfig.sampleLevel
    }
    if (newConfig.unbiased !== undefined) {
      ssaaPass.value.unbiased = newConfig.unbiased
    }
  }

  const init = () => {
    const pass = new SSAARenderPass(threeCtx.scene.value, threeCtx.camera.value)
    pass.sampleLevel = 2
    pass.unbiased = true
    ssaaPass.value = pass
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
    if (ssaaPass.value) {
      composerCtx.removePass(ssaaPass.value)
      ssaaPass.value = null
    }
  })

  return {
    ssaaPass
  }
}
