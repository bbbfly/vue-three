<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { toRefs, watch } from 'vue'
import { useCubeTexture } from '../composables/useCubeTexture'

/**
 * 立方体纹理贴图组件
 * @description 加载和配置立方体纹理贴图，用于环境映射、天空盒等
 * @component TCubeTexture
 * @example
 * // 基础立方体纹理
 * <TCubeTexture :urls="cubeUrls" />
 * // 折射映射
 * <TCubeTexture :urls="cubeUrls" mapping="refraction" />
 */
const props = defineProps({
  /**
   * 立方体贴图的6个面图片URL数组
   * 顺序: [+x, -x, +y, -y, +z, -z]
   * @default undefined
   */
  urls: {
    type: Array as PropType<string[]>,
    required: false,
    default: undefined
  },
  /**
   * 立方体纹理映射类型
   * 可选值: 'reflection' (CubeReflectionMapping), 'refraction' (CubeRefractionMapping)
   * @default 'reflection'
   */
  mapping: {
    type: String as PropType<'reflection' | 'refraction'>,
    default: 'reflection'
  },
  /**
   * 基础路径，加载时会拼接 urls 数组中的文件名
   * @default undefined
   */
  path: {
    type: String,
    required: false,
    default: undefined
  }
})

const { texture, load, setMapping } = useCubeTexture({
  urls: props.urls as string[],
  mapping: props.mapping === 'refraction' ? 301 : 300
})

const emit = defineEmits(['load'])

watch(texture, val => {
  if (val) {
    emit('load', val)
  }
})

watch(
  () => props.urls,
  newUrls => {
    if (newUrls) {
      load(newUrls)
    }
  }
)

watch(
  () => props.mapping,
  newMapping => {
    if (newMapping === 'refraction') {
      setMapping(301) // CubeRefractionMapping
    } else {
      setMapping(300) // CubeReflectionMapping
    }
  }
)

/**
 * @expose
 * @property texture - Three.js CubeTexture 实例
 * @property load - 手动加载纹理方法
 * @property setMapping - 设置映射类型
 */
defineExpose({
  texture,
  load,
  setMapping
})
</script>
