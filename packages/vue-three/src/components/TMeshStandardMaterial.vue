<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'

const props = defineProps({
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  metalness: {
    type: Number,
    default: 0
  },
  roughness: {
    type: Number,
    default: 1
  },
  transparent: {
    type: Boolean,
    default: false
  },
  opacity: {
    type: Number,
    default: 1
  },
  wireframe: {
    type: Boolean,
    default: false
  },
  side: {
    type: Number,
    default: undefined
  },
  depthWrite: {
    type: Boolean,
    default: undefined
  },
  flatShading: {
    type: Boolean,
    default: undefined
  },
  map: {
    type: [String, Object] as PropType<string | THREE.Texture>,
    default: undefined
  },
  clipShadows: {
    type: Boolean,
    default: undefined
  },
  shadowSide: {
    type: Number,
    default: undefined
  },
  clippingPlanes: {
    type: Array as unknown as PropType<THREE.Plane[]>,
    default: undefined
  },
  stencilWrite: {
    type: Boolean,
    default: undefined
  },
  stencilRef: {
    type: Number,
    default: undefined
  },
  stencilFunc: {
    type: Number,
    default: undefined
  },
  stencilFail: {
    type: Number,
    default: undefined
  },
  stencilZFail: {
    type: Number,
    default: undefined
  },
  stencilZPass: {
    type: Number,
    default: undefined
  }
})

const { material } = useMaterial({
  type: 'standard',
  color: props.color,
  metalness: props.metalness,
  roughness: props.roughness,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  side: props.side,
  depthWrite: props.depthWrite,
  flatShading: props.flatShading,
  map: props.map
})

const updateStencilProps = () => {
  const mat = material as any
  if (props.clipShadows !== undefined) mat.clipShadows = props.clipShadows
  if (props.shadowSide !== undefined) mat.shadowSide = props.shadowSide
  if (props.clippingPlanes !== undefined) mat.clippingPlanes = props.clippingPlanes
  if (props.stencilWrite !== undefined) mat.stencilWrite = props.stencilWrite
  if (props.stencilRef !== undefined) mat.stencilRef = props.stencilRef
  if (props.stencilFunc !== undefined) mat.stencilFunc = props.stencilFunc
  if (props.stencilFail !== undefined) mat.stencilFail = props.stencilFail
  if (props.stencilZFail !== undefined) mat.stencilZFail = props.stencilZFail
  if (props.stencilZPass !== undefined) mat.stencilZPass = props.stencilZPass
}

onMounted(() => {
  updateStencilProps()
})

watch(
  () => [props.clipShadows, props.shadowSide, props.clippingPlanes, props.stencilWrite, props.stencilRef,
    props.stencilFunc, props.stencilFail, props.stencilZFail, props.stencilZPass],
  () => {
    updateStencilProps()
  }
)

defineExpose({
  material
})
</script>
