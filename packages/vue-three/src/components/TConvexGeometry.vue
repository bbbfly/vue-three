<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { inject, shallowRef, watch, onBeforeUnmount } from 'vue'
import { Vector3 } from 'three'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import { MeshContextKey } from '../core/context'

type VertexInput =
  | Vector3
  | { x: number; y: number; z: number }
  | [number, number, number]

const props = defineProps({
  vertices: {
    type: Array as PropType<VertexInput[]>,
    required: true
  }
})

const meshCtx = inject(MeshContextKey)

if (!meshCtx) {
  throw new Error('TConvexGeometry must be used within a TMesh component')
}

const geometry = shallowRef<ConvexGeometry>(new ConvexGeometry([]))

function normalizeVertex(v: VertexInput): Vector3 {
  if (v instanceof Vector3) {
    return v
  } else if (Array.isArray(v)) {
    return new Vector3(v[0], v[1], v[2])
  } else {
    return new Vector3(v.x, v.y, v.z)
  }
}

function rebuildGeometry() {
  if (geometry.value) {
    geometry.value.dispose()
  }
  const vectors = props.vertices.map(normalizeVertex)
  geometry.value = new ConvexGeometry(vectors)
  meshCtx!.setGeometry(geometry.value)
}

rebuildGeometry()

watch(
  () => props.vertices,
  () => {
    rebuildGeometry()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  geometry.value.dispose()
})

defineExpose({
  geometry
})
</script>
