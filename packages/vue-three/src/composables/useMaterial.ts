import { inject, onBeforeUnmount, provide } from 'vue'
import { Material, Texture, Color, Vector2, Vector3, Vector4, Euler, Quaternion } from 'three'
import { MeshContextKey, MaterialContextKey, type TextureMapType } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { MaterialConfig } from '../types'

export function useMaterial(initialConfig: MaterialConfig) {
  const meshCtx = inject(MeshContextKey)

  if (!meshCtx) {
    throw new Error('useMaterial must be used within a TMesh component')
  }

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

  const setMatcap = (texture: Texture | null) => {
    const mat = material as any
    if ('matcap' in mat) {
      mat.matcap = texture
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
    setMatcap,
    setTextureByType
  })

  function createMaterial(materialConfig: MaterialConfig): Material {
    const processedConfig = preprocessMaterialConfig(materialConfig)
    return ThreeObjectFactory.createMaterial(processedConfig)
  }

  function updateMaterial(newConfig: MaterialConfig) {
    const mat = material as any
    const { type, ...properties } = newConfig

    for (const [key, value] of Object.entries(properties)) {
      if (value !== undefined && key in mat) {
        mat[key] = convertValueToExpectedType(value, mat[key])
      }
    }

    mat.needsUpdate = true
  }

  /**
   * 预处理材质配置，将数组转换为对应的 Three.js 类型
   */
  function preprocessMaterialConfig(config: MaterialConfig): MaterialConfig {
    const processed: MaterialConfig = { ...config }
    const { type, ...properties } = config

    // 创建一个临时材质实例来获取属性类型信息
    const tempMaterial = ThreeObjectFactory.createMaterial({ type: type || 'basic' })

    for (const [key, value] of Object.entries(properties)) {
      if (value !== undefined && key in tempMaterial) {
        processed[key] = convertValueToExpectedType(value, (tempMaterial as any)[key])
      }
    }

    tempMaterial.dispose()
    return processed
  }

  /**
   * 根据目标属性的类型，将值转换为对应的 Three.js 类型
   */
  function convertValueToExpectedType(value: any, expectedValue: any): any {
    if (value === null || value === undefined) {
      return value
    }

    // 如果已经是正确的类型，直接返回
    if (
      value instanceof Vector2 ||
      value instanceof Vector3 ||
      value instanceof Vector4 ||
      value instanceof Color ||
      value instanceof Euler ||
      value instanceof Quaternion
    ) {
      return value
    }

    // 根据期望类型进行转换
    if (expectedValue instanceof Vector2) {
      return Array.isArray(value) ? new Vector2(...value) : value
    }

    if (expectedValue instanceof Vector3) {
      return Array.isArray(value) ? new Vector3(...value) : value
    }

    if (expectedValue instanceof Vector4) {
      return Array.isArray(value) ? new Vector4(...value) : value
    }

    if (expectedValue instanceof Color) {
      return new Color(value as string | number)
    }

    if (expectedValue instanceof Euler) {
      return Array.isArray(value) ? new Euler(...value) : value
    }

    if (expectedValue instanceof Quaternion) {
      return Array.isArray(value) ? new Quaternion(...value) : value
    }

    return value
  }

  onBeforeUnmount(() => {
    material.dispose()
  })

  return {
    material,
    updateMaterial
  }
}
