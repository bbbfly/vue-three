<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useAttrs, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'

/**
 * MeshDepthMaterial 材质组件
 * @description 用于渲染深度信息的材质，常用于后期处理效果（如景深、运动模糊等）
 * @component TMeshDepthMaterial
 * @example
 * <TMesh>
 *   <TBoxGeometry />
 *   <TMeshDepthMaterial depthPacking="RGBADepthPacking" />
 * </TMesh>
 */
defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  /**
   * 深度打包模式
   * - 'BasicDepthPacking' (0): 基础深度打包
   * - 'RGBADepthPacking' (1): RGBA深度打包
   * - 'RGBDepthPacking' (2): RGB深度打包（扩展范围）
   * - 'RGDepthPacking' (3): RG深度打包
   * @default undefined (使用默认值 BasicDepthPacking)
   */
  depthPacking: {
    type: [Number, String],
    default: undefined
  },
  /**
   * 是否透明
   * @default false
   */
  transparent: {
    type: Boolean,
    default: false
  },
  /**
   * 透明度 (0-1)
   * @default 1
   */
  opacity: {
    type: Number,
    default: 1
  },
  /**
   * 是否显示为线框
   * @default false
   */
  wireframe: {
    type: Boolean,
    default: false
  },
  /**
   * 渲染面
   * @default undefined
   */
  side: {
    type: Number,
    default: undefined
  },
  /**
   * 是否写入深度缓冲
   * @default undefined
   */
  depthWrite: {
    type: Boolean,
    default: undefined
  },
  /**
   * 是否启用深度测试
   * @default undefined
   */
  depthTest: {
    type: Boolean,
    default: undefined
  },
  /**
   * 是否启用剪裁
   * @default false
   */
  clipping: {
    type: Boolean,
    default: false
  },
  /**
   * 是否剪裁阴影
   * @default false
   */
  clipShadows: {
    type: Boolean,
    default: false
  },
  /**
   * 是否预设颜色空间
   * @default true
   */
  colorSpace: {
    type: String,
    default: undefined
  },
  /**
   * 位移贴图缩放
   * @default undefined
   */
  displacementScale: {
    type: Number,
    default: undefined
  },
  /**
   * 位移贴图偏移
   * @default undefined
   */
  displacementBias: {
    type: Number,
    default: undefined
  }
})

const attrs = useAttrs()

// 合并 props 和 attrs，attrs 优先级更高（允许覆盖）
const getMaterialConfig = () => {
  return { type: 'depth', ...props, ...attrs }
}

const { material, updateMaterial } = useMaterial(getMaterialConfig())

// 监听 props 和 attrs 变化，自动更新材质
watch(
  () => ({ ...props, ...attrs }),
  () => {
    updateMaterial(getMaterialConfig())
  },
  { deep: true }
)

onMounted(() => {
  updateMaterial(getMaterialConfig())
})

defineExpose({
  material
})
</script>
