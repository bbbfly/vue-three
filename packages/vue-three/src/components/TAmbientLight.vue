<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useLight } from '../composables/useLight'
import type { AmbientLightConfig } from '../types'

/**
 * 环境光组件
 * @description 环境光会均匀照亮场景中的所有物体，无方向和阴影，用于模拟环境中的漫反射光
 * @component TAmbientLight
 * @example
 * <TAmbientLight :color="0x404040" :intensity="0.5" />
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
  }
})

const config: AmbientLightConfig = {
  type: 'ambient',
  color: props.color,
  intensity: props.intensity
}

const { light } = useLight(config)

/**
 * @expose
 * @property light - Three.js AmbientLight 实例
 */
defineExpose({
  light
})
</script>
