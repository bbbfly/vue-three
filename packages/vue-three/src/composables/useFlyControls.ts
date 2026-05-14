import { inject, onBeforeUnmount, watch } from 'vue'
import { FlyControls } from 'three/addons/controls/FlyControls.js'
import { ThreeContextKey } from '../core/context'
import type { FlyControlsConfig } from '../types'

export function useFlyControls(config: FlyControlsConfig = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useFlyControls must be used within a TCanvas component')
  }

  let controls: FlyControls | null = null

  const update = (delta: number) => {
    if (controls) {
      controls.update(delta)
    }
  }

  const dispose = () => {
    if (controls) {
      controls.dispose()
    }
  }

  const updateConfig = (newConfig: FlyControlsConfig) => {
    if (!controls) return

    if (newConfig.movementSpeed !== undefined) {
      controls.movementSpeed = newConfig.movementSpeed
    }

    if (newConfig.rollSpeed !== undefined) {
      controls.rollSpeed = newConfig.rollSpeed
    }

    if (newConfig.dragToLook !== undefined) {
      controls.dragToLook = newConfig.dragToLook
    }

    if (newConfig.autoForward !== undefined) {
      controls.autoForward = newConfig.autoForward
    }
  }

  const stopWatch = watch(
    [() => ctx.renderer, () => ctx.camera],
    ([renderer, camera]) => {
      if (!renderer || !camera) return
      if (controls) return

      const flyControls = new FlyControls(camera, renderer.domElement)
      controls = flyControls

      if (Object.keys(config).length > 0) {
        updateConfig(config)
      }

      ctx.controls = flyControls
      stopWatch()
    }
  )

  watch(
    () => config,
    newConfig => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    stopWatch()
    dispose()
  })

  return {
    controls,
    update,
    dispose,
    updateConfig
  }
}
