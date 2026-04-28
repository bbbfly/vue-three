import { inject, shallowRef, watch } from 'vue'
import { Camera, PerspectiveCamera, OrthographicCamera, Vector3 } from 'three'
import { ThreeContextKey } from '../core/context'
import type { CameraConfig } from '../types'

export interface CameraOptions extends CameraConfig {
  type?: 'perspective' | 'orthographic'
  left?: number
  right?: number
  top?: number
  bottom?: number
  zoom?: number
  lookAt?: [number, number, number]
}

export function useCamera(config: CameraOptions = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useCamera must be used within a TCanvas component')
  }

  const camera = shallowRef<Camera>(ctx.camera.value)

  const setPosition = (x: number, y: number, z: number) => {
    camera.value.position.set(x, y, z)
  }

  const setRotation = (x: number, y: number, z: number) => {
    camera.value.rotation.set(x, y, z)
  }

  const lookAt = (x: number, y: number, z: number) => {
    camera.value.lookAt(new Vector3(x, y, z))
  }

  const updateProjectionMatrix = () => {
    if (camera.value instanceof PerspectiveCamera || camera.value instanceof OrthographicCamera) {
      camera.value.updateProjectionMatrix()
    }
  }

  const setFov = (fov: number) => {
    if (camera.value instanceof PerspectiveCamera) {
      camera.value.fov = fov
      updateProjectionMatrix()
    }
  }

  const setNear = (near: number) => {
    if (camera.value instanceof PerspectiveCamera || camera.value instanceof OrthographicCamera) {
      camera.value.near = near
      updateProjectionMatrix()
    }
  }

  const setFar = (far: number) => {
    if (camera.value instanceof PerspectiveCamera || camera.value instanceof OrthographicCamera) {
      camera.value.far = far
      updateProjectionMatrix()
    }
  }

  const setAspect = (aspect: number) => {
    if (camera.value instanceof PerspectiveCamera) {
      camera.value.aspect = aspect
      updateProjectionMatrix()
    }
  }

  const setLeft = (left: number) => {
    if (camera.value instanceof OrthographicCamera) {
      camera.value.left = left
      updateProjectionMatrix()
    }
  }

  const setRight = (right: number) => {
    if (camera.value instanceof OrthographicCamera) {
      camera.value.right = right
      updateProjectionMatrix()
    }
  }

  const setTop = (top: number) => {
    if (camera.value instanceof OrthographicCamera) {
      camera.value.top = top
      updateProjectionMatrix()
    }
  }

  const setBottom = (bottom: number) => {
    if (camera.value instanceof OrthographicCamera) {
      camera.value.bottom = bottom
      updateProjectionMatrix()
    }
  }

  const setZoom = (zoom: number) => {
    if (camera.value instanceof OrthographicCamera) {
      camera.value.zoom = zoom
      updateProjectionMatrix()
    }
  }

  const updateConfig = (newConfig: CameraOptions) => {
    if (newConfig.position) {
      setPosition(...newConfig.position)
    }

    if (newConfig.rotation) {
      setRotation(...newConfig.rotation)
    }

    if (newConfig.lookAt) {
      lookAt(...newConfig.lookAt)
    }

    if (newConfig.fov !== undefined && camera.value instanceof PerspectiveCamera) {
      setFov(newConfig.fov)
    }

    if (newConfig.near !== undefined) {
      setNear(newConfig.near)
    }

    if (newConfig.far !== undefined) {
      setFar(newConfig.far)
    }

    if (newConfig.aspect !== undefined && camera.value instanceof PerspectiveCamera) {
      setAspect(newConfig.aspect)
    }

    if (newConfig.left !== undefined && camera.value instanceof OrthographicCamera) {
      setLeft(newConfig.left)
    }

    if (newConfig.right !== undefined && camera.value instanceof OrthographicCamera) {
      setRight(newConfig.right)
    }

    if (newConfig.top !== undefined && camera.value instanceof OrthographicCamera) {
      setTop(newConfig.top)
    }

    if (newConfig.bottom !== undefined && camera.value instanceof OrthographicCamera) {
      setBottom(newConfig.bottom)
    }

    if (newConfig.zoom !== undefined && camera.value instanceof OrthographicCamera) {
      setZoom(newConfig.zoom)
    }
  }

  if (Object.keys(config).length > 0) {
    updateConfig(config)
  }

  watch(
    () => config,
    newConfig => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  return {
    camera,
    setPosition,
    setRotation,
    lookAt,
    setFov,
    setNear,
    setFar,
    setAspect,
    setLeft,
    setRight,
    setTop,
    setBottom,
    setZoom,
    updateProjectionMatrix
  }
}
