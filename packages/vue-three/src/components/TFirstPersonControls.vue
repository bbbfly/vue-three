<template>
  <slot :controls="controls"></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { useFirstPersonControls } from '../composables/useFirstPersonControls'

/**
 * 第一人称控制器组件
 * @description 经典第一人称视角控制器，支持 WASD 移动、鼠标控制视角，带高度约束
 * @component TFirstPersonControls
 * @example
 * <TFirstPersonControls
 *   :movementSpeed="10"
 *   :lookSpeed="0.5"
 *   :noFly="true"
 *   :constrainVertical="true"
 * />
 */
const props = defineProps({
  /**
   * 移动速度
   * @default undefined
   */
  movementSpeed: {
    type: Number,
    default: undefined
  },
  /**
   * 视角旋转速度
   * @default undefined
   */
  lookSpeed: {
    type: Number,
    default: undefined
  },
  /**
   * 禁止飞行（固定高度）
   * @default undefined
   */
  noFly: {
    type: Boolean,
    default: undefined
  },
  /**
   * 允许垂直视角查看
   * @default undefined
   */
  lookVertical: {
    type: Boolean,
    default: undefined
  },
  /**
   * 是否自动向前移动
   * @default undefined
   */
  autoForward: {
    type: Boolean,
    default: undefined
  },
  /**
   * 激活视角控制
   * @default undefined
   */
  activeLook: {
    type: Boolean,
    default: undefined
  },
  /**
   * 启用高度相关速度变化
   * @default undefined
   */
  heightSpeed: {
    type: Boolean,
    default: undefined
  },
  /**
   * 高度速度系数
   * @default undefined
   */
  heightCoef: {
    type: Number,
    default: undefined
  },
  /**
   * 最小高度
   * @default undefined
   */
  heightMin: {
    type: Number,
    default: undefined
  },
  /**
   * 最大高度
   * @default undefined
   */
  heightMax: {
    type: Number,
    default: undefined
  },
  /**
   * 约束垂直角度
   * @default undefined
   */
  constrainVertical: {
    type: Boolean,
    default: undefined
  },
  /**
   * 垂直角度最小值（弧度）
   * @default undefined
   */
  verticalMin: {
    type: Number,
    default: undefined
  },
  /**
   * 垂直角度最大值（弧度）
   * @default undefined
   */
  verticalMax: {
    type: Number,
    default: undefined
  }
})

const { controls } = useFirstPersonControls(props)

defineExpose({
  controls
})
</script>
