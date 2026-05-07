<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch, computed } from 'vue'
import { useLineSegments } from '../composables/useLine'
import type { CurveConfig, Object3DConfig } from '../types'
import type { BufferGeometry } from 'three'

/**
 * 线段渲染组件
 * @description 将自定义几何体渲染为线段，常用于显示几何体边缘
 * @component TLineSegments
 * @example
 * <TLineSegments>
 *   <TEdgesGeometry>
 *     <TBox :args="[1, 1, 1]" />
 *   </TEdgesGeometry>
 *   <TLineBasicMaterial :color="0xff0000" />
 * </TLineSegments>
 */
const props = defineProps({
  /**
   * 自定义 BufferGeometry
   */
  geometry: {
    type: Object as PropType<BufferGeometry>,
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
   * 是否启用顶点颜色
   * @default false
   */
  vertexColors: {
    type: Boolean,
    default: false
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

const lineSegmentsConfig = computed(() => ({
  geometry: props.geometry,
  color: props.color,
  linewidth: props.linewidth,
  vertexColors: props.vertexColors,
  position: props.position,
  rotation: props.rotation,
  scale: props.scale,
  visible: props.visible
}))

const { lineSegments, updateLineSegments } = useLineSegments(lineSegmentsConfig.value)

watch(
  lineSegmentsConfig,
  newConfig => {
    updateLineSegments(newConfig)
  },
  { deep: true }
)

/**
 * @expose
 * @property lineSegments - Three.js LineSegments 实例
 */
defineExpose({
  lineSegments
})
</script>