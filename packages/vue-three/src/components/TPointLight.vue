<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { computed, watch } from 'vue'
import { useLight } from '../composables/useLight'
import type { PointLightConfig } from '../types'

/**
 * 点光源组件
 * @description 点光源从一个点向所有方向发射光线，如灯泡
 * @component TPointLight
 * @example
 * <TPointLight
 *   :color="0xffffff"
 *   :intensity="1"
 *   :position="[0, 5, 0]"
 *   :distance="10"
 *   :decay="2"
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
   * @default [0, 0, 0]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 光照最大距离，超出该距离的物体不受光照影响
   * @default 0 (无限远)
   */
  distance: {
    type: Number,
    default: 0
  },
  /**
   * 光照衰减系数
   * @default 2 (物理正确衰减)
   */
  decay: {
    type: Number,
    default: 2
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

const config = computed<PointLightConfig>(() => ({
  type: 'point',
  color: props.color,
  intensity: props.intensity,
  position: props.position,
  distance: props.distance,
  decay: props.decay,
  castShadow: props.castShadow
}))

const { light } = useLight(config.value)

watch(
  () => props.position,
  (newPosition) => {
    if (newPosition && light) {
      light.position.set(...newPosition)
    }
  },
  { deep: true }
)

/**
 * @expose
 * @property light - Three.js PointLight 实例
 */
defineExpose({
  light
})
</script>
