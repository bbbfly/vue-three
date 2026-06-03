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
import type { TorusKnotGeometryArgs } from '../types'

/**
 * 圆环结几何体组件
 * @description 生成圆环结几何形状，是一个数学上定义的曲线
 * @component TTorusKnotGeometry
 * @example
 * <TTorusKnotGeometry :args="[0.4, 0.08, 95, 20]" />
 */
const props = defineProps({
  /**
   * 圆环结几何体参数 [radius, tube, radialSegments?, tubularSegments?, p?, q?]
   * - radius: 圆环结半径，默认 1
   * - tube: 管径，默认 0.4
   * - radialSegments: 径向分段数，默认 12
   * - tubularSegments: 管分段数，默认 64
   * - p: 缠绕数，默认 2
   * - q: 缠绕数，默认 3
   * @default [1, 0.4, 12, 64]
   */
  args: {
    type: Array as unknown as PropType<TorusKnotGeometryArgs>,
    default: () => [1, 0.4, 12, 64]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'torusKnot',
  args: props.args
})

watch(
  () => props.args,
  newArgs => {
    updateGeometry({
      type: 'torusKnot',
      args: newArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js TorusKnotGeometry 实例
 */
defineExpose({
  geometry
})
</script>
