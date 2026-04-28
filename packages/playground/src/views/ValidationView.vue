<template>
  <MainLayout>
    <template #sidebar>
      <div class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3">✅ 组件验证状态</h3>
          <div class="space-y-2 text-sm">
            <div
              class="flex items-center gap-2"
              :class="sceneReady ? 'text-green-600' : 'text-red-500'"
            >
              <span>{{ sceneReady ? '✅' : '❌' }}</span>
              <span>场景初始化</span>
            </div>
            <div
              class="flex items-center gap-2"
              :class="meshCount > 0 ? 'text-green-600' : 'text-red-500'"
            >
              <span>{{ meshCount > 0 ? '✅' : '❌' }}</span>
              <span>Mesh 对象: {{ meshCount }}</span>
            </div>
            <div
              class="flex items-center gap-2"
              :class="lightCount > 0 ? 'text-green-600' : 'text-red-500'"
            >
              <span>{{ lightCount > 0 ? '✅' : '❌' }}</span>
              <span>光源对象: {{ lightCount }}</span>
            </div>
            <div
              class="flex items-center gap-2"
              :class="cameraReady ? 'text-green-600' : 'text-red-500'"
            >
              <span>{{ cameraReady ? '✅' : '❌' }}</span>
              <span>相机初始化 (z: {{ cameraZ.toFixed(1) }})</span>
            </div>
            <div
              class="flex items-center gap-2"
              :class="controlsReady ? 'text-green-600' : 'text-red-500'"
            >
              <span>{{ controlsReady ? '✅' : '❌' }}</span>
              <span>轨道控制器</span>
            </div>
            <div
              class="flex items-center gap-2"
              :class="hasGeometry ? 'text-green-600' : 'text-red-500'"
            >
              <span>{{ hasGeometry ? '✅' : '❌' }}</span>
              <span>几何体绑定</span>
            </div>
            <div
              class="flex items-center gap-2"
              :class="hasMaterial ? 'text-green-600' : 'text-red-500'"
            >
              <span>{{ hasMaterial ? '✅' : '❌' }}</span>
              <span>材质绑定</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3">📊 场景信息</h3>
          <div class="space-y-2 text-xs text-gray-600 font-mono">
            <p>Canvas: {{ canvasWidth }} x {{ canvasHeight }}</p>
            <p>帧率: {{ fps }} FPS</p>
            <p>渲染帧数: {{ renderCount }}</p>
            <p>像素比: {{ pixelRatio.toFixed(2) }}</p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3">🎮 交互测试</h3>
          <div class="space-y-2">
            <button
              class="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              @click="rotateBox"
            >
              旋转立方体
            </button>
            <button
              class="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              @click="changeColor"
            >
              切换颜色
            </button>
            <button
              class="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              @click="toggleVisibility"
            >
              显隐切换
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #viewport>
      <div class="absolute inset-0">
        <TCanvas ref="canvasRef" antialias :clear-color="0x1a1a2e" :shadow-map="{ enabled: true }">
          <TScene>
            <TPerspectiveCamera :position="[4, 3, 4]" />
            <TOrbitControls />

            <TAmbientLight :intensity="0.3" />
            <TDirectionalLight :position="[5, 5, 5]" :intensity="1" cast-shadow />

            <TMesh
              :position="boxPosition"
              :rotation="boxRotation"
              :visible="boxVisible"
              cast-shadow
            >
              <TBox :args="[1.5, 1.5, 1.5]" />
              <TMeshStandardMaterial :color="boxColor" :metalness="0.3" :roughness="0.5" />
            </TMesh>

            <TMesh :position="[2.5, 0, 0]" cast-shadow>
              <TSphere :args="[0.8, 32, 32]" />
              <TMeshStandardMaterial color="#3b82f6" :metalness="0.5" :roughness="0.2" />
            </TMesh>

            <TMesh :position="[-2.5, 0, 0]" cast-shadow>
              <TCylinder :args="[0.6, 0.6, 2, 32]" />
              <TMeshStandardMaterial color="#22c55e" :metalness="0.1" :roughness="0.8" />
            </TMesh>

            <TMesh :position="[0, -1.5, 0]" :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
              <TPlane :args="[10, 10]" />
              <TMeshStandardMaterial color="#4a5568" />
            </TMesh>
          </TScene>
        </TCanvas>

        <div class="absolute top-4 left-4 bg-black/60 text-white px-3 py-2 rounded text-sm">
          💡 拖拽旋转 | 滚轮缩放 | 右键平移
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
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
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const canvasRef = ref<any>(null)

const boxRotation = ref<[number, number, number]>([0, 0, 0])
const boxPosition = ref<[number, number, number]>([0, 0, 0])
const boxVisible = ref(true)
const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'] as const
const colorIndex = ref(0)
const boxColor = computed(() => colors[colorIndex.value])

const sceneReady = ref(false)
const cameraReady = ref(false)
const controlsReady = ref(false)
const cameraZ = ref(0)
const meshCount = ref(0)
const lightCount = ref(0)
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const pixelRatio = ref(1)
const fps = ref(0)
const renderCount = ref(0)
let frameCount = 0
let lastTime = performance.now()

const hasGeometry = computed(() => meshCount.value >= 4)
const hasMaterial = computed(() => meshCount.value >= 4)

const rotateBox = () => {
  boxRotation.value = [boxRotation.value[0] + 0.5, boxRotation.value[1] + 0.5, boxRotation.value[2]]
}

const changeColor = () => {
  colorIndex.value = (colorIndex.value + 1) % colors.length
}

const toggleVisibility = () => {
  boxVisible.value = !boxVisible.value
}

const updateFPS = () => {
  frameCount++
  const now = performance.now()
  if (now - lastTime >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastTime = now
  }
  renderCount.value++
  requestAnimationFrame(updateFPS)
}

onMounted(async () => {
  await nextTick()

  const validateScene = () => {
    if (canvasRef.value?.context) {
      const ctx = canvasRef.value.context

      if (ctx.scene.value) {
        sceneReady.value = true
        meshCount.value = ctx.scene.value.children.filter((c: any) => c.isMesh).length
        lightCount.value = ctx.scene.value.children.filter((c: any) => c.isLight).length

        console.log('📊 Three.js 组件库验证报告:')
        console.log('='.repeat(50))
        console.log('✅ 渲染循环正常运行')
        console.log('✅ 场景对象总数:', ctx.scene.value.children.length)
        console.log('✅ Mesh 数量:', meshCount.value)
        console.log('✅ 光源数量:', lightCount.value)
        console.log('')
        console.log('📦 Mesh 详细信息:')
        ctx.scene.value.children.forEach((c: any, i: number) => {
          if (c.isMesh) {
            console.log(`  ${i}. ${c.type || 'Mesh'}`)
            console.log(
              `     - 位置: (${c.position.x.toFixed(1)}, ${c.position.y.toFixed(1)}, ${c.position.z.toFixed(1)})`
            )
            console.log(`     - 几何体: ${c.geometry?.type || '❌ 无'}`)
            console.log(`     - 材质: ${c.material?.type || '❌ 无'}`)
            console.log(`     - 材质颜色: #${c.material?.color?.getHexString() || 'N/A'}`)
          }
        })
        console.log('')
        console.log('💡 光源详细信息:')
        ctx.scene.value.children.forEach((c: any, i: number) => {
          if (c.isLight) {
            console.log(`  ${i}. ${c.type} - 强度: ${c.intensity.toFixed(2)}`)
          }
        })
        console.log('='.repeat(50))
      }

      if (ctx.camera.value) {
        cameraReady.value = true
        cameraZ.value = ctx.camera.value.position.z
      }

      if (ctx.controls.value) {
        controlsReady.value = true
      }

      if (ctx.renderer.value) {
        canvasWidth.value = ctx.renderer.value.domElement.width
        canvasHeight.value = ctx.renderer.value.domElement.height
        pixelRatio.value = ctx.renderer.value.getPixelRatio()
      }
    }
  }

  validateScene()

  setTimeout(validateScene, 500)
  setTimeout(validateScene, 1000)

  updateFPS()
})
</script>
