import type { Object3D, Mesh, Material, BufferGeometry, Texture, WebGLRenderer, Scene } from 'three'

export function disposeMaterial(material: Material): void {
  material.dispose()

  for (const key of Object.keys(material)) {
    const value = (material as any)[key]
    if (value && typeof value === 'object' && 'isTexture' in value) {
      value.dispose()
    }
  }
}

export function disposeGeometry(geometry: BufferGeometry): void {
  geometry.dispose()
}

export function disposeTexture(texture: Texture): void {
  texture.dispose()
}

export function disposeMesh(mesh: Mesh): void {
  if (mesh.geometry) {
    disposeGeometry(mesh.geometry)
  }

  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(disposeMaterial)
    } else {
      disposeMaterial(mesh.material)
    }
  }
}

export function disposeObject3D(object: Object3D, removeFromParent = true): void {
  object.traverse(child => {
    if ('isMesh' in child && child.isMesh) {
      disposeMesh(child as Mesh)
    }

    if ('isLight' in child && (child as any).dispose) {
      ;(child as any).dispose()
    }
  })

  if (removeFromParent && object.parent) {
    object.parent.remove(object)
  }
}

export function disposeScene(scene: Scene): void {
  const children = [...scene.children]
  children.forEach(child => disposeObject3D(child, false))
  scene.clear()
}

export function disposeRenderer(renderer: WebGLRenderer): void {
  renderer.dispose()
  renderer.forceContextLoss()
}

export function dispose(object: any): void {
  if (!object) return

  if ('isRenderer' in object && object.isRenderer) {
    disposeRenderer(object)
    return
  }

  if ('isScene' in object && object.isScene) {
    disposeScene(object)
    return
  }

  if ('isMesh' in object && object.isMesh) {
    disposeMesh(object)
    return
  }

  if ('isMaterial' in object && object.isMaterial) {
    disposeMaterial(object)
    return
  }

  if ('isGeometry' in object && object.isGeometry) {
    disposeGeometry(object)
    return
  }

  if ('isTexture' in object && object.isTexture) {
    disposeTexture(object)
    return
  }

  if ('isObject3D' in object && object.isObject3D) {
    disposeObject3D(object)
    return
  }

  if ('dispose' in object && typeof object.dispose === 'function') {
    object.dispose()
  }
}
