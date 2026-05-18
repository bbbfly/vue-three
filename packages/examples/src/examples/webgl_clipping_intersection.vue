<template>
  <TCanvas ref="canvasRef" antialias :localClippingEnabled="true" @animate="onAnimate">
    <TScene>
      <TPerspectiveCamera :position="[-1.5, 2.5, 3.0]" :fov="40" :near="1" :far="200" />

      <THemisphereLight :color="0xffffff" :groundColor="0x080808" :intensity="4.5" :position="[-1.25, 1, 1.25]" />

      <TGroup>
        <TMesh v-for="(sphere, index) in spheres" :key="index" :position="sphere.position">
          <TSphere :args="[sphere.radius, 48, 24]" />
          <TMeshPhongMaterial :color="sphere.color" :side="THREE.DoubleSide" :clippingPlanes="clipPlanes"
            :clipIntersection="clipIntersection" :alphaToCoverage="alphaToCoverage" />
        </TMesh>
      </TGroup>

      <TGroup :visible="showHelpers">
        <TPlaneHelper :plane="clipPlanes[0]" :size="2" :color="0xff0000" />
        <TPlaneHelper :plane="clipPlanes[1]" :size="2" :color="0x00ff00" />
        <TPlaneHelper :plane="clipPlanes[2]" :size="2" :color="0x0000ff" />
      </TGroup>
    </TScene>

    <TOrbitControls :minDistance="1" :maxDistance="10" :enablePan="false" />
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  THemisphereLight,
  TMesh,
  TSphere,
  TMeshPhongMaterial,
  TPlaneHelper,
  TGroup,
  TOrbitControls
} from '@vue-three/vue-three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const canvasRef = ref()

const clipPlanes = reactive([
  new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
])

const clipIntersection = ref(true)
const planeConstant = ref(0)
const showHelpers = ref(true)
const alphaToCoverage = ref(true)

const spheres = ref<{ radius: number; color: number; position: [number, number, number] }[]>([])

function initSpheres() {
  const result: { radius: number; color: number; position: [number, number, number] }[] = []
  for (let i = 1; i <= 30; i += 2) {
    result.push({
      radius: i / 30,
      color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5, THREE.SRGBColorSpace).getHex(),
      position: [0, 0, 0]
    })
  }
  spheres.value = result
}

function onAnimate() {
}

let gui: GUI | null = null

onMounted(() => {
  initSpheres()

  gui = new GUI()

  gui.add({ alphaToCoverage: alphaToCoverage.value }, 'alphaToCoverage').onChange((value: boolean) => {
    alphaToCoverage.value = value
  })

  gui.add({ clipIntersection: clipIntersection.value }, 'clipIntersection').name('clip intersection').onChange((value: boolean) => {
    clipIntersection.value = value
  })

  gui.add({ planeConstant: planeConstant.value }, 'planeConstant', -1, 1).step(0.01).name('plane constant').onChange((value: number) => {
    planeConstant.value = value
    for (let j = 0; j < clipPlanes.length; j++) {
      clipPlanes[j].constant = value
    }
  })

  gui.add({ showHelpers: showHelpers.value }, 'showHelpers').name('show helpers').onChange((value: boolean) => {
    showHelpers.value = value
  })

  window.addEventListener('resize', onWindowResize)
})

function onWindowResize() {
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.context
    const camera = ctx.camera as THREE.PerspectiveCamera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }
}

onUnmounted(() => {
  if (gui !== null) {
    gui.destroy()
  }
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped></style>