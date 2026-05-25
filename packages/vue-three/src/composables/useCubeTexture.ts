import { inject, onBeforeUnmount, watch, shallowRef } from 'vue'
import { CubeTexture, CubeTextureLoader } from 'three'
import { ThreeContextKey, MaterialContextKey } from '../core/context'

export interface CubeTextureOptions {
  urls?: string[]
  mapping?: number
  path?: string
}

export function useCubeTexture(options: CubeTextureOptions = {}) {
  const threeCtx = inject(ThreeContextKey, null)
  const materialCtx = inject(MaterialContextKey, null)

  if (!threeCtx) {
    throw new Error('useCubeTexture must be used within a TCanvas component')
  }

  const texture = shallowRef<CubeTexture | null>(null)
  const loading = shallowRef(false)
  const error = shallowRef<Error | null>(null)

  const loader = new CubeTextureLoader()

  function load(urls?: string[]) {
    if (texture.value) {
      texture.value.dispose()
    }

    const targetUrls = urls || options.urls
    if (!targetUrls || targetUrls.length === 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const loadedTexture = loader.load(targetUrls, (loaded) => {
        if (options.mapping !== undefined) {
          loaded.mapping = options.mapping
        }
        texture.value = loaded
        loading.value = false

        if (materialCtx) {
          materialCtx.setEnvMap(loaded)
        }
      })

      loadedTexture.mapping = options.mapping ?? loadedTexture.mapping
    } catch (err) {
      error.value = err as Error
      loading.value = false
      console.error('Failed to load cube texture:', err)
    }
  }

  function setMapping(mapping: number) {
    if (texture.value) {
      texture.value.mapping = mapping
    }
  }

  watch(
    () => options.urls,
    (newUrls) => {
      if (newUrls) {
        load(newUrls)
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (texture.value) {
      texture.value.dispose()
    }
  })

  return {
    texture,
    loading,
    error,
    load,
    setMapping
  }
}
