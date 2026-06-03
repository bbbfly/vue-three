<template>
  <TCanvas antialias shadow-map background="#222222">
    <TScene>
      <TPerspectiveCamera ref="cameraRef" :fov="45" :near="1" :far="1000" :position="[0, 0, 500]" />
      <TTrackballControls ref="controlsRef" :min-distance="200" :max-distance="500" />

      <TAmbientLight :intensity="1" :color="0x666666" receive-shadow cast-shadow />
      <TPointLight
        ref="pointLightRef"
        cast-shadow
        :intensity="3"
        :distance="0"
        :position="[0, 0, 500]"
      />

      <TMesh receive-shadow>
        <TExtrudeGeometry :shape="shape1" :args="extrudeSettings1" />
        <TMeshLambertMaterial :color="0xb00000" />
      </TMesh>

      <TMesh receive-shadow>
        <TExtrudeGeometry :shape="shape2" :args="extrudeSettings2" />
        <TMeshLambertMaterial :color="0xff8000" />
      </TMesh>

      <TMesh receive-shadow :position="[50, 100, 50]">
        <TExtrudeGeometry :shape="shape2" :args="extrudeSettings3" />
        <TMeshLambertMaterial :color="0xb00000" />
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
  TTrackballControls,
  TAmbientLight,
  TPointLight,
  TMesh,
  TMeshLambertMaterial,
  TExtrudeGeometry
} from '@vue-three/vue-three'

const shape1 = ref<THREE.Shape>()
const extrudeSettings1 = ref<any>()

const shape2 = ref<THREE.Shape>()
const extrudeSettings2 = ref<any>()

const extrudeSettings3 = ref<any>()

onMounted(() => {
  nextTick(() => {
    initShapes()
  })
})

function initShapes() {
  const closedSpline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-60, -100, 60),
    new THREE.Vector3(-60, 20, 60),
    new THREE.Vector3(-60, 120, 60),
    new THREE.Vector3(60, 20, -60),
    new THREE.Vector3(60, -100, -60)
  ])

  closedSpline.curveType = 'catmullrom'
  closedSpline.closed = true

  const pts1: THREE.Vector2[] = []
  const count = 3

  for (let i = 0; i < count; i++) {
    const l = 20
    const a = ((2 * i) / count) * Math.PI
    pts1.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l))
  }

  shape1.value = new THREE.Shape(pts1)
  extrudeSettings1.value = {
    steps: 100,
    bevelEnabled: false,
    extrudePath: closedSpline
  }

  const randomPoints: THREE.Vector3[] = []

  for (let i = 0; i < 10; i++) {
    randomPoints.push(
      new THREE.Vector3(
        (i - 4.5) * 50,
        THREE.MathUtils.randFloat(-50, 50),
        THREE.MathUtils.randFloat(-50, 50)
      )
    )
  }

  const randomSpline = new THREE.CatmullRomCurve3(randomPoints)

  const pts2: THREE.Vector2[] = []
  const numPts = 5

  for (let i = 0; i < numPts * 2; i++) {
    const l = i % 2 == 1 ? 10 : 20
    const a = (i / numPts) * Math.PI
    pts2.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l))
  }

  shape2.value = new THREE.Shape(pts2)
  extrudeSettings2.value = {
    steps: 200,
    bevelEnabled: false,
    extrudePath: randomSpline
  }

  extrudeSettings3.value = {
    depth: 20,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 4,
    bevelSegments: 1
  }
}
</script>

<style scoped></style>
