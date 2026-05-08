import { inject, shallowRef, onBeforeUnmount, watch, computed } from 'vue'
import { Light } from 'three'
import { ThreeContextKey, GroupContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { LightConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export function useLight(config: LightConfig) {
  const ctx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useLight must be used within a TCanvas component')
  }

  const light = shallowRef<Light>(createLight(config))

  const parent = computed(() => groupCtx?.group.value || ctx.scene.value)

  watch(parent, (newParent) => {
    if (newParent && !newParent.children.includes(light.value)) {
      newParent.add(light.value)
    }
  }, { immediate: true })

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
    if (parent.value) {
      parent.value.remove(light.value)
    }
    disposeObject3D(light.value)
  })

  return {
    light
  }
}
