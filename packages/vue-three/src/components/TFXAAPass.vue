<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import { computed } from 'vue'
import { useFXAAPass } from '../composables/useFXAAPass'
import type { FXAAPassConfig } from '../composables/useFXAAPass'

/**
 * FXAA抗锯齿通道组件
 * @description 快速近似抗锯齿通道，用于减少画面锯齿
 * @component TFXAAPass
 * @example
 * <TFXAAPass />
 */
const props = defineProps({
  /**
   * 分辨率
   */
  resolution: {
    type: Array as () => [number, number],
    default: undefined
  }
})

const config = computed<FXAAPassConfig>(() => ({
  resolution: props.resolution
}))

const { fxaaPass } = useFXAAPass(config)

/**
 * @expose
 * @property fxaaPass - Three.js FXAAPass 实例
 */
defineExpose({
  fxaaPass
})
</script>
