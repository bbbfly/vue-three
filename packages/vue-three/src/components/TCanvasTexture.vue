<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { toRefs, watch } from 'vue'
import { useCanvasTexture } from '../composables/useCanvasTexture'
import type { TextureMapType } from '../core/context'

/**
 * Canvas 纹理贴图组件
 * @description 从 HTMLCanvasElement 创建和配置 Canvas 纹理贴图，可应用于材质的各种属性
 * @component TCanvasTexture
 * @example
 * // 基础 Canvas 纹理
 * <TCanvasTexture :canvas="myCanvas" mapType="map" />
 * // 径向渐变阴影纹理
 * <TCanvasTexture :canvas="shadowCanvas" />
 */
const props = defineProps({
  /**
   * HTMLCanvasElement 画布对象
   * @default undefined
   */
  canvas: {
    type: Object as PropType<HTMLCanvasElement>,
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

const { texture, createCanvasTexture, updateSettings } = useCanvasTexture({
  canvas: props.canvas,
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

const { canvas, wrapS, wrapT, magFilter, minFilter, repeat, offset, center, rotation, colorSpace } = toRefs(props)

watch(
  [canvas, wrapS, wrapT, magFilter, minFilter, repeat, offset, center, rotation, colorSpace],
  () => {
    updateSettings({
      canvas: props.canvas,
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
  },
  { deep: true }
)

/**
 * @expose
 * @property texture - Three.js CanvasTexture 实例
 * @property createCanvasTexture - 手动从新画布创建纹理方法
 * @property updateSettings - 更新纹理设置
 */
defineExpose({
  texture,
  createCanvasTexture,
  updateSettings
})
</script>
