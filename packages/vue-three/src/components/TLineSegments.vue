<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch, computed, provide } from 'vue'
import { useLineSegments } from '../composables/useLine'
import { MeshContextKey } from '../core/context'
import type { BufferGeometry, Material } from 'three'

/**
 * 线段渲染组件
 * @description 将自定义几何体渲染为线段，常用于显示几何体边缘
 * @component TLineSegments
 * @example
 * <TLineSegments>
 *   <TBufferGeometry :attributes="segmentAttributes" />
 *   <TLineBasicMaterial :color="0xff0000" />
 * </TLineSegments>
 * @example
 * <TLineSegments :geometry="edgesGeometry" :color="0xffffff" />
 */
const props = defineProps({
  /**
   * 自定义 BufferGeometry
   */
  geometry: {
    type: Object as PropType<BufferGeometry>,
    required: false
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

function setGeometry(geometry: BufferGeometry) {
  if (lineSegments.geometry) {
    lineSegments.geometry.dispose()
  }
  lineSegments.geometry = geometry
  lineSegments.updateMatrix()
}

function setMaterial(material: Material) {
  if (lineSegments.material) {
    const oldMaterial = lineSegments.material as Material
    oldMaterial.dispose()
  }
  lineSegments.material = material
  material.needsUpdate = true
}

provide(MeshContextKey, {
  mesh: lineSegments,
  setGeometry,
  setMaterial
})

/**
 * @expose
 * @property lineSegments - Three.js LineSegments 实例
 * @property setGeometry - 设置线段几何体
 * @property setMaterial - 设置线段材质
 */
defineExpose({
  lineSegments,
  setGeometry,
  setMaterial
})
</script>