<template>


  <TCanvas :clear-color="'#f0f0f0'">
    <TScene>
      <TOrthographicCamera ref="cameraRef" :left="left" :right="right" :top="top" :bottom="bottom" :near="1" :far="1000"
        :position="[-200, 200, 200]" />

      <!-- WebGL Scene - wireframe planes -->
      <TMesh v-for="(plane, index) in webglPlanes" :position="plane.position" :rotation="plane.rotation"
        :key="'webgl-' + index">
        <TPlane :args="[plane.width, plane.height]" />
        <TMeshBasicMaterial :color="0x000000" :wireframe="true" :side="THREE.DoubleSide" />
      </TMesh>
    </TScene>

    <TCSS3DRenderer>
      <TCSS3DObject v-for="(plane, index) in css3dPlanes" :key="'css3d-' + index" :position="plane.position"
        :rotation="plane.rotation"
        :style="{ width: plane.width + 'px', height: plane.height + 'px', backgroundColor: plane.color, opacity: 0.7 }">
      </TCSS3DObject>
    </TCSS3DRenderer>

  </TCanvas>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TOrthographicCamera,
  TMesh,
  TPlane,
  TMeshBasicMaterial,
  TCSS3DRenderer,
  TCSS3DObject
} from '@vue-three/vue-three'

const cameraRef = ref<any>(null)

const frustumSize = 500

const left = computed(() => -frustumSize / 2)
const right = computed(() => frustumSize / 2)
const top = computed(() => frustumSize / 2)
const bottom = computed(() => -frustumSize / 2)

interface PlaneConfig {
  width: number
  height: number
  color: string
  position: THREE.Vector3
  rotation: THREE.Euler
}

const css3dPlanes = ref<PlaneConfig[]>([])
const webglPlanes = ref<PlaneConfig[]>([])

const createPlane = (
  width: number,
  height: number,
  cssColor: string,
  pos: THREE.Vector3,
  rot: THREE.Euler
) => {
  const plane: PlaneConfig = {
    width,
    height,
    color: cssColor,
    position: pos,
    rotation: rot
  }

  css3dPlanes.value.push(plane)
  webglPlanes.value.push(plane)
}

onMounted(() => {
  createPlane(
    100,
    100,
    'chocolate',
    new THREE.Vector3(-50, 0, 0),
    new THREE.Euler(0, -90 * THREE.MathUtils.DEG2RAD, 0)
  )

  createPlane(
    100,
    100,
    'saddlebrown',
    new THREE.Vector3(0, 0, 50),
    new THREE.Euler(0, 0, 0)
  )

  createPlane(
    100,
    100,
    'yellowgreen',
    new THREE.Vector3(0, 50, 0),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0)
  )

  createPlane(
    300,
    300,
    'seagreen',
    new THREE.Vector3(0, -50, 0),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0)
  )
})

onUnmounted(() => { })
</script>

<style scoped>
.css3d-orthographic-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #f0f0f0;
}

#info {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #000000;
  z-index: 100;
  pointer-events: none;
}

#info a {
  color: #f00;
}

.css3d-plane {
  position: absolute;
  transform-style: preserve-3d;
}
</style>
