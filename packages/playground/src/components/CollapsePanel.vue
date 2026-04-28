<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden">
    <button
      class="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      @click="toggle"
    >
      <span class="font-semibold text-gray-700 text-sm">{{ title }}</span>
      <svg
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    <Transition name="collapse">
      <div v-if="isOpen" class="bg-white">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  defaultOpen?: boolean
}

defineProps<Props>()

const isOpen = ref(true)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition:
    max-height 0.2s ease-out,
    opacity 0.2s ease-out;
  max-height: 500px;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
