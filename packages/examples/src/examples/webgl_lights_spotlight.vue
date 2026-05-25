<template>
  <TCanvas antialias :shadowMapEnabled="true" shadowMapType="PCFSoftShadowMap" background="#222222">
    <TScene>
      <TPerspectiveCamera :position="[15, 20, 25]" :fov="45" />
      <TOrbitControls enableDamping :minDistance="10" :maxDistance="60" />

      <TAmbientLight :intensity="0.5" color="#404040" />
      <TSpotLight :color="0xffffff" :intensity="500" :position="lightPosition" :angle="Math.PI / 6" :penumbra="0.5"
        :decay="2" :distance="100" :castShadow="true" />

      <TMesh :position="[0, 0, 0]" :rotation="[-Math.PI / 2, 0, 0]">
        <TPlane :args="[50, 50]" />
        <TMeshStandardMaterial color="#555555" :roughness="0.8" :metalness="0.2" />
      </TMesh>

      <TMesh v-for="(mesh, index) in objects" :key="index" :position="mesh.position">
        <TSphere :args="[1.5, 32, 32]" />
        <TMeshStandardMaterial :color="mesh.color" :roughness="0.4" :metalness="0.3" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TSpotLight,
  TMesh,
  TSphere,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const lightPosition = ref([10, 25, 10])

const objects = [
  { position: [-8, 1.5, -5], color: 0xff4444 },
  { position: [-2, 2, -3], color: 0x44ff44 },
  { position: [5, 2, -4], color: 0x4444ff },
  { position: [0, 2.5, 4], color: 0xffff44 }
]

const time = ref(0)

onMounted(() => {
  function animate() {
    time.value += 0.001
    lightPosition.value = [
      Math.sin(time.value * 0.5) * 15,
      25,
      Math.cos(time.value * 0.5) * 15
    ]
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<style scoped></style>
