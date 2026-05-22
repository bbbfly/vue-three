import type { BufferGeometry, Material, Texture } from 'three'

export interface Object3DConfig {
  id?: string
  name?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  visible?: boolean
  castShadow?: boolean
  receiveShadow?: boolean
  renderOrder?: number
  frustumCulled?: boolean
  userData?: Record<string, any>
}

export type GeometryType =
  | 'box'
  | 'sphere'
  | 'plane'
  | 'cylinder'
  | 'torus'
  | 'cone'
  | 'icosahedron'
  | 'custom'
  | 'tube'
  | 'lathe'
  | 'shape'
  | 'extrude'
  | 'sweep'
  | 'edges'
  | 'wireframe'
  | 'convex'
  | 'text'

export type BoxGeometryArgs = [number?, number?, number?, number?, number?, number?]
export type SphereGeometryArgs = [number?, number?, number?, number?, number?, number?, number?]
export type PlaneGeometryArgs = [number?, number?, number?, number?]
export type CylinderGeometryArgs = [
  number?,
  number?,
  number?,
  number?,
  number?,
  boolean?,
  number?,
  number?
]
export type TorusKnotGeometryArgs = [number?, number?, number?, number?, number?, number?]
export type TorusGeometryArgs = [number?, number?, number?, number?, number?]
export type ConeGeometryArgs = [number?, number?, number?, number?, boolean?, number?, number?]
export type IcosahedronGeometryArgs = [number?, number?]

export interface BoxGeometryConfig {
  type: 'box'
  args?: BoxGeometryArgs
}

export interface SphereGeometryConfig {
  type: 'sphere'
  args?: SphereGeometryArgs
}

export interface PlaneGeometryConfig {
  type: 'plane'
  args?: PlaneGeometryArgs
}

export interface CylinderGeometryConfig {
  type: 'cylinder'
  args?: CylinderGeometryArgs
}

export interface TorusKnotGeometryConfig {
  type: 'torusKnot'
  args?: TorusKnotGeometryArgs
}

export interface TorusGeometryConfig {
  type: 'torus'
  args?: TorusGeometryArgs
}

export interface ConeGeometryConfig {
  type: 'cone'
  args?: ConeGeometryArgs
}

export interface IcosahedronGeometryConfig {
  type: 'icosahedron'
  args?: IcosahedronGeometryArgs
}

export interface CustomGeometryConfig {
  type: 'custom'
  buffer: BufferGeometry
}

export type GeometryConfig =
  | BoxGeometryConfig
  | SphereGeometryConfig
  | PlaneGeometryConfig
  | CylinderGeometryConfig
  | TorusGeometryConfig
  | ConeGeometryConfig
  | IcosahedronGeometryConfig
  | CustomGeometryConfig
  | TubeGeometryConfig
  | LatheGeometryConfig
  | ShapeGeometryConfig
  | ExtrudeGeometryConfig
  | SweepGeometryConfig
  | EdgesGeometryConfig
  | WireframeGeometryConfig

export type MaterialType =
  | 'basic'
  | 'standard'
  | 'physical'
  | 'lambert'
  | 'phong'
  | 'normal'
  | 'depth'
  | 'shadow'
  | 'shader'
  | 'points'
  | 'custom'

export interface BaseMaterialConfig {
  color?: string | number
  transparent?: boolean
  opacity?: number
  wireframe?: boolean
  side?: number
  blending?: number
  blendSrc?: number
  blendDst?: number
  blendEquation?: number
  premultipliedAlpha?: boolean
  flatShading?: boolean
  vertexColors?: boolean
  map?: string | Texture
  depthWrite?: boolean
  clippingPlanes?: THREE.Plane[]
  clipShadows?: boolean
  clipIntersection?: boolean
  alphaToCoverage?: boolean
}

export interface BasicMaterialConfig extends BaseMaterialConfig {
  type: 'basic'
}

export interface StandardMaterialConfig extends BaseMaterialConfig {
  type: 'standard'
  metalness?: number
  roughness?: number
  envMapIntensity?: number
}

export interface PhysicalMaterialConfig extends BaseMaterialConfig {
  type: 'physical'
  metalness?: number
  roughness?: number
  envMapIntensity?: number
  clearcoat?: number
  clearcoatRoughness?: number
  transmission?: number
  transmissionMap?: string
  thickness?: number
  ior?: number
  iridescence?: number
  iridescenceIOR?: number
  sheen?: number
  sheenColor?: number | string
  sheenRoughness?: number
  specularIntensity?: number
  specularColor?: number | string
  reflectivity?: number
}

export interface LambertMaterialConfig extends BaseMaterialConfig {
  type: 'lambert'
  emissive?: string | number
}

export interface PhongMaterialConfig extends BaseMaterialConfig {
  type: 'phong'
  shininess?: number
}

export interface NormalMaterialConfig {
  type: 'normal'
  wireframe?: boolean
}

export interface DepthMaterialConfig {
  type: 'depth'
}

export interface ShadowMaterialConfig extends BaseMaterialConfig {
  type: 'shadow'
}

export interface ShaderMaterialConfig extends BaseMaterialConfig {
  type: 'shader'
  vertexShader?: string
  fragmentShader?: string
  uniforms?: Record<string, any>
}

export interface RawShaderMaterialConfig extends BaseMaterialConfig {
  type: 'rawShader'
  vertexShader?: string
  fragmentShader?: string
  uniforms?: Record<string, any>
}

export interface PointsMaterialConfig {
  type: 'points'
  color?: string | number
  size?: number
  sizeAttenuation?: boolean
  transparent?: boolean
  opacity?: number
  visible?: boolean
  alphaTest?: number
}

export interface CustomMaterialConfig {
  type: 'custom'
  instance: Material
}

export type MaterialConfig =
  | BasicMaterialConfig
  | StandardMaterialConfig
  | PhysicalMaterialConfig
  | LambertMaterialConfig
  | PhongMaterialConfig
  | NormalMaterialConfig
  | DepthMaterialConfig
  | ShadowMaterialConfig
  | ShaderMaterialConfig
  | RawShaderMaterialConfig
  | PointsMaterialConfig
  | CustomMaterialConfig

export interface MeshConfig extends Object3DConfig {
  geometry: GeometryConfig
  material: MaterialConfig
}

export type LightType = 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere' | 'rectArea'

export interface BaseLightConfig extends Object3DConfig {
  color?: string | number
  intensity?: number
}

export interface AmbientLightConfig extends BaseLightConfig {
  type: 'ambient'
}

export interface DirectionalLightConfig extends BaseLightConfig {
  type: 'directional'
  shadowMapSize?: [number, number]
  shadowCameraNear?: number
  shadowCameraFar?: number
  shadowCameraLeft?: number
  shadowCameraRight?: number
  shadowCameraTop?: number
  shadowCameraBottom?: number
}

export type BlendingMode = 'normal' | 'additive' | 'subtractive' | 'multiply' | 'screen'

export type BlendingFactor =
  | 'SrcAlpha'
  | 'OneMinusSrcAlpha'
  | 'One'
  | 'DstColor'
  | 'OneMinusDstColor'

export type SpriteClipMode = 'none' | 'circle' | 'rounded'

export interface SpriteMaterialConfig {
  type: 'sprite'
  color?: string | number
  map?: string | Texture
  alphaMap?: string | Texture
  rotation?: number
  fog?: boolean
  transparent?: boolean
  opacity?: number
  depthTest?: boolean
  depthWrite?: boolean
  sizeAttenuation?: boolean
  blending?: BlendingMode
  blendSrc?: BlendingFactor
  blendDst?: BlendingFactor
  tint?: string | number
  clip?: SpriteClipMode
  borderRadius?: number
  minDistance?: number
  maxDistance?: number
}

export interface SpriteConfig extends Object3DConfig {
  material: SpriteMaterialConfig
  center?: [number, number]
  renderOrder?: number
}

export interface PointLightConfig extends BaseLightConfig {
  type: 'point'
  distance?: number
  decay?: number
}

export interface SpotLightConfig extends BaseLightConfig {
  type: 'spot'
  angle?: number
  penumbra?: number
  distance?: number
  decay?: number
  shadowMapSize?: [number, number]
  shadowCameraNear?: number
  shadowCameraFar?: number
  shadowCameraFov?: number
}

export interface HemisphereLightConfig extends BaseLightConfig {
  type: 'hemisphere'
  groundColor?: string | number
}

export interface RectAreaLightConfig extends BaseLightConfig {
  type: 'rectArea'
  width?: number
  height?: number
}

export type LightConfig =
  | AmbientLightConfig
  | DirectionalLightConfig
  | PointLightConfig
  | SpotLightConfig
  | HemisphereLightConfig
  | RectAreaLightConfig

export interface CameraConfig extends Object3DConfig {
  fov?: number
  aspect?: number
  near?: number
  far?: number
}

export interface RendererConfig {
  antialias?: boolean
  alpha?: boolean
  clearColor?: string | number
  clearAlpha?: number
  shadowMap?:
    | boolean
    | {
        enabled: boolean
        type?: number
      }
  localClippingEnabled?: boolean
  clippingPlanes?: THREE.Plane[]
}

export interface GLTFLoaderConfig extends Object3DConfig {
  src: string
  draco?: boolean
  dracoDecoderPath?: string
}

export interface OBJLoaderConfig extends Object3DConfig {
  src: string
}

export interface FBXLoaderConfig extends Object3DConfig {
  src: string
}

export interface DRACOLoaderConfig {
  decoderPath?: string
}

export interface FlyControlsConfig {
  movementSpeed?: number
  rollSpeed?: number
  dragToLook?: boolean
  autoForward?: boolean
}

export interface FirstPersonControlsConfig {
  movementSpeed?: number
  lookSpeed?: number
  noFly?: boolean
  lookVertical?: boolean
  autoForward?: boolean
  activeLook?: boolean
  heightSpeed?: boolean
  heightCoef?: number
  heightMin?: number
  heightMax?: number
  constrainVertical?: boolean
  verticalMin?: number
  verticalMax?: number
  mouseDragOn?: boolean
}

export type CurveType =
  | 'arc'
  | 'ellipse'
  | 'bezier'
  | 'quadraticBezier'
  | 'catmullRom'
  | 'spline'
  | 'line'
  | 'lineLoop'
  | 'lineDashed'

export type ArcCurveArgs = [number?, number?, number?, number?, number?, boolean?]
export type EllipseCurveArgs = [
  number?,
  number?,
  number?,
  number?,
  number?,
  number?,
  number?,
  boolean?
]
export type BezierCurveArgs = [
  [number, number],
  [number, number],
  [number, number],
  [number, number]
]
export type QuadraticBezierCurveArgs = [[number, number], [number, number], [number, number]]
export type CatmullRomCurveArgs = Array<[number, number, number?]>
export type SplineCurveArgs = Array<[number, number]>

export interface ArcCurveConfig {
  type: 'arc'
  args?: ArcCurveArgs
  divisions?: number
}

export interface EllipseCurveConfig {
  type: 'ellipse'
  args?: EllipseCurveArgs
  divisions?: number
}

export interface BezierCurveConfig {
  type: 'bezier'
  args: BezierCurveArgs
  divisions?: number
}

export interface QuadraticBezierCurveConfig {
  type: 'quadraticBezier'
  args: QuadraticBezierCurveArgs
  divisions?: number
}

export interface CatmullRomCurveConfig {
  type: 'catmullRom'
  args: CatmullRomCurveArgs
  divisions?: number
  closed?: boolean
  curveType?: 'centripetal' | 'chordal' | 'catmullrom'
  tension?: number
}

export interface SplineCurveConfig {
  type: 'spline'
  args: SplineCurveArgs
  divisions?: number
}

export type CurveConfig =
  | ArcCurveConfig
  | EllipseCurveConfig
  | BezierCurveConfig
  | QuadraticBezierCurveConfig
  | CatmullRomCurveConfig
  | SplineCurveConfig

export type LineType = 'line' | 'lineLoop' | 'lineDashed'

export interface LineConfig extends Object3DConfig {
  curve?: CurveConfig
  geometry?: BufferGeometry
  color?: string | number
  linewidth?: number
  vertexColors?: boolean
}

export interface LineLoopConfig extends Object3DConfig {
  curve: CurveConfig
  color?: string | number
  linewidth?: number
}

export interface LineDashedConfig extends Object3DConfig {
  curve: CurveConfig
  color?: string | number
  linewidth?: number
  dashSize?: number
  gapSize?: number
}

export interface LineSegmentsConfig extends Object3DConfig {
  geometry: BufferGeometry
  color?: string | number
  linewidth?: number
  vertexColors?: boolean
}

export type ShapeHole = Array<[number, number]>

export interface ShapePathConfig {
  type: 'moveTo' | 'lineTo' | 'bezierCurveTo' | 'quadraticCurveTo' | 'arc' | 'ellipse'
  args: number[]
}

export interface ShapeConfig {
  curves: ShapePathConfig[]
  holes?: ShapeHole[]
}

export type TubeGeometryArgs = [number?, number?, number?, number?, boolean?]

export type LatheGeometryArgs = [number?, number?, number?, number?]

export type ExtrudeGeometryArgs = {
  depth?: number
  bevelEnabled?: boolean
  bevelThickness?: number
  bevelSize?: number
  bevelOffset?: number
  bevelSegments?: number
  curveSegments?: number
  steps?: number
}

export type TextGeometryArgs = {
  size?: number
  depth?: number
  curveSegments?: number
  bevelThickness?: number
  bevelSize?: number
  bevelEnabled?: boolean
}

export interface TextGeometryConfig {
  type: 'text'
  text: string
  font: any
  args?: TextGeometryArgs
}

export interface TubeGeometryConfig {
  type: 'tube'
  path: CurveConfig
  args?: TubeGeometryArgs
}

export interface LatheGeometryConfig {
  type: 'lathe'
  points: Array<[number, number]>
  args?: LatheGeometryArgs
}

export interface ShapeGeometryConfig {
  type: 'shape'
  shape: ShapeConfig
}

export interface ExtrudeGeometryConfig {
  type: 'extrude'
  shape: ShapeConfig
  args?: ExtrudeGeometryArgs
}

export interface SweepGeometryConfig {
  type: 'sweep'
  path: CurveConfig
  shape: ShapeConfig
}

export interface EdgesGeometryConfig {
  type: 'edges'
  geometry: GeometryConfig
  thresholdAngle?: number
}

export interface WireframeGeometryConfig {
  type: 'wireframe'
  geometry: GeometryConfig
}

export interface ConvexGeometryConfig {
  type: 'convex'
  vertices: [number, number, number][]
}

export type GeometryConfig =
  | BoxGeometryConfig
  | SphereGeometryConfig
  | PlaneGeometryConfig
  | CylinderGeometryConfig
  | TorusGeometryConfig
  | ConeGeometryConfig
  | IcosahedronGeometryConfig
  | CustomGeometryConfig
  | TubeGeometryConfig
  | LatheGeometryConfig
  | ShapeGeometryConfig
  | ExtrudeGeometryConfig
  | SweepGeometryConfig
  | EdgesGeometryConfig
  | WireframeGeometryConfig
  | ConvexGeometryConfig
  | TextGeometryConfig
