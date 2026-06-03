<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { computed } from 'vue'
import { useBloomPass } from '../composables/useBloomPass'
import type { BloomPassConfig } from '../composables/useBloomPass'

/**
 * Bloom辉光通道组件
 * @description 提供辉光效果，使高亮区域产生光晕，常用于霓虹灯、发光材质等视觉效果
 * @component TBloomPass
 * @example
 * <TBloomPass :threshold="0.4" :strength="1.5" :radius="0.5" />
 */
const props = defineProps({
  /**
   * 亮度阈值，超过该亮度的像素才会产生辉光
   * @default 0.4
   */
  threshold: {
    type: Number,
    default: 0.4
  },
  /**
   * 辉光强度，数值越大辉光越明显
   * @default 1.5
   */
  strength: {
    type: Number,
    default: 1.5
  },
  /**
   * 辉光扩散半径，数值越大辉光范围越广
   * @default 0.5
   */
  radius: {
    type: Number,
    default: 0.5
  }
})

const config = computed<BloomPassConfig>(() => ({
  threshold: props.threshold,
  strength: props.strength,
  radius: props.radius
}))

const { bloomPass } = useBloomPass(config)

/**
 * @expose
 * @property bloomPass - Three.js UnrealBloomPass 实例
 */
defineExpose({
  bloomPass
})
</script>
