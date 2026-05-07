<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { AxesHelper } from 'three'
import { useHelper } from '../composables/useHelper'
import type { HelperConfig } from '../composables/useHelper'
import { watch, computed } from 'vue'

/**
 * 坐标轴辅助线组件
 * @description 创建一个表示世界坐标轴的辅助对象，X轴为红色，Y轴为绿色，Z轴为蓝色
 * @component TAxesHelper
 * @example
 * <TAxesHelper :size="5" :position="[0, 0, 0]" />
 */
const props = defineProps({
  /**
   * 轴线长度
   * @default 1
   */
  size: {
    type: Number,
    default: 1
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
  return new AxesHelper(props.size)
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
  { deep: true }
)

/**
 * @expose
 * @property helper - Three.js AxesHelper 实例
 * @property applyConfig - 应用新配置
 */
defineExpose({
  helper,
  applyConfig
})
</script>
