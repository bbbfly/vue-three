import { inject, watch, onBeforeUnmount } from 'vue'
import { Scene, Color, Fog, FogExp2, Object3D, Texture, ColorRepresentation } from 'three'
import { ThreeContextKey } from '../core/context'
import type { Object3DConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export interface SceneConfig extends Object3DConfig {
  background?: ColorRepresentation | Texture
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

  const scene: Scene = ctx.scene

  const add = (object: Object3D) => {
    scene.add(object)
  }

  const remove = (object: Object3D) => {
    scene.remove(object)
  }

  const updateConfig = (newConfig: SceneConfig) => {
    if (newConfig.background !== undefined) {
      if (newConfig.background instanceof Texture) {
        scene.background = newConfig.background
      } else {
        scene.background = new Color(newConfig.background)
      }
    }

    if (newConfig.fog) {
      const fogColor = new Color(newConfig.fog.color || 0xffffff)
      if (newConfig.fog.type === 'exp') {
        scene.fog = new FogExp2(fogColor, newConfig.fog.density || 0.00025)
      } else {
        scene.fog = new Fog(fogColor, newConfig.fog.near || 1, newConfig.fog.far || 100)
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
    while (scene.children.length > 0) {
      const child = scene.children[0]
      disposeObject3D(child, false)
      scene.remove(child)
    }
  })

  return {
    scene,
    add,
    remove
  }
}
