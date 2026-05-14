<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { useControls, type ControlsConfig } from '../composables/useControls'

/**
 * 轨道控制器组件
 * @description 允许用户通过鼠标交互控制相机，包括旋转、缩放、平移，是3D场景常用的交互方式
 * @component TOrbitControls
 * @example
 * <TOrbitControls
 *   :enableDamping="true"
 *   :dampingFactor="0.05"
 *   :enableZoom="true"
 *   :target="[0, 0, 0]"
 * />
 */
const props = defineProps({
  /**
   * 是否启用阻尼效果，启用后会有惯性
   * @default true
   */
  enableDamping: {
    type: Boolean,
    default: true
  },
  /**
   * 阻尼系数，数值越小阻尼越明显
   * @default 0.05
   */
  dampingFactor: {
    type: Number,
    default: 0.05
  },
  /**
   * 是否启用缩放
   * @default true
   */
  enableZoom: {
    type: Boolean,
    default: true
  },
  /**
   * 缩放速度
   * @default undefined
   */
  zoomSpeed: {
    type: Number,
    default: undefined
  },
  /**
   * 是否启用旋转
   * @default true
   */
  enableRotate: {
    type: Boolean,
    default: true
  },
  /**
   * 旋转速度
   * @default undefined
   */
  rotateSpeed: {
    type: Number,
    default: undefined
  },
  /**
   * 是否启用平移
   * @default true
   */
  enablePan: {
    type: Boolean,
    default: true
  },
  /**
   * 平移速度
   * @default undefined
   */
  panSpeed: {
    type: Number,
    default: undefined
  },
  /**
   * 是否启用屏幕空间平移（false 表示在世界空间平移）
   * @default undefined
   */
  screenSpacePanning: {
    type: Boolean,
    default: undefined
  },
  /**
   * 鼠标悬停样式，可选值: 'grab', 'pointer', 'default' 等
   * @default undefined
   */
  cursorStyle: {
    type: String,
    default: undefined
  },
  /**
   * 最小缩放距离
   * @default undefined
   */
  minDistance: {
    type: Number,
    default: undefined
  },
  /**
   * 最大缩放距离
   * @default undefined
   */
  maxDistance: {
    type: Number,
    default: undefined
  },
  /**
   * 最小极角（垂直旋转限制），单位弧度
   * @default undefined
   */
  minPolarAngle: {
    type: Number,
    default: undefined
  },
  /**
   * 最大极角（垂直旋转限制），单位弧度
   * @default undefined
   */
  maxPolarAngle: {
    type: Number,
    default: undefined
  },
  /**
   * 最小方位角（水平旋转限制），单位弧度
   * @default undefined
   */
  minAzimuthAngle: {
    type: Number,
    default: undefined
  },
  /**
   * 最大方位角（水平旋转限制），单位弧度
   * @default undefined
   */
  maxAzimuthAngle: {
    type: Number,
    default: undefined
  },
  /**
   * 是否启用自动旋转
   * @default undefined
   */
  autoRotate: {
    type: Boolean,
    default: undefined
  },
  /**
   * 自动旋转速度
   * @default undefined
   */
  autoRotateSpeed: {
    type: Number,
    default: undefined
  },
  /**
   * 控制器注视目标点 [x, y, z]
   * @default [0, 0, 0]
   */
  target: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  }
})

const config: ControlsConfig = {
  enableDamping: props.enableDamping,
  dampingFactor: props.dampingFactor,
  enableZoom: props.enableZoom,
  zoomSpeed: props.zoomSpeed,
  enableRotate: props.enableRotate,
  rotateSpeed: props.rotateSpeed,
  enablePan: props.enablePan,
  panSpeed: props.panSpeed,
  screenSpacePanning: props.screenSpacePanning,
  cursorStyle: props.cursorStyle,
  minDistance: props.minDistance,
  maxDistance: props.maxDistance,
  minPolarAngle: props.minPolarAngle,
  maxPolarAngle: props.maxPolarAngle,
  minAzimuthAngle: props.minAzimuthAngle,
  maxAzimuthAngle: props.maxAzimuthAngle,
  autoRotate: props.autoRotate,
  autoRotateSpeed: props.autoRotateSpeed,
  target: props.target
}

const { controls, update, reset, saveState, setTarget } = useControls(config)

/**
 * @expose
 * @property controls - Three.js OrbitControls 实例
 * @property update - 更新控制器状态
 * @property reset - 重置控制器到初始状态
 * @property saveState - 保存当前控制器状态
 * @property setTarget - 设置控制器注视目标
 */
defineExpose({
  controls,
  update,
  reset,
  saveState,
  setTarget
})
</script>
