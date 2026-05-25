<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch, useAttrs, computed } from 'vue'
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

const attrs = useAttrs()

const materialConfig = computed(() => {
  const propKeys = new Set(Object.keys(props))
  const extraAttrs: Record<string, unknown> = {}

  for (const key in attrs) {
    if (!propKeys.has(key)) {
      extraAttrs[key] = attrs[key]
    }
  }

  return {
    type: 'lambert',
    color: props.color,
    transparent: props.transparent,
    opacity: props.opacity,
    wireframe: props.wireframe,
    side: props.side,
    depthWrite: props.depthWrite,
    flatShading: props.flatShading,
    emissive: props.emissive,
    ...extraAttrs
  }
})

const { material, updateMaterial } = useMaterial(materialConfig.value)

watch(
  materialConfig,
  (newConfig) => {
    updateMaterial(newConfig)
  },
  { deep: true }
)

defineExpose({
  material
})
</script>