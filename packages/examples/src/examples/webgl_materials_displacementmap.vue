<template>
  <TCanvas ref="canvasRef" antialias @animate="animate">
    <TScene ref="sceneRef">
      <TOrthographicCamera ref="cameraRef" :left="-height * aspect" :right="height * aspect" :top="height"
        :bottom="-height" :near="1" :far="10000" :position="[0, 0, 1500]" />
      <TOrbitControls ref="controlsRef" :enable-zoom="false" :enable-damping="true" />

      <TAmbientLight ref="ambientLightRef" color="#ffffff" :intensity="settings.ambientIntensity" />

      <TPointLight ref="pointLightRef" color="#ff0000" :intensity="1.5" :position="[0, 0, 2500]" />

      <TPointLight color="#ff6666" :intensity="3" :position="[0, 0, 0]" />

      <TPointLight color="#0000ff" :intensity="1.5" :position="[-1000, 0, 1000]" />

      <TMesh ref="meshRef" :scale="[25, 25, 25]">
        <TOBJLoader src="/models/obj/ninja/ninjaHead_Low.obj" />
        <TMeshStandardMaterial ref="materialRef" color="#c1c1c1" :side="THREE.DoubleSide">
          <TCubeTexture :urls="urls" />
          <TTexture url="/models/obj/ninja/normal.png" map-type="normalMap" />
          <TTexture url="/models/obj/ninja/ao.jpg" map-type="aoMap" />
          <TTexture url="/models/obj/ninja/displacement.jpg" map-type="displacementMap" />
        </TMeshStandardMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, shallowRef } from 'vue'
import * as THREE from 'three'
import { TCubeTexture, TTexture, TOBJLoader, useGui, TCanvas, TScene, TOrthographicCamera, TOrbitControls, TAmbientLight, TPointLight, TMesh, TMeshStandardMaterial } from '@vue-three/vue-three'

const materialRef = shallowRef<any>(null)
const pointLightRef = shallowRef<any>(null)

const height = 500
const aspect = ref(1)
let r = 0

const settings = ref({
  metalness: 1.0,
  roughness: 0.4,
  ambientIntensity: 0.2,
  aoMapIntensity: 1.0,
  envMapIntensity: 1.0,
  displacementScale: 2.436143,
  // normalScale: 1.0
})


const { gui } = useGui({ width: 300 })

function animate() {
  const pointLight = pointLightRef.value.light
  if (pointLight) {
    pointLight.position.x = 2500 * Math.cos(r)
    pointLight.position.z = 2500 * Math.sin(r)
    r += 0.01
  }
}

const urls = [
  '/textures/cube/SwedishRoyalCastle/px.jpg',
  '/textures/cube/SwedishRoyalCastle/nx.jpg',
  '/textures/cube/SwedishRoyalCastle/py.jpg',
  '/textures/cube/SwedishRoyalCastle/ny.jpg',
  '/textures/cube/SwedishRoyalCastle/pz.jpg',
  '/textures/cube/SwedishRoyalCastle/nz.jpg',
]
function initScene() {
  const material = materialRef.value.material as THREE.MeshStandardMaterial
  // material.roughness = settings.value.roughness
  // material.value.metalness = settings.value.metalness
  // material.value.normalScale = new THREE.Vector2(1, -1)
  material.aoMapIntensity = 1
  // material.value.displacementScale = settings.value.displacementScale
  material.displacementBias = -0.428408
  material.envMapIntensity = settings.value.envMapIntensity
  material.needsUpdate = true


  gui.add(settings.value, 'metalness').min(0).max(1)

  gui.add(settings.value, 'roughness').min(0).max(1)

  gui.add(settings.value, 'aoMapIntensity').min(0).max(1)

  gui.add(settings.value, 'ambientIntensity').min(0).max(1)

  gui.add(settings.value, 'envMapIntensity').min(0).max(3)

  gui.add(settings.value, 'displacementScale').min(0)

  // gui.add(settings.value, 'normalScale', -1, 1)

}


onMounted(async () => {
  await nextTick()
  await nextTick()
  initScene()
})
</script>