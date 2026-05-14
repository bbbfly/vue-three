import { inject, onBeforeUnmount, watch } from 'vue'
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'
import { ThreeContextKey } from '../core/context'
import type { FirstPersonControlsConfig } from '../types'

export function useFirstPersonControls(config: FirstPersonControlsConfig = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useFirstPersonControls must be used within a TCanvas component')
  }

  let controls: FirstPersonControls | null = null

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

  const updateConfig = (newConfig: FirstPersonControlsConfig) => {
    if (!controls) return

    if (newConfig.movementSpeed !== undefined) {
      controls.movementSpeed = newConfig.movementSpeed
    }

    if (newConfig.lookSpeed !== undefined) {
      controls.lookSpeed = newConfig.lookSpeed
    }

    if (newConfig.noFly !== undefined) {
      controls.noFly = newConfig.noFly
    }

    if (newConfig.lookVertical !== undefined) {
      controls.lookVertical = newConfig.lookVertical
    }

    if (newConfig.autoForward !== undefined) {
      controls.autoForward = newConfig.autoForward
    }

    if (newConfig.activeLook !== undefined) {
      controls.activeLook = newConfig.activeLook
    }

    if (newConfig.heightSpeed !== undefined) {
      controls.heightSpeed = newConfig.heightSpeed
    }

    if (newConfig.heightCoef !== undefined) {
      controls.heightCoef = newConfig.heightCoef
    }

    if (newConfig.heightMin !== undefined) {
      controls.heightMin = newConfig.heightMin
    }

    if (newConfig.heightMax !== undefined) {
      controls.heightMax = newConfig.heightMax
    }

    if (newConfig.constrainVertical !== undefined) {
      controls.constrainVertical = newConfig.constrainVertical
    }

    if (newConfig.verticalMin !== undefined) {
      controls.verticalMin = newConfig.verticalMin
    }

    if (newConfig.verticalMax !== undefined) {
      controls.verticalMax = newConfig.verticalMax
    }

    if (newConfig.mouseDragOn !== undefined) {
      controls.mouseDragOn = newConfig.mouseDragOn
    }
  }

  const stopWatch = watch([() => ctx.renderer, () => ctx.camera], ([renderer, camera]) => {
    if (!renderer || !camera) return
    if (controls) return

    const fpControls = new FirstPersonControls(camera, renderer.domElement)
    controls = fpControls

    if (Object.keys(config).length > 0) {
      updateConfig(config)
    }

    ctx.controls = fpControls
    stopWatch()
  })

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
