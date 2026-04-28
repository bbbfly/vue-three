<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[10, 7, 10]" :fov="60" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
          <TAmbientLight ref="ambientLightRef" :intensity="0.4" />
          <TDirectionalLight ref="directionalLightRef" :position="[8, 12, 8]" :intensity="1.5" :cast-shadow="true" />

          <TMesh ref="basicTextureRef" :position="[-4, 1.2, 2]" :cast-shadow="true" :receive-shadow="true">
            <TBox :args="[2, 2, 2] as [number, number, number]" />
            <TMeshStandardMaterial :metalness="0.1" :roughness="0.5">
              <TTexture :repeat="[1, 1]" :url="roughTextureUrl" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="repeatTextureRef" :position="[0, 1.2, 2]" :cast-shadow="true" :receive-shadow="true">
            <TBox :args="[2, 2, 2] as [number, number, number]" />
            <TMeshStandardMaterial color="#22c55e" :metalness="0.1" :roughness="0.5">
              <TTexture :repeat="[3, 3]" :url="roughTextureUrl" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="offsetTextureRef" :position="[4, 1.2, 2]" :cast-shadow="true" :receive-shadow="true">
            <TBox :args="[2, 2, 2] as [number, number, number]" />
            <TMeshStandardMaterial :metalness="0.1" :roughness="0.5">
              <TTexture :repeat="[2, 2]" :offset="[-0.5, -0.5]" :url="roughTextureUrl" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="rotatedTextureRef" :position="[-4, 1.2, -2]" :cast-shadow="true" :receive-shadow="true">
            <TBox :args="[2, 2, 2] as [number, number, number]" />
            <TMeshStandardMaterial :metalness="0.1" :roughness="0.5">
              <TTexture :repeat="[1, 1]" :rotation="Math.PI / 4" :url="roughTextureUrl" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="sphereTextureRef" :position="[0, 1.2, -2]" :cast-shadow="true" :receive-shadow="true">
            <TSphere :args="[1.2, 64, 64] as [number, number, number]" />
            <TMeshStandardMaterial :metalness="0.3" :roughness="0.3">
              <TTexture :repeat="[1, 1]" :url="roughTextureUrl" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="metalRoughRef" :position="[4, 1.2, -2]" :cast-shadow="true" :receive-shadow="true">
            <TTorus :args="[0.9, 0.4, 32, 64] as [number, number, number, number]" />
            <TMeshStandardMaterial :metalness="0.9" :roughness="0.1">
              <TTexture />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="cylinderTextureRef" :position="[-4, 1.2, -5]" :cast-shadow="true" :receive-shadow="true">
            <TCylinder :args="[0.8, 0.8, 2.5, 32] as [number, number, number, number]" />
            <TMeshStandardMaterial :metalness="0.2" :roughness="0.6">
              <TTexture :repeat="[1, 3]" :offset="[-0.5, -1]" :url="roughTextureUrl" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="coneTextureRef" :position="[0, 1.2, -5]" :cast-shadow="true" :receive-shadow="true">
            <TCone :args="[1, 2.2, 32] as [number, number, number]" />
            <TMeshStandardMaterial :metalness="0.1" :roughness="0.7">
              <TTexture :repeat="[2, 1]" :url="roughTextureUrl" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="planeTextureRef" :position="[4, 1, -5]" :rotation="[-Math.PI / 2, 0, 0]" :receive-shadow="true">
            <TPlane :args="[2.5, 2.5] as [number, number]" />
            <TMeshStandardMaterial :side="2" :metalness="0.1" :roughness="0.5">
              <TTexture :repeat="[2, 2]" :offset="[-0.5, -0.5]" :url="waterTextureUrl1" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh ref="groundMeshRef" :position="[0, -0.01, 0]" :rotation="[-Math.PI / 2, 0, 0]" :receive-shadow="true">
            <TPlane :args="[30, 20] as [number, number]" />
            <TMeshStandardMaterial>
              <TTexture :repeat="[1, 1]" :url="waterTextureUrl2" />
            </TMeshStandardMaterial>
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
  TMesh,
  TSphere,
  TBox,
  TPlane,
  TCylinder,
  TCone,
  TTorus,
  TMeshStandardMaterial,
  TTexture
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)
const basicTextureRef = shallowRef<any>(null)
const repeatTextureRef = shallowRef<any>(null)
const offsetTextureRef = shallowRef<any>(null)
const rotatedTextureRef = shallowRef<any>(null)
const sphereTextureRef = shallowRef<any>(null)
const metalRoughRef = shallowRef<any>(null)
const cylinderTextureRef = shallowRef<any>(null)
const coneTextureRef = shallowRef<any>(null)
const planeTextureRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)

const waterTextureUrl1 = 'https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg'
const waterTextureUrl2 = 'https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg'
const roughTextureUrl = 'https://threejs.org/examples/textures/roughness_map.jpg'

function registerSceneObjects() {
  const objects = [
    { ref: basicTextureRef, name: '基础纹理立方体', type: 'Mesh' },
    { ref: repeatTextureRef, name: '纹理重复立方体', type: 'Mesh' },
    { ref: offsetTextureRef, name: '纹理偏移立方体', type: 'Mesh' },
    { ref: rotatedTextureRef, name: '纹理旋转立方体', type: 'Mesh' },
    { ref: sphereTextureRef, name: '纹理球体', type: 'Mesh' },
    { ref: metalRoughRef, name: '金属质感圆环', type: 'Mesh' },
    { ref: cylinderTextureRef, name: '纹理圆柱体', type: 'Mesh' },
    { ref: coneTextureRef, name: '纹理圆锥体', type: 'Mesh' },
    { ref: planeTextureRef, name: '纹理平面', type: 'Mesh' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' },
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.mesh || objRef.value?.light) {
      const object = objRef.value.mesh || objRef.value.light
      const material = objRef.value?.mesh?.material
      sceneStore.registerSceneObject({
        id: `tex-${index}`,
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
