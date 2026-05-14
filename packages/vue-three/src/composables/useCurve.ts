import { inject, onBeforeUnmount, watch, provide } from 'vue'
import { Curve, Vector3 } from 'three'
import { ThreeContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { CurveConfig } from '../types'

export const CurveContextKey = Symbol('curve')

export function useCurve(config?: CurveConfig) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useCurve must be used within a TCanvas component')
  }

  let curve: Curve<Vector3> = config
    ? ThreeObjectFactory.createCurve(config)
    : ThreeObjectFactory.createCurve({ type: 'arc' })

  function updateCurve(newConfig: CurveConfig) {
    curve = ThreeObjectFactory.createCurve(newConfig)
  }

  if (config) {
    watch(
      () => config,
      newConfig => {
        updateCurve(newConfig)
      },
      { deep: true }
    )
  }

  provide(CurveContextKey, {
    curve,
    updateCurve
  })

  return {
    curve,
    updateCurve
  }
}
