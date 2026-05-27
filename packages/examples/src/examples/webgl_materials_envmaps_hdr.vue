<template>
  <TCanvas ref="canvasRef" antialias @animate="animate">
    <TScene ref="sceneRef">
      <TPerspectiveCamera :fov="40" :near="1" :far="1000" :position="[0, 0, 120]" />
      <TOrbitControls :min-distance="50" :max-distance="300" />

      <TMesh ref="torusMeshRef">
        <TMeshStandardMaterial ref="torusMaterialRef" :metalness="params.metalness" :roughness="params.roughness" />
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
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js'
import { DebugEnvironment } from 'three/addons/environments/DebugEnvironment.js'
import { useGui, TCanvas, TPerspectiveCamera, TOrbitControls, TMesh, TMeshStandardMaterial, TMeshBasicMaterial, TScene } from '@vue-three/vue-three'

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
  envMap: 'HDR',
  roughness: 0.0,
  metalness: 0.0,
  exposure: 1.0,
  debug: false
})

let generatedCubeRenderTarget: THREE.WebGLCubeRenderTarget | null = null
let ldrCubeRenderTarget: THREE.WebGLCubeRenderTarget | null = null
let hdrCubeRenderTarget: THREE.WebGLCubeRenderTarget | null = null
let ldrCubeMap: THREE.CubeTexture | null = null
let hdrCubeMap: THREE.CubeTexture | null = null

let pmremGenerator: THREE.PMREMGenerator | null = null
let initialized = false

const { gui } = useGui({ width: 300 })

function animate({ scene, renderer }) {
  if (!torusMaterial.value) return

  torusMaterial.value.roughness = params.value.roughness
  torusMaterial.value.metalness = params.value.metalness

  let renderTarget: THREE.WebGLCubeRenderTarget | null = null
  let cubeMap: THREE.Texture | null = null

  switch (params.value.envMap) {
    case 'Generated':
      renderTarget = generatedCubeRenderTarget
      cubeMap = generatedCubeRenderTarget ? generatedCubeRenderTarget.texture : null
      break
    case 'LDR':
      renderTarget = ldrCubeRenderTarget
      cubeMap = ldrCubeMap
      break
    case 'HDR':
      renderTarget = hdrCubeRenderTarget
      cubeMap = hdrCubeMap
      break
  }

  const newEnvMap = renderTarget ? renderTarget.texture : null

  if (newEnvMap && newEnvMap !== torusMaterial.value.envMap) {
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

  scene.background = cubeMap
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
    pmremGenerator.compileCubemapShader()

    const hdrUrls = ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr']
    hdrCubeMap = new HDRCubeTextureLoader()
      .setPath('/textures/cube/pisaHDR/')
      .load(hdrUrls, function () {
        hdrCubeRenderTarget = pmremGenerator!.fromCubemap(hdrCubeMap!)
        hdrCubeMap!.magFilter = THREE.LinearFilter
        hdrCubeMap!.needsUpdate = true
      })

    const ldrUrls = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']
    ldrCubeMap = new THREE.CubeTextureLoader()
      .setPath('/textures/cube/pisa/')
      .load(ldrUrls, function () {
        ldrCubeRenderTarget = pmremGenerator!.fromCubemap(ldrCubeMap!)
      })

    const envScene = new DebugEnvironment()
    generatedCubeRenderTarget = pmremGenerator.fromScene(envScene)
  }

  gui.add(params.value, 'envMap', ['Generated', 'LDR', 'HDR'])
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

watch([canvasRef, torusMaterialRef, planeMaterialRef, torusMeshRef, planeMeshRef], async () => {
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
}, { immediate: true, deep: true })

onMounted(async () => {
  await nextTick()
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
})
</script>