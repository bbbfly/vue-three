<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#0f0f1a">
          <TPerspectiveCamera :position="[8, 6, 8]" :fov="60" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />

          <TAmbientLight ref="ambientLightRef" :intensity="0.1" />

          <TDirectionalLight
            ref="directionalLightRef"
            :position="[5, 8, 5]"
            :intensity="0.8"
            color="#ffffff"
            :cast-shadow="true"
          />

          <TPointLight
            ref="pointLightRedRef"
            :position="[-3, 3, 0]"
            color="#ff6b6b"
            :intensity="150"
            :distance="10"
          />
          <TPointLight
            ref="pointLightCyanRef"
            :position="[3, 3, 0]"
            color="#4ecdc4"
            :intensity="150"
            :distance="10"
          />
          <TPointLight
            ref="pointLightYellowRef"
            :position="[0, 3, 3]"
            :intensity="150"
            color="#ffe66d"
            :distance="10"
          />

          <TSpotLight
            ref="spotLightRef"
            :position="[0, 5, 0]"
            color="#00ff88"
            :intensity="200"
            :angle="Math.PI / 6"
            :penumbra="0.5"
            :distance="20"
            :decay="1"
            :cast-shadow="true"
          />

          <TMesh
            v-for="x in 3"
            :key="'sphere-' + x"
            ref="sphereRefs[x - 1]"
            :position="[x * 2 - 2, 1, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TSphere :args="[0.7, 32, 32] as [number, number, number]" />
            <TMeshStandardMaterial color="#fff" :metalness="0.5" :roughness="0.3" />
          </TMesh>

          <TMesh
            ref="groundMeshRef"
            :position="[0, -0.01, 0]"
            :rotation="[-Math.PI / 2, 0, 0]"
            :receive-shadow="true"
          >
            <TPlane :args="[15, 15] as [number, number]" />
            <TMeshStandardMaterial color="#1a1a2e" />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'
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
  TPointLight,
  TSpotLight,
  TMesh,
  TSphere,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)
const pointLightRedRef = shallowRef<any>(null)
const pointLightCyanRef = shallowRef<any>(null)
const pointLightYellowRef = shallowRef<any>(null)
const spotLightRef = shallowRef<any>(null)
const sphereRefs = shallowRef<any[]>([null, null, null])
const groundMeshRef = shallowRef<any>(null)

function registerSceneObjects() {
  const objects = [
    { ref: sphereRefs.value[0], name: '金属球1', type: 'Mesh' },
    { ref: sphereRefs.value[1], name: '金属球2', type: 'Mesh' },
    { ref: sphereRefs.value[2], name: '金属球3', type: 'Mesh' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' },
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' },
    { ref: pointLightRedRef, name: '红光点光源', type: 'PointLight' },
    { ref: pointLightCyanRef, name: '青光点光源', type: 'PointLight' },
    { ref: pointLightYellowRef, name: '黄光点光源', type: 'PointLight' },
    { ref: spotLightRef, name: '聚光灯', type: 'SpotLight' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef?.value?.mesh || objRef?.value?.light) {
      const object = objRef.value.mesh || objRef.value.light
      const material = objRef?.value?.mesh?.material
      sceneStore.registerSceneObject({
        id: `light-${index}`,
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
