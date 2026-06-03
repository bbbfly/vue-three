<template>
  <TCanvas antialias>
    <TScene :background="backgroundTexture">
      <TPerspectiveCamera :fov="50" :near="0.1" :far="100" :position="[0, 0, 13]" />
      <TOrbitControls
        :enable-zoom="false"
        :enable-pan="false"
        :min-polar-angle="Math.PI / 4"
        :max-polar-angle="Math.PI / 1.5"
      />

      <TAmbientLight :intensity="3" />
      <TPointLight :intensity="200" />

      <TMesh
        v-for="(config, index) in headConfigs"
        :key="'head-' + index"
        :position="config.position"
        :scale="[0.1, 0.1, 0.1]"
      >
        <TOBJLoader :src="config.url" />
        <TMeshLambertMaterial
          :color="config.color"
          :refraction-ratio="config.refractionRatio"
          :combine="config.combine"
          :reflectivity="config.reflectivity"
        >
          <TCubeTexture :urls="cubeUrls" :mapping="index === 1 ? 'refraction' : 'reflection'" />
        </TMeshLambertMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TPointLight,
  TMesh,
  TOBJLoader,
  TMeshLambertMaterial,
  TCubeTexture
} from '@vue-three/vue-three'

interface HeadConfig {
  url: string
  position: [number, number, number]
  color: number
  refractionRatio?: number
  combine?: THREE.Blending
  reflectivity?: number
}

const cubeUrls = [
  '/textures/cube/SwedishRoyalCastle/px.jpg',
  '/textures/cube/SwedishRoyalCastle/nx.jpg',
  '/textures/cube/SwedishRoyalCastle/py.jpg',
  '/textures/cube/SwedishRoyalCastle/ny.jpg',
  '/textures/cube/SwedishRoyalCastle/pz.jpg',
  '/textures/cube/SwedishRoyalCastle/nz.jpg'
]

const headConfigs = ref<HeadConfig[]>([
  {
    url: '/models/obj/walt/WaltHead.obj',
    position: [0, -3, 0],
    color: 0xffffff
  },
  {
    url: '/models/obj/walt/WaltHead.obj',
    position: [-6, -3, 0],
    color: 0xfff700,
    refractionRatio: 0.95
  },
  {
    url: '/models/obj/walt/WaltHead.obj',
    position: [6, -3, 0],
    color: 0xffaa00,
    combine: THREE.MixOperation,
    reflectivity: 0.3
  }
])

const backgroundTexture = ref<THREE.CubeTexture | null>(null)

onMounted(() => {
  const loader = new THREE.CubeTextureLoader()
  backgroundTexture.value = loader.load(cubeUrls)
})
</script>
