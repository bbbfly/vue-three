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
import type { CurveConfig, ShapeConfig } from '../types'

/**
 * 扫描几何体组件
 * @description 将 2D 轮廓沿 3D 路径扫描生成几何体
 * @component TSweepGeometry
 * @example
 * <TSweepGeometry :shape="shapeConfig" :path="curveConfig" />
 */
const props = defineProps({
  /**
   * 2D 轮廓形状配置
   * @required 扫描截面形状配置
   */
  shape: {
    type: Object as PropType<ShapeConfig>,
    required: true
  },
  /**
   * 3D 扫描路径曲线配置
   * @required 扫描路径曲线配置
   */
  path: {
    type: Object as PropType<CurveConfig>,
    required: true
  },
  /**
   * 扫描参数配置
   * @default { tubularSegments: 64, radialSegments: 8, closed: false }
   */
  options: {
    type: Object as PropType<{
      tubularSegments?: number
      radialSegments?: number
      closed?: boolean
    }>,
    default: () => ({ tubularSegments: 64, radialSegments: 8, closed: false })
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'sweep',
  shape: props.shape,
  path: props.path,
  ...props.options
})

watch(
  () => [props.shape, props.path, props.options],
  ([newShape, newPath, newOptions]) => {
    updateGeometry({
      type: 'sweep',
      shape: newShape as ShapeConfig,
      path: newPath as CurveConfig,
      ...(newOptions as object)
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js ExtrudeGeometry 实例（实现扫描效果）
 */
defineExpose({
  geometry
})
</script>
