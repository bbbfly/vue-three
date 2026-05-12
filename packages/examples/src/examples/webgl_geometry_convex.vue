<template>
  <TCanvas antialias @animate="animate">
    <TScene ref="sceneRef">
      <TPerspectiveCamera ref="cameraRef" :fov="40" :near="1" :far="1000" :position="[15, 20, 30]" />
      <TOrbitControls :min-distance="20" :max-distance="50" :max-polar-angle="Math.PI / 2" />

      <TAmbientLight :intensity="1000" :color="0x666666" />
      <TPointLight :intensity="3" />

      <TAxesHelper :size="20" />

      <TGroup ref="groupRef">
        <TPoints ref="pointsRef">
          <TBufferGeometry ref="bufferGeometryRef" />
          <TPointsMaterial ref="pointsMaterialRef" :color="0x0080ff" :size="1" :alpha-test="0.5">
            <TTexture url="/textures/sprites/disc.png" />
          </TPointsMaterial>
        </TPoints>
        <TMesh ref="meshRef">
          <TConvexGeometry :vertices="vertices" />
          <TMeshLambertMaterial color="#ffffff" :opacity="0.5" :transparent="true" :side="2">
          </TMeshLambertMaterial>
        </TMesh>
      </TGroup>
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
  TAmbientLight,
  TPointLight,
  TOrbitControls,
  TAxesHelper,
  TGroup,
  TPoints,
  TPointsMaterial,
  TMesh,
  TMeshLambertMaterial,
  TBufferGeometry,
  TTexture,
  TConvexGeometry,
} from '@vue-three/vue-three'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'


const groupRef = ref<any>(null)
const bufferGeometryRef = ref<any>(null)
const vertices = ref<THREE.Vector3[]>([])

onMounted(() => {
  nextTick(async () => {
    await initScene()
  })
})

async function initScene() {
  const dodecahedronGeometry = new THREE.DodecahedronGeometry(10)
  dodecahedronGeometry.deleteAttribute('normal')
  dodecahedronGeometry.deleteAttribute('uv')
  const mergedGeometry = BufferGeometryUtils.mergeVertices(dodecahedronGeometry)

  const pointVertices: THREE.Vector3[] = []
  const positionAttribute = mergedGeometry.getAttribute('position')
  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3()
    vertex.fromBufferAttribute(positionAttribute, i)
    pointVertices.push(vertex)
  }
  vertices.value = pointVertices

  if (bufferGeometryRef.value?.geometry) {
    bufferGeometryRef.value.geometry.setFromPoints(pointVertices)
    bufferGeometryRef.value.geometry.needsUpdate = true
  }

  mergedGeometry.dispose()
  dodecahedronGeometry.dispose()
}

function animate() {
  if (groupRef.value?.group) {
    groupRef.value.group.rotation.y += 0.005
  }
}
</script>

<style scoped></style>
