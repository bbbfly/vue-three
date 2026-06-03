<template>
  <TCanvas ref="canvasRef" antialias @before-render="animate">
    <TScene ref="sceneRef">
      <TPerspectiveCamera :fov="70" :near="0.1" :far="100" :position="[0, 0, 2.5]" />
      <TOrbitControls :min-distance="1.5" :max-distance="6" />

      <TMesh ref="sphereMeshRef">
        <TMeshBasicMaterial ref="materialRef" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import * as THREE from 'three'
import {
  useGui,
  TCanvas,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TMeshBasicMaterial,
  TScene
} from '@vue-three/vue-three'

const sceneRef = ref<any>(null)
const canvasRef = ref<any>(null)
const materialRef = ref<any>(null)
const sphereMeshRef = ref<any>(null)

const scene = ref<THREE.Scene | null>(null)
const material = ref<THREE.MeshBasicMaterial | null>(null)

const textureCube = ref<THREE.CubeTexture | null>(null)
const textureEquirec = ref<THREE.Texture | null>(null)

const params = ref({
  Refraction: false,
  backgroundRotationX: false,
  backgroundRotationY: true,
  backgroundRotationZ: false,
  syncMaterial: true
})

let initialized = false

const { gui } = useGui({ width: 300 })

function applyCubeTexture() {
  if (!scene.value || !material.value || !textureCube.value) return

  scene.value.background = textureCube.value
  material.value.envMap = textureCube.value
  material.value.needsUpdate = true
}

function applyEquirectangularTexture() {
  if (!scene.value || !material.value || !textureEquirec.value) return

  scene.value.background = textureEquirec.value
  material.value.envMap = textureEquirec.value
  material.value.needsUpdate = true
}

function updateMapping(isRefraction: boolean) {
  if (!textureEquirec.value || !textureCube.value || !material.value) return

  if (isRefraction) {
    textureEquirec.value.mapping = THREE.EquirectangularRefractionMapping
    textureCube.value.mapping = THREE.CubeRefractionMapping
  } else {
    textureEquirec.value.mapping = THREE.EquirectangularReflectionMapping
    textureCube.value.mapping = THREE.CubeReflectionMapping
  }

  material.value.needsUpdate = true
}

function animate() {
  if (!scene.value || !material.value) return

  if (params.value.backgroundRotationX) {
    scene.value.backgroundRotation.x += 0.001
  }

  if (params.value.backgroundRotationY) {
    scene.value.backgroundRotation.y += 0.001
  }

  if (params.value.backgroundRotationZ) {
    scene.value.backgroundRotation.z += 0.001
  }

  if (params.value.syncMaterial) {
    material.value.envMapRotation.copy(scene.value.backgroundRotation)
  }
}

function initScene() {
  if (initialized || !scene.value || !material.value) return
  const geometry = new THREE.IcosahedronGeometry(1, 15)
  if (sphereMeshRef.value?.setGeometry) {
    sphereMeshRef.value.setGeometry(geometry)
  } else if (sphereMeshRef.value?.mesh) {
    sphereMeshRef.value.mesh.geometry = geometry
  }

  const cubeTextureLoader = new THREE.CubeTextureLoader()
  cubeTextureLoader.setPath('/textures/cube/Bridge2/')

  textureCube.value = cubeTextureLoader.load(
    ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'],
    () => {
      applyCubeTexture()
    }
  )

  const textureLoader = new THREE.TextureLoader()
  textureEquirec.value = textureLoader.load('/textures/2294472375_24a3b8ef46_o.jpg', () => {
    textureEquirec.value!.mapping = THREE.EquirectangularReflectionMapping
    textureEquirec.value!.colorSpace = THREE.SRGBColorSpace
  })

  gui.add({ Cube: applyCubeTexture }, 'Cube').name('Cube Texture')
  gui
    .add({ Equirectangular: applyEquirectangularTexture }, 'Equirectangular')
    .name('Equirectangular Map')

  gui.add(params.value, 'Refraction').onChange(updateMapping)

  gui.add(params.value, 'backgroundRotationX').name('Background Rotation X')
  gui.add(params.value, 'backgroundRotationY').name('Background Rotation Y')
  gui.add(params.value, 'backgroundRotationZ').name('Background Rotation Z')

  gui.add(params.value, 'syncMaterial').name('Sync Material Rotation')

  initialized = true
}

watch(
  [canvasRef, materialRef, sphereMeshRef],
  async () => {
    await nextTick()

    if (sceneRef.value.scene) {
      scene.value = sceneRef.value.scene
    }

    if (materialRef.value?.material) {
      material.value = materialRef.value.material
    }

    if (scene.value && material.value && sphereMeshRef.value) {
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

  if (materialRef.value?.material) {
    material.value = materialRef.value.material
  }

  if (scene.value && material.value && sphereMeshRef.value) {
    initScene()
  }
})
</script>
