<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import { computed } from 'vue'
import { useShaderPass } from '../composables/useShaderPass'
import type { ShaderPassConfig } from '../composables/useShaderPass'
import type { ShaderMaterial } from 'three'

/**
 * 着色器通道组件
 * @description 后处理着色器通道，用于应用自定义着色器效果
 * @component TShaderPass
 * @example
 * <TShaderPass :shader="customShader" />
 */
const props = defineProps({
  /**
   * 自定义着色器材质
   */
  shader: {
    type: Object as () => ShaderMaterial,
    default: null
  },
  /**
   * 着色器uniforms参数
   */
  uniforms: {
    type: Object as () => Record<string, { value: unknown }>,
    default: () => ({})
  }
})

const config = computed<ShaderPassConfig>(() => ({
  shader: props.shader,
  uniforms: props.uniforms
}))

const { shaderPass } = useShaderPass(config)

/**
 * @expose
 * @property shaderPass - Three.js ShaderPass 实例
 */
defineExpose({
  shaderPass
})
</script>
