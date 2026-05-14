import { inject, onBeforeUnmount } from 'vue'
import { BufferGeometry } from 'three'
import { MeshContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { GeometryConfig } from '../types'

export function useGeometry(initialConfig: GeometryConfig) {
  const meshCtx = inject(MeshContextKey)

  if (!meshCtx) {
    throw new Error('useGeometry must be used within a TMesh component')
  }

  // 使用普通变量存储
  let geometry: BufferGeometry = createGeometry(initialConfig)

  meshCtx!.setGeometry(geometry)

  function createGeometry(geometryConfig: GeometryConfig) {
    return ThreeObjectFactory.createGeometry(geometryConfig)
  }

  function updateGeometry(newConfig: GeometryConfig) {
    geometry.dispose()
    geometry = createGeometry(newConfig)
    meshCtx!.setGeometry(geometry)
  }

  onBeforeUnmount(() => {
    geometry.dispose()
  })

  return {
    geometry,
    updateGeometry
  }
}
