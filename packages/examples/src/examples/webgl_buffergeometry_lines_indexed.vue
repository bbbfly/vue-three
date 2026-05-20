<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#000000">
      <TPerspectiveCamera :fov="27" :near="1" :far="10000" :position="[0, 0, 9000]" />

      <TLineSegments ref="lineRef">
        <TBufferGeometry :attributes="geometryAttributes" :index="indices" />
        <TLineBasicMaterial :vertex-colors="true" />
      </TLineSegments>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import * as THREE from 'three'
import { TCanvas, TScene, TPerspectiveCamera, TLineSegments, TBufferGeometry, TLineBasicMaterial } from '@vue-three/vue-three'

const lineRef = ref<any>(null)
const geometryAttributes = shallowRef<Record<string, THREE.BufferAttribute>>({})
const indices = shallowRef<number[]>([])

const iterationCount = 4
const rangle = 60 * Math.PI / 180.0
let nextPositionsIndex = 0

const positions: number[] = []
const colors: number[] = []
const indexData: number[] = []

function addVertex(v: THREE.Vector3) {
  positions.push(v.x, v.y, v.z)
  colors.push(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1)
  return nextPositionsIndex++
}

function snowflakeIteration(p0: THREE.Vector3, p4: THREE.Vector3, depth: number) {
  if (--depth < 0) {
    const i = nextPositionsIndex - 1
    addVertex(p4)
    indexData.push(i, i + 1)
    return
  }

  const v = p4.clone().sub(p0)
  const vTier = v.clone().multiplyScalar(1 / 3)
  const p1 = p0.clone().add(vTier)

  const angle = Math.atan2(v.y, v.x) + rangle
  const length = vTier.length()
  const p2 = p1.clone()
  p2.x += Math.cos(angle) * length
  p2.y += Math.sin(angle) * length

  const p3 = p0.clone().add(vTier).add(vTier)

  snowflakeIteration(p0, p1, depth)
  snowflakeIteration(p1, p2, depth)
  snowflakeIteration(p2, p3, depth)
  snowflakeIteration(p3, p4, depth)
}

function snowflake(points: THREE.Vector3[], loop: boolean, xOffset: number) {
  for (let iteration = 0; iteration != iterationCount; iteration++) {
    addVertex(points[0])

    for (let pIndex = 0, pCount = points.length - 1; pIndex != pCount; pIndex++) {
      snowflakeIteration(points[pIndex], points[pIndex + 1], iteration)
    }

    if (loop) snowflakeIteration(points[points.length - 1], points[0], iteration)

    for (let pIndex = 0, pCount = points.length; pIndex != pCount; pIndex++) {
      points[pIndex].x += xOffset
    }
  }
}

onMounted(() => {
  let y = 0

  snowflake(
    [
      new THREE.Vector3(0, y, 0),
      new THREE.Vector3(500, y, 0)
    ],
    false, 600
  )

  y += 600
  snowflake(
    [
      new THREE.Vector3(0, y, 0),
      new THREE.Vector3(250, y + 400, 0),
      new THREE.Vector3(500, y, 0)
    ],
    true, 600
  )

  y += 600
  snowflake(
    [
      new THREE.Vector3(0, y, 0),
      new THREE.Vector3(500, y, 0),
      new THREE.Vector3(500, y + 500, 0),
      new THREE.Vector3(0, y + 500, 0)
    ],
    true, 600
  )

  y += 1000
  snowflake(
    [
      new THREE.Vector3(250, y, 0),
      new THREE.Vector3(500, y, 0),
      new THREE.Vector3(250, y, 0),
      new THREE.Vector3(250, y + 250, 0),
      new THREE.Vector3(250, y, 0),
      new THREE.Vector3(0, y, 0),
      new THREE.Vector3(250, y, 0),
      new THREE.Vector3(250, y - 250, 0),
      new THREE.Vector3(250, y, 0)
    ],
    false, 600
  )

  geometryAttributes.value = {
    position: new THREE.Float32BufferAttribute(positions, 3),
    color: new THREE.Float32BufferAttribute(colors, 3)
  }

  indices.value = indexData
})

function onAnimate() {
  const time = Date.now() * 0.001
  if (lineRef.value?.lineSegments) {
    lineRef.value.lineSegments.rotation.z = time * 0.5
  }
}
</script>

<style scoped></style>