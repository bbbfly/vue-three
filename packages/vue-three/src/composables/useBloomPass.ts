import { inject, onBeforeUnmount, watch } from 'vue'
import { shallowRef, toValue } from 'vue'
import type { MaybeRef } from 'vue'
import { EffectComposerContextKey } from '../core/context'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { Vector2 } from 'three'

export interface BloomPassConfig {
  threshold?: number
  strength?: number
  radius?: number
}

export function useBloomPass(config: MaybeRef<BloomPassConfig> = {}) {
  const composerCtx = inject(EffectComposerContextKey)

  if (!composerCtx) {
    throw new Error('useBloomPass must be used within a TEffectComposer component')
  }

  const bloomPass = shallowRef<UnrealBloomPass | null>(null)

  const updateConfig = (newConfig: BloomPassConfig) => {
    if (!bloomPass.value) return

    if (newConfig.threshold !== undefined) {
      bloomPass.value.threshold = newConfig.threshold
    }
    if (newConfig.strength !== undefined) {
      bloomPass.value.strength = newConfig.strength
    }
    if (newConfig.radius !== undefined) {
      bloomPass.value.radius = newConfig.radius
    }
  }

  const init = () => {
    const pass = new UnrealBloomPass(new Vector2(256, 256), 1.5, 0.4, 0.85)
    bloomPass.value = pass
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
    if (bloomPass.value) {
      composerCtx.removePass(bloomPass.value)
      bloomPass.value = null
    }
  })

  return {
    bloomPass
  }
}
