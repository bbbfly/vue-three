<template>
  <div class="home">
    <CategoryNav />
    <header class="header">
      <h1>🎯 Three.js Examples Verification Platform</h1>
      <p class="subtitle">Vue 3 声明式组件库官方示例验证平台</p>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ completedCount }}</span>
          <span class="stat-label">已完成</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ totalCount }}</span>
          <span class="stat-label">总计</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ Math.round(completedCount / totalCount * 100) }}%</span>
          <span class="stat-label">进度</span>
        </div>
      </div>

      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="🔍 搜索示例名称..." class="search-input" />
      </div>
    </header>

    <main class="content">
      <section v-for="category in filteredCategories" :key="category.id" class="category-section">
        <h2 class="category-title">
          <span class="category-icon">{{ category.icon }}</span>
          {{ category.name }}
          <span class="category-count">
            ({{category.examples.filter(e => e.completed).length}}/{{ category.examples.length }})
          </span>
        </h2>

        <div class="example-grid">
          <router-link v-for="example in category.examples" :key="example.id" :to="`/example/${example.id}`"
            class="example-card" :class="{ completed: example.completed }">
            <div class="card-image">
              <img :src="getScreenshotUrl(example.id)" :alt="example.title" @error="handleImageError($event)" />
              <div class="image-overlay">
                <span v-if="example.completed" class="overlay-badge done">✓ 已完成</span>
                <span v-else class="overlay-badge pending">⏳ 待完成</span>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ example.title }}</h3>
              <p class="card-id">{{ example.id }}</p>
            </div>
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { exampleCategories, getCompletedCount, getTotalCount, getScreenshotUrl } from '../config/examples'
import CategoryNav from '../components/CategoryNav.vue'

const searchQuery = ref('')

const completedCount = getCompletedCount()
const totalCount = getTotalCount()

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return exampleCategories
  }

  const query = searchQuery.value.toLowerCase()
  return exampleCategories
    .map(category => ({
      ...category,
      examples: category.examples.filter(
        ex =>
          ex.title.toLowerCase().includes(query) ||
          ex.id.toLowerCase().includes(query)
      )
    }))
    .filter(category => category.examples.length > 0)
})

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect fill="%23f5f5f5" width="200" height="150"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E暂无预览图%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 3rem;
}

.header {
  text-align: center;
  padding: 3rem 1rem 2rem;
  color: #333;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.search-box {
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.search-input::placeholder {
  color: #999;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.category-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.category-icon {
  font-size: 1.5rem;
}

.category-count {
  margin-left: auto;
  font-size: 0.9rem;
  font-weight: 500;
  color: #667eea;
  background: #f0f4ff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.25rem;
}

.example-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 2px solid #e8e8e8;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fafafa;
  text-decoration: none;
}

.example-card:hover {
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.example-card.completed {
  border-color: #48bb78;
  background: white;
}

.example-card.completed:hover {
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.2);
}

.example-card.disabled {
  opacity: 0.8;
}

.example-card.disabled:hover {
  cursor: not-allowed;
  transform: none;
}

.card-image {
  position: relative;
  width: 100%;
  height: 70px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.example-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.overlay-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.overlay-badge.done {
  background: rgba(72, 187, 120, 0.9);
  color: white;
}

.overlay-badge.pending {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.card-content {
  padding: 1rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-id {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
  font-family: 'Monaco', 'Consolas', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>