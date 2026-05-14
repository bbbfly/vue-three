<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch, computed } from 'vue'
import { useLineDashed } from '../composables/useLine'
import type { CurveConfig, Object3DConfig } from '../types'

/**
 * 虚线线条组件
 * @description 将曲线渲染为虚线线条
 * @component TLineDashed
 * @example
 * <TLineDashed :curve="{ type: 'arc' }" dashSize={0.5} gapSize={0.25} />
 */
const props = defineProps({
  /**
   * 曲线配置
   * @required 曲线配置对象
   */
  curve: {
    type: Object as PropType<CurveConfig>,
    required: true
  },
  /**
   * 线条颜色
   * @default 0xffffff
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 线条宽度（WebGL限制为1）
   * @default 1
   */
  linewidth: {
    type: Number,
    default: 1
  },
  /**
   * 虚线段长度
   * @default 1
   */
  dashSize: {
    type: Number,
    default: 1
  },
  /**
   * 虚线间隙长度
   * @default 1
   */
  gapSize: {
    type: Number,
    default: 1
  },
  /**
   * Object3D 公共配置
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  rotation: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  scale: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [1, 1, 1]
  },
  visible: {
    type: Boolean,
    default: true
  }
})

const lineDashedConfig = computed(() => ({
  curve: props.curve,
  color: props.color,
  linewidth: props.linewidth,
  dashSize: props.dashSize,
  gapSize: props.gapSize,
  position: props.position,
  rotation: props.rotation,
  scale: props.scale,
  visible: props.visible
}))

const { line, updateLineDashed } = useLineDashed(lineDashedConfig.value)

watch(
  lineDashedConfig,
  newConfig => {
    updateLineDashed(newConfig)
  },
  { deep: true }
)

/**
 * @expose
 * @property line - Three.js Line 实例（虚线）
 */
defineExpose({
  line
})
</script>
