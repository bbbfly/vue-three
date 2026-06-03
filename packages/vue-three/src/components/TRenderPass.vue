<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { computed } from 'vue'
import { useRenderPass } from '../composables/useRenderPass'
import type { RenderPassConfig } from '../composables/useRenderPass'

/**
 * 渲染通道组件
 * @description 后处理渲染通道，用于将场景渲染到渲染目标
 * @component TRenderPass
 * @example
 * <TRenderPass :clear="true" :clearDepth="false" />
 */
const props = defineProps({
  /**
   * 是否在渲染前清除渲染目标
   * @default true
   */
  clear: {
    type: Boolean,
    default: true
  },
  /**
   * 是否清除深度缓冲区
   * @default false
   */
  clearDepth: {
    type: Boolean,
    default: false
  }
})

const config = computed<RenderPassConfig>(() => ({
  clear: props.clear,
  clearDepth: props.clearDepth
}))

const { renderPass } = useRenderPass(config)

/**
 * @expose
 * @property renderPass - Three.js RenderPass 实例
 */
defineExpose({
  renderPass
})
</script>
