import { inject, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import type { AnimationClip } from 'three'
import { Object3D } from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { ThreeContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { FBXLoaderConfig } from '../types'

export function useFBXLoader(config: FBXLoaderConfig) {
  const threeCtx = inject(ThreeContextKey)

  if (!threeCtx) {
    throw new Error('useFBXLoader must be used within a TCanvas component')
  }

  const scene = threeCtx.scene
  const model = shallowRef<Object3D | null>(null)
  const animations = shallowRef<AnimationClip[]>([])
  const loading = shallowRef(false)
  const progress = shallowRef(0)
  const total = shallowRef(0)
  const error = shallowRef<Error | null>(null)

  const loader = new FBXLoader()

  const loadModel = (src: string) => {
    loading.value = true
    progress.value = 0
    error.value = null

    loader.load(
      src,
      loadedModel => {
        if (model.value && scene.value) {
          scene.value.remove(model.value)
          disposeModel(model.value)
        }

        if (loadedModel) {
          ThreeObjectFactory.applyObject3DConfig(loadedModel, config)
          applyShadowToModel(loadedModel, config)

          if (scene.value) {
            scene.value.add(loadedModel)
          }

          model.value = loadedModel
          animations.value = loadedModel.animations || []
        }

        loading.value = false
        progress.value = 100
      },
      xhr => {
        total.value = xhr.total
        if (xhr.total > 0) {
          progress.value = Math.round((xhr.loaded / xhr.total) * 100)
        }
      },
      err => {
        error.value = err as Error
        loading.value = false
        console.error('Failed to load FBX model:', err)
      }
    )
  }

  const applyShadowToModel = (object: Object3D, config: FBXLoaderConfig) => {
    object.traverse(child => {
      if ('isMesh' in child) {
        if (config.castShadow !== undefined) {
          ;(child as any).castShadow = config.castShadow
        }
        if (config.receiveShadow !== undefined) {
          ;(child as any).receiveShadow = config.receiveShadow
        }
      }
    })
  }

  const disposeModel = (object: Object3D) => {
    object.traverse(child => {
      if ('geometry' in child && (child as any).geometry) {
        ;(child as any).geometry.dispose()
      }
      if ('material' in child && (child as any).material) {
        const materials = Array.isArray((child as any).material)
          ? (child as any).material
          : [(child as any).material]
        materials.forEach((mat: any) => mat.dispose())
      }
    })
  }

  onMounted(() => {
    if (config.src) {
      loadModel(config.src)
    }
  })

  watch(
    () => config.src,
    newSrc => {
      if (newSrc) {
        loadModel(newSrc)
      }
    }
  )

  watch(
    () => [config.position, config.rotation, config.scale, config.visible],
    () => {
      if (model.value) {
        ThreeObjectFactory.updateObject3DConfig(model.value, config)
        applyShadowToModel(model.value, config)
      }
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (model.value && scene.value) {
      scene.value.remove(model.value)
      disposeModel(model.value)
    }
  })

  return {
    model,
    animations,
    loading,
    progress,
    total,
    error
  }
}
