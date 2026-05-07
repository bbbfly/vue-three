<template>
  <TCanvas antialias :clear-color="'#f0f0f0'">
    <TScene>
      <TPerspectiveCamera :fov="50" :near="1" :far="10000" :position="[-1000, 500, 1500]" />
      <TOrbitControls ref="controlsRef" :enable-damping="true" />

      <THemisphereLight :sky-color="0xffffff" :ground-color="0x444444" :intensity="4" :position="[-25, 100, 50]" />

      <TLineSegments :geometry="roomGeometry" :color="0x000000" :opacity="0.2" :transparent="true" />

      <TMesh>
        <TPlane :args="[1024, 768]" />
        <TMeshBasicMaterial :color="0x2200ff" :blending="THREE.NoBlending" :opacity="0" :premultiplied-alpha="true" />
      </TMesh>

      <TMesh ref="frameMeshRef">
        <TExtrudeGeometry :shape="frameShape" :args="extrudeSettings" />
        <TMeshStandardMaterial :color="0x2200ff" />
      </TMesh>
      <TMesh ref="backMeshRef" :position="[0, 0, -25]">
        <TPlane :args="[1024 + 50 * 2, 768 + 50 * 2]" />
        <TMeshStandardMaterial :color="0x2200ff" />
      </TMesh>

      <TCSS3DRenderer>
        <TCSS3DObject :position="[0, 0, 0]">
          <iframe ref="iframeRef" :style="iframeStyle" src="/"></iframe>
        </TCSS3DObject>
      </TCSS3DRenderer>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  THemisphereLight,
  TLineSegments,
  TMesh,
  TPlane,
  TMeshBasicMaterial,
  TMeshStandardMaterial,
  TExtrudeGeometry,
  TCSS3DRenderer,
  TCSS3DObject
} from '@vue-three/vue-three'

const controlsRef = ref<any>(null)
const frameMeshRef = ref<any>(null)
const backMeshRef = ref<any>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)

const WIDTH = 1024
const HEIGHT = 768
const THICKNESS = 50

const roomGeometry = computed(() => {
  const boxGeometry = new THREE.BoxGeometry(4000, 2000, 4000, 10, 5, 10)
  return new THREE.EdgesGeometry(boxGeometry)
})

const frameShape = computed(() => {
  const shape = new THREE.Shape()
  shape.moveTo(-(WIDTH / 2 + THICKNESS), -(HEIGHT / 2 + THICKNESS))
  shape.lineTo(WIDTH / 2 + THICKNESS, -(HEIGHT / 2 + THICKNESS))
  shape.lineTo(WIDTH / 2 + THICKNESS, HEIGHT / 2 + THICKNESS)
  shape.lineTo(-(WIDTH / 2 + THICKNESS), HEIGHT / 2 + THICKNESS)
  shape.lineTo(-(WIDTH / 2 + THICKNESS), -(HEIGHT / 2 + THICKNESS))

  const innerHole = new THREE.Path()
  innerHole.moveTo(-WIDTH / 2, -HEIGHT / 2)
  innerHole.lineTo(WIDTH / 2, -HEIGHT / 2)
  innerHole.lineTo(WIDTH / 2, HEIGHT / 2)
  innerHole.lineTo(-WIDTH / 2, HEIGHT / 2)
  innerHole.lineTo(-WIDTH / 2, -HEIGHT / 2)

  shape.holes.push(innerHole)
  return shape
})

const extrudeSettings = {
  depth: THICKNESS,
  bevelEnabled: false
}

const iframeStyle = {
  width: '1028px',
  height: '768px',
  border: '0px',
  backfaceVisibility: 'hidden'
}

onMounted(async () => {
  await nextTick()

  if (backMeshRef.value?.mesh) {
    backMeshRef.value.mesh.position.set(0, 0, -THICKNESS / 2)
    backMeshRef.value.mesh.rotation.y = Math.PI
  }

  if (frameMeshRef.value?.mesh) {
    frameMeshRef.value.mesh.position.z = -THICKNESS / 2
  }

  if (controlsRef.value?.controls && iframeRef.value) {
    controlsRef.value.controls.addEventListener('start', () => {
      if (iframeRef.value) {
        iframeRef.value.style.pointerEvents = 'none'
      }
    })
    controlsRef.value.controls.addEventListener('end', () => {
      if (iframeRef.value) {
        iframeRef.value.style.pointerEvents = 'auto'
      }
    })
  }
})

onUnmounted(() => { })
</script>