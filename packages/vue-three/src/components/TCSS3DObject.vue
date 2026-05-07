<script setup lang="ts">
import { inject, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import { CSS3DContextKey, type CSS3DObjectConfig } from '../core/context'

/**
 * CSS3D 对象组件
 * @description 用于在3D场景中渲染HTML元素的组件，支持自定义位置、旋转、缩放和样式
 * @component TCSS3DObject
 * @example
 * <TCSS3DObject :position="[0, 0, 0]" :rotation="[0, Math.PI, 0]">
 *   <div class="custom-content">3D HTML Content</div>
 * </TCSS3DObject>
 */

const props = withDefaults(
  defineProps<{
    position: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number]
    className?: string
    style?: Record<string, string>
  }>(),
  {
    rotation: () => [0, 0, 0],
    scale: () => [1, 1, 1]
  }
)

const css3dCtx = inject(CSS3DContextKey)

if (!css3dCtx) {
  throw new Error('TCSS3DObject must be used within a TCSS3DRenderer component')
}

const objectRef = shallowRef<HTMLElement | null>(null)
const css3dObject = shallowRef<CSS3DObject | null>(null)

const createObject = () => {
  if (!objectRef.value) return

  const object = new CSS3DObject(objectRef.value)
  css3dObject.value = object

  applyConfig()

  const config: CSS3DObjectConfig = {
    position: props.position,
    rotation: props.rotation,
    scale: props.scale,
    className: props.className,
    style: props.style
  }

  css3dCtx.addObject(object, config)
}

const applyConfig = () => {
  if (!css3dObject.value) return

  css3dObject.value.position.set(...props.position)
  css3dObject.value.rotation.set(...props.rotation)
  css3dObject.value.scale.set(...props.scale)

  const el = css3dObject.value.element

  if (props.className) {
    el.className = props.className
  }
}

onMounted(() => {
  createObject()
})

watch(
  () => props.position,
  () => applyConfig(),
  { deep: true }
)

watch(
  () => props.rotation,
  () => applyConfig(),
  { deep: true }
)

watch(
  () => props.scale,
  () => applyConfig(),
  { deep: true }
)

watch(
  () => props.className,
  () => applyConfig()
)

watch(
  () => props.style,
  () => applyConfig(),
  { deep: true }
)

onBeforeUnmount(() => {
  if (css3dObject.value) {
    css3dCtx.removeObject(css3dObject.value)
  }
})

/**
 * @expose
 * @property css3dObject - CSS3DObject 实例
 */
defineExpose({
  css3dObject
})
</script>

<template>
  <div ref="objectRef" :style="props.style">
    <slot></slot>
  </div>
</template>
