import { describe, it, expect } from 'vitest'
import {
  BoxGeometry,
  SphereGeometry,
  PlaneGeometry,
  CylinderGeometry,
  TorusGeometry,
  ConeGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshNormalMaterial,
  MeshDepthMaterial,
  BufferGeometry,
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  HemisphereLight,
  Mesh,
  Object3D
} from 'three'
import { ThreeObjectFactory } from '../factory'
import type { GeometryConfig, MaterialConfig, LightConfig } from '../../types'

describe('ThreeObjectFactory', () => {
  describe('createGeometry', () => {
    it('should create BoxGeometry for type "box"', () => {
      const config: GeometryConfig = { type: 'box', args: [1, 2, 3] }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBeInstanceOf(BoxGeometry)
    })

    it('should create SphereGeometry for type "sphere"', () => {
      const config: GeometryConfig = { type: 'sphere' }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBeInstanceOf(SphereGeometry)
    })

    it('should create PlaneGeometry for type "plane"', () => {
      const config: GeometryConfig = { type: 'plane' }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBeInstanceOf(PlaneGeometry)
    })

    it('should create CylinderGeometry for type "cylinder"', () => {
      const config: GeometryConfig = { type: 'cylinder' }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBeInstanceOf(CylinderGeometry)
    })

    it('should create TorusGeometry for type "torus"', () => {
      const config: GeometryConfig = { type: 'torus' }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBeInstanceOf(TorusGeometry)
    })

    it('should create ConeGeometry for type "cone"', () => {
      const config: GeometryConfig = { type: 'cone' }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBeInstanceOf(ConeGeometry)
    })

    it('should return custom buffer geometry for type "custom"', () => {
      const customBuffer = new BufferGeometry()
      const config: GeometryConfig = { type: 'custom', buffer: customBuffer }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBe(customBuffer)
    })

    it('should default to BoxGeometry for unknown type', () => {
      const config: GeometryConfig = { type: 'unknown' as any }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBeInstanceOf(BoxGeometry)
    })

    it('should handle empty args', () => {
      const config: GeometryConfig = { type: 'box' }
      const geometry = ThreeObjectFactory.createGeometry(config)
      expect(geometry).toBeInstanceOf(BoxGeometry)
    })
  })

  describe('createMaterial', () => {
    it('should create MeshBasicMaterial for type "basic"', () => {
      const config: MaterialConfig = { type: 'basic', color: 0xff0000 }
      const material = ThreeObjectFactory.createMaterial(config)
      expect(material).toBeInstanceOf(MeshBasicMaterial)
    })

    it('should create MeshStandardMaterial for type "standard"', () => {
      const config: MaterialConfig = { type: 'standard', color: 0xff0000 }
      const material = ThreeObjectFactory.createMaterial(config)
      expect(material).toBeInstanceOf(MeshStandardMaterial)
    })

    it('should create MeshLambertMaterial for type "lambert"', () => {
      const config: MaterialConfig = { type: 'lambert', color: 0xff0000 }
      const material = ThreeObjectFactory.createMaterial(config)
      expect(material).toBeInstanceOf(MeshLambertMaterial)
    })

    it('should create MeshPhongMaterial for type "phong"', () => {
      const config: MaterialConfig = { type: 'phong', color: 0xff0000 }
      const material = ThreeObjectFactory.createMaterial(config)
      expect(material).toBeInstanceOf(MeshPhongMaterial)
    })

    it('should create MeshNormalMaterial for type "normal"', () => {
      const config: MaterialConfig = { type: 'normal' }
      const material = ThreeObjectFactory.createMaterial(config)
      expect(material).toBeInstanceOf(MeshNormalMaterial)
    })

    it('should create MeshDepthMaterial for type "depth"', () => {
      const config: MaterialConfig = { type: 'depth' }
      const material = ThreeObjectFactory.createMaterial(config)
      expect(material).toBeInstanceOf(MeshDepthMaterial)
    })

    it('should return custom material instance for type "custom"', () => {
      const customMaterial = new MeshBasicMaterial()
      const config: MaterialConfig = { type: 'custom', instance: customMaterial }
      const material = ThreeObjectFactory.createMaterial(config)
      expect(material).toBe(customMaterial)
    })

    it('should default to MeshBasicMaterial for unknown type', () => {
      const config: MaterialConfig = { type: 'unknown' as any }
      const material = ThreeObjectFactory.createMaterial(config)
      expect(material).toBeInstanceOf(MeshBasicMaterial)
    })

    it('should pass side option to material', () => {
      const config: MaterialConfig = { type: 'basic', side: 2 }
      const material = ThreeObjectFactory.createMaterial(config) as MeshBasicMaterial
      expect(material.side).toBe(2)
    })
  })

  describe('createLight', () => {
    it('should create AmbientLight for type "ambient"', () => {
      const config: LightConfig = { type: 'ambient', color: 0xffffff }
      const light = ThreeObjectFactory.createLight(config)
      expect(light).toBeInstanceOf(AmbientLight)
    })

    it('should create DirectionalLight for type "directional"', () => {
      const config: LightConfig = { type: 'directional', color: 0xffffff }
      const light = ThreeObjectFactory.createLight(config)
      expect(light).toBeInstanceOf(DirectionalLight)
    })

    it('should create PointLight for type "point"', () => {
      const config: LightConfig = { type: 'point', color: 0xffffff }
      const light = ThreeObjectFactory.createLight(config)
      expect(light).toBeInstanceOf(PointLight)
    })

    it('should create SpotLight for type "spot"', () => {
      const config: LightConfig = { type: 'spot', color: 0xffffff }
      const light = ThreeObjectFactory.createLight(config)
      expect(light).toBeInstanceOf(SpotLight)
    })

    it('should create HemisphereLight for type "hemisphere"', () => {
      const config: LightConfig = { type: 'hemisphere', color: 0xffffff }
      const light = ThreeObjectFactory.createLight(config)
      expect(light).toBeInstanceOf(HemisphereLight)
    })

    it('should default to AmbientLight for unknown type', () => {
      const config: LightConfig = { type: 'unknown' as any }
      const light = ThreeObjectFactory.createLight(config)
      expect(light).toBeInstanceOf(AmbientLight)
    })
  })

  describe('createMesh', () => {
    it('should create a Mesh with geometry and material', () => {
      const meshConfig = {
        geometry: { type: 'box' as const },
        material: { type: 'basic' as const }
      }
      const mesh = ThreeObjectFactory.createMesh(meshConfig)
      expect(mesh).toBeInstanceOf(Mesh)
      expect(mesh.geometry).toBeInstanceOf(BoxGeometry)
      expect(mesh.material).toBeInstanceOf(MeshBasicMaterial)
    })
  })

  describe('applyObject3DConfig', () => {
    it('should apply position to Object3D', () => {
      const object = new Object3D()
      const config = { position: [1, 2, 3] as [number, number, number] }
      ThreeObjectFactory.applyObject3DConfig(object, config)
      expect(object.position.x).toBe(1)
      expect(object.position.y).toBe(2)
      expect(object.position.z).toBe(3)
    })

    it('should apply rotation to Object3D', () => {
      const object = new Object3D()
      const config = { rotation: [Math.PI / 2, 0, 0] as [number, number, number] }
      ThreeObjectFactory.applyObject3DConfig(object, config)
      expect(object.rotation.x).toBe(Math.PI / 2)
    })

    it('should apply scale to Object3D', () => {
      const object = new Object3D()
      const config = { scale: [2, 2, 2] as [number, number, number] }
      ThreeObjectFactory.applyObject3DConfig(object, config)
      expect(object.scale.x).toBe(2)
    })

    it('should apply name to Object3D', () => {
      const object = new Object3D()
      const config = { name: 'test-object' }
      ThreeObjectFactory.applyObject3DConfig(object, config)
      expect(object.name).toBe('test-object')
    })

    it('should apply visibility to Object3D', () => {
      const object = new Object3D()
      const config = { visible: false }
      ThreeObjectFactory.applyObject3DConfig(object, config)
      expect(object.visible).toBe(false)
    })

    it('should apply castShadow to Mesh', () => {
      const mesh = new Mesh()
      const config = { castShadow: true }
      ThreeObjectFactory.applyObject3DConfig(mesh, config)
      expect(mesh.castShadow).toBe(true)
    })

    it('should apply receiveShadow to Mesh', () => {
      const mesh = new Mesh()
      const config = { receiveShadow: true }
      ThreeObjectFactory.applyObject3DConfig(mesh, config)
      expect(mesh.receiveShadow).toBe(true)
    })

    it('should apply userData to Object3D', () => {
      const object = new Object3D()
      const config = { userData: { test: 'value' } }
      ThreeObjectFactory.applyObject3DConfig(object, config)
      expect(object.userData.test).toBe('value')
    })
  })

  describe('updateObject3DConfig', () => {
    it('should update position on Object3D', () => {
      const object = new Object3D()
      const config = { position: [1, 2, 3] as [number, number, number] }
      ThreeObjectFactory.updateObject3DConfig(object, config)
      expect(object.position.x).toBe(1)
      expect(object.position.y).toBe(2)
      expect(object.position.z).toBe(3)
    })
  })
})
