<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { BoxGeometryArgs } from '../types'

/**
 * 立方体几何体组件
 * @description 生成立方体几何形状，是最常用的基础几何体之一
 * @component TBox
 * @example
 * <TBox :args="[2, 2, 2]" />
 */
const props = defineProps({
  /**
   * 立方体几何体参数 [width, height, depth, widthSegments?, heightSegments?, depthSegments?]
   * @default [1, 1, 1]
   */
  args: {
    type: Array as unknown as PropType<BoxGeometryArgs>,
    default: () => [1, 1, 1]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'box',
  args: props.args
})

watch(
  () => props.args,
  newArgs => {
    updateGeometry({
      type: 'box',
      args: newArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js BoxGeometry 实例
 */
defineExpose({
  geometry
})
</script>
