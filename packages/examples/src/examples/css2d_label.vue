<template>
  <TCanvas antialias clear-color="#000000">
    <TScene>
      <TPerspectiveCamera
        ref="cameraRef"
        :fov="45"
        :near="0.1"
        :far="200"
        :position="[10, 5, 20]"
      />
      <TOrbitControls :min-distance="5" :max-distance="100" />

      <TAmbientLight :intensity="0.5" />
      <TDirectionalLight :intensity="3" :position="[0, 0, 1]" />

      <TAxesHelper :size="5" />

      <TMesh ref="earthMeshRef">
        <TSphere :args="[EARTH_RADIUS, 16, 16]" />
        <TMeshPhongMaterial :specular="0x333333" :shininess="5" :normal-scale="[0.85, 0.85]">
          <TTexture :url="'/textures/planets/earth_atmos_2048.jpg'" :color-space="'srgb'" />
          <TTexture map-type="specularMap" :url="'/textures/planets/earth_specular_2048.jpg'" />
          <TTexture map-type="normalMap" :url="'/textures/planets/earth_normal_2048.jpg'" />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh ref="moonMeshRef" :position="moonPosition">
        <TSphere :args="[MOON_RADIUS, 16, 16]" />
        <TMeshPhongMaterial :shininess="5">
          <TTexture :url="'/textures/planets/moon_1024.jpg'" :color-space="'srgb'" />
        </TMeshPhongMaterial>
      </TMesh>

      <TCSS2DRenderer>
        <TCSS2DObject
          :position="earthLabelPosition"
          :center="[0, 1]"
          :layers="0"
          class-name="label"
          :style="{ backgroundColor: 'transparent' }"
        >
          Earth
        </TCSS2DObject>

        <TCSS2DObject
          :position="earthLabelPosition"
          :center="[0, 0]"
          :layers="1"
          class-name="label"
          :style="{ backgroundColor: 'transparent' }"
        >
          5.97237e24 kg
        </TCSS2DObject>

        <TCSS2DObject
          :position="moonLabelPosition"
          :center="[0, 1]"
          :layers="0"
          class-name="label"
          :style="{ backgroundColor: 'transparent' }"
        >
          Moon
        </TCSS2DObject>

        <TCSS2DObject
          :position="moonLabelPosition"
          :center="[0, 0]"
          :layers="1"
          class-name="label"
          :style="{ backgroundColor: 'transparent' }"
        >
          7.342e22 kg
        </TCSS2DObject>
      </TCSS2DRenderer>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TSphere,
  TMeshPhongMaterial,
  TTexture,
  TCSS2DRenderer,
  TCSS2DObject,
  TAxesHelper
} from '@vue-three/vue-three'

const EARTH_RADIUS = 1
const MOON_RADIUS = 0.27

const cameraRef = ref<any>(null)
const earthMeshRef = ref<any>(null)
const moonMeshRef = ref<any>(null)
const moonPosition = ref<[number, number, number]>([5, 0, 0])

const earthLabelPosition = computed<[number, number, number]>(() => {
  return [1.5 * EARTH_RADIUS, 0, 0]
})

const moonLabelPosition = computed<[number, number, number]>(() => {
  return [moonPosition.value[0] + 1.5 * MOON_RADIUS, moonPosition.value[1], moonPosition.value[2]]
})

let animationId: number | null = null
let gui: GUI | null = null

const timer = new THREE.Timer()

onMounted(async () => {
  await nextTick()

  if (cameraRef.value?.camera) {
    cameraRef.value.camera.layers.enableAll()
  }

  if (earthMeshRef.value?.mesh) {
    earthMeshRef.value.mesh.layers.enableAll()
  }

  if (moonMeshRef.value?.mesh) {
    moonMeshRef.value.mesh.layers.enableAll()
  }

  timer.connect(document)
  startAnimation()
  initGui()
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  if (gui) {
    gui.destroy()
  }
})

const startAnimation = () => {
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    timer.update()
    const elapsed = timer.getElapsed()

    moonPosition.value = [Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5]
  }

  animate()
}

const initGui = () => {
  gui = new GUI()
  gui.title('Camera Layers')

  const layers = {
    'Toggle Name': () => {
      if (cameraRef.value?.camera) {
        cameraRef.value.camera.layers.toggle(0)
      }
    },
    'Toggle Mass': () => {
      if (cameraRef.value?.camera) {
        cameraRef.value.camera.layers.toggle(1)
      }
    },
    'Enable All': () => {
      if (cameraRef.value?.camera) {
        cameraRef.value.camera.layers.enableAll()
      }
    },
    'Disable All': () => {
      if (cameraRef.value?.camera) {
        cameraRef.value.camera.layers.disableAll()
      }
    }
  }

  gui.add(layers, 'Toggle Name')
  gui.add(layers, 'Toggle Mass')
  gui.add(layers, 'Enable All')
  gui.add(layers, 'Disable All')

  gui.open()
}
</script>

<style>
.label {
  color: #fff;
  font-family: sans-serif;
  padding: 2px;
  background: rgba(0, 0, 0, 0.6);
}
</style>
