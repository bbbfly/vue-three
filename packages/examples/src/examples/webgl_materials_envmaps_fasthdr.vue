<template>
  <TCanvas ref="canvasRef" antialias @animate="animate">
    <TScene ref="sceneRef">
      <TPerspectiveCamera :fov="params.fov" :near="0.1" :far="50" :position="[7, 0, 0]" />
      <TOrbitControls :min-distance="0.1" :max-distance="20" :enable-damping="true" />

      <TMesh :position="[0, 0, 2]">
        <TSphere :args="[0.45, 64, 32]" />
        <TMeshPhysicalMaterial
          :transmission="1.0"
          :thickness="2.0"
          :metalness="0.0"
          :roughness="0.0"
        />
      </TMesh>

      <TMesh :position="[0, 0, 1]">
        <TSphere :args="[0.45, 64, 32]" />
        <TMeshStandardMaterial :metalness="0.0" :roughness="1.0" />
      </TMesh>

      <TMesh :position="[0, 0, 0]">
        <TSphere :args="[0.45, 64, 32]" />
        <TMeshStandardMaterial :metalness="1.0" :roughness="0.0" />
      </TMesh>

      <TMesh :position="[0, 0, -1]">
        <TSphere :args="[0.45, 64, 32]" />
        <TMeshStandardMaterial :metalness="1.0" :roughness="0.5" :color="0x888888" />
      </TMesh>

      <TMesh :position="[0, 0, -2]">
        <TSphere :args="[0.45, 64, 32]" />
        <TMeshStandardMaterial :metalness="0.0" :roughness="0.0" :color="0x6ab440" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import * as THREE from 'three'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import {
  useGui,
  TCanvas,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TSphere,
  TMeshPhysicalMaterial,
  TMeshStandardMaterial,
  TScene
} from '@vue-three/vue-three'

const sceneRef = ref<any>(null)
const canvasRef = ref<any>(null)

const scene = ref<THREE.Scene | null>(null)
const renderer = ref<THREE.WebGLRenderer | null>(null)
const camera = ref<THREE.PerspectiveCamera | null>(null)

const params = ref({
  image: 'https://cdn.needle.tools/static/hdris/ballroom_2k.pmrem.ktx2',
  fov: 40,
  exposure: 1.0,
  backgroundBlurriness: 0.0
})

const imageOptions = {
  ballroom: 'https://cdn.needle.tools/static/hdris/ballroom_2k.pmrem.ktx2',
  'brown photostudio': 'https://cdn.needle.tools/static/hdris/brown_photostudio_02_2k.pmrem.ktx2',
  'cape hill': 'https://cdn.needle.tools/static/hdris/cape_hill_2k.pmrem.ktx2',
  cannon: 'https://cdn.needle.tools/static/hdris/cannon_2k.pmrem.ktx2',
  'metro noord': 'https://cdn.needle.tools/static/hdris/metro_noord_2k.pmrem.ktx2',
  'the sky is on fire': 'https://cdn.needle.tools/static/hdris/the_sky_is_on_fire_2k.pmrem.ktx2',
  'studio small 09': 'https://cdn.needle.tools/static/hdris/studio_small_09_2k.pmrem.ktx2',
  'wide street 01': 'https://cdn.needle.tools/static/hdris/wide_street_01_2k.pmrem.ktx2'
}

let ktx2Loader: KTX2Loader | null = null
let initialized = false

const { gui } = useGui({ width: 300 })

function loadTexture(url: string) {
  console.log('1')
  ktx2Loader.load(url, texture => {
    texture.mapping = THREE.CubeUVReflectionMapping
    scene.value!.environment = texture
    scene.value!.background = texture
    console.log(texture)
  })
}

function animate({ scene, renderer }) {
  renderer.toneMappingExposure = params.value.exposure
  scene.backgroundBlurriness = params.value.backgroundBlurriness
}

function initScene() {
  ktx2Loader = new KTX2Loader().setTranscoderPath('/jsm/libs/basis/').detectSupport(renderer.value)

  loadTexture(params.value.image)

  gui
    .add(params.value, 'image', imageOptions)
    .name('Image')
    .onChange(() => {
      loadTexture(params.value.image)
    })

  gui.add(params.value, 'exposure', 0, 2, 0.01).name('Exposure')

  gui
    .add(params.value, 'fov', 10, 100)
    .name('FOV')
    .onChange(() => {
      if (camera.value) {
        camera.value.fov = params.value.fov
        camera.value.updateProjectionMatrix()
      }
    })

  gui.add(params.value, 'backgroundBlurriness', 0, 1, 0.01).name('Background Blurriness')

  gui.open()

  initialized = true
}

watch(
  [canvasRef, sceneRef],
  async () => {
    await nextTick()

    if (sceneRef.value?.scene) {
      scene.value = sceneRef.value.scene
    }

    if (canvasRef.value?.context?.renderer) {
      renderer.value = canvasRef.value.context.renderer.value
    }

    if (canvasRef.value?.context?.camera) {
      camera.value = canvasRef.value.context.camera.value as THREE.PerspectiveCamera
    }

    if (scene.value && renderer.value && camera.value) {
      initScene()
    }
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  await nextTick()
  await nextTick()

  if (sceneRef.value?.scene) {
    scene.value = sceneRef.value.scene
  }

  if (canvasRef.value?.context?.renderer) {
    renderer.value = canvasRef.value.context.renderer
  }

  if (canvasRef.value?.context?.camera) {
    camera.value = canvasRef.value.context.camera as THREE.PerspectiveCamera
  }

  initScene()
})
</script>
