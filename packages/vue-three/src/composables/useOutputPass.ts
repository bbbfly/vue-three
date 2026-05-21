import { inject, onBeforeUnmount } from 'vue'
import { EffectComposerContextKey } from '../core/context'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export interface OutputPassConfig {
  resolutionScale?: number
}

export function useOutputPass(config: OutputPassConfig = {}) {
  const composerCtx = inject(EffectComposerContextKey)

  if (!composerCtx) {
    throw new Error('useOutputPass must be used within a TEffectComposer component')
  }

  let outputPass: OutputPass | null = null

  const init = () => {
    const pass = new OutputPass()
    if (config.resolutionScale !== undefined) {
      pass.resolutionScale = config.resolutionScale
    }
    outputPass = pass
    composerCtx.addPass(pass)
  }

  init()

  onBeforeUnmount(() => {
    if (outputPass) {
      composerCtx.removePass(outputPass)
      outputPass = null
    }
  })

  return {
    outputPass
  }
}