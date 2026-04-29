<script setup lang="ts">
import { useCSS2DRenderer } from '../composables/useCSS2DRenderer'

/**
 * CSS2D 渲染器根组件
 * @description CSS2D 标签渲染系统的根容器，负责初始化渲染器、管理标签容器，并向子组件提供上下文
 * @component TCSS2DRenderer
 * @example
 * <TCSS2DRenderer>
 *   <TCSS2DLabel :position="[0, 2, 0]">
 *     <div class="custom-label">Hello World</div>
 *   </TCSS2DLabel>
 * </TCSS2DRenderer>
 */

const { renderer, labelContainer, labels, addLabel, removeLabel } = useCSS2DRenderer()

/**
 * @expose
 * @property renderer - CSS2DRenderer 实例
 * @property labelContainer - 标签容器 DOM 元素
 * @property labels - 已注册的标签 Map
 * @property addLabel - 手动添加标签方法
 * @property removeLabel - 手动移除标签方法
 */
defineExpose({
  renderer,
  labelContainer,
  labels,
  addLabel,
  removeLabel
})
</script>

<template>
  <slot></slot>
</template>
