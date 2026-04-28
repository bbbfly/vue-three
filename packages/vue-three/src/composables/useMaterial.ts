import { inject, shallowRef, onBeforeUnmount, provide } from 'vue'
import { Material, Texture } from 'three'
import { MeshContextKey, MaterialContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { MaterialConfig } from '../types'

export function useMaterial(initialConfig: MaterialConfig) {
  const meshCtx = inject(MeshContextKey)

  if (!meshCtx) {
    throw new Error('useMaterial must be used within a TMesh component')
  }

  const material = shallowRef<Material>(createMaterial(initialConfig))

  meshCtx!.setMaterial(material.value)

  const setMap = (texture: Texture | null) => {
    const mat = material.value as any
    if ('map' in mat) {
      mat.map = texture
      mat.needsUpdate = true
    }
  }

  provide(MaterialContextKey, {
    material,
    setMap
  })

  function createMaterial(materialConfig: MaterialConfig) {
    return ThreeObjectFactory.createMaterial(materialConfig)
  }

  function updateMaterial(newConfig: MaterialConfig) {
    material.value.dispose()
    material.value = createMaterial(newConfig)
    meshCtx!.setMaterial(material.value)
  }

  onBeforeUnmount(() => {
    material.value.dispose()
  })

  return {
    material,
    updateMaterial
  }
}
