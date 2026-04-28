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
          <TAmbientLight ref="ambientLightRef" :intensity="0.3" />
          <TDirectionalLight
            ref="directionalLightRef"
            :position="[5, 8, 5]"
            :intensity="1.2"
            :cast-shadow="true"
          />
          <TPointLight
            ref="pointLightRef"
            :position="[-5, 5, -5]"
            color="#ff6b6b"
            :intensity="0.8"
          />

          <TMesh
            ref="basicMeshRef"
            :position="[-4.5, 1, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TSphere :args="[0.9, 32, 32] as [number, number, number]" />
            <TMeshBasicMaterial color="#e74c3c" />
          </TMesh>

          <TMesh
            ref="lambertMeshRef"
            :position="[-1.5, 1, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TSphere :args="[0.9, 32, 32] as [number, number, number]" />
            <TMeshLambertMaterial color="#f39c12" />
          </TMesh>

          <TMesh
            ref="phongMeshRef"
            :position="[1.5, 1, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TSphere :args="[0.9, 32, 32] as [number, number, number]" />
            <TMeshPhongMaterial color="#9b59b6" :shininess="100" />
          </TMesh>

          <TMesh
            ref="standardMeshRef"
            :position="[4.5, 1, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TSphere :args="[0.9, 32, 32] as [number, number, number]" />
            <TMeshStandardMaterial color="#3498db" :metalness="0.8" :roughness="0.2" />
          </TMesh>

          <TMesh
            ref="textureMeshRef"
            :position="[0, 1, 3]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TBox :args="[1.8, 1.8, 1.8] as [number, number, number]" />
            <TMeshStandardMaterial color="#ffffff" :metalness="0.1" :roughness="0.5">
              <TTexture :repeat="[2, 2]" />
            </TMeshStandardMaterial>
          </TMesh>

          <TMesh
            ref="groundMeshRef"
            :position="[0, -0.01, 0]"
            :rotation="[-Math.PI / 2, 0, 0]"
            :receive-shadow="true"
          >
            <TPlane :args="[20, 15] as [number, number]" />
            <TMeshStandardMaterial color="#2c3e50" />
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
  TMesh,
  TSphere,
  TBox,
  TPlane,
  TMeshBasicMaterial,
  TMeshLambertMaterial,
  TMeshPhongMaterial,
  TMeshStandardMaterial,
  TTexture
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)
const pointLightRef = shallowRef<any>(null)
const basicMeshRef = shallowRef<any>(null)
const lambertMeshRef = shallowRef<any>(null)
const phongMeshRef = shallowRef<any>(null)
const standardMeshRef = shallowRef<any>(null)
const textureMeshRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)

function registerSceneObjects() {
  const objects = [
    { ref: basicMeshRef, name: 'Basic材质球', type: 'Mesh' },
    { ref: lambertMeshRef, name: 'Lambert材质球', type: 'Mesh' },
    { ref: phongMeshRef, name: 'Phong材质球', type: 'Mesh' },
    { ref: standardMeshRef, name: 'Standard材质球', type: 'Mesh' },
    { ref: textureMeshRef, name: '纹理立方体', type: 'Mesh' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' },
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' },
    { ref: pointLightRef, name: '点光源', type: 'PointLight' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.mesh || objRef.value?.light) {
      const object = objRef.value.mesh || objRef.value.light
      const material = objRef.value?.mesh?.material
      sceneStore.registerSceneObject({
        id: `mat-${index}`,
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
