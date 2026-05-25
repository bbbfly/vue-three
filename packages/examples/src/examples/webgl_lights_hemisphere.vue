<template>
  <TCanvas antialias toneMapping="ACESFilmicToneMapping" :toneMappingExposure="0.8">
    <TScene>
      <TPerspectiveCamera :position="[0, 15, 30]" :fov="45" />
      <TOrbitControls enableDamping :minDistance="10" :maxDistance="50" />

      <THemisphereLight skyColor="#ffffff" groundColor="#444444" :intensity="1.5" :position="[0, 20, 0]" />
      <TDirectionalLight :intensity="0.8" :position="[5, 10, 7.5]" />

      <TMesh :position="[0, 0, 0]" :rotation="[-Math.PI / 2, 0, 0]">
        <TPlane :args="[50, 50]" />
        <TMeshStandardMaterial color="#a0adaf" :roughness="0.8" :metalness="0.2" />
      </TMesh>

      <TMesh :position="[0, 6, 0]" :rotation="rotation">
        <TSphere :args="[5, 64, 64]" />
        <TMeshStandardMaterial :roughness="0.5" :metalness="0.1" />
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
  THemisphereLight,
  TDirectionalLight,
  TMesh,
  TSphere,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const rotation = ref([0, 0, 0])

onMounted(() => {
  function animate() {
    rotation.value[1] += 0.005
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<style scoped></style>
