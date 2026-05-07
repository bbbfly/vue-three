<template>
  <div class="category-nav">
    <div class="nav-inner">
      <router-link to="/" class="nav-logo">
        <span class="logo-icon">🎯</span>
        <span class="logo-text">Three.js Examples</span>
      </router-link>

      <nav class="nav-links">
        <router-link v-for="category in categories" :key="category.id" :to="`/#${category.id}`" class="nav-link"
          :class="{ active: isActive(category.id) }">
          <span class="nav-icon">{{ category.icon }}</span>
          <span class="nav-label">{{ category.name }}</span>
          <span class="nav-count">
            {{category.examples.filter(e => e.completed).length}}/{{ category.examples.length }}
          </span>
        </router-link>
      </nav>

      <div class="nav-stats">
        <span class="stat-text">
          已完成 {{ completedCount }}/{{ totalCount }}
        </span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { exampleCategories, getCompletedCount, getTotalCount } from '../config/examples'

const activeCategory = ref('')

const categories = exampleCategories
const completedCount = getCompletedCount()
const totalCount = getTotalCount()

const progressPercent = computed(() => {
  return Math.round((completedCount / totalCount) * 100)
})

function isActive(categoryId: string): boolean {
  return activeCategory.value === categoryId
}

function updateActiveCategory() {
  const hash = window.location.hash.slice(1)
  if (hash && exampleCategories.some(c => c.id === hash)) {
    activeCategory.value = hash
  }
}

function handleHashChange() {
  updateActiveCategory()
}

onMounted(() => {
  updateActiveCategory()
  window.addEventListener('hashchange', handleHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})
</script>

<style scoped>
.category-nav {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 60px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #333;
  white-space: nowrap;
}

.logo-icon {
  font-size: 1.25rem;
}

.logo-text {
  font-size: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: thin;
}

.nav-links::-webkit-scrollbar {
  height: 4px;
}

.nav-links::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #666;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-link:hover {
  background: #f5f5f5;
  color: #333;
}

.nav-link.active {
  background: #f0f4ff;
  color: #667eea;
  font-weight: 600;
}

.nav-icon {
  font-size: 1rem;
}

.nav-count {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  color: #888;
}

.nav-link.active .nav-count {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.nav-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 120px;
}

.stat-text {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-align: right;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78, #38a169);
  border-radius: 3px;
  transition: width 0.5s ease;
}
</style>
