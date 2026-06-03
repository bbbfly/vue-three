<template>
  <TCanvas antialias @animate="animate">
    <TPerspectiveCamera :fov="40" :near="1" :far="5000" :position="[0, 300, 1600]" />
    <TOrbitControls :min-distance="500" :max-distance="3000" />

    <TScene>
      <TAmbientLight :color="0xc1c1c1" />

      <TDirectionalLight :color="0xffffff" :intensity="0.03" :position="[0, 0.5, 0.5]" />

      <TMesh>
        <TSphere :args="[4, 8, 8]" :position="[0, -50, 350]" />
        <TMeshBasicMaterial :color="0xc1c1c1" />
        <TPointLight :color="0xc1c1c1" :intensity="4.0" :distance="300" />
      </TMesh>

      <TMesh>
        <TSphere :args="[4, 8, 8]" :position="[-100, 20, -260]" />
        <TMeshBasicMaterial :color="0xc1c100" />
        <TPointLight :color="0xc1c100" :intensity="0.75" :distance="500" />
      </TMesh>

      <TMesh v-if="uniforms" :rotation="[0, rotationY, 0]">
        <TFBXLoader src="/models/fbx/stanford-bunny.fbx" :scale="[1, 1, 1]" />
        <!-- 存在问题：uniforms 有些属性没有生效 -->
        <TShaderMaterial
          :uniforms="uniforms"
          :vertex-shader="shader.vertexShader"
          :fragment-shader="shader.fragmentShader"
          :lights="true"
        />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, shallowRef } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TPerspectiveCamera,
  TOrbitControls,
  TScene,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TSphere,
  TMeshBasicMaterial,
  TPointLight,
  TFBXLoader,
  TShaderMaterial
} from '@vue-three/vue-three'
import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const rotationY = ref(0)
let gui: GUI | null = null

const params = reactive({
  distortion: 0.1,
  ambient: 0.4,
  attenuation: 0.8,
  power: 2.0,
  scale: 16.0
})

const loader = new THREE.TextureLoader()

const imgTexture = loader.load('/models/fbx/white.jpg')
imgTexture.colorSpace = THREE.SRGBColorSpace
imgTexture.wrapS = THREE.RepeatWrapping
imgTexture.wrapT = THREE.RepeatWrapping
const thicknessTexture = loader.load('/models/fbx/bunny_thickness.jpg')

const shader = SubsurfaceScatteringShader
const uniforms = shallowRef<THREE.Uniforms>(THREE.UniformsUtils.clone(shader.uniforms))
uniforms.value['map'].value = imgTexture
uniforms.value['diffuse'].value = new THREE.Vector3(1.0, 0.2, 0.2)
uniforms.value['shininess'].value = 500
uniforms.value['thicknessMap'].value = thicknessTexture
uniforms.value['thicknessColor'].value = new THREE.Vector3(0.5, 0.3, 0.0)
uniforms.value['thicknessDistortion'].value = params.distortion
uniforms.value['thicknessAmbient'].value = params.ambient
uniforms.value['thicknessAttenuation'].value = params.attenuation
uniforms.value['thicknessPower'].value = params.power
uniforms.value['thicknessScale'].value = params.scale

function animate() {
  rotationY.value = performance.now() / 5000
}

initGUI()

function initGUI() {
  if (!gui && uniforms.value) {
    gui = new GUI({ title: 'Thickness Control' })

    gui.add(params, 'distortion').min(0.01).max(1).step(0.01)
    gui.add(params, 'ambient').min(0.01).max(5.0).step(0.05)
    gui.add(params, 'attenuation').min(0.01).max(5.0).step(0.05)
    gui
      .add(params, 'power')
      .min(0.01)
      .max(16.0)
      .step(0.1)
      .onChange(val => {
        uniforms.value['thicknessPower'].value = val
      })
    gui.add(params, 'scale').min(0.01).max(50.0).step(0.1)

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
