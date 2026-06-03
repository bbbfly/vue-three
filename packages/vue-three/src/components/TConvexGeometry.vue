<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { inject, watch, onBeforeUnmount } from 'vue'
import { Vector3 } from 'three'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import { MeshContextKey } from '../core/context'

type VertexInput = Vector3 | { x: number; y: number; z: number } | [number, number, number]

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

let geometry: ConvexGeometry = new ConvexGeometry([])

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
  geometry.dispose()
  const vectors = props.vertices.map(normalizeVertex)
  geometry = new ConvexGeometry(vectors)
  meshCtx!.setGeometry(geometry)
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
  geometry.dispose()
})

defineExpose({
  geometry
})
</script>
