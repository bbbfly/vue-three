<template>
  <TCanvas antialias background="#f0f0f0">
    <TScene>
      <TPerspectiveCamera :position="[0, 0, 2]" :fov="70" />
      <TMesh :rotation="rotation">
        <TBox :args="[1, 1, 1]" />
        <TMeshBasicMaterial>
          <TTexture url="/textures/crate.gif" />
        </TMeshBasicMaterial>
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
  TMeshBasicMaterial,
  TMesh,
  TBox,
  TTexture
} from '@vue-three/vue-three'

const rotation = ref([0, 0, 0])

onMounted(() => {
  function animate() {
    rotation.value[0] += 0.005
    rotation.value[1] += 0.01
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<style scoped></style>
