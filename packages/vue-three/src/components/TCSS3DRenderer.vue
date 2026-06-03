<script setup lang="ts">
import { useCSS3DRenderer } from '../composables/useCSS3DRenderer'

/**
 * CSS3D 渲染器根组件
 * @description CSS3D 对象渲染系统的根容器，负责初始化渲染器、管理对象容器，并向子组件提供上下文
 * @component TCSS3DRenderer
 * @example
 * <TCSS3DRenderer>
 *   <TCSS3DObject :position="[0, 0, 0]">
 *     <div class="custom-content">3D HTML Content</div>
 *   </TCSS3DObject>
 * </TCSS3DRenderer>
 */

const { renderer, container, objects, addObject, removeObject } = useCSS3DRenderer()

/**
 * @expose
 * @property renderer - CSS3DRenderer 实例
 * @property container - 对象容器 DOM 元素
 * @property objects - 已注册的对象 Map
 * @property addObject - 手动添加对象方法
 * @property removeObject - 手动移除对象方法
 */
defineExpose({
  renderer,
  container,
  objects,
  addObject,
  removeObject
})

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <slot></slot>
</template>
