<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[10, 8, 10]" :fov="60" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
          <TAmbientLight ref="ambientLightRef" :intensity="0.4" />
          <TDirectionalLight ref="directionalLightRef" :position="[5, 8, 5]" :intensity="1" :cast-shadow="true" />

          <TMesh ref="tubeMeshRef" :position="[-5, 2, 0]" :rotation="[0, 0, 0]" :cast-shadow="true"
            :receive-shadow="true">
            <TTubeGeometry :path="{
              type: 'catmullRom',
              args: [
                [-1.5, -1, 0],
                [0, 1, 0],
                [1.5, -1, 0]
              ]
            }" :args="[32, 0.4, 8, 0]" />
            <TMeshStandardMaterial color="#e74c3c" :side="2" />
          </TMesh>

          <TMesh ref="latheMeshRef" :position="[-1.5, 1.5, 0]" :cast-shadow="true" :receive-shadow="true">
            <TLatheGeometry :points="[
              [0, 0],
              [0.3, 0.4],
              [0.6, 0.6],
              [0.4, 1],
              [0.2, 1.4],
              [0, 1.6]
            ]" :args="[24, 0, Math.PI * 2]" />
            <TMeshStandardMaterial color="#3498db" :side="2" />
          </TMesh>

          <TMesh ref="shapeMeshRef" :position="[2, 1.5, 0]" :rotation="[-Math.PI / 2, 0, 0]" :cast-shadow="true"
            :receive-shadow="true">
            <TShapeGeometry :shape="{
              curves: [
                { type: 'moveTo', args: [0, 0] },
                { type: 'arc', args: [0, 1.2, 1.2, 1.2, 0, Math.PI, true] },
                { type: 'lineTo', args: [-1.2, 0] }
              ]
            }" />
            <TMeshStandardMaterial color="#2ecc71" :side="2" />
          </TMesh>

          <TMesh ref="extrudeMeshRef" :position="[5.5, 2, 0]" :cast-shadow="true" :receive-shadow="true">
            <TExtrudeGeometry :shape="{
              curves: [
                { type: 'moveTo', args: [-0.8, -0.8] },
                { type: 'lineTo', args: [0.8, -0.8] },
                { type: 'lineTo', args: [0.8, 0.8] },
                { type: 'lineTo', args: [-0.8, 0.8] },
                { type: 'lineTo', args: [-0.8, -0.8] }
              ]
            }" :args="{ depth: 1.5, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 }" />
            <TMeshStandardMaterial color="#9b59b6" :side="2" />
          </TMesh>

          <TMesh ref="sweepMeshRef" :position="[-3.5, 1, -4]" :rotation="[0, 0, 0]" :cast-shadow="true"
            :receive-shadow="true">
            <TSweepGeometry :shape="{
              curves: [
                { type: 'moveTo', args: [0, 0] },
                { type: 'lineTo', args: [0.5, 0.5] },
                { type: 'lineTo', args: [0, 1] },
                { type: 'lineTo', args: [-0.5, 0.5] },
                { type: 'lineTo', args: [0, 0] }
              ]
            }" :path="{
                type: 'catmullRom',
                args: [
                  [-1, -1, 0],
                  [0, 0, 0.5],
                  [1, -0.5, 0],
                  [1.5, 0.5, -0.5]
                ]
              }" :options="{ tubularSegments: 48, radialSegments: 6 }" />
            <TMeshStandardMaterial color="#f39c12" :side="2" />
          </TMesh>

          <TWireframeGeometry ref="wireframeRef" :position="[0, 1.5, -4]"
            :geometry="{ type: 'sphere', args: [1, 16, 16] }" :color="'#1abc9c'" :linewidth="1" />

          <TEdgesGeometry ref="edgesRef" :position="[3.5, 1.5, -4]" :geometry="{ type: 'box', args: [2, 2, 2] }"
            :threshold-angle="20" :color="'#e91e63'" :linewidth="1" />

          <TMesh ref="groundMeshRef" :position="[0, -0.5, 0]" :rotation="[-Math.PI / 2, 0, 0]">
            <TPlane :args="[25, 25]" />
            <TMeshStandardMaterial color="#2c3e50" />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'
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
  TMesh,
  TPlane,
  TMeshStandardMaterial,
  TTubeGeometry,
  TLatheGeometry,
  TShapeGeometry,
  TExtrudeGeometry,
  TSweepGeometry,
  TWireframeGeometry,
  TEdgesGeometry
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

const ambientLightRef = shallowRef<any>(null)
const directionalLightRef = shallowRef<any>(null)
const tubeMeshRef = shallowRef<any>(null)
const latheMeshRef = shallowRef<any>(null)
const shapeMeshRef = shallowRef<any>(null)
const extrudeMeshRef = shallowRef<any>(null)
const sweepMeshRef = shallowRef<any>(null)
const wireframeRef = shallowRef<any>(null)
const edgesRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)

function registerSceneObjects() {
  const objects = [
    { ref: tubeMeshRef, name: '曲线路径管道', type: 'Mesh' },
    { ref: latheMeshRef, name: '旋转成型', type: 'Mesh' },
    { ref: shapeMeshRef, name: '轮廓填充', type: 'Mesh' },
    { ref: extrudeMeshRef, name: '拉伸几何体', type: 'Mesh' },
    { ref: sweepMeshRef, name: '扫描几何体', type: 'Mesh' },
    { ref: wireframeRef, name: '线框几何体', type: 'Line' },
    { ref: edgesRef, name: '模型边界线', type: 'Line' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' },
    { ref: ambientLightRef, name: '环境光', type: 'AmbientLight' },
    { ref: directionalLightRef, name: '方向光', type: 'DirectionalLight' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.line || objRef.value?.mesh || objRef.value?.light) {
      const object = objRef.value.line || objRef.value.mesh || objRef.value.light
      sceneStore.registerSceneObject({
        id: `adv-geo-${index}`,
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
