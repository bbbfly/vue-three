<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGeometry } from '../composables/useGeometry'
import type { IcosahedronGeometryArgs } from '../types'

/**
 * 二十面体几何体组件
 * @description 生成二十面体几何形状，通过细节等级控制精度
 * @component TIcosahedron
 * @example
 * <TIcosahedron :args="[1, 0]" />
 */
const props = defineProps({
  /**
   * 二十面体几何体参数 [radius?, detail?]
   * @default [1, 0]
   */
  args: {
    type: Array as unknown as PropType<IcosahedronGeometryArgs>,
    default: () => [1, 0]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'icosahedron',
  args: props.args
})

watch(
  () => props.args,
  newArgs => {
    updateGeometry({
      type: 'icosahedron',
      args: newArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js IcosahedronGeometry 实例
 */
defineExpose({
  geometry
})
</script>
