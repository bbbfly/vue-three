<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <div class="h-full flex overflow-hidden">
        <div class="flex-1 relative">
          <div
            class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg"
          >
            <h2 class="text-lg font-bold text-gray-800">CSS2D 标签渲染系统</h2>
            <p class="text-xs text-gray-600">距离控制 · 点击交互 · 自定义样式</p>
          </div>

          <TCanvas :antialias="true" :clear-color="0xf5f5f5">
            <TScene :background="0xf5f5f5">
              <TPerspectiveCamera :position="[0, 0, 10]" />
              <TOrbitControls />
              <TAmbientLight :intensity="0.6" />
              <TDirectionalLight :position="[5, 5, 5]" :intensity="0.8" />

              <TMesh
                v-for="(point, index) in points"
                :key="index"
                :position="point.position"
              >
                <TSphere :args="[0.2, 16, 16]" />
                <TMeshStandardMaterial :color="point.color" />
              </TMesh>

              <TCSS2DRenderer>
                <TCSS2DLabel
                  v-for="(point, index) in points"
                  :key="'label-' + index"
                  :position="point.position"
                  :offset="[0, -30]"
                  :min-distance="2"
                  :max-distance="15"
                  :scale-by-distance="enableDistanceScaling"
                  :scale-factor="1"
                  :style="labelStyle"
                  @click="handleLabelClick(index, point)"
                  @mouseenter="handleLabelHover(index, true)"
                  @mouseleave="handleLabelHover(index, false)"
                >
                  <div class="px-2 py-1 text-xs font-medium whitespace-nowrap">
                    {{ point.name }}
                  </div>
                </TCSS2DLabel>

                <TCSS2DLabel
                  :position="[0, 1.5, 0]"
                  :offset="[0, 0]"
                  class-name="center-label"
                  :scale-by-distance="false"
                  @click="handleCenterLabelClick"
                >
                  <div
                    class="px-4 py-2 rounded-lg text-white font-bold text-sm cursor-pointer transition-all shadow-lg"
                    :class="centerLabelActive ? 'bg-blue-500 scale-110' : 'bg-purple-500'"
                  >
                    🎯 中心标签 - {{ clickCount }} 次点击
                  </div>
                </TCSS2DLabel>

                <TCSS2DObject
                  :position="[0, -2, 0]"
                  :offset="[0, 0]"
                  :center="[0.5, 0.5]"
                >
                  <div class="bg-black/70 text-white px-3 py-2 rounded text-xs">
                    <div class="font-bold mb-1">📊 统计信息</div>
                    <div>标签总数: {{ points.length + 1 }}</div>
                    <div>悬停中: {{ hoverIndex !== -1 ? '是' : '否' }}</div>
                  </div>
                </TCSS2DObject>
              </TCSS2DRenderer>

              <TMesh
                :position="[0, -1.5, 0]"
                :rotation="[-Math.PI / 2, 0, 0]"
                :receive-shadow="true"
              >
                <TPlane :args="[30, 30]" />
                <TMeshStandardMaterial :color="0xcccccc" />
              </TMesh>
            </TScene>
          </TCanvas>
        </div>

        <div
          class="w-80 h-full bg-white border-l border-gray-200 p-4 flex flex-col overflow-hidden"
        >
          <h3 class="font-bold text-gray-800 mb-3 flex-shrink-0">⚙️ 标签配置</h3>

          <div class="space-y-4 flex-1 min-h-0 overflow-auto pr-1">
            <div class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">基础设置</h4>

              <div class="space-y-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="enableDistanceScaling"
                    type="checkbox"
                    class="w-4 h-4"
                  />
                  <span class="text-sm">距离缩放 (近大远小)</span>
                </label>

                <div>
                  <label class="text-sm text-gray-600 block mb-1">背景颜色</label>
                  <input
                    v-model="labelStyle.background"
                    type="color"
                    class="w-full h-8 rounded border"
                  />
                </div>

                <div>
                  <label class="text-sm text-gray-600 block mb-1">文字颜色</label>
                  <input
                    v-model="labelStyle.color"
                    type="color"
                    class="w-full h-8 rounded border"
                  />
                </div>

                <div>
                  <label class="text-sm text-gray-600 block mb-1">圆角大小</label>
                  <input
                    v-model="borderRadius"
                    type="range"
                    min="0"
                    max="20"
                    class="w-full"
                    @input="updateStyle"
                  />
                  <div class="text-xs text-gray-500 text-right">{{ borderRadius }}px</div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">💡 使用提示</h4>
              <ul class="text-xs text-gray-600 space-y-1">
                <li>• 滚动鼠标滚轮缩放，观察距离变化时标签显示/隐藏</li>
                <li>• 勾选"距离缩放"体验近大远小效果</li>
                <li>• 点击标签触发交互事件</li>
                <li>• 实时调整样式，标签立即生效</li>
                <li>• 中心标签使用自定义 class 样式</li>
              </ul>
            </div>
          </div>

          <h3 class="font-bold text-gray-800 mt-4 mb-2 flex-shrink-0">📝 事件日志</h3>
          <div class="h-32 min-h-32 bg-gray-50 rounded p-2 text-xs font-mono overflow-auto">
            <div
              v-for="(log, index) in eventLogs"
              :key="index"
              class="py-0.5 border-b border-gray-200 last:border-0"
              :class="getLogColor(log.type)"
            >
              <span class="font-bold">[{{ log.type }}]</span>
              {{ log.message }}
            </div>
            <div v-if="eventLogs.length === 0" class="text-gray-400 text-center py-2">
              点击标签查看事件
            </div>
          </div>
          <button
            class="mt-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors flex-shrink-0"
            @click="eventLogs = []"
          >
            清空日志
          </button>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TSphere,
  TPlane,
  TMeshStandardMaterial,
  TCSS2DRenderer,
  TCSS2DLabel,
  TCSS2DObject
} from '@vue-three/vue-three'

const points = ref([
  { position: [-4, 0, 0] as [number, number, number], name: '红点 A', color: 0xe74c3c },
  { position: [-2, 1, 0] as [number, number, number], name: '黄点 B', color: 0xf39c12 },
  { position: [0, 0.5, 0] as [number, number, number], name: '绿点 C', color: 0x2ecc71 },
  { position: [2, 1, 0] as [number, number, number], name: '蓝点 D', color: 0x3498db },
  { position: [4, 0, 0] as [number, number, number], name: '紫点 E', color: 0x9b59b6 }
])

const enableDistanceScaling = ref(true)
const borderRadius = ref(4)
const hoverIndex = ref(-1)
const clickCount = ref(0)
const centerLabelActive = ref(false)

const labelStyle = ref({
  background: 'rgba(0, 0, 0, 0.75)',
  color: '#ffffff',
  borderRadius: '4px'
})

const updateStyle = () => {
  labelStyle.value.borderRadius = `${borderRadius.value}px`
}

interface EventLog {
  type: string
  message: string
}

const eventLogs = ref<EventLog[]>([])

const addLog = (type: string, message: string) => {
  eventLogs.value.unshift({ type, message })
  if (eventLogs.value.length > 30) {
    eventLogs.value.pop()
  }
}

const getLogColor = (type: string) => {
  switch (type) {
    case 'click':
      return 'text-blue-600'
    case 'mouseenter':
      return 'text-green-600'
    case 'mouseleave':
      return 'text-orange-600'
    default:
      return 'text-gray-600'
  }
}

const handleLabelClick = (index: number, point: any) => {
  addLog('click', `点击标签: ${point.name}`)
  point.color = point.color === 0xffffff ? (index === 0 ? 0xe74c3c : 0x2ecc71) : 0xffffff
}

const handleCenterLabelClick = () => {
  addLog('click', '点击中心标签')
  clickCount.value++
  centerLabelActive.value = true
  setTimeout(() => {
    centerLabelActive.value = false
  }, 200)
}

const handleLabelHover = (index: number, entered: boolean) => {
  hoverIndex.value = entered ? index : -1
  if (entered) {
    addLog('mouseenter', `鼠标进入标签 ${index + 1}`)
  } else {
    addLog('mouseleave', `鼠标离开标签 ${index + 1}`)
  }
}
</script>

<style>
.center-label {
  transition: transform 0.2s ease;
}
</style>
