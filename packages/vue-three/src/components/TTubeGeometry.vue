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
import type { CurveConfig, TubeGeometryArgs } from '../types'

/**
 * 曲线路径管道几何体组件
 * @description 沿曲线生成管道几何体
 * @component TTubeGeometry
 * @example
 * <TTubeGeometry :path="{ type: 'catmullRom', args: [[0,0,0], [1,1,0], [2,0,0]] }" />
 */
const props = defineProps({
  /**
   * 路径曲线配置
   * @required 曲线配置对象
   */
  path: {
    type: Object as PropType<CurveConfig>,
    required: true
  },
  /**
   * 管道几何体参数 [tubularSegments?, radius?, radialSegments?, closed?]
   * @default [64, 1, 8, false]
   */
  args: {
    type: Array as unknown as PropType<TubeGeometryArgs>,
    default: () => [64, 1, 8, 0]
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'tube',
  path: props.path,
  args: props.args
})

watch(
  () => [props.path, props.args],
  ([newPath, newArgs]) => {
    updateGeometry({
      type: 'tube',
      path: newPath as CurveConfig,
      args: newArgs as TubeGeometryArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js TubeGeometry 实例
 */
defineExpose({
  geometry
})
</script>
