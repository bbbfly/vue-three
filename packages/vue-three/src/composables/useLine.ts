import { inject, onBeforeUnmount, watch, provide } from 'vue'
import * as THREE from 'three'
import {
  Line,
  LineLoop,
  LineSegments,
  LineBasicMaterial,
  LineDashedMaterial,
  BufferGeometry
} from 'three'
import { ThreeContextKey, GroupContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { LineConfig, LineLoopConfig, LineDashedConfig, LineSegmentsConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export const LineContextKey = Symbol('line')

export function useLine(config?: LineConfig) {
  const ctx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useLine must be used within a TCanvas component')
  }

  // 使用普通变量存储
  let line: Line = config
    ? ThreeObjectFactory.createLine(config)
    : ThreeObjectFactory.createLine({
        curve: { type: 'arc' },
        color: 0xffffff
      })

  // 直接获取 parent
  const parent = groupCtx?.group || ctx.scene
  parent.add(line)

  function updateLine(newConfig: LineConfig) {
    parent.remove(line)
    disposeObject3D(line)
    line = ThreeObjectFactory.createLine(newConfig)
    parent.add(line)
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
    parent.remove(line)
    disposeObject3D(line)
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
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useLineLoop must be used within a TCanvas component')
  }

  // 使用普通变量存储
  let lineLoop: LineLoop = config
    ? ThreeObjectFactory.createLineLoop(config)
    : ThreeObjectFactory.createLineLoop({
        curve: { type: 'arc' },
        color: 0xffffff
      })

  // 直接获取 parent
  const parent = groupCtx?.group || ctx.scene
  parent.add(lineLoop)

  function updateLineLoop(newConfig: LineLoopConfig) {
    parent.remove(lineLoop)
    disposeObject3D(lineLoop)
    lineLoop = ThreeObjectFactory.createLineLoop(newConfig)
    parent.add(lineLoop)
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
    parent.remove(lineLoop)
    disposeObject3D(lineLoop)
  })

  return {
    lineLoop,
    updateLineLoop
  }
}

export function useLineDashed(config?: LineDashedConfig) {
  const ctx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useLineDashed must be used within a TCanvas component')
  }

  // 使用普通变量存储
  let line: Line = config
    ? ThreeObjectFactory.createLineDashed(config)
    : ThreeObjectFactory.createLineDashed({
        curve: { type: 'arc' },
        color: 0xffffff,
        dashSize: 1,
        gapSize: 1
      })

  // 直接获取 parent
  const parent = groupCtx?.group || ctx.scene
  parent.add(line)

  function updateLineDashed(newConfig: LineDashedConfig) {
    parent.remove(line)
    disposeObject3D(line)
    line = ThreeObjectFactory.createLineDashed(newConfig)
    parent.add(line)
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
    parent.remove(line)
    disposeObject3D(line)
  })

  return {
    line,
    updateLineDashed
  }
}

export function useLineSegments(config?: LineSegmentsConfig) {
  const ctx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useLineSegments must be used within a TCanvas component')
  }

  // 使用普通变量存储
  let lineSegments: LineSegments = config
    ? ThreeObjectFactory.createLineSegments(config)
    : ThreeObjectFactory.createLineSegments({
        geometry: new THREE.BufferGeometry(),
        color: 0xffffff
      })

  // 直接获取 parent
  const parent = groupCtx?.group || ctx.scene
  parent.add(lineSegments)

  function updateLineSegments(newConfig: LineSegmentsConfig) {
    parent.remove(lineSegments)
    disposeObject3D(lineSegments)
    lineSegments = ThreeObjectFactory.createLineSegments(newConfig)
    parent.add(lineSegments)
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
    parent.remove(lineSegments)
    disposeObject3D(lineSegments)
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
  // 使用普通变量存储
  let material: LineBasicMaterial | LineDashedMaterial = createLineMaterial(config)

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
    material.dispose()
    material = createLineMaterial(newConfig)
  }

  onBeforeUnmount(() => {
    material.dispose()
  })

  return {
    material,
    updateMaterial
  }
}
