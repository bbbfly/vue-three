import { inject, shallowRef, onBeforeUnmount } from 'vue'
import { BufferGeometry } from 'three'
import { MeshContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { GeometryConfig } from '../types'

export function useGeometry(initialConfig: GeometryConfig) {
  const meshCtx = inject(MeshContextKey)

  if (!meshCtx) {
    throw new Error('useGeometry must be used within a TMesh component')
  }

  const geometry = shallowRef<BufferGeometry>(createGeometry(initialConfig))

  meshCtx!.setGeometry(geometry.value)

  function createGeometry(geometryConfig: GeometryConfig) {
    return ThreeObjectFactory.createGeometry(geometryConfig)
  }

  function updateGeometry(newConfig: GeometryConfig) {
    geometry.value.dispose()
    geometry.value = createGeometry(newConfig)
    meshCtx!.setGeometry(geometry.value)
  }

  onBeforeUnmount(() => {
    geometry.value.dispose()
  })

  return {
    geometry,
    updateGeometry
  }
}
