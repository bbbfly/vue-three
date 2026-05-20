<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#050505">
      <TPerspectiveCamera :fov="27" :near="1" :far="3500" :position="[0, 0, 64]" />

      <THemisphereLight :intensity="3" />

      <TMesh ref="meshRef">
        <TBufferGeometry ref="geometryRef" :attributes="geometryAttributes" />
        <TMeshPhongMaterial :side="2" :vertex-colors="true" :wireframe="wireframe" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  THemisphereLight,
  TMesh,
  TBufferGeometry,
  TMeshPhongMaterial
} from '@vue-three/vue-three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const meshRef = ref<any>(null)
const geometryRef = ref<any>(null)

const geometryAttributes = ref<Record<string, THREE.BufferAttribute>>({})

const wireframe = ref<boolean>(false)
const gui = new GUI()
onMounted(() => {
  createIndexedGeometry()
  gui.add({ wireframe: wireframe.value }, 'wireframe').onChange((value: boolean) => {
    wireframe.value = value
  })
})
onBeforeUnmount(() => {
  gui.destroy()
})

function createIndexedGeometry() {
  const indices: number[] = []
  const vertices: number[] = []
  const normals: number[] = []
  const colors: number[] = []

  const size = 20
  const segments = 10

  const halfSize = size / 2
  const segmentSize = size / segments

  const color = new THREE.Color()

  for (let i = 0; i <= segments; i++) {
    const y = (i * segmentSize) - halfSize

    for (let j = 0; j <= segments; j++) {
      const x = (j * segmentSize) - halfSize

      vertices.push(x, -y, 0)
      normals.push(0, 0, 1)

      const r = (x / size) + 0.5
      const g = (y / size) + 0.5

      color.setRGB(r, g, 1)

      colors.push(color.r, color.g, color.b)
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + (j + 1)
      const b = i * (segments + 1) + j
      const c = (i + 1) * (segments + 1) + j
      const d = (i + 1) * (segments + 1) + (j + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3)
  const normalAttribute = new THREE.Float32BufferAttribute(normals, 3)
  const colorAttribute = new THREE.Float32BufferAttribute(colors, 3)

  geometryAttributes.value = {
    position: positionAttribute,
    normal: normalAttribute,
    color: colorAttribute
  }

  if (geometryRef.value?.geometry) {
    geometryRef.value.geometry.setIndex(indices)
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