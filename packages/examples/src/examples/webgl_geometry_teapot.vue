<template>
  <TCanvas antialias>
    <TScene ref="sceneRef">
      <TPerspectiveCamera ref="cameraRef" :fov="45" :near="1" :far="80000" :position="[-600, 550, 1300]" />
      <TOrbitControls ref="controlsRef" />

      <TAmbientLight ref="ambientLightRef" :intensity="2.0" :color="0x7c7c7c" />
      <TDirectionalLight ref="lightRef" :intensity="2.0" :color="0xffffff" :position="[0.32, 0.39, 0.7]" />

      <TMesh ref="teapotMeshRef"></TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, shallowRef, onUnmounted } from 'vue'
import * as THREE from 'three'
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  useGui,
} from '@vue-three/vue-three'

const sceneRef = ref<THREE.Scene>()
const teapotMeshRef = ref<THREE.Mesh>()
const teapotGeometryRef = shallowRef<THREE.BufferGeometry>()

const teapotSize = 300

interface EffectController {
  newTess: number
  bottom: boolean
  lid: boolean
  body: boolean
  fitLid: boolean
  nonblinn: boolean
  newShading: string
}

const effectController: EffectController = {
  newTess: 15,
  bottom: true,
  lid: true,
  body: true,
  fitLid: false,
  nonblinn: false,
  newShading: 'glossy'
}

let materials: Record<string, THREE.Material> = {}
let textureCube: THREE.CubeTexture | null = null
let textureMap: THREE.Texture | null = null

function createTeapot() {
  const geometry = new TeapotGeometry(
    teapotSize,
    effectController.newTess,
    effectController.bottom,
    effectController.lid,
    effectController.body,
    effectController.fitLid,
    !effectController.nonblinn
  )
  return geometry
}

function initMaterialsAndTextures() {
  const textureLoader = new THREE.TextureLoader()
  textureMap = textureLoader.load('/textures/uv_grid_opengl.jpg')
  textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping
  textureMap.anisotropy = 16
  textureMap.colorSpace = THREE.SRGBColorSpace

  const cubeTextureLoader = new THREE.CubeTextureLoader().setPath('/textures/cube/pisa/')
  textureCube = cubeTextureLoader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

  materials['wireframe'] = new THREE.MeshBasicMaterial({ wireframe: true })
  materials['flat'] = new THREE.MeshPhongMaterial({ specular: 0x000000, flatShading: true, side: THREE.DoubleSide })
  materials['smooth'] = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide })
  materials['glossy'] = new THREE.MeshPhongMaterial({ color: 0xc0c0c0, specular: 0x404040, shininess: 300, side: THREE.DoubleSide })
  materials['textured'] = new THREE.MeshPhongMaterial({ map: textureMap, side: THREE.DoubleSide })
  materials['reflective'] = new THREE.MeshPhongMaterial({ envMap: textureCube, side: THREE.DoubleSide })
}

function updateSceneBackground() {
  if (!sceneRef.value) return
  if (effectController.newShading === 'reflective' && textureCube) {
    sceneRef.value.scene.background = textureCube
  } else {
    sceneRef.value.scene.background = new THREE.Color(0x000000)
  }
}

function recreateTeapotGeometry() {
  if (teapotGeometryRef.value) {
    teapotGeometryRef.value.dispose()
    teapotMeshRef.value?.mesh.geometry.dispose()
  }
  teapotGeometryRef.value = createTeapot()
  if (teapotMeshRef.value && teapotGeometryRef.value) {
    teapotMeshRef.value.setGeometry(teapotGeometryRef.value)
  }
}

function updateMaterial() {
  if (teapotMeshRef.value && materials[effectController.newShading]) {
    teapotMeshRef.value.setMaterial(materials[effectController.newShading])
  }
}
const { gui: GUI, destroy } = useGui()
onMounted(() => {
  nextTick(() => {
    initMaterialsAndTextures()
    const gui = GUI.value
    gui.add(effectController, 'newTess', [2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50]).name('Tessellation Level').onChange(() => {
      recreateTeapotGeometry()
    })
    gui.add(effectController, 'lid').name('display lid').onChange(() => {
      recreateTeapotGeometry()
    })
    gui.add(effectController, 'body').name('display body').onChange(() => {
      recreateTeapotGeometry()
    })
    gui.add(effectController, 'bottom').name('display bottom').onChange(() => {
      recreateTeapotGeometry()
    })
    gui.add(effectController, 'fitLid').name('snug lid').onChange(() => {
      recreateTeapotGeometry()
    })
    gui.add(effectController, 'nonblinn').name('original scale').onChange(() => {
      recreateTeapotGeometry()
    })
    gui.add(effectController, 'newShading', ['wireframe', 'flat', 'smooth', 'glossy', 'textured', 'reflective']).name('Shading').onChange(() => {
      updateMaterial()
      updateSceneBackground()
    })

    recreateTeapotGeometry()
    updateMaterial()
    updateSceneBackground()
  })
})
onUnmounted(() => {
  destroy()
})
</script>

<style scoped></style>
