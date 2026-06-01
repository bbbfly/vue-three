<template>
  <TCanvas ref="canvasRef" antialias :tone-mapping="toneMapping" :tone-mapping-exposure="params.exposure"
    @animate="animate">
    <TPerspectiveCamera :fov="40" :near="0.1" :far="2000" :position="[0, 0, 120]" />
    <TOrbitControls :min-distance="10" :max-distance="150" />

    <TScene v-if="envMap" :background="envMap" :environment="envMap">
      <TMesh>
        <TSphere :args="[20, 64, 32]" />
        <TMeshPhysicalMaterial :color="params.color" :transmission="params.transmission" :opacity="params.opacity"
          :metalness="params.metalness" :roughness="params.roughness" :ior="params.ior" :thickness="params.thickness"
          :specular-intensity="params.specularIntensity" :specular-color="params.specularColor"
          :env-map-intensity="params.envMapIntensity" :alpha-map="alphaMap" :side="THREE.DoubleSide"
          :transparent="true" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TPerspectiveCamera,
  TOrbitControls,
  TScene,
  TMesh,
  TSphere,
  TMeshPhysicalMaterial
} from '@vue-three/vue-three'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const toneMapping = THREE.ACESFilmicToneMapping


const envMap = ref<THREE.Texture | null>(null)
const alphaMap = ref<THREE.CanvasTexture | null>(null)
let gui: GUI | null = null

const params = reactive({
  color: 0xffffff,
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0,
  ior: 1.5,
  thickness: 0.01,
  specularIntensity: 1,
  specularColor: 0xffffff,
  envMapIntensity: 1,
  exposure: 1,
  transmissionResolutionScale: 1
})

function generateTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 2

  const context = canvas.getContext('2d')
  if (context) {
    context.fillStyle = 'white'
    context.fillRect(0, 1, 2, 1)
  }

  return canvas
}

function animate({ renderer }) {
  renderer.transmissionResolutionScale = params.transmissionResolutionScale
}

onMounted(() => {
  new UltraHDRLoader()
    .setPath('/textures/equirectangular/')
    .load('royal_esplanade_2k.hdr.jpg', texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      envMap.value = texture

      const canvas = generateTexture()
      alphaMap.value = new THREE.CanvasTexture(canvas)
      if (alphaMap.value) {
        alphaMap.value.magFilter = THREE.NearestFilter
        alphaMap.value.wrapT = THREE.RepeatWrapping
        alphaMap.value.wrapS = THREE.RepeatWrapping
        alphaMap.value.repeat.set(1, 3.5)
      }

      initGUI()
    })
})

function initGUI() {
  if (!gui) {
    gui = new GUI()

    gui.addColor(params, 'color').onChange(() => { })

    gui.add(params, 'transmission', 0, 1, 0.01).onChange(() => { })

    gui.add(params, 'opacity', 0, 1, 0.01).onChange(() => { })

    gui.add(params, 'metalness', 0, 1, 0.01).onChange(() => { })

    gui.add(params, 'roughness', 0, 1, 0.01).onChange(() => { })

    gui.add(params, 'ior', 1, 2, 0.01).onChange(() => { })

    gui.add(params, 'thickness', 0, 5, 0.01).onChange(() => { })

    gui.add(params, 'specularIntensity', 0, 1, 0.01).onChange(() => { })

    gui.addColor(params, 'specularColor').onChange(() => { })

    gui
      .add(params, 'envMapIntensity', 0, 1, 0.01)
      .name('envMap intensity')
      .onChange(() => { })

    gui.add(params, 'exposure', 0, 1, 0.01).onChange(() => { })

    gui
      .add(params, 'transmissionResolutionScale', 0.01, 1, 0.01)
      .name('transmission resolution')

    gui.open()
  }
}

onUnmounted(() => {
  if (gui) {
    gui.destroy()
    gui = null
  }
})
</script>
