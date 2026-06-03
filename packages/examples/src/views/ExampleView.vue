<template>
  <div class="example-view">
    <header class="header">
      <router-link to="/" class="back-btn">← 返回首页</router-link>
      <h1>{{ exampleInfo?.title || exampleId }}</h1>
      <div class="header-actions">
        <span v-if="exampleInfo?.completed" class="status-badge completed">✓ 已验证</span>
        <span v-else class="status-badge pending">⏳ 开发中</span>
      </div>
    </header>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="content">
      <div v-if="activeTab === 'preview'" class="preview-content">
        <div class="panel">
          <div class="panel-header">
            <span class="badge vue-badge">Vue-Three 组件</span>
          </div>
          <div class="panel-content canvas-container">
            <component :is="exampleComponent" v-if="exampleComponent" />
            <div v-else-if="loading" class="loading">加载中...</div>
            <div v-else class="not-found">示例不存在: {{ exampleId }}</div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <span class="badge official-badge">官方示例</span>
          </div>
          <div class="panel-content canvas-container">
            <iframe
              v-if="officialExampleUrl"
              :src="officialExampleUrl"
              class="example-iframe"
              frameborder="0"
            ></iframe>
            <div v-else class="no-official">
              <p>官方示例不存在:</p>
              <code>/lib/{{ exampleId }}.html</code>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'vue-code'" class="code-content">
        <CodeBlock :code="vueSourceCode" language="vue" title="Vue 组件源码" :show-copy="true" />
      </div>

      <div v-if="activeTab === 'official-code'" class="code-content">
        <CodeBlock
          :code="officialSourceCode"
          language="javascript"
          title="官方 JS 源码（从 HTML 提取）"
          :show-copy="true"
        />
      </div>

      <div v-if="activeTab === 'diff'" class="diff-content">
        <div class="diff-panel">
          <CodeBlock :code="vueSourceCode" language="vue" title="Vue 组件源码" :show-copy="false" />
        </div>
        <div class="diff-panel">
          <CodeBlock
            :code="officialSourceCode"
            language="javascript"
            title="官方 JS 源码"
            :show-copy="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAllExamples } from '../config/examples'
import CodeBlock from '../components/CodeBlock.vue'

const route = useRoute()
const loading = shallowRef(false)
const exampleComponent = shallowRef<any>(null)
const vueSourceCode = shallowRef('')
const officialSourceCode = shallowRef('')
const activeTab = shallowRef<'preview' | 'vue-code' | 'official-code' | 'diff'>('preview')

const tabs = [
  { label: '🎮 效果对比', value: 'preview' as const },
  { label: '💚 Vue 源码', value: 'vue-code' as const },
  { label: '📘 官方源码', value: 'official-code' as const },
  { label: '📊 代码对比', value: 'diff' as const }
]

const exampleId = computed(() => {
  return (route.params.id as string) || ''
})

const exampleInfo = computed(() => {
  return getAllExamples().find(e => e.id === exampleId.value)
})

const officialExampleUrl = computed(() => {
  const id = exampleId.value
  if (!id) return ''
  return `/${id}.html`
})

async function loadVueSourceCode(id: string) {
  try {
    const response = await import(`/src/examples/${id}.vue?raw`)
    vueSourceCode.value = response.default
  } catch (e) {
    vueSourceCode.value = '// 源码加载失败'
    console.error('Failed to load Vue source:', e)
  }
}

async function loadOfficialSourceCode(id: string) {
  try {
    const response = await fetch(`/${id}.html`)
    if (response.ok) {
      const html = await response.text()
      // const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/)
      // officialSourceCode.value = scriptMatch ? scriptMatch[1].trim() : '// 未找到 script 部分'
      officialSourceCode.value = html
    } else {
      officialSourceCode.value = '// 官方示例 HTML 不存在'
    }
  } catch (e) {
    officialSourceCode.value = '// 源码加载失败'
    console.error('Failed to load official source:', e)
  }
}

async function loadExample(id: string) {
  if (!id) {
    exampleComponent.value = null
    return
  }

  loading.value = true
  try {
    loadOfficialSourceCode(id)
    const module = await import(`@/examples/${id}.vue`)
    exampleComponent.value = module.default
    loadVueSourceCode(id)
  } catch (e) {
    console.error(`Failed to load example: ${id}`, e)
    exampleComponent.value = null
  } finally {
    loading.value = false
  }
}

watch(
  exampleId,
  newId => {
    loadExample(newId)
  },
  { immediate: true }
)
</script>

<style scoped>
.example-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

h1 {
  font-size: 1.25rem;
  color: #333;
  font-weight: 600;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.status-badge {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.completed {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.pending {
  background: #fed7d7;
  color: #742a2a;
}

.tabs {
  display: flex;
  gap: 2px;
  background: white;
  padding: 0.5rem 1.5rem 0;
  border-bottom: 1px solid #e8e8e8;
}

.tabs button {
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.tabs button:hover {
  background: #f5f5f5;
  color: #333;
}

.tabs button.active {
  background: #f0f4ff;
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: 600;
}

.content {
  flex: 1;
  overflow: hidden;
  padding: 1rem;
  height: 0;
}

.preview-content {
  display: flex;
  gap: 1rem;
  height: 100%;
  width: 400px;
  height: 200px;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.panel-header {
  padding: 0.75rem 1rem;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.badge {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.vue-badge {
  background: #42b883;
  color: white;
}

.official-badge {
  background: #049ef4;
  color: white;
}

.panel-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  height: 0;
}

.canvas-container {
  background: #1a1a2e;
}

.example-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.loading,
.not-found,
.no-official {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  gap: 0.5rem;
}

.no-official code {
  background: #2d2d44;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #ff6b6b;
}

.code-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.diff-content {
  display: flex;
  gap: 1rem;
  height: 100%;
}

.diff-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
