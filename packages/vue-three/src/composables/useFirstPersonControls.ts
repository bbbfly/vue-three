import { inject, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'
import { ThreeContextKey } from '../core/context'
import type { FirstPersonControlsConfig } from '../types'

export function useFirstPersonControls(config: FirstPersonControlsConfig = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useFirstPersonControls must be used within a TCanvas component')
  }

  const controls = shallowRef<FirstPersonControls | null>(null)

  const update = (delta: number) => {
    if (controls.value) {
      controls.value.update(delta)
    }
  }

  const dispose = () => {
    if (controls.value) {
      controls.value.dispose()
    }
  }

  const updateConfig = (newConfig: FirstPersonControlsConfig) => {
    if (!controls.value) return

    if (newConfig.movementSpeed !== undefined) {
      controls.value.movementSpeed = newConfig.movementSpeed
    }

    if (newConfig.lookSpeed !== undefined) {
      controls.value.lookSpeed = newConfig.lookSpeed
    }

    if (newConfig.noFly !== undefined) {
      controls.value.noFly = newConfig.noFly
    }

    if (newConfig.lookVertical !== undefined) {
      controls.value.lookVertical = newConfig.lookVertical
    }

    if (newConfig.autoForward !== undefined) {
      controls.value.autoForward = newConfig.autoForward
    }

    if (newConfig.activeLook !== undefined) {
      controls.value.activeLook = newConfig.activeLook
    }

    if (newConfig.heightSpeed !== undefined) {
      controls.value.heightSpeed = newConfig.heightSpeed
    }

    if (newConfig.heightCoef !== undefined) {
      controls.value.heightCoef = newConfig.heightCoef
    }

    if (newConfig.heightMin !== undefined) {
      controls.value.heightMin = newConfig.heightMin
    }

    if (newConfig.heightMax !== undefined) {
      controls.value.heightMax = newConfig.heightMax
    }

    if (newConfig.constrainVertical !== undefined) {
      controls.value.constrainVertical = newConfig.constrainVertical
    }

    if (newConfig.verticalMin !== undefined) {
      controls.value.verticalMin = newConfig.verticalMin
    }

    if (newConfig.verticalMax !== undefined) {
      controls.value.verticalMax = newConfig.verticalMax
    }

    if (newConfig.mouseDragOn !== undefined) {
      controls.value.mouseDragOn = newConfig.mouseDragOn
    }
  }

  onMounted(() => {
    if (!ctx.renderer.value || !ctx.camera.value) {
      return
    }

    const fpControls = new FirstPersonControls(ctx.camera.value, ctx.renderer.value.domElement)
    controls.value = fpControls

    if (Object.keys(config).length > 0) {
      updateConfig(config)
    }

    ctx.controls.value = fpControls
  })

  watch(
    () => config,
    newConfig => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    dispose()
  })

  return {
    controls,
    update,
    dispose,
    updateConfig
  }
}
