<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#050505" :fog="{ color: '#050505', near: 2000, far: 3500 }">
      <TPerspectiveCamera :fov="27" :near="1" :far="3500" :position="[0, 0, 2750]" />

      <TAmbientLight :color="0xcccccc" />
      <TDirectionalLight :color="0xffffff" :intensity="1.5" :position="[1, 1, 1]" />
      <TDirectionalLight :color="0xffffff" :intensity="4.5" :position="[0, -1, 0]" />

      <TMesh ref="meshRef" v-if="geometryAttributes.position">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TMeshPhongMaterial :color="0xd5d5d5" :specular="0xffffff" :shininess="250" :side="2" :vertex-colors="true" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TBufferGeometry,
  TMeshPhongMaterial
} from '@vue-three/vue-three'

const meshRef = ref<any>(null)
const geometryAttributes = ref<Record<string, THREE.BufferAttribute>>({})

onMounted(() => {
  createBufferGeometry()
})

function createBufferGeometry() {
  const triangles = 500000
  const positions: number[] = []
  const normals: number[] = []
  const colors: number[] = []

  const color = new THREE.Color()
  const n = 800
  const n2 = n / 2
  const d = 12
  const d2 = d / 2

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()
  const cb = new THREE.Vector3()
  const ab = new THREE.Vector3()

  for (let i = 0; i < triangles; i++) {
    const x = Math.random() * n - n2
    const y = Math.random() * n - n2
    const z = Math.random() * n - n2

    const ax = x + Math.random() * d - d2
    const ay = y + Math.random() * d - d2
    const az = z + Math.random() * d - d2

    const bx = x + Math.random() * d - d2
    const by = y + Math.random() * d - d2
    const bz = z + Math.random() * d - d2

    const cx = x + Math.random() * d - d2
    const cy = y + Math.random() * d - d2
    const cz = z + Math.random() * d - d2

    positions.push(ax, ay, az)
    positions.push(bx, by, bz)
    positions.push(cx, cy, cz)

    pA.set(ax, ay, az)
    pB.set(bx, by, bz)
    pC.set(cx, cy, cz)

    cb.subVectors(pC, pB)
    ab.subVectors(pA, pB)
    cb.cross(ab)
    cb.normalize()

    const nx = cb.x
    const ny = cb.y
    const nz = cb.z

    normals.push(nx * 32767, ny * 32767, nz * 32767)
    normals.push(nx * 32767, ny * 32767, nz * 32767)
    normals.push(nx * 32767, ny * 32767, nz * 32767)

    const vx = x / n + 0.5
    const vy = y / n + 0.5
    const vz = z / n + 0.5

    color.setRGB(vx, vy, vz)

    colors.push(color.r * 255, color.g * 255, color.b * 255)
    colors.push(color.r * 255, color.g * 255, color.b * 255)
    colors.push(color.r * 255, color.g * 255, color.b * 255)
  }

  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3)
  const normalAttribute = new THREE.Int16BufferAttribute(normals, 3)
  const colorAttribute = new THREE.Uint8BufferAttribute(colors, 3)

  normalAttribute.normalized = true
  colorAttribute.normalized = true

  geometryAttributes.value = {
    position: positionAttribute,
    normal: normalAttribute,
    color: colorAttribute
  }

  if (meshRef.value?.mesh) {
    meshRef.value.mesh.geometry.computeBoundingSphere()
  }
}

function onAnimate() {
  const time = Date.now() * 0.001
  if (meshRef.value?.mesh) {
    meshRef.value.mesh.rotation.x = time * 0.25
    meshRef.value.mesh.rotation.y = time * 0.5
  }
}
</script>

<style scoped></style>