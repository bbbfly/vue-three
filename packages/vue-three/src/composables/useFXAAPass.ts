import { inject, onBeforeUnmount, watch } from 'vue'
import { toValue } from 'vue'
import type { MaybeRef } from 'vue'
import { EffectComposerContextKey, ThreeContextKey } from '../core/context'
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js'

export interface FXAAPassConfig {
  resolution?: [number, number]
}

export function useFXAAPass(config: MaybeRef<FXAAPassConfig> = {}) {
  const composerCtx = inject(EffectComposerContextKey)
  const threeCtx = inject(ThreeContextKey)

  if (!composerCtx) {
    throw new Error('useFXAAPass must be used within a TEffectComposer component')
  }

  if (!threeCtx) {
    throw new Error('useFXAAPass must be used within a TCanvas component')
  }

  let fxaaPass: FXAAPass | null = null

  const updateConfig = (newConfig: FXAAPassConfig) => {
    if (!fxaaPass) return

    if (newConfig.resolution !== undefined) {
      fxaaPass.resolution.set(newConfig.resolution[0], newConfig.resolution[1])
    }
  }

  const init = () => {
    const pass = new FXAAPass()
    fxaaPass = pass
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
    if (fxaaPass) {
      composerCtx.removePass(fxaaPass)
      fxaaPass = null
    }
  })

  return {
    fxaaPass
  }
}
