<template>
  <slot
    :clip="clip"
    :action="action"
    :play="play"
    :pause="pause"
    :resume="resume"
    :stop="stop"
    :reset="reset"
  ></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { KeyframeTrackConfig } from '../composables/useKeyframeAnimation'
import { useKeyframeAnimation } from '../composables/useKeyframeAnimation'

/**
 * 关键帧动画组件
 * @description 通过关键帧数据创建自定义动画，可控制位置、旋转、缩放等属性的动画
 * @component TKeyframeAnimation
 * @example
 * <TKeyframeAnimation
 *   :tracks="[
 *     {
 *       name: '.position',
 *       times: [0, 1, 2],
 *       values: [0, 0, 0, 0, 2, 0, 0, 0, 0]
 *     }
 *   ]"
 *   :loop="LoopRepeat"
 *   :autoplay="true"
 * />
 */
const props = defineProps({
  /**
   * 动画名称
   * @default 'animation'
   */
  name: { type: String, default: 'animation' },
  /**
   * 关键帧轨道配置数组
   */
  tracks: {
    type: Array as unknown as PropType<KeyframeTrackConfig[]>,
    required: true
  },
  /**
   * 动画总时长，单位秒
   * @default undefined (自动计算)
   */
  duration: { type: Number, default: undefined },
  /**
   * 是否自动播放
   * @default true
   */
  autoplay: { type: Boolean, default: true },
  /**
   * 循环模式: LoopOnce(1), LoopRepeat(2), LoopPingPong(3)
   * @default undefined
   */
  loop: { type: Number, default: undefined },
  /**
   * 重复次数，Infinite 表示无限
   * @default undefined
   */
  repetitions: { type: Number, default: undefined },
  /**
   * 动画结束时是否保持最后一帧状态
   * @default false
   */
  clampWhenFinished: { type: Boolean, default: false },
  /**
   * 时间缩放系数，大于1加快，小于1减慢
   * @default 1
   */
  timeScale: { type: Number, default: 1 }
})

const {
  clip,
  action,
  play,
  pause,
  resume,
  stop,
  reset,
  setLoop,
  setTimeScale,
  setWeight,
  LoopOnce,
  LoopRepeat,
  LoopPingPong
} = useKeyframeAnimation(props)

/**
 * @expose
 * @property clip - Three.js AnimationClip 实例
 * @property action - Three.js AnimationAction 实例
 * @property play - 播放动画
 * @property pause - 暂停动画
 * @property resume - 恢复动画
 * @property stop - 停止动画
 * @property reset - 重置动画
 * @property setLoop - 设置循环模式
 * @property setTimeScale - 设置时间缩放
 * @property setWeight - 设置混合权重
 * @property LoopOnce - 循环一次常量
 * @property LoopRepeat - 循环重复常量
 * @property LoopPingPong - 往返循环常量
 */
defineExpose({
  clip,
  action,
  play,
  pause,
  resume,
  stop,
  reset,
  setLoop,
  setTimeScale,
  setWeight,
  LoopOnce,
  LoopRepeat,
  LoopPingPong
})
</script>
