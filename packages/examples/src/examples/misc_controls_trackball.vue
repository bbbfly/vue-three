<template>
  <TCanvas antialias clearColor="#cccccc">
    <TScene ref="sceneRef" :fog="fogConfig" background="#cccccc">
      <TPerspectiveCamera ref="perspectiveCameraRef" :position="[0, 0, 500]" :fov="60" :near="1" :far="1000" />
      <TOrthographicCamera ref="orthographicCameraRef" :position="[0, 0, 500]" :left="orthoLeft" :right="orthoRight"
        :top="orthoTop" :bottom="orthoBottom" :near="1" :far="1000" />
      <TTrackballControls :rotateSpeed="1.0" :zoomSpeed="1.2" :panSpeed="0.8" />

      <TDirectionalLight :color="0xffffff" :intensity="3" :position="[1, 1, 1]" />
      <TDirectionalLight :color="0x002288" :intensity="3" :position="[-1, -1, -1]" />
      <TAmbientLight :color="0x555555" />

      <template v-for="item in 500" :key="item">
        <TMesh :position="[(Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000]">
          <TConeGeometry :args="[10, 30, 4, 1]" />
          <TMeshPhongMaterial color="#ffffff" flat-shading />
        </TMesh>
      </template>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrthographicCamera,
  TTrackballControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TConeGeometry,
  TMeshPhongMaterial
} from '@vue-three/vue-three'

const frustumSize = 400
const aspect = ref(window.innerWidth / window.innerHeight)

const orthoLeft = computed(() => -frustumSize * aspect.value / 2)
const orthoRight = computed(() => frustumSize * aspect.value / 2)
const orthoTop = computed(() => frustumSize / 2)
const orthoBottom = computed(() => -frustumSize / 2)

const fogConfig = {
  type: 'exp',
  color: 0xcccccc,
  density: 0.002
}

</script>

<style scoped></style>