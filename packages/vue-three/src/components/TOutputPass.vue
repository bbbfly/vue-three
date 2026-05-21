<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import { useOutputPass } from '../composables/useOutputPass'
import type { OutputPassConfig } from '../composables/useOutputPass'

/**
 * 输出通道组件
 * @description 后处理输出通道，用于将最终渲染结果输出到屏幕
 * @component TOutputPass
 * @example
 * <TOutputPass :resolutionScale="1" />
 */
const props = defineProps({
  /**
   * 分辨率缩放比例
   * @default 1
   */
  resolutionScale: {
    type: Number,
    default: 1
  }
})

const config: OutputPassConfig = {
  resolutionScale: props.resolutionScale
}

const { outputPass } = useOutputPass(config)

/**
 * @expose
 * @property outputPass - Three.js OutputPass 实例
 */
defineExpose({
  outputPass
})
</script>