<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { inject, shallowRef, onBeforeUnmount, watch } from 'vue'
import { PointsMaterial } from 'three'
import { MeshContextKey } from '../core/context'

/**
 * 粒子材质组件
 * @description 用于渲染粒子系统的材质，支持多种粒子外观属性
 * @component TPointsMaterial
 * @example
 * <TPointsMaterial :color="0x888888" :size="1" :sizeAttenuation="true" />
 */
const props = defineProps({
  /**
   * 粒子颜色
   * @default 0xffffff (白色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 粒子大小
   * @default 1
   */
  size: {
    type: Number,
    default: 1
  },
  /**
   * 是否启用大小衰减（距离越远粒子越小）
   * @default true
   */
  sizeAttenuation: {
    type: Boolean,
    default: true
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
   * 是否可见
   * @default true
   */
  visible: {
    type: Boolean,
    default: true
  }
})

const meshCtx = inject(MeshContextKey)

if (!meshCtx) {
  throw new Error('TPointsMaterial must be used within a TPoints or TMesh component')
}

const material = shallowRef<PointsMaterial>(new PointsMaterial({
  color: props.color,
  size: props.size,
  sizeAttenuation: props.sizeAttenuation,
  transparent: props.transparent,
  opacity: props.opacity,
  visible: props.visible
}))

meshCtx!.setMaterial(material.value)

watch(
  () => props,
  (newProps) => {
    const mat = material.value
    mat.color.set(newProps.color)
    mat.size = newProps.size
    mat.sizeAttenuation = newProps.sizeAttenuation
    mat.transparent = newProps.transparent
    mat.opacity = newProps.opacity
    mat.visible = newProps.visible
    mat.needsUpdate = true
  },
  { deep: true }
)

onBeforeUnmount(() => {
  material.value.dispose()
})

/**
 * @expose
 * @property material - Three.js PointsMaterial 实例
 */
defineExpose({
  material
})
</script>
