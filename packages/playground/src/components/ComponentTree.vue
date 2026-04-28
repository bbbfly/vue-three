<template>
  <div class="space-y-3">
    <CollapsePanel title="场景对象" :open="true">
      <nav class="py-2">
        <div v-if="sceneObjects.length === 0" class="px-6 py-4 text-sm text-gray-400 text-center">
          暂无场景对象
        </div>
        <button
          v-for="obj in sceneObjects"
          :key="obj.id"
          class="w-full text-left px-4 py-2 text-sm rounded-md mx-2 transition-colors"
          :class="
            selectedId === obj.id
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          "
          @click="selectObject(obj.id)"
        >
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="getTypeColor(obj.type)"></span>
            {{ obj.name }}
          </span>
        </button>
      </nav>
    </CollapsePanel>

    <CollapsePanel v-for="category in menuCategories" :key="category.id" :title="category.name">
      <nav class="py-2">
        <router-link
          v-for="item in category.items"
          :key="item.id"
          :to="item.path"
          class="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md mx-2 transition-colors"
          :class="{ 'bg-blue-50 text-blue-600 font-medium': isActive(item.path) }"
        >
          <span class="flex items-center gap-2">
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.name }}
          </span>
        </router-link>
      </nav>
    </CollapsePanel>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CollapsePanel from './CollapsePanel.vue'
import { useSceneStore } from '../stores/scene'
import type { Component } from 'vue'

const route = useRoute()
const sceneStore = useSceneStore()

const sceneObjects = computed(() => sceneStore.sceneObjects)
const selectedId = computed(() => sceneStore.selectedObject?.id)

const isActive = (path: string) => {
  return route.path === path
}

function selectObject(id: string) {
  sceneStore.selectObject(id)
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Mesh: 'bg-blue-500',
    AmbientLight: 'bg-yellow-500',
    DirectionalLight: 'bg-orange-500',
    PointLight: 'bg-red-500',
    SpotLight: 'bg-pink-500',
    PerspectiveCamera: 'bg-green-500',
    OrthographicCamera: 'bg-emerald-500',
    EffectComposer: 'bg-purple-500',
    OrbitControls: 'bg-cyan-500',
    FlyControls: 'bg-sky-500',
    FirstPersonControls: 'bg-teal-500'
  }
  return colors[type] || 'bg-gray-500'
}

interface MenuItem {
  id: string
  name: string
  path: string
  icon: Component
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

const IconCube = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`
}

const IconLight = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
}

const IconCamera = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`
}

const IconGrid = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
}

const IconPaint = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.17 2.586a1 1 0 0 0-1.757-.437l-7.302 8.193a1.5 1.5 0 0 0-.63.742l-.244 1.032a1 1 0 0 0 .45.84l4.133 2.894a1 1 0 0 0 .858.151l.993-.243a1.5 1.5 0 0 0 .743-.63l8.192-7.303a1 1 0 0 0-.437-1.757zM9 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path><path d="m5 22 1.5-3.5L10 18l-3.5 1.5L5 22z"></path></svg>`
}

const IconUpload = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`
}

const IconSparkles = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"></path></svg>`
}

const IconPlay = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`
}

const IconCursor = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 3 7.07 17 2.51-7.39L20 10.07 3 3z"></path></svg>`
}

const menuCategories: MenuCategory[] = [
  {
    id: 'core',
    name: '核心组件',
    items: [
      { id: 'canvas', name: 'TCanvas / TScene', path: '/demo/canvas', icon: IconGrid },
      { id: 'camera', name: '相机 / 控制器', path: '/demo/camera', icon: IconCamera }
    ]
  },
  {
    id: 'geometry',
    name: '几何体',
    items: [{ id: 'meshes', name: '网格组件', path: '/demo/geometry', icon: IconCube }]
  },
  {
    id: 'materials',
    name: '材质系统',
    items: [{ id: 'materials', name: '材质组件', path: '/demo/materials', icon: IconPaint }]
  },
  {
    id: 'lights',
    name: '光源系统',
    items: [{ id: 'lights', name: '光源组件', path: '/demo/lights', icon: IconLight }]
  },
  {
    id: 'loaders',
    name: '模型加载',
    items: [{ id: 'gltf', name: 'GLTF 加载', path: '/demo/gltf', icon: IconUpload }]
  },
  {
    id: 'postprocessing',
    name: '后期处理',
    items: [
      {
        id: 'postprocessing',
        name: 'Bloom / SSAA',
        path: '/demo/postprocessing',
        icon: IconSparkles
      }
    ]
  },
  {
    id: 'animation',
    name: '动画系统',
    items: [
      {
        id: 'animation',
        name: '关键帧动画',
        path: '/demo/animation',
        icon: IconPlay
      }
    ]
  },
  {
    id: 'interaction',
    name: '交互事件',
    items: [
      {
        id: 'interaction',
        name: '点击/悬停事件',
        path: '/demo/interaction',
        icon: IconCursor
      }
    ]
  }
]
</script>
