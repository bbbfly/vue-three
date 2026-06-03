<template>
  <div class="code-block-wrapper">
    <div v-if="title || showCopy" class="code-toolbar">
      <span v-if="title" class="code-title">{{ title }}</span>
      <button v-if="showCopy" class="copy-btn" @click="copyCode">
        {{ copied ? '✓ 已复制' : '📋 复制' }}
      </button>
    </div>
    <pre
      class="code-block"
    ><code ref="codeElement" :class="languageClass">{{ innerCode }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('css', css)

interface Props {
  code: string
  language?: string
  title?: string
  showCopy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  showCopy: false
})

const codeElement = ref<HTMLElement | null>(null)
const copied = ref(false)

const languageClass = computed(() => {
  const lang = props.language || 'javascript'
  return `language-${lang}`
})

const innerCode = computed(() => {
  return props.code || '// No code provided'
})

function highlight() {
  if (codeElement.value) {
    hljs.highlightElement(codeElement.value)
  }
}

watch(innerCode, () => {
  if (codeElement.value) {
    codeElement.value.textContent = innerCode.value
    highlight()
  }
})

onMounted(() => {
  highlight()
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('复制失败:', e)
  }
}
</script>

<style scoped>
.code-block-wrapper {
  border-radius: 12px;
  overflow: hidden;
  background: #282c34;
}

.code-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #21252b;
  border-bottom: 1px solid #3e4451;
}

.code-title {
  color: #abb2bf;
  font-size: 0.875rem;
  font-weight: 500;
}

.copy-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: #3e4451;
  color: #abb2bf;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #5c6370;
  color: white;
}

.code-block {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
}

.code-block :deep(code) {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}
</style>
