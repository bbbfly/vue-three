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
   * 光泽度，数值越高镜面高光越明显
   * @default 30
   */
  shininess: {
    type: Number,
    default: 30
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
  }
})

const { material } = useMaterial({
  type: 'phong',
  color: props.color,
  shininess: props.shininess,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  side: props.side
})

/**
 * @expose
 * @property material - Three.js MeshPhongMaterial 实例
 */
defineExpose({
  material
})
</script>
