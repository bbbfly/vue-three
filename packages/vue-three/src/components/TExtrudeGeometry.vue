<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { ShapeConfig, ExtrudeGeometryArgs } from '../types'

/**
 * 拉伸几何体组件
 * @description 将 2D 形状沿 Z 轴拉伸生成 3D 几何体
 * @component TExtrudeGeometry
 * @example
 * <TExtrudeGeometry :shape="shapeConfig" :args="{ depth: 1, bevelEnabled: true }" />
 */
const props = defineProps({
  /**
   * 形状配置
   * @required 形状路径配置
   */
  shape: {
    type: Object as PropType<ShapeConfig>,
    required: true
  },
  /**
   * 拉伸参数配置
   * @default { depth: 1, bevelEnabled: false }
   */
  args: {
    type: Object as PropType<ExtrudeGeometryArgs>,
    default: () => ({ depth: 1, bevelEnabled: false })
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'extrude',
  shape: props.shape,
  args: props.args
})

watch(
  () => [props.shape, props.args],
  ([newShape, newArgs]) => {
    updateGeometry({
      type: 'extrude',
      shape: newShape as ShapeConfig,
      args: newArgs as ExtrudeGeometryArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js ExtrudeGeometry 实例
 */
defineExpose({
  geometry
})
</script>
