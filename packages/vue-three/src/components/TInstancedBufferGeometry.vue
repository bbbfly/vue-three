<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import { inject, watch, onBeforeUnmount } from 'vue'
import { InstancedBufferGeometry, BufferAttribute, InstancedBufferAttribute } from 'three'
import { MeshContextKey } from '../core/context'

/**
 * 实例化缓冲几何体组件
 * @description 用于创建大规模实例化渲染的几何体，支持 InstancedBufferAttribute
 * @component TInstancedBufferGeometry
 * @example
 * <TInstancedBufferGeometry 
 *   :attributes="instancedAttributes" 
 *   :instanceCount="1000"
 * />
 */
const props = defineProps<{
  /**
   * 自定义顶点属性对象，key 为属性名，value 为 BufferAttribute 或 InstancedBufferAttribute
   */
  attributes?: Record<string, BufferAttribute | InstancedBufferAttribute | { array: number[] | Float32Array; itemSize: number; instanced?: boolean }>
  /**
   * 实例数量
   * @default undefined
   */
  instanceCount?: number
  /**
   * 绘制范围 [start, count]，控制几何体渲染的顶点范围
   * @default undefined
   */
  drawRange?: [number, number]
}>()

const meshCtx = inject(MeshContextKey)

if (!meshCtx) {
  throw new Error('TInstancedBufferGeometry must be used within a TMesh component')
}

const geometry: InstancedBufferGeometry = new InstancedBufferGeometry()

meshCtx!.setGeometry(geometry)

function updateAttributes() {
  if (!props.attributes) return

  for (const [name, attr] of Object.entries(props.attributes)) {
    if (attr instanceof BufferAttribute || attr instanceof InstancedBufferAttribute) {
      geometry.setAttribute(name, attr)
    } else if (attr.array && attr.itemSize !== undefined) {
      const array = attr.array instanceof Float32Array ? attr.array : new Float32Array(attr.array)
      if (attr.instanced) {
        geometry.setAttribute(name, new InstancedBufferAttribute(array, attr.itemSize))
      } else {
        geometry.setAttribute(name, new BufferAttribute(array, attr.itemSize))
      }
    }
  }
}

function updateInstanceCount() {
  if (props.instanceCount !== undefined) {
    geometry.instanceCount = props.instanceCount
  }
}

function updateDrawRange() {
  if (props.drawRange) {
    geometry.setDrawRange(props.drawRange[0], props.drawRange[1])
  }
}

updateAttributes()
updateInstanceCount()
updateDrawRange()

watch(
  () => props.attributes,
  () => {
    updateAttributes()
  },
  { deep: true }
)

watch(
  () => props.instanceCount,
  () => {
    updateInstanceCount()
  }
)

watch(
  () => props.drawRange,
  () => {
    updateDrawRange()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  geometry.dispose()
})

/**
 * @expose
 * @property geometry - Three.js InstancedBufferGeometry 实例
 */
defineExpose({
  geometry
})
</script>