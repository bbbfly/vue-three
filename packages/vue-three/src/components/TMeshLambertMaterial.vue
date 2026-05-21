<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch } from 'vue'
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
  },
  emissive: {
    type: [String, Number] as PropType<string | number>,
    default: 0x000000
  }
})

const { material, updateMaterial } = useMaterial({
  type: 'lambert',
  color: props.color,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  side: props.side,
  depthWrite: props.depthWrite,
  flatShading: props.flatShading,
  emissive: props.emissive
})

watch(
  () => [props.color, props.transparent, props.opacity, props.wireframe, props.side, props.depthWrite, props.flatShading, props.emissive],
  () => {
    updateMaterial({
      type: 'lambert',
      color: props.color,
      transparent: props.transparent,
      opacity: props.opacity,
      wireframe: props.wireframe,
      side: props.side,
      depthWrite: props.depthWrite,
      flatShading: props.flatShading,
      emissive: props.emissive
    })
  },
  { deep: true }
)

defineExpose({
  material
})
</script>