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
  }
})

const { material } = useMaterial({
  type: 'lambert',
  color: props.color,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  side: props.side,
  depthWrite: props.depthWrite,
  flatShading: props.flatShading
})

defineExpose({
  material
})
</script>
