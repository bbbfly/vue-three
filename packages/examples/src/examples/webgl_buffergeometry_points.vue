<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#050505" :fog="{ color: '#050505', near: 2000, far: 3500 }">
      <TPerspectiveCamera :fov="27" :near="5" :far="3500" :position="[0, 0, 2750]" />

      <TPoints ref="pointsRef">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TPointsMaterial :size="15" :vertex-colors="true" />
      </TPoints>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TPoints,
  TBufferGeometry,
  TPointsMaterial
} from '@vue-three/vue-three'

const pointsRef = ref<any>(null)
const geometryAttributes = shallowRef<Record<string, THREE.BufferAttribute>>({})

const particles = 500000
const n = 1000
const n2 = n / 2

onMounted(() => {
  const positions: number[] = []
  const colors: number[] = []
  const color = new THREE.Color()

  for (let i = 0; i < particles; i++) {
    const x = Math.random() * n - n2
    const y = Math.random() * n - n2
    const z = Math.random() * n - n2

    positions.push(x, y, z)

    const vx = x / n + 0.5
    const vy = y / n + 0.5
    const vz = z / n + 0.5

    color.setRGB(vx, vy, vz)

    colors.push(color.r, color.g, color.b)
  }

  const positionAttr = new THREE.Float32BufferAttribute(positions, 3)
  const colorAttr = new THREE.Float32BufferAttribute(colors, 3)
  positionAttr.needsUpdate = true
  colorAttr.needsUpdate = true

  geometryAttributes.value = {
    position: positionAttr,
    color: colorAttr
  }
})

function onAnimate() {
  const time = Date.now() * 0.001
  if (pointsRef.value?.mesh) {
    pointsRef.value.mesh.rotation.x = time * 0.25
    pointsRef.value.mesh.rotation.y = time * 0.5
  }
}
</script>

<style scoped></style>
