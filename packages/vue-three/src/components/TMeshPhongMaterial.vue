<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'
import * as THREE from 'three'
/**
 * Phong材质组件
 * @description 具有镜面高光的光泽表面材质，适用于塑料、油漆等光滑表面
 * @component TMeshPhongMaterial
 * @example
 * <TMeshPhongMaterial :color="0x0000ff" :shininess="100" />
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
   * 镜面高光颜色
   * @default 0x111111
   */
  specular: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  /**
   * 光泽度，数值越高镜面高光越明显
   * @default 30
   */
  shininess: {
    type: Number,
    default: 30
  },
  /**
   * 法线贴图对材质的影响程度
   * @default undefined
   */
  normalScale: {
    type: Array as unknown as PropType<[number, number]>,
    default: undefined
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
  }
})

const { material } = useMaterial({
  type: 'phong',
  color: props.color,
  specular: props.specular,
  shininess: props.shininess,
  normalScale: props.normalScale,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  side: props.side,
  flatShading: props.flatShading,
  vertexColors: props.vertexColors,
  depthWrite: props.depthWrite
})

/**
 * @expose
 * @property material - Three.js MeshPhongMaterial 实例
 */
defineExpose({
  material
})
</script>
