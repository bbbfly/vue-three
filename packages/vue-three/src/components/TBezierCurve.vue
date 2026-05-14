<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { useCurve } from '../composables/useCurve'
import type { BezierCurveArgs } from '../types'

/**
 * 三次贝塞尔曲线组件
 * @description 生成二维三次贝塞尔曲线，由起点、两个控制点和终点定义
 * @component TBezierCurve
 * @example
 * <TBezierCurve :args="[[0, 0], [1, 1], [2, -1], [3, 0]]" />
 */
const props = defineProps({
  /**
   * 三次贝塞尔曲线参数 [[v0x, v0y], [v1x, v1y], [v2x, v2y], [v3x, v3y]]
   * @required 起点、两个控制点、终点坐标
   */
  args: {
    type: Array as unknown as PropType<BezierCurveArgs>,
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
  type: 'bezier',
  args: props.args,
  divisions: props.divisions
})

watch(
  () => [props.args, props.divisions],
  ([newArgs, newDivisions]) => {
    updateCurve({
      type: 'bezier',
      args: newArgs as BezierCurveArgs,
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
