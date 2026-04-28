import { inject, onBeforeUnmount } from 'vue'
import { ThreeContextKey } from '../core/context'
import type { Pass } from 'three/addons/postprocessing/Pass.js'

export function useRenderPipeline() {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useRenderPipeline must be used within a TCanvas component')
  }

  const addPass = (pass: Pass) => {
    ctx.enablePostProcessing()
    ctx.registerRenderPass(pass)
  }

  const removePass = (pass: Pass) => {
    ctx.unregisterRenderPass(pass)
  }

  const enable = () => {
    ctx.enablePostProcessing()
  }

  onBeforeUnmount(() => {})

  return {
    composer: ctx.composer,
    addPass,
    removePass,
    enable
  }
}
