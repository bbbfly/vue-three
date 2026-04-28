import { inject, watch, shallowRef, onBeforeUnmount } from 'vue'
import { Scene, Color, Fog, FogExp2, Object3D } from 'three'
import { ThreeContextKey } from '../core/context'
import type { Object3DConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export interface SceneConfig extends Object3DConfig {
  background?: string | number
  backgroundAlpha?: number
  fog?: {
    type: 'linear' | 'exp'
    color?: string | number
    near?: number
    far?: number
    density?: number
  }
}

export function useScene(config: SceneConfig = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useScene must be used within a TCanvas component')
  }

  const scene = shallowRef<Scene>(ctx.scene.value)

  const add = (object: Object3D) => {
    scene.value.add(object)
  }

  const remove = (object: Object3D) => {
    scene.value.remove(object)
  }

  const updateConfig = (newConfig: SceneConfig) => {
    if (newConfig.background !== undefined) {
      scene.value.background = new Color(newConfig.background)
    }

    if (newConfig.fog) {
      const fogColor = new Color(newConfig.fog.color || 0xffffff)
      if (newConfig.fog.type === 'exp') {
        scene.value.fog = new FogExp2(fogColor, newConfig.fog.density || 0.00025)
      } else {
        scene.value.fog = new Fog(fogColor, newConfig.fog.near || 1, newConfig.fog.far || 100)
      }
    }
  }

  if (Object.keys(config).length > 0) {
    updateConfig(config)
  }

  watch(
    () => config,
    newConfig => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    while (scene.value.children.length > 0) {
      const child = scene.value.children[0]
      disposeObject3D(child, false)
      scene.value.remove(child)
    }
  })

  return {
    scene,
    add,
    remove
  }
}
