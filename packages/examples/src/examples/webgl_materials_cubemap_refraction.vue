<template>
  <TCanvas antialias :enable-control="false" @mousemove="onDocumentMouseMove" @animate="render">
    <TScene :background="backgroundTexture">
      <TPerspectiveCamera
        ref="cameraRef"
        :fov="50"
        :near="1"
        :far="100000"
        :position="cameraPosition"
      />

      <TAmbientLight :intensity="3.5" />

      <TMesh :position="[0, 0, 0]" :scale="scale">
        <TPLYLoader src="/models/ply/binary/Lucy100k.ply" />
        <TMeshPhongMaterial :color="0xffffff" :refraction-ratio="0.98">
          <TCubeTexture :urls="cubeUrls" mapping="refraction" />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :position="[-1500, 0, 0]" :scale="scale">
        <TPLYLoader src="/models/ply/binary/Lucy100k.ply" />
        <TMeshPhongMaterial :color="0xccfffd" :refraction-ratio="0.985">
          <TCubeTexture :urls="cubeUrls" mapping="refraction" />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :position="[1500, 0, 0]" :scale="scale">
        <TPLYLoader src="/models/ply/binary/Lucy100k.ply" />
        <TMeshPhongMaterial :color="0xccddff" :refraction-ratio="0.98" :reflectivity="0.9">
          <TCubeTexture :urls="cubeUrls" mapping="refraction" />
        </TMeshPhongMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TAmbientLight,
  TMesh,
  TPLYLoader,
  TMeshPhongMaterial,
  TCubeTexture
} from '@vue-three/vue-three'

const scale = ref([1.5, 1.5, 1.5])
const cubeUrls = [
  '/textures/cube/Park3Med/px.jpg',
  '/textures/cube/Park3Med/nx.jpg',
  '/textures/cube/Park3Med/py.jpg',
  '/textures/cube/Park3Med/ny.jpg',
  '/textures/cube/Park3Med/pz.jpg',
  '/textures/cube/Park3Med/nz.jpg'
]

const backgroundTexture = shallowRef<THREE.CubeTexture | null>(null)
const cameraRef = shallowRef<THREE.PerspectiveCamera | null>(null)

const mouseX = ref(0)
const mouseY = ref(0)

const cameraPosition = ref([0, 0, -4000])

onMounted(() => {
  const loader = new THREE.CubeTextureLoader()
  backgroundTexture.value = loader.load(cubeUrls)
  backgroundTexture.value.mapping = THREE.CubeRefractionMapping
})

const onDocumentMouseMove = (event: MouseEvent) => {
  const target = event.target as HTMLCanvasElement
  const { width, height } = target.getBoundingClientRect()
  const windowHalfX = width / 2
  const windowHalfY = height / 2
  mouseX.value = (event.clientX - windowHalfX) * 4
  mouseY.value = (event.clientY - windowHalfY) * 4
}

const render = () => {
  if (cameraRef.value && backgroundTexture.value) {
    cameraPosition.value[0] += (mouseX.value - cameraPosition.value[0]) * 0.05
    cameraPosition.value[1] += (-mouseY.value - cameraPosition.value[1]) * 0.05
    cameraRef.value.lookAt(0, 0, 0)
  }
}
</script>
