<script setup lang="ts">
import { inject, ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { CSS2DContextKey, CSS2DGroupContextKey, type CSS2DLabelConfig } from '../core/context'

/**
 * CSS2D 标签组件
 * @description 在 3D 空间中渲染的 HTML 2D 标签，始终面向相机，支持距离控制和样式定制
 * @component TCSS2DLabel
 * @example
 * <TCSS2DLabel
 *   :position="[1, 2, 3]"
 *   :offset="[10, -10]"
 *   :min-distance="5"
 *   :max-distance="50"
 *   :scale-by-distance="true"
 *   class-name="custom-label"
 *   :style="{ background: 'rgba(0,0,0,0.7)', color: 'white' }"
 *   @click="handleClick"
 * >
 *   <div>自定义标签内容</div>
 * </TCSS2DLabel>
 */

const props = withDefaults(
  defineProps<{
    position: [number, number, number]
    offset?: [number, number]
    minDistance?: number
    maxDistance?: number
    scaleByDistance?: boolean
    scaleFactor?: number
    opacity?: number
    className?: string
    style?: Record<string, string>
    layers?: number
  }>(),
  {
    offset: () => [0, 0],
    scaleByDistance: false,
    scaleFactor: 1,
    opacity: 1,
    layers: undefined
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
  mouseenter: [event: MouseEvent]
  mouseleave: [event: MouseEvent]
}>()

const css2dCtx = inject(CSS2DContextKey)
const css2dGroupCtx = inject(CSS2DGroupContextKey)

if (!css2dCtx) {
  throw new Error('TCSS2DLabel must be used within a TCSS2DRenderer component')
}

const labelRef = ref<HTMLElement | null>(null)
let css2dObject: CSS2DObject | null = null

const createLabel = () => {
  if (!labelRef.value) return

  const object = new CSS2DObject(labelRef.value)
  css2dObject = object

  applyConfig()
  bindEvents()

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

  if (css2dGroupCtx) {
    applyConfig()
    css2dGroupCtx.group.add(object)
  } else {
    css2dCtx.addLabel(object, config)
  }
}

const applyConfig = () => {
  if (!css2dObject) return

  css2dObject.position.set(...props.position)
  css2dObject.center.set(0.5, 0.5)

  if (props.layers !== undefined) {
    css2dObject.layers.set(props.layers)
  }

  const el = css2dObject.element

  if (props.offset) {
    el.style.marginLeft = `${props.offset[0]}px`
    el.style.marginTop = `${props.offset[1]}px`
  }

  if (props.className) {
    el.className = `css2d-label ${props.className}`
  } else {
    el.className = 'css2d-label'
  }

  if (props.style) {
    Object.entries(props.style).forEach(([key, value]) => {
      el.style.setProperty(key, value)
    })
  }

  el.style.opacity = String(props.opacity)
  el.style.pointerEvents = 'auto'
  el.style.userSelect = 'none'
}

const bindEvents = () => {
  if (!css2dObject) return

  const el = css2dObject.element

  el.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation()
    emit('click', e)
  })

  el.addEventListener('mouseenter', (e: MouseEvent) => {
    emit('mouseenter', e)
  })

  el.addEventListener('mouseleave', (e: MouseEvent) => {
    emit('mouseleave', e)
  })
}

onMounted(() => {
  createLabel()
})

const updateConfig = () => {
  if (!css2dObject) return

  applyConfig()

  css2dCtx.updateLabelConfig(css2dObject, {
    position: props.position,
    offset: props.offset,
    minDistance: props.minDistance,
    maxDistance: props.maxDistance,
    scaleByDistance: props.scaleByDistance,
    scaleFactor: props.scaleFactor,
    opacity: props.opacity,
    className: props.className,
    style: props.style
  })
}

watch(
  () => [
    props.position,
    props.offset,
    props.minDistance,
    props.maxDistance,
    props.scaleByDistance,
    props.scaleFactor,
    props.opacity,
    props.className,
    props.style,
    props.layers
  ],
  () => {
    updateConfig()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (css2dObject) {
    if (css2dGroupCtx) {
      css2dGroupCtx.group.remove(css2dObject)
    } else {
      css2dCtx.removeLabel(css2dObject)
    }
  }
})

/**
 * @expose
 * @property css2dObject - CSS2DObject 实例
 */
defineExpose({
  css2dObject: () => css2dObject
})
</script>

<template>
  <div ref="labelRef" class="css2d-label-root">
    <slot></slot>
  </div>
</template>

<style>
.css2d-label-root {
  display: inline-block;
}
</style>
