<template>
  <TCanvas antialias @animate="animate">
    <TScene :background="mapBg">
      <TPerspectiveCamera :position="[0, 0, 600]" :fov="70" />

      <template
        v-for="(textureItem, textureIndex) in textureItems"
        :key="'texture-group-' + textureIndex"
      >
        <template
          v-for="(blending, blendingIndex) in blendings"
          :key="'blending-' + textureIndex + '-' + blendingIndex"
        >
          <TMesh :position="[getX(blendingIndex), textureItem.y, 0]">
            <TPlane :args="[100, 100]" />
            <TMeshBasicMaterial
              :transparent="true"
              :blending="blending.constant"
              :premultiplied-alpha="true"
            >
              <TTexture :url="textureItem.url" color-space="srgb" />
            </TMeshBasicMaterial>
          </TMesh>

          <TMesh :position="[getX(blendingIndex), textureItem.y - 75, 0]">
            <TPlane :args="[100, 25]" />
            <TMeshBasicMaterial :transparent="true">
              <TTexture :url="labelTextures[blendingIndex]" color-space="srgb" />
            </TMeshBasicMaterial>
          </TMesh>
        </template>
      </template>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TMesh,
  TPlane,
  TMeshBasicMaterial,
  TTexture
} from '@vue-three/vue-three'
import * as THREE from 'three'

const mapBg = ref<THREE.CanvasTexture | null>(null)
const labelTextures = ref<string[]>([])

const blendings = [
  { name: 'No', constant: THREE.NoBlending },
  { name: 'Normal', constant: THREE.NormalBlending },
  { name: 'Additive', constant: THREE.AdditiveBlending },
  { name: 'Subtractive', constant: THREE.SubtractiveBlending },
  { name: 'Multiply', constant: THREE.MultiplyBlending }
]

const textureItems = [
  { url: '/textures/uv_grid_opengl.jpg', y: 300 },
  { url: '/textures/sprite0.jpg', y: 150 },
  { url: '/textures/sprite0.png', y: 0 },
  { url: '/textures/lensflare/lensflare0.png', y: -150 },
  { url: '/textures/lensflare/lensflare0_alpha.png', y: -300 }
]

function getX(index: number): number {
  return (index - blendings.length / 2) * 110
}

function createBackgroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = canvas.height = 128

  ctx.fillStyle = '#ddd'
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = '#555'
  ctx.fillRect(0, 0, 64, 64)
  ctx.fillStyle = '#999'
  ctx.fillRect(32, 32, 32, 32)
  ctx.fillStyle = '#555'
  ctx.fillRect(64, 64, 64, 64)
  ctx.fillStyle = '#777'
  ctx.fillRect(96, 96, 32, 32)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(64, 32)

  return texture
}

function generateLabelTexture(text: string): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = 128
  canvas.height = 32

  ctx.fillStyle = 'rgba( 0, 0, 0, 0.95 )'
  ctx.fillRect(0, 0, 128, 32)

  ctx.fillStyle = 'white'
  ctx.font = 'bold 12pt arial'
  ctx.fillText(text, 10, 22)

  return canvas.toDataURL()
}

onMounted(() => {
  mapBg.value = createBackgroundTexture()
  labelTextures.value = blendings.map(b => generateLabelTexture(b.name))
})

function animate() {
  if (mapBg.value) {
    const time = Date.now() * 0.00025
    const ox = (((time * -0.01 * mapBg.value.repeat.x) % 1) + 1) % 1
    const oy = (((time * -0.01 * mapBg.value.repeat.y) % 1) + 1) % 1
    mapBg.value.offset.set(ox, oy)
  }
}
</script>

<style scoped></style>
