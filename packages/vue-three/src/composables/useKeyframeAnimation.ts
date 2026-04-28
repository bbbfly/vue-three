import { inject, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { InterpolationModes } from 'three'
import {
  NumberKeyframeTrack,
  VectorKeyframeTrack,
  ColorKeyframeTrack,
  BooleanKeyframeTrack,
  StringKeyframeTrack,
  QuaternionKeyframeTrack,
  AnimationClip,
  AnimationAction,
  LoopOnce,
  LoopRepeat,
  LoopPingPong
} from 'three'
import { AnimationContextKey, MeshContextKey } from '../core/context'

export type KeyframeTrackType = 'number' | 'vector' | 'color' | 'boolean' | 'string' | 'quaternion'

export interface KeyframeTrackConfig {
  name: string
  type: KeyframeTrackType
  times: number[]
  values: number[] | string[] | boolean[]
  interpolation?: InterpolationModes
}

export interface KeyframeAnimationOptions {
  name?: string
  tracks: KeyframeTrackConfig[]
  duration?: number
  autoplay?: boolean
  loop?: number
  repetitions?: number
  clampWhenFinished?: boolean
  timeScale?: number
}

export function createKeyframeTrack(config: KeyframeTrackConfig) {
  const { name, type, times, values, interpolation } = config

  switch (type) {
    case 'number':
      return new NumberKeyframeTrack(name, times, values as number[], interpolation)
    case 'vector':
      return new VectorKeyframeTrack(name, times, values as number[], interpolation)
    case 'color':
      return new ColorKeyframeTrack(name, times, values as number[], interpolation)
    case 'boolean':
      return new BooleanKeyframeTrack(name, times, values as boolean[])
    case 'string':
      return new StringKeyframeTrack(name, times, values as string[])
    case 'quaternion':
      return new QuaternionKeyframeTrack(name, times, values as number[], interpolation)
    default:
      throw new Error(`Unknown keyframe track type: ${type}`)
  }
}

export function useKeyframeAnimation(options: KeyframeAnimationOptions) {
  const animationCtx = inject(AnimationContextKey)
  const meshCtx = inject(MeshContextKey, null)

  if (!animationCtx || !animationCtx.mixer) {
    throw new Error('useKeyframeAnimation must be used within a TAnimationMixer component')
  }

  const mixerRef = animationCtx.mixer
  const action = shallowRef<AnimationAction | null>(null)
  const clip = shallowRef<AnimationClip | null>(null)

  const createClip = () => {
    const tracks = options.tracks.map(createKeyframeTrack)
    return new AnimationClip(options.name || 'default', options.duration ?? -1, tracks)
  }

  const createAction = (animationClip: AnimationClip) => {
    if (!mixerRef.value) return null

    const mixer = mixerRef.value as any
    const targetRoot = meshCtx?.mesh?.value
    const animationAction = mixer.clipAction(animationClip, targetRoot) as AnimationAction

    animationAction.setLoop((options.loop ?? LoopRepeat) as any, options.repetitions ?? Infinity)

    animationAction.clampWhenFinished = options.clampWhenFinished ?? false
    animationAction.timeScale = options.timeScale ?? 1

    if (options.autoplay) {
      animationAction.play()
    }

    return animationAction
  }

  watch(
    () => options,
    () => {
      if (action.value) {
        action.value.stop()
        action.value = null
      }

      if (clip.value && mixerRef.value) {
        ;(mixerRef.value as any).uncacheClip(clip.value)
      }

      clip.value = createClip()
      action.value = createAction(clip.value)
    },
    { deep: true, immediate: true }
  )

  const play = () => {
    action.value?.play()
  }

  const pause = () => {
    if (action.value) {
      ;(action.value as any).paused = true
    }
  }

  const resume = () => {
    if (action.value) {
      ;(action.value as any).paused = false
    }
  }

  const stop = () => {
    action.value?.stop()
  }

  const reset = () => {
    action.value?.reset()
  }

  const setLoop = (loopMode: number, repetitions?: number) => {
    action.value?.setLoop(loopMode as any, repetitions ?? Infinity)
  }

  const setTimeScale = (scale: number) => {
    if (action.value) {
      action.value.timeScale = scale
    }
  }

  const setWeight = (weight: number) => {
    action.value?.setEffectiveWeight(weight)
  }

  onBeforeUnmount(() => {
    if (action.value) {
      action.value.stop()
    }

    if (clip.value && mixerRef.value) {
      ;(mixerRef.value as any).uncacheClip(clip.value)
    }
  })

  return {
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
  }
}
