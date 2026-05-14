<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'

/**
 * MeshNormalMaterial 材质组件
 * @description 显示几何体法线方向的材质，用于调试和可视化法线
 * @component TMeshNormalMaterial
 * @example
 * <TMesh>
 *   <TConeGeometry :args="[1, 2, 32]" />
 *   <TMeshNormalMaterial />
 * </TMesh>
 */
const props = defineProps({
  /**
   * 是否透明
   * @default false
   */
  transparent: {
    type: Boolean,
    default: false
  },
  /**
   * 透明度 (0-1)
   * @default 1
   */
  opacity: {
    type: Number,
    default: 1
  },
  /**
   * 是否显示为线框
   * @default false
   */
  wireframe: {
    type: Boolean,
    default: false
  },
  /**
   * 渲染面
   * @default undefined (使用默认值)
   */
  side: {
    type: Number,
    default: undefined
  },
  /**
   * 是否写入深度缓冲
   * @default undefined
   */
  depthWrite: {
    type: Boolean,
    default: undefined
  },
  /**
   * 是否启用平面着色
   * @default false
   */
  flatShading: {
    type: Boolean,
    default: false
  }
})

const { material } = useMaterial({
  type: 'normal',
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  side: props.side,
  depthWrite: props.depthWrite,
  flatShading: props.flatShading
})

/**
 * @expose
 * @property material - Three.js MeshNormalMaterial 实例
 */
defineExpose({
  material
})
</script>