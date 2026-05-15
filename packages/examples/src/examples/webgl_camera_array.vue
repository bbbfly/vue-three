<template>
  <TCanvas ref="canvasRef" :camera="null" @animate="onAnimate">
    <TScene ref="scene">
      <TAmbientLight color="#999999" />
      <TDirectionalLight :color="'#ffffff'" :intensity="3" :position="[0.5, 0.5, 1]" :castShadow="true">
      </TDirectionalLight>
      <TMesh :position="[0, 0, -1]" :receiveShadow="true">
        <TPlane :args="[100, 100]" />
        <TMeshPhongMaterial color="#000066" />
      </TMesh>
      <TMesh ref="mesh" :castShadow="true" :receiveShadow="true">
        <TCylinder :args="[0.5, 0.5, 1, 32]" />
        <TMeshPhongMaterial color="#ff0000" />
      </TMesh>
      <TArrayCamera ref="arrayCamera" :position="[0, 0, 3]" :subCameras="subCameras" />
    </TScene>
  </TCanvas>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { ref, onMounted, nextTick } from 'vue'
import {
  TCanvas,
  TScene,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TPlane,
  TMeshPhongMaterial,
  TCylinder,
  TArrayCamera,
} from '@vue-three/vue-three'
const canvasRef = ref<TCanvas>()
const AMOUNT = 6
const mesh = ref<TMesh>()

const subCameras = ref<THREE.PerspectiveCamera[]>([])

const onAnimate = () => {
  if (mesh.value) {
    const meshObj = mesh.value.mesh
    meshObj.rotation.x += 0.005
    meshObj.rotation.z += 0.01
  }
}

onMounted(async () => {
  await nextTick()
  const { width, height } = canvasRef.value.context.canvas.getBoundingClientRect()
  const w = (width / AMOUNT) * window.devicePixelRatio
  const h = (height / AMOUNT) * window.devicePixelRatio
  const subCameraList: any[] = []
  for (let y = 0; y < AMOUNT; y++) {
    for (let x = 0; x < AMOUNT; x++) {
      subCameraList.push({
        fov: 40,
        near: 0.1,
        far: 10,
        multiplyScalar: 2,
        position: [(x / AMOUNT - 0.5), (0.5 - y / AMOUNT), 3],
        viewport: { x: Math.floor(x * w), y: Math.floor(y * h), width: Math.floor(w), height: Math.floor(h) }
      })
    }
  }
  subCameras.value = subCameraList
})
</script>

<style scoped lang='scss'></style>
