<template>
  <slot :draco-loader="dracoLoader" :get-decoder="getDecoder"></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import { useDRACOLoader } from '../composables/useDRACOLoader'

/**
 * Draco解码器组件
 * @description 提供Draco压缩模型解码支持，可配合GLTFLoader使用
 * @component TDRACOLoader
 * @example
 * <TDRACOLoader v-slot="{ dracoLoader }">
 *   <TGLTFLoader src="/models/compressed.glb" :draco="true" />
 * </TDRACOLoader>
 */
const props = defineProps({
  /**
   * Draco解码器库文件路径
   * @default 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
   */
  decoderPath: { type: String, default: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' }
})

const { dracoLoader, getDecoder } = useDRACOLoader(props)

defineExpose({
  dracoLoader,
  getDecoder
})
</script>
