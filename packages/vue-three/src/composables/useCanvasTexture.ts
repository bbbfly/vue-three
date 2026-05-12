import { inject, shallowRef, onBeforeUnmount, watch } from 'vue'
import { CanvasTexture, RepeatWrapping } from 'three'
import { MaterialContextKey, type TextureMapType } from '../core/context'

export interface CanvasTextureOptions {
  canvas?: HTMLCanvasElement
  mapType?: TextureMapType
  wrapS?: number
  wrapT?: number
  magFilter?: number
  minFilter?: number
  repeat?: [number, number]
  offset?: [number, number]
  center?: [number, number]
  rotation?: number
  colorSpace?: string
}

export function useCanvasTexture(options: CanvasTextureOptions = {}) {
  const materialCtx = inject(MaterialContextKey, null)

  if (!materialCtx) {
    throw new Error('useCanvasTexture must be used within a Material component')
  }

  const texture = shallowRef<CanvasTexture | null>(null)
  const mapType = options.mapType || 'map'

  function applyTextureToMaterial() {
    if (texture.value) {
      materialCtx!.setTextureByType(mapType, texture.value)
    }
  }

  function createCanvasTexture(canvas: HTMLCanvasElement) {
    if (texture.value) {
      console.log('1111')
      texture.value.dispose()
    }

    texture.value = new CanvasTexture(canvas)
    applyTextureSettings()
  }

  function applyTextureSettings() {
    if (!texture.value) return

    const tex = texture.value

    if (options.wrapS !== undefined) {
      tex.wrapS = options.wrapS
    }
    if (options.wrapT !== undefined) {
      tex.wrapT = options.wrapT
    }
    if (options.magFilter !== undefined) {
      tex.magFilter = options.magFilter
    }
    if (options.minFilter !== undefined) {
      tex.minFilter = options.minFilter
    }
    if (options.repeat) {
      tex.repeat.set(options.repeat[0], options.repeat[1])
      if (options.wrapS === undefined) {
        tex.wrapS = RepeatWrapping
      }
      if (options.wrapT === undefined) {
        tex.wrapT = RepeatWrapping
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
    if (options.colorSpace !== undefined) {
      tex.colorSpace = options.colorSpace
    }

    tex.needsUpdate = true
    applyTextureToMaterial()
  }

  if (options.canvas) {
    createCanvasTexture(options.canvas)
  } else {
    applyTextureSettings()
  }

  watch(
    () => options.canvas,
    canvas => {
      if (canvas) {
        createCanvasTexture(canvas)
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

  function updateSettings(newOptions: Partial<CanvasTextureOptions>) {
    Object.assign(options, newOptions)
    applyTextureSettings()
  }

  return {
    texture,
    createCanvasTexture,
    updateSettings
  }
}
