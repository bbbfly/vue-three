<template>
  <TCanvas antialias animation-loop @animate="animate">
    <TPerspectiveCamera :fov="50" :near="0.1" :far="100" :position="[-4, 2, 4]" />
    <TOrbitControls :min-distance="1" :max-distance="20" />

    <THemisphereLight
      ref="hemiLightRef"
      :color="0xddeeff"
      :ground-color="0x0f0e0d"
      :intensity="0.02"
    />

    <TPointLight
      ref="bulbLightRef"
      :color="0xffee88"
      :intensity="1"
      :distance="100"
      :decay="2"
      :position="[0, 2, 0]"
      :cast-shadow="params.shadows"
    >
      <TMesh>
        <TSphere :args="[0.02, 16, 8]" />
        <TMeshStandardMaterial
          ref="bulbMatRef"
          :emissive="0xffffee"
          :emissive-intensity="1"
          :color="0x000000"
        />
      </TMesh>
    </TPointLight>

    <TMesh :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
      <TPlane :args="[20, 20]" />
      <TMeshStandardMaterial
        ref="floorMatRef"
        :roughness="0.8"
        :color="0xffffff"
        :metalness="0.2"
        :bump-scale="1"
      />
    </TMesh>

    <TMesh :position="[1, 0.25, 1]" :rotation="[0, Math.PI, 0]" cast-shadow>
      <TSphere :args="[0.25, 32, 32]" />
      <TMeshStandardMaterial ref="ballMatRef" :color="0xffffff" :roughness="0.5" :metalness="1.0" />
    </TMesh>

    <TMesh :position="[-0.5, 0.25, -1]" cast-shadow>
      <TBox :args="[0.5, 0.5, 0.5]" />
      <TMeshStandardMaterial
        ref="cubeMatRef"
        :roughness="0.7"
        :color="0xffffff"
        :bump-scale="1"
        :metalness="0.2"
      />
    </TMesh>

    <TMesh :position="[0, 0.25, -5]" cast-shadow>
      <TBox :args="[0.5, 0.5, 0.5]" />
      <TMeshStandardMaterial :roughness="0.7" :color="0xffffff" :bump-scale="1" :metalness="0.2" />
    </TMesh>

    <TMesh :position="[7, 0.25, 0]" cast-shadow>
      <TBox :args="[0.5, 0.5, 0.5]" />
      <TMeshStandardMaterial :roughness="0.7" :color="0xffffff" :bump-scale="1" :metalness="0.2" />
    </TMesh>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TPerspectiveCamera,
  TOrbitControls,
  THemisphereLight,
  TPointLight,
  TMesh,
  TSphere,
  TBox,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const bulbLuminousPowers: Record<string, number> = {
  '110000 lm (1000W)': 110000,
  '3500 lm (300W)': 3500,
  '1700 lm (100W)': 1700,
  '800 lm (60W)': 800,
  '400 lm (40W)': 400,
  '180 lm (25W)': 180,
  '20 lm (4W)': 20,
  Off: 0
}

const hemiLuminousIrradiances: Record<string, number> = {
  '0.0001 lx (Moonless Night)': 0.0001,
  '0.002 lx (Night Airglow)': 0.002,
  '0.5 lx (Full Moon)': 0.5,
  '3.4 lx (City Twilight)': 3.4,
  '50 lx (Living Room)': 50,
  '100 lx (Very Overcast)': 100,
  '350 lx (Office Room)': 350,
  '400 lx (Sunrise/Sunset)': 400,
  '1000 lx (Overcast)': 1000,
  '18000 lx (Daylight)': 18000,
  '50000 lx (Direct Sun)': 50000
}

const params = {
  shadows: true,
  exposure: 0.68,
  bulbPower: Object.keys(bulbLuminousPowers)[4],
  hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
}

const bulbLightRef = ref<any>(null)
const hemiLightRef = ref<any>(null)
const bulbMatRef = ref<any>(null)
const floorMatRef = ref<any>(null)
const ballMatRef = ref<any>(null)
const cubeMatRef = ref<any>(null)

let previousShadowMap = false
let toneMappingSet = false

async function loadTextures() {
  await nextTick()
  const textureLoader = new THREE.TextureLoader()

  if (floorMatRef.value?.material) {
    const floorMat = floorMatRef.value.material as THREE.MeshStandardMaterial

    textureLoader.load('/textures/hardwood2_diffuse.jpg', function (map) {
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.anisotropy = 4
      map.repeat.set(10, 24)
      map.colorSpace = THREE.SRGBColorSpace
      floorMat.map = map
      floorMat.needsUpdate = true
    })

    textureLoader.load('/textures/hardwood2_bump.jpg', function (map) {
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.anisotropy = 4
      map.repeat.set(10, 24)
      floorMat.bumpMap = map
      floorMat.needsUpdate = true
    })

    textureLoader.load('/textures/hardwood2_roughness.jpg', function (map) {
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.anisotropy = 4
      map.repeat.set(10, 24)
      floorMat.roughnessMap = map
      floorMat.needsUpdate = true
    })
  }

  if (cubeMatRef.value?.material) {
    const cubeMat = cubeMatRef.value.material as THREE.MeshStandardMaterial

    textureLoader.load('/textures/brick_diffuse.jpg', function (map) {
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.anisotropy = 4
      map.repeat.set(1, 1)
      map.colorSpace = THREE.SRGBColorSpace
      cubeMat.map = map
      cubeMat.needsUpdate = true
    })

    textureLoader.load('/textures/brick_bump.jpg', function (map) {
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.anisotropy = 4
      map.repeat.set(1, 1)
      cubeMat.bumpMap = map
      cubeMat.needsUpdate = true
    })
  }

  if (ballMatRef.value?.material) {
    const ballMat = ballMatRef.value.material as THREE.MeshStandardMaterial

    textureLoader.load('/textures/planets/earth_atmos_2048.jpg', function (map) {
      map.anisotropy = 4
      map.colorSpace = THREE.SRGBColorSpace
      ballMat.map = map
      ballMat.needsUpdate = true
    })

    textureLoader.load('/textures/planets/earth_specular_2048.jpg', function (map) {
      map.anisotropy = 4
      map.colorSpace = THREE.SRGBColorSpace
      ballMat.metalnessMap = map
      ballMat.needsUpdate = true
    })
  }
}

function animate({ renderer }: { renderer: THREE.WebGLRenderer | null }) {
  if (renderer) {
    if (!toneMappingSet) {
      renderer.toneMapping = THREE.ReinhardToneMapping
      renderer.shadowMap.enabled = true
      toneMappingSet = true
    }

    renderer.toneMappingExposure = Math.pow(params.exposure, 5.0)
    renderer.shadowMap.enabled = params.shadows
  }

  const bulbLight = bulbLightRef.value?.light as THREE.PointLight
  const hemiLight = hemiLightRef.value?.light as THREE.HemisphereLight
  const bulbMat = bulbMatRef.value?.material as THREE.MeshStandardMaterial
  const ballMat = ballMatRef.value?.material as THREE.MeshStandardMaterial
  const cubeMat = cubeMatRef.value?.material as THREE.MeshStandardMaterial
  const floorMat = floorMatRef.value?.material as THREE.MeshStandardMaterial

  if (bulbLight) {
    bulbLight.castShadow = params.shadows
    bulbLight.power = bulbLuminousPowers[params.bulbPower]
  }

  if (bulbMat && bulbLight) {
    bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0)
  }

  if (hemiLight) {
    hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance]
  }

  if (params.shadows !== previousShadowMap) {
    if (ballMat) ballMat.needsUpdate = true
    if (cubeMat) cubeMat.needsUpdate = true
    if (floorMat) floorMat.needsUpdate = true
    previousShadowMap = params.shadows
  }

  const time = Date.now() * 0.0005
  if (bulbLight) {
    bulbLight.position.y = Math.cos(time) * 0.75 + 1.25
  }
}

onMounted(() => {
  loadTextures()
})
</script>

<style scoped></style>
