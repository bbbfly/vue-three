import { inject, shallowRef, watch, onMounted, type ComputedRef, isRef } from 'vue'
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

export function useCamera(configOrRef: CameraOptions | ComputedRef<CameraOptions> = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useCamera must be used within a TCanvas component')
  }

  // 支持普通对象或 ComputedRef 两种传入方式
  const getConfig = () => (isRef(configOrRef) ? configOrRef.value : configOrRef)
  const initialConfig = getConfig()

  // 组件内部自己创建新相机，不使用上下文中的旧相机
  const localCamera = shallowRef<Camera>(
    initialConfig.type === 'orthographic'
      ? new OrthographicCamera(
          initialConfig.left || -1,
          initialConfig.right || 1,
          initialConfig.top || 1,
          initialConfig.bottom || -1,
          initialConfig.near || 0.1,
          initialConfig.far || 1000
        )
      : new PerspectiveCamera(
          initialConfig.fov || 75,
          1,
          initialConfig.near || 0.1,
          initialConfig.far || 1000
        )
  )

  const setPosition = (x: number, y: number, z: number) => {
    localCamera.value.position.set(x, y, z)
  }

  const setRotation = (x: number, y: number, z: number) => {
    localCamera.value.rotation.set(x, y, z)
  }

  const lookAt = (x: number, y: number, z: number) => {
    localCamera.value.lookAt(new Vector3(x, y, z))
  }

  const updateProjectionMatrix = () => {
    if (
      localCamera.value instanceof PerspectiveCamera ||
      localCamera.value instanceof OrthographicCamera
    ) {
      localCamera.value.updateProjectionMatrix()
    }
  }

  const setFov = (fov: number) => {
    if (localCamera.value instanceof PerspectiveCamera) {
      localCamera.value.fov = fov
      updateProjectionMatrix()
    }
  }

  const setNear = (near: number) => {
    if (
      localCamera.value instanceof PerspectiveCamera ||
      localCamera.value instanceof OrthographicCamera
    ) {
      localCamera.value.near = near
      updateProjectionMatrix()
    }
  }

  const setFar = (far: number) => {
    if (
      localCamera.value instanceof PerspectiveCamera ||
      localCamera.value instanceof OrthographicCamera
    ) {
      localCamera.value.far = far
      updateProjectionMatrix()
    }
  }

  const setAspect = (aspect: number) => {
    if (localCamera.value instanceof PerspectiveCamera) {
      localCamera.value.aspect = aspect
      updateProjectionMatrix()
    }
  }

  const setLeft = (left: number) => {
    if (localCamera.value instanceof OrthographicCamera) {
      localCamera.value.left = left
      updateProjectionMatrix()
    }
  }

  const setRight = (right: number) => {
    if (localCamera.value instanceof OrthographicCamera) {
      localCamera.value.right = right
      updateProjectionMatrix()
    }
  }

  const setTop = (top: number) => {
    if (localCamera.value instanceof OrthographicCamera) {
      localCamera.value.top = top
      updateProjectionMatrix()
    }
  }

  const setBottom = (bottom: number) => {
    if (localCamera.value instanceof OrthographicCamera) {
      localCamera.value.bottom = bottom
      updateProjectionMatrix()
    }
  }

  const setZoom = (zoom: number) => {
    if (localCamera.value instanceof OrthographicCamera) {
      localCamera.value.zoom = zoom
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

    if (newConfig.fov !== undefined && localCamera.value instanceof PerspectiveCamera) {
      setFov(newConfig.fov)
    }

    if (newConfig.near !== undefined) {
      setNear(newConfig.near)
    }

    if (newConfig.far !== undefined) {
      setFar(newConfig.far)
    }

    if (newConfig.aspect !== undefined && localCamera.value instanceof PerspectiveCamera) {
      setAspect(newConfig.aspect)
    }

    if (newConfig.left !== undefined && localCamera.value instanceof OrthographicCamera) {
      setLeft(newConfig.left)
    }

    if (newConfig.right !== undefined && localCamera.value instanceof OrthographicCamera) {
      setRight(newConfig.right)
    }

    if (newConfig.top !== undefined && localCamera.value instanceof OrthographicCamera) {
      setTop(newConfig.top)
    }

    if (newConfig.bottom !== undefined && localCamera.value instanceof OrthographicCamera) {
      setBottom(newConfig.bottom)
    }

    if (newConfig.zoom !== undefined && localCamera.value instanceof OrthographicCamera) {
      setZoom(newConfig.zoom)
    }
  }

  if (Object.keys(initialConfig).length > 0) {
    updateConfig(initialConfig)
  }

  watch(
    () => getConfig(),
    newConfig => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  // 组件挂载时，调用 setCamera 把自己的相机注册为全局相机（后来者居上）
  onMounted(() => {
    ctx.setCamera(localCamera.value)
  })

  return {
    camera: localCamera,
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
