import { inject, watch, onMounted, type ComputedRef, isRef } from 'vue'
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
  let localCamera: Camera =
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

  const setPosition = (x: number, y: number, z: number) => {
    localCamera.position.set(x, y, z)
  }

  const setRotation = (x: number, y: number, z: number) => {
    localCamera.rotation.set(x, y, z)
  }

  const lookAt = (x: number, y: number, z: number) => {
    localCamera.lookAt(new Vector3(x, y, z))
  }

  const updateProjectionMatrix = () => {
    if (localCamera instanceof PerspectiveCamera || localCamera instanceof OrthographicCamera) {
      localCamera.updateProjectionMatrix()
    }
  }

  const setFov = (fov: number) => {
    if (localCamera instanceof PerspectiveCamera) {
      localCamera.fov = fov
      updateProjectionMatrix()
    }
  }

  const setNear = (near: number) => {
    if (localCamera instanceof PerspectiveCamera || localCamera instanceof OrthographicCamera) {
      localCamera.near = near
      updateProjectionMatrix()
    }
  }

  const setFar = (far: number) => {
    if (localCamera instanceof PerspectiveCamera || localCamera instanceof OrthographicCamera) {
      localCamera.far = far
      updateProjectionMatrix()
    }
  }

  const setAspect = (aspect: number) => {
    if (localCamera instanceof PerspectiveCamera) {
      localCamera.aspect = aspect
      updateProjectionMatrix()
    }
  }

  const setLeft = (left: number) => {
    if (localCamera instanceof OrthographicCamera) {
      localCamera.left = left
      updateProjectionMatrix()
    }
  }

  const setRight = (right: number) => {
    if (localCamera instanceof OrthographicCamera) {
      localCamera.right = right
      updateProjectionMatrix()
    }
  }

  const setTop = (top: number) => {
    if (localCamera instanceof OrthographicCamera) {
      localCamera.top = top
      updateProjectionMatrix()
    }
  }

  const setBottom = (bottom: number) => {
    if (localCamera instanceof OrthographicCamera) {
      localCamera.bottom = bottom
      updateProjectionMatrix()
    }
  }

  const setZoom = (zoom: number) => {
    if (localCamera instanceof OrthographicCamera) {
      localCamera.zoom = zoom
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

    if (newConfig.fov !== undefined && localCamera instanceof PerspectiveCamera) {
      setFov(newConfig.fov)
    }

    if (newConfig.near !== undefined) {
      setNear(newConfig.near)
    }

    if (newConfig.far !== undefined) {
      setFar(newConfig.far)
    }

    if (newConfig.aspect !== undefined && localCamera instanceof PerspectiveCamera) {
      setAspect(newConfig.aspect)
    }

    if (newConfig.left !== undefined && localCamera instanceof OrthographicCamera) {
      setLeft(newConfig.left)
    }

    if (newConfig.right !== undefined && localCamera instanceof OrthographicCamera) {
      setRight(newConfig.right)
    }

    if (newConfig.top !== undefined && localCamera instanceof OrthographicCamera) {
      setTop(newConfig.top)
    }

    if (newConfig.bottom !== undefined && localCamera instanceof OrthographicCamera) {
      setBottom(newConfig.bottom)
    }

    if (newConfig.zoom !== undefined && localCamera instanceof OrthographicCamera) {
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
    ctx.setCamera(localCamera)
  })

  // 监听全局相机变化（其他组件可能会调用 setCamera）
  watch(
    () => ctx.camera,
    (newCamera, oldCamera) => {
      if (newCamera !== localCamera) {
        // 全局相机已被其他组件替换
        localCamera = newCamera
      }
    }
  )

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
