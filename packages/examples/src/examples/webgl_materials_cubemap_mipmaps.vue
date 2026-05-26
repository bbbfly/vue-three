<template>
  <TCanvas antialias>
    <TScene>
      <TPerspectiveCamera :fov="50" :near="0.1" :far="10000" :position="[0, 0, 500]" />
      <TOrbitControls :min-polar-angle="Math.PI / 4" :max-polar-angle="Math.PI / 1.5" />

      <TMesh v-if="manualTexture" :position="[100, 0, 0]">
        <TSphere :args="[100, 128, 128]" />
        <TMeshBasicMaterial :color="0xffffff" :env-map="manualTexture" />
      </TMesh>

      <TMesh :position="[-100, 0, 0]">
        <TSphere :args="[100, 128, 128]" />
        <TMeshBasicMaterial :color="0xffffff">
          <TCubeTexture :urls="baseUrls" />
        </TMeshBasicMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { shallowRef, onMounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TSphere,
  TMeshBasicMaterial,
  TCubeTexture
} from '@vue-three/vue-three'

const path = '/textures/cube/angus/'
const format = '.jpg'
const maxLevel = 8

const baseUrls = [
  `${path}cube_m00_c00${format}`,
  `${path}cube_m00_c01${format}`,
  `${path}cube_m00_c02${format}`,
  `${path}cube_m00_c03${format}`,
  `${path}cube_m00_c04${format}`,
  `${path}cube_m00_c05${format}`
]

const manualTexture = shallowRef<THREE.CubeTexture | null>(null)

function loadCubeTexture(urls: string[]): Promise<THREE.CubeTexture> {
  return new Promise(resolve => {
    new THREE.CubeTextureLoader().load(urls, cubeTexture => {
      resolve(cubeTexture)
    })
  })
}

async function loadCubeTextureWithMipmaps() {
  const mipmaps: THREE.CubeTexture[] = []
  const pendings: Promise<THREE.CubeTexture>[] = []

  for (let level = 0; level <= maxLevel; ++level) {
    const urls: string[] = []
    for (let face = 0; face < 6; ++face) {
      urls.push(path + 'cube_m0' + level + '_c0' + face + format)
    }
    pendings.push(loadCubeTexture(urls))
  }

  const results = await Promise.all(pendings)
  results.forEach(cubeTexture => {
    mipmaps.push(cubeTexture)
  })

  const customizedCubeTexture = mipmaps.shift()!
  customizedCubeTexture.mipmaps = mipmaps
  customizedCubeTexture.colorSpace = THREE.SRGBColorSpace
  customizedCubeTexture.minFilter = THREE.LinearMipMapLinearFilter
  customizedCubeTexture.magFilter = THREE.LinearFilter
  customizedCubeTexture.generateMipmaps = false
  customizedCubeTexture.needsUpdate = true

  return customizedCubeTexture
}

onMounted(async () => {
  manualTexture.value = await loadCubeTextureWithMipmaps()
})
</script>
