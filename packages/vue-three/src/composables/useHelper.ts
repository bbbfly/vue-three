import { inject, watch, onBeforeUnmount, toValue } from 'vue'
import { Object3D } from 'three'
import { ThreeContextKey } from '../core/context'
import type { MaybeRefOrGetter } from 'vue'
import { disposeObject3D } from '../core/cleanup'

export interface HelperConfig {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

export function useHelper<T extends Object3D>(helperInstance: MaybeRefOrGetter<T | null>) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useHelper must be used within a TCanvas component')
  }

  let helper: T | null = null

  const addToScene = () => {
    const instance = toValue(helperInstance)
    if (instance && ctx.scene) {
      ctx.scene.add(instance)
      helper = instance
    }
  }

  const removeFromScene = () => {
    if (helper && ctx.scene) {
      ctx.scene.remove(helper)
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
      if (oldInstance && ctx.scene) {
        ctx.scene.remove(oldInstance)
        disposeObject3D(oldInstance, false)
      }
      if (newInstance && ctx.scene) {
        ctx.scene.add(newInstance)
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
