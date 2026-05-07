<template>
  <TCanvas antialias animation-loop @animate="animate">
    <TPerspectiveCamera ref="cameraRef" :fov="70" :near="1" :far="1000" :position="[0, 0, 400]" />

    <TScene ref="sceneRef">
      <TPointLight ref="lightRef" :position="[200, 100, 150]" />
      <TPointLightHelper v-if="lightRef?.light" :light="lightRef.light" :sphere-size="15" />

      <TGridHelper :size="400" :divisions="40" :color-center-line="0x0000ff" :color-grid="0x808080"
        :position="[-150, -150, 0]" />

      <TPolarGridHelper :radius="200" :radials="16" :circles="8" :divisions="64" :color-center-line="0x0000ff"
        :color-grid="0x808080" :position="[200, -150, 0]" />

      <TGLTFLoader src="/models/gltf/LeePerrySmith/LeePerrySmith.glb" @load="onModelLoad" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import * as THREE from 'three'
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js'
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js'
import {
  TCanvas,
  TPerspectiveCamera,
  TScene,
  TPointLight,
  TPointLightHelper,
  TGridHelper,
  TPolarGridHelper,
  TGLTFLoader
} from '@vue-three/vue-three'

const cameraRef = ref<any>(null)
const lightRef = ref<any>(null)
const sceneRef = ref<any>(null)

let vnh: VertexNormalsHelper | null = null
let vth: VertexTangentsHelper | null = null
let scene: THREE.Scene | null = null

watch(
  sceneRef,
  async () => {
    await nextTick()
    if (sceneRef.value?.scene) {
      scene = sceneRef.value.scene
    }
  },
  { immediate: true, deep: true }
)

function onModelLoad(model: THREE.Object3D, animations: THREE.AnimationClip[], gltf: any) {
  if (!scene) return

  const mesh = gltf.scene.children[0] as THREE.Mesh

  mesh.geometry.computeTangents()

  const group = new THREE.Group()
  group.scale.multiplyScalar(50)
  scene.add(group)

  group.updateMatrixWorld(true)

  group.add(mesh)

  vnh = new VertexNormalsHelper(mesh, 5)
  scene.add(vnh)

  vth = new VertexTangentsHelper(mesh, 5)
  scene.add(vth)

  scene.add(new THREE.BoxHelper(mesh))

  const wireframe = new THREE.WireframeGeometry(mesh.geometry)
  let line = new THREE.LineSegments(wireframe)
    ; (line.material as THREE.Material).depthTest = false
    ; (line.material as THREE.Material).opacity = 0.25
    ; (line.material as THREE.Material).transparent = true
  line.position.x = 4
  group.add(line)
  scene.add(new THREE.BoxHelper(line))

  const edges = new THREE.EdgesGeometry(mesh.geometry)
  line = new THREE.LineSegments(edges)
    ; (line.material as THREE.Material).depthTest = false
    ; (line.material as THREE.Material).opacity = 0.25
    ; (line.material as THREE.Material).transparent = true
  line.position.x = -4
  group.add(line)
  scene.add(new THREE.BoxHelper(line))

  scene.add(new THREE.BoxHelper(group))
  scene.add(new THREE.BoxHelper(scene))
}

function animate({ camera }: { camera: THREE.PerspectiveCamera }) {
  // const camera = cameraRef.value?.camera as THREE.PerspectiveCamera
  const light = lightRef.value?.light as THREE.PointLight

  if (!camera || !light) return

  const time = -performance.now() * 0.0003

  camera.position.x = 400 * Math.cos(time)
  camera.position.z = 400 * Math.sin(time)
  camera.lookAt(0, 0, 0)

  light.position.x = Math.sin(time * 1.7) * 300
  light.position.y = Math.cos(time * 1.5) * 400
  light.position.z = Math.cos(time * 1.3) * 300

  if (vnh) vnh.update()
  if (vth) vth.update()
}
</script>

<style scoped></style>
