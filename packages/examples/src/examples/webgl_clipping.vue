<template>
  <TCanvas ref="canvasRef" antialias :localClippingEnabled="localClippingEnabled" :clippingPlanes="globalClippingPlanes"
    :shadowMap="{ enabled: true }">
    <TScene>
      <TPerspectiveCamera :position="[0, 1.3, 3]" :fov="36" :near="0.25" :far="16" />

      <TAmbientLight :intensity="0.8" />

      <TSpotLight :position="[2, 3, 3]" :intensity="60" :angle="Math.PI / 5" :penumbra="0.2" :castShadow="true"
        :shadow-mapSize="[1024, 1024]" :shadow-camera-near="3" :shadow-camera-far="10" />

      <TDirectionalLight :position="[0, 3, 0]" :intensity="3" :color="0x55505a" :castShadow="true"
        :shadow-camera-near="1" :shadow-camera-far="10" :shadow-camera-right="1" :shadow-camera-left="-1"
        :shadow-camera-top="1" :shadow-camera-bottom="-1" :shadow-mapSize="[1024, 1024]" />

      <TMesh ref="meshRef" :position="[0, 0.8, 0]" :rotation="rotation" :scale="scale" :castShadow="true">
        <TTorusKnotGeometry :args="[0.4, 0.08, 95, 20]" />
        <TMeshPhongMaterial :color="0x80ee10" :shininess="100" :side="THREE.DoubleSide"
          :clippingPlanes="localClippingEnabled ? localClippingPlanes : undefined" :clipShadows="clipShadows"
          :alphaToCoverage="alphaToCoverage" />
      </TMesh>

      <TMesh :rotation="[-Math.PI / 2, 0, 0]" :receiveShadow="true">
        <TPlane :args="[9, 9, 1, 1]" />
        <TMeshPhongMaterial :color="0xa0adaf" :shininess="150" :alphaToCoverage="alphaToCoverage" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TAmbientLight,
  TSpotLight,
  TDirectionalLight,
  TMesh,
  TTorusKnotGeometry,
  TPlane,
  TMeshPhongMaterial
} from '@vue-three/vue-three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const canvasRef = ref()
const meshRef = ref()
const startTime = ref(Date.now())

const localClippingEnabled = ref(true)
const clipShadows = ref(true)
const localPlaneConstant = ref(0.8)
const globalClippingEnabled = ref(false)
const globalPlaneConstant = ref(0.1)
const alphaToCoverage = ref(true)

const rotation = ref([0, 0, 0])
const scale = ref([1, 1, 1])

const localClippingPlanes = computed(() => {
  const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), localPlaneConstant.value)
  return [plane]
})

const globalClippingPlanes = computed(() => {
  if (!globalClippingEnabled.value) return []
  const plane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), globalPlaneConstant.value)
  return [plane]
})

let gui: GUI | null = null
let animationId: number | null = null

function animate() {
  const currentTime = Date.now()
  const time = (currentTime - startTime.value) / 1000

  rotation.value = [time * 0.5, time * 0.2, 0]
  const scaleValue = Math.cos(time) * 0.125 + 0.875
  scale.value = [scaleValue, scaleValue, scaleValue]

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()

  gui = new GUI()

  const props = {
    alphaToCoverage: alphaToCoverage.value
  }

  const folderLocal = gui.addFolder('Local Clipping')

  folderLocal.add({ Enabled: localClippingEnabled.value }, 'Enabled').onChange((v: boolean) => {
    localClippingEnabled.value = v
  })

  folderLocal.add({ Shadows: clipShadows.value }, 'Shadows').onChange((v: boolean) => {
    clipShadows.value = v
  })

  folderLocal.add({ Plane: localPlaneConstant.value }, 'Plane', 0.3, 1.25).onChange((v: number) => {
    localPlaneConstant.value = v
  })

  const folderGlobal = gui.addFolder('Global Clipping')

  folderGlobal.add({ Enabled: globalClippingEnabled.value }, 'Enabled').onChange((v: boolean) => {
    globalClippingEnabled.value = v
  })

  folderGlobal.add({ Plane: globalPlaneConstant.value }, 'Plane', -0.4, 3).onChange((v: number) => {
    globalPlaneConstant.value = v
  })

  gui.add(props, 'alphaToCoverage').onChange((v: boolean) => {
    alphaToCoverage.value = v
  })
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  if (gui !== null) {
    gui.destroy()
  }
})
</script>

<style scoped></style>