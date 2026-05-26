<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { onMounted, watch, useAttrs, computed } from 'vue'
import type { PropType } from 'vue'
import * as THREE from 'three'
import { useMaterial } from '../composables/useMaterial'

defineOptions({
  inheritAttrs: false
})

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
  blendSrc: {
    type: Number as PropType<number>,
    default: undefined
  },
  blendDst: {
    type: Number as PropType<number>,
    default: undefined
  },
  blendEquation: {
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

const attrs = useAttrs()

// 获取已定义的 props 键名集合
const propKeys = new Set(Object.keys(props))

const camelCase = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}


// 合并 props 和 attrs，props 已定义的属性优先级高于 attrs
const materialConfig = computed(() => {
  const config: Record<string, unknown> = {
    type: 'basic',
    color: props.color,
    transparent: props.transparent,
    opacity: props.opacity,
    wireframe: props.wireframe,
    blending: props.blending,
    blendSrc: props.blendSrc,
    blendDst: props.blendDst,
    blendEquation: props.blendEquation,
    premultipliedAlpha: props.premultipliedAlpha,
    side: props.side,
    depthWrite: props.depthWrite,
    flatShading: props.flatShading,
    map: props.map,
    depthTest: props.depthTest,
    colorWrite: props.colorWrite,
    stencilWrite: props.stencilWrite,
    stencilFunc: props.stencilFunc,
    stencilRef: props.stencilRef,
    stencilMask: props.stencilMask,
    stencilFail: props.stencilFail,
    stencilZFail: props.stencilZFail,
    stencilZPass: props.stencilZPass,
    clippingPlanes: props.clippingPlanes,
  }
  // 转驼峰
  Object.keys(attrs).forEach(key => {
    config[camelCase(key)] = attrs[key]
  })
  return config
})

const { material, updateMaterial } = useMaterial(materialConfig.value)

// 监听 props 和 attrs 变化，自动更新材质
watch(
  materialConfig,
  newConfig => {
    updateMaterial(newConfig)
  },
  { deep: true }
)

onMounted(() => {
  updateMaterial(materialConfig.value)
})

defineExpose({
  material
})
</script>
