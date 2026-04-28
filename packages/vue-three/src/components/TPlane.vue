<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { PlaneGeometryArgs } from '../types'

/**
 * 平面几何体组件
 * @description 生成平面几何形状，常用于地面、墙面等场景
 * @component TPlane
 * @example
 * <TPlane :args="[10, 10, 32, 32]" />
 */
const props = defineProps({
  /**
   * 平面几何体参数 [width, height, widthSegments?, heightSegments?]
   * @default [1, 1]
   */
  args: {
    type: Array as unknown as PropType<PlaneGeometryArgs>,
    default: () => [1, 1]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'plane',
  args: props.args
})

watch(
  () => props.args,
  newArgs => {
    updateGeometry({
      type: 'plane',
      args: newArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js PlaneGeometry 实例
 */
defineExpose({
  geometry
})
</script>
