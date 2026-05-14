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
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch } from 'vue'
import { useFBXLoader } from '../composables/useFBXLoader'
import type { Object3D, AnimationClip } from 'three'

/**
 * FBX模型加载器组件
 * @description 加载FBX格式的3D模型文件，支持动画
 * @component TFBXLoader
 * @example
 * <TFBXLoader
 *   src="/models/model.fbx"
 *   :position="[0, 0, 0]"
 *   @load="onModelLoad"
 *   @progress="onProgress"
 * />
 */
const props = defineProps({
  /**
   * FBX模型文件路径
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
  load: [model: Object3D, animations: AnimationClip[]]
  progress: [event: { loaded: number; total: number }]
  error: [error: Error]
}>()

const { model, animations, loading, progress, total, error } = useFBXLoader(props)

watch(model, newModel => {
  if (newModel) {
    emit('load', newModel, animations.value)
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
