import { shallowRef, onBeforeUnmount } from 'vue'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import type { DRACOLoaderConfig } from '../types'

const DEFAULT_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

export function useDRACOLoader(config: DRACOLoaderConfig = {}) {
  const dracoLoader = shallowRef<DRACOLoader | null>(null)

  const initDecoder = () => {
    const loader = new DRACOLoader()
    loader.setDecoderPath(config.decoderPath || DEFAULT_DECODER_PATH)
    dracoLoader.value = loader
    return loader
  }

  const getDecoder = () => {
    if (!dracoLoader.value) {
      return initDecoder()
    }
    return dracoLoader.value
  }

  const dispose = () => {
    if (dracoLoader.value) {
      dracoLoader.value.dispose()
      dracoLoader.value = null
    }
  }

  onBeforeUnmount(() => {
    dispose()
  })

  return {
    dracoLoader,
    getDecoder,
    dispose
  }
}
