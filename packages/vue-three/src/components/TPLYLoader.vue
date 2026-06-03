<template>
  <slot :model="model" :loading="loading" :progress="progress" :total="total" :error="error">
  </slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { usePLYLoader } from '../composables/usePLYLoader'
import type { Object3D } from 'three'

/**
 * PLY模型加载器组件
 * @description 加载PLY格式的3D模型文件
 * @component TPLYLoader
 * @example
 * <TPLYLoader
 *   src="/models/model.ply"
 *   :position="[0, 0, 0]"
 *   @load="onModelLoad"
 *   @progress="onProgress"
 * />
 */
const props = defineProps({
  /**
   * PLY模型文件路径
   */
  src: { type: String, required: true },
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
  load: [model: Object3D]
  progress: [event: { loaded: number; total: number }]
  error: [error: Error]
}>()

const { model, loading, progress, total, error } = usePLYLoader(props)

watch(model, newModel => {
  if (newModel) {
    emit('load', newModel)
  }
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
</script>
