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
    default: 0x000000
  },
  transparent: {
    type: Boolean,
    default: false
  },
  opacity: {
    type: Number,
    default: 1
  },
  side: {
    type: Number,
    default: undefined
  },
  depthWrite: {
    type: Boolean,
    default: undefined
  },
  depthTest: {
    type: Boolean,
    default: undefined
  }
})

const { material } = useMaterial({
  type: 'shadow',
  color: props.color,
  transparent: props.transparent,
  opacity: props.opacity,
  side: props.side,
  depthWrite: props.depthWrite
})

const updateProps = () => {
  const mat = material as any
  if (props.depthTest !== undefined) mat.depthTest = props.depthTest
}

onMounted(() => {
  updateProps()
})

watch(
  () => [props.depthTest],
  () => {
    updateProps()
  }
)

defineExpose({
  material
})
</script>