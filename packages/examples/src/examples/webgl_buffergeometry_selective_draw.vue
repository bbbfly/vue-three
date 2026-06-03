<template>
  <TCanvas antialias @animate="onAnimate">
    <TPerspectiveCamera :fov="45" :near="0.01" :far="10" :position="[0, 0, 3.5]" />
    <TScene background="#000000">
      <TLineSegments v-if="geometryAttributes.position" ref="lineSegmentsRef">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TShaderMaterial :vertex-shader="vertexShader" :fragment-shader="fragmentShader" />
      </TLineSegments>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TLineSegments,
  TBufferGeometry,
  TShaderMaterial
} from '@vue-three/vue-three'

const lineSegmentsRef = ref<any>(null)
const geometryAttributes = shallowRef<Record<string, THREE.BufferAttribute>>({})
const numLat = 100
const numLng = 200
let numLinesCulled = 0

const infoText = computed(() => {
  const total = numLat * numLng
  return `1 draw call, ${total.toLocaleString()} lines, ${numLinesCulled.toLocaleString()} culled`
})

const vertexShader = `
attribute float visible;
varying float vVisible;
attribute vec3 vertColor;
varying vec3 vColor;

void main() {
  vColor = vertColor;
  vVisible = visible;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying float vVisible;
varying vec3 vColor;

void main() {
  if (vVisible > 0.0) {
    gl_FragColor = vec4(vColor, 1.0);
  } else {
    discard;
  }
}
`

function hideLines() {
  if (!geometryAttributes.value.visible) return
  const visible = geometryAttributes.value.visible

  for (let i = 0; i < visible.array.length; i += 2) {
    if (Math.random() > 0.75) {
      if (visible.array[i + 0]) {
        ++numLinesCulled
      }
      visible.array[i + 0] = 0
      visible.array[i + 1] = 0
    }
  }

  visible.needsUpdate = true
}

function showAllLines() {
  if (!geometryAttributes.value.visible) return
  numLinesCulled = 0
  const visible = geometryAttributes.value.visible

  for (let i = 0; i < visible.array.length; i += 2) {
    visible.array[i + 0] = 1
    visible.array[i + 1] = 1
  }

  visible.needsUpdate = true
}

function onAnimate() {
  if (lineSegmentsRef.value?.lineSegments) {
    const time = Date.now() * 0.001
    lineSegmentsRef.value.lineSegments.rotation.x = time * 0.25
    lineSegmentsRef.value.lineSegments.rotation.y = time * 0.5
  }
}

onMounted(() => {
  const radius = 1.0
  const linePositions = new Float32Array(numLat * numLng * 3 * 2)
  const lineColors = new Float32Array(numLat * numLng * 3 * 2)
  const visible = new Float32Array(numLat * numLng * 2)

  for (let i = 0; i < numLat; ++i) {
    for (let j = 0; j < numLng; ++j) {
      const lat = (Math.random() * Math.PI) / 50.0 + (i / numLat) * Math.PI
      const lng = (Math.random() * Math.PI) / 50.0 + (j / numLng) * 2 * Math.PI

      const index = i * numLng + j

      linePositions[index * 6 + 0] = 0
      linePositions[index * 6 + 1] = 0
      linePositions[index * 6 + 2] = 0
      linePositions[index * 6 + 3] = radius * Math.sin(lat) * Math.cos(lng)
      linePositions[index * 6 + 4] = radius * Math.cos(lat)
      linePositions[index * 6 + 5] = radius * Math.sin(lat) * Math.sin(lng)

      const color = new THREE.Color(0xffffff)

      color.setHSL(lat / Math.PI, 1.0, 0.2)
      lineColors[index * 6 + 0] = color.r
      lineColors[index * 6 + 1] = color.g
      lineColors[index * 6 + 2] = color.b

      color.setHSL(lat / Math.PI, 1.0, 0.7)
      lineColors[index * 6 + 3] = color.r
      lineColors[index * 6 + 4] = color.g
      lineColors[index * 6 + 5] = color.b

      visible[index * 2 + 0] = 1.0
      visible[index * 2 + 1] = 1.0
    }
  }

  geometryAttributes.value = {
    position: new THREE.BufferAttribute(linePositions, 3),
    vertColor: new THREE.BufferAttribute(lineColors, 3),
    visible: new THREE.BufferAttribute(visible, 1)
  }
})
</script>

<style scoped></style>
