import { inject, onBeforeUnmount, watch } from 'vue'
import { toValue } from 'vue'
import type { MaybeRef } from 'vue'
import { EffectComposerContextKey } from '../core/context'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import type { ShaderMaterial } from 'three'

export interface ShaderPassConfig {
  shader?: ShaderMaterial
  uniforms?: Record<string, { value: unknown }>
}

export function useShaderPass(config: MaybeRef<ShaderPassConfig> = {}) {
  const composerCtx = inject(EffectComposerContextKey)

  if (!composerCtx) {
    throw new Error('useShaderPass must be used within a TEffectComposer component')
  }

  let shaderPass: ShaderPass | null = null

  const updateConfig = (newConfig: ShaderPassConfig) => {
    if (!shaderPass) return

    if (newConfig.uniforms !== undefined && shaderPass.uniforms) {
      Object.entries(newConfig.uniforms).forEach(([key, value]) => {
        if (shaderPass!.uniforms[key]) {
          shaderPass!.uniforms[key].value = value.value
        }
      })
    }
  }

  const init = () => {
    const resolvedConfig = toValue(config)
    const pass = new ShaderPass(resolvedConfig.shader || ({} as ShaderMaterial))
    shaderPass = pass
    composerCtx.addPass(pass)
    updateConfig(resolvedConfig)
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
    if (shaderPass) {
      composerCtx.removePass(shaderPass)
      shaderPass = null
    }
  })

  return {
    shaderPass
  }
}
