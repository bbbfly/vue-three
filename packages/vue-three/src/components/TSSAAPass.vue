<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import { computed } from 'vue'
import { useSSAAPass } from '../composables/useSSAAPass'
import type { SSAAPassConfig } from '../composables/useSSAAPass'

/**
 * SSAA超采样抗锯齿通道组件
 * @description 提供超采样抗锯齿效果，通过放大渲染再缩小的方式实现高质量抗锯齿
 * @component TSSAAPass
 * @example
 * <TSSAAPass :sampleLevel="2" :unbiased="true" />
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

const config = computed<SSAAPassConfig>(() => ({
  sampleLevel: props.sampleLevel,
  unbiased: props.unbiased
}))

const { ssaaPass } = useSSAAPass(config)

/**
 * @expose
 * @property ssaaPass - Three.js SSAARenderPass 实例
 */
defineExpose({
  ssaaPass
})
</script>
