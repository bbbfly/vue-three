<template>
  <TCanvas antialias :enable-controls="false">
    <TScene ref="sceneRef" :background="0xbfd1e5">
      <TPerspectiveCamera ref="cameraRef" :fov="60" :near="1" :far="20000" />
      <TFirstPersonControls ref="controlsRef" :movement-speed="1000" :look-speed="0.125" :look-vertical="true" />

      <TAmbientLight :intensity="3" :color="0xeeeeee" />
      <TDirectionalLight :intensity="12" :position="[1, 1, 0.5]" />

      <TMesh ref="meshRef">
        <TBufferGeometry ref="bufferGeometryRef" />
        <TMeshLambertMaterial :side="2">
          <TTexture ref="textureRef" url="/textures/minecraft/atlas.png" :mag-filter="THREE.NearestFilter"
            :color-space="THREE.SRGBColorSpace" />
        </TMeshLambertMaterial>
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
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TMeshLambertMaterial,
  TBufferGeometry,
  TTexture,
} from '@vue-three/vue-three'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

const cameraRef = ref<any>(null)
const bufferGeometryRef = ref<any>(null)

const worldWidth = 128
const worldDepth = 128
const worldHalfWidth = worldWidth / 2
const worldHalfDepth = worldDepth / 2
const timer = new THREE.Timer()
const data = generateHeight(worldWidth, worldDepth)

onMounted(() => {
  timer.connect(document)
  nextTick(async () => {
    await initScene()
  })
})

function generateHeight(width: number, height: number) {
  const data: number[] = []
  const perlin = new ImprovedNoise()
  const size = width * height
  const z = Math.random() * 100

  let quality = 2

  for (let j = 0; j < 4; j++) {
    if (j === 0) {
      for (let i = 0; i < size; i++) data[i] = 0
    }

    for (let i = 0; i < size; i++) {
      const x = i % width
      const y = (i / width) | 0
      data[i] += perlin.noise(x / quality, y / quality, z) * quality
    }

    quality *= 4
  }

  return data
}

function getY(x: number, z: number) {
  return ((data[x + z * worldWidth] * 0.15) | 0)
}

async function initScene() {
  const matrix = new THREE.Matrix4()

  const pxGeometry = new THREE.PlaneGeometry(100, 100)
  pxGeometry.attributes.uv.array[1] = 0.5
  pxGeometry.attributes.uv.array[3] = 0.5
  pxGeometry.rotateY(Math.PI / 2)
  pxGeometry.translate(50, 0, 0)

  const nxGeometry = new THREE.PlaneGeometry(100, 100)
  nxGeometry.attributes.uv.array[1] = 0.5
  nxGeometry.attributes.uv.array[3] = 0.5
  nxGeometry.rotateY(-Math.PI / 2)
  nxGeometry.translate(-50, 0, 0)

  const pyGeometry = new THREE.PlaneGeometry(100, 100)
  pyGeometry.attributes.uv.array[5] = 0.5
  pyGeometry.attributes.uv.array[7] = 0.5
  pyGeometry.rotateX(-Math.PI / 2)
  pyGeometry.translate(0, 50, 0)

  const pzGeometry = new THREE.PlaneGeometry(100, 100)
  pzGeometry.attributes.uv.array[1] = 0.5
  pzGeometry.attributes.uv.array[3] = 0.5
  pzGeometry.translate(0, 0, 50)

  const nzGeometry = new THREE.PlaneGeometry(100, 100)
  nzGeometry.attributes.uv.array[1] = 0.5
  nzGeometry.attributes.uv.array[3] = 0.5
  nzGeometry.rotateY(Math.PI)
  nzGeometry.translate(0, 0, -50)

  const geometries: THREE.BufferGeometry[] = []

  for (let z = 0; z < worldDepth; z++) {
    for (let x = 0; x < worldWidth; x++) {
      const h = getY(x, z)

      matrix.makeTranslation(
        x * 100 - worldHalfWidth * 100,
        h * 100,
        z * 100 - worldHalfDepth * 100
      )

      const px = getY(x + 1, z)
      const nx = getY(x - 1, z)
      const pz = getY(x, z + 1)
      const nzVal = getY(x, z - 1)

      geometries.push(pyGeometry.clone().applyMatrix4(matrix))

      if ((px !== h && px !== h + 1) || x === 0) {
        geometries.push(pxGeometry.clone().applyMatrix4(matrix))
      }

      if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {
        geometries.push(nxGeometry.clone().applyMatrix4(matrix))
      }

      if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {
        geometries.push(pzGeometry.clone().applyMatrix4(matrix))
      }

      if ((nzVal !== h && nzVal !== h + 1) || z === 0) {
        geometries.push(nzGeometry.clone().applyMatrix4(matrix))
      }
    }
  }

  const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries)
  mergedGeometry.computeBoundingSphere()

  if (cameraRef.value?.camera) {
    cameraRef.value.camera.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100
  }

  if (bufferGeometryRef.value?.geometry) {
    bufferGeometryRef.value.geometry.copy(mergedGeometry)
  }

  pxGeometry.dispose()
  nxGeometry.dispose()
  pyGeometry.dispose()
  pzGeometry.dispose()
  nzGeometry.dispose()
  mergedGeometry.dispose()
}

</script>

<style scoped></style>
