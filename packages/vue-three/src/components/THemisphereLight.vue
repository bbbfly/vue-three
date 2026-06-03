<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { useLight } from '../composables/useLight'
import type { HemisphereLightConfig } from '../types'

/**
 * 半球光光源组件
 * @description 半球光源模拟环境光照效果，天空颜色从上到下，地面颜色从下到上
 * @component THemisphereLight
 * @example
 * <THemisphereLight
 *   :skyColor="0xffffff"
 *   :groundColor="0x444444"
 *   :intensity="1"
 *   :position="[0, 50, 0]"
 * />
 */
const props = defineProps({
  /**
   * 天空颜色（上半球颜色）
   * @default 0xffffff (白色)
   */
  skyColor: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 地面颜色（下半球颜色）
   * @default 0x000000 (黑色)
   */
  groundColor: {
    type: [String, Number] as PropType<string | number>,
    default: 0x000000
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
   * @default [0, 10, 0]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 10, 0]
  }
})

const config: HemisphereLightConfig = {
  type: 'hemisphere',
  color: props.skyColor,
  groundColor: props.groundColor,
  intensity: props.intensity,
  position: props.position
}

const { light } = useLight(config)

/**
 * @expose
 * @property light - Three.js HemisphereLight 实例
 */
defineExpose({
  light
})
</script>
