<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { ConeGeometryArgs } from '../types'

/**
 * 圆锥体几何体组件
 * @description 生成圆锥体几何形状
 * @component TCone
 * @example
 * <TCone :args="[1, 2, 64]" />
 */
const props = defineProps({
  /**
   * 圆锥体几何体参数 [radius, height, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?]
   * @default [1, 2, 32]
   */
  args: {
    type: Array as unknown as PropType<ConeGeometryArgs>,
    default: () => [1, 2, 32]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'cone',
  args: props.args
})

watch(
  () => props.args,
  newArgs => {
    updateGeometry({
      type: 'cone',
      args: newArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js ConeGeometry 实例
 */
defineExpose({
  geometry
})
</script>
