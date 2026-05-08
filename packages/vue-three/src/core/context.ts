import type { InjectionKey, Ref, ShallowRef } from 'vue'
import type {
  WebGLRenderer,
  Scene,
  Camera,
  Mesh,
  BufferGeometry,
  Material,
  AnimationMixer,
  Texture,
  Object3D,
  Vector3,
  Vector2,
  Raycaster,
  Face,
  Sprite,
  SpriteMaterial,
  Group
} from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import type { Pass } from 'three/addons/postprocessing/Pass.js'
import type { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import type { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'

export type InteractionEventType =
  | 'click'
  | 'pointerenter'
  | 'pointerleave'
  | 'pointermove'
  | 'dblclick'
  | 'contextmenu'

export interface InteractionEvent {
  type: InteractionEventType
  object: Object3D
  point: Vector3
  distance: number
  face: Face | null
  uv: Vector2 | null
  event: MouseEvent
  stopPropagation: () => void
}

export interface InteractionHandlers {
  onClick?: (e: InteractionEvent) => void
  onDblclick?: (e: InteractionEvent) => void
  onContextmenu?: (e: InteractionEvent) => void
  onPointerEnter?: (e: InteractionEvent) => void
  onPointerLeave?: (e: InteractionEvent) => void
  onPointerMove?: (e: InteractionEvent) => void
}

export interface InteractionContext {
  registerObject: (object: Object3D, handlers: InteractionHandlers) => void
  unregisterObject: (object: Object3D) => void
  raycaster: ShallowRef<Raycaster>
}

export interface Size {
  width: number
  height: number
}

export interface ThreeContext {
  renderer: ShallowRef<WebGLRenderer | null>
  scene: ShallowRef<Scene>
  camera: ShallowRef<Camera>
  controls: ShallowRef<OrbitControls | null>
  canvas: Ref<HTMLCanvasElement | null>
  size: Ref<Size>
  composer: ShallowRef<EffectComposer | null>

  // 场景注册表 - 支持多场景渲染
  scenes: ShallowRef<Map<string, Scene>>
  registerScene: (name: string, scene: Scene) => void
  getScene: (name: string) => Scene | undefined
  unregisterScene: (name: string) => void

  // 渲染器注册表 - 支持多渲染器
  renderers: ShallowRef<Map<string, THREE.Renderer>>
  registerRenderer: (name: string, renderer: THREE.Renderer) => void
  getRenderer: (name: string) => THREE.Renderer | undefined
  unregisterRenderer: (name: string) => void

  registerAnimationMixer: (mixer: AnimationMixer) => void
  unregisterAnimationMixer: (mixer: AnimationMixer) => void
  registerRenderPass: (pass: Pass) => void
  unregisterRenderPass: (pass: Pass) => void
  enablePostProcessing: () => void
}

export interface MeshContext {
  mesh: ShallowRef<Mesh>
  setGeometry: (geometry: BufferGeometry) => void
  setMaterial: (material: Material) => void
}

export interface GroupContext {
  group: ShallowRef<Group>
}

export interface AnimationContext {
  mixer: ShallowRef<AnimationMixer | null>
}

export interface EffectComposerContext {
  addPass: (pass: Pass) => void
  removePass: (pass: Pass) => void
}

export type TextureMapType =
  | 'map'
  | 'normalMap'
  | 'roughnessMap'
  | 'metalnessMap'
  | 'aoMap'
  | 'displacementMap'
  | 'emissiveMap'
  | 'alphaMap'
  | 'bumpMap'
  | 'envMap'

export interface MaterialContext {
  material: ShallowRef<Material>
  setMap: (texture: Texture | null) => void
  setNormalMap: (texture: Texture | null) => void
  setRoughnessMap: (texture: Texture | null) => void
  setMetalnessMap: (texture: Texture | null) => void
  setAoMap: (texture: Texture | null) => void
  setDisplacementMap: (texture: Texture | null) => void
  setEmissiveMap: (texture: Texture | null) => void
  setAlphaMap: (texture: Texture | null) => void
  setBumpMap: (texture: Texture | null) => void
  setEnvMap: (texture: Texture | null) => void
  setTextureByType: (type: TextureMapType, texture: Texture | null) => void
}

/**
 * CSS2D 标签配置接口
 */
export interface CSS2DLabelConfig {
  position: [number, number, number]
  offset?: [number, number]
  minDistance?: number
  maxDistance?: number
  scaleByDistance?: boolean
  scaleFactor?: number
  opacity?: number
  className?: string
  style?: Record<string, string>
}

/**
 * CSS2D 上下文接口
 */
export interface CSS2DContext {
  renderer: ShallowRef<CSS2DRenderer | null>
  labelContainer: Ref<HTMLElement | null>
  addLabel: (label: CSS2DObject, config?: CSS2DLabelConfig) => void
  updateLabelConfig: (label: CSS2DObject, config: Partial<CSS2DLabelConfig>) => void
  removeLabel: (label: CSS2DObject) => void
}

/**
 * CSS3D 对象配置接口
 */
export interface CSS3DObjectConfig {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  className?: string
  style?: Record<string, string>
}

/**
 * CSS3D 上下文接口
 */
export interface CSS3DContext {
  renderer: ShallowRef<CSS3DRenderer | null>
  container: Ref<HTMLElement | null>
  scene: ShallowRef<Scene>
  addObject: (object: CSS3DObject, config?: CSS3DObjectConfig) => void
  removeObject: (object: CSS3DObject) => void
}

/**
 * CSS3D 组上下文接口
 */
export interface CSS3DGroupContext {
  group: ShallowRef<Group>
}

/**
 * CSS2D 上下文接口（扩展）
 */
export interface CSS2DContext {
  renderer: ShallowRef<CSS2DRenderer | null>
  labelContainer: Ref<HTMLElement | null>
  scene: ShallowRef<Scene>
  addLabel: (label: CSS2DObject, config?: CSS2DLabelConfig) => void
  updateLabelConfig: (label: CSS2DObject, config: Partial<CSS2DLabelConfig>) => void
  removeLabel: (label: CSS2DObject) => void
}

/**
 * CSS2D 组上下文接口
 */
export interface CSS2DGroupContext {
  group: ShallowRef<Group>
}

export const ThreeContextKey = Symbol('ThreeContext') as InjectionKey<ThreeContext>
export const MeshContextKey = Symbol('MeshContext') as InjectionKey<MeshContext>
export const GroupContextKey = Symbol('GroupContext') as InjectionKey<GroupContext>
export const AnimationContextKey = Symbol('AnimationContext') as InjectionKey<AnimationContext>
export const EffectComposerContextKey = Symbol(
  'EffectComposerContext'
) as InjectionKey<EffectComposerContext>
export const MaterialContextKey = Symbol('MaterialContext') as InjectionKey<MaterialContext>
export const InteractionContextKey = Symbol(
  'InteractionContext'
) as InjectionKey<InteractionContext>
export const CSS2DContextKey = Symbol('CSS2DContext') as InjectionKey<CSS2DContext>
export const CSS3DContextKey = Symbol('CSS3DContext') as InjectionKey<CSS3DContext>
export const CSS3DGroupContextKey = Symbol('CSS3DGroupContext') as InjectionKey<CSS3DGroupContext>
export const CSS2DGroupContextKey = Symbol('CSS2DGroupContext') as InjectionKey<CSS2DGroupContext>

/**
 * Sprite 精灵上下文接口
 */
export interface SpriteContext {
  sprite: ShallowRef<Sprite>
  setMaterial: (material: SpriteMaterial) => void
}

export const SpriteContextKey = Symbol('SpriteContext') as InjectionKey<SpriteContext>
