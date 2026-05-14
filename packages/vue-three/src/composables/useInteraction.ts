import { onMounted, onBeforeUnmount } from 'vue'
import { Raycaster, Vector2, Vector3, Object3D } from 'three'
import type { InteractionEvent, InteractionHandlers, ThreeContext } from '../core/context'

export function useInteraction(threeCtx: ThreeContext) {
  // 使用普通变量存储
  const raycaster = new Raycaster()
  const mouse = new Vector2()

  const interactionMap = new Map<Object3D, InteractionHandlers>()
  const hoveredObjects = new Set<Object3D>()
  let propagationStopped = false

  const registerObject = (object: Object3D, handlers: InteractionHandlers) => {
    interactionMap.set(object, handlers)
  }

  const unregisterObject = (object: Object3D) => {
    interactionMap.delete(object)
    hoveredObjects.delete(object)
  }

  const updateMousePosition = (event: MouseEvent) => {
    const canvas = threeCtx.canvas
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  const stopPropagation = () => {
    propagationStopped = true
  }

  const createInteractionEvent = (
    type: InteractionEvent['type'],
    intersect: any,
    event: MouseEvent
  ): InteractionEvent => {
    return {
      type,
      object: intersect.object,
      point: intersect.point || new Vector3(),
      distance: intersect.distance || 0,
      face: intersect.face || null,
      uv: intersect.uv || null,
      event,
      stopPropagation
    }
  }

  const getIntersects = () => {
    raycaster.setFromCamera(mouse, threeCtx.camera)
    const objects = Array.from(interactionMap.keys())
    return raycaster.intersectObjects(objects, true)
  }

  const handleClick = (event: MouseEvent) => {
    updateMousePosition(event)
    const intersects = getIntersects()

    if (intersects.length > 0) {
      propagationStopped = false

      for (const intersect of intersects) {
        let target: Object3D | null = intersect.object
        while (target && !propagationStopped) {
          const handlers = interactionMap.get(target)
          if (handlers?.onClick) {
            const evt = createInteractionEvent('click', intersect, event)
            handlers.onClick(evt)
          }
          target = target.parent
        }
        break
      }
    }
  }

  const handleDblClick = (event: MouseEvent) => {
    updateMousePosition(event)
    const intersects = getIntersects()

    if (intersects.length > 0) {
      propagationStopped = false

      for (const intersect of intersects) {
        let target: Object3D | null = intersect.object
        while (target && !propagationStopped) {
          const handlers = interactionMap.get(target)
          if (handlers?.onDblclick) {
            const evt = createInteractionEvent('dblclick', intersect, event)
            handlers.onDblclick(evt)
          }
          target = target.parent
        }
        break
      }
    }
  }

  const handleContextMenu = (event: MouseEvent) => {
    updateMousePosition(event)
    const intersects = getIntersects()

    if (intersects.length > 0) {
      propagationStopped = false

      for (const intersect of intersects) {
        let target: Object3D | null = intersect.object
        while (target && !propagationStopped) {
          const handlers = interactionMap.get(target)
          if (handlers?.onContextmenu) {
            const evt = createInteractionEvent('contextmenu', intersect, event)
            handlers.onContextmenu(evt)
          }
          target = target.parent
        }
        break
      }
    }
  }

  const handlePointerMove = (event: MouseEvent) => {
    updateMousePosition(event)
    const intersects = getIntersects()
    const currentIntersected = new Set<Object3D>()

    if (intersects.length > 0) {
      propagationStopped = false
      for (const intersect of intersects) {
        let target: Object3D | null = intersect.object
        while (target && !propagationStopped) {
          currentIntersected.add(target)
          const handlers = interactionMap.get(target)

          if (!hoveredObjects.has(target)) {
            hoveredObjects.add(target)
            if (handlers?.onPointerEnter) {
              const evt = createInteractionEvent('pointerenter', intersect, event)
              handlers.onPointerEnter(evt)
            }
          }

          if (handlers?.onPointerMove) {
            const evt = createInteractionEvent('pointermove', intersect, event)
            handlers.onPointerMove(evt)
          }

          target = target.parent
        }
      }
    }

    for (const obj of hoveredObjects) {
      if (!currentIntersected.has(obj)) {
        hoveredObjects.delete(obj)
        const handlers = interactionMap.get(obj)
        if (handlers?.onPointerLeave) {
          const evt = createInteractionEvent('pointerleave', { object: obj, point: null }, event)
          handlers.onPointerLeave(evt)
        }
      }
    }
  }

  let canvasElement: HTMLCanvasElement | null = null

  const bindEvents = () => {
    canvasElement = threeCtx.canvas
    if (!canvasElement) return

    canvasElement.addEventListener('click', handleClick)
    canvasElement.addEventListener('dblclick', handleDblClick)
    canvasElement.addEventListener('contextmenu', handleContextMenu)
    canvasElement.addEventListener('mousemove', handlePointerMove)
  }

  const unbindEvents = () => {
    if (!canvasElement) return

    canvasElement.removeEventListener('click', handleClick)
    canvasElement.removeEventListener('dblclick', handleDblClick)
    canvasElement.removeEventListener('contextmenu', handleContextMenu)
    canvasElement.removeEventListener('mousemove', handlePointerMove)
    canvasElement = null
  }

  onMounted(() => {
    bindEvents()
  })

  onBeforeUnmount(() => {
    unbindEvents()
    interactionMap.clear()
    hoveredObjects.clear()
  })

  return {
    registerObject,
    unregisterObject,
    raycaster
  }
}
