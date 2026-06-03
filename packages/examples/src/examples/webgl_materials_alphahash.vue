<template>
  <TCanvas antialias>
    <TScene>
      <TPerspectiveCamera :position="[amount, amount, amount]" :fov="60" :near="0.1" :far="100" />
      <TOrbitControls :enable-zoom="false" :enable-pan="false" />

      <TInstancedMesh ref="instancedMesh" :instance-count="count">
        <TIcosahedron :args="[0.5, 3]" />
        <TMeshStandardMaterial color="0xffffff" :alpha-hash="true" :opacity="0.5" />
      </TInstancedMesh>

      <TAmbientLight :intensity="0.5" />
      <TDirectionalLight :intensity="1" :position="[10, 10, 10]" />
    </TScene>

    <TEffectComposer>
      <TRenderPass />
      <TTAARenderPass :sample-level="2" :unbiased="true" />
      <TOutputPass />
    </TEffectComposer>
  </TCanvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TInstancedMesh,
  TIcosahedron,
  TMeshStandardMaterial,
  TAmbientLight,
  TDirectionalLight,
  TEffectComposer,
  TRenderPass,
  TTAARenderPass,
  TOutputPass
} from '@vue-three/vue-three'
import * as THREE from 'three'

const amount = 3
const count = Math.pow(amount, 3)
const instancedMesh = ref<typeof TInstancedMesh>()

onMounted(() => {
  if (instancedMesh.value?.mesh) {
    const mesh = instancedMesh.value.mesh
    let i = 0
    const offset = (amount - 1) / 2
    const matrix = new THREE.Matrix4()
    const color = new THREE.Color()

    for (let x = 0; x < amount; x++) {
      for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
          matrix.setPosition(offset - x, offset - y, offset - z)
          mesh.setMatrixAt(i, matrix)
          mesh.setColorAt(i, color.setHex(Math.random() * 0xffffff))
          i++
        }
      }
    }

    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor.needsUpdate = true
  }
})
</script>

<style scoped></style>
