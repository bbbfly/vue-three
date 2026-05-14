<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { ShapeConfig } from '../types'

/**
 * 轮廓填充几何体组件
 * @description 根据 2D 形状轮廓生成填充几何体
 * @component TShapeGeometry
 * @example
 * <TShapeGeometry :shape="{ curves: [{ type: 'moveTo', args: [0,0] }, { type: 'lineTo', args: [1,0] }] }" />
 */
const props = defineProps({
  /**
   * 形状配置
   * @required 形状路径配置，支持 curves 和 holes 配置
   */
  shape: {
    type: Object as PropType<ShapeConfig>,
    required: true
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'shape',
  shape: props.shape
})

watch(
  () => props.shape,
  newShape => {
    updateGeometry({
      type: 'shape',
      shape: newShape as ShapeConfig
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js ShapeGeometry 实例
 */
defineExpose({
  geometry
})
</script>
