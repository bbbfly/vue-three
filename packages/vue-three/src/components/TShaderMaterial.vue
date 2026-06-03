<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'
import { watch } from 'vue'

/**
 * 着色器材质组件
 * @description 使用自定义 GLSL 着色器渲染材质，支持顶点着色器和片元着色器
 * @component TShaderMaterial
 * @example
 * <TShaderMaterial
 *   :uniforms="{ time: { value: 0 } }"
 *   :vertexShader="vertexShader"
 *   :fragmentShader="fragmentShader"
 * />
 */
const props = defineProps({
  /**
   * 着色器类型，shader 或 rawShader
   * @default 'shader'
   * @description rawShader 使用 RawShaderMaterial，不会自动注入内置 uniforms
   */
  shaderType: {
    type: String as PropType<'shader' | 'rawShader'>,
    default: 'shader'
  },
  /**
   * 着色器 uniform 变量
   * @default {}
   */
  uniforms: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  /**
   * 顶点着色器代码
   * @default undefined
   */
  vertexShader: {
    type: String,
    default: undefined
  },
  /**
   * 片元着色器代码
   * @default undefined
   */
  fragmentShader: {
    type: String,
    default: undefined
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
   * 是否以线框模式渲染
   * @default false
   */
  wireframe: {
    type: Boolean,
    default: false
  },
  /**
   * 混合模式
   * @default THREE.NormalBlending
   */
  blending: {
    type: Number as PropType<number>,
    default: undefined
  },
  /**
   * 是否启用 premultiplied alpha
   * @default false
   */
  premultipliedAlpha: {
    type: Boolean,
    default: false
  },
  /**
   * 渲染面
   * @default undefined (使用 THREE 默认值)
   */
  side: {
    type: Number as PropType<number>,
    default: undefined
  },
  /**
   * GLSL 版本
   * @default undefined (使用 THREE 默认值)
   * @description 支持值: THREE.GLSL1 或 THREE.GLSL3
   */
  glslVersion: {
    type: String as PropType<string>,
    default: undefined
  },
  lights: {
    type: Boolean,
    default: false
  }
})

const { material } = useMaterial({
  type: props.shaderType,
  uniforms: props.uniforms,
  vertexShader: props.vertexShader,
  fragmentShader: props.fragmentShader,
  transparent: props.transparent,
  opacity: props.opacity,
  wireframe: props.wireframe,
  blending: props.blending,
  premultipliedAlpha: props.premultipliedAlpha,
  side: props.side,
  glslVersion: props.glslVersion,
  lights: props.lights
})

/**
 * @expose
 * @property material - Three.js ShaderMaterial 实例
 */
defineExpose({
  material
})
</script>
