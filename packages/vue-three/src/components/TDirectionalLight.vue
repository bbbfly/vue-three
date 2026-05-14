<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { useLight } from '../composables/useLight'
import type { DirectionalLightConfig } from '../types'

/**
 * 平行光组件
 * @description 平行光是具有方向的光源，光线互相平行，常用于模拟太阳光等远距离光源
 * @component TDirectionalLight
 * @example
 * <TDirectionalLight
 *   :color="0xffffff"
 *   :intensity="1"
 *   :position="[5, 5, 5]"
 *   :castShadow="true"
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
   * 光源位置坐标 [x, y, z]
   * @default [5, 5, 5]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [5, 5, 5]
  },
  /**
   * 是否投射阴影
   * @default false
   */
  castShadow: {
    type: Boolean,
    default: false
  }
})

const config: DirectionalLightConfig = {
  type: 'directional',
  color: props.color,
  intensity: props.intensity,
  position: props.position,
  castShadow: props.castShadow
}

const { light } = useLight(config)

/**
 * @expose
 * @property light - Three.js DirectionalLight 实例
 */
defineExpose({
  light
})
</script>
