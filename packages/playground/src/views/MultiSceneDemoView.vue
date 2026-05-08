<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <div class="h-full flex overflow-hidden">
        <div class="flex-1 relative">
          <div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
            <h2 class="text-lg font-bold text-gray-800">多场景渲染架构</h2>
            <p class="text-xs text-gray-600">
              WebGL + CSS3D + CSS2D 统一渲染 · TGroup 多场景支持
            </p>
          </div>

          <TCanvas :antialias="true" clearColor="#000000">
            <TScene background="#000000">
              <TPerspectiveCamera :position="[0, 2, 8]" :fov="60" />
              <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
              <TAmbientLight :intensity="0.4" />
              <TDirectionalLight :position="[5, 10, 5]" :intensity="0.8" :cast-shadow="true" />
              <TGroup :position="[0, 0, 0]" :rotation="[0, groupRotation, 0]">
                <TMesh :position="[0, 0, 0]" :cast-shadow="true" :receive-shadow="true">
                  <TSphere :args="[1.2, 32, 32]" />
                  <TMeshStandardMaterial :color="sphereColor" :metalness="0.5" :roughness="0.3"
                    @click="handleSphereClick" />
                </TMesh>

                <TMesh :position="[2.5, 0, 0]" :cast-shadow="true" :receive-shadow="true">
                  <TBox :args="[1, 1, 1]" />
                  <TMeshStandardMaterial color="#ff6b6b" :metalness="0.3" :roughness="0.7" />
                </TMesh>

                <TMesh :position="[-2.5, 0, 0]" :cast-shadow="true" :receive-shadow="true">
                  <TCone :args="[0.8, 1.5]" />
                  <TMeshStandardMaterial color="#4ecdc4" :metalness="0.5" :roughness="0.3" />
                </TMesh>
              </TGroup>

              <TGroup :position="[0, -1.5, 0]" :rotation="[-Math.PI / 2, 0, 0]">
                <TMesh :receive-shadow="true">
                  <TPlane :args="[20, 20]" />
                  <TMeshStandardMaterial color="#2d2d44" />
                </TMesh>
              </TGroup>

              <TCSS3DRenderer>
                <!-- <TGroup :position="[0, 1.5, 0]" :rotation="[0, -groupRotation, 0]"> -->
                <TCSS3DObject :position="[0, 0, 0]">
                  <div>123213</div>
                  <!-- <div class="card-inner css3d-card">
                    <div class="card-title">WebGL 主场景</div>
                    <div class="card-content">
                      球体正在旋转<br />
                      点击切换颜色
                    </div>
                  </div> -->
                </TCSS3DObject>

                <!-- <TGroup :position="[2, 0, 0]" :rotation="[0, groupRotation * 0.5, 0]">
                    <TCSS3DObject :position="[0, 0, 0]" class-name="css3d-card green">
                      <div class="card-inner">
                        <div class="card-title">CSS3D 嵌套组</div>
                        <div class="card-content">子卡片随父组旋转</div>
                      </div>
                    </TCSS3DObject>
                  </TGroup> -->

                <!-- <TGroup :position="[-2, 0, 0]" :rotation="[0, -groupRotation * 0.5, 0]">
                    <TCSS3DObject :position="[0, 0, 0]" class-name="css3d-card orange">
                      <div class="card-inner">
                        <div class="card-title">CSS3D 嵌套组</div>
                        <div class="card-content">青色立方体旁</div>
                      </div>
                    </TCSS3DObject>
                  </TGroup> -->
                <!-- </TGroup> -->
              </TCSS3DRenderer>

              <TCSS2DRenderer>
                <TCSS2DLabel :position="[0, 2.3, 0]" :offset="[0, 10]" :scale-by-distance="true" :scale-factor="0.8">
                  <div class="label-badge">
                    <span class="label-icon">🎯</span>
                    中心球体标签
                  </div>
                </TCSS2DLabel>

                <TCSS2DLabel :position="[2.5, 1, 0]" :offset="[0, 10]" :scale-by-distance="true" :scale-factor="0.8">
                  <div class="label-badge red">
                    <span class="label-icon">🔺</span>
                    红色立方体
                  </div>
                </TCSS2DLabel>

                <TCSS2DLabel :position="[-2.5, 1, 0]" :offset="[0, 10]" :scale-by-distance="true" :scale-factor="0.8">
                  <div class="label-badge teal">
                    <span class="label-icon">💎</span>
                    青色八面体
                  </div>
                </TCSS2DLabel>
              </TCSS2DRenderer>
            </TScene>
          </TCanvas>
        </div>

        <div class="w-80 h-full bg-white border-l border-gray-200 p-4 flex flex-col overflow-hidden">
          <h3 class="font-bold text-gray-800 mb-3 flex-shrink-0">⚙️ 多场景配置</h3>

          <div class="space-y-4 flex-1 min-h-0 overflow-auto pr-1">
            <div class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">🎛️ 场景控制</h4>

              <div class="space-y-3">
                <div>
                  <label class="text-sm text-gray-600 block mb-1">旋转速度</label>
                  <input v-model="rotationSpeed" type="range" min="0" max="20" step="1" class="w-full" />
                  <div class="text-xs text-gray-500 text-right">{{ rotationSpeed }}x</div>
                </div>

                <div>
                  <label class="text-sm text-gray-600 block mb-1">球体颜色</label>
                  <input v-model="sphereColor" type="color" class="w-full h-8 rounded border" />
                </div>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="autoRotate" type="checkbox" class="w-4 h-4" />
                  <span class="text-sm">自动旋转</span>
                </label>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">📊 渲染统计</h4>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-600">WebGL 场景:</span>
                  <span class="font-medium text-green-600">已激活</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">CSS3D 场景:</span>
                  <span class="font-medium text-green-600">已激活</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">CSS2D 场景:</span>
                  <span class="font-medium text-green-600">已激活</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">相机共享:</span>
                  <span class="font-medium text-blue-600">✓ 已启用</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">统一渲染循环:</span>
                  <span class="font-medium text-blue-600">✓ 已启用</span>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 rounded-lg p-3">
              <h4 class="text-sm font-medium text-blue-700 mb-2">💡 架构说明</h4>
              <ul class="text-xs text-blue-600 space-y-1">
                <li>• <strong>相机共用</strong>：所有场景共享同一相机视角</li>
                <li>• <strong>场景独立</strong>：WebGL/CSS3D/CSS2D 各自拥有独立 Scene</li>
                <li>• <strong>统一渲染</strong>：所有场景在同一帧中同步渲染</li>
                <li>• <strong>TGroup 支持</strong>：分组组件可在 CSS3D/CSS2D 中使用</li>
              </ul>
            </div>

            <div class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">🧭 操作指南</h4>
              <ul class="text-xs text-gray-600 space-y-1">
                <li>• 拖拽鼠标旋转视角</li>
                <li>• 滚轮缩放场景</li>
                <li>• 右键拖拽平移</li>
                <li>• 点击球体切换颜色</li>
                <li>• 拖动滑块调整旋转速度</li>
              </ul>
            </div>
          </div>

          <h3 class="font-bold text-gray-800 mt-4 mb-2 flex-shrink-0">📝 事件日志</h3>
          <div class="h-32 min-h-32 bg-gray-50 rounded p-2 text-xs font-mono overflow-auto">
            <div v-for="(log, index) in eventLogs" :key="index" class="py-0.5 border-b border-gray-200 last:border-0"
              :class="getLogColor(log.type)">
              <span class="font-bold">[{{ log.type }}]</span>
              {{ log.message }}
            </div>
            <div v-if="eventLogs.length === 0" class="text-gray-400 text-center py-2">
              点击对象查看事件
            </div>
          </div>
          <button class="mt-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors flex-shrink-0"
            @click="eventLogs = []">
            清空日志
          </button>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import { useSceneStore } from '../stores/scene'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TSphere,
  TBox,
  TCone,
  TPlane,
  TGroup,
  TMeshStandardMaterial,
  TCSS3DRenderer,
  TCSS3DObject,
  TCSS2DRenderer,
  TCSS2DLabel
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const rotationSpeed = ref(5)
const autoRotate = ref(true)
const sphereColor = ref('#4488ff')

const groupRotation = computed(() => {
  if (!autoRotate.value) return 0
  return (Date.now() * 0.001 * rotationSpeed.value) % (Math.PI * 2)
})

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
    case 'pointerenter':
      return 'text-green-600'
    case 'pointerleave':
      return 'text-orange-600'
    default:
      return 'text-gray-600'
  }
}

const handleSphereClick = () => {
  addLog('click', '点击球体：切换颜色')
  const colors = ['#4488ff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff44aa']
  const currentIndex = colors.indexOf(sphereColor.value)
  sphereColor.value = colors[(currentIndex + 1) % colors.length]
}

onMounted(() => {
  addLog('init', '多场景渲染演示已初始化')
  addLog('info', 'WebGL + CSS3D + CSS2D 统一渲染')
})

onUnmounted(() => {
  sceneStore.clearAll()
})
</script>

<style scoped>
.css3d-card {
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.css3d-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
}

.css3d-card.green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  box-shadow: 0 8px 32px rgba(56, 239, 125, 0.3);
}

.css3d-card.green:hover {
  box-shadow: 0 12px 40px rgba(56, 239, 125, 0.5);
}

.css3d-card.orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 8px 32px rgba(245, 87, 108, 0.3);
}

.css3d-card.orange:hover {
  box-shadow: 0 12px 40px rgba(245, 87, 108, 0.5);
}

.card-inner {
  color: white;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
  pointer-events: none;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-content {
  font-size: 11px;
  opacity: 0.9;
  line-height: 1.4;
}

.label-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  font-family: system-ui, -apple-system, sans-serif;
  white-space: nowrap;
}

.label-badge.red {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.label-badge.teal {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  box-shadow: 0 4px 12px rgba(56, 239, 125, 0.4);
}

.label-icon {
  font-size: 14px;
}
</style>
