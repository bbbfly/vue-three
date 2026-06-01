<template>
  <TCanvas ref="canvasRef" :antialias="true" :alpha="true" :tone-mapping="toneMapping"
    :tone-mapping-exposure="params.exposure">
    <TPerspectiveCamera :fov="40" :near="1" :far="2000" :position="[-5, 0.5, 0]" />
    <TOrbitControls :min-distance="5" :max-distance="20" :target="[0, 0.5, 0]" />

    <TScene v-if="envMap" :environment="envMap">
      <TGLTFLoader :src="modelUrl" @load="onModelLoaded" />
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
  TGLTFLoader
} from '@vue-three/vue-three'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const toneMapping = THREE.ACESFilmicToneMapping

const envMap = ref<THREE.Texture | null>(null)
const modelUrl = ref('/models/gltf/DragonAttenuation.glb')
let gui: GUI | null = null
let material: THREE.MeshPhysicalMaterial | null = null

const params = reactive({
  color: 0xffffff,
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0,
  ior: 1.5,
  thickness: 0.01,
  attenuationColor: 0xffffff,
  attenuationDistance: 1,
  specularIntensity: 1,
  specularColor: 0xffffff,
  envMapIntensity: 1,
  exposure: 1
})

function onModelLoaded(gltf: THREE.Group) {
  gltf.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
      material = child.material
      const color = new THREE.Color()

      params.color = color.copy(material.color).getHex()
      params.roughness = material.roughness
      params.metalness = material.metalness
      params.ior = material.ior
      params.specularIntensity = material.specularIntensity
      params.transmission = material.transmission
      params.thickness = material.thickness
      params.attenuationColor = color.copy(material.attenuationColor).getHex()
      params.attenuationDistance = material.attenuationDistance
      params.specularColor = color.copy(material.specularColor).getHex()
      params.envMapIntensity = material.envMapIntensity

      initGUI()
    }
  })
}

function initGUI() {
  if (!gui && material) {
    gui = new GUI()

    gui.addColor(params, 'color')
      .onChange(() => {
        material!.color.set(params.color)
      })

    gui.add(params, 'transmission', 0, 1, 0.01)
      .onChange(() => {
        material!.transmission = params.transmission
      })

    gui.add(params, 'opacity', 0, 1, 0.01)
      .onChange(() => {
        material!.opacity = params.opacity
        const transparent = params.opacity < 1
        if (transparent !== material!.transparent) {
          material!.transparent = transparent
          material!.needsUpdate = true
        }
      })

    gui.add(params, 'metalness', 0, 1, 0.01)
      .onChange(() => {
        material!.metalness = params.metalness
      })

    gui.add(params, 'roughness', 0, 1, 0.01)
      .onChange(() => {
        material!.roughness = params.roughness
      })

    gui.add(params, 'ior', 1, 2, 0.01)
      .onChange(() => {
        material!.ior = params.ior
      })

    gui.add(params, 'thickness', 0, 5, 0.01)
      .onChange(() => {
        material!.thickness = params.thickness
      })

    gui.addColor(params, 'attenuationColor')
      .name('attenuation color')
      .onChange(() => {
        material!.attenuationColor.set(params.attenuationColor)
      })

    gui.add(params, 'attenuationDistance', 0, 1, 0.01)
      .onChange(() => {
        material!.attenuationDistance = params.attenuationDistance
      })

    gui.add(params, 'specularIntensity', 0, 1, 0.01)
      .onChange(() => {
        material!.specularIntensity = params.specularIntensity
      })

    gui.addColor(params, 'specularColor')
      .onChange(() => {
        material!.specularColor.set(params.specularColor)
      })

    gui.add(params, 'envMapIntensity', 0, 1, 0.01)
      .name('envMap intensity')
      .onChange(() => {
        material!.envMapIntensity = params.envMapIntensity
      })

    gui.add(params, 'exposure', 0, 1, 0.01)
      .onChange(() => { })

    gui.open()
  }
}

onMounted(() => {
  new UltraHDRLoader()
    .setPath('/textures/equirectangular/')
    .load('royal_esplanade_2k.hdr.jpg', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      envMap.value = texture
    })
})

onUnmounted(() => {
  if (gui) {
    gui.destroy()
    gui = null
  }
})
</script>