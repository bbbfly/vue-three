<template>
  <TCanvas ref="canvasRef" antialias @animate="animate">
    <TScene ref="sceneRef">
      <TPerspectiveCamera :fov="40" :near="1" :far="1000" :position="[0, 0, 120]" />
      <TOrbitControls :min-distance="50" :max-distance="300" />

      <TMesh ref="torusMeshRef">
        <TMeshStandardMaterial
          ref="torusMaterialRef"
          :metalness="params.metalness"
          :roughness="params.roughness"
          :env-map-intensity="1.0"
        />
      </TMesh>

      <TMesh ref="planeMeshRef" :visible="params.debug">
        <TMeshBasicMaterial ref="planeMaterialRef" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import * as THREE from 'three'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import {
  useGui,
  TCanvas,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TMeshStandardMaterial,
  TMeshBasicMaterial,
  TScene
} from '@vue-three/vue-three'

const sceneRef = ref<any>(null)
const canvasRef = ref<any>(null)
const torusMeshRef = ref<any>(null)
const torusMaterialRef = ref<any>(null)
const planeMeshRef = ref<any>(null)
const planeMaterialRef = ref<any>(null)

const scene = ref<THREE.Scene | null>(null)
const torusMaterial = ref<THREE.MeshStandardMaterial | null>(null)
const planeMaterial = ref<THREE.MeshBasicMaterial | null>(null)

const params = ref({
  envMap: 'EXR',
  roughness: 0.0,
  metalness: 0.0,
  exposure: 1.0,
  debug: false
})

let exrCubeRenderTarget: THREE.WebGLCubeRenderTarget | null = null
let pngCubeRenderTarget: THREE.WebGLCubeRenderTarget | null = null
let exrBackground: THREE.Texture | null = null
let pngBackground: THREE.Texture | null = null

let pmremGenerator: THREE.PMREMGenerator | null = null
let initialized = false

const { gui } = useGui({ width: 300 })

function animate({ scene, renderer }) {
  torusMaterial.value.roughness = params.value.roughness
  torusMaterial.value.metalness = params.value.metalness

  let newEnvMap = torusMaterial.value.envMap
  let background = scene.background

  switch (params.value.envMap) {
    case 'EXR':
      newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null
      background = exrBackground
      break
    case 'PNG':
      newEnvMap = pngCubeRenderTarget ? pngCubeRenderTarget.texture : null
      background = pngBackground
      break
  }

  if (newEnvMap !== torusMaterial.value.envMap) {
    torusMaterial.value.envMap = newEnvMap
    torusMaterial.value.needsUpdate = true

    if (planeMaterial.value) {
      planeMaterial.value.map = newEnvMap
      planeMaterial.value.needsUpdate = true
    }
  }

  if (torusMeshRef.value?.mesh) {
    torusMeshRef.value.mesh.rotation.y += 0.005
  }

  if (planeMeshRef.value?.mesh) {
    planeMeshRef.value.mesh.visible = params.value.debug
  }

  scene.background = background
  renderer.toneMappingExposure = params.value.exposure
}

function initScene() {
  if (initialized || !scene.value || !torusMaterial.value) return

  const torusGeometry = new THREE.TorusKnotGeometry(18, 8, 150, 20)
  if (torusMeshRef.value?.setGeometry) {
    torusMeshRef.value.setGeometry(torusGeometry)
  } else if (torusMeshRef.value?.mesh) {
    torusMeshRef.value.mesh.geometry = torusGeometry
  }

  const planeGeometry = new THREE.PlaneGeometry(200, 200)
  if (planeMeshRef.value?.setGeometry) {
    planeMeshRef.value.setGeometry(planeGeometry)
  } else if (planeMeshRef.value?.mesh) {
    planeMeshRef.value.mesh.geometry = planeGeometry
    planeMeshRef.value.mesh.position.y = -50
    planeMeshRef.value.mesh.rotation.x = -Math.PI * 0.5
  }

  if (canvasRef.value?.context?.renderer) {
    pmremGenerator = new THREE.PMREMGenerator(canvasRef.value.context.renderer)
    pmremGenerator.compileEquirectangularShader()

    new EXRLoader().load('/textures/piz_compressed.exr', texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      exrCubeRenderTarget = pmremGenerator!.fromEquirectangular(texture)
      exrBackground = texture
    })

    new THREE.TextureLoader().load('/textures/equirectangular.png', texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.colorSpace = THREE.SRGBColorSpace
      pngCubeRenderTarget = pmremGenerator!.fromEquirectangular(texture)
      pngBackground = texture
    })
  }

  gui.add(params.value, 'envMap', ['EXR', 'PNG']).onChange(() => {
    initScene()
  })
  gui.add(params.value, 'roughness', 0, 1, 0.01)
  gui.add(params.value, 'metalness', 0, 1, 0.01)
  gui.add(params.value, 'exposure', 0, 2, 0.01)
  gui.add(params.value, 'debug')
  gui.open()

  if (canvasRef.value?.context?.renderer) {
    canvasRef.value.context.renderer.toneMapping = THREE.ACESFilmicToneMapping
  }

  initialized = true
}

watch(
  [canvasRef, torusMaterialRef, planeMaterialRef, torusMeshRef, planeMeshRef],
  async () => {
    await nextTick()

    if (sceneRef.value?.scene) {
      scene.value = sceneRef.value.scene
    }

    if (torusMaterialRef.value?.material) {
      torusMaterial.value = torusMaterialRef.value.material
    }

    if (planeMaterialRef.value?.material) {
      planeMaterial.value = planeMaterialRef.value.material
    }

    if (scene.value && torusMaterial.value && torusMeshRef.value && planeMeshRef.value) {
      initScene()
    }
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  await nextTick()
  await nextTick()

  if (canvasRef.value?.context?.scene) {
    scene.value = canvasRef.value.context.scene.value
  }

  if (torusMaterialRef.value?.material) {
    torusMaterial.value = torusMaterialRef.value.material
  }

  if (planeMaterialRef.value?.material) {
    planeMaterial.value = planeMaterialRef.value.material
  }

  if (scene.value && torusMaterial.value && torusMeshRef.value && planeMeshRef.value) {
    initScene()
  }
})
</script>
