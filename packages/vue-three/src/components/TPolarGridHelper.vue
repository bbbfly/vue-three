<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { PolarGridHelper } from 'three'
import { useHelper } from '../composables/useHelper'
import type { HelperConfig } from '../composables/useHelper'
import { watch, computed } from 'vue'

/**
 * 极坐标网格辅助线组件
 * @description 创建一个表示极坐标网格的辅助对象
 * @component TPolarGridHelper
 * @example
 * <TPolarGridHelper
 *   :radius="200"
 *   :radials="16"
 *   :circles="8"
 *   :divisions="64"
 *   :color-center-line="0x0000ff"
 *   :color-grid="0x808080"
 *   :position="[200, -150, 0]"
 * />
 */
const props = defineProps({
  /**
   * 极坐标网格半径
   * @default 50
   */
  radius: {
    type: Number,
    default: 50
  },
  /**
   * 径向线数量
   * @default 16
   */
  radials: {
    type: Number,
    default: 16
  },
  /**
   * 同心圆数量
   * @default 8
   */
  circles: {
    type: Number,
    default: 8
  },
  /**
   * 每个圆的分段数
   * @default 64
   */
  divisions: {
    type: Number,
    default: 64
  },
  /**
   * 中心线颜色
   * @default 0x444444
   */
  colorCenterLine: {
    type: [String, Number] as PropType<string | number>,
    default: 0x444444
  },
  /**
   * 网格线颜色
   * @default 0x888888
   */
  colorGrid: {
    type: [String, Number] as PropType<string | number>,
    default: 0x888888
  },
  /**
   * 位置坐标 [x, y, z]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 旋转角度 [x, y, z]（弧度）
   */
  rotation: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 缩放 [x, y, z]
   */
  scale: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [1, 1, 1]
  }
})

const helperInstance = computed(() => {
  return new PolarGridHelper(
    props.radius,
    props.radials,
    props.circles,
    props.divisions,
    props.colorCenterLine,
    props.colorGrid
  )
})

const config = computed<HelperConfig>(() => ({
  position: props.position,
  rotation: props.rotation,
  scale: props.scale
}))

const { helper, applyConfig } = useHelper(helperInstance)

watch(
  config,
  newConfig => {
    applyConfig(newConfig)
  },
  { deep: true, immediate: true }
)

defineExpose({
  helper
})
</script>
