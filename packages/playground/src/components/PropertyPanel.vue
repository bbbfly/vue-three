<template>
  <div class="h-full flex flex-col bg-white">
    <div class="p-4 border-b border-gray-200">
      <h3 class="font-semibold text-gray-800">属性面板</h3>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="selectedObject" class="p-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-800">{{ selectedObject.name }}</p>
            <p class="text-xs text-gray-500">{{ selectedObject.type }}</p>
          </div>
        </div>
      </div>

      <div v-if="!selectedObject" class="flex items-center justify-center p-4 h-full">
        <div class="text-center text-gray-400">
          <svg
            class="w-12 h-12 mx-auto mb-3 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-sm">选择场景中的对象查看属性</p>
        </div>
      </div>

      <div ref="guiContainer" class="p-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import GUI from 'lil-gui'
import { useSceneStore } from '../stores/scene'
import { buildControllersForObject, cleanGui } from '../utils/guiGenerator'

const sceneStore = useSceneStore()
const guiContainer = ref<HTMLElement | null>(null)
let gui: GUI | null = null

const selectedObject = computed(() => sceneStore.selectedObject)

function initGui() {
  if (!guiContainer.value) return

  if (gui) {
    gui.destroy()
  }

  gui = new GUI({
    autoPlace: false,
    width: '100%'
  })

  guiContainer.value.appendChild(gui.domElement)

  if (selectedObject.value) {
    buildControllersForObject(gui, selectedObject.value)
  }

  sceneStore.setGuiInstance(gui)
}

watch(
  selectedObject,
  newObj => {
    if (!gui) {
      if (guiContainer.value) {
        initGui()
      }
      return
    }

    cleanGui(gui!)

    if (newObj) {
      buildControllersForObject(gui!, newObj)
    }
  },
  { immediate: true }
)

onMounted(() => {
  initGui()
})

onUnmounted(() => {
  if (gui) {
    gui.destroy()
    sceneStore.setGuiInstance(null)
  }
})
</script>

<style scoped>
:deep(.lil-gui) {
  width: 100% !important;
}

:deep(.lil-gui .name) {
  font-size: 12px;
}

:deep(.lil-gui .controller) {
  min-height: 32px;
}
</style>
