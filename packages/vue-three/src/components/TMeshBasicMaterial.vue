<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'

/**
 * 基础材质组件
 * @description 一种简单的材质，不考虑光照影响，性能最高但视觉效果简单
 * @component TMeshBasicMaterial
 * @example
 * <TMeshBasicMaterial :color="0xff0000" :wireframe="false" />
 */
const props = defineProps({
  /**
   * 材质颜色
   * @default 0xffffff (白色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 是否启用透明度
   * @default false
   */
  transparent: {
    type: Boolean,
    default: false
  },
  /**
   * 透明度值，范围 0 到 1
   * @default 1 (不透明)
   */
  opacity: {
    type: Number,
    default: 1
  },
  /**
   * 是否以线框模式渲染
   * @default false
   */
  wireframe: {
    type: Boolean,
    default: false
  }
})

const { material } = useMaterial({
  type: 'basic',
  color: props.color,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe
})

/**
 * @expose
 * @property material - Three.js MeshBasicMaterial 实例
 */
defineExpose({
  material
})
</script>
