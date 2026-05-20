<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import { inject, watch, onBeforeUnmount } from 'vue'
import { BufferGeometry, BufferAttribute } from 'three'
import { MeshContextKey } from '../core/context'

/**
 * 自定义缓冲几何体组件
 * @description 允许用户通过 attributes 属性自定义顶点数据，适用于需要手动构建几何体的场景
 * @component TBufferGeometry
 * @example
 * <TBufferGeometry :attributes="customAttributes">
 * </TBufferGeometry>
 */
const props = defineProps<{
  /**
   * 自定义顶点属性对象，key 为属性名，value 为 BufferAttribute 或属性配置
   */
  attributes?: Record<string, BufferAttribute | { array: number[] | Float32Array; itemSize: number }>
  /**
   * 变形目标属性，用于 morph 动画
   */
  morphAttributes?: Record<string, BufferAttribute[]>
  /**
   * 绘制范围 [start, count]，控制几何体渲染的顶点范围
   * @default undefined
   */
  drawRange?: [number, number]
}>()

const meshCtx = inject(MeshContextKey)

if (!meshCtx) {
  throw new Error('TBufferGeometry must be used within a TMesh or TLine component')
}

const geometry: BufferGeometry = new BufferGeometry()

meshCtx!.setGeometry(geometry)

function updateAttributes() {
  if (!props.attributes) return

  for (const [name, attr] of Object.entries(props.attributes)) {
    if (attr instanceof BufferAttribute) {
      geometry.setAttribute(name, attr)
    } else if (attr.array && attr.itemSize !== undefined) {
      const array = attr.array instanceof Float32Array ? attr.array : new Float32Array(attr.array)
      geometry.setAttribute(name, new BufferAttribute(array, attr.itemSize))
    }
  }
}

function updateMorphAttributes() {
  if (!props.morphAttributes) return

  for (const [name, attrs] of Object.entries(props.morphAttributes)) {
    console.log(name, attrs)
    geometry.morphAttributes[name] = attrs
    // 必须初始化 morphTargetInfluences
    meshCtx!.mesh.morphTargetInfluences = [0, 0, 0]
  }
}

function updateDrawRange() {
  if (props.drawRange) {
    geometry.setDrawRange(props.drawRange[0], props.drawRange[1])
  }
}

updateAttributes()
updateMorphAttributes()
updateDrawRange()

watch(
  () => props.attributes,
  () => {
    updateAttributes()
  },
  { deep: true }
)

watch(
  () => props.morphAttributes,
  () => {
    updateMorphAttributes()
  },
  { deep: true }
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
 * @property geometry - Three.js BufferGeometry 实例
 */
defineExpose({
  geometry
})
</script>
