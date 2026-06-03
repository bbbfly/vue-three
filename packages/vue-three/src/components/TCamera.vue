<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { computed } from 'vue'
import type { PropType } from 'vue'
import { useCamera } from '../composables/useCamera'
import type { CameraOptions } from '../composables/useCamera'

/**
 * 基础相机组件
 * @description 基础相机直接使用上下文中的相机，适用于全屏2D渲染场景或着色器全屏效果
 * @component TCamera
 * @example
 * <TCamera
 *   :position="[0, 0, 1]"
 *   :lookAtTarget="[0, 0, 0]"
 * />
 */
const props = defineProps({
  /**
   * 相机位置坐标 [x, y, z]
   * @default [0, 0, 1]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 1]
  },
  /**
   * 相机旋转角度 [x, y, z]，单位弧度
   * @default undefined
   */
  rotation: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: undefined
  },
  /**
   * 相机注视目标点坐标 [x, y, z]
   * @default [0, 0, 0]
   */
  lookAtTarget: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  }
})

const config = computed<CameraOptions>(() => ({
  position: props.position,
  rotation: props.rotation,
  lookAt: props.lookAtTarget
}))

const { camera, setPosition, setRotation, lookAt, updateProjectionMatrix } = useCamera(config)

/**
 * @expose
 * @property camera - Three.js Camera 实例
 * @property setPosition - 设置相机位置
 * @property setRotation - 设置相机旋转
 * @property lookAt - 让相机注视目标点
 * @property updateProjectionMatrix - 更新投影矩阵
 */
defineExpose({
  camera,
  setPosition,
  setRotation,
  lookAt,
  updateProjectionMatrix
})
</script>
