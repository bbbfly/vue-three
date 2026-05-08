import { inject, shallowRef, onBeforeUnmount, watch, provide, computed } from 'vue'
import { Group } from 'three'
import { ThreeContextKey, GroupContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { Object3DConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export interface GroupConfig extends Object3DConfig {
  name?: string
}

export function useGroup(config?: GroupConfig) {
  const ctx = inject(ThreeContextKey)
  const parentGroupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useGroup must be used within a TCanvas component')
  }

  const group = shallowRef<Group>(new Group())

  const parent = computed(() => parentGroupCtx?.group.value || ctx.scene.value)

  watch(parent, (newParent) => {
    if (newParent && !newParent.children.includes(group.value)) {
      newParent.add(group.value)
    }
  }, { immediate: true })

  if (config) {
    watch(
      () => config,
      newConfig => {
        ThreeObjectFactory.updateObject3DConfig(group.value, newConfig)
        if (newConfig.name !== undefined) {
          group.value.name = newConfig.name
        }
      },
      { deep: true }
    )

    if (config.name !== undefined) {
      group.value.name = config.name
    }
  }

  provide(GroupContextKey, { group })

  onBeforeUnmount(() => {
    if (parent.value) {
      parent.value.remove(group.value)
    }
    disposeObject3D(group.value)
  })

  return { group }
}