import type { Object3D, Mesh as ThreeMesh, Light, BufferGeometry } from 'three'
import type { SceneObject } from '../stores/scene'

export interface ExportedSceneConfig {
  version: string
  timestamp: string
  objects: ExportedObject[]
}

export interface ExportedObject {
  id: string
  name: string
  type: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  visible: boolean
  castShadow?: boolean
  receiveShadow?: boolean
  material?: ExportedMaterial
  geometry?: ExportedGeometry
  light?: ExportedLight
}

export interface ExportedMaterial {
  type: string
  color?: string
  transparent?: boolean
  opacity?: number
  metalness?: number
  roughness?: number
  emissive?: string
}

export interface ExportedGeometry {
  type: string
  parameters: Record<string, unknown>
}

export interface ExportedLight {
  type: string
  color: string
  intensity: number
  castShadow?: boolean
}

export function extractObjectConfig(object: Object3D): Partial<ExportedObject> {
  return {
    position: [object.position.x, object.position.y, object.position.z] as [number, number, number],
    rotation: [object.rotation.x, object.rotation.y, object.rotation.z] as [number, number, number],
    scale: [object.scale.x, object.scale.y, object.scale.z] as [number, number, number],
    visible: object.visible,
    castShadow: object.castShadow,
    receiveShadow: object.receiveShadow
  }
}

export function extractMaterialConfig(mesh: ThreeMesh): ExportedMaterial | undefined {
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
  if (!material) return undefined

  const result: ExportedMaterial = {
    type: material.type
  }

  if ('color' in material && material.color) {
    result.color = `#${material.color.getHexString()}`
  }
  if ('transparent' in material) {
    result.transparent = material.transparent
  }
  if ('opacity' in material) {
    result.opacity = material.opacity
  }
  if ('metalness' in material) {
    result.metalness = material.metalness
  }
  if ('roughness' in material) {
    result.roughness = material.roughness
  }
  if ('emissive' in material && material.emissive) {
    result.emissive = `#${material.emissive.getHexString()}`
  }

  return result
}

export function extractGeometryConfig(mesh: ThreeMesh): ExportedGeometry | undefined {
  if (!mesh.geometry) return undefined

  const geometry = mesh.geometry
  return {
    type: geometry.type,
    parameters: {
      ...(geometry as BufferGeometry & { parameters?: Record<string, unknown> }).parameters
    }
  }
}

export function extractLightConfig(light: Light): ExportedLight {
  return {
    type: light.type,
    color: `#${light.color.getHexString()}`,
    intensity: light.intensity,
    castShadow: light.castShadow
  }
}

export function sceneObjectToExported(sceneObject: SceneObject): ExportedObject {
  const baseConfig = extractObjectConfig(sceneObject.object)

  const result: ExportedObject = {
    id: sceneObject.id,
    name: sceneObject.name,
    type: sceneObject.type,
    ...baseConfig
  } as ExportedObject

  if (sceneObject.material && 'isMesh' in sceneObject.object && sceneObject.object.isMesh) {
    result.material = extractMaterialConfig(sceneObject.object as ThreeMesh)
  }

  if (sceneObject.geometry || ('isMesh' in sceneObject.object && sceneObject.object.isMesh)) {
    const mesh = sceneObject.object as ThreeMesh
    result.geometry = extractGeometryConfig(mesh)
  }

  if ('intensity' in sceneObject.object) {
    result.light = extractLightConfig(sceneObject.object as Light)
  }

  return result
}

export function generateExportJSON(sceneObjects: SceneObject[]): string {
  const config: ExportedSceneConfig = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    objects: sceneObjects.map(sceneObjectToExported)
  }
  return JSON.stringify(config, null, 2)
}

export function downloadJSON(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generateVueComponentCode(sceneObjects: SceneObject[]): string {
  const lines: string[] = []

  lines.push('<template>')
  lines.push('  <TCanvas antialias alpha :shadow-map="true">')
  lines.push('    <TScene background="#1a1a2e">')
  lines.push('      <TPerspectiveCamera :position="[8, 6, 8]" :fov="60" />')
  lines.push('      <TOrbitControls :enable-damping="true" />')
  lines.push('')

  sceneObjects.forEach(obj => {
    const config = sceneObjectToExported(obj)

    if (obj.type === 'AmbientLight') {
      const intensity = config.light?.intensity ?? 0.5
      lines.push(`      <TAmbientLight :intensity="${intensity}" />`)
    } else if (obj.type === 'DirectionalLight') {
      const intensity = config.light?.intensity ?? 1
      const pos = config.position.map(n => n.toFixed(2)).join(', ')
      lines.push(
        `      <TDirectionalLight :position="[${pos}]" :intensity="${intensity}" :cast-shadow="true" />`
      )
    } else if (obj.type === 'PointLight') {
      const intensity = config.light?.intensity ?? 1
      const pos = config.position.map(n => n.toFixed(2)).join(', ')
      lines.push(`      <TPointLight :position="[${pos}]" :intensity="${intensity}" />`)
    } else if (obj.type === 'Mesh') {
      const pos = config.position.map(n => n.toFixed(2)).join(', ')
      const color = config.material?.color ?? '#ffffff'
      const geomType = config.geometry?.type ?? 'BoxGeometry'

      const geomComponent = geomType.replace('Geometry', '')
      const geomArgs = formatGeometryArgs(config.geometry?.parameters)

      lines.push(`      <TMesh :position="[${pos}]" :cast-shadow="true" :receive-shadow="true">`)
      lines.push(`        <T${geomComponent}${geomArgs} />`)
      lines.push(`        <TMeshStandardMaterial color="${color}" />`)
      lines.push('      </TMesh>')
    }
  })

  lines.push('')
  lines.push('    </TScene>')
  lines.push('  </TCanvas>')
  lines.push('</template>')
  lines.push('')
  lines.push('<script setup lang="ts">')
  lines.push('import {')
  lines.push('  TCanvas,')
  lines.push('  TScene,')
  lines.push('  TPerspectiveCamera,')
  lines.push('  TOrbitControls,')
  lines.push('  TAmbientLight,')
  lines.push('  TDirectionalLight,')
  lines.push('  TPointLight,')
  lines.push('  TMesh,')
  lines.push('  TBox,')
  lines.push('  TSphere,')
  lines.push('  TCylinder,')
  lines.push('  TPlane,')
  lines.push('  TMeshStandardMaterial')
  lines.push("} from '@vue-three/vue-three'")
  lines.push('</script>')

  return lines.join('\n')
}

function formatGeometryArgs(params: Record<string, unknown> = {}): string {
  const args: string[] = []

  if (typeof params.width === 'number') {
    args.push(params.width.toFixed(2))
  }
  if (typeof params.height === 'number') {
    args.push(params.height.toFixed(2))
  }
  if (typeof params.depth === 'number') {
    args.push(params.depth.toFixed(2))
  }
  if (typeof params.radius === 'number' && args.length === 0) {
    args.push(params.radius.toFixed(2))
  }

  return args.length > 0 ? ` :args="[${args.join(', ')}]"` : ''
}

export function downloadVueCode(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false)
}
