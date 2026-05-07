import { inject, watch, shallowRef, onBeforeUnmount, toValue } from 'vue'
import { Object3D } from 'three'
import { ThreeContextKey } from '../core/context'
import type { MaybeRefOrGetter } from 'vue'
import { disposeObject3D } from '../core/cleanup'

export interface HelperConfig {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

export function useHelper<T extends Object3D>(
  helperInstance: MaybeRefOrGetter<T | null>
) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useHelper must be used within a TCanvas component')
  }

  const helper = shallowRef<T | null>(null)

  const addToScene = () => {
    const instance = toValue(helperInstance)
    if (instance && ctx.scene.value) {
      ctx.scene.value.add(instance)
      helper.value = instance
    }
  }

  const removeFromScene = () => {
    if (helper.value && ctx.scene.value) {
      ctx.scene.value.remove(helper.value)
      disposeObject3D(helper.value, false)
      helper.value = null
    }
  }

  const setPosition = (x: number, y: number, z: number) => {
    if (helper.value) {
      helper.value.position.set(x, y, z)
    }
  }

  const setRotation = (x: number, y: number, z: number) => {
    if (helper.value) {
      helper.value.rotation.set(x, y, z)
    }
  }

  const setScale = (x: number, y: number, z: number) => {
    if (helper.value) {
      helper.value.scale.set(x, y, z)
    }
  }

  const applyConfig = (config: HelperConfig) => {
    if (!helper.value) return

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
      if (oldInstance && ctx.scene.value) {
        ctx.scene.value.remove(oldInstance)
        disposeObject3D(oldInstance, false)
      }
      if (newInstance && ctx.scene.value) {
        ctx.scene.value.add(newInstance)
        helper.value = newInstance
      }
    },
    { immediate: true }
  )

  watch(
    () => ctx.scene.value,
    scene => {
      if (scene) {
        addToScene()
      }
    }
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
