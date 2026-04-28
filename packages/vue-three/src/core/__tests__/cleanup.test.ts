import { describe, it, expect, vi } from 'vitest'
import {
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Scene,
  Object3D,
  WebGLRenderer,
  Texture
} from 'three'
import {
  disposeMaterial,
  disposeGeometry,
  disposeTexture,
  disposeMesh,
  disposeObject3D,
  disposeScene,
  disposeRenderer,
  dispose
} from '../cleanup'

describe('cleanup utilities', () => {
  describe('disposeMaterial', () => {
    it('should call dispose on material', () => {
      const material = new MeshBasicMaterial()
      const disposeSpy = vi.spyOn(material, 'dispose')
      disposeMaterial(material)
      expect(disposeSpy).toHaveBeenCalled()
    })

    it('should dispose textures in material', () => {
      const texture = new Texture()
      const textureDisposeSpy = vi.spyOn(texture, 'dispose')
      const material = new MeshBasicMaterial({ map: texture })
      disposeMaterial(material)
      expect(textureDisposeSpy).toHaveBeenCalled()
    })
  })

  describe('disposeGeometry', () => {
    it('should call dispose on geometry', () => {
      const geometry = new BoxGeometry()
      const disposeSpy = vi.spyOn(geometry, 'dispose')
      disposeGeometry(geometry)
      expect(disposeSpy).toHaveBeenCalled()
    })
  })

  describe('disposeTexture', () => {
    it('should call dispose on texture', () => {
      const texture = new Texture()
      const disposeSpy = vi.spyOn(texture, 'dispose')
      disposeTexture(texture)
      expect(disposeSpy).toHaveBeenCalled()
    })
  })

  describe('disposeMesh', () => {
    it('should dispose geometry and material', () => {
      const geometry = new BoxGeometry()
      const material = new MeshBasicMaterial()
      const mesh = new Mesh(geometry, material)

      const geometryDisposeSpy = vi.spyOn(geometry, 'dispose')
      const materialDisposeSpy = vi.spyOn(material, 'dispose')

      disposeMesh(mesh)

      expect(geometryDisposeSpy).toHaveBeenCalled()
      expect(materialDisposeSpy).toHaveBeenCalled()
    })

    it('should handle multiple materials', () => {
      const geometry = new BoxGeometry()
      const material1 = new MeshBasicMaterial()
      const material2 = new MeshBasicMaterial()
      const mesh = new Mesh(geometry, [material1, material2])

      const material1DisposeSpy = vi.spyOn(material1, 'dispose')
      const material2DisposeSpy = vi.spyOn(material2, 'dispose')

      disposeMesh(mesh)

      expect(material1DisposeSpy).toHaveBeenCalled()
      expect(material2DisposeSpy).toHaveBeenCalled()
    })
  })

  describe('disposeObject3D', () => {
    it('should traverse and dispose child meshes', () => {
      const parent = new Object3D()
      const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial())
      parent.add(mesh)

      const geometryDisposeSpy = vi.spyOn(mesh.geometry, 'dispose')

      disposeObject3D(parent, false)

      expect(geometryDisposeSpy).toHaveBeenCalled()
    })

    it('should remove from parent when removeFromParent is true', () => {
      const parent = new Object3D()
      const child = new Object3D()
      parent.add(child)

      expect(parent.children).toContain(child)
      disposeObject3D(child, true)
      expect(parent.children).not.toContain(child)
    })
  })

  describe('disposeScene', () => {
    it('should dispose all children and clear scene', () => {
      const scene = new Scene()
      const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial())
      scene.add(mesh)

      const geometryDisposeSpy = vi.spyOn(mesh.geometry, 'dispose')

      disposeScene(scene)

      expect(geometryDisposeSpy).toHaveBeenCalled()
      expect(scene.children).toHaveLength(0)
    })
  })

  describe('disposeRenderer', () => {
    it('should dispose renderer and force context loss', () => {
      const mockRenderer = {
        dispose: vi.fn(),
        forceContextLoss: vi.fn(),
        isRenderer: true
      } as unknown as WebGLRenderer

      disposeRenderer(mockRenderer)

      expect(mockRenderer.dispose).toHaveBeenCalled()
      expect(mockRenderer.forceContextLoss).toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should return early for null/undefined', () => {
      expect(() => dispose(null)).not.toThrow()
      expect(() => dispose(undefined)).not.toThrow()
    })

    it('should dispose renderer', () => {
      const mockRenderer = {
        dispose: vi.fn(),
        forceContextLoss: vi.fn(),
        isRenderer: true
      } as unknown as WebGLRenderer

      dispose(mockRenderer)

      expect(mockRenderer.dispose).toHaveBeenCalled()
    })

    it('should dispose scene', () => {
      const scene = new Scene()
      const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial())
      scene.add(mesh)
      const geometryDisposeSpy = vi.spyOn(mesh.geometry, 'dispose')
      dispose(scene)
      expect(geometryDisposeSpy).toHaveBeenCalled()
    })

    it('should dispose mesh', () => {
      const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial())
      const geometryDisposeSpy = vi.spyOn(mesh.geometry, 'dispose')
      dispose(mesh)
      expect(geometryDisposeSpy).toHaveBeenCalled()
    })

    it('should dispose material', () => {
      const material = new MeshBasicMaterial()
      const disposeSpy = vi.spyOn(material, 'dispose')
      dispose(material)
      expect(disposeSpy).toHaveBeenCalled()
    })

    it('should dispose geometry', () => {
      const geometry = new BoxGeometry()
      const disposeSpy = vi.spyOn(geometry, 'dispose')
      dispose(geometry)
      expect(disposeSpy).toHaveBeenCalled()
    })

    it('should dispose texture', () => {
      const texture = new Texture()
      const disposeSpy = vi.spyOn(texture, 'dispose')
      dispose(texture)
      expect(disposeSpy).toHaveBeenCalled()
    })

    it('should dispose Object3D', () => {
      const object3D = new Object3D()
      const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial())
      object3D.add(mesh)
      const geometryDisposeSpy = vi.spyOn(mesh.geometry, 'dispose')
      dispose(object3D)
      expect(geometryDisposeSpy).toHaveBeenCalled()
    })
  })
})
