<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch, computed, inject } from 'vue'
import { Line, LineBasicMaterial, WireframeGeometry } from 'three'
import { ThreeContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import { disposeObject3D } from '../core/cleanup'
import type { GeometryConfig, Object3DConfig } from '../types'

/**
 * 线框几何体组件
 * @description 生成几何体的线框并渲染为线条
 * @component TWireframeGeometry
 * @example
 * <TWireframeGeometry :geometry="{ type: 'sphere', args: [1, 32, 16] }" color="#00ff00" />
 */
const props = defineProps({
  /**
   * 源几何体配置
   * @required 要生成线框的几何体配置
   */
  geometry: {
    type: Object as PropType<GeometryConfig>,
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
  throw new Error('TWireframeGeometry must be used within a TCanvas component')
}

function createWireframe() {
  const baseGeometry = ThreeObjectFactory.createGeometry(props.geometry)
  const geometry = new WireframeGeometry(baseGeometry)
  const material = new LineBasicMaterial({
    color: props.color,
    linewidth: props.linewidth
  })
  const line = new Line(geometry, material)
  ThreeObjectFactory.applyObject3DConfig(line, props)
  return line
}

const line = createWireframe()

if (ctx.scene.value) {
  ctx.scene.value.add(line)
}

function updateWireframe() {
  if (ctx.scene.value) {
    ctx.scene.value.remove(line)
  }
  disposeObject3D(line)
  Object.assign(line, createWireframe())
  if (ctx.scene.value) {
    ctx.scene.value.add(line)
  }
}

const watchProps = computed(() => [
  props.geometry,
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
    updateWireframe()
  },
  { deep: true }
)

defineExpose({
  line
})
</script>
