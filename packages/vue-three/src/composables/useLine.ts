import { inject, shallowRef, onBeforeUnmount, watch, provide } from 'vue'
import * as THREE from 'three'
import {
  Line,
  LineLoop,
  LineSegments,
  LineBasicMaterial,
  LineDashedMaterial,
  BufferGeometry
} from 'three'
import { ThreeContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { LineConfig, LineLoopConfig, LineDashedConfig, LineSegmentsConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export const LineContextKey = Symbol('line')

export function useLine(config?: LineConfig) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useLine must be used within a TCanvas component')
  }

  const line = shallowRef<Line>(
    config
      ? ThreeObjectFactory.createLine(config)
      : ThreeObjectFactory.createLine({
          curve: { type: 'arc' },
          color: 0xffffff
        })
  )

  if (ctx.scene.value) {
    ctx.scene.value.add(line.value)
  }

  function updateLine(newConfig: LineConfig) {
    if (ctx.scene.value) {
      ctx.scene.value.remove(line.value)
    }
    disposeObject3D(line.value)
    line.value = ThreeObjectFactory.createLine(newConfig)
    if (ctx.scene.value) {
      ctx.scene.value.add(line.value)
    }
  }

  if (config) {
    watch(
      () => config,
      newConfig => {
        updateLine(newConfig)
      },
      { deep: true }
    )
  }

  onBeforeUnmount(() => {
    if (ctx.scene.value) {
      ctx.scene.value.remove(line.value)
    }
    disposeObject3D(line.value)
  })

  provide(LineContextKey, {
    line,
    updateLine
  })

  return {
    line,
    updateLine
  }
}

export function useLineLoop(config?: LineLoopConfig) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useLineLoop must be used within a TCanvas component')
  }

  const lineLoop = shallowRef<LineLoop>(
    config
      ? ThreeObjectFactory.createLineLoop(config)
      : ThreeObjectFactory.createLineLoop({
          curve: { type: 'arc' },
          color: 0xffffff
        })
  )

  if (ctx.scene.value) {
    ctx.scene.value.add(lineLoop.value)
  }

  function updateLineLoop(newConfig: LineLoopConfig) {
    if (ctx.scene.value) {
      ctx.scene.value.remove(lineLoop.value)
    }
    disposeObject3D(lineLoop.value)
    lineLoop.value = ThreeObjectFactory.createLineLoop(newConfig)
    if (ctx.scene.value) {
      ctx.scene.value.add(lineLoop.value)
    }
  }

  if (config) {
    watch(
      () => config,
      newConfig => {
        updateLineLoop(newConfig)
      },
      { deep: true }
    )
  }

  onBeforeUnmount(() => {
    if (ctx.scene.value) {
      ctx.scene.value.remove(lineLoop.value)
    }
    disposeObject3D(lineLoop.value)
  })

  return {
    lineLoop,
    updateLineLoop
  }
}

export function useLineDashed(config?: LineDashedConfig) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useLineDashed must be used within a TCanvas component')
  }

  const line = shallowRef<Line>(
    config
      ? ThreeObjectFactory.createLineDashed(config)
      : ThreeObjectFactory.createLineDashed({
          curve: { type: 'arc' },
          color: 0xffffff,
          dashSize: 1,
          gapSize: 1
        })
  )

  if (ctx.scene.value) {
    ctx.scene.value.add(line.value)
  }

  function updateLineDashed(newConfig: LineDashedConfig) {
    if (ctx.scene.value) {
      ctx.scene.value.remove(line.value)
    }
    disposeObject3D(line.value)
    line.value = ThreeObjectFactory.createLineDashed(newConfig)
    if (ctx.scene.value) {
      ctx.scene.value.add(line.value)
    }
  }

  if (config) {
    watch(
      () => config,
      newConfig => {
        updateLineDashed(newConfig)
      },
      { deep: true }
    )
  }

  onBeforeUnmount(() => {
    if (ctx.scene.value) {
      ctx.scene.value.remove(line.value)
    }
    disposeObject3D(line.value)
  })

  return {
    line,
    updateLineDashed
  }
}

export function useLineSegments(config?: LineSegmentsConfig) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useLineSegments must be used within a TCanvas component')
  }

  const lineSegments = shallowRef<LineSegments>(
    config
      ? ThreeObjectFactory.createLineSegments(config)
      : ThreeObjectFactory.createLineSegments({
          geometry: new THREE.BufferGeometry(),
          color: 0xffffff
        })
  )

  if (ctx.scene.value) {
    ctx.scene.value.add(lineSegments.value)
  }

  function updateLineSegments(newConfig: LineSegmentsConfig) {
    if (ctx.scene.value) {
      ctx.scene.value.remove(lineSegments.value)
    }
    disposeObject3D(lineSegments.value)
    lineSegments.value = ThreeObjectFactory.createLineSegments(newConfig)
    if (ctx.scene.value) {
      ctx.scene.value.add(lineSegments.value)
    }
  }

  if (config) {
    watch(
      () => config,
      newConfig => {
        updateLineSegments(newConfig)
      },
      { deep: true }
    )
  }

  onBeforeUnmount(() => {
    if (ctx.scene.value) {
      ctx.scene.value.remove(lineSegments.value)
    }
    disposeObject3D(lineSegments.value)
  })

  return {
    lineSegments,
    updateLineSegments
  }
}

export function useLineMaterial(config: {
  type: 'basic' | 'dashed'
  color?: string | number
  transparent?: boolean
  opacity?: number
  linewidth?: number
  vertexColors?: boolean
  blending?: number
  depthTest?: boolean
  depthWrite?: boolean
  dashSize?: number
  gapSize?: number
  scale?: number
}) {
  const material = shallowRef<LineBasicMaterial | LineDashedMaterial>(createLineMaterial(config))

  function createLineMaterial(lineMaterialConfig: typeof config) {
    if (lineMaterialConfig.type === 'dashed') {
      return new LineDashedMaterial({
        color: lineMaterialConfig.color || 0xffffff,
        linewidth: lineMaterialConfig.linewidth || 1,
        dashSize: lineMaterialConfig.dashSize || 1,
        gapSize: lineMaterialConfig.gapSize || 1,
        scale: lineMaterialConfig.scale || 1,
        transparent: lineMaterialConfig.transparent || false,
        opacity: lineMaterialConfig.opacity || 1,
        blending: lineMaterialConfig.blending,
        depthTest: lineMaterialConfig.depthTest !== false,
        depthWrite: lineMaterialConfig.depthWrite !== false
      })
    } else {
      return new LineBasicMaterial({
        color: lineMaterialConfig.color || 0xffffff,
        linewidth: lineMaterialConfig.linewidth || 1,
        vertexColors: lineMaterialConfig.vertexColors || false,
        transparent: lineMaterialConfig.transparent || false,
        opacity: lineMaterialConfig.opacity || 1,
        blending: lineMaterialConfig.blending,
        depthTest: lineMaterialConfig.depthTest !== false,
        depthWrite: lineMaterialConfig.depthWrite !== false
      })
    }
  }

  function updateMaterial(newConfig: typeof config) {
    material.value.dispose()
    material.value = createLineMaterial(newConfig)
  }

  onBeforeUnmount(() => {
    material.value.dispose()
  })

  return {
    material,
    updateMaterial
  }
}
