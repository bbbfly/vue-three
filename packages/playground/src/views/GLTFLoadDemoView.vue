<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
      <div class="mt-4 px-2">
        <div v-if="loading" class="bg-blue-50 rounded-lg p-4">
          <div class="flex items-center gap-2 text-blue-600">
            <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span class="text-sm">加载模型中...</span>
          </div>
          <div class="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
            <div
              class="bg-blue-600 h-full transition-all duration-300"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
          <p class="text-xs text-blue-500 mt-1">{{ progress }}%</p>
        </div>

        <div v-if="animations.length > 0" class="mt-4 bg-green-50 rounded-lg p-4">
          <p class="text-sm font-medium text-green-700 mb-3">🎬 动画列表</p>
          <div class="space-y-2">
            <button
              v-for="(clip, index) in animations"
              :key="index"
              class="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors"
              :class="
                currentAnimation === index
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-green-100'
              "
              @click="playAnimation(index)"
            >
              <span class="flex items-center justify-between">
                <span>{{ clip.name || `动画 ${index + 1}` }}</span>
                <span class="text-xs opacity-75">{{ clip.duration.toFixed(2) }}s</span>
              </span>
            </button>
          </div>
        </div>

        <AnimationTimeline
          v-if="currentAction"
          class="mt-4"
          :current-time="timelineTime"
          :duration="currentAction.getClip().duration"
          :is-playing="isPlaying"
          @play="onTimelinePlay"
          @pause="onTimelinePause"
          @stop="onTimelineStop"
          @reset="onTimelineReset"
          @time-change="onTimelineTimeChange"
          @speed-change="onTimelineSpeedChange"
          @loop-mode-change="onTimelineLoopChange"
        />

        <div v-if="error" class="bg-red-50 rounded-lg p-4 mt-4">
          <p class="text-sm text-red-600">模型加载失败</p>
          <p class="text-xs text-red-500 mt-1">{{ error }}</p>
        </div>
      </div>
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[3, 3, 3]" :fov="50" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
          <TAmbientLight ref="ambientLightRef" :intensity="0.5" />
          <TDirectionalLight
            ref="directionalLightRef"
            :position="[5, 8, 5]"
            :intensity="1"
            :cast-shadow="true"
          />

          <TGLTFLoader
            ref="gltfRef"
            v-slot="{ model }"
            src="https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf"
            :scale="[2, 2, 2]"
            :position="[0, 0, 0]"
            :receive-shadow="true"
            :cast-shadow="true"
            @load="onLoad"
            @progress="onProgress"
            @error="onError"
          >
            <TAnimationMixer
              v-if="model"
              :ref="
                (el: any) => {
                  mixerRef = el?.mixer
                }
              "
              :root="model"
            >
              <TKeyframeAnimation
                :name="'float'"
                :tracks="[
                  {
                    name: '.position[y]',
                    type: 'number',
                    times: [0, 1, 2],
                    values: [0, 0.3, 0]
                  }
                ]"
                :duration="2"
                :loop="LoopRepeat"
              />
            </TAnimationMixer>
          </TGLTFLoader>

          <TMesh
            ref="groundMeshRef"
            :position="[0, -0.5, 0]"
            :rotation="[-Math.PI / 2, 0, 0]"
            :receive-shadow="true"
          >
            <TPlane :args="[10, 10] as [number, number]" />
            <TMeshStandardMaterial color="#2c3e50" />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import type { AnimationClip, AnimationAction, AnimationMixer } from 'three'
import { LoopOnce, LoopRepeat, LoopPingPong } from 'three'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import AnimationTimeline from '../components/AnimationTimeline.vue'
import { useSceneStore } from '../stores/scene'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TPlane,
  TMeshStandardMaterial,
  TGLTFLoader,
  TAnimationMixer,
  TKeyframeAnimation
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const loading = ref(true)
const progress = ref(0)
const error = ref('')
const animations = ref<AnimationClip[]>([])
const currentAnimation = ref(-1)
const currentAction = shallowRef<AnimationAction | null>(null)
const mixerRef = shallowRef<AnimationMixer | null>(null)
const isPlaying = ref(false)
const timelineTime = ref(0)

const gltfRef = shallowRef<any>(null)
const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)

function registerSceneObjects() {
  const objects = [
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' }
  ]

  if (gltfRef.value?.scene) {
    gltfRef.value.scene.traverse((child: any, index: number) => {
      if (child.isMesh) {
        sceneStore.registerSceneObject({
          id: `gltf-mesh-${index}`,
          name: `头盔部件 ${index + 1}`,
          type: 'Mesh',
          object: child,
          material: Array.isArray(child.material) ? child.material[0] : child.material
        })
      }
    })
  }

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.mesh || objRef.value?.light) {
      const object = objRef.value.mesh || objRef.value.light
      const material = objRef.value?.mesh?.material
      sceneStore.registerSceneObject({
        id: `gltf-${index}`,
        name,
        type,
        object,
        material: Array.isArray(material) ? material[0] : material
      })
    }
  })
}

const playAnimation = (index: number) => {
  if (!mixerRef.value || !animations.value[index]) return

  if (currentAction.value) {
    currentAction.value.stop()
  }

  currentAction.value = mixerRef.value.clipAction(animations.value[index])
  currentAction.value.setLoop(LoopRepeat, Infinity)
  currentAction.value.play()
  currentAnimation.value = index
  isPlaying.value = true
}

const onTimelinePlay = () => {
  if (currentAction.value) {
    currentAction.value.paused = false as unknown as number
    isPlaying.value = true
  }
}

const onTimelinePause = () => {
  if (currentAction.value) {
    currentAction.value.paused = true as unknown as number
    isPlaying.value = false
  }
}

const onTimelineStop = () => {
  if (currentAction.value) {
    currentAction.value.stop()
    isPlaying.value = false
    timelineTime.value = 0
  }
}

const onTimelineReset = () => {
  if (currentAction.value && mixerRef.value) {
    currentAction.value.reset()
    mixerRef.value.setTime(0)
    timelineTime.value = 0
  }
}

const onTimelineTimeChange = (time: number) => {
  if (mixerRef.value) {
    mixerRef.value.setTime(time)
    timelineTime.value = time
  }
}

const onTimelineSpeedChange = (speed: number) => {
  if (currentAction.value) {
    currentAction.value.setEffectiveTimeScale(speed)
  }
}

const onTimelineLoopChange = (mode: 'repeat' | 'pingpong' | 'once') => {
  if (!currentAction.value) return

  switch (mode) {
    case 'repeat':
      currentAction.value.setLoop(LoopRepeat, Infinity)
      break
    case 'pingpong':
      currentAction.value.setLoop(LoopPingPong, Infinity)
      break
    case 'once':
      currentAction.value.setLoop(LoopOnce, 1)
      break
  }
}

const onLoad = (model: any, anims: AnimationClip[]) => {
  loading.value = false
  progress.value = 100
  animations.value = anims
  setTimeout(registerSceneObjects, 100)
}

const onProgress = (event: { loaded: number; total: number }) => {
  progress.value = Math.round((event.loaded / event.total) * 100)
}

const onError = (err: unknown) => {
  loading.value = false
  error.value = String(err)
}

let timeUpdateInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  setTimeout(() => {
    if (!loading.value) {
      registerSceneObjects()
    }
  }, 500)

  timeUpdateInterval = setInterval(() => {
    if (mixerRef.value && isPlaying.value) {
      timelineTime.value = mixerRef.value.time
    }
  }, 50)
})

onUnmounted(() => {
  sceneStore.clearAll()
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
})
</script>
