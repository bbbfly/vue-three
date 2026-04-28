<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[8, 6, 8]" :fov="60" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
          <TAmbientLight ref="ambientLightRef" :intensity="0.4" />
          <TDirectionalLight
            ref="directionalLightRef"
            :position="[5, 8, 5]"
            :intensity="1"
            :cast-shadow="true"
          />

          <TMesh ref="boxMeshRef" :position="[-3, 1, 0]" :cast-shadow="true" :receive-shadow="true">
            <TBox :args="boxArgs as [number, number, number]" />
            <TMeshStandardMaterial :color="boxColor" />
          </TMesh>

          <TMesh
            ref="sphereMeshRef"
            :position="[0, 1, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TSphere :args="sphereArgs as [number, number, number]" />
            <TMeshStandardMaterial :color="sphereColor" />
          </TMesh>

          <TMesh
            ref="cylinderMeshRef"
            :position="[3, 1, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TCylinder :args="cylinderArgs as [number, number, number, number]" />
            <TMeshStandardMaterial :color="cylinderColor" />
          </TMesh>

          <TMesh
            ref="torusMeshRef"
            :position="[-2, 1, 3]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TTorus :args="torusArgs as [number, number, number, number]" />
            <TMeshStandardMaterial :color="torusColor" />
          </TMesh>

          <TMesh ref="coneMeshRef" :position="[2, 1, 3]" :cast-shadow="true" :receive-shadow="true">
            <TCone :args="coneArgs as [number, number, number]" />
            <TMeshStandardMaterial :color="coneColor" />
          </TMesh>

          <TMesh
            ref="groundMeshRef"
            :position="[0, -0.01, 0]"
            :rotation="[-Math.PI / 2, 0, 0]"
            :receive-shadow="true"
          >
            <TPlane :args="[15, 15]" />
            <TMeshStandardMaterial color="#2c3e50" />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
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
  TSphere,
  TCylinder,
  TTorus,
  TCone,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const boxMeshRef = shallowRef<any>(null)
const sphereMeshRef = shallowRef<any>(null)
const cylinderMeshRef = shallowRef<any>(null)
const torusMeshRef = shallowRef<any>(null)
const coneMeshRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)
const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)

const boxArgs = ref<[number, number, number]>([1.5, 1.5, 1.5])
const boxColor = ref('#e74c3c')

const sphereArgs = ref<[number, number, number]>([1, 32, 32])
const sphereColor = ref('#3498db')

const cylinderArgs = ref<[number, number, number, number]>([0.8, 0.8, 2, 32])
const cylinderColor = ref('#2ecc71')

const torusArgs = ref<[number, number, number, number]>([0.8, 0.35, 16, 64])
const torusColor = ref('#9b59b6')

const coneArgs = ref<[number, number, number]>([0.8, 1.6, 64])
const coneColor = ref('#f39c12')

function registerSceneObjects() {
  const objects = [
    { ref: boxMeshRef, name: '立方体', type: 'Mesh' },
    { ref: sphereMeshRef, name: '球体', type: 'Mesh' },
    { ref: cylinderMeshRef, name: '圆柱体', type: 'Mesh' },
    { ref: torusMeshRef, name: '圆环', type: 'Mesh' },
    { ref: coneMeshRef, name: '圆锥', type: 'Mesh' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' },
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.mesh || objRef.value?.light) {
      const object = objRef.value.mesh || objRef.value.light
      const material = objRef.value?.mesh?.material
      sceneStore.registerSceneObject({
        id: `geo-${index}`,
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
