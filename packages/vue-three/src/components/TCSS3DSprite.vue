<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { CSS3DSprite } from 'three/addons/renderers/CSS3DRenderer.js'
import { CSS3DContextKey, CSS3DGroupContextKey, type CSS3DObjectConfig } from '../core/context'

/**
 * CSS3D Sprite 组件
 * @description 用于在3D场景中渲染HTML精灵元素的组件，始终面向相机
 * @component TCSS3DSprite
 * @example
 * <TCSS3DSprite :position="[0, 0, 0]" :scale="[1, 1, 1]">
 *   <img src="sprite.png" />
 * </TCSS3DSprite>
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
const css3dGroupCtx = inject(CSS3DGroupContextKey, null, true)

if (!css3dCtx) {
  throw new Error('TCSS3DSprite must be used within a TCSS3DRenderer component')
}

const objectRef = ref<HTMLElement | null>(null)
let css3dSprite: CSS3DSprite | null = null

const createSprite = () => {
  if (!objectRef.value) return

  const sprite = new CSS3DSprite(objectRef.value)
  css3dSprite = sprite

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
    css3dGroupCtx.group.add(sprite)
  } else {
    css3dCtx.addObject(sprite, config)
  }
}

const applyConfig = () => {
  if (!css3dSprite) return
  css3dSprite.position.set(...props.position)
  css3dSprite.rotation.set(...props.rotation)
  css3dSprite.scale.set(...props.scale)

  const el = css3dSprite.element

  if (props.className) {
    el.className = props.className
  }
}

onMounted(() => {
  createSprite()
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
  if (css3dSprite) {
    if (css3dGroupCtx) {
      css3dGroupCtx.group.remove(css3dSprite)
    } else {
      css3dCtx.removeObject(css3dSprite)
    }
  }
})

/**
 * @expose
 * @property css3dSprite - CSS3DSprite 实例
 */
defineExpose({
  css3dSprite: () => css3dSprite
})
</script>

<template>
  <div ref="objectRef" :style="props.style">
    <slot></slot>
  </div>
</template>
