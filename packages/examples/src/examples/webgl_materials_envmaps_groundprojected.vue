<template>
  <TCanvas
    ref="canvasRef"
    antialias
    :tone-mapping="'ACESFilmicToneMapping'"
    @before-render="onAnimate"
  >
    <TScene ref="sceneRef" :environment="environmentMap">
      <TPerspectiveCamera :position="[-20, 7, 20]" :fov="40" :near="1" :far="1000" />
      <TOrbitControls
        :target="[0, 2, 0]"
        :max-polar-angle="Math.PI / 2"
        :max-distance="80"
        :min-distance="20"
        :enable-pan="false"
      />

      <TGridHelper :size="200" :divisions="100" color="#ffffff" :opacity="0.2" />

      <TGLTFLoader ref="gltfLoaderRef" :src="modelUrl" :draco="true" @load="onModelLoad" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, shallowRef } from 'vue'
import * as THREE from 'three'
import {
  useGui,
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TGridHelper,
  TGLTFLoader
} from '@vue-three/vue-three'
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { EquirectangularReflectionMapping } from 'three'

const canvasRef = ref<any>(null)
const sceneRef = ref<any>(null)
const gltfLoaderRef = ref<any>(null)

const environmentMap = ref<THREE.Texture | null>(null)
const groundSkybox = shallowRef<GroundedSkybox | null>(null)

const modelUrl = '/models/gltf/ferrari.glb'

const params = ref({
  height: 15,
  radius: 100,
  enabled: true
})

let carModel: THREE.Object3D | null = null
let initialized = false

const { gui } = useGui({ width: 300 })

function onAnimate() {
  // Animation loop if needed
}

function updateSkybox() {
  if (!sceneRef.value?.scene) return

  const scene = sceneRef.value.scene

  if (params.value.enabled) {
    scene.add(groundSkybox.value!)
    scene.background = null
  } else {
    scene.remove(groundSkybox.value!)
    scene.background = environmentMap.value
  }
}

function onModelLoad(loadedModel: any) {
  carModel = loadedModel.scene || loadedModel.children[0]
  if (!carModel) return

  // Create materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: 1.0,
    roughness: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2
  })

  const detailsMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.5
  })

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.25,
    roughness: 0,
    transmission: 1.0
  })

  // Scale and rotate model
  carModel.scale.multiplyScalar(4)
  carModel.rotation.y = Math.PI

  // Apply materials
  const body = carModel.getObjectByName('body')
  if (body) body.material = bodyMaterial

  const rim_fl = carModel.getObjectByName('rim_fl')
  const rim_fr = carModel.getObjectByName('rim_fr')
  const rim_rr = carModel.getObjectByName('rim_rr')
  const rim_rl = carModel.getObjectByName('rim_rl')
  const trim = carModel.getObjectByName('trim')

  if (rim_fl) rim_fl.material = detailsMaterial
  if (rim_fr) rim_fr.material = detailsMaterial
  if (rim_rr) rim_rr.material = detailsMaterial
  if (rim_rl) rim_rl.material = detailsMaterial
  if (trim) trim.material = detailsMaterial

  const glass = carModel.getObjectByName('glass')
  if (glass) glass.material = glassMaterial

  // Add shadow plane
  const shadowTextureLoader = new THREE.TextureLoader()
  shadowTextureLoader.load('/models/gltf/ferrari_ao.png', shadowTexture => {
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        blending: THREE.MultiplyBlending,
        toneMapped: false,
        transparent: true,
        premultipliedAlpha: true
      })
    )
    shadowMesh.rotation.x = -Math.PI / 2
    carModel!.add(shadowMesh)
  })
}

function initScene() {
  if (initialized) return
  initialized = true

  // Load HDR environment map
  const hdrLoader = new HDRLoader()
  hdrLoader.load('/textures/equirectangular/blouberg_sunrise_2_1k.hdr', texture => {
    texture.mapping = EquirectangularReflectionMapping
    environmentMap.value = texture

    // Create grounded skybox
    groundSkybox.value = new GroundedSkybox(texture, params.value.height, params.value.radius)
    groundSkybox.value.position.y = params.value.height - 0.01

    // Add skybox to scene
    if (sceneRef.value?.scene) {
      sceneRef.value.scene.add(groundSkybox.value)
    }
  })

  // Setup GUI
  gui.add(params.value, 'enabled').name('Grounded').onChange(updateSkybox)
}

watch(
  [canvasRef, sceneRef],
  async () => {
    await nextTick()
    if (sceneRef.value?.scene && !initialized) {
      initScene()
    }
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  await nextTick()
  await nextTick()

  if (sceneRef.value?.scene && !initialized) {
    initScene()
  }
})
</script>
