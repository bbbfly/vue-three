import { inject, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Object3D } from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { ThreeContextKey, GroupContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { OBJLoaderConfig } from '../types'

export function useOBJLoader(config: OBJLoaderConfig) {
  const threeCtx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!threeCtx) {
    throw new Error('useOBJLoader must be used within a TCanvas component')
  }

  const scene = threeCtx.scene
  const parent = groupCtx?.group || scene
  let model: Object3D | null = null
  const loading = ref(false)
  const progress = ref(0)
  const total = ref(0)
  const error = ref<Error | null>(null)

  const loader = new OBJLoader()

  const loadModel = (src: string) => {
    loading.value = true
    progress.value = 0
    error.value = null

    loader.load(
      src,
      loadedModel => {
        if (model && parent) {
          parent.remove(model)
          disposeModel(model)
        }

        if (loadedModel) {
          ThreeObjectFactory.applyObject3DConfig(loadedModel, config)
          applyShadowToModel(loadedModel, config)

          if (parent) {
            parent.add(loadedModel)
          }

          model = loadedModel
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
        console.error('Failed to load OBJ model:', err)
      }
    )
  }

  const applyShadowToModel = (object: Object3D, config: OBJLoaderConfig) => {
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
      if (model) {
        ThreeObjectFactory.updateObject3DConfig(model, config)
        applyShadowToModel(model, config)
      }
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (model && parent) {
      parent.remove(model)
      disposeModel(model)
    }
  })

  return {
    model,
    loading,
    progress,
    total,
    error
  }
}
