<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { MeshStandardMaterial } from 'three'
import { useMaterial } from '../composables/useMaterial'

/**
 * 标准PBR材质组件
 * @description 基于物理的渲染(PBR)材质，提供最真实的视觉效果，支持金属度和粗糙度属性
 * @component TMeshStandardMaterial
 * @example
 * <TMeshStandardMaterial
 *   :color="0xffd700"
 *   :metalness="1"
 *   :roughness="0.3"
 * />
 */
const props = defineProps({
  /**
   * 材质颜色
   * @default 0xffffff (白色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 金属度，范围 0 到 1。0 表示非金属，1 表示金属
   * @default 0 (非金属)
   */
  metalness: {
    type: Number,
    default: 0
  },
  /**
   * 粗糙度，范围 0 到 1。0 表示完全光滑，1 表示完全粗糙
   * @default 1 (完全粗糙)
   */
  roughness: {
    type: Number,
    default: 1
  },
  /**
   * 是否启用透明度
   * @default false
   */
  transparent: {
    type: Boolean,
    default: false
  },
  /**
   * 透明度值，范围 0 到 1
   * @default 1 (不透明)
   */
  opacity: {
    type: Number,
    default: 1
  },
  /**
   * 是否以线框模式渲染
   * @default false
   */
  wireframe: {
    type: Boolean,
    default: false
  }
})

const { material } = useMaterial({
  type: 'standard',
  color: props.color,
  metalness: props.metalness,
  roughness: props.roughness,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe
})

watch(
  () => props.color,
  newColor => {
    ;(material.value as MeshStandardMaterial).color.set(newColor)
  }
)

watch(
  () => props.metalness,
  newValue => {
    ;(material.value as MeshStandardMaterial).metalness = newValue
  }
)

watch(
  () => props.roughness,
  newValue => {
    ;(material.value as MeshStandardMaterial).roughness = newValue
  }
)

watch(
  () => props.opacity,
  newValue => {
    ;(material.value as MeshStandardMaterial).opacity = newValue
  }
)

watch(
  () => props.transparent,
  newValue => {
    ;(material.value as MeshStandardMaterial).transparent = newValue
  }
)

watch(
  () => props.wireframe,
  newValue => {
    ;(material.value as MeshStandardMaterial).wireframe = newValue
    material.value.needsUpdate = true
  }
)

/**
 * @expose
 * @property material - Three.js MeshStandardMaterial 实例
 */
defineExpose({
  material
})
</script>
