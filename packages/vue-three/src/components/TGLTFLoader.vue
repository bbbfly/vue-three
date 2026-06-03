<template>
  <slot
    :model="model"
    :animations="animations"
    :loading="loading"
    :progress="progress"
    :total="total"
    :error="error"
  >
  </slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { useGLTFLoader } from '../composables/useGLTFLoader'
import type { Object3D, AnimationClip } from 'three'

/**
 * GLTF模型加载器组件
 * @description 加载GLTF/GLB格式的3D模型文件，支持Draco压缩模型加载
 * @component TGLTFLoader
 * @example
 * <TGLTFLoader
 *   src="/models/scene.glb"
 *   :draco="true"
 *   :position="[0, 0, 0]"
 *   @load="onModelLoad"
 *   @progress="onProgress"
 * />
 */
const props = defineProps({
  /**
   * GLTF/GLB模型文件路径
   */
  src: { type: String, required: true },
  /**
   * 是否启用Draco压缩解码
   * @default false
   */
  draco: { type: Boolean, default: false },
  /**
   * Draco解码器路径，用于自定义解码器位置
   * @default 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
   */
  dracoDecoderPath: { type: String, default: '' },
  /**
   * 模型位置坐标 [x, y, z]
   * @default [0, 0, 0]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 模型旋转角度 [x, y, z]，单位弧度
   * @default undefined
   */
  rotation: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: undefined
  },
  /**
   * 模型缩放比例 [x, y, z]
   * @default undefined
   */
  scale: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: undefined
  },
  /**
   * 模型是否投射阴影
   * @default false
   */
  castShadow: { type: Boolean, default: false },
  /**
   * 模型是否接收阴影
   * @default false
   */
  receiveShadow: { type: Boolean, default: false },
  /**
   * 模型是否可见
   * @default true
   */
  visible: { type: Boolean, default: true }
})

const emit = defineEmits<{
  load: [model: Object3D, animations: AnimationClip[]]
  progress: [event: { loaded: number; total: number }]
  error: [error: Error]
}>()

const { model, animations, loading, progress, total, error } = useGLTFLoader(props)

watch(model, newModel => {
  emit('load', newModel!, animations.value)
})

watch(
  () => ({ loaded: progress.value, total: total.value }),
  ({ loaded, total: t }) => {
    if (loading.value) {
      emit('progress', { loaded, total: t })
    }
  }
)

watch(error, newError => {
  if (newError) {
    emit('error', newError)
  }
})

/**
 * @expose
 * @property model - 加载后的 Three.js 模型根对象
 * @property animations - 模型包含的动画剪辑数组
 * @property loading - 是否正在加载中
 * @property progress - 已加载字节数
 * @property total - 总字节数
 * @property error - 加载错误信息
 */
defineExpose({
  model,
  animations,
  loading,
  progress,
  total,
  error
})
</script>
