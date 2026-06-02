<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useAttrs, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'
import { useCamelCaseKeys } from '../hooks'
/**
 * MeshToonMaterial 卡通材质组件
 * @description 卡通风格材质，使用渐变贴图实现阶梯状的光照效果，常用于动漫风格的渲染
 * @component TMeshToonMaterial
 * @example
 * <TMesh>
 *   <TSphereGeometry />
 *   <TMeshToonMaterial :color="0xff0000" :gradientMap="gradientMap" />
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
   * 渐变贴图，用于控制卡通效果的阶梯数量
   * @default null
   */
  gradientMap: {
    type: Object as PropType<any>,
    default: null
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
  }
})

const attrs = useAttrs()

// 合并 props 和 attrs，attrs 优先级更高（允许覆盖）
const getMaterialConfig = () => {
  return { type: 'toon', ...props, ...useCamelCaseKeys(attrs) }
}

const { material, updateMaterial } = useMaterial(getMaterialConfig())

// 监听 props 和 attrs 变化，自动更新材质
watch(
  () => ({ ...props, ...useCamelCaseKeys(attrs) }),
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
