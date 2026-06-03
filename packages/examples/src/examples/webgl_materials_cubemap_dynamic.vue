<template>
  <TCanvas ref="canvasRef" antialias :tone-mapping="THREE.ACESFilmicToneMapping" @animate="animate">
    <TScene :rotation-y="0.5" :background="hdrTexture" :environment="hdrTexture">
      <TPerspectiveCamera :fov="60" :near="1" :far="1000" :position="[0, 0, 75]" />
      <TOrbitControls auto-rotate />

      <TMesh ref="sphereRef">
        <TIcosahedron :args="[15, 8]" />
        <TMeshStandardMaterial
          :roughness="params.roughness"
          :metalness="params.metalness"
          :env-map="cubeRenderTarget?.texture"
        />
      </TMesh>

      <TMesh ref="cubeRef" :position="cubeRefConfig.position" :rotation="cubeRefConfig.rotation">
        <TBox :args="[15, 15, 15]" />
        <TMeshStandardMaterial :roughness="0.1" :metalness="0" />
      </TMesh>

      <TMesh ref="torusRef" :position="torusRefConfig.position" :rotation="torusRefConfig.rotation">
        <TTorusKnotGeometry :args="[8, 3, 128, 16]" />
        <TMeshStandardMaterial :roughness="0.1" :metalness="0" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, shallowRef } from 'vue'
import * as THREE from 'three'
import {
  TBox,
  useGui,
  TCanvas,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TMeshStandardMaterial,
  TScene,
  TIcosahedron,
  TBoxGeometry,
  TTorusKnotGeometry
} from '@vue-three/vue-three'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

const canvasRef = ref<any>(null)
const sphereRef = ref<any>(null)
const cubeRef = ref<any>(null)
const torusRef = ref<any>(null)

const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
const cubeCamera = shallowRef<THREE.CubeCamera | null>(null)
const cubeRenderTarget = shallowRef<THREE.WebGLCubeRenderTarget | null>(null)
const hdrTexture = shallowRef<THREE.Texture | null>(null)
const scene = shallowRef<THREE.Scene | null>(null)

let startTime = 0

const { gui } = useGui({ width: 300 })

const params = ref({
  roughness: 0.05,
  metalness: 1,
  exposure: 1
})

const cubeRefConfig = ref({
  position: [0, 0, 0],
  rotation: [0, 0, 0]
})
const torusRefConfig = ref({
  position: [0, 0, 0],
  rotation: [0, 0, 0]
})
function animate({ renderer, scene }) {
  const time = (Date.now() - startTime) / 1000

  if (cubeRef.value?.mesh) {
    cubeRefConfig.value.position[0] = Math.cos(time) * 30
    cubeRefConfig.value.position[1] = Math.sin(time) * 30
    cubeRefConfig.value.position[2] = Math.sin(time) * 30
    cubeRefConfig.value.rotation[0] += 0.02
    cubeRefConfig.value.rotation[1] += 0.03
  }

  if (torusRef.value?.mesh) {
    torusRefConfig.value.position[0] = Math.cos(time + 10) * 30
    torusRefConfig.value.position[1] = Math.sin(time + 10) * 30
    torusRefConfig.value.position[2] = Math.sin(time + 10) * 30
    torusRefConfig.value.rotation[0] += 0.02
    torusRefConfig.value.rotation[1] += 0.03
  }
  renderer.toneMappingExposure = params.value.exposure
  cubeCamera.value?.update(renderer, scene)
}

function initHDR() {
  const hdrLoader = new HDRLoader()
  hdrLoader.setPath('/textures/equirectangular/')
  hdrLoader.load('quarry_01_1k.hdr', (texture: THREE.Texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    hdrTexture.value = texture
  })
}
initHDR()

function initCubeCamera() {
  if (!renderer.value || !scene.value) return

  cubeRenderTarget.value = new THREE.WebGLCubeRenderTarget(256)
  cubeRenderTarget.value.texture.type = THREE.HalfFloatType

  cubeCamera.value = new THREE.CubeCamera(1, 1000, cubeRenderTarget.value)
  scene.value.add(cubeCamera.value)
}

function setupGui() {
  gui.add(params.value, 'roughness', 0, 1)
  gui.add(params.value, 'metalness', 0, 1)
  gui.add(params.value, 'exposure', 0, 2)
}

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 100))

  if (canvasRef.value?.context?.renderer) {
    renderer.value = canvasRef.value.context.renderer
  }

  if (canvasRef.value?.context?.scene) {
    scene.value = canvasRef.value.context.scene
  }

  startTime = Date.now()
  initCubeCamera()
  setupGui()
})
</script>
