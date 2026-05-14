import { inject, onBeforeUnmount, provide } from 'vue'
import { Material, Texture } from 'three'
import { MeshContextKey, MaterialContextKey, type TextureMapType } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { MaterialConfig } from '../types'

export function useMaterial(initialConfig: MaterialConfig) {
  const meshCtx = inject(MeshContextKey)

  if (!meshCtx) {
    throw new Error('useMaterial must be used within a TMesh component')
  }

  // 直接使用普通变量
  let material: Material = createMaterial(initialConfig)

  meshCtx!.setMaterial(material)

  const setMap = (texture: Texture | null) => {
    const mat = material as any
    if ('map' in mat) {
      mat.map = texture
      mat.needsUpdate = true
    }
  }

  const setNormalMap = (texture: Texture | null) => {
    const mat = material as any
    if ('normalMap' in mat) {
      mat.normalMap = texture
      mat.needsUpdate = true
    }
  }

  const setRoughnessMap = (texture: Texture | null) => {
    const mat = material as any
    if ('roughnessMap' in mat) {
      mat.roughnessMap = texture
      mat.needsUpdate = true
    }
  }

  const setMetalnessMap = (texture: Texture | null) => {
    const mat = material as any
    if ('metalnessMap' in mat) {
      mat.metalnessMap = texture
      mat.needsUpdate = true
    }
  }

  const setAoMap = (texture: Texture | null) => {
    const mat = material as any
    if ('aoMap' in mat) {
      mat.aoMap = texture
      mat.needsUpdate = true
    }
  }

  const setDisplacementMap = (texture: Texture | null) => {
    const mat = material as any
    if ('displacementMap' in mat) {
      mat.displacementMap = texture
      mat.needsUpdate = true
    }
  }

  const setEmissiveMap = (texture: Texture | null) => {
    const mat = material as any
    if ('emissiveMap' in mat) {
      mat.emissiveMap = texture
      mat.needsUpdate = true
    }
  }

  const setAlphaMap = (texture: Texture | null) => {
    const mat = material as any
    if ('alphaMap' in mat) {
      mat.alphaMap = texture
      mat.needsUpdate = true
    }
  }

  const setBumpMap = (texture: Texture | null) => {
    const mat = material as any
    if ('bumpMap' in mat) {
      mat.bumpMap = texture
      mat.needsUpdate = true
    }
  }

  const setEnvMap = (texture: Texture | null) => {
    const mat = material as any
    if ('envMap' in mat) {
      mat.envMap = texture
      mat.needsUpdate = true
    }
  }

  const setTextureByType = (type: TextureMapType, texture: Texture | null) => {
    const mat = material as any
    if (type in mat) {
      mat[type] = texture
      mat.needsUpdate = true
    }
  }

  provide(MaterialContextKey, {
    material,
    setMap,
    setNormalMap,
    setRoughnessMap,
    setMetalnessMap,
    setAoMap,
    setDisplacementMap,
    setEmissiveMap,
    setAlphaMap,
    setBumpMap,
    setEnvMap,
    setTextureByType
  })

  function createMaterial(materialConfig: MaterialConfig) {
    return ThreeObjectFactory.createMaterial(materialConfig)
  }

  function updateMaterial(newConfig: MaterialConfig) {
    material.dispose()
    material = createMaterial(newConfig)
    meshCtx!.setMaterial(material)
  }

  onBeforeUnmount(() => {
    material.dispose()
  })

  return {
    material,
    updateMaterial
  }
}
