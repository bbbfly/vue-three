<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { toRefs, watch } from 'vue'
import { useTexture } from '../composables/useTexture'
import type { TextureMapType } from '../core/context'

/**
 * 纹理贴图组件
 * @description 加载和配置纹理贴图，可应用于材质的各种属性（颜色、法线、金属度等）
 * @component TTexture
 * @example
 * // 基础颜色贴图
 * <TTexture url="/textures/color.jpg" mapType="map" :repeat="[2, 2]" />
 * // 法线贴图
 * <TTexture url="/textures/normal.jpg" mapType="normalMap" />
 * // 粗糙度贴图
 * <TTexture url="/textures/roughness.jpg" mapType="roughnessMap" />
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
   * 纹理贴图应用到材质的目标属性类型
   * @default 'map'
   */
  mapType: {
    type: String as PropType<TextureMapType>,
    default: 'map'
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
  },
  /**
   * 纹理颜色空间，如 'srgb'
   * @default undefined
   */
  colorSpace: {
    type: String,
    default: undefined
  }
})

const { texture, load, updateSettings } = useTexture({
  url: props.url,
  mapType: props.mapType,
  wrapS: props.wrapS,
  wrapT: props.wrapT,
  magFilter: props.magFilter,
  minFilter: props.minFilter,
  repeat: props.repeat,
  offset: props.offset,
  center: props.center,
  rotation: props.rotation,
  colorSpace: props.colorSpace
})

// const { url, wrapS, wrapT, magFilter, minFilter, repeat, offset, center, rotation, colorSpace } = toRefs(props)

// watch(
//   [url, wrapS, wrapT, magFilter, minFilter, repeat, offset, center, rotation, colorSpace],
//   () => {
//     updateSettings({
//       url: props.url,
//       wrapS: props.wrapS,
//       wrapT: props.wrapT,
//       magFilter: props.magFilter,
//       minFilter: props.minFilter,
//       repeat: props.repeat,
//       offset: props.offset,
//       center: props.center,
//       rotation: props.rotation,
//       colorSpace: props.colorSpace
//     })
//   },
//   { deep: true }
// )

/**
 * @expose
 * @property texture - Three.js Texture 实例
 * @property load - 手动加载纹理方法
 * @property updateSettings - 更新纹理设置
 */
defineExpose({
  texture,
  load,
  updateSettings
})
</script>
