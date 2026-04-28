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
  Face
} from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import type { Pass } from 'three/addons/postprocessing/Pass.js'

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

export const ThreeContextKey = Symbol('ThreeContext') as InjectionKey<ThreeContext>
export const MeshContextKey = Symbol('MeshContext') as InjectionKey<MeshContext>
export const AnimationContextKey = Symbol('AnimationContext') as InjectionKey<AnimationContext>
export const EffectComposerContextKey = Symbol(
  'EffectComposerContext'
) as InjectionKey<EffectComposerContext>
export const MaterialContextKey = Symbol('MaterialContext') as InjectionKey<MaterialContext>
export const InteractionContextKey = Symbol(
  'InteractionContext'
) as InjectionKey<InteractionContext>
