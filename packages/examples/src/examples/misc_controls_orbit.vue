<template>
  <TCanvas antialias clearColor="#cccccc">
    <TScene ref="sceneRef" :fog="fogConfig" background="#cccccc">
      <TPerspectiveCamera :position="[400, 200, 0]" :fov="60" :near="1" :far="1000" />
      <TOrbitControls :enableDamping="true" :dampingFactor="0.05" :screenSpacePanning="false" :minDistance="100"
        :maxDistance="500" :maxPolarAngle="Math.PI / 2" cursorStyle="grab" />

      <TDirectionalLight :color="0xffffff" :intensity="3" :position="[1, 1, 1]" />
      <TDirectionalLight :color="0x002288" :intensity="3" :position="[-1, -1, -1]" />
      <TAmbientLight :color="0x555555" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight
} from '@vue-three/vue-three'

const sceneRef = ref()

const fogConfig = {
  type: 'exp',
  color: 0xcccccc,
  density: 0.002
}

onMounted(() => {
  const geometry = new THREE.ConeGeometry(10, 30, 4, 1)
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true })

  const mesh = new THREE.InstancedMesh(geometry, material, 500)
  const dummy = new THREE.Object3D()

  for (let i = 0; i < 500; i++) {
    dummy.position.x = Math.random() * 1600 - 800
    dummy.position.y = 0
    dummy.position.z = Math.random() * 1600 - 800
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
  }

  if (sceneRef.value && sceneRef.value.scene) {
    sceneRef.value.scene.add(mesh)
  }
})
</script>

<style scoped></style>
