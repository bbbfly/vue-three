<template>
  <TCanvas antialias @animate="animate">
    <TScene :background="mapBg">
      <TPerspectiveCamera :position="[0, 0, 700]" :near="0.1" :far="1000" :fov="80" />

      <template v-for="(dstItem, dstIndex) in dstFactors" :key="'dst-' + dstIndex">
        <template
          v-for="(srcItem, srcIndex) in srcFactors"
          :key="'src-' + dstIndex + '-' + srcIndex"
        >
          <TMesh :position="[getX(srcIndex), getY(dstIndex), 0]" :matrix-auto-update="false">
            <TPlane :args="[100, 100]" :side="2" />
            <TMeshBasicMaterial
              :transparent="true"
              :blending="THREE.CustomBlending"
              :blend-src="srcItem.constant"
              :blend-dst="dstItem.constant"
              :blend-equation="blendEquation"
              :side="2"
            >
              <TTexture url="/textures/lensflare/lensflare0_alpha.png" color-space="srgb" />
            </TMeshBasicMaterial>
          </TMesh>
        </template>
      </template>

      <template v-for="(srcItem, srcIndex) in srcFactors" :key="'src-label-' + srcIndex">
        <TMesh :position="[getX(srcIndex), getY(-1), 0]" :matrix-auto-update="false">
          <TPlane :args="[100, 25]" />
          <TMeshBasicMaterial :transparent="true">
            <TTexture :url="srcLabelTextures[srcIndex]" color-space="srgb" />
          </TMeshBasicMaterial>
        </TMesh>
      </template>

      <template v-for="(dstItem, dstIndex) in dstFactors" :key="'dst-label-' + dstIndex">
        <TMesh :position="[getX(-1), getY(dstIndex) - 50, 0]" :matrix-auto-update="false">
          <TPlane :args="[100, 25]" />
          <TMeshBasicMaterial :transparent="true">
            <TTexture :url="dstLabelTextures[dstIndex]" color-space="srgb" />
          </TMeshBasicMaterial>
        </TMesh>
      </template>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const mapBg = ref<THREE.CanvasTexture | null>(null)
const srcLabelTextures = ref<string[]>([])
const dstLabelTextures = ref<string[]>([])
const blendEquation = ref<number>(THREE.AddEquation)

let gui: GUI | null = null

const equations = {
  Add: THREE.AddEquation,
  Subtract: THREE.SubtractEquation,
  ReverseSubtract: THREE.ReverseSubtractEquation,
  Min: THREE.MinEquation,
  Max: THREE.MaxEquation
}

const srcFactors = [
  { name: 'Zero', constant: THREE.ZeroFactor },
  { name: 'One', constant: THREE.OneFactor },
  { name: 'SrcColor', constant: THREE.SrcColorFactor },
  { name: 'OneMinusSrcColor', constant: THREE.OneMinusSrcColorFactor },
  { name: 'SrcAlpha', constant: THREE.SrcAlphaFactor },
  { name: 'OneMinusSrcAlpha', constant: THREE.OneMinusSrcAlphaFactor },
  { name: 'DstAlpha', constant: THREE.DstAlphaFactor },
  { name: 'OneMinusDstAlpha', constant: THREE.OneMinusDstAlphaFactor },
  { name: 'DstColor', constant: THREE.DstColorFactor },
  { name: 'OneMinusDstColor', constant: THREE.OneMinusDstColorFactor },
  { name: 'SrcAlphaSaturate', constant: THREE.SrcAlphaSaturateFactor }
]

const dstFactors = [
  { name: 'Zero', constant: THREE.ZeroFactor },
  { name: 'One', constant: THREE.OneFactor },
  { name: 'SrcColor', constant: THREE.SrcColorFactor },
  { name: 'OneMinusSrcColor', constant: THREE.OneMinusSrcColorFactor },
  { name: 'SrcAlpha', constant: THREE.SrcAlphaFactor },
  { name: 'OneMinusSrcAlpha', constant: THREE.OneMinusSrcAlphaFactor },
  { name: 'DstAlpha', constant: THREE.DstAlphaFactor },
  { name: 'OneMinusDstAlpha', constant: THREE.OneMinusDstAlphaFactor },
  { name: 'DstColor', constant: THREE.DstColorFactor },
  { name: 'OneMinusDstColor', constant: THREE.OneMinusDstColorFactor }
]

function getX(index: number): number {
  return (index - srcFactors.length / 2) * 110
}

function getY(index: number): number {
  return -(index - dstFactors.length / 2) * 110 + 50
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

function generateLabelTexture(text: string, bg: string): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = 128
  canvas.height = 32

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 128, 32)

  ctx.fillStyle = 'white'
  ctx.font = 'bold 11pt arial'
  ctx.fillText(text, 8, 22)

  return canvas.toDataURL()
}

onMounted(() => {
  mapBg.value = createBackgroundTexture()
  srcLabelTextures.value = srcFactors.map(s => generateLabelTexture(s.name, 'rgba( 0, 150, 0, 1 )'))
  dstLabelTextures.value = dstFactors.map(d => generateLabelTexture(d.name, 'rgba( 150, 0, 0, 1 )'))
  gui = new GUI({ width: 300 })
  gui
    .add({ blendEquation: blendEquation.value }, 'blendEquation', equations)
    .onChange((value: number) => {
      blendEquation.value = value
      console.log(blendEquation.value, '9')
    })
  gui.open()
})

onUnmounted(() => {
  if (gui) {
    gui.destroy()
    gui = null
  }
})

function animate() {
  if (mapBg.value) {
    const time = Date.now() * 0.00025
    const ox = (time * -0.01 * mapBg.value.repeat.x) % 1
    const oy = (time * -0.01 * mapBg.value.repeat.y) % 1
    mapBg.value.offset.set(ox, oy)
  }
}
</script>

<style scoped></style>
