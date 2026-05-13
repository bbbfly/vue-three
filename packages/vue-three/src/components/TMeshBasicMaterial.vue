<template>
  <slot></slot>
</template>

<script setup lang="ts">
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

defineExpose({
  material
})
</script>
