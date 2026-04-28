<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />

      <CollapsePanel title="后期处理" :open="true" class="border-t border-gray-100">
        <div class="px-4 py-3 space-y-5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">启用后期处理</span>
            <button
              class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
              :class="enablePostProcessing ? 'bg-blue-600' : 'bg-gray-200'"
              @click="enablePostProcessing = !enablePostProcessing"
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="enablePostProcessing ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
          </div>

          <div v-if="enablePostProcessing" class="space-y-4 pt-2 border-t border-gray-100">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-600">发光强度 (Strength)</span>
                <span class="text-xs text-blue-600 font-mono">{{ bloomStrength.toFixed(2) }}</span>
              </div>
              <input
                v-model="bloomStrength"
                type="range"
                min="0"
                max="5"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-600">发光阈值 (Threshold)</span>
                <span class="text-xs text-blue-600 font-mono">{{ bloomThreshold.toFixed(2) }}</span>
              </div>
              <input
                v-model="bloomThreshold"
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-600">发光半径 (Radius)</span>
                <span class="text-xs text-blue-600 font-mono">{{ bloomRadius.toFixed(2) }}</span>
              </div>
              <input
                v-model="bloomRadius"
                type="range"
                min="0"
                max="2"
                step="0.01"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div class="pt-3 border-t border-gray-100">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-600">SSAA 抗锯齿</span>
                <button
                  class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                  :class="enableSSAA ? 'bg-green-600' : 'bg-gray-200'"
                  @click="enableSSAA = !enableSSAA"
                >
                  <span
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="enableSSAA ? 'translate-x-4' : 'translate-x-0'"
                  ></span>
                </button>
              </div>

              <div v-if="enableSSAA" class="mt-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-600">采样级别 (Sample Level)</span>
                  <span class="text-xs text-green-600 font-mono">{{ ssaaSampleLevel }}</span>
                </div>
                <input
                  v-model="ssaaSampleLevel"
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsePanel>
    </template>

    <template #viewport>
      <TCanvas antialias alpha>
        <TScene background="#0a0a1a">
          <TPerspectiveCamera :position="[0, 5, 12]" :fov="60" />
          <TOrbitControls :enable-damping="true" />
          <TAmbientLight :intensity="0.1" />
          <TDirectionalLight :position="[5, 8, 5]" :intensity="0.5" />

          <TEffectComposer v-if="enablePostProcessing">
            <TBloomPass
              v-if="bloomEnabled"
              :strength="bloomStrength"
              :threshold="bloomThreshold"
              :radius="bloomRadius"
            />
            <TSSAAPass v-if="enableSSAA" :sample-level="ssaaSampleLevel" :unbiased="true" />
          </TEffectComposer>

          <TMesh
            v-for="i in 5"
            :key="'s-' + i"
            :position="getSpherePosition(i)"
            :cast-shadow="true"
          >
            <TSphere :args="[0.5, 32, 32] as [number, number, number]" />
            <TMeshStandardMaterial
              :color="getSphereColor(i)"
              :emissive="getSphereColor(i)"
              :emissive-intensity="2 + i * 0.5"
              :metalness="0.3"
              :roughness="0.2"
            />
          </TMesh>

          <TMesh :rotation="[-Math.PI / 2, 0, 0]" :position="[0, -1.5, 0]">
            <TPlane :args="[30, 30] as [number, number]" />
            <TMeshStandardMaterial color="#0d1117" :metalness="0.8" :roughness="0.4" />
          </TMesh>

          <TMesh
            v-for="i in 8"
            :key="'c-' + i"
            :position="getCubePosition(i)"
            :rotation="[getCubeRotation(i), getCubeRotation(i) * 0.7, 0]"
          >
            <TBox :args="[0.6, 0.6, 0.6] as [number, number, number]" />
            <TMeshStandardMaterial
              :color="getCubeColor(i)"
              :emissive="getCubeColor(i)"
              :emissive-intensity="1.5"
              :metalness="0.5"
              :roughness="0.3"
            />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import CollapsePanel from '../components/CollapsePanel.vue'
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
  TPlane,
  TMeshStandardMaterial,
  TEffectComposer,
  TBloomPass,
  TSSAAPass
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const enablePostProcessing = ref(true)
const bloomEnabled = computed(() => enablePostProcessing.value)
const bloomStrength = ref(2.0)
const bloomThreshold = ref(0.4)
const bloomRadius = ref(0.5)

const enableSSAA = ref(true)
const ssaaSampleLevel = ref(2)

function getSpherePosition(i: number): [number, number, number] {
  const angle = ((i - 1) * Math.PI * 2) / 5 - Math.PI / 2
  const radius = 3
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
}

function getSphereColor(i: number): string {
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181']
  return colors[(i - 1) % colors.length]
}

function getCubePosition(i: number): [number, number, number] {
  const angle = ((i - 1) * Math.PI * 2) / 8
  const radius = 5
  return [Math.cos(angle) * radius, -0.8, Math.sin(angle) * radius]
}

function getCubeRotation(i: number): number {
  return i * 0.3
}

function getCubeColor(i: number): string {
  const colors = [
    '#a8e6cf',
    '#dcedc1',
    '#ffd3b6',
    '#ffaaa5',
    '#ff8b94',
    '#6c5b7b',
    '#c06c84',
    '#f67280'
  ]
  return colors[(i - 1) % colors.length]
}

onMounted(() => {
  setTimeout(() => {
    sceneStore.registerSceneObject({
      id: 'post-processing',
      name: '后期处理效果',
      type: 'EffectComposer',
      object: {},
      params: {
        bloom: { strength: bloomStrength, threshold: bloomThreshold, radius: bloomRadius },
        ssaa: { enabled: enableSSAA, sampleLevel: ssaaSampleLevel }
      }
    })
  }, 100)
})

onUnmounted(() => {
  sceneStore.clearAll()
})
</script>
