<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { TorusGeometryArgs } from '../types'

/**
 * 圆环几何体组件
 * @description 生成圆环形几何形状，类似于甜甜圈
 * @component TTorus
 * @example
 * <TTorus :args="[1, 0.4, 16, 64]" />
 */
const props = defineProps({
  /**
   * 圆环几何体参数 [radius, tube, radialSegments?, tubularSegments?, arc?]
   * @default [1, 0.4, 8, 32]
   */
  args: {
    type: Array as unknown as PropType<TorusGeometryArgs>,
    default: () => [1, 0.4, 8, 32]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'torus',
  args: props.args
})

watch(
  () => props.args,
  newArgs => {
    updateGeometry({
      type: 'torus',
      args: newArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js TorusGeometry 实例
 */
defineExpose({
  geometry
})
</script>
