<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { provide } from 'vue'
import { EffectComposerContextKey } from '../core/context'
import { useRenderPipeline } from '../composables/useRenderPipeline'

/**
 * 效果合成器组件
 * @description 后期处理管线的根容器，用于管理各种后期渲染通道，实现 bloom、抗锯齿等特效
 * @component TEffectComposer
 * @example
 * <TEffectComposer>
 *   <TSSAAPass :sampleLevel="2" />
 *   <TBloomPass :threshold="0.5" :strength="1" />
 * </TEffectComposer>
 */

const { composer, enable, addPass, removePass } = useRenderPipeline()

enable()

provide(EffectComposerContextKey, {
  addPass,
  removePass
})

/**
 * @expose
 * @property composer - Three.js EffectComposer 实例
 */
defineExpose({
  composer
})
</script>

<template>
  <slot></slot>
</template>
