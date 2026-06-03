<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#101010">
      <TPerspectiveCamera :fov="50" :near="1" :far="1000" :position="[0, 0, 120]" />

      <TInstancedMesh ref="meshRef" :instance-count="instances">
        <TInstancedBufferGeometry :attributes="geometryAttributes" />
        <TMeshBasicMaterial>
          <TTexture url="/textures/crate.gif" color-space="srgb" :flip-y="false" />
        </TMeshBasicMaterial>
      </TInstancedMesh>
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
  TInstancedMesh,
  TInstancedBufferGeometry,
  TMeshBasicMaterial,
  TTexture
} from '@vue-three/vue-three'

const meshRef = ref<any>(null)
const instances = 5000
let lastTime = 0

const geometryAttributes = shallowRef<
  Record<
    string,
    THREE.BufferAttribute | THREE.InterleavedBufferAttribute | THREE.InstancedBufferAttribute
  >
>({})

const moveQ = new THREE.Quaternion(0.5, 0.5, 0.5, 0.0).normalize()
const tmpQ = new THREE.Quaternion()
const tmpM = new THREE.Matrix4()
const currentM = new THREE.Matrix4()

onMounted(() => {
  createGeometry()
})

function createGeometry() {
  const vertexBuffer = new THREE.InterleavedBuffer(
    new Float32Array([
      // Front
      -1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, -1, -1, 1, 0, 0, 1, 0, 0, 1, -1, 1, 0, 1, 1,
      0, 0,
      // Back
      1, 1, -1, 0, 1, 0, 0, 0, -1, 1, -1, 0, 0, 0, 0, 0, 1, -1, -1, 0, 1, 1, 0, 0, -1, -1, -1, 0, 0,
      1, 0, 0,
      // Left
      -1, 1, -1, 0, 1, 1, 0, 0, -1, 1, 1, 0, 1, 0, 0, 0, -1, -1, -1, 0, 0, 1, 0, 0, -1, -1, 1, 0, 0,
      0, 0, 0,
      // Right
      1, 1, 1, 0, 1, 0, 0, 0, 1, 1, -1, 0, 1, 1, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0, 1, -1, -1, 0, 0, 1,
      0, 0,
      // Top
      -1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, -1, 1, -1, 0, 0, 1, 0, 0, 1, 1, -1, 0, 1, 1,
      0, 0,
      // Bottom
      1, -1, 1, 0, 1, 0, 0, 0, -1, -1, 1, 0, 0, 0, 0, 0, 1, -1, -1, 0, 1, 1, 0, 0, -1, -1, -1, 0, 0,
      1, 0, 0
    ]),
    8
  )

  const positions = new THREE.InterleavedBufferAttribute(vertexBuffer, 3, 0)
  const uvs = new THREE.InterleavedBufferAttribute(vertexBuffer, 2, 4)

  const indices = new Uint16Array([
    0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 8, 10, 9, 10, 11, 9, 12, 14, 13, 14, 15, 13, 16, 17, 18, 18,
    17, 19, 20, 21, 22, 22, 21, 23
  ])

  const matrixArray = new Float32Array(instances * 16)
  const matrix = new THREE.Matrix4()
  const offset = new THREE.Vector3()
  const orientation = new THREE.Quaternion()
  const scale = new THREE.Vector3(1, 1, 1)
  let x, y, z, w

  for (let i = 0; i < instances; i++) {
    x = Math.random() * 100 - 50
    y = Math.random() * 100 - 50
    z = Math.random() * 100 - 50

    offset.set(x, y, z).normalize()
    offset.multiplyScalar(5)
    offset.set(x + offset.x, y + offset.y, z + offset.z)

    x = Math.random() * 2 - 1
    y = Math.random() * 2 - 1
    z = Math.random() * 2 - 1
    w = Math.random() * 2 - 1

    orientation.set(x, y, z, w).normalize()

    matrix.compose(offset, orientation, scale)
    matrix.toArray(matrixArray, i * 16)
  }
  geometryAttributes.value = {
    position: positions,
    uv: uvs,
    index: new THREE.BufferAttribute(indices, 1),
    instanceMatrix: new THREE.InstancedBufferAttribute(matrixArray, 16, false)
  }
}

function onAnimate() {
  const time = performance.now()

  if (meshRef.value?.mesh) {
    meshRef.value.mesh.rotation.y = time * 0.00005

    const delta = (time - lastTime) / 5000
    tmpQ.set(moveQ.x * delta, moveQ.y * delta, moveQ.z * delta, 1).normalize()
    tmpM.makeRotationFromQuaternion(tmpQ)

    for (let i = 0; i < instances; i++) {
      meshRef.value.mesh.getMatrixAt(i, currentM)
      currentM.multiply(tmpM)
      meshRef.value.mesh.setMatrixAt(i, currentM)
    }

    meshRef.value.mesh.instanceMatrix!.needsUpdate = true
    meshRef.value.mesh.computeBoundingSphere()
  }

  lastTime = time
}
</script>

<style scoped></style>
