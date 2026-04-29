<script setup lang="ts">
import { inject, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { CSS2DContextKey, type CSS2DLabelConfig } from '../core/context'

/**
 * CSS2D 通用对象组件
 * @description 更灵活的 CSS2D 对象组件，支持完全自定义 HTML 内容和高级配置
 * @component TCSS2DObject
 * @example
 * <TCSS2DObject :position="[0, 2, 0]">
 *   <div class="complex-content">
 *     <h3>标题</h3>
 *     <p>复杂的 HTML 结构</p>
 *     <button @click="handleClick">点击</button>
 *   </div>
 * </TCSS2DObject>
 */

const props = withDefaults(defineProps<{
  position: [number, number, number]
  offset?: [number, number]
  minDistance?: number
  maxDistance?: number
  scaleByDistance?: boolean
  scaleFactor?: number
  opacity?: number
  className?: string
  style?: Record<string, string>
  center?: [number, number]
}>(), {
  offset: () => [0, 0],
  center: () => [0.5, 0.5],
  scaleByDistance: false,
  scaleFactor: 1,
  opacity: 1
})

const css2dCtx = inject(CSS2DContextKey)

if (!css2dCtx) {
  throw new Error('TCSS2DObject must be used within a TCSS2DRenderer component')
}

const objectRef = shallowRef<HTMLElement | null>(null)
const css2dObject = shallowRef<CSS2DObject | null>(null)

const createObject = () => {
  if (!objectRef.value) return

  const object = new CSS2DObject(objectRef.value)
  css2dObject.value = object

  applyConfig()

  const config: CSS2DLabelConfig = {
    position: props.position,
    offset: props.offset,
    minDistance: props.minDistance,
    maxDistance: props.maxDistance,
    scaleByDistance: props.scaleByDistance,
    scaleFactor: props.scaleFactor,
    opacity: props.opacity,
    className: props.className,
    style: props.style
  }

  css2dCtx.addLabel(object, config)
}

const applyConfig = () => {
  if (!css2dObject.value) return

  css2dObject.value.position.set(...props.position)
  css2dObject.value.center.set(...props.center)

  const el = css2dObject.value.element

  if (props.offset) {
    el.style.marginLeft = `${props.offset[0]}px`
    el.style.marginTop = `${props.offset[1]}px`
  }

  if (props.className) {
    el.className = props.className
  }

  if (props.style) {
    Object.entries(props.style).forEach(([key, value]) => {
      el.style.setProperty(key, value)
    })
  }

  el.style.opacity = String(props.opacity)
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
  () => props.offset,
  () => applyConfig(),
  { deep: true }
)

watch(
  () => props.center,
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
  if (css2dObject.value) {
    css2dCtx.removeLabel(css2dObject.value)
  }
})

/**
 * @expose
 * @property css2dObject - CSS2DObject 实例
 */
defineExpose({
  css2dObject
})
</script>

<template>
  <div ref="objectRef">
    <slot></slot>
  </div>
</template>
