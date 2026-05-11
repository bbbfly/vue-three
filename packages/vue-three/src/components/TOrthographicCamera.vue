<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useCamera } from '../composables/useCamera'
import type { CameraOptions } from '../composables/useCamera'

/**
 * 正交相机组件
 * @description 正交相机使用正交投影，物体大小与距离无关，常用于2D渲染、工程图、等距视角等场景
 * @component TOrthographicCamera
 * @example
 * <TOrthographicCamera
 *   :left="-10"
 *   :right="10"
 *   :top="10"
 *   :bottom="-10"
 *   :near="0.1"
 *   :far="1000"
 *   :position="[0, 0, 5]"
 * />
 */
const props = defineProps({
  /**
   * 左裁剪面
   * @default -1
   */
  left: {
    type: Number,
    default: -1
  },
  /**
   * 右裁剪面
   * @default 1
   */
  right: {
    type: Number,
    default: 1
  },
  /**
   * 上裁剪面
   * @default 1
   */
  top: {
    type: Number,
    default: 1
  },
  /**
   * 下裁剪面
   * @default -1
   */
  bottom: {
    type: Number,
    default: -1
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
   * 缩放因子
   * @default 1
   */
  zoom: {
    type: Number,
    default: 1
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
  }
})

const config = computed<CameraOptions>(() => ({
  type: 'orthographic',
  left: props.left,
  right: props.right,
  top: props.top,
  bottom: props.bottom,
  near: props.near,
  far: props.far,
  zoom: props.zoom,
  position: props.position,
  rotation: props.rotation,
  lookAt: props.lookAtTarget
}))

const {
  camera,
  setPosition,
  setRotation,
  lookAt,
  setNear,
  setFar,
  setLeft,
  setRight,
  setTop,
  setBottom,
  setZoom,
  updateProjectionMatrix
} = useCamera(config)

/**
 * @expose
 * @property camera - Three.js OrthographicCamera 实例
 * @property setPosition - 设置相机位置
 * @property setRotation - 设置相机旋转
 * @property lookAt - 让相机注视目标点
 * @property setNear - 设置近裁剪面
 * @property setFar - 设置远裁剪面
 * @property setLeft - 设置左裁剪面
 * @property setRight - 设置右裁剪面
 * @property setTop - 设置上裁剪面
 * @property setBottom - 设置下裁剪面
 * @property setZoom - 设置缩放因子
 * @property updateProjectionMatrix - 更新投影矩阵
 */
defineExpose({
  camera,
  setPosition,
  setRotation,
  lookAt,
  setNear,
  setFar,
  setLeft,
  setRight,
  setTop,
  setBottom,
  setZoom,
  updateProjectionMatrix
})
</script>
