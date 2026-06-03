<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha @click="handleCanvasClick">
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[10, 8, 10]" :fov="60" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
          <TAmbientLight :intensity="0.5" />
          <TDirectionalLight :position="[5, 8, 5]" :intensity="1" />

          <TMesh
            ref="groundMeshRef"
            :position="[0, -0.01, 0]"
            :rotation="[-Math.PI / 2, 0, 0]"
            :receive-shadow="true"
          >
            <TPlane :args="[30, 25] as [number, number]" />
            <TMeshStandardMaterial color="#2c3e50" />
          </TMesh>

          <TMesh
            v-for="i in 5"
            :key="'cube-' + i"
            :position="[(i - 3) * 2.5, 0.75, -2]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TBox :args="[1.5, 1.5, 1.5] as [number, number, number]" />
            <TMeshStandardMaterial :color="cubeColors[i - 1]" :metalness="0.3" :roughness="0.7" />
          </TMesh>

          <div class="sprite-demo-section">
            <h3 class="demo-title">基础精灵</h3>
            <TSprite
              ref="basicSpriteRef"
              :position="[-8, 2, -4]"
              :scale="[1, 1, 1]"
              color="#e74c3c"
            />
            <TSprite :position="[-6, 2, -4]" :scale="[0.8, 0.8, 0.8]" color="#3498db" />
            <TSprite :position="[-4, 2, -4]" :scale="[1.2, 1.2, 1.2]" color="#2ecc71" />
          </div>

          <div class="sprite-demo-section">
            <h3 class="demo-title">POI 标记点系统</h3>
            <TSprite
              v-for="(poi, index) in poiMarkers"
              :key="'poi-' + index"
              ref="poiSpriteRefs"
              :position="poi.position"
              :scale="[0.6, 0.6, 0.6]"
              :color="poi.color"
              clip="circle"
              :render-order="100"
              @click="handlePOIClick(poi)"
            />
            <TSprite
              v-for="(poi, index) in poiMarkers"
              :key="'poi-glow-' + index"
              :position="poi.position"
              :scale="[1, 1, 1]"
              :color="poi.color"
              clip="circle"
              blending="additive"
              :opacity="0.3"
            />
          </div>

          <div class="sprite-demo-section">
            <h3 class="demo-title">裁剪模式</h3>
            <TSprite :position="[-6, 2, 0]" :scale="[1, 1, 1]" color="#f39c12">
              <TSpriteMaterial clip="none" :color="'#f39c12'" />
            </TSprite>
            <TSprite :position="[-4, 2, 0]" :scale="[1, 1, 1]" color="#e74c3c">
              <TSpriteMaterial clip="circle" :color="'#e74c3c'" />
            </TSprite>
            <TSprite :position="[-2, 2, 0]" :scale="[1, 1, 1]" color="#9b59b6">
              <TSpriteMaterial clip="rounded" :border-radius="0.15" :color="'#9b59b6'" />
            </TSprite>
            <TSprite :position="[0, 2, 0]" :scale="[1, 1, 1]" color="#1abc9c">
              <TSpriteMaterial clip="rounded" :border-radius="0.35" :color="'#1abc9c'" />
            </TSprite>
          </div>

          <div class="sprite-demo-section">
            <h3 class="demo-title">混合模式</h3>
            <TSprite
              v-for="(blend, index) in blendingModes"
              :key="'blend-' + index"
              :position="[-6 + index * 2, 2, 3]"
              :scale="[1.2, 1.2, 1.2]"
              :color="blend.color"
            >
              <TSpriteMaterial
                :blending="blend.mode"
                :color="blend.color"
                clip="circle"
                :opacity="blend.opacity"
              />
            </TSprite>
          </div>

          <div class="sprite-demo-section">
            <h3 class="demo-title">像素级渲染 (sizeAttenuation)</h3>
            <TSprite
              ref="attenuationOnRef"
              :position="[2, 2, 3]"
              :scale="[0.5, 0.5, 0.5]"
              color="#e67e22"
              :size-attenuation="true"
            />
            <TSprite
              ref="attenuationOffRef"
              :position="[4, 2, 3]"
              :scale="[0.5, 0.5, 0.5]"
              color="#16a085"
              :size-attenuation="false"
            />
            <TSprite
              v-for="i in 8"
              :key="'distance-' + i"
              :position="[i * 1.2 - 5, 1.5, 6 + i * 0.5]"
              :scale="[0.4, 0.4, 0.4]"
              :color="getDistanceColor(i)"
              :size-attenuation="false"
              clip="circle"
            />
          </div>

          <div class="sprite-demo-section">
            <h3 class="demo-title">可交互精灵 (点击测试)</h3>
            <TSprite
              ref="clickableSpriteRef"
              :position="[6, 2.5, -4]"
              :scale="[1.2, 1.2, 1.2]"
              :color="spriteClicked ? '#2ecc71' : '#e74c3c'"
              clip="circle"
              @click="handleSpriteClick"
              @pointer-over="handlePointerOver"
              @pointer-out="handlePointerOut"
            />
            <TSprite
              :position="[8, 2.5, -4]"
              :scale="[1.2, 1.2, 1.2]"
              :color="sprite2Clicked ? '#2ecc71' : '#3498db'"
              clip="rounded"
              :border-radius="0.2"
              @click="handleSprite2Click"
            />
          </div>

          <div class="sprite-demo-section">
            <h3 class="demo-title">动态属性调试</h3>
            <TSprite
              ref="debugSpriteRef"
              :position="[6, 2, 0]"
              :scale="[debugSpriteScale, debugSpriteScale, debugSpriteScale]"
              :color="debugSpriteColor"
              :opacity="debugSpriteOpacity"
              :clip="debugSpriteClip"
              :border-radius="debugBorderRadius"
              :blending="debugSpriteBlending"
              :size-attenuation="debugSizeAttenuation"
            />
          </div>
        </TScene>
      </TCanvas>
    </template>
    <template #properties>
      <div class="p-4">
        <h2 class="text-lg font-bold mb-4 text-gray-800">Sprite 精灵演示</h2>

        <div class="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-sm font-semibold text-amber-600 mb-2">点击状态</h3>
          <p class="text-xs text-gray-600">精灵1: {{ spriteClicked ? '已点击 ✓' : '未点击' }}</p>
          <p class="text-xs text-gray-600">精灵2: {{ sprite2Clicked ? '已点击 ✓' : '未点击' }}</p>
          <p class="text-xs text-gray-600">悬停: {{ isHovering ? '是' : '否' }}</p>
          <p v-if="lastClickedPOI" class="text-xs text-green-600 mt-2">
            最后点击 POI: {{ lastClickedPOI.name }}
          </p>
        </div>

        <div class="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-sm font-semibold text-blue-600 mb-2">精灵属性实时调试</h3>

          <div class="space-y-3">
            <div>
              <label class="text-xs text-gray-500 block mb-1"
                >缩放: {{ Number(debugSpriteScale).toFixed(2) }}</label
              >
              <input
                v-model.number="debugSpriteScale"
                type="range"
                min="0.2"
                max="2"
                step="0.1"
                class="w-full"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1"
                >透明度: {{ Number(debugSpriteOpacity).toFixed(2) }}</label
              >
              <input
                v-model.number="debugSpriteOpacity"
                type="range"
                min="0"
                max="1"
                step="0.05"
                class="w-full"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1"
                >圆角半径: {{ Number(debugBorderRadius).toFixed(2) }}</label
              >
              <input
                v-model.number="debugBorderRadius"
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                class="w-full"
                :disabled="debugSpriteClip !== 'rounded'"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">裁剪模式</label>
              <select
                v-model="debugSpriteClip"
                class="w-full bg-white border border-gray-300 text-gray-700 text-xs p-1 rounded"
              >
                <option value="none">无裁剪</option>
                <option value="circle">圆形</option>
                <option value="rounded">圆角</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">混合模式</label>
              <select
                v-model="debugSpriteBlendingValue"
                class="w-full bg-white border border-gray-300 text-gray-700 text-xs p-1 rounded"
              >
                <option value="">正常</option>
                <option value="additive">加法混合</option>
                <option value="multiply">正片叠底</option>
                <option value="screen">滤色</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">颜色</label>
              <input
                v-model="debugSpriteColor"
                type="color"
                class="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div class="flex items-center gap-2">
              <input
                id="sizeAtten"
                v-model="debugSizeAttenuation"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <label for="sizeAtten" class="text-xs text-gray-500">透视大小衰减</label>
            </div>
          </div>
        </div>

        <div class="text-xs text-gray-500 mt-4 bg-blue-50 p-3 rounded-lg">
          <p class="font-medium text-blue-700 mb-1">💡 提示：</p>
          <ul class="list-disc ml-4 mt-1 space-y-1 text-gray-600">
            <li>点击绿色/红色精灵测试交互</li>
            <li>缩放相机观察 sizeAttenuation 效果</li>
            <li>使用右侧面板调试属性</li>
          </ul>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, computed } from 'vue'
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
  TBox,
  TPlane,
  TMeshStandardMaterial,
  TSprite,
  TSpriteMaterial
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const cubeColors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6']

const poiMarkers = ref([
  { name: '起点', position: [-2, 0.5, -2] as [number, number, number], color: '#3498db' },
  { name: '终点', position: [2, 0.5, -2] as [number, number, number], color: '#e74c3c' },
  { name: '检查点A', position: [0, 0.5, 0] as [number, number, number], color: '#2ecc71' },
  { name: '检查点B', position: [-3, 0.5, 2] as [number, number, number], color: '#f39c12' },
  { name: '目的地', position: [3, 0.5, 2] as [number, number, number], color: '#9b59b6' }
])

const blendingModes = ref([
  { mode: undefined as any, name: 'normal', color: '#e74c3c', opacity: 1 },
  { mode: 'additive' as const, name: 'additive', color: '#f39c12', opacity: 0.8 },
  { mode: 'multiply' as const, name: 'multiply', color: '#9b59b6', opacity: 0.9 },
  { mode: 'screen' as const, name: 'screen', color: '#3498db', opacity: 0.9 }
])

const basicSpriteRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)
const clickableSpriteRef = shallowRef<any>(null)
const debugSpriteRef = shallowRef<any>(null)
const attenuationOnRef = shallowRef<any>(null)
const attenuationOffRef = shallowRef<any>(null)
const poiSpriteRefs = shallowRef<any[]>([])

const spriteClicked = ref(false)
const sprite2Clicked = ref(false)
const isHovering = ref(false)
const lastClickedPOI = ref<any>(null)

const debugSpriteScale = ref(1)
const debugSpriteOpacity = ref(1)
const debugSpriteColor = ref('#ff6b6b')
const debugSpriteClip = ref<'none' | 'circle' | 'rounded'>('circle')
const debugBorderRadius = ref(0.2)
const debugSpriteBlendingValue = ref<string>('')
const debugSizeAttenuation = ref(true)

const debugSpriteBlending = computed(() => {
  return debugSpriteBlendingValue.value || undefined
})

function getDistanceColor(i: number) {
  const colors = [
    '#e74c3c',
    '#e67e22',
    '#f1c40f',
    '#2ecc71',
    '#1abc9c',
    '#3498db',
    '#9b59b6',
    '#e84393'
  ]
  return colors[i - 1] || '#ffffff'
}

function handleCanvasClick() {
  console.log('Canvas clicked')
}

function handleSpriteClick() {
  spriteClicked.value = !spriteClicked.value
}

function handleSprite2Click() {
  sprite2Clicked.value = !sprite2Clicked.value
}

function handlePointerOver() {
  isHovering.value = true
}

function handlePointerOut() {
  isHovering.value = false
}

function handlePOIClick(poi: any) {
  lastClickedPOI.value = poi
  console.log('POI Clicked:', poi.name)
}

function registerSceneObjects() {
  const objects = [
    { ref: groundMeshRef, name: '地面', type: 'Mesh' },
    { ref: basicSpriteRef, name: '基础精灵', type: 'Sprite' },
    { ref: clickableSpriteRef, name: '可点击精灵', type: 'Sprite' },
    { ref: debugSpriteRef, name: '调试精灵', type: 'Sprite' },
    { ref: attenuationOnRef, name: '透视精灵', type: 'Sprite' },
    { ref: attenuationOffRef, name: '像素级精灵', type: 'Sprite' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.sprite || objRef.value?.mesh) {
      const object = objRef.value.sprite || objRef.value.mesh
      sceneStore.registerSceneObject({
        id: `sprite-${index}`,
        name,
        type,
        object
      })
    }
  })

  poiMarkers.value.forEach((poi, index) => {
    const spriteRef = poiSpriteRefs.value[index]
    if (spriteRef?.sprite) {
      sceneStore.registerSceneObject({
        id: `poi-${index}`,
        name: poi.name,
        type: 'Sprite',
        object: spriteRef.sprite
      })
    }
  })
}

onMounted(() => {
  registerSceneObjects()
})

onUnmounted(() => {
  sceneStore.clearSceneObjects()
})
</script>

<style scoped>
.sprite-demo-section {
  position: relative;
}

.demo-title {
  position: absolute;
  color: white;
  font-size: 12px;
  opacity: 0.6;
  pointer-events: none;
}
</style>
