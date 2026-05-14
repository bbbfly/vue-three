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
import type { CatmullRomCurveArgs } from '../types'

/**
 * Catmull-Rom 样条曲线组件
 * @description 生成三维样条曲线，通过一系列点平滑插值
 * @component TCatmullRomCurve
 * @example
 * <TCatmullRomCurve :args="[[0, 0, 0], [1, 1, 0], [2, -1, 0], [3, 0, 0]]" />
 */
const props = defineProps({
  /**
   * 样条曲线点数组 [[x, y, z?], ...]
   * @required 插值点坐标
   */
  args: {
    type: Array as unknown as PropType<CatmullRomCurveArgs>,
    required: true
  },
  /**
   * 曲线点采样数
   * @default 50
   */
  divisions: {
    type: Number,
    default: 50
  },
  /**
   * 是否闭合曲线
   * @default false
   */
  closed: {
    type: Boolean,
    default: false
  },
  /**
   * 曲线类型：centripetal | chordal | catmullrom
   * @default 'catmullrom'
   */
  curveType: {
    type: String as () => 'centripetal' | 'chordal' | 'catmullrom',
    default: 'catmullrom'
  },
  /**
   * 曲线张力，0-1之间
   * @default 0.5
   */
  tension: {
    type: Number,
    default: 0.5
  }
})

const { curve, updateCurve } = useCurve({
  type: 'catmullRom',
  args: props.args,
  divisions: props.divisions,
  closed: props.closed,
  curveType: props.curveType,
  tension: props.tension
})

watch(
  () => [props.args, props.divisions, props.closed, props.curveType, props.tension],
  ([newArgs, newDivisions, newClosed, newCurveType, newTension]) => {
    updateCurve({
      type: 'catmullRom',
      args: newArgs as CatmullRomCurveArgs,
      divisions: newDivisions as number,
      closed: newClosed as boolean,
      curveType: newCurveType as 'centripetal' | 'chordal' | 'catmullrom',
      tension: newTension as number
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
