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
import type { QuadraticBezierCurveArgs } from '../types'

/**
 * 二次贝塞尔曲线组件
 * @description 生成二维二次贝塞尔曲线，由起点、一个控制点和终点定义
 * @component TQuadraticBezierCurve
 * @example
 * <TQuadraticBezierCurve :args="[[0, 0], [1.5, 1], [3, 0]]" />
 */
const props = defineProps({
  /**
   * 二次贝塞尔曲线参数 [[v0x, v0y], [v1x, v1y], [v2x, v2y]]
   * @required 起点、控制点、终点坐标
   */
  args: {
    type: Array as unknown as PropType<QuadraticBezierCurveArgs>,
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
  type: 'quadraticBezier',
  args: props.args,
  divisions: props.divisions
})

watch(
  () => [props.args, props.divisions],
  ([newArgs, newDivisions]) => {
    updateCurve({
      type: 'quadraticBezier',
      args: newArgs as QuadraticBezierCurveArgs,
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
