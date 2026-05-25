<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useAttrs, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import { useMaterial } from '../composables/useMaterial'

/**
 * MeshNormalMaterial 材质组件
 * @description 显示几何体法线方向的材质，用于调试和可视化法线
 * @component TMeshNormalMaterial
 * @example
 * <TMesh>
 *   <TConeGeometry :args="[1, 2, 32]" />
 *   <TMeshNormalMaterial />
 * </TMesh>
 */
defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
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
   * @default undefined (使用默认值)
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
  }
})

const attrs = useAttrs()

// 合并 props 和 attrs，attrs 优先级更高（允许覆盖）
const getMaterialConfig = () => {
  return { type: 'normal', ...props, ...attrs }
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
