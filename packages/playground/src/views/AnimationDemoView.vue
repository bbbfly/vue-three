<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <div class="relative w-full h-full">
        <TCanvas antialias alpha shadow-map>
          <TScene background="#1a1a2e">
            <TPerspectiveCamera :position="[8, 6, 8]" :fov="60" />
            <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
            <TAmbientLight :intensity="0.4" />
            <TDirectionalLight
              :position="[6, 8, 6]"
              :intensity="1.2"
              :cast-shadow="true"
              :shadow-map-size="[1024, 1024]"
            />

            <TAnimationMixer>
              <TMesh
                ref="cubeMeshRef"
                :position="[-3, 1, 0]"
                :cast-shadow="true"
                :receive-shadow="true"
              >
                <TBox :args="[1.5, 1.5, 1.5]" />
                <TMeshStandardMaterial color="#42b883" :metalness="0.3" :roughness="0.5" />
                <TKeyframeAnimation
                  ref="cubeAnimRef"
                  name="cubeAnimation"
                  :tracks="cubeTracks"
                  :loop="LoopPingPong"
                  :repetitions="Infinity"
                  :time-scale="1"
                />
              </TMesh>

              <TMesh ref="sphereMeshRef" :position="[0, 1.5, 0]" :cast-shadow="true">
                <TSphere :args="[1, 32, 32]" />
                <TMeshStandardMaterial color="#e74c3c" :metalness="0.2" :roughness="0.6" />
                <TKeyframeAnimation
                  ref="sphereAnimRef"
                  name="sphereAnimation"
                  :tracks="sphereTracks"
                  :loop="LoopRepeat"
                  :repetitions="Infinity"
                  :time-scale="0.8"
                />
              </TMesh>

              <TMesh ref="cylinderMeshRef" :position="[3, 1, 0]" :cast-shadow="true">
                <TCylinder :args="[0.8, 0.8, 2, 32]" />
                <TMeshStandardMaterial color="#3498db" :metalness="0.4" :roughness="0.4" />
                <TKeyframeAnimation
                  ref="cylinderAnimRef"
                  name="cylinderAnimation"
                  :tracks="cylinderTracks"
                  :loop="LoopRepeat"
                  :repetitions="Infinity"
                  :time-scale="1.2"
                />
              </TMesh>

              <TMesh ref="torusMeshRef" :position="[0, 1, -3]" :cast-shadow="true">
                <TTorus :args="[0.8, 0.3, 16, 50]" />
                <TMeshStandardMaterial color="#f39c12" :metalness="0.5" :roughness="0.3" />
                <TKeyframeAnimation
                  ref="torusAnimRef"
                  name="torusAnimation"
                  :tracks="torusTracks"
                  :loop="LoopRepeat"
                  :repetitions="Infinity"
                  :time-scale="0.6"
                />
              </TMesh>
            </TAnimationMixer>

            <TMesh
              ref="groundMeshRef"
              :position="[0, -0.5, 0]"
              :rotation="[-Math.PI / 2, 0, 0]"
              :receive-shadow="true"
            >
              <TPlane :args="[20, 20]" />
              <TMeshStandardMaterial color="#2d3436" />
            </TMesh>
          </TScene>
        </TCanvas>

        <div
          class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 w-80"
        >
          <h3 class="font-semibold text-gray-800 mb-3 text-lg">动画控制面板</h3>
          <div class="space-y-3">
            <div class="flex gap-2">
              <button
                class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="
                  isPlaying
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                "
                @click="toggleGlobalAnimation"
              >
                {{ isPlaying ? '暂停全部' : '播放全部' }}
              </button>
              <button
                class="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                @click="resetAllAnimations"
              >
                重置
              </button>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-gray-600"
                >全局速度: {{ globalTimeScale.toFixed(2) }}x</label
              >
              <input
                v-model="globalTimeScale"
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                @input="updateGlobalTimeScale"
              />
            </div>

            <div class="border-t pt-3 mt-3">
              <p class="text-sm text-gray-500 mb-2">动画类型说明：</p>
              <ul class="text-xs text-gray-600 space-y-1">
                <li>🟢 立方体 - PingPong 往返运动</li>
                <li>🔴 球体 - 弹跳 + 缩放动画</li>
                <li>🔵 圆柱体 - 旋转 + 位置动画</li>
                <li>🟡 圆环 - 复杂轨迹运动</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, ref } from 'vue'
import { LoopRepeat, LoopPingPong } from 'three'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import { useSceneStore } from '../stores/scene'
import type { KeyframeTrackConfig } from '@vue-three/vue-three'
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
  TTorus,
  TPlane,
  TMeshStandardMaterial,
  TAnimationMixer,
  TKeyframeAnimation
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const cubeMeshRef = shallowRef<any>(null)
const sphereMeshRef = shallowRef<any>(null)
const cylinderMeshRef = shallowRef<any>(null)
const torusMeshRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)

const cubeAnimRef = shallowRef<any>(null)
const sphereAnimRef = shallowRef<any>(null)
const cylinderAnimRef = shallowRef<any>(null)
const torusAnimRef = shallowRef<any>(null)

const isPlaying = ref(true)
const globalTimeScale = ref(1)

const cubeTracks: KeyframeTrackConfig[] = [
  {
    name: '.position[y]',
    type: 'number',
    times: [0, 1, 2],
    values: [1, 2.5, 1]
  },
  {
    name: '.rotation[y]',
    type: 'number',
    times: [0, 2],
    values: [0, Math.PI * 2]
  }
]

const sphereTracks: KeyframeTrackConfig[] = [
  {
    name: '.position[y]',
    type: 'number',
    times: [0, 0.5, 1, 1.5, 2],
    values: [1.5, 3, 1.5, 3, 1.5]
  },
  {
    name: '.scale',
    type: 'number',
    times: [0, 0.5, 1, 1.5, 2],
    values: [1, 1.2, 0.9, 1.2, 1]
  },
  {
    name: '.rotation[x]',
    type: 'number',
    times: [0, 2],
    values: [0, Math.PI]
  }
]

const cylinderTracks: KeyframeTrackConfig[] = [
  {
    name: '.position[y]',
    type: 'number',
    times: [0, 1, 2, 3, 4],
    values: [1, 2, 1, 2, 1]
  },
  {
    name: '.position[z]',
    type: 'number',
    times: [0, 1, 2, 3, 4],
    values: [0, 2, 0, -2, 0]
  },
  {
    name: '.rotation[y]',
    type: 'number',
    times: [0, 4],
    values: [0, Math.PI * 4]
  }
]

const torusTracks: KeyframeTrackConfig[] = [
  {
    name: '.position[x]',
    type: 'number',
    times: [0, 1, 2, 3, 4],
    values: [0, 2, 0, -2, 0]
  },
  {
    name: '.position[y]',
    type: 'number',
    times: [0, 1, 2, 3, 4],
    values: [1, 2.5, 1, 2.5, 1]
  },
  {
    name: '.position[z]',
    type: 'number',
    times: [0, 1, 2, 3, 4],
    values: [-3, -1, -3, -1, -3]
  },
  {
    name: '.rotation[x]',
    type: 'number',
    times: [0, 4],
    values: [0, Math.PI * 2]
  },
  {
    name: '.rotation[z]',
    type: 'number',
    times: [0, 4],
    values: [0, Math.PI]
  }
]

function getAnimationRefs() {
  return [cubeAnimRef.value, sphereAnimRef.value, cylinderAnimRef.value, torusAnimRef.value].filter(
    Boolean
  )
}

function toggleGlobalAnimation() {
  const animRefs = getAnimationRefs()
  if (isPlaying.value) {
    animRefs.forEach(anim => anim?.pause?.())
  } else {
    animRefs.forEach(anim => anim?.play?.())
  }
  isPlaying.value = !isPlaying.value
}

function resetAllAnimations() {
  const animRefs = getAnimationRefs()
  animRefs.forEach(anim => anim?.reset?.())
  isPlaying.value = true
}

function updateGlobalTimeScale() {
  const animRefs = getAnimationRefs()
  animRefs.forEach(anim => anim?.setTimeScale?.(globalTimeScale.value))
}

function registerSceneObjects() {
  const objects = [
    { ref: cubeMeshRef, name: '动画立方体', type: 'Mesh' },
    { ref: sphereMeshRef, name: '弹跳球体', type: 'Mesh' },
    { ref: cylinderMeshRef, name: '旋转圆柱体', type: 'Mesh' },
    { ref: torusMeshRef, name: '运动圆环', type: 'Mesh' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.mesh) {
      const object = objRef.value.mesh
      const material = object.material
      sceneStore.registerSceneObject({
        id: `animation-${index}`,
        name,
        type,
        object,
        material: Array.isArray(material) ? material[0] : material
      })
    }
  })
}

onMounted(() => {
  setTimeout(registerSceneObjects, 100)
})

onUnmounted(() => {
  sceneStore.clearAll()
})
</script>
