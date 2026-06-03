<template>
  <TCanvas :camera="null" @animate="onAnimate">
    <TScene ref="scene">
      <TPerspectiveCamera
        v-if="!isCameraPerspective"
        ref="cameraPerspective"
        :aspect="0.5"
        :position="[0, 0, 2500]"
        :fov="fov"
        :near="150"
        :far="10000"
        :rotation="[0, Math.PI, 0]"
      />
      <TOrthographicCamera v-else :fov="50" :near="150" :far="1000" />
      <TMesh :position="meshPosition">
        <TSphere :args="[100, 16, 8]" />
        <TMeshBasicMaterial color="#ffffff" wireframe />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrthographicCamera,
  TMesh,
  TSphere,
  TMeshBasicMaterial
} from '@vue-three/vue-three'
const cameraPerspective = ref<TPerspectiveCamera>()
const scene = ref<TScene>()
const fov = ref(50)
const meshPosition = ref([0, 0, 0])
const onAnimate = () => {
  const r = Date.now() * 0.0005
  meshPosition.value = [700 * Math.cos(r), 700 * Math.sin(r), 700 * Math.sin(r)]
}

const isCameraPerspective = ref(true)
const onKeyDown = event => {
  switch (event.keyCode) {
    case 79: // o
      isCameraPerspective.value = false
      break
    case 80: // p
      isCameraPerspective.value = true
      break
  }
}

onMounted(() => {
  // scene.value.add(new THREE.CameraHelper(cameraPerspective.value.camera))
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped lang="scss"></style>
