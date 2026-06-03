<template>
  <TCanvas ref="canvasRef" antialias :background="0xbfd1e5">
    <TScene ref="sceneRef" :background="0xbfd1e5">
      <TPerspectiveCamera ref="cameraRef" :fov="60" :near="10" :far="20000" />
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

      <TMesh ref="helperRef">
        <TConeGeometry :args="[20, 100, 3]" />
        <TMeshNormalMaterial />
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
  TMesh,
  TMeshBasicMaterial,
  TMeshNormalMaterial,
  TBufferGeometry,
  TCanvasTexture,
  TConeGeometry,
  useRaycaster
} from '@vue-three/vue-three'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'

const cameraRef = ref<any>(null)
const controlsRef = ref<any>(null)
const geometryRef = ref<any>(null)
const meshRef = ref<any>(null)
const helperRef = ref<any>(null)
const canvasRef = ref<TCanvas>(null)

const worldWidth = 256
const worldDepth = 256
const worldHalfWidth = worldWidth / 2
const worldHalfDepth = worldDepth / 2

const textureCanvas = ref<HTMLCanvasElement | null>(null)

const { intersectObject } = useRaycaster(canvasRef)

onMounted(() => {
  nextTick(() => {
    initTerrain()
    setupRaycaster()
  })
})

function generateHeight(width: number, height: number): Uint8Array {
  const size = width * height
  const data = new Uint8Array(size)
  const perlin = new ImprovedNoise()
  const z = Math.random() * 100

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

  const geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1)
  geometry.rotateX(-Math.PI / 2)

  const vertices = geometry.attributes.position.array as Float32Array
  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 1] = data[i] * 10
  }

  geometry.computeVertexNormals()

  const targetY = data[worldHalfWidth + worldHalfDepth * worldWidth] + 500

  if (cameraRef.value?.camera) {
    cameraRef.value.camera.position.y = targetY + 2000
    cameraRef.value.camera.position.x = 2000
  }

  if (controlsRef.value?.controls) {
    controlsRef.value.controls.target.y = targetY
    controlsRef.value.controls.update()
  }

  if (geometryRef.value?.geometry) {
    geometryRef.value.geometry.copy(geometry)
  }

  textureCanvas.value = generateTexture(data, worldWidth, worldDepth)

  // if (helperRef.value?.mesh) {
  //   const helperGeometry = helperRef.value.mesh.geometry as THREE.ConeGeometry
  //   helperGeometry.translate(0, 50, 0)
  //   helperGeometry.rotateX(Math.PI / 2)
  // }

  geometry.dispose()
}

function setupRaycaster() {
  if (meshRef.value?.mesh) {
    intersectObject(meshRef.value.mesh, result => {
      if (result.intersects.length > 0 && helperRef.value?.mesh) {
        helperRef.value.mesh.position.set(0, 0, 0)
        helperRef.value.mesh.lookAt(result.intersects[0].face.normal)
        helperRef.value.mesh.position.copy(result.intersects[0].point)
      }
    })
  }
}
</script>

<style scoped></style>
