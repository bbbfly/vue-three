<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { CylinderGeometryArgs } from '../types'

/**
 * 圆柱体几何体组件
 * @description 生成圆柱体几何形状，可创建锥形、棱柱等变体
 * @component TCylinder
 * @example
 * <TCylinder :args="[1, 1, 2, 64, 1]" />
 */
const props = defineProps({
  /**
   * 圆柱体几何体参数 [radiusTop, radiusBottom, height, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?]
   * @default [1, 1, 2, 32, 1]
   */
  args: {
    type: Array as unknown as PropType<CylinderGeometryArgs>,
    default: () => [1, 1, 2, 32, 1]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'cylinder',
  args: props.args
})

watch(
  () => props.args,
  newArgs => {
    updateGeometry({
      type: 'cylinder',
      args: newArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js CylinderGeometry 实例
 */
defineExpose({
  geometry
})
</script>
