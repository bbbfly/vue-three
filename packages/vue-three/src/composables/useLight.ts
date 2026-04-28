import { inject, shallowRef, onBeforeUnmount, watch } from 'vue'
import { Light } from 'three'
import { ThreeContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { LightConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export function useLight(config: LightConfig) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useLight must be used within a TCanvas component')
  }

  const light = shallowRef<Light>(createLight(config))

  if (ctx.scene.value) {
    ctx.scene.value.add(light.value)
  }

  function createLight(lightConfig: LightConfig) {
    const newLight = ThreeObjectFactory.createLight(lightConfig) as Light
    ThreeObjectFactory.applyObject3DConfig(newLight, lightConfig)
    return newLight
  }

  watch(
    () => config,
    newConfig => {
      ThreeObjectFactory.updateObject3DConfig(light.value, newConfig)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (ctx.scene.value) {
      ctx.scene.value.remove(light.value)
    }
    disposeObject3D(light.value)
  })

  return {
    light
  }
}
