<template>
  <TCanvas antialias :enable-controls="false" @animate="onAnimate" @pointermove="onPointerMove">
    <TScene background="#050505" :fog="{ color: '#050505', near: 2000, far: 3500 }">
      <TPerspectiveCamera :fov="27" :near="1" :far="3500" :position="[0, 0, 2750]" />

      <TAmbientLight :color="0x444444" :intensity="3" />
      <TDirectionalLight :color="0xffffff" :intensity="1.5" :position="[1, 1, 1]" />
      <TDirectionalLight :color="0xffffff" :intensity="4.5" :position="[0, -1, 0]" />

      <TMesh ref="meshRef" v-if="geometryAttributes.position">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TMeshPhongMaterial :color="0xaaaaaa" :specular="0xffffff" :shininess="250" :side="2" :vertex-colors="true" />
      </TMesh>

      <TLine ref="lineRef" v-if="lineVisible">
        <TBufferGeometry :attributes="lineAttributes" />
        <TLineBasicMaterial :color="0xffffff" :transparent="true" />
      </TLine>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TBufferGeometry,
  TMeshPhongMaterial,
  TLine,
  TLineBasicMaterial
} from '@vue-three/vue-three'

const meshRef = ref<any>(null)
const lineRef = ref<any>(null)
const geometryAttributes = ref<Record<string, THREE.BufferAttribute>>({})
const lineAttributes = ref<Record<string, THREE.BufferAttribute>>({})
const lineVisible = ref(false)

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

onMounted(() => {
  createBufferGeometry()
  createLineGeometry()
})



function createBufferGeometry() {
  const triangles = 5000
  const positions: number[] = []
  const normals: number[] = []
  const colors: number[] = []

  const color = new THREE.Color()
  const n = 800
  const n2 = n / 2
  const d = 120
  const d2 = d / 2

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()
  const cb = new THREE.Vector3()
  const ab = new THREE.Vector3()

  for (let i = 0; i < triangles * 3 * 3; i += 9) {
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

    positions.push(ax, ay, az, bx, by, bz, cx, cy, cz)

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

    normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz)

    const vx = x / n + 0.5
    const vy = y / n + 0.5
    const vz = z / n + 0.5

    color.setRGB(vx, vy, vz)

    colors.push(color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b)
  }

  geometryAttributes.value = {
    position: new THREE.Float32BufferAttribute(positions, 3),
    normal: new THREE.Float32BufferAttribute(normals, 3),
    color: new THREE.Float32BufferAttribute(colors, 3)
  }

  if (meshRef.value?.mesh) {
    meshRef.value.mesh.geometry.computeBoundingSphere()
  }
}

function createLineGeometry() {
  lineAttributes.value = {
    position: new THREE.Float32BufferAttribute(new Float32Array(4 * 3), 3)
  }
}

function onPointerMove(event: PointerEvent) {
  const { width, height } = event.target.getBoundingClientRect()
  pointer.x = (event.clientX / width) * 2 - 1
  pointer.y = -(event.clientY / height) * 2 + 1
}

function onAnimate({ camera }) {
  const time = Date.now() * 0.001

  if (meshRef.value?.mesh) {
    meshRef.value.mesh.rotation.x = time * 0.15
    meshRef.value.mesh.rotation.y = time * 0.25

    if (camera) {
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObject(meshRef.value.mesh)

      if (intersects.length > 0 && lineRef.value?.line) {
        const intersect = intersects[0]
        const face = intersect.face as THREE.Face3
        const linePosition = lineAttributes.value.position.array as Float32Array
        const meshPosition = geometryAttributes.value.position.array as Float32Array

        const idxA = face.a * 3
        const idxB = face.b * 3
        const idxC = face.c * 3

        linePosition[0] = meshPosition[idxA]
        linePosition[1] = meshPosition[idxA + 1]
        linePosition[2] = meshPosition[idxA + 2]

        linePosition[3] = meshPosition[idxB]
        linePosition[4] = meshPosition[idxB + 1]
        linePosition[5] = meshPosition[idxB + 2]

        linePosition[6] = meshPosition[idxC]
        linePosition[7] = meshPosition[idxC + 1]
        linePosition[8] = meshPosition[idxC + 2]

        linePosition[9] = meshPosition[idxA]
        linePosition[10] = meshPosition[idxA + 1]
        linePosition[11] = meshPosition[idxA + 2]

        lineAttributes.value.position.needsUpdate = true

        meshRef.value.mesh.updateMatrix()
        lineRef.value.line.geometry.applyMatrix4(meshRef.value.mesh.matrix)

        lineVisible.value = true
      } else {
        lineVisible.value = false
      }
    }
  }
}
</script>

<style scoped></style>