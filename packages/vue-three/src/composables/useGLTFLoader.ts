import { inject, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { AnimationClip } from 'three'
import { Object3D, Mesh, BufferGeometry } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { ThreeContextKey, MeshContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { Object3DConfig, GLTFLoaderConfig } from '../types'

const dracoDecoderPath = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

export function useGLTFLoader(config: GLTFLoaderConfig) {
  const threeCtx = inject(ThreeContextKey)
  const meshCtx = inject(MeshContextKey, null)

  if (!threeCtx) {
    throw new Error('useGLTFLoader must be used within a TCanvas component')
  }

  const scene = threeCtx.scene
  let model: Object3D | null = null
  let gltf: any = null
  const animations = ref<AnimationClip[]>([])
  const loading = ref(false)
  const progress = ref(0)
  const total = ref(0)
  const error = ref<Error | null>(null)

  const loader = new GLTFLoader()

  if (config.draco) {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(dracoDecoderPath)
    loader.setDRACOLoader(dracoLoader)
  }

  const loadModel = (src: string) => {
    loading.value = true
    progress.value = 0
    error.value = null

    loader.load(
      src,
      loadedGltf => {
        if (model && scene) {
          scene.remove(model)
          disposeModel(model)
        }

        const loadedModel = loadedGltf.scene || loadedGltf.scenes?.[0]

        if (loadedModel) {
          ThreeObjectFactory.applyObject3DConfig(loadedModel, config)
          applyShadowToModel(loadedModel, config)

          if (meshCtx) {
            handleMeshParentCase(loadedModel, loadedGltf)
          } else {
            scene.add(loadedModel)
            model = loadedModel
          }
        }

        gltf = loadedGltf
        animations.value = loadedGltf.animations || []

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
        console.error('Failed to load GLTF model:', err)
      }
    )
  }

  const handleMeshParentCase = (loadedModel: Object3D, loadedGltf: any) => {
    let geometry: BufferGeometry | null = null
    loadedModel.traverse(child => {
      if (child instanceof Mesh && child.geometry) {
        geometry = child.geometry.clone()
      }
    })

    if (geometry && meshCtx?.setGeometry) {
      meshCtx.setGeometry(geometry)
    }

    model = loadedModel
  }

  const applyShadowToModel = (object: Object3D, config: Object3DConfig) => {
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
    if (model && scene) {
      scene.remove(model)
      disposeModel(model)
    }
  })

  return {
    model,
    gltf,
    animations,
    loading,
    progress,
    total,
    error
  }
}
