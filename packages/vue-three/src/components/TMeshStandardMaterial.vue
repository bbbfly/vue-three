<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useAttrs, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'
import { useCamelCaseKeys } from '../hooks'
/**
 * MeshStandardMaterial 材质组件
 * @description 基于物理的渲染(PBR)标准材质，支持金属度/粗糙度工作流
 * @component TMeshStandardMaterial
 * @example
 * <TMesh>
 *   <TBoxGeometry />
 *   <TMeshStandardMaterial :color="0xff0000" :metalness="0.5" :roughness="0.5" />
 * </TMesh>
 */
defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  /**
   * 材质颜色
   * @default 0xffffff
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 金属度 (0-1)
   * @default 0
   */
  metalness: {
    type: Number,
    default: 0
  },
  /**
   * 粗糙度 (0-1)
   * @default 1
   */
  roughness: {
    type: Number,
    default: 1
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
   * 是否启用平面着色
   * @default undefined
   */
  flatShading: {
    type: Boolean,
    default: undefined
  },
  /**
   * 是否剪裁阴影
   * @default undefined
   */
  clipShadows: {
    type: Boolean,
    default: undefined
  },
  /**
   * 阴影面
   * @default undefined
   */
  shadowSide: {
    type: Number,
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
   * 是否预设颜色空间
   * @default true
   */
  colorSpace: {
    type: String,
    default: undefined
  },
  /**
   * 发光颜色
   * @default 0x000000
   */
  emissive: {
    type: [String, Number] as PropType<string | number>,
    default: 0x000000
  },
  /**
   * 发光强度
   * @default 1
   */
  emissiveIntensity: {
    type: Number,
    default: 1
  },
  /**
   * 环境光遮蔽强度
   * @default 1
   */
  aoMapIntensity: {
    type: Number,
    default: 1
  },
  /**
   * 法线贴图缩放
   * @default [1, 1]
   */
  normalScale: {
    type: Array as PropType<[number, number]>,
    default: () => [1, 1]
  },
  /**
   * 位移贴图缩放
   * @default 1
   */
  displacementScale: {
    type: Number,
    default: undefined
  },
  /**
   * 位移贴图偏移
   * @default 0
   */
  displacementBias: {
    type: Number,
    default: undefined
  },
  /**
   * 凹凸贴图缩放
   * @default 1
   */
  bumpScale: {
    type: Number,
    default: undefined
  }
})

const attrs = useAttrs()

// 合并 props 和 attrs，attrs 优先级更高（允许覆盖）
const getMaterialConfig = () => {
  return { type: 'standard', ...props, ...useCamelCaseKeys(attrs) }
}

const { material, updateMaterial } = useMaterial(getMaterialConfig())

// 监听 props 和 attrs 变化，自动更新材质
watch(
  () => ({ ...props, ...useCamelCaseKeys(attrs) }),
  (val) => {
    console.log(val)
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
