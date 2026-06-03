<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch, useAttrs, computed } from 'vue'
import { useMaterial } from '../composables/useMaterial'
import { useCamelCaseKeys } from '../hooks'
import * as THREE from 'three'

/**
 * Matcap材质组件
 * @description 使用 MatCap 技术实现高质量的材质渲染，适用于快速渲染具有金属质感的物体
 * @component TMeshMatcapMaterial
 * @example
 * <TMeshMatcapMaterial :color="0xffffff">
 *   <TTexture map-type="matcap" url="textures/matcap/040full.exr" />
 * </TMeshMatcapMaterial>
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
   * 材质渲染面
   * @default DoubleSide
   */
  side: {
    type: Number,
    default: THREE.DoubleSide
  },
  /**
   * 是否使用平面着色（忽略平滑插值）
   * @default false
   */
  flatShading: {
    type: Boolean,
    default: false
  },
  /**
   * 是否使用几何体顶点颜色
   * @default false
   */
  vertexColors: {
    type: Boolean,
    default: false
  },
  depthWrite: {
    type: Boolean,
    default: undefined
  },
  /**
   * 裁剪平面数组
   * @default undefined
   */
  clippingPlanes: {
    type: Array as unknown as PropType<THREE.Plane[]>,
    default: undefined
  },
  /**
   * 是否裁剪阴影
   * @default false
   */
  clipShadows: {
    type: Boolean,
    default: false
  },
  /**
   * 是否启用 alpha 覆盖
   * @default false
   */
  alphaToCoverage: {
    type: Boolean,
    default: false
  },
  /**
   * 是否使用裁剪平面交集模式
   * @default false
   */
  clipIntersection: {
    type: Boolean,
    default: false
  }
})

const attrs = useAttrs()
const camelCaseAttrs = computed(() => useCamelCaseKeys(attrs))

const getMaterialConfig = () => {
  return {
    type: 'matcap' as const,
    color: props.color,
    transparent: props.transparent,
    opacity: props.opacity,
    wireframe: props.wireframe,
    side: props.side,
    flatShading: props.flatShading,
    vertexColors: props.vertexColors,
    depthWrite: props.depthWrite,
    clippingPlanes: props.clippingPlanes,
    clipShadows: props.clipShadows,
    alphaToCoverage: props.alphaToCoverage,
    clipIntersection: props.clipIntersection,
    ...camelCaseAttrs.value
  }
}

const { material, updateMaterial } = useMaterial(getMaterialConfig())

watch(
  () => [props, camelCaseAttrs.value],
  () => {
    updateMaterial(getMaterialConfig())
  },
  { deep: true }
)

/**
 * @expose
 * @property material - Three.js MeshMatcapMaterial 实例
 */
defineExpose({
  material
})
</script>
