import { inject, onBeforeUnmount, watch } from 'vue'
import { toValue, type MaybeRef } from 'vue'
import type { Object3D, Color } from 'three'
import { EffectComposerContextKey, ThreeContextKey } from '../core/context'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { Vector2, Color as ThreeColor } from 'three'

export interface OutlinePassConfig {
  edgeStrength?: number
  edgeGlow?: number
  edgeThickness?: number
  pulsePeriod?: number
  visibleEdgeColor?: string | number | Color
  hiddenEdgeColor?: string | number | Color
  selectedObjects?: Object3D[]
}

export function useOutlinePass(config: MaybeRef<OutlinePassConfig> = {}) {
  const composerCtx = inject(EffectComposerContextKey)
  const threeCtx = inject(ThreeContextKey)

  if (!composerCtx) {
    throw new Error('useOutlinePass must be used within a TEffectComposer component')
  }

  if (!threeCtx) {
    throw new Error('useOutlinePass must be used within a TCanvas component')
  }

  let outlinePass: OutlinePass | null = null

  const updateConfig = (newConfig: OutlinePassConfig) => {
    if (!outlinePass) return

    if (newConfig.edgeStrength !== undefined) {
      outlinePass.edgeStrength = newConfig.edgeStrength
    }
    if (newConfig.edgeGlow !== undefined) {
      outlinePass.edgeGlow = newConfig.edgeGlow
    }
    if (newConfig.edgeThickness !== undefined) {
      outlinePass.edgeThickness = newConfig.edgeThickness
    }
    if (newConfig.pulsePeriod !== undefined) {
      outlinePass.pulsePeriod = newConfig.pulsePeriod
    }
    if (newConfig.visibleEdgeColor !== undefined) {
      outlinePass.visibleEdgeColor = new ThreeColor(newConfig.visibleEdgeColor)
    }
    if (newConfig.hiddenEdgeColor !== undefined) {
      outlinePass.hiddenEdgeColor = new ThreeColor(newConfig.hiddenEdgeColor)
    }
    if (newConfig.selectedObjects !== undefined) {
      outlinePass.selectedObjects = newConfig.selectedObjects
    }
  }

  const init = () => {
    const { scene, camera, size } = threeCtx

    const pass = new OutlinePass(
      new Vector2(size.width, size.height),
      scene,
      camera
    )

    pass.edgeStrength = 3
    pass.edgeGlow = 0
    pass.edgeThickness = 1
    pass.pulsePeriod = 0
    pass.visibleEdgeColor = new ThreeColor(0xffffff)
    pass.hiddenEdgeColor = new ThreeColor(0x190a05)
    pass.selectedObjects = []

    outlinePass = pass
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
    if (outlinePass) {
      composerCtx.removePass(outlinePass)
      outlinePass = null
    }
  })

  return {
    outlinePass
  }
}
