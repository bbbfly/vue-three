<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { useLineMaterial } from '../composables/useLine'

/**
 * 线条基础材质组件
 * @description 用于 Line、LineLoop、LineSegments 的基础材质
 * @component TLineBasicMaterial
 * @example
 * <TLineBasicMaterial :color="0xff0000" :linewidth="1" />
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
   * 线条宽度（WebGL限制为1）
   * @default 1
   */
  linewidth: {
    type: Number,
    default: 1
  },
  /**
   * 是否启用顶点颜色
   * @default false
   */
  vertexColors: {
    type: Boolean,
    default: false
  },
  /**
   * 混合模式
   * @default THREE.NormalBlending
   */
  blending: {
    type: Number,
    default: undefined
  },
  /**
   * 是否启用深度测试
   * @default true
   */
  depthTest: {
    type: Boolean,
    default: true
  },
  /**
   * 是否写入深度缓冲
   * @default true
   */
  depthWrite: {
    type: Boolean,
    default: true
  }
})

const { material } = useLineMaterial({
  type: 'basic',
  color: props.color,
  transparent: props.transparent,
  opacity: props.opacity,
  linewidth: props.linewidth,
  vertexColors: props.vertexColors,
  blending: props.blending,
  depthTest: props.depthTest,
  depthWrite: props.depthWrite
})

/**
 * @expose
 * @property material - Three.js LineBasicMaterial 实例
 */
defineExpose({
  material
})
</script>
