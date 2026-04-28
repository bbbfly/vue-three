<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[8, 8, 8]" :fov="60" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
          <TAmbientLight ref="ambientLightRef" :intensity="0.4" />
          <TDirectionalLight ref="directionalLightRef" :position="[5, 8, 5]" :intensity="1" :cast-shadow="true" />

          <TLine ref="arcLineRef" :curve="{ type: 'arc', args: [-5, 3, 1.2, 0, Math.PI * 1.5] }" color="#ff6b6b"
            :linewidth="2" />

          <TLine ref="ellipseLineRef" :curve="{ type: 'ellipse', args: [-5, 0, 1.5, 1] }" color="#4ecdc4"
            :linewidth="2" />

          <TLine ref="bezierLineRef" :curve="{
            type: 'bezier',
            args: [
              [-2, 3],
              [-1, 4.5],
              [-3, 4.5],
              [-2, 3]
            ]
          }" color="#ffe66d" :linewidth="2" />

          <TLine ref="quadraticLineRef" :curve="{
            type: 'quadraticBezier',
            args: [
              [-2, 0],
              [-2.5, 2],
              [-1.5, 0]
            ]
          }" color="#ff9f43" :linewidth="2" />

          <TLine ref="catmullLineRef" :curve="{
            type: 'catmullRom',
            args: [
              [1, 0, 0],
              [2, 1, 0],
              [3, 0.5, 0],
              [4, 1.5, 0],
              [5, 0, 0]
            ]
          }" color="#c56cf0" :linewidth="2" />

          <TLine ref="splineLineRef" :curve="{
            type: 'spline',
            args: [
              [1, 3],
              [2, 4],
              [3, 3.5],
              [4, 4.5],
              [5, 3]
            ]
          }" color="#7bed9f" :linewidth="2" />

          <TLineDashed ref="dashedLineRef" :curve="{
            type: 'catmullRom',
            args: [
              [-5, -2],
              [-3, -1.5],
              [-1, -2.5],
              [1, -1.5],
              [3, -2],
              [5, -1.5]
            ]
          }" color="#70a1ff" :linewidth="2" :dash-size="0.2" :gap-size="0.1" />

          <TLineLoop ref="lineLoopRef" :curve="{
            type: 'catmullRom',
            args: [
              [0, -2],
              [1, -2.8],
              [-1, -2.8],
              [0, -2]
            ],
            closed: true
          }" color="#ff4757" :linewidth="3" />

          <TMesh ref="groundMeshRef" :position="[0, -3, 0]" :rotation="[-Math.PI / 2, 0, 0]">
            <TPlane :args="[20, 20]" />
            <TMeshStandardMaterial color="#2c3e50" />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import { useSceneStore } from '../stores/scene'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TLine,
  TLineLoop,
  TLineDashed,
  TMesh,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)
const arcLineRef = shallowRef<any>(null)
const ellipseLineRef = shallowRef<any>(null)
const bezierLineRef = shallowRef<any>(null)
const quadraticLineRef = shallowRef<any>(null)
const catmullLineRef = shallowRef<any>(null)
const splineLineRef = shallowRef<any>(null)
const dashedLineRef = shallowRef<any>(null)
const lineLoopRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)

function registerSceneObjects() {
  const objects = [
    { ref: arcLineRef, name: '圆弧曲线', type: 'Line' },
    { ref: ellipseLineRef, name: '椭圆曲线', type: 'Line' },
    { ref: bezierLineRef, name: '三次贝塞尔', type: 'Line' },
    { ref: quadraticLineRef, name: '二次贝塞尔', type: 'Line' },
    { ref: catmullLineRef, name: 'Catmull-Rom样条', type: 'Line' },
    { ref: splineLineRef, name: '插值曲线', type: 'Line' },
    { ref: dashedLineRef, name: '虚线线条', type: 'LineDashed' },
    { ref: lineLoopRef, name: '闭环线条', type: 'LineLoop' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' },
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.line || objRef.value?.mesh || objRef.value?.light) {
      const object = objRef.value.line || objRef.value.mesh || objRef.value.light
      sceneStore.registerSceneObject({
        id: `curve-${index}`,
        name,
        type,
        object
      })
    }
  })
}

onMounted(() => {
  setTimeout(registerSceneObjects, 100)
})

onUnmounted(() => {
  sceneStore.clearAll()
})
</script>
