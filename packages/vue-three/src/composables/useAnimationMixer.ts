import { inject, onBeforeUnmount, shallowRef, provide } from 'vue'
import { AnimationMixer, Object3D } from 'three'
import { ThreeContextKey, AnimationContextKey } from '../core/context'

export interface AnimationMixerOptions {
  autoUpdate?: boolean
}

export function useAnimationMixer(options: AnimationMixerOptions = {}) {
  const ctx = inject(ThreeContextKey)!
  const mixer = shallowRef<AnimationMixer | null>(null)

  mixer.value = new AnimationMixer(new Object3D())

  if (options.autoUpdate !== false) {
    ctx.registerAnimationMixer(mixer.value)
  }

  const setRoot = (root: Object3D) => {
    if (mixer.value) {
      if (options.autoUpdate !== false) {
        ctx.unregisterAnimationMixer(mixer.value)
      }
      mixer.value.stopAllAction()
      mixer.value.uncacheRoot(mixer.value.getRoot())
    }

    mixer.value = new AnimationMixer(root)

    if (options.autoUpdate !== false) {
      ctx.registerAnimationMixer(mixer.value)
    }
  }

  provide(AnimationContextKey, {
    mixer
  })

  onBeforeUnmount(() => {
    if (mixer.value) {
      if (options.autoUpdate !== false) {
        ctx.unregisterAnimationMixer(mixer.value)
      }
      mixer.value.stopAllAction()
      mixer.value.uncacheRoot(mixer.value.getRoot())
    }
  })

  return {
    mixer,
    setRoot
  }
}
