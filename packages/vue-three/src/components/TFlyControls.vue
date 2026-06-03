<template>
  <slot :controls="controls"></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { useFlyControls } from '../composables/useFlyControls'

/**
 * 飞行控制器组件
 * @description 第一人称飞行风格控制器，支持 WASD 移动、鼠标视角控制
 * @component TFlyControls
 * @example
 * <TFlyControls
 *   :movementSpeed="10"
 *   :rollSpeed="0.5"
 *   :dragToLook="true"
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
   * 翻滚速度
   * @default undefined
   */
  rollSpeed: {
    type: Number,
    default: undefined
  },
  /**
   * 是否需要按住鼠标拖动来调整视角
   * @default undefined
   */
  dragToLook: {
    type: Boolean,
    default: true
  },
  /**
   * 是否自动向前移动
   * @default undefined
   */
  autoForward: {
    type: Boolean,
    default: undefined
  }
})

const { controls } = useFlyControls(props)

defineExpose({
  controls
})
</script>
