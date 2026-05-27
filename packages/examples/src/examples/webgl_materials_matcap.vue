<template>
  <TCanvas antialias :tone-mapping="toneMapping" :tone-mapping-exposure="params.exposure" background="#000000">
    <TScene>
      <TPerspectiveCamera :fov="40" :near="1" :far="100" :position="[0, 0, 13]" />
      <TOrbitControls :enable-zoom="false" :enable-pan="false" />

      <TMesh ref="meshRef" :position="[0, -0.25, 0]">
        <TGLTFLoader ref="gltfLoaderRef" :src="modelUrl" />
        <TMeshMatcapMaterial :color="params.color">
          <TTexture map-type="matcap" :url="matcapUrl" color-space="LinearSRGBColorSpace" />
          <TTexture map-type="normalMap" :url="normalMapUrl" />
        </TMeshMatcapMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as THREE from 'three'
import {
  useGui,
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TMeshMatcapMaterial,
  TTexture,
  TGLTFLoader
} from '@vue-three/vue-three'

const toneMapping = THREE.ACESFilmicToneMapping

const modelUrl = '/models/gltf/LeePerrySmith/LeePerrySmith.glb'
const matcapUrl = '/textures/matcaps/040full.exr'
const normalMapUrl = '/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg'

const params = reactive({
  color: 0xffffff,
  exposure: 1.0
})

const { gui } = useGui()

onMounted(() => {
  gui.addColor(params, 'color').name('color')
  gui.add(params, 'exposure', 0, 2).name('exposure')
})
</script>