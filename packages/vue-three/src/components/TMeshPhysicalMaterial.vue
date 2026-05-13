<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { MeshPhysicalMaterial, Color } from 'three'
import { useMaterial } from '../composables/useMaterial'

/**
 * 增强型PBR物理材质组件
 * @description 基于物理的渲染材质，提供高级物理渲染属性，支持清漆、透射、彩虹等高级材质效果
 * @component TMeshPhysicalMaterial
 * @example
 * <TMeshPhysicalMaterial
 *   :color="0xffd700"
 *   :metalness="1"
 *   :roughness="0.3"
 *   :clearcoat="1"
 *   :transmission="0.9"
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
   * 清漆强度，范围 0 到 1。用于模拟车漆、清漆效果
   * @default 0
   */
  clearcoat: {
    type: Number,
    default: 0
  },
  /**
   * 清漆粗糙度，范围 0 到 1
   * @default 0
   */
  clearcoatRoughness: {
    type: Number,
    default: 0
  },
  /**
   * 透射率，范围 0 到 1。用于模拟玻璃、半透明材质
   * @default 0
   */
  transmission: {
    type: Number,
    default: 0
  },
  /**
   * 厚度，用于透射效果。决定光线穿过材质的距离
   * @default 0
   */
  thickness: {
    type: Number,
    default: 0
  },
  /**
   * 折射率，范围 1 到 2.333。决定光线穿过材质时的弯曲程度
   * @default 1.5
   */
  ior: {
    type: Number,
    default: 1.5
  },
  /**
   * 彩虹效果强度，范围 0 到 1
   * @default 0
   */
  iridescence: {
    type: Number,
    default: 0
  },
  /**
   * 光泽效果强度，范围 0 到 1。用于模拟织物、皮革等材质
   * @default 0
   */
  sheen: {
    type: Number,
    default: 0
  },
  /**
   * 高光强度，范围 0 到 1
   * @default 0
   */
  sheenColor: {
    type: Number,
    default: 0
  },
  /**
   * 镜面反射强度，范围 0 到 1
   * @default 0.5
   */
  specularIntensity: {
    type: Number,
    default: 0.5
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
  },
  /**
   * 纹理贴图，支持 URL 字符串或 Texture 对象
   */
  map: {
    type: [String, Object] as PropType<string | THREE.Texture>,
    default: undefined
  }
})

const { material } = useMaterial({
  type: 'physical',
  color: props.color,
  metalness: props.metalness,
  roughness: props.roughness,
  clearcoat: props.clearcoat,
  clearcoatRoughness: props.clearcoatRoughness,
  transmission: props.transmission,
  thickness: props.thickness,
  ior: props.ior,
  iridescence: props.iridescence,
  sheen: props.sheen,
  sheenColor: props.sheenColor,
  specularIntensity: props.specularIntensity,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  map: props.map
})

watch(
  () => props.color,
  newColor => {
    ; (material.value as MeshPhysicalMaterial).color.set(newColor)
  }
)

watch(
  () => props.metalness,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).metalness = newValue
  }
)

watch(
  () => props.roughness,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).roughness = newValue
  }
)

watch(
  () => props.clearcoat,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).clearcoat = newValue
  }
)

watch(
  () => props.clearcoatRoughness,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).clearcoatRoughness = newValue
  }
)

watch(
  () => props.transmission,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).transmission = newValue
  }
)

watch(
  () => props.thickness,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).thickness = newValue
  }
)

watch(
  () => props.ior,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).ior = newValue
  }
)

watch(
  () => props.iridescence,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).iridescence = newValue
  }
)

watch(
  () => props.sheen,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).sheen = newValue
  }
)

watch(
  () => props.sheenColor,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).sheenColor = new Color(newValue)
  }
)

watch(
  () => props.specularIntensity,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).specularIntensity = newValue
  }
)

watch(
  () => props.opacity,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).opacity = newValue
  }
)

watch(
  () => props.transparent,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).transparent = newValue
  }
)

watch(
  () => props.wireframe,
  newValue => {
    ; (material.value as MeshPhysicalMaterial).wireframe = newValue
  }
)

defineExpose({
  material
})
</script>
