<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import { computed } from 'vue'
import type { PropType } from 'vue'
import { useCamera } from '../composables/useCamera'
import type { CameraOptions } from '../composables/useCamera'

/**
 * 透视相机组件
 * @description 透视相机使用透视投影，模拟人眼视觉效果，近大远小，是3D场景中最常用的相机类型
 * @component TPerspectiveCamera
 * @example
 * <TPerspectiveCamera
 *   :fov="75"
 *   :near="0.1"
 *   :far="1000"
 *   :position="[0, 0, 5]"
 *   :lookAtTarget="[0, 0, 0]"
 * />
 */
const props = defineProps({
  /**
   * 视场角，单位度，定义相机视野的垂直角度
   * @default 75
   */
  fov: {
    type: Number,
    default: 75
  },
  /**
   * 近裁剪面距离
   * @default 0.1
   */
  near: {
    type: Number,
    default: 0.1
  },
  /**
   * 远裁剪面距离
   * @default 1000
   */
  far: {
    type: Number,
    default: 1000
  },
  /**
   * 相机位置坐标 [x, y, z]
   * @default [0, 0, 5]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 5]
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
  },
  /**
   * 宽高比，默认自动适配画布尺寸
   * @default undefined
   */
  aspect: {
    type: Number,
    default: undefined
  }
})

const config = computed<CameraOptions>(() => ({
  type: 'perspective',
  fov: props.fov,
  near: props.near,
  far: props.far,
  position: props.position,
  rotation: props.rotation,
  lookAt: props.lookAtTarget,
  aspect: props.aspect
}))

const {
  camera,
  setPosition,
  setRotation,
  lookAt,
  setFov,
  setNear,
  setFar,
  setAspect,
  updateProjectionMatrix
} = useCamera(config)

/**
 * @expose
 * @property camera - Three.js PerspectiveCamera 实例
 * @property setPosition - 设置相机位置
 * @property setRotation - 设置相机旋转
 * @property lookAt - 让相机注视目标点
 * @property setFov - 设置视场角
 * @property setNear - 设置近裁剪面
 * @property setFar - 设置远裁剪面
 * @property setAspect - 设置宽高比
 * @property updateProjectionMatrix - 更新投影矩阵
 */
defineExpose({
  camera,
  setPosition,
  setRotation,
  lookAt,
  setFov,
  setNear,
  setFar,
  setAspect,
  updateProjectionMatrix
})
</script>
