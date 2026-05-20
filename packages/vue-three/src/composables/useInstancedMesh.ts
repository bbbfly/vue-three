import { inject, onBeforeUnmount, watch, provide, ref, shallowRef } from 'vue'
import { InstancedMesh, BufferGeometry, Material } from 'three'
import { ThreeContextKey, MeshContextKey, GroupContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { MeshConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export interface InstancedMeshConfig extends MeshConfig {
  instanceCount?: number
}

export function useInstancedMesh(config?: InstancedMeshConfig) {
  const ctx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useInstancedMesh must be used within a TCanvas component')
  }

  const instanceCount = config?.instanceCount || 1
  const meshRef = shallowRef<InstancedMesh | null>(null)
  let currentGeometry: BufferGeometry | null = null
  let currentMaterial: Material | null = null
  let isInitialized = false

  const parent = groupCtx?.group || ctx.scene

  function createMesh() {
    if (!currentGeometry || !currentMaterial) {
      return null
    }
    const newMesh = new InstancedMesh(currentGeometry, currentMaterial, instanceCount)
    if (config) {
      ThreeObjectFactory.applyObject3DConfig(newMesh, config)
    }
    return newMesh
  }

  function setGeometry(geometry: BufferGeometry) {
    currentGeometry = geometry
    if (currentMaterial && !isInitialized) {
      const newMesh = createMesh()
      if (newMesh) {
        if (meshRef.value) {
          parent.remove(meshRef.value)
          disposeObject3D(meshRef.value)
        }
        meshRef.value = newMesh
        parent.add(newMesh)
        isInitialized = true
      }
    }
  }

  function setMaterial(material: Material) {
    currentMaterial = material
    if (currentGeometry && !isInitialized) {
      const newMesh = createMesh()
      if (newMesh) {
        if (meshRef.value) {
          parent.remove(meshRef.value)
          disposeObject3D(meshRef.value)
        }
        meshRef.value = newMesh
        parent.add(newMesh)
        isInitialized = true
      }
    }
  }

  if (config) {
    watch(
      () => config,
      newConfig => {
        if (meshRef.value) {
          ThreeObjectFactory.updateObject3DConfig(meshRef.value, newConfig)
          if (newConfig.instanceCount !== undefined) {
            meshRef.value.count = newConfig.instanceCount
          }
        }
      },
      { deep: true }
    )
  }

  onBeforeUnmount(() => {
    if (meshRef.value) {
      parent.remove(meshRef.value)
      disposeObject3D(meshRef.value)
    }
  })

  provide(MeshContextKey, {
    mesh: meshRef,
    setGeometry,
    setMaterial
  })

  return {
    mesh: meshRef,
    setGeometry,
    setMaterial
  }
}
