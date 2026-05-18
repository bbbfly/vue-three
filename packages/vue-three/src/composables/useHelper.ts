import { inject, watch, onBeforeUnmount, toValue } from 'vue'
import { Object3D, Group, Scene } from 'three'
import { ThreeContextKey, GroupContextKey } from '../core/context'
import type { MaybeRefOrGetter } from 'vue'
import { disposeObject3D } from '../core/cleanup'

export interface HelperConfig {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

export function useHelper<T extends Object3D>(helperInstance: MaybeRefOrGetter<T | null>) {
  const ctx = inject(ThreeContextKey)
  const parentGroupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useHelper must be used within a TCanvas component')
  }

  let helper: T | null = null
  let parent: Group | Scene

  // 优先使用父级 Group，否则使用场景
  if (parentGroupCtx) {
    parent = parentGroupCtx.group
  } else {
    parent = ctx.scene
  }

  const addToScene = () => {
    const instance = toValue(helperInstance)
    if (instance && parent) {
      parent.add(instance)
      helper = instance
    }
  }

  const removeFromScene = () => {
    if (helper && parent) {
      parent.remove(helper)
      disposeObject3D(helper, false)
      helper = null
    }
  }

  const setPosition = (x: number, y: number, z: number) => {
    if (helper) {
      helper.position.set(x, y, z)
    }
  }

  const setRotation = (x: number, y: number, z: number) => {
    if (helper) {
      helper.rotation.set(x, y, z)
    }
  }

  const setScale = (x: number, y: number, z: number) => {
    if (helper) {
      helper.scale.set(x, y, z)
    }
  }

  const applyConfig = (config: HelperConfig) => {
    if (!helper) return

    if (config.position) {
      setPosition(...config.position)
    }
    if (config.rotation) {
      setRotation(...config.rotation)
    }
    if (config.scale) {
      setScale(...config.scale)
    }
  }

  watch(
    () => toValue(helperInstance),
    (newInstance, oldInstance) => {
      if (oldInstance && parent) {
        parent.remove(oldInstance)
        disposeObject3D(oldInstance, false)
      }
      if (newInstance && parent) {
        parent.add(newInstance)
        helper = newInstance
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    removeFromScene()
  })

  return {
    helper,
    addToScene,
    removeFromScene,
    setPosition,
    setRotation,
    setScale,
    applyConfig
  }
}
