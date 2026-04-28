<template>
  <MainLayout>
    <template #sidebar>
      <div class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
            曲线编辑器
          </h3>

          <div class="space-y-2">
            <label class="block text-xs text-gray-500">曲线类型</label>
            <select v-model="curveType"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700">
              <option value="arc">圆弧 Arc</option>
              <option value="ellipse">椭圆 Ellipse</option>
              <option value="bezier">三次贝塞尔 Bezier</option>
              <option value="quadraticBezier">二次贝塞尔 Quadratic</option>
              <option value="catmullRom">Catmull-Rom 样条</option>
              <option value="spline">插值曲线 Spline</option>
            </select>
          </div>

          <div class="border-t border-gray-200 mt-4 pt-4">
            <label class="block text-xs text-gray-500 mb-2">线条样式</label>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">线条颜色</span>
                <input v-model="lineColor" type="color" class="w-8 h-8 rounded cursor-pointer border-0" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">线条宽度</span>
                <input v-model.number="lineWidth" type="range" min="1" max="10" class="w-24" />
                <span class="text-xs text-gray-500 w-8">{{ lineWidth }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">采样数</span>
                <input v-model.number="divisions" type="range" min="10" max="200" class="w-24" />
                <span class="text-xs text-gray-500 w-8">{{ divisions }}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 mt-4 pt-4">
            <label class="block text-xs text-gray-500 mb-2">虚线模式</label>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-600">启用虚线</span>
              <input v-model="dashedEnabled" type="checkbox" class="w-4 h-4 rounded border-gray-300" />
            </div>
            <div v-if="dashedEnabled" class="space-y-2 pl-2 border-l-2 border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">虚线长度</span>
                <input v-model.number="dashSize" type="range" min="0.05" max="0.5" step="0.01" class="w-20" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">间隔长度</span>
                <input v-model.number="gapSize" type="range" min="0.05" max="0.5" step="0.01" class="w-20" />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3 text-sm">曲线参数</h3>

          <div v-if="curveType === 'arc'" class="space-y-3">
            <div v-for="(param, i) in arcParams" :key="i" class="flex items-center justify-between">
              <span class="text-xs text-gray-600 w-16">{{ param.label }}</span>
              <input v-model.number="param.value" type="range" :min="param.min" :max="param.max" :step="param.step"
                class="w-28" />
              <span class="text-xs text-gray-500 w-10 text-right">{{
                param.value.toFixed(2)
              }}</span>
            </div>
          </div>

          <div v-if="curveType === 'ellipse'" class="space-y-3">
            <div v-for="(param, i) in ellipseParams" :key="i" class="flex items-center justify-between">
              <span class="text-xs text-gray-600 w-16">{{ param.label }}</span>
              <input v-model.number="param.value" type="range" :min="param.min" :max="param.max" :step="param.step"
                class="w-28" />
              <span class="text-xs text-gray-500 w-10 text-right">{{
                param.value.toFixed(2)
              }}</span>
            </div>
          </div>

          <div v-if="curveType === 'catmullRom'" class="space-y-3">
            <p class="text-xs text-gray-500 mb-2">3D 控制点 (可扩展)</p>
            <div v-for="(point, i) in catmullRomPoints" :key="i" class="flex items-center gap-1 bg-white p-2 rounded">
              <span class="text-xs text-gray-400 w-4">{{ i + 1 }}</span>
              <input v-model.number="point[0]" type="number" step="0.5"
                class="w-14 px-2 py-1 border border-gray-200 rounded text-xs" />
              <input v-model.number="point[1]" type="number" step="0.5"
                class="w-14 px-2 py-1 border border-gray-200 rounded text-xs" />
              <input v-model.number="point[2]" type="number" step="0.5"
                class="w-14 px-2 py-1 border border-gray-200 rounded text-xs" />
            </div>
            <button class="w-full py-2 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              @click="addCatmullRomPoint">
              + 添加控制点
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #viewport>
      <TCanvas antialias alpha>
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[6, 6, 6]" :fov="60" />
          <TOrbitControls :enable-damping="true" />
          <TAmbientLight :intensity="0.5" />
          <TDirectionalLight :position="[5, 5, 5]" :intensity="0.8" />

          <TLineDashed v-if="dashedEnabled" :curve="currentCurve" :color="lineColor" :linewidth="lineWidth"
            :divisions="divisions" :dash-size="dashSize" :gap-size="gapSize" />
          <TLine v-else :curve="currentCurve" :color="lineColor" :linewidth="lineWidth" :divisions="divisions" />

          <TMesh :position="[0, -2, 0]" :rotation="[-Math.PI / 2, 0, 0]">
            <TPlane :args="[20, 20]" />
            <TMeshStandardMaterial color="#2c3e50" />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import { useSceneStore } from '../stores/scene'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TLine,
  TLineDashed,
  TMesh,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'
import type { CurveConfig } from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const curveType = ref<CurveConfig['type']>('catmullRom')
const lineColor = ref('#00ff88')
const lineWidth = ref(2)
const divisions = ref(100)
const dashedEnabled = ref(false)
const dashSize = ref(0.2)
const gapSize = ref(0.1)

const arcParams = ref([
  { label: '圆心 X', value: 0, min: -3, max: 3, step: 0.1 },
  { label: '圆心 Y', value: 0, min: -3, max: 3, step: 0.1 },
  { label: '半径', value: 2, min: 0.5, max: 4, step: 0.1 },
  { label: '起始角', value: 0, min: 0, max: Math.PI * 2, step: 0.1 },
  { label: '终止角', value: Math.PI * 1.5, min: 0, max: Math.PI * 2, step: 0.1 }
])

const ellipseParams = ref([
  { label: '圆心 X', value: 0, min: -3, max: 3, step: 0.1 },
  { label: '圆心 Y', value: 0, min: -3, max: 3, step: 0.1 },
  { label: 'X 半径', value: 2.5, min: 0.5, max: 4, step: 0.1 },
  { label: 'Y 半径', value: 1.5, min: 0.5, max: 4, step: 0.1 },
  { label: '起始角', value: 0, min: 0, max: Math.PI * 2, step: 0.1 },
  { label: '终止角', value: Math.PI * 2, min: 0, max: Math.PI * 2, step: 0.1 },
  { label: '旋转', value: 0, min: -Math.PI, max: Math.PI, step: 0.1 }
])

const catmullRomPoints = ref([
  [-2, 0, 0],
  [-1, 1.5, 0],
  [0, -0.5, 0],
  [1, 1, 0.5],
  [2, 0, 0]
] as Array<[number, number, number]>)

function addCatmullRomPoint() {
  const last = catmullRomPoints.value[catmullRomPoints.value.length - 1]
  catmullRomPoints.value.push([last[0] + 1, (Math.random() - 0.5) * 2, Math.random() - 0.5])
}

const currentCurve = computed<CurveConfig>(() => {
  switch (curveType.value) {
    case 'arc':
      return {
        type: 'arc',
        args: [
          arcParams.value[0].value,
          arcParams.value[1].value,
          arcParams.value[2].value,
          arcParams.value[3].value,
          arcParams.value[4].value,
          0
        ],
        divisions: divisions.value
      }
    case 'ellipse':
      return {
        type: 'ellipse',
        args: [
          ellipseParams.value[0].value,
          ellipseParams.value[1].value,
          ellipseParams.value[2].value,
          ellipseParams.value[3].value,
          ellipseParams.value[4].value,
          ellipseParams.value[5].value,
          ellipseParams.value[6].value,
          0
        ],
        divisions: divisions.value
      }
    case 'catmullRom':
      return {
        type: 'catmullRom',
        args: catmullRomPoints.value,
        divisions: divisions.value,
        closed: false
      }
    case 'spline':
      return {
        type: 'spline',
        args: catmullRomPoints.value.map(p => [p[0], p[1]]),
        divisions: divisions.value
      }
    case 'bezier':
      return {
        type: 'bezier',
        args: [
          [-2, 0],
          [-1, 3],
          [1, 3],
          [2, 0]
        ],
        divisions: divisions.value
      }
    case 'quadraticBezier':
      return {
        type: 'quadraticBezier',
        args: [
          [-2, 0],
          [0, 3],
          [2, 0]
        ],
        divisions: divisions.value
      }
    default:
      return { type: 'arc', divisions: divisions.value }
  }
})

onUnmounted(() => {
  sceneStore.clearAll()
})
</script>
