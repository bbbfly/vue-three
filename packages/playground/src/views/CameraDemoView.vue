<template>
  <MainLayout>
    <template #sidebar>
      <div class="p-4 border-b border-gray-700">
        <h3 class="text-sm font-semibold text-white mb-3">控制器设置</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">控制器类型</label>
            <select v-model="controlsType"
              class="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500">
              <option value="orbit">轨道控制器</option>
              <option value="fly">飞行控制器</option>
              <option value="firstPerson">第一人称</option>
            </select>
          </div>
          <p class="text-xs text-gray-500">
            {{ controlsHint }}
          </p>
        </div>
      </div>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#1a1a2e">
          <TOrthographicCamera v-if="useOrthographic" ref="orthoCameraRef" :position="[8, 6, 8]" :left="-8" :right="8"
            :top="8" :bottom="-8" :near="0.1" :far="1000" :zoom="1" />
          <TPerspectiveCamera v-else ref="perspCameraRef" :position="[8, 6, 8]" :fov="50" :near="0.1" :far="1000" />
          <TOrbitControls v-if="controlsType === 'orbit'" ref="orbitControlsRef" :enable-damping="true"
            :damping-factor="0.05" :enable-pan="true" :enable-zoom="true" :enable-rotate="true" :min-distance="2"
            :max-distance="50" :max-polar-angle="Math.PI / 2" />
          <TFlyControls v-if="controlsType === 'fly'" ref="flyControlsRef" :movement-speed="20" :roll-speed="0.5"
            :drag-to-look="true" />
          <TFirstPersonControls v-if="controlsType === 'firstPerson'" ref="fpControlsRef" :movement-speed="10"
            :look-speed="0.2" :no-fly="true" :constrain-vertical="true" :vertical-min="-Math.PI / 4"
            :vertical-max="Math.PI / 4" />

          <TAmbientLight ref="ambientLightRef" :intensity="0.4" />
          <TDirectionalLight ref="directionalLightRef" :position="[5, 8, 5]" :intensity="1" :cast-shadow="true" />

          <TMesh v-for="i in 5" :key="'box-' + i" ref="boxRefs[i - 1]" :position="[(i - 3) * 2.5, 0.5, 0]"
            :cast-shadow="true" :receive-shadow="true">
            <TBox :args="[1, i * 0.4 + 0.5, 1] as [number, number, number]" />
            <TMeshStandardMaterial :color="colors[i - 1]" />
          </TMesh>

          <TMesh v-for="z in 3" :key="'sphere-' + z" ref="sphereRefs[z - 1]" :position="[0, 1, (z - 2) * 3]"
            :cast-shadow="true" :receive-shadow="true">
            <TSphere :args="[0.5, 32, 32] as [number, number, number]" />
            <TMeshStandardMaterial color="#9b59b6" />
          </TMesh>

          <TMesh ref="groundMeshRef" :position="[0, -0.01, 0]" :rotation="[-Math.PI / 2, 0, 0]" :receive-shadow="true">
            <TPlane :args="[20, 20] as [number, number]" />
            <TMeshStandardMaterial color="#2c3e50" />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, computed, watch } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import { useSceneStore } from '../stores/scene'
import { ref } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrthographicCamera,
  TOrbitControls,
  TFlyControls,
  TFirstPersonControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TBox,
  TSphere,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const useOrthographic = ref(false)
const perspCameraRef = shallowRef<any>(null)
const orthoCameraRef = shallowRef<any>(null)
const orbitControlsRef = shallowRef<any>(null)
const flyControlsRef = shallowRef<any>(null)
const fpControlsRef = shallowRef<any>(null)
const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)
const boxRefs = shallowRef<any[]>([null, null, null, null, null])
const sphereRefs = shallowRef<any[]>([null, null, null])
const groundMeshRef = shallowRef<any>(null)

const controlsType = ref<'orbit' | 'fly' | 'firstPerson'>('orbit')

const controlsHint = computed(() => {
  switch (controlsType.value) {
    case 'fly':
      return 'WASD 移动，R/F 升降，鼠标控制方向，QE 翻滚'
    case 'firstPerson':
      return 'WASD 移动，鼠标控制视角，左键点击激活'
    default:
      return '左键旋转，右键平移，滚轮缩放'
  }
})

const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db']

function getCurrentControlsRef() {
  switch (controlsType.value) {
    case 'fly':
      return flyControlsRef.value
    case 'firstPerson':
      return fpControlsRef.value
    default:
      return orbitControlsRef.value
  }
}

function getControlsTypeName() {
  switch (controlsType.value) {
    case 'fly':
      return '飞行控制器'
    case 'firstPerson':
      return '第一人称控制器'
    default:
      return '轨道控制器'
  }
}

function getControlsType() {
  switch (controlsType.value) {
    case 'fly':
      return 'FlyControls'
    case 'firstPerson':
      return 'FirstPersonControls'
    default:
      return 'OrbitControls'
  }
}

function registerSceneObjects() {
  const objects = [
    {
      ref: useOrthographic.value ? orthoCameraRef.value : perspCameraRef.value,
      name: useOrthographic.value ? '正交相机' : '透视相机',
      type: useOrthographic.value ? 'OrthographicCamera' : 'PerspectiveCamera'
    },
    { ref: getCurrentControlsRef(), name: getControlsTypeName(), type: getControlsType() },
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' }
  ]

  boxRefs.value.forEach((ref, index) => {
    if (ref?.mesh) {
      sceneStore.registerSceneObject({
        id: `camera-box-${index}`,
        name: `彩盒${index + 1}`,
        type: 'Mesh',
        object: ref.mesh,
        material: Array.isArray(ref.mesh.material) ? ref.mesh.material[0] : ref.mesh.material
      })
    }
  })

  sphereRefs.value.forEach((ref, index) => {
    if (ref?.mesh) {
      sceneStore.registerSceneObject({
        id: `camera-sphere-${index}`,
        name: `紫球${index + 1}`,
        type: 'Mesh',
        object: ref.mesh,
        material: Array.isArray(ref.mesh.material) ? ref.mesh.material[0] : ref.mesh.material
      })
    }
  })

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef?.camera || objRef?.controls || objRef?.light || objRef?.mesh) {
      const object = objRef.camera || objRef.controls || objRef.light || objRef.mesh
      const material = objRef?.mesh?.material
      sceneStore.registerSceneObject({
        id: `camera-obj-${index}`,
        name,
        type,
        object,
        material: Array.isArray(material) ? material[0] : material
      })
    }
  })
}

watch(controlsType, () => {
  const camera = useOrthographic.value ? orthoCameraRef.value : perspCameraRef.value
  if (camera?.camera) {
    camera.camera.position.set(8, 6, 8)
  }
  sceneStore.clearAll()
  setTimeout(registerSceneObjects, 100)
})

onMounted(() => {
  setTimeout(registerSceneObjects, 100)
})

onUnmounted(() => {
  sceneStore.clearAll()
})
</script>
