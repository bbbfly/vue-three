<template>
  <slot :mixer="mixer" :root="effectiveRoot"></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { computed, watch } from 'vue'
import type { Object3D } from 'three'
import { AnimationAction, AnimationClip } from 'three'
import { useAnimationMixer } from '../composables/useAnimationMixer'

/**
 * 动画混合器组件
 * @description 管理动画播放的核心组件，用于控制模型的骨骼动画、关键帧动画等
 * @component TAnimationMixer
 * @example
 * <TAnimationMixer :root="model">
 *   <TKeyframeAnimation :tracks="tracks" />
 * </TAnimationMixer>
 */
const props = defineProps({
  /**
   * 动画根对象，应用动画的3D模型
   * @default undefined (自动查找父级网格)
   */
  root: { type: Object as PropType<Object3D>, required: false },
  /**
   * 是否自动更新动画时间
   * @default true
   */
  autoUpdate: { type: Boolean, default: true }
})

const { mixer, setRoot } = useAnimationMixer({
  autoUpdate: props.autoUpdate
})

const effectiveRoot = computed<Object3D | undefined>(() => props.root)

watch(
  effectiveRoot,
  newRoot => {
    if (newRoot) {
      setRoot(newRoot)
    }
  },
  { immediate: true }
)

/**
 * 创建或获取动画动作
 * @param clip - 动画剪辑或剪辑名称
 * @param root - 可选的根对象
 */
function clipAction(clip: AnimationClip | string, root?: Object3D): AnimationAction | null {
  return mixer.value ? mixer.value.clipAction(clip as AnimationClip, root) : null
}

/**
 * 停止所有正在播放的动画
 */
function stopAllAction(): void {
  mixer.value?.stopAllAction()
}

/**
 * 更新动画时间
 * @param deltaTime - 时间增量，单位秒
 */
function update(deltaTime: number): void {
  mixer.value?.update(deltaTime)
}

/**
 * 设置动画时间
 * @param time - 时间点，单位秒
 */
function setTime(time: number): void {
  mixer.value?.setTime(time)
}

/**
 * @expose
 * @property mixer - Three.js AnimationMixer 实例
 * @property clipAction - 创建/获取动画动作
 * @property stopAllAction - 停止所有动画
 * @property update - 更新动画时间
 * @property setTime - 设置动画时间
 * @property setRoot - 设置动画根对象
 */
defineExpose({
  mixer,
  clipAction,
  stopAllAction,
  update,
  setTime,
  setRoot
})
</script>
