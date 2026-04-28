import { inject, shallowRef, onBeforeUnmount, watch, provide } from 'vue'
import { Mesh, BufferGeometry, Material } from 'three'
import { ThreeContextKey, MeshContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { MeshConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export function useMesh(config?: MeshConfig) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useMesh must be used within a TCanvas component')
  }

  const mesh = shallowRef<Mesh>(config ? createMesh(config) : new Mesh())

  if (ctx.scene.value) {
    ctx.scene.value.add(mesh.value)
  }

  function setGeometry(geometry: BufferGeometry) {
    if (mesh.value.geometry) {
      mesh.value.geometry.dispose()
    }
    mesh.value.geometry = geometry
    mesh.value.updateMatrix()
  }

  function setMaterial(material: Material) {
    if (mesh.value.material) {
      const oldMaterial = mesh.value.material as Material
      oldMaterial.dispose()
    }
    mesh.value.material = material
    material.needsUpdate = true
  }

  function createMesh(meshConfig: MeshConfig) {
    const newMesh = ThreeObjectFactory.createMesh(meshConfig)
    ThreeObjectFactory.applyObject3DConfig(newMesh, meshConfig)
    return newMesh
  }

  if (config) {
    watch(
      () => config,
      newConfig => {
        ThreeObjectFactory.updateObject3DConfig(mesh.value, newConfig)
      },
      { deep: true }
    )
  }

  onBeforeUnmount(() => {
    if (ctx.scene.value) {
      ctx.scene.value.remove(mesh.value)
    }
    disposeObject3D(mesh.value)
  })

  provide(MeshContextKey, {
    mesh,
    setGeometry,
    setMaterial
  })

  return {
    mesh,
    setGeometry,
    setMaterial
  }
}
