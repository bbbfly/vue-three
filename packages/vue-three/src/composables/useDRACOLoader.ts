import { onBeforeUnmount } from 'vue'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import type { DRACOLoaderConfig } from '../types'

const DEFAULT_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

export function useDRACOLoader(config: DRACOLoaderConfig = {}) {
  let dracoLoader: DRACOLoader | null = null

  const initDecoder = () => {
    const loader = new DRACOLoader()
    loader.setDecoderPath(config.decoderPath || DEFAULT_DECODER_PATH)
    dracoLoader = loader
    return loader
  }

  const getDecoder = () => {
    if (!dracoLoader) {
      return initDecoder()
    }
    return dracoLoader
  }

  const dispose = () => {
    if (dracoLoader) {
      dracoLoader.dispose()
      dracoLoader = null
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
