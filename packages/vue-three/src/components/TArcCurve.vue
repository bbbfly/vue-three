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
import type { ArcCurveArgs } from '../types'

/**
 * 圆弧曲线组件
 * @description 生成二维圆弧曲线
 * @component TArcCurve
 * @example
 * <TArcCurve :args="[0, 0, 1, 0, Math.PI * 2, false]" />
 */
const props = defineProps({
  /**
   * 圆弧曲线参数 [aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise?]
   * @default [0, 0, 1, 0, Math.PI * 2, false]
   */
  args: {
    type: Array as unknown as PropType<ArcCurveArgs>,
    default: () => [0, 0, 1, 0, Math.PI * 2, 0]
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
  type: 'arc',
  args: props.args,
  divisions: props.divisions
})

watch(
  () => [props.args, props.divisions],
  ([newArgs, newDivisions]) => {
    updateCurve({
      type: 'arc',
      args: newArgs as ArcCurveArgs,
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
