import { onMounted, onBeforeUnmount, Ref, computed, toValue } from 'vue'
import { Raycaster, Vector2, Object3D, Intersection } from 'three'
import { TCanvas } from '../index.ts'
export interface RaycasterResult {
  intersects: Intersection[]
  point: Vector2
}

export type RaycasterCallback = (result: RaycasterResult) => void
export type IntersectObject = (mesh: Object3D, fn: RaycasterCallback) => void

export type RaycasterConfig = Ref<typeof TCanvas>

export function useRaycaster(config: RaycasterConfig) {
  const threeCtx = computed(() => config.value.context)

  const raycaster = new Raycaster()
  const mouse = new Vector2()
  let meshRef = <Object3D | null>null
  let callbackRef = <RaycasterCallback | null>null

  const setMesh = (mesh: Object3D | null) => {
    meshRef = mesh
  }

  const setCallback = (callback: RaycasterCallback | null) => {
    callbackRef = callback
  }

  const updateMousePosition = (event: MouseEvent) => {
    const canvas = toValue(threeCtx.value.canvas)
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  const intersectObject: IntersectObject = (mesh, fn) => {
    if (!threeCtx.value) {
      throw new Error('useRaycaster must be used within a TCanvas component')
    }
    setMesh(mesh)
    setCallback(fn)
  }

  const handleMouseMove = (event: MouseEvent) => {
    updateMousePosition(event)
    if (meshRef && callbackRef) {
      const camera = toValue(threeCtx.value.camera)
      raycaster.setFromCamera(mouse, camera)
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
      const camera = toValue(threeCtx.value.camera)
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(meshRef, true)
      callbackRef({
        intersects,
        point: mouse.clone()
      })
    }
  }

  let canvasElement: HTMLCanvasElement | null = null

  const bindEvents = () => {
    canvasElement = toValue(threeCtx.value.canvas)
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
