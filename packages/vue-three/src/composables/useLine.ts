import { inject, shallowRef, onBeforeUnmount, watch, provide } from 'vue'
import { Line, LineLoop } from 'three'
import { ThreeContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { LineConfig, LineLoopConfig, LineDashedConfig } from '../types'
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
