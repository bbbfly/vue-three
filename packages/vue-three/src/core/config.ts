import type {
  Object3DConfig,
  MeshConfig,
  LightConfig,
  GeometryConfig,
  MaterialConfig
} from '../types'

export function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true

  if (typeof a !== typeof b) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }

  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every(key => {
      if (!keysB.includes(key)) return false
      return deepEqual((a as any)[key], (b as any)[key])
    })
  }

  return false
}

export function mergeDefaults<T extends object>(config: Partial<T>, defaults: T): T {
  return { ...defaults, ...config }
}

export function parseObject3DConfig(config: Partial<Object3DConfig> = {}): Object3DConfig {
  return mergeDefaults(config, {
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [1, 1, 1] as [number, number, number],
    visible: true,
    castShadow: false,
    receiveShadow: false
  })
}

export function parseMeshConfig(config: Partial<MeshConfig>): MeshConfig {
  const object3DConfig = parseObject3DConfig(config)
  return {
    ...object3DConfig,
    geometry: config.geometry || { type: 'box' },
    material: config.material || { type: 'standard', color: 0xffffff }
  }
}

export function parseLightConfig(config: Partial<LightConfig>): LightConfig {
  const object3DConfig = parseObject3DConfig(config)
  const baseDefaults = {
    color: 0xffffff,
    intensity: 1
  }

  switch (config.type) {
    case 'ambient':
      return { ...object3DConfig, ...baseDefaults, type: 'ambient' }
    case 'directional':
      return { ...object3DConfig, ...baseDefaults, type: 'directional' }
    case 'point':
      return { ...object3DConfig, ...baseDefaults, type: 'point', distance: 0, decay: 2 }
    case 'spot':
      return {
        ...object3DConfig,
        ...baseDefaults,
        type: 'spot',
        angle: Math.PI / 3,
        penumbra: 0,
        distance: 0,
        decay: 2
      }
    case 'hemisphere':
      return { ...object3DConfig, ...baseDefaults, type: 'hemisphere', groundColor: 0xffffff }
    default:
      return { ...object3DConfig, ...baseDefaults, type: 'ambient' }
  }
}

export function parseGeometryConfig(
  config: Partial<GeometryConfig> = { type: 'box' }
): GeometryConfig {
  switch (config.type) {
    case 'box':
      return { type: 'box', args: config.args || [1, 1, 1] }
    case 'sphere':
      return { type: 'sphere', args: config.args || [1, 32, 32] }
    case 'plane':
      return { type: 'plane', args: config.args || [1, 1] }
    case 'cylinder':
      return { type: 'cylinder', args: config.args || [1, 1, 1, 32] }
    case 'torus':
      return { type: 'torus', args: config.args || [1, 0.4, 16, 100] }
    case 'cone':
      return { type: 'cone', args: config.args || [1, 1, 32] }
    case 'custom':
      return config as any
    default:
      return { type: 'box', args: [1, 1, 1] }
  }
}

export function parseMaterialConfig(
  config: Partial<MaterialConfig> = { type: 'standard' }
): MaterialConfig {
  const baseDefaults = {
    color: 0xffffff,
    transparent: false,
    opacity: 1,
    wireframe: false
  }

  switch (config.type) {
    case 'basic':
      return { ...baseDefaults, ...config, type: 'basic' }
    case 'standard':
      return {
        ...baseDefaults,
        metalness: 0,
        roughness: 1,
        envMapIntensity: 1,
        ...config,
        type: 'standard'
      }
    case 'lambert':
      return { ...baseDefaults, ...config, type: 'lambert' }
    case 'phong':
      return { ...baseDefaults, shininess: 30, ...config, type: 'phong' }
    case 'normal':
      return { wireframe: false, ...config, type: 'normal' }
    case 'depth':
      return { type: 'depth' }
    case 'custom':
      return config as any
    default:
      return { ...baseDefaults, metalness: 0, roughness: 1, type: 'standard' }
  }
}

export function extractChangedKeys<T extends object>(oldObj: T, newObj: T): (keyof T)[] {
  const keys = Object.keys(newObj) as (keyof T)[]
  return keys.filter(key => !deepEqual(oldObj[key], newObj[key]))
}
