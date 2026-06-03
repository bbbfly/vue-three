<template>
  <TCanvas antialias :background="0xefd1b5" :enable-controls="false">
    <TScene ref="sceneRef" :fog="fogConfig" :background="0xefd1b5">
      <TPerspectiveCamera
        ref="cameraRef"
        :fov="60"
        :near="1"
        :far="10000"
        :position="[100, 800, -800]"
        :look-at-target="[-100, 810, -800]"
      />
      <TFirstPersonControls ref="controlsRef" :movement-speed="150" :look-speed="0.1" />

      <TMesh ref="meshRef">
        <TBufferGeometry ref="geometryRef" />
        <TMeshBasicMaterial v-if="textureCanvas">
          <TCanvasTexture
            ref="textureRef"
            :canvas="textureCanvas"
            :wrap-s="THREE.ClampToEdgeWrapping"
            :wrap-t="THREE.ClampToEdgeWrapping"
            :color-space="THREE.SRGBColorSpace"
          />
        </TMeshBasicMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TFirstPersonControls,
  TMesh,
  TMeshBasicMaterial,
  TBufferGeometry,
  TCanvasTexture
} from '@vue-three/vue-three'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'

const cameraRef = ref<any>(null)
const geometryRef = ref<any>(null)

const worldWidth = 256
const worldDepth = 256

const textureCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  nextTick(() => {
    initTerrain()
  })
})

function generateHeight(width: number, height: number): Uint8Array {
  let seed = Math.PI / 4

  const customRandom = function () {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  const size = width * height
  const data = new Uint8Array(size)
  const perlin = new ImprovedNoise()
  const z = customRandom() * 100

  let quality = 1

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < size; i++) {
      const x = i % width
      const y = Math.floor(i / width)
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75)
    }
    quality *= 5
  }

  return data
}

function generateTexture(data: Uint8Array, width: number, height: number): HTMLCanvasElement {
  const vector3 = new THREE.Vector3(0, 0, 0)
  const sun = new THREE.Vector3(1, 1, 1)
  sun.normalize()

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')!
  context.fillStyle = '#000'
  context.fillRect(0, 0, width, height)

  const image = context.getImageData(0, 0, canvas.width, canvas.height)
  const imageData = image.data

  for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
    vector3.x = data[j - 2] - data[j + 2]
    vector3.y = 2
    vector3.z = data[j - width * 2] - data[j + width * 2]
    vector3.normalize()

    const shade = vector3.dot(sun)

    imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007)
    imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007)
    imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007)
  }

  context.putImageData(image, 0, 0)

  const canvasScaled = document.createElement('canvas')
  canvasScaled.width = width * 4
  canvasScaled.height = height * 4

  const scaledContext = canvasScaled.getContext('2d')!
  scaledContext.scale(4, 4)
  scaledContext.drawImage(canvas, 0, 0)

  const scaledImage = scaledContext.getImageData(0, 0, canvasScaled.width, canvasScaled.height)
  const scaledImageData = scaledImage.data

  for (let i = 0, l = scaledImageData.length; i < l; i += 4) {
    const v = Math.floor(Math.random() * 5)
    scaledImageData[i] += v
    scaledImageData[i + 1] += v
    scaledImageData[i + 2] += v
  }

  scaledContext.putImageData(scaledImage, 0, 0)

  return canvasScaled
}

function initTerrain() {
  const data = generateHeight(worldWidth, worldDepth)

  // 创建 PlaneGeometry 并修改顶点
  const geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1)
  geometry.rotateX(-Math.PI / 2)

  const vertices = geometry.attributes.position.array as Float32Array
  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 1] = data[i] * 10
  }

  geometry.attributes.position.needsUpdate = true
  geometry.computeVertexNormals()

  // 将几何体复制到 TBufferGeometry
  if (geometryRef.value?.geometry) {
    geometryRef.value.geometry.copy(geometry)
  }

  // 生成纹理
  textureCanvas.value = generateTexture(data, worldWidth, worldDepth)

  // 清理临时几何体
  geometry.dispose()
}

const fogConfig = {
  type: 'exp',
  color: 0xefd1b5,
  density: 0.0025
}
</script>

<style scoped></style>
