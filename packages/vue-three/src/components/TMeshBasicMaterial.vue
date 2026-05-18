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
  blending: {
    type: Number as PropType<number>,
    default: undefined
  },
  premultipliedAlpha: {
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
  depthTest: {
    type: Boolean,
    default: undefined
  },
  colorWrite: {
    type: Boolean,
    default: undefined
  },
  stencilWrite: {
    type: Boolean,
    default: undefined
  },
  stencilFunc: {
    type: Number,
    default: undefined
  },
  stencilRef: {
    type: Number,
    default: undefined
  },
  stencilMask: {
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
  },
  clippingPlanes: {
    type: Array as unknown as PropType<THREE.Plane[]>,
    default: undefined
  }
})

const { material } = useMaterial({
  type: 'basic',
  color: props.color,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  blending: props.blending,
  premultipliedAlpha: props.premultipliedAlpha,
  side: props.side,
  depthWrite: props.depthWrite,
  flatShading: props.flatShading,
  map: props.map
})

const updateStencilProps = () => {
  const mat = material as any
  if (props.depthTest !== undefined) mat.depthTest = props.depthTest
  if (props.colorWrite !== undefined) mat.colorWrite = props.colorWrite
  if (props.stencilWrite !== undefined) mat.stencilWrite = props.stencilWrite
  if (props.stencilFunc !== undefined) mat.stencilFunc = props.stencilFunc
  if (props.stencilRef !== undefined) mat.stencilRef = props.stencilRef
  if (props.stencilMask !== undefined) mat.stencilMask = props.stencilMask
  if (props.stencilFail !== undefined) mat.stencilFail = props.stencilFail
  if (props.stencilZFail !== undefined) mat.stencilZFail = props.stencilZFail
  if (props.stencilZPass !== undefined) mat.stencilZPass = props.stencilZPass
  if (props.clippingPlanes !== undefined) mat.clippingPlanes = props.clippingPlanes
}

onMounted(() => {
  updateStencilProps()
})

watch(
  () => [props.depthTest, props.colorWrite, props.stencilWrite, props.stencilFunc, props.stencilRef,
  props.stencilMask, props.stencilFail, props.stencilZFail, props.stencilZPass, props.clippingPlanes],
  () => {
    updateStencilProps()
  }
)

defineExpose({
  material
})
</script>
