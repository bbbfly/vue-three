import { shallowRef, onUnmounted, getCurrentInstance } from 'vue'
import GUI from 'lil-gui'
import type { ShallowRef } from 'vue'

export interface UseGuiOptions {
  autoPlace?: boolean
  width?: number
  title?: string
  closed?: boolean
}

const guiInstances = new WeakMap<any, GUI>()

export function useGui(options: UseGuiOptions = {}): {
  gui: ShallowRef<GUI>
  addFolder: (name: string) => GUI
  destroy: () => void
} {
  const instance = getCurrentInstance()

  let gui: GUI
  if (instance && guiInstances.has(instance)) {
    gui = guiInstances.get(instance)!
  } else {
    const { autoPlace = true, width, title, closed = false } = options
    gui = new GUI({
      autoPlace,
      width,
      title
    })
    if (closed) {
      gui.close()
    }
    if (instance) {
      guiInstances.set(instance, gui)
    }
  }

  const guiRef = shallowRef(gui)

  function addFolder(name: string): GUI {
    return gui.addFolder(name)
  }

  function destroy(): void {
    gui.destroy()
    if (instance) {
      guiInstances.delete(instance)
    }
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    gui: guiRef,
    addFolder,
    destroy
  }
}
