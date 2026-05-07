<template>
  <TCanvas antialias background="#e0e0e0">
    <TScene :rotation="rotation">
      <TPerspectiveCamera :position="[0, 12, 28]" :fov="45" />
      <TOrbitControls enableDamping :minDistance="10" :maxDistance="80" />

      <TAmbientLight :intensity="0.4" />
      <TDirectionalLight :intensity="1" :position="[10, 20, 10]" />

      <TMesh :position="[-9, 0, 0]">
        <TSphere :args="[1.5, 32, 32]" />
        <TMeshBasicMaterial color="#3366ff" />
      </TMesh>

      <TMesh :position="[-3, 0, 0]">
        <TSphere :args="[1.5, 32, 32]" />
        <TMeshLambertMaterial color="#3366ff" />
      </TMesh>

      <TMesh :position="[3, 0, 0]">
        <TSphere :args="[1.5, 32, 32]" />
        <TMeshPhongMaterial color="#3366ff" :shininess="100" />
      </TMesh>

      <TMesh :position="[9, 0, 0]">
        <TSphere :args="[1.5, 32, 32]" />
        <TMeshStandardMaterial color="#3366ff" :roughness="0.3" :metalness="0.3" />
      </TMesh>

      <TMesh :position="[-6, 0, -8]">
        <TSphere :args="[1.5, 32, 32]" />
        <TMeshStandardMaterial color="#ff4444" :roughness="0.1" :metalness="0.8" />
      </TMesh>

      <TMesh :position="[0, 0, -8]">
        <TSphere :args="[1.5, 32, 32]" />
        <TMeshPhysicalMaterial color="#44ff44" :roughness="0" :metalness="0" :clearcoat="1" />
      </TMesh>

      <TMesh :position="[6, 0, -8]">
        <TSphere :args="[1.5, 32, 32]" />
        <TMeshPhysicalMaterial color="#ffaa00" :roughness="0.2" :metalness="0.5" :clearcoat="0.5" />
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
  TDirectionalLight,
  TMesh,
  TSphere,
  TMeshBasicMaterial,
  TMeshLambertMaterial,
  TMeshPhongMaterial,
  TMeshStandardMaterial,
  TMeshPhysicalMaterial
} from '@vue-three/core'

const rotation = ref([0, 0, 0])

onMounted(() => {
  function animate() {
    rotation.value[1] += 0.002
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<style scoped></style>
