<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { useCurve } from '../composables/useCurve'
import type { SplineCurveArgs } from '../types'

/**
 * 插值曲线组件
 * @description 通过一系列 2D 点生成平滑插值曲线
 * @component TSplineCurve
 * @example
 * <TSplineCurve :args="[[0, 0], [1, 1], [2, -1], [3, 0]]" :divisions="100" />
 */
const props = defineProps({
  /**
   * 插值曲线点数组 [[x, y], ...]
   * @required 2D 插值点坐标数组
   */
  args: {
    type: Array as unknown as PropType<SplineCurveArgs>,
    required: true
  },
  /**
   * 曲线点采样数
   * @default 50
   */
  divisions: {
    type: Number,
    default: 50
  }
})

const { curve, updateCurve } = useCurve({
  type: 'spline',
  args: props.args,
  divisions: props.divisions
})

watch(
  () => [props.args, props.divisions],
  ([newArgs, newDivisions]) => {
    updateCurve({
      type: 'spline',
      args: newArgs as SplineCurveArgs,
      divisions: newDivisions as number
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property curve - Three.js Curve 实例
 */
defineExpose({
  curve
})
</script>
