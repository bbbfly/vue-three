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
import type { EllipseCurveArgs } from '../types'

/**
 * 椭圆曲线组件
 * @description 生成二维椭圆曲线
 * @component TEllipseCurve
 * @example
 * <TEllipseCurve :args="[0, 0, 1, 0.8, 0, Math.PI * 2, false, 0]" />
 */
const props = defineProps({
  /**
   * 椭圆曲线参数 [aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise?, aRotation?]
   * @default [0, 0, 1, 1, 0, Math.PI * 2, false, 0]
   */
  args: {
    type: Array as unknown as PropType<EllipseCurveArgs>,
    default: () => [0, 0, 1, 1, 0, Math.PI * 2, 0, 0]
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
  type: 'ellipse',
  args: props.args,
  divisions: props.divisions
})

watch(
  () => [props.args, props.divisions],
  ([newArgs, newDivisions]) => {
    updateCurve({
      type: 'ellipse',
      args: newArgs as EllipseCurveArgs,
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
