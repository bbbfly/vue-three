import { inject, onBeforeUnmount, provide } from 'vue'
import { AnimationMixer, Object3D } from 'three'
import { ThreeContextKey, AnimationContextKey } from '../core/context'

export interface AnimationMixerOptions {
  autoUpdate?: boolean
}

export function useAnimationMixer(options: AnimationMixerOptions = {}) {
  const ctx = inject(ThreeContextKey)!
  let mixer: AnimationMixer | null = null

  mixer = new AnimationMixer(new Object3D())

  if (options.autoUpdate !== false) {
    ctx.registerAnimationMixer(mixer)
  }

  const setRoot = (root: Object3D) => {
    if (mixer) {
      if (options.autoUpdate !== false) {
        ctx.unregisterAnimationMixer(mixer)
      }
      mixer.stopAllAction()
      mixer.uncacheRoot(mixer.getRoot())
    }

    mixer = new AnimationMixer(root)

    if (options.autoUpdate !== false) {
      ctx.registerAnimationMixer(mixer)
    }
  }

  provide(AnimationContextKey, {
    mixer
  })

  onBeforeUnmount(() => {
    if (mixer) {
      if (options.autoUpdate !== false) {
        ctx.unregisterAnimationMixer(mixer)
      }
      mixer.stopAllAction()
      mixer.uncacheRoot(mixer.getRoot())
    }
  })

  return {
    mixer,
    setRoot
  }
}
