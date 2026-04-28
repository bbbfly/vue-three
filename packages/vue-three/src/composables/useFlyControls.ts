import { inject, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { FlyControls } from 'three/addons/controls/FlyControls.js'
import { ThreeContextKey } from '../core/context'
import type { FlyControlsConfig } from '../types'

export function useFlyControls(config: FlyControlsConfig = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useFlyControls must be used within a TCanvas component')
  }

  const controls = shallowRef<FlyControls | null>(null)

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

  const updateConfig = (newConfig: FlyControlsConfig) => {
    if (!controls.value) return

    if (newConfig.movementSpeed !== undefined) {
      controls.value.movementSpeed = newConfig.movementSpeed
    }

    if (newConfig.rollSpeed !== undefined) {
      controls.value.rollSpeed = newConfig.rollSpeed
    }

    if (newConfig.dragToLook !== undefined) {
      controls.value.dragToLook = newConfig.dragToLook
    }

    if (newConfig.autoForward !== undefined) {
      controls.value.autoForward = newConfig.autoForward
    }
  }

  onMounted(() => {
    if (!ctx.renderer.value || !ctx.camera.value) {
      return
    }

    const flyControls = new FlyControls(ctx.camera.value, ctx.renderer.value.domElement)
    controls.value = flyControls

    if (Object.keys(config).length > 0) {
      updateConfig(config)
    }

    ctx.controls.value = flyControls
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
