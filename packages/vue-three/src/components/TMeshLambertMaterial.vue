<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'

/**
 * Lambert材质组件
 * @description 一种非光泽表面材质，没有镜面高光，性能较好，适用于粗糙表面
 * @component TMeshLambertMaterial
 * @example
 * <TMeshLambertMaterial :color="0x00ff00" />
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
  type: 'lambert',
  color: props.color,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe
})

/**
 * @expose
 * @property material - Three.js MeshLambertMaterial 实例
 */
defineExpose({
  material
})
</script>
