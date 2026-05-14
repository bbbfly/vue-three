<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { GridHelper } from 'three'
import { useHelper } from '../composables/useHelper'
import type { HelperConfig } from '../composables/useHelper'
import { watch, computed } from 'vue'

/**
 * 网格辅助线组件
 * @description 创建一个表示网格的辅助对象
 * @component TGridHelper
 * @example
 * <TGridHelper
 *   :size="400"
 *   :divisions="40"
 *   :color-center-line="0x0000ff"
 *   :color-grid="0x808080"
 *   :position="[-150, -150, 0]"
 * />
 */
const props = defineProps({
  /**
   * 网格尺寸
   * @default 100
   */
  size: {
    type: Number,
    default: 100
  },
  /**
   * 网格分割数
   * @default 10
   */
  divisions: {
    type: Number,
    default: 10
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
  return new GridHelper(
    props.size,
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
