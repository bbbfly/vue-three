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
import type { LatheGeometryArgs } from '../types'

/**
 * 旋转成型几何体组件
 * @description 通过绕 Y 轴旋转一组点生成几何体
 * @component TLatheGeometry
 * @example
 * <TLatheGeometry :points="[[0, 0], [0.5, 0.5], [1, 1], [0.5, 1.5]]" />
 */
const props = defineProps({
  /**
   * 旋转截面点数组 [[x, y], ...]
   * @required 2D 截面点，绕 Y 轴旋转
   */
  points: {
    type: Array as PropType<Array<[number, number]>>,
    required: true
  },
  /**
   * 旋转几何体参数 [segments?, phiStart?, phiLength?]
   * @default [12, 0, Math.PI * 2]
   */
  args: {
    type: Array as unknown as PropType<LatheGeometryArgs>,
    default: () => [12, 0, Math.PI * 2]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'lathe',
  points: props.points,
  args: props.args
})

watch(
  () => [props.points, props.args],
  ([newPoints, newArgs]) => {
    updateGeometry({
      type: 'lathe',
      points: newPoints as Array<[number, number]>,
      args: newArgs as LatheGeometryArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js LatheGeometry 实例
 */
defineExpose({
  geometry
})
</script>
