import { inject, onMounted, onBeforeUnmount } from 'vue'
import { Raycaster, Vector2, Object3D, Intersection } from 'three'
import { ThreeContextKey, type ThreeContext } from '../core/context'

export interface RaycasterResult {
  intersects: Intersection[]
  point: Vector2
}

export type RaycasterCallback = (result: RaycasterResult) => void

export interface RaycasterConfig {
  mesh?: Object3D | null
  callback?: RaycasterCallback
}

export function useRaycaster(config?: RaycasterConfig) {
  const threeCtx = inject(ThreeContextKey) as ThreeContext
  if (!threeCtx) {
    throw new Error('useRaycaster must be used within a TCanvas component')
  }

  const raycaster = new Raycaster()
  const mouse = new Vector2()
  let meshRef = <Object3D | null>(config?.mesh || null)
  let callbackRef = <RaycasterCallback | null>(config?.callback || null)

  const setMesh = (mesh: Object3D | null) => {
    meshRef = mesh
  }

  const setCallback = (callback: RaycasterCallback | null) => {
    callbackRef = callback
  }

  const updateMousePosition = (event: MouseEvent) => {
    const canvas = threeCtx.canvas.value
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  const intersectObject = (mesh: Object3D, fn: RaycasterCallback) => {
    setMesh(mesh)
    setCallback(fn)
  }

  const handleMouseMove = (event: MouseEvent) => {
    updateMousePosition(event)
    if (meshRef && callbackRef) {
      raycaster.setFromCamera(mouse, threeCtx.camera.value)
      const intersects = raycaster.intersectObject(meshRef, true)
      callbackRef({
        intersects,
        point: mouse.clone()
      })
    }
  }

  const handleClick = (event: MouseEvent) => {
    updateMousePosition(event)
    if (meshRef && callbackRef) {
      raycaster.setFromCamera(mouse, threeCtx.camera.value)
      const intersects = raycaster.intersectObject(meshRef, true)
      callbackRef({
        intersects,
        point: mouse.clone()
      })
    }
  }

  let canvasElement: HTMLCanvasElement | null = null

  const bindEvents = () => {
    canvasElement = threeCtx.canvas.value
    if (!canvasElement) return

    canvasElement.addEventListener('mousemove', handleMouseMove)
    canvasElement.addEventListener('click', handleClick)
  }

  const unbindEvents = () => {
    if (!canvasElement) return

    canvasElement.removeEventListener('mousemove', handleMouseMove)
    canvasElement.removeEventListener('click', handleClick)
    canvasElement = null
  }

  onMounted(() => {
    bindEvents()
  })

  onBeforeUnmount(() => {
    unbindEvents()
    meshRef = null
    callbackRef = null
  })

  return {
    raycaster,
    intersectObject,
    setMesh,
    setCallback
  }
}
