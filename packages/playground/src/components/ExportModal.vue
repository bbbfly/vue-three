<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/50" />

        <Transition name="modal-content">
          <div
            v-if="show"
            class="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800">导出场景配置</h3>
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" @click="close">
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

            <div class="p-4">
              <div class="flex gap-2 mb-4">
                <button
                  class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="
                    activeTab === 'json'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  "
                  @click="activeTab = 'json'"
                >
                  JSON 配置
                </button>
                <button
                  class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="
                    activeTab === 'vue'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  "
                  @click="activeTab = 'vue'"
                >
                  Vue 组件代码
                </button>
              </div>

              <div class="relative">
                <pre
                  class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-80 text-xs font-mono leading-relaxed"
                ><code>{{ currentContent }}</code></pre>

                <div class="absolute top-2 right-2 flex gap-2">
                  <button
                    class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors flex items-center gap-1.5"
                    @click="handleCopy"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    {{ copyButtonText }}
                  </button>
                </div>
              </div>

              <p v-if="message" class="mt-3 text-sm text-center" :class="messageClass">
                {{ message }}
              </p>
            </div>

            <div class="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition-colors"
                @click="close"
              >
                关闭
              </button>
              <button
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
                @click="handleDownload"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                下载 {{ activeTab === 'json' ? '.json' : '.vue' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSceneStore } from '../stores/scene'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const sceneStore = useSceneStore()
const show = computed(() => props.modelValue)
const activeTab = ref<'json' | 'vue'>('json')
const copyButtonText = ref('复制')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const currentContent = computed(() => {
  return activeTab.value === 'json' ? sceneStore.exportToJSON() : sceneStore.exportToVueCode()
})

const messageClass = computed(() => {
  return messageType.value === 'success' ? 'text-green-600' : 'text-red-600'
})

function close() {
  emit('update:modelValue', false)
  resetState()
}

function resetState() {
  copyButtonText.value = '复制'
  message.value = ''
}

async function handleCopy() {
  const success =
    activeTab.value === 'json'
      ? await sceneStore.copyJSONToClipboard()
      : await sceneStore.copyVueCodeToClipboard()

  if (success) {
    copyButtonText.value = '已复制!'
    message.value = '已复制到剪贴板'
    messageType.value = 'success'
  } else {
    message.value = '复制失败，请手动复制'
    messageType.value = 'error'
  }

  setTimeout(() => {
    copyButtonText.value = '复制'
  }, 2000)
}

function handleDownload() {
  if (activeTab.value === 'json') {
    sceneStore.downloadExportJSON()
    message.value = 'JSON 文件已下载'
  } else {
    sceneStore.downloadExportVueCode()
    message.value = 'Vue 组件文件已下载'
  }
  messageType.value = 'success'
}

watch(show, newVal => {
  if (newVal) {
    resetState()
  }
})
</script>

<style>
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
