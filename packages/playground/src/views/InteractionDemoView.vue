<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <div class="h-full flex overflow-hidden">
        <div class="flex-1 relative">
          <div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
            <h2 class="text-lg font-bold text-gray-800">交互事件系统演示</h2>
            <p class="text-xs text-gray-600">点击网格、鼠标悬停查看效果</p>
          </div>

          <TCanvas :antialias="true" :clear-color="0xf5f5f5">
            <TScene :background="0xf5f5f5">
              <TPerspectiveCamera :position="[0, 0, 8]" />
              <TOrbitControls />
              <TAmbientLight :intensity="0.6" />
              <TDirectionalLight :position="[5, 5, 5]" :intensity="0.8" />

              <TMesh v-for="(item, index) in cubes" :key="index" :position="item.position" :cast-shadow="true"
                :receive-shadow="true" :on-click="handleClick"
                :on-pointer-enter="(e: any) => handlePointerEnter(e, index)"
                :on-pointer-leave="(e: any) => handlePointerLeave(e, index)">
                <TBox :args="[1, 1, 1]" />
                <TMeshStandardMaterial :color="item.color" />
              </TMesh>

              <TMesh :position="[0, 0, 0]" :on-click="handleCenterClick">
                <TSphere :args="[0.5, 32, 32]" />
                <TMeshStandardMaterial :color="sphereColor" :emissive="sphereEmissive"
                  :emissive-intensity="sphereIntensity" />
              </TMesh>

              <TMesh :position="[0, -1.5, 0]" :rotation="[-Math.PI / 2, 0, 0]" :receive-shadow="true">
                <TPlane :args="[20, 20]" />
                <TMeshStandardMaterial :color="0xcccccc" />
              </TMesh>
            </TScene>
          </TCanvas>
        </div>

        <div class="w-80 h-full bg-white border-l border-gray-200 p-4 flex flex-col overflow-hidden">
          <h3 class="font-bold text-gray-800 mb-3 flex-shrink-0">事件日志</h3>
          <div class="flex-1 min-h-0 overflow-auto bg-gray-50 rounded p-2 text-xs font-mono">
            <div v-for="(log, index) in eventLogs" :key="index" class="py-1 border-b border-gray-200 last:border-0"
              :class="getLogColor(log.type)">
              <span class="font-bold">[{{ log.type }}]</span>
              {{ log.message }}
            </div>
            <div v-if="eventLogs.length === 0" class="text-gray-400 text-center py-4">
              暂无事件，点击或悬停场景中的物体
            </div>
          </div>
          <button class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors flex-shrink-0"
            @click="eventLogs = []">
            清空日志
          </button>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import type { InteractionEvent } from '@vue-three/vue-three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TBox,
  TSphere,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const cubes = ref([
  { position: [-2.5, 0, 0], color: 0xe74c3c, originalColor: 0xe74c3c },
  { position: [-1, 0, 0], color: 0xf39c12, originalColor: 0xf39c12 },
  { position: [1, 0, 0], color: 0x2ecc71, originalColor: 0x2ecc71 },
  { position: [2.5, 0, 0], color: 0x3498db, originalColor: 0x3498db }
])

const sphereColor = ref(0x9b59b6)
const sphereEmissive = ref(0x000000)
const sphereIntensity = ref(0)

interface EventLog {
  type: string
  message: string
}

const eventLogs = ref<EventLog[]>([])

const addLog = (type: string, message: string) => {
  eventLogs.value.unshift({ type, message })
  if (eventLogs.value.length > 50) {
    eventLogs.value.pop()
  }
}

const getLogColor = (type: string) => {
  switch (type) {
    case 'click':
      return 'text-blue-600'
    case 'pointerenter':
      return 'text-green-600'
    case 'pointerleave':
      return 'text-orange-600'
    default:
      return 'text-gray-600'
  }
}

const handleClick = (e: InteractionEvent) => {
  addLog('click', `点击立方体: 位置 (${e.point.x.toFixed(2)}, ${e.point.y.toFixed(2)}, ${e.point.z.toFixed(2)})`)
  e.stopPropagation()
}

const handleCenterClick = (e: InteractionEvent) => {
  addLog('click', '点击中心球体!')
  sphereIntensity.value = sphereIntensity.value > 0 ? 0 : 0.5
  sphereEmissive.value = sphereIntensity.value > 0 ? 0x9b59b6 : 0x000000
}

const handlePointerEnter = (e: InteractionEvent, index: number) => {
  addLog('pointerenter', `鼠标进入立方体 ${index + 1}`)
  cubes.value[index].color = 0xffffff
}

const handlePointerLeave = (e: InteractionEvent, index: number) => {
  addLog('pointerleave', `鼠标离开立方体 ${index + 1}`)
  cubes.value[index].color = cubes.value[index].originalColor
}
</script>
