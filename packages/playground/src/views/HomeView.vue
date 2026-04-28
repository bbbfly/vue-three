<template>
  <MainLayout>
    <template #sidebar>
      <div class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            场景节点
          </h3>
          <div class="space-y-1">
            <div
              class="px-3 py-2 rounded-md bg-white text-sm text-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
            >
              <span>🌍</span> Scene
            </div>
            <div
              class="px-3 py-2 rounded-md bg-blue-50 text-sm text-blue-700 flex items-center gap-2 cursor-pointer border border-blue-200"
            >
              <span>📦</span> TBox - 立方体
            </div>
            <div
              class="px-3 py-2 rounded-md bg-white text-sm text-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
            >
              <span>💡</span> DirectionalLight
            </div>
            <div
              class="px-3 py-2 rounded-md bg-white text-sm text-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
            >
              <span>💡</span> AmbientLight
            </div>
            <div
              class="px-3 py-2 rounded-md bg-white text-sm text-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
            >
              <span>🎥</span> PerspectiveCamera
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
            属性面板 - 立方体
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">位置 X</label>
              <input
                v-model="positionX"
                type="range"
                min="-5"
                max="5"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">位置 Y</label>
              <input
                v-model="positionY"
                type="range"
                min="-5"
                max="5"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">位置 Z</label>
              <input
                v-model="positionZ"
                type="range"
                min="-5"
                max="5"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div class="pt-2 border-t border-gray-200">
              <label class="block text-xs text-gray-500 mb-2">材质颜色</label>
              <div class="flex gap-2">
                <div
                  v-for="color in colors"
                  :key="color"
                  :style="{ backgroundColor: color }"
                  class="w-8 h-8 rounded-md cursor-pointer"
                  :class="
                    materialColor === color
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : 'hover:ring-2 hover:ring-offset-2 hover:ring-blue-500'
                  "
                  @click="materialColor = color"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #viewport>
      <div class="absolute inset-0">
        <TCanvas antialias alpha :shadow-map="{ enabled: true }">
          <TScene>
            <TPerspectiveCamera :position="[3, 3, 3]" />
            <TOrbitControls />
            <TAmbientLight :intensity="0.5" />
            <TDirectionalLight :position="[5, 5, 5]" :intensity="1" />

            <TMesh :position="[positionX, positionY, positionZ]" cast-shadow>
              <TBox :args="[1, 1, 1]" />
              <TMeshStandardMaterial :color="materialColor" />
            </TMesh>

            <TMesh :position="[2, 0, 0]" cast-shadow>
              <TSphere :args="[0.6, 32, 32]" />
              <TMeshStandardMaterial color="#3b82f6" />
            </TMesh>

            <TMesh :position="[-2, 0, 0]" cast-shadow>
              <TCylinder :args="[0.5, 0.5, 1.5, 32]" />
              <TMeshStandardMaterial color="#22c55e" />
            </TMesh>
          </TScene>
        </TCanvas>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'
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
  TCylinder,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const positionX = ref(0)
const positionY = ref(0)
const positionZ = ref(0)
const materialColor = ref('#ef4444')

const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308']
</script>
