<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { SphereGeometryArgs } from '../types'

/**
 * 球体几何体组件
 * @description 生成球体几何形状，通过分段数控制球体精度
 * @component TSphere
 * @example
 * <TSphere :args="[1, 64, 32]" />
 */
const props = defineProps({
  /**
   * 球体几何体参数 [radius, widthSegments?, heightSegments?, phiStart?, phiLength?, thetaStart?, thetaLength?]
   * @default [1, 32, 16]
   */
  args: {
    type: Array as unknown as PropType<SphereGeometryArgs>,
    default: () => [1, 32, 16]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'sphere',
  args: props.args
})

watch(
  () => props.args,
  newArgs => {
    updateGeometry({
      type: 'sphere',
      args: newArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js SphereGeometry 实例
 */
defineExpose({
  geometry
})
</script>
