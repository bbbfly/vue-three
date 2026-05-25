import { inject, onBeforeUnmount, watch, provide } from 'vue'
import { Mesh, BufferGeometry, Material } from 'three'
import { ThreeContextKey, MeshContextKey, GroupContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { MeshConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export function useMesh(config?: MeshConfig) {
  const ctx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useMesh must be used within a TCanvas component')
  }

  // 直接使用普通变量存储 mesh
  const mesh: Mesh = config ? createMesh(config) : new Mesh()

  // 直接获取 parent，无需 computed
  const parent = groupCtx?.group || ctx.scene

  // 立即添加到父对象
  if (!parent.children.includes(mesh)) {
    parent.add(mesh)
  }

  function setGeometry(geometry: BufferGeometry) {
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }
    mesh.geometry = geometry
    mesh.geometry.computeBoundingSphere()
    mesh.geometry.computeBoundingBox()
    mesh.updateMatrix()
    mesh.matrixWorldNeedsUpdate = true
  }

  function setMaterial(material: Material) {
    if (mesh.material) {
      const oldMaterial = mesh.material as Material
      oldMaterial.dispose()
    }
    mesh.material = material
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
        ThreeObjectFactory.updateObject3DConfig(mesh, newConfig)
      },
      { deep: true }
    )
  }

  onBeforeUnmount(() => {
    parent.remove(mesh)
    disposeObject3D(mesh)
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
