import {
  BoxGeometry,
  SphereGeometry,
  PlaneGeometry,
  CylinderGeometry,
  TorusGeometry,
  ConeGeometry,
  IcosahedronGeometry,
  BufferGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshNormalMaterial,
  MeshDepthMaterial,
  ShaderMaterial,
  PointsMaterial,
  Material,
  Mesh,
  Object3D,
  ArcCurve,
  EllipseCurve,
  CubicBezierCurve,
  QuadraticBezierCurve,
  CatmullRomCurve3,
  Vector2,
  Vector3,
  Curve,
  LineBasicMaterial,
  Line,
  LineLoop,
  LineSegments,
  LineDashedMaterial,
  BufferAttribute,
  Shape,
  Path,
  TubeGeometry,
  LatheGeometry,
  ShapeGeometry,
  ExtrudeGeometry,
  EdgesGeometry,
  WireframeGeometry,
  Sprite,
  SpriteMaterial,
  NormalBlending,
  AdditiveBlending,
  SubtractiveBlending,
  MultiplyBlending,
  CustomBlending,
  SrcAlphaFactor,
  OneMinusSrcAlphaFactor,
  OneFactor,
  DstColorFactor,
  OneMinusDstColorFactor,
  TextureLoader
} from 'three'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import type { ShapeConfig } from '../types'
import type {
  GeometryConfig,
  MaterialConfig,
  MeshConfig,
  Object3DConfig,
  LightConfig,
  CurveConfig,
  LineConfig,
  LineLoopConfig,
  LineDashedConfig,
  SpriteConfig,
  SpriteMaterialConfig,
  BlendingMode,
  BlendingFactor
} from '../types'
import {
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  HemisphereLight,
  RectAreaLight
} from 'three'

export class ThreeObjectFactory {
  static createGeometry(config: GeometryConfig): BufferGeometry {
    switch (config.type) {
      case 'box':
        return new BoxGeometry(...(config.args || []))
      case 'sphere':
        return new SphereGeometry(...(config.args || []))
      case 'plane':
        return new PlaneGeometry(...(config.args || []))
      case 'cylinder':
        return new CylinderGeometry(...(config.args || []))
      case 'torus':
        return new TorusGeometry(...(config.args || []))
      case 'cone':
        return new ConeGeometry(...(config.args || []))
      case 'icosahedron':
        return new IcosahedronGeometry(...(config.args || []))
      case 'tube': {
        const path = this.createCurve(config.path)
        const [tubularSegments = 64, radius = 1, radialSegments = 8] = config.args || []
        const closedArg = config.args?.[4]
        const closed = Number(closedArg) === 1 ? true : Boolean(closedArg)
        return new TubeGeometry(path, tubularSegments, radius, radialSegments, closed)
      }
      case 'lathe': {
        const points = config.points.map(p => new Vector2(...p))
        const [segments = 12, phiStart = 0, phiLength = Math.PI * 2] = config.args || []
        return new LatheGeometry(points, segments, phiStart, phiLength)
      }
      case 'shape': {
        const shape = this.createShape(config.shape)
        return new ShapeGeometry(shape)
      }
      case 'extrude': {
        if (!config.shape) {
          console.error('createGeometry: extrude config.shape is undefined or null', config)
          return new ExtrudeGeometry(new Shape(), config.args || {})
        }
        const shape = this.createShape(config.shape)
        return new ExtrudeGeometry(shape, config.args || {})
      }
      case 'edges': {
        const geometry = this.createGeometry(config.geometry)
        return new EdgesGeometry(geometry, config.thresholdAngle || 1)
      }
      case 'wireframe': {
        const geometry = this.createGeometry(config.geometry)
        return new WireframeGeometry(geometry)
      }
      case 'sweep': {
        const path = this.createCurve(config.path)
        const tubularSegments = config.tubularSegments || 64
        const radialSegments = config.radialSegments || 8
        const closed = config.closed || false
        return new TubeGeometry(path, tubularSegments, 1, radialSegments, closed)
      }
      case 'convex': {
        const vertices = config.vertices.map(v => new Vector3(v[0], v[1], v[2]))
        return new ConvexGeometry(vertices)
      }
      case 'text': {
        const textConfig = config as any
        if (!textConfig.text || !textConfig.font) {
          console.error('createGeometry: text config requires text and font', config)
          return new BoxGeometry()
        }
        return new TextGeometry(textConfig.text, {
          font: textConfig.font,
          size: textConfig.args?.size || 100,
          depth: textConfig.args?.depth || 50,
          curveSegments: textConfig.args?.curveSegments || 12,
          bevelThickness: textConfig.args?.bevelThickness || 10,
          bevelSize: textConfig.args?.bevelSize || 8,
          bevelEnabled: textConfig.args?.bevelEnabled || false
        })
      }
      default:
        return new BoxGeometry()
    }
  }

  static createMaterial(config: MaterialConfig): Material {
    switch (config.type) {
      case 'basic': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, side, blending, premultipliedAlpha, map, ...rest } = config
        const options: any = { ...rest }
        if (side !== undefined) {
          options.side = side
        }
        if (blending !== undefined) {
          options.blending = blending
        }
        if (premultipliedAlpha !== undefined) {
          options.premultipliedAlpha = premultipliedAlpha
        }
        if (map !== undefined) {
          if (typeof map === 'string') {
            const loader = new TextureLoader()
            options.map = loader.load(map)
          } else {
            options.map = map
          }
        }
        return new MeshBasicMaterial(options)
      }
      case 'standard': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, side, map, ...rest } = config
        const options: any = { ...rest }
        if (side !== undefined) {
          options.side = side
        }
        if (map !== undefined) {
          if (typeof map === 'string') {
            const loader = new TextureLoader()
            options.map = loader.load(map)
          } else {
            options.map = map
          }
        }
        return new MeshStandardMaterial(options)
      }
      case 'physical': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, side, map, ...rest } = config
        const options: any = { ...rest }
        if (side !== undefined) {
          options.side = side
        }
        if (map !== undefined) {
          if (typeof map === 'string') {
            const loader = new TextureLoader()
            options.map = loader.load(map)
          } else {
            options.map = map
          }
        }
        return new MeshPhysicalMaterial(options)
      }
      case 'lambert': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, side, depthWrite, flatShading, ...rest } = config
        const options: any = { ...rest }
        if (side !== undefined) {
          options.side = side
        }
        if (depthWrite !== undefined) {
          options.depthWrite = depthWrite
        }
        if (flatShading !== undefined) {
          options.flatShading = flatShading
        }
        return new MeshLambertMaterial(options)
      }
      case 'phong': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, side, depthWrite, flatShading, ...rest } = config
        const options: any = { ...rest }
        if (side !== undefined) {
          options.side = side
        }
        if (depthWrite !== undefined) {
          options.depthWrite = depthWrite
        }
        if (flatShading !== undefined) {
          options.flatShading = flatShading
        }
        return new MeshPhongMaterial(options)
      }
      case 'normal': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, ...rest } = config
        return new MeshNormalMaterial(rest)
      }
      case 'depth':
        return new MeshDepthMaterial()
      case 'shader': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, side, blending, premultipliedAlpha, ...rest } = config
        const options: any = { ...rest }
        if (side !== undefined) {
          options.side = side
        }
        if (blending !== undefined) {
          options.blending = blending
        }
        if (premultipliedAlpha !== undefined) {
          options.premultipliedAlpha = premultipliedAlpha
        }
        return new ShaderMaterial(options)
      }
      case 'points': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, ...rest } = config
        return new PointsMaterial(rest)
      }
      case 'custom':
        return config.instance
      default:
        return new MeshBasicMaterial({ color: 0xffffff })
    }
  }

  static createMesh(config: MeshConfig): Mesh {
    const geometry = this.createGeometry(config.geometry)
    const material = this.createMaterial(config.material)
    const mesh = new Mesh(geometry, material)
    this.applyObject3DConfig(mesh, config)
    return mesh
  }

  static createLight(config: LightConfig): Object3D {
    switch (config.type) {
      case 'ambient': {
        const light = new AmbientLight(config.color, config.intensity)
        this.applyObject3DConfig(light, config)
        return light
      }
      case 'directional': {
        const light = new DirectionalLight(config.color, config.intensity)
        this.applyObject3DConfig(light, config)
        if (config.castShadow) {
          light.shadow.mapSize.width = 2048
          light.shadow.mapSize.height = 2048
          light.shadow.camera.near = 0.5
          light.shadow.camera.far = 50
          light.shadow.camera.left = -20
          light.shadow.camera.right = 20
          light.shadow.camera.top = 20
          light.shadow.camera.bottom = -20
        }
        return light
      }
      case 'point': {
        const light = new PointLight(config.color, config.intensity, config.distance, config.decay)
        this.applyObject3DConfig(light, config)
        return light
      }
      case 'spot': {
        const light = new SpotLight(
          config.color,
          config.intensity,
          config.distance,
          config.angle,
          config.penumbra,
          config.decay
        )
        this.applyObject3DConfig(light, config)
        return light
      }
      case 'hemisphere': {
        const light = new HemisphereLight(config.color, config.groundColor, config.intensity)
        this.applyObject3DConfig(light, config)
        return light
      }
      case 'rectArea': {
        const light = new RectAreaLight(config.color, config.intensity, config.width, config.height)
        this.applyObject3DConfig(light, config)
        return light
      }
      default:
        return new AmbientLight(0xffffff, 1)
    }
  }

  static applyObject3DConfig(object: Object3D, config: Object3DConfig): void {
    if (config.name) object.name = config.name

    if (config.position) {
      object.position.set(...config.position)
    }

    if (config.rotation) {
      object.rotation.set(...config.rotation)
    }

    if (config.scale) {
      object.scale.set(...config.scale)
    }

    if (config.visible !== undefined) {
      object.visible = config.visible
    }

    if (config.castShadow !== undefined && 'castShadow' in object) {
      ;(object as any).castShadow = config.castShadow
    }

    if (config.receiveShadow !== undefined && 'receiveShadow' in object) {
      ;(object as any).receiveShadow = config.receiveShadow
    }

    if (config.userData) {
      object.userData = { ...object.userData, ...config.userData }
    }
  }

  static updateObject3DConfig(object: Object3D, config: Partial<Object3DConfig>): void {
    if (config.name) object.name = config.name

    if (config.position) {
      object.position.set(...config.position)
    }

    if (config.rotation) {
      object.rotation.set(...config.rotation)
    }

    if (config.scale) {
      object.scale.set(...config.scale)
    }

    if (config.visible !== undefined) {
      object.visible = config.visible
    }

    if (config.castShadow !== undefined && 'castShadow' in object) {
      ;(object as any).castShadow = config.castShadow
    }

    if (config.receiveShadow !== undefined && 'receiveShadow' in object) {
      ;(object as any).receiveShadow = config.receiveShadow
    }

    if (config.userData) {
      object.userData = { ...object.userData, ...config.userData }
    }
  }

  static createCurve(config: CurveConfig): Curve<Vector3> {
    if (!config || !config.type) {
      config = { type: 'arc' }
    }

    switch (config.type) {
      case 'arc': {
        const [aX = 0, aY = 0, aRadius = 1, aStartAngle = 0, aEndAngle = Math.PI * 2] =
          (config.args as number[] | undefined) || []
        const aClockwiseArg = (config.args as number[] | undefined)?.[5]
        const aClockwise = Number(aClockwiseArg) === 1 ? true : Boolean(aClockwiseArg)
        const curve = new ArcCurve(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise)
        const points = curve.getPoints(config.divisions || 50)
        const points3D = points.map(p => new Vector3(p.x, p.y, 0))
        return new CatmullRomCurve3(points3D, false, 'catmullrom', 0)
      }
      case 'ellipse': {
        const [
          eX = 0,
          eY = 0,
          eXRadius = 1,
          eYRadius = 1,
          eStartAngle = 0,
          eEndAngle = Math.PI * 2
        ] = (config.args as number[] | undefined) || []
        const eClockwiseArg = (config.args as number[] | undefined)?.[6]
        const eRotationArg = (config.args as number[] | undefined)?.[7]
        const eClockwise = Number(eClockwiseArg) === 1 ? true : Boolean(eClockwiseArg)
        const eRotation = Number(eRotationArg) || 0
        const curve = new EllipseCurve(
          eX,
          eY,
          eXRadius,
          eYRadius,
          eStartAngle,
          eEndAngle,
          eClockwise,
          eRotation
        )
        const points = curve.getPoints(config.divisions || 50)
        const points3D = points.map(p => new Vector3(p.x, p.y, 0))
        return new CatmullRomCurve3(points3D, false, 'catmullrom', 0)
      }
      case 'bezier': {
        const [v0, v1, v2, v3] = config.args
        const curve = new CubicBezierCurve(
          new Vector2(...v0),
          new Vector2(...v1),
          new Vector2(...v2),
          new Vector2(...v3)
        )
        const points = curve.getPoints(config.divisions || 50)
        const points3D = points.map(p => new Vector3(p.x, p.y, 0))
        return new CatmullRomCurve3(points3D, false, 'catmullrom', 0)
      }
      case 'quadraticBezier': {
        const [v0, v1, v2] = config.args
        const curve = new QuadraticBezierCurve(
          new Vector2(...v0),
          new Vector2(...v1),
          new Vector2(...v2)
        )
        const points = curve.getPoints(config.divisions || 50)
        const points3D = points.map(p => new Vector3(p.x, p.y, 0))
        return new CatmullRomCurve3(points3D, false, 'catmullrom', 0)
      }
      case 'catmullRom': {
        const points = config.args.map(p => new Vector3(p[0], p[1], p[2] || 0))
        return new CatmullRomCurve3(
          points,
          config.closed || false,
          config.curveType || 'catmullrom',
          config.tension || 0.5
        )
      }
      case 'spline': {
        const points = config.args.map(p => new Vector3(p[0], p[1], 0))
        return new CatmullRomCurve3(points, false, 'catmullrom', 0.5)
      }
      default:
        return new CatmullRomCurve3([
          new Vector3(1, 0, 0),
          new Vector3(0, 1, 0),
          new Vector3(-1, 0, 0),
          new Vector3(0, -1, 0)
        ])
    }
  }

  static createLine(config: LineConfig): Line {
    let geometry: BufferGeometry

    if (config.geometry) {
      geometry = config.geometry
    } else {
      if (!config.curve) {
        config.curve = { type: 'arc' }
      }
      const curve = this.createCurve(config.curve)
      const divisions = config.curve.divisions || 50
      const points = curve.getPoints(divisions)
      geometry = new BufferGeometry().setFromPoints(points)
    }

    const material = new LineBasicMaterial({
      color: config.color || 0xffffff,
      linewidth: config.linewidth || 1,
      vertexColors: config.vertexColors || false
    })
    const line = new Line(geometry, material)
    this.applyObject3DConfig(line, config)
    return line
  }

  static createLineLoop(config: LineLoopConfig): LineLoop {
    if (!config.curve) {
      config.curve = { type: 'arc' }
    }
    const curve = this.createCurve(config.curve)
    const divisions = config.curve.divisions || 50
    const points = curve.getPoints(divisions)
    const geometry = new BufferGeometry().setFromPoints(points)
    const material = new LineBasicMaterial({
      color: config.color || 0xffffff,
      linewidth: config.linewidth || 1
    })
    const lineLoop = new LineLoop(geometry, material)
    this.applyObject3DConfig(lineLoop, config)
    return lineLoop
  }

  static createLineDashed(config: LineDashedConfig): Line {
    if (!config.curve) {
      config.curve = { type: 'arc' }
    }
    const curve = this.createCurve(config.curve)
    const divisions = config.curve.divisions || 50
    const points = curve.getPoints(divisions)
    const geometry = new BufferGeometry().setFromPoints(points)

    const positions = geometry.attributes.position.array as Float32Array
    const lineDistances = new Float32Array(positions.length / 3)
    for (let i = 1; i < lineDistances.length; i++) {
      const dx = positions[i * 3] - positions[(i - 1) * 3]
      const dy = positions[i * 3 + 1] - positions[(i - 1) * 3 + 1]
      const dz = positions[i * 3 + 2] - positions[(i - 1) * 3 + 2]
      lineDistances[i] = lineDistances[i - 1] + Math.sqrt(dx * dx + dy * dy + dz * dz)
    }
    geometry.setAttribute('lineDistance', new BufferAttribute(lineDistances, 1))

    const material = new LineDashedMaterial({
      color: config.color || 0xffffff,
      linewidth: config.linewidth || 1,
      dashSize: config.dashSize || 1,
      gapSize: config.gapSize || 1
    })
    const line = new Line(geometry, material)
    line.computeLineDistances()
    this.applyObject3DConfig(line, config)
    return line
  }

  static createLineSegments(config: any): LineSegments {
    const geometry = config.geometry || new BufferGeometry()
    const material = new LineBasicMaterial({
      color: config.color || 0xffffff,
      linewidth: config.linewidth || 1,
      vertexColors: config.vertexColors || false
    })
    const lineSegments = new LineSegments(geometry, material)
    this.applyObject3DConfig(lineSegments, config)
    return lineSegments
  }

  static createShape(config: ShapeConfig | Shape): Shape {
    if (config instanceof Shape) {
      return config
    }

    if (!config) {
      console.error('createShape: config is undefined or null')
      return new Shape()
    }

    if ('moveTo' in config && typeof config.moveTo === 'function') {
      return config as unknown as Shape
    }

    if (!config.curves) {
      console.error('createShape: Invalid config - missing curves property', config)
      return new Shape()
    }

    const shape = new Shape()

    config.curves.forEach(path => {
      switch (path.type) {
        case 'moveTo':
          shape.moveTo(path.args[0], path.args[1])
          break
        case 'lineTo':
          shape.lineTo(path.args[0], path.args[1])
          break
        case 'bezierCurveTo':
          shape.bezierCurveTo(
            path.args[0],
            path.args[1],
            path.args[2],
            path.args[3],
            path.args[4],
            path.args[5]
          )
          break
        case 'quadraticCurveTo':
          shape.quadraticCurveTo(path.args[0], path.args[1], path.args[2], path.args[3])
          break
        case 'arc':
          shape.arc(
            path.args[0],
            path.args[1],
            path.args[2],
            path.args[3],
            path.args[4],
            path.args[5] === 1 ? true : false
          )
          break
        case 'ellipse':
          ;(shape as any).ellipse(
            path.args[0],
            path.args[1],
            path.args[2],
            path.args[3],
            path.args[4],
            path.args[5],
            Number(path.args[6]) || 0,
            path.args[7] === 1 ? true : false
          )
          break
      }
    })

    if (config.holes) {
      config.holes.forEach(holePoints => {
        const holePath = new Path()
        if (holePoints.length > 0) {
          holePath.moveTo(holePoints[0][0], holePoints[0][1])
          for (let i = 1; i < holePoints.length; i++) {
            holePath.lineTo(holePoints[i][0], holePoints[i][1])
          }
          shape.holes.push(holePath)
        }
      })
    }

    return shape
  }

  static resolveBlendingMode(mode: BlendingMode): number {
    const blendingMap: Record<BlendingMode, number> = {
      normal: NormalBlending,
      additive: AdditiveBlending,
      subtractive: SubtractiveBlending,
      multiply: MultiplyBlending,
      screen: CustomBlending
    }
    return blendingMap[mode] ?? NormalBlending
  }

  static resolveBlendingFactor(factor: BlendingFactor): number {
    const factorMap: Record<BlendingFactor, number> = {
      SrcAlpha: SrcAlphaFactor,
      OneMinusSrcAlpha: OneMinusSrcAlphaFactor,
      One: OneFactor,
      DstColor: DstColorFactor,
      OneMinusDstColor: OneMinusDstColorFactor
    }
    return factorMap[factor] ?? SrcAlphaFactor
  }

  static createSpriteMaterial(config: SpriteMaterialConfig): SpriteMaterial {
    const material = new SpriteMaterial({
      color: config.color ?? 0xffffff,
      rotation: config.rotation ?? 0,
      fog: config.fog ?? false,
      transparent: config.transparent ?? true,
      opacity: config.opacity ?? 1,
      depthTest: config.depthTest ?? true,
      depthWrite: config.depthWrite ?? false,
      sizeAttenuation: config.sizeAttenuation ?? true
    })

    if (config.blending) {
      material.blending = this.resolveBlendingMode(config.blending) as any
      if (config.blending === 'multiply') {
        material.premultipliedAlpha = true
      }
    }

    if (config.blendSrc) {
      material.blendSrc = this.resolveBlendingFactor(config.blendSrc) as any
    }

    if (config.blendDst) {
      material.blendDst = this.resolveBlendingFactor(config.blendDst) as any
    }

    material.userData.clip = config.clip ?? 'none'
    material.userData.borderRadius = config.borderRadius ?? 0
    material.userData.tint = config.tint
    if (typeof config.minDistance === 'number' && config.minDistance > 0) {
      material.userData.minDistance = config.minDistance
    }
    if (typeof config.maxDistance === 'number' && isFinite(config.maxDistance)) {
      material.userData.maxDistance = config.maxDistance
    }

    return material
  }

  static createSprite(config: SpriteConfig): Sprite {
    const material = this.createSpriteMaterial(config.material)
    const sprite = new Sprite(material)

    this.applyObject3DConfig(sprite, config)

    if (config.center) {
      sprite.center.set(...config.center)
    }

    if (config.renderOrder !== undefined) {
      sprite.renderOrder = config.renderOrder
    }

    return sprite
  }
}
