<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { useScene, type SceneConfig } from '../composables/useScene'

/**
 * 场景组件
 * @description Three.js 场景容器，是所有3D对象的根容器，用于放置相机、灯光、模型等
 * @component TScene
 * @example
 * <TScene :background="0x000000">
 *   <TPerspectiveCamera />
 *   <TDirectionalLight />
 *   <TMesh />
 * </TScene>
 */
const props = defineProps({
  /**
   * 场景背景颜色
   * @default undefined (透明)
   */
  background: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  /**
   * 背景透明度
   * @default undefined
   */
  backgroundAlpha: {
    type: Number,
    default: undefined
  },
  /**
   * 雾效配置
   * @default undefined (无雾效)
   */
  fog: {
    type: Object as PropType<SceneConfig['fog']>,
    default: undefined
  }
})

const { scene, add, remove } = useScene(props)

/**
 * @expose
 * @property scene - Three.js Scene 实例
 * @property add - 向场景添加对象
 * @property remove - 从场景移除对象
 */
defineExpose({
  scene,
  add,
  remove
})
</script>
