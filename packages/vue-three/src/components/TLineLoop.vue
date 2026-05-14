<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch, computed } from 'vue'
import { useLineLoop } from '../composables/useLine'
import type { CurveConfig, Object3DConfig } from '../types'

/**
 * 闭环线条组件
 * @description 将曲线渲染为闭环线条
 * @component TLineLoop
 * @example
 * <TLineLoop :curve="{ type: 'arc', args: [0, 0, 1, 0, Math.PI, false] }" color="#00ff00" />
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

const lineLoopConfig = computed(() => ({
  curve: props.curve,
  color: props.color,
  linewidth: props.linewidth,
  position: props.position,
  rotation: props.rotation,
  scale: props.scale,
  visible: props.visible
}))

const { lineLoop, updateLineLoop } = useLineLoop(lineLoopConfig.value)

watch(
  lineLoopConfig,
  newConfig => {
    updateLineLoop(newConfig)
  },
  { deep: true }
)

/**
 * @expose
 * @property lineLoop - Three.js LineLoop 实例
 */
defineExpose({
  lineLoop
})
</script>
