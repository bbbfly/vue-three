<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useLight } from '../composables/useLight'
import type { RectAreaLightConfig } from '../types'

/**
 * 区域光光源组件
 * @description 区域光是一种矩形平面光源，可产生柔和的区域照明效果
 * @component TRectAreaLight
 * @example
 * <TRectAreaLight
 *   :color="0xffffff"
 *   :intensity="5"
 *   :width="10"
 *   :height="10"
 *   :position="[0, 5, 0]"
 *   :rotation="[-Math.PI / 2, 0, 0]"
 * />
 */
const props = defineProps({
  /**
   * 光源颜色
   * @default 0xffffff (白色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 光源强度
   * @default 1
   */
  intensity: {
    type: Number,
    default: 1
  },
  /**
   * 光源宽度
   * @default 10
   */
  width: {
    type: Number,
    default: 10
  },
  /**
   * 光源高度
   * @default 10
   */
  height: {
    type: Number,
    default: 10
  },
  /**
   * 光源位置坐标 [x, y, z]
   * @default [0, 5, 0]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 5, 0]
  },
  /**
   * 光源旋转角度 [x, y, z]（弧度）
   * @default [-Math.PI / 2, 0, 0] (朝下照射)
   */
  rotation: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [-Math.PI / 2, 0, 0]
  }
})

const config: RectAreaLightConfig = {
  type: 'rectArea',
  color: props.color,
  intensity: props.intensity,
  width: props.width,
  height: props.height,
  position: props.position,
  rotation: props.rotation
}

const { light } = useLight(config)

/**
 * @expose
 * @property light - Three.js RectAreaLight 实例
 */
defineExpose({
  light
})
</script>
