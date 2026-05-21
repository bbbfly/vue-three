<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#050505" :fog="{ color: '#050505', near: 2000, far: 3500 }">
      <TPerspectiveCamera :fov="27" :near="5" :far="3500" :position="[0, 0, 2750]" />

      <TPoints ref="pointsRef">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TPointsMaterial :size="15" :vertexColors="true" />
      </TPoints>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import * as THREE from 'three'
import { TCanvas, TScene, TPerspectiveCamera, TPoints, TBufferGeometry, TPointsMaterial } from '@vue-three/vue-three'

const pointsRef = ref<any>(null)
const geometryAttributes = shallowRef<Record<string, THREE.BufferAttribute>>({})

const particles = 500000

onMounted(() => {
  const arrayBuffer = new ArrayBuffer(particles * 16)

  const interleavedFloat32Buffer = new Float32Array(arrayBuffer)
  const interleavedUint8Buffer = new Uint8Array(arrayBuffer)

  const color = new THREE.Color()
  const n = 1000
  const n2 = n / 2

  for (let i = 0; i < interleavedFloat32Buffer.length; i += 4) {
    const x = Math.random() * n - n2
    const y = Math.random() * n - n2
    const z = Math.random() * n - n2

    interleavedFloat32Buffer[i + 0] = x
    interleavedFloat32Buffer[i + 1] = y
    interleavedFloat32Buffer[i + 2] = z

    const vx = (x / n) + 0.5
    const vy = (y / n) + 0.5
    const vz = (z / n) + 0.5

    color.setRGB(vx, vy, vz)

    const j = (i + 3) * 4

    interleavedUint8Buffer[j + 0] = color.r * 255
    interleavedUint8Buffer[j + 1] = color.g * 255
    interleavedUint8Buffer[j + 2] = color.b * 255
    interleavedUint8Buffer[j + 3] = 0
  }

  const interleavedBuffer32 = new THREE.InterleavedBuffer(interleavedFloat32Buffer, 4)
  const interleavedBuffer8 = new THREE.InterleavedBuffer(interleavedUint8Buffer, 16)

  geometryAttributes.value = {
    position: new THREE.InterleavedBufferAttribute(interleavedBuffer32, 3, 0, false),
    color: new THREE.InterleavedBufferAttribute(interleavedBuffer8, 3, 12, true)
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