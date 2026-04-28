<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useTexture } from '../composables/useTexture'

/**
 * 纹理贴图组件
 * @description 加载和配置纹理贴图，可应用于材质的各种属性（颜色、法线、金属度等）
 * @component TTexture
 * @example
 * <TTexture
 *   url="/textures/wood.jpg"
 *   :repeat="[2, 2]"
 *   :wrapS="1000"
 *   :wrapT="1000"
 * />
 */
const props = defineProps({
  /**
   * 纹理图片URL地址
   * @default undefined
   */
  url: {
    type: String,
    required: false,
    default: undefined
  },
  /**
   * S方向（U方向）包裹模式
   * @default undefined
   */
  wrapS: {
    type: Number,
    default: undefined
  },
  /**
   * T方向（V方向）包裹模式
   * @default undefined
   */
  wrapT: {
    type: Number,
    default: undefined
  },
  /**
   * 放大过滤模式
   * @default undefined
   */
  magFilter: {
    type: Number,
    default: undefined
  },
  /**
   * 缩小过滤模式
   * @default undefined
   */
  minFilter: {
    type: Number,
    default: undefined
  },
  /**
   * 纹理重复次数 [x, y]
   * @default undefined
   */
  repeat: {
    type: Array as unknown as PropType<[number, number]>,
    default: undefined
  },
  /**
   * 纹理偏移量 [x, y]
   * @default undefined
   */
  offset: {
    type: Array as unknown as PropType<[number, number]>,
    default: undefined
  },
  /**
   * 纹理旋转中心点 [x, y]
   * @default undefined
   */
  center: {
    type: Array as unknown as PropType<[number, number]>,
    default: undefined
  },
  /**
   * 纹理旋转角度，单位弧度
   * @default undefined
   */
  rotation: {
    type: Number,
    default: undefined
  }
})

const { texture, load } = useTexture({
  url: props.url,
  wrapS: props.wrapS,
  wrapT: props.wrapT,
  magFilter: props.magFilter,
  minFilter: props.minFilter,
  repeat: props.repeat,
  offset: props.offset,
  center: props.center,
  rotation: props.rotation
})

/**
 * @expose
 * @property texture - Three.js Texture 实例
 * @property load - 手动加载纹理方法
 */
defineExpose({
  texture,
  load
})
</script>
