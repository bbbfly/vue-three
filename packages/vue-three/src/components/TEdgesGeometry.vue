<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch, computed, inject } from 'vue'
import { Line, BufferGeometry, LineBasicMaterial, EdgesGeometry } from 'three'
import { ThreeContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import { disposeObject3D } from '../core/cleanup'
import type { GeometryConfig, Object3DConfig } from '../types'

/**
 * 模型边界线组件
 * @description 提取几何体的边界线并渲染为线条
 * @component TEdgesGeometry
 * @example
 * <TEdgesGeometry :geometry="{ type: 'box' }" :thresholdAngle="30" color="#ff0000" />
 */
const props = defineProps({
  /**
   * 源几何体配置
   * @required 要提取边界的几何体配置
   */
  geometry: {
    type: Object as PropType<GeometryConfig>,
    required: true
  },
  /**
   * 角度阈值，超过此角度的边会被提取
   * @default 1
   */
  thresholdAngle: {
    type: Number,
    default: 1
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

const ctx = inject(ThreeContextKey)

if (!ctx) {
  throw new Error('TEdgesGeometry must be used within a TCanvas component')
}

function createEdges() {
  const baseGeometry = ThreeObjectFactory.createGeometry(props.geometry)
  const geometry = new EdgesGeometry(baseGeometry, props.thresholdAngle)
  const material = new LineBasicMaterial({
    color: props.color,
    linewidth: props.linewidth
  })
  const line = new Line(geometry, material)
  ThreeObjectFactory.applyObject3DConfig(line, props)
  return line
}

const line = createEdges()

if (ctx.scene.value) {
  ctx.scene.value.add(line)
}

function updateEdges() {
  if (ctx.scene.value) {
    ctx.scene.value.remove(line)
  }
  disposeObject3D(line)
  Object.assign(line, createEdges())
  if (ctx.scene.value) {
    ctx.scene.value.add(line)
  }
}

const watchProps = computed(() => [
  props.geometry,
  props.thresholdAngle,
  props.color,
  props.linewidth,
  props.position,
  props.rotation,
  props.scale,
  props.visible
])

watch(
  watchProps,
  () => {
    updateEdges()
  },
  { deep: true }
)

defineExpose({
  line
})
</script>
