<template>
  <TCanvas ref="canvasRef" antialias :background="0x000000">
    <TScene ref="sceneRef">
      <TPerspectiveCamera ref="cameraRef" :fov="30" :near="1" :far="1500" :position="[0, 400, 700]" />

      <TDirectionalLight :intensity="0.4" :position="[0, 0, 1]" normalize />
      <TPointLight ref="pointLightRef" :intensity="4.5" :distance="0" :decay="0" :color="pointLightColor"
        :position="[0, 100, 90]" />

      <TGroup ref="groupRef" :position="[0, 100, 0]">
        <TMesh v-if="textMesh1 && font" :ref="textMesh1Ref" :position="[centerOffset, hover, 0]"
          :rotation="[0, Math.PI * 2, 0]">
          <TTextGeometry :text="currentText" :font="font" :args="textGeometryParams" />
          <TMeshPhongMaterial :color="0xffffff" :flat-shading="true" />
        </TMesh>
        <TMesh v-if="textMesh2 && font" :ref="textMesh2Ref" :position="[centerOffset, -hover, depth]"
          :rotation="[Math.PI, Math.PI * 2, 0]">
          <TTextGeometry :text="currentText" :font="font" :args="textGeometryParams" />
          <TMeshPhongMaterial :color="0xffffff" :flat-shading="true" />
        </TMesh>
      </TGroup>

      <TMesh :position="[0, 100, 0]" :rotation="[-Math.PI / 2, 0, 0]">
        <TPlane :args="[10000, 10000]" />
        <TMeshBasicMaterial :color="0xffffff" :opacity="0.5" transparent />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TDirectionalLight,
  TPointLight,
  TMesh,
  TPlane,
  TMeshPhongMaterial,
  TMeshBasicMaterial,
  TTextGeometry,
  TGroup
} from '@vue-three/vue-three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

const cameraRef = ref<any>(null)
const groupRef = ref<any>(null)

const textMesh1Ref = ref<any>(null)
const textMesh2Ref = ref<any>(null)

const currentText = ref('three.js')
const font = ref<any>(null)
const bevelEnabled = ref(true)
const fontName = ref('optimer')
const fontWeight = ref('bold')
const pointLightColor = ref(new THREE.Color().setHSL(Math.random(), 1, 0.5))

const depth = 20
const size = 70
const hover = 30
const curveSegments = 4
const bevelThickness = 2
const bevelSize = 1.5
const mirror = true

const fontMap: Record<string, number> = {
  'helvetiker': 0,
  'optimer': 1,
  'gentilis': 2,
  'droid/droid_sans': 3,
  'droid/droid_serif': 4
}

const weightMap: Record<string, number> = {
  'regular': 0,
  'bold': 1
}

const reverseFontMap: string[] = []
const reverseWeightMap: string[] = []

for (const i in fontMap) reverseFontMap[fontMap[i]] = i
for (const i in weightMap) reverseWeightMap[weightMap[i]] = i

let fontIndex = 1

let targetRotation = 0
let targetRotationOnPointerDown = 0
let pointerX = 0
let pointerXOnPointerDown = 0
let windowHalfX = window.innerWidth / 2

const textGeometryParams = computed(() => ({
  font: font.value,
  size,
  depth,
  curveSegments,
  bevelThickness,
  bevelSize,
  bevelEnabled: bevelEnabled.value
}))

const centerOffset = ref(0)
const textMesh1 = ref(false)
const textMesh2 = ref(false)

const loadFont = () => {
  const loader = new FontLoader()
  loader.load(`/fonts/${fontName.value}_${fontWeight.value}.typeface.json`, (response: any) => {
    font.value = response
    refreshText()
  })
}

const refreshText = () => {
  if (!font.value) return

  textMesh1.value = false
  textMesh2.value = false

  setTimeout(() => {
    if (currentText.value && font.value) {
      textMesh1.value = true
      textMesh2.value = mirror

      nextTick(() => {
        if (textMesh1Ref.value?.geometry) {
          textMesh1Ref.value.geometry.computeBoundingBox()
          const boundingBox = textMesh1Ref.value.geometry.boundingBox
          if (boundingBox) {
            centerOffset.value = -0.5 * (boundingBox.max.x - boundingBox.min.x)
          }
        }
      })
    }
  }, 50)
}

watch([currentText, font, bevelEnabled], () => {
  refreshText()
}, { deep: true })

onMounted(() => {
  loadFont()
})

</script>

<style scoped></style>
