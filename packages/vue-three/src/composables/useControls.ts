import { inject, onMounted, watch } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { ThreeContextKey } from '../core/context'
import type { Object3DConfig } from '../types'

export interface ControlsConfig extends Object3DConfig {
  enableDamping?: boolean
  dampingFactor?: number
  enableZoom?: boolean
  zoomSpeed?: number
  enableRotate?: boolean
  rotateSpeed?: number
  enablePan?: boolean
  panSpeed?: number
  screenSpacePanning?: boolean
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
  minAzimuthAngle?: number
  maxAzimuthAngle?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  cursorStyle?: string
  target?: [number, number, number]
}

export function useControls(config: ControlsConfig = {}) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useControls must be used within a TCanvas component')
  }

  // 获取初始 controls（响应式 context）
  let controls = ctx.controls

  const update = () => {
    if (controls) {
      controls.update()
    }
  }

  const reset = () => {
    if (controls) {
      controls.reset()
    }
  }

  const saveState = () => {
    if (controls) {
      controls.saveState()
    }
  }

  const setTarget = (x: number, y: number, z: number) => {
    if (controls && 'target' in controls) {
      controls.target.set(x, y, z)
    }
  }

  const updateConfig = (newConfig: ControlsConfig) => {
    if (!controls) return

    if (newConfig.enableDamping !== undefined) {
      controls.enableDamping = newConfig.enableDamping
    }

    if (newConfig.dampingFactor !== undefined) {
      controls.dampingFactor = newConfig.dampingFactor
    }

    if (newConfig.enableZoom !== undefined) {
      controls.enableZoom = newConfig.enableZoom
    }

    if (newConfig.zoomSpeed !== undefined) {
      controls.zoomSpeed = newConfig.zoomSpeed
    }

    if (newConfig.enableRotate !== undefined) {
      controls.enableRotate = newConfig.enableRotate
    }

    if (newConfig.rotateSpeed !== undefined) {
      controls.rotateSpeed = newConfig.rotateSpeed
    }

    if (newConfig.enablePan !== undefined) {
      controls.enablePan = newConfig.enablePan
    }

    if (newConfig.panSpeed !== undefined) {
      controls.panSpeed = newConfig.panSpeed
    }

    if (newConfig.screenSpacePanning !== undefined) {
      controls.screenSpacePanning = newConfig.screenSpacePanning
    }

    if (newConfig.cursorStyle !== undefined) {
      controls.cursorStyle = newConfig.cursorStyle
    }

    if (newConfig.minDistance !== undefined) {
      controls.minDistance = newConfig.minDistance
    }

    if (newConfig.maxDistance !== undefined) {
      controls.maxDistance = newConfig.maxDistance
    }

    if (newConfig.minPolarAngle !== undefined) {
      controls.minPolarAngle = newConfig.minPolarAngle
    }

    if (newConfig.maxPolarAngle !== undefined) {
      controls.maxPolarAngle = newConfig.maxPolarAngle
    }

    if (newConfig.minAzimuthAngle !== undefined) {
      controls.minAzimuthAngle = newConfig.minAzimuthAngle
    }

    if (newConfig.maxAzimuthAngle !== undefined) {
      controls.maxAzimuthAngle = newConfig.maxAzimuthAngle
    }

    if (newConfig.autoRotate !== undefined) {
      controls.autoRotate = newConfig.autoRotate
    }

    if (newConfig.autoRotateSpeed !== undefined) {
      controls.autoRotateSpeed = newConfig.autoRotateSpeed
    }

    if (newConfig.target) {
      setTarget(...newConfig.target)
    }
  }

  onMounted(() => {
    if (Object.keys(config).length > 0) {
      updateConfig(config)
    }
  })

  // 监听 controls 变化（响应式 context 更新）
  watch(
    () => ctx.controls,
    newControls => {
      controls = newControls
      if (controls && Object.keys(config).length > 0) {
        updateConfig(config)
      }
    }
  )

  // 监听相机变化，同步更新 controls 的 object
  watch(
    () => ctx.camera,
    newCamera => {
      if (controls && 'object' in controls) {
        controls.object = newCamera
      }
    }
  )

  watch(
    () => config,
    newConfig => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  return {
    controls,
    update,
    reset,
    saveState,
    setTarget
  }
}
