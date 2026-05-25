import { inject, ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { Object3D, Mesh, BufferGeometry } from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { ThreeContextKey, GroupContextKey, MeshContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { OBJLoaderConfig } from '../types'

export function useOBJLoader(config: OBJLoaderConfig) {
  const threeCtx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)
  const meshCtx = inject(MeshContextKey, null)

  if (!threeCtx) {
    throw new Error('useOBJLoader must be used within a TCanvas component')
  }

  const scene = threeCtx.scene
  const parent = groupCtx?.group || scene
  const model = shallowRef<Object3D | null>(null)
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
        if (model.value && parent) {
          parent.remove(model.value)
          disposeModel(model.value)
        }

        if (loadedModel) {
          ThreeObjectFactory.applyObject3DConfig(loadedModel, config)
          applyShadowToModel(loadedModel, config)

          if (meshCtx) {
            handleMeshParentCase(loadedModel)
          } else {
            if (parent) {
              parent.add(loadedModel)
            }
          }

          model.value = loadedModel
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

  const handleMeshParentCase = (loadedModel: Object3D) => {
    let geometry: BufferGeometry | null = null

    if (
      loadedModel.children.length > 0 &&
      loadedModel.children[0] instanceof Mesh &&
      loadedModel.children[0].geometry
    ) {
      geometry = loadedModel.children[0].geometry.clone()
      geometry.center()
    } else {
      loadedModel.traverse(child => {
        if (!geometry && child instanceof Mesh && child.geometry) {
          geometry = child.geometry.clone()
          geometry.center()
        }
      })
    }

    if (geometry && meshCtx?.setGeometry) {
      meshCtx.setGeometry(geometry)
    }

    model.value = loadedModel
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
      if (model.value) {
        ThreeObjectFactory.updateObject3DConfig(model.value, config)
        applyShadowToModel(model.value, config)
      }
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (model.value && parent) {
      parent.remove(model.value)
      disposeModel(model.value)
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
