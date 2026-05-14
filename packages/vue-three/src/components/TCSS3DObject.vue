<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import { CSS3DContextKey, CSS3DGroupContextKey, type CSS3DObjectConfig } from '../core/context'

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
const css3dGroupCtx = inject(CSS3DGroupContextKey)

if (!css3dCtx) {
  throw new Error('TCSS3DObject must be used within a TCSS3DRenderer component')
}

const objectRef = ref<HTMLElement | null>(null)
let css3dObject: CSS3DObject | null = null

const createObject = () => {
  if (!objectRef.value) return

  const object = new CSS3DObject(objectRef.value)
  css3dObject = object

  applyConfig()

  const config: CSS3DObjectConfig = {
    position: props.position,
    rotation: props.rotation,
    scale: props.scale,
    className: props.className,
    style: props.style
  }

  if (css3dGroupCtx) {
    applyConfig()
    css3dGroupCtx.group.add(object)
  } else {
    css3dCtx.addObject(object, config)
  }
}

const applyConfig = () => {
  if (!css3dObject) return
  css3dObject.position.set(...props.position)
  css3dObject.rotation.set(...props.rotation)
  css3dObject.scale.set(...props.scale)
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
  if (css3dObject) {
    if (css3dGroupCtx) {
      css3dGroupCtx.group.remove(css3dObject)
    } else {
      css3dCtx.removeObject(css3dObject)
    }
  }
})

/**
 * @expose
 * @property css3dObject - CSS3DObject 实例
 */
defineExpose({
  css3dObject: () => css3dObject
})
</script>

<template>
  <div ref="objectRef" :style="props.style" :class="props.className">
    <slot></slot>
  </div>
</template>
