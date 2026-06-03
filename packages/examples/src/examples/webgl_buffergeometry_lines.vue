<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#000000">
      <TPerspectiveCamera :fov="27" :near="1" :far="4000" :position="[0, 0, 2750]" />

      <TLine ref="lineRef">
        <TBufferGeometry :attributes="geometryAttributes" :morph-attributes="morphAttributes" />
        <TLineBasicMaterial :vertex-colors="true" />
      </TLine>
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
  TLine,
  TBufferGeometry,
  TLineBasicMaterial
} from '@vue-three/vue-three'

const lineRef = ref<any>(null)
const geometryAttributes = shallowRef<Record<string, THREE.BufferAttribute>>({})
const morphAttributes = shallowRef<Record<string, THREE.BufferAttribute[]>>({})

const segments = 10000
const r = 800
let t = 0

onMounted(() => {
  const positions: number[] = []
  const colors: number[] = []
  const morphData: number[] = []

  for (let i = 0; i < segments; i++) {
    const x = Math.random() * r - r / 2
    const y = Math.random() * r - r / 2
    const z = Math.random() * r - r / 2

    positions.push(x, y, z)

    colors.push(x / r + 0.5)
    colors.push(y / r + 0.5)
    colors.push(z / r + 0.5)

    const mx = Math.random() * r - r / 2
    const my = Math.random() * r - r / 2
    const mz = Math.random() * r - r / 2
    morphData.push(mx, my, mz)
  }

  geometryAttributes.value = {
    position: new THREE.Float32BufferAttribute(positions, 3),
    color: new THREE.Float32BufferAttribute(colors, 3)
  }

  const morphTarget = new THREE.Float32BufferAttribute(morphData, 3)
  morphTarget.name = 'target1'
  morphAttributes.value = {
    position: [morphTarget]
  }
})

function onAnimate({ delta }) {
  const time = Date.now() * 0.001
  if (lineRef.value?.line) {
    lineRef.value.line.rotation.x = time * 0.25
    lineRef.value.line.rotation.y = time * 0.5

    t += delta * 0.5
    lineRef.value.line.morphTargetInfluences[0] = Math.abs(Math.sin(t))
  }
}
</script>

<style scoped></style>
