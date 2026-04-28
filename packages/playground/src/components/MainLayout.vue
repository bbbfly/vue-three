<template>
  <div class="flex h-full w-full overflow-hidden bg-gray-50">
    <Transition name="sidebar-overlay">
      <div
        v-if="isMobile && sidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="closeSidebar"
      />
    </Transition>

    <Transition name="sidebar">
      <aside
        v-show="!isMobile || sidebarOpen"
        class="fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col transform lg:transform-none"
        :class="{
          'translate-x-0': sidebarOpen || !isMobile,
          '-translate-x-full lg:translate-x-0': !sidebarOpen && isMobile
        }"
      >
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path d="M12 22V15.5" stroke="currentColor" stroke-width="2" />
                <path d="M22 8.5L12 15.5L2 8.5" stroke="currentColor" stroke-width="2" />
              </svg>
              Vue-Three
            </h1>
            <p class="text-sm text-gray-500 mt-1">Three.js 组件库演示平台</p>
          </div>
          <button
            v-if="isMobile"
            class="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            @click="closeSidebar"
          >
            <svg
              class="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <slot name="sidebar">
            <ComponentTree />
          </slot>
        </div>

        <div class="p-4 border-t border-gray-200">
          <div class="text-xs text-gray-400">
            <p>Vue 3.4 + Three.js 0.160</p>
          </div>
        </div>
      </aside>
    </Transition>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header
        class="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-3 lg:px-4"
      >
        <div class="flex items-center gap-3 lg:gap-4">
          <button class="lg:hidden p-2 hover:bg-gray-100 rounded-md" @click="openSidebar">
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span class="text-sm text-gray-600 hidden sm:inline">3D 场景预览</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-2 lg:px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
          >
            <span class="hidden sm:inline">重置视角</span>
            <span class="sm:hidden">重置</span>
          </button>
          <button
            class="px-2 lg:px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 rounded-md text-white transition-colors flex items-center gap-2"
            @click="openExportModal"
          >
            <span class="hidden sm:inline">导出配置</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        </div>

        <ExportModal v-model="showExportModal" />
      </header>

      <div class="flex-1 relative bg-gray-900">
        <slot name="viewport">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-gray-400 p-4">
              <svg
                class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <path d="M12 22V15.5" stroke="currentColor" stroke-width="1.5" />
                <path d="M22 8.5L12 15.5L2 8.5" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <p class="text-sm sm:text-base">3D 场景即将在这里显示</p>
            </div>
          </div>
        </slot>
      </div>
    </main>

    <aside class="hidden xl:block w-80 bg-white border-l border-gray-200 flex flex-col">
      <div class="border-b border-gray-200 flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex-1 px-3 py-2.5 text-xs font-medium transition-colors"
          :class="[
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="flex-1 overflow-hidden">
        <div v-show="activeTab === 'properties'" class="h-full overflow-y-auto">
          <slot name="properties">
            <PropertyPanel />
          </slot>
        </div>
        <div v-show="activeTab === 'code'" class="h-full overflow-hidden">
          <CodeExamplePanel />
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ComponentTree from './ComponentTree.vue'
import PropertyPanel from './PropertyPanel.vue'
import CodeExamplePanel from './CodeExamplePanel.vue'
import ExportModal from './ExportModal.vue'

const isMobile = ref(false)
const sidebarOpen = ref(false)
const showExportModal = ref(false)

const tabs = [
  { id: 'properties', label: '属性' },
  { id: 'code', label: '代码' }
]
const activeTab = ref('properties')

function openExportModal() {
  showExportModal.value = true
}

function checkScreenSize() {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-overlay-enter-active,
.sidebar-overlay-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.sidebar-overlay-enter-from,
.sidebar-overlay-leave-to {
  opacity: 0;
}
</style>
