<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[5, 5, 5]" :fov="60" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
          <TAmbientLight ref="ambientLightRef" :intensity="0.5" />
          <TDirectionalLight
            ref="directionalLightRef"
            :position="[5, 5, 5]"
            :intensity="1"
            :cast-shadow="true"
          />

          <TMesh
            ref="cubeMeshRef"
            :position="[0, 0.5, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TBox :args="[1, 1, 1]" />
            <TMeshStandardMaterial color="#42b883" :metalness="0.2" :roughness="0.8" />
          </TMesh>

          <TMesh
            ref="groundMeshRef"
            :position="[0, -0.5, 0]"
            :rotation="[-Math.PI / 2, 0, 0]"
            :receive-shadow="true"
          >
            <TPlane :args="[10, 10]" />
            <TMeshStandardMaterial color="#333" />
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
  TBox,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)
const cubeMeshRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)

function registerSceneObjects() {
  const objects = [
    { ref: cubeMeshRef, name: '立方体', type: 'Mesh' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' },
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.mesh || objRef.value?.light) {
      const object = objRef.value.mesh || objRef.value.light
      const material = objRef.value?.mesh?.material
      sceneStore.registerSceneObject({
        id: `canvas-${index}`,
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
