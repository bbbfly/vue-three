<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { computed, inject, watch } from 'vue'
import type { PropType } from 'vue'
import { ArrayCamera, PerspectiveCamera, Vector3, Vector4, type Camera } from 'three'
import { ThreeContextKey } from '../core/context'

interface SubCameraConfig {
  fov?: number
  near?: number
  far?: number
  position?: [number, number, number]
  multiplyScalar?: number
  viewport?: {
    x: number
    y: number
    width: number
    height: number
  }
  lookAtTarget?: [number, number, number]
}

/**
 * 阵列相机组件
 * @description 阵列相机包含多个子相机，每个子相机渲染画布的不同区域，可实现分屏多视口效果
 * @component TArrayCamera
 * @example
 * <TArrayCamera :subCameras="[
 *   { fov: 75, position: [0, 0, 10], viewport: { x: 0, y: 0, width: 0.5, height: 1 } },
 *   { fov: 75, position: [10, 0, 10], viewport: { x: 0.5, y: 0, width: 0.5, height: 1 } }
 * ]" />
 */
const props = defineProps({
  /**
   * 子相机配置数组，每个元素定义一个子相机
   * @default []
   */
  subCameras: {
    type: Array as unknown as PropType<SubCameraConfig[]>,
    default: () => []
  }
})

const ctx = inject(ThreeContextKey)
if (!ctx) {
  throw new Error('TArrayCamera must be used within a TCanvas component')
}

// 组件内部创建 ArrayCamera
let arrayCamera: ArrayCamera = new ArrayCamera()

// 从配置创建子相机
const createSubCamerasFromConfig = (configs: SubCameraConfig[]) => {
  const { width, height } = ctx.size
  console.log(width, height, '-==')
  return configs.map(config => {
    const cam = new PerspectiveCamera(
      config.fov || 75,
      width / height,
      config.near || 0.1,
      config.far || 1000
    )
    if (config.position) {
      cam.position.set(...config.position)
    }
    if (config.viewport) {
      cam.viewport = new Vector4(
        config.viewport.x,
        config.viewport.y,
        config.viewport.width,
        config.viewport.height
      )
    }
    cam.lookAt(new Vector3(...(config.lookAtTarget || [0, 0, 0])))
    cam.position.multiplyScalar(config.multiplyScalar || 1)
    cam.updateProjectionMatrix()
    return cam
  })
}

// 更新阵列相机
const updateArrayCamera = () => {
  arrayCamera.cameras = createSubCamerasFromConfig(props.subCameras)
  ctx.setCamera(arrayCamera)
}

// 初始化
updateArrayCamera()

// 监听配置变更
watch(
  () => props.subCameras,
  () => {
    updateArrayCamera()
  },
  { deep: true }
)
watch([() => ctx.size.width, () => ctx.size.height], () => {
  updateArrayCamera()
})

/**
 * @expose
 * @property arrayCamera - Three.js ArrayCamera 实例
 * @property subCameras - 子相机数组
 * @property setPosition - 设置阵列相机位置
 * @property lookAt - 阵列相机注视目标点
 */
defineExpose({
  arrayCamera,
  subCameras: computed(() => arrayCamera.cameras)
})
</script>
