<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { computed } from 'vue'
import { useTAARenderPass } from '../composables/useTAARenderPass'
import type { TAARenderPassConfig } from '../composables/useTAARenderPass'

/**
 * TAA时间抗锯齿通道组件
 * @description 提供时间抗锯齿效果，通过多帧采样实现高质量抗锯齿
 * @component TTAARenderPass
 * @example
 * <TTAARenderPass :sampleLevel="2" :unbiased="true" />
 */
const props = defineProps({
  /**
   * 采样级别，数值越高抗锯齿效果越好但性能消耗越大
   * @default 2
   */
  sampleLevel: {
    type: Number,
    default: 2
  },
  /**
   * 是否启用无偏采样模式
   * @default true
   */
  unbiased: {
    type: Boolean,
    default: true
  }
})

const config = computed<TAARenderPassConfig>(() => ({
  sampleLevel: props.sampleLevel,
  unbiased: props.unbiased
}))

const { taaRenderPass } = useTAARenderPass(config)

/**
 * @expose
 * @property taaRenderPass - Three.js TAARenderPass 实例
 */
defineExpose({
  taaRenderPass
})
</script>
