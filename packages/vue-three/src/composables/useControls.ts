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

  const controls = ctx.controls

  const update = () => {
    if (controls.value) {
      controls.value.update()
    }
  }

  const reset = () => {
    if (controls.value) {
      controls.value.reset()
    }
  }

  const saveState = () => {
    if (controls.value) {
      controls.value.saveState()
    }
  }

  const setTarget = (x: number, y: number, z: number) => {
    if (controls.value && 'target' in controls.value) {
      controls.value.target.set(x, y, z)
    }
  }

  const updateConfig = (newConfig: ControlsConfig) => {
    if (!controls.value) return

    if (newConfig.enableDamping !== undefined) {
      controls.value.enableDamping = newConfig.enableDamping
    }

    if (newConfig.dampingFactor !== undefined) {
      controls.value.dampingFactor = newConfig.dampingFactor
    }

    if (newConfig.enableZoom !== undefined) {
      controls.value.enableZoom = newConfig.enableZoom
    }

    if (newConfig.zoomSpeed !== undefined) {
      controls.value.zoomSpeed = newConfig.zoomSpeed
    }

    if (newConfig.enableRotate !== undefined) {
      controls.value.enableRotate = newConfig.enableRotate
    }

    if (newConfig.rotateSpeed !== undefined) {
      controls.value.rotateSpeed = newConfig.rotateSpeed
    }

    if (newConfig.enablePan !== undefined) {
      controls.value.enablePan = newConfig.enablePan
    }

    if (newConfig.panSpeed !== undefined) {
      controls.value.panSpeed = newConfig.panSpeed
    }

    if (newConfig.screenSpacePanning !== undefined) {
      controls.value.screenSpacePanning = newConfig.screenSpacePanning
    }

    if (newConfig.cursorStyle !== undefined) {
      controls.value.cursorStyle = newConfig.cursorStyle
    }

    if (newConfig.minDistance !== undefined) {
      controls.value.minDistance = newConfig.minDistance
    }

    if (newConfig.maxDistance !== undefined) {
      controls.value.maxDistance = newConfig.maxDistance
    }

    if (newConfig.minPolarAngle !== undefined) {
      controls.value.minPolarAngle = newConfig.minPolarAngle
    }

    if (newConfig.maxPolarAngle !== undefined) {
      controls.value.maxPolarAngle = newConfig.maxPolarAngle
    }

    if (newConfig.minAzimuthAngle !== undefined) {
      controls.value.minAzimuthAngle = newConfig.minAzimuthAngle
    }

    if (newConfig.maxAzimuthAngle !== undefined) {
      controls.value.maxAzimuthAngle = newConfig.maxAzimuthAngle
    }

    if (newConfig.autoRotate !== undefined) {
      controls.value.autoRotate = newConfig.autoRotate
    }

    if (newConfig.autoRotateSpeed !== undefined) {
      controls.value.autoRotateSpeed = newConfig.autoRotateSpeed
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
