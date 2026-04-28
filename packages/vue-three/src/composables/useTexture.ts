import { inject, shallowRef, onBeforeUnmount, watch } from 'vue'
import { Texture, TextureLoader, RepeatWrapping } from 'three'
import { MaterialContextKey, type TextureMapType } from '../core/context'

export interface TextureOptions {
  url?: string
  mapType?: TextureMapType
  wrapS?: number
  wrapT?: number
  magFilter?: number
  minFilter?: number
  repeat?: [number, number]
  offset?: [number, number]
  center?: [number, number]
  rotation?: number
}

export function useTexture(options: TextureOptions = {}) {
  const materialCtx = inject(MaterialContextKey, null)

  if (!materialCtx) {
    throw new Error('useTexture must be used within a Material component')
  }

  const texture = shallowRef<Texture | null>(null)
  const loader = new TextureLoader()
  const mapType = options.mapType || 'map'

  function applyTextureToMaterial() {
    if (texture.value) {
      materialCtx!.setTextureByType(mapType, texture.value)
    }
  }

  function loadTexture(url: string) {
    if (texture.value) {
      texture.value.dispose()
    }

    texture.value = loader.load(url, () => {
      applyTextureToMaterial()
    })

    applyTextureSettings()
  }

  function applyTextureSettings() {
    if (!texture.value) return

    const tex = texture.value

    if (options.wrapS !== undefined) {
      ;(tex as any).wrapS = options.wrapS
    }
    if (options.wrapT !== undefined) {
      ;(tex as any).wrapT = options.wrapT
    }
    if (options.magFilter !== undefined) {
      ;(tex as any).magFilter = options.magFilter
    }
    if (options.minFilter !== undefined) {
      ;(tex as any).minFilter = options.minFilter
    }
    if (options.repeat) {
      tex.repeat.set(options.repeat[0], options.repeat[1])
      if (options.wrapS === undefined) {
        ;(tex as any).wrapS = RepeatWrapping
      }
      if (options.wrapT === undefined) {
        ;(tex as any).wrapT = RepeatWrapping
      }
    }
    if (options.offset) {
      tex.offset.set(options.offset[0], options.offset[1])
    }
    if (options.center) {
      tex.center.set(options.center[0], options.center[1])
    }
    if (options.rotation !== undefined) {
      tex.rotation = options.rotation
    }

    tex.needsUpdate = true
    applyTextureToMaterial()
  }

  if (options.url) {
    loadTexture(options.url)
  } else {
    applyTextureSettings()
  }

  watch(
    () => options.url,
    url => {
      if (url) {
        loadTexture(url)
      }
    }
  )

  watch(
    () => options,
    () => {
      applyTextureSettings()
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (texture.value) {
      texture.value.dispose()
    }
    materialCtx!.setTextureByType(mapType, null)
  })

  function updateSettings(newOptions: Partial<TextureOptions>) {
    Object.assign(options, newOptions)
    applyTextureSettings()
  }

  return {
    texture,
    load: loadTexture,
    updateSettings
  }
}
