<template>
  <TCanvas antialias :enable-controls="false" @animate="onAnimate" @pointermove="onPointerMove">
    <TScene background="#f0f0f0">
      <TPerspectiveCamera ref="cameraRef" :fov="70" :near="0.1" :far="100" />

      <TDirectionalLight :color="0xffffff" :intensity="3" :position="[1, 1, 1]" />

      <TMesh
        v-for="(cube, index) in cubes"
        :key="cube.id"
        :ref="el => setMeshRef(el, index)"
        :position="cube.position"
        :rotation="cube.rotation"
        :scale="cube.scale"
      >
        <TBox />
        <TMeshLambertMaterial :color="cube.color" :emissive="cube.emissive" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TDirectionalLight,
  TMesh,
  TBox,
  TMeshLambertMaterial
} from '@vue-three/vue-three'

interface CubeData {
  id: number
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: number
  emissive: number
}

const cameraRef = ref<any>(null)
const cubes = ref<CubeData[]>([])
const meshRefs = ref<any[]>([])
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
const theta = ref(0)
const radius = 5
let intersectedIndex = -1
let INTERSECTED = null

onMounted(() => {
  createCubes()
})

function setMeshRef(el: any, index: number) {
  if (el) {
    meshRefs.value[index] = el
  }
}

function createCubes() {
  const newCubes: CubeData[] = []
  for (let i = 0; i < 2000; i++) {
    newCubes.push({
      id: i,
      position: [Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20],
      rotation: [
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
      ],
      scale: [Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5],
      color: Math.random() * 0xffffff,
      emissive: 0x000000
    })
  }
  cubes.value = newCubes
}

function onPointerMove(event: PointerEvent) {
  const { width, height } = event.target.getBoundingClientRect()
  pointer.x = (event.offsetX / width) * 2 - 1
  pointer.y = -(event.offsetY / height) * 2 + 1
}

function onAnimate({ camera, scene }) {
  theta.value += 0.1

  if (camera) {
    camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta.value))
    camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta.value))
    camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta.value))
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld()

    raycaster.setFromCamera(pointer, camera)

    const meshes: THREE.Mesh[] = []
    meshRefs.value.forEach(wrapper => {
      if (wrapper?.mesh) {
        meshes.push(wrapper.mesh)
      }
    })
    const intersects = raycaster.intersectObjects(scene.children, false)

    if (intersects.length > 0) {
      // if (INTERSECTED != intersects[0].object) {

      //   if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      //   INTERSECTED = intersects[0].object;
      //   INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      //   INTERSECTED.material.emissive.setHex(0xff0000);

      // }

      const intersect = intersects[0]
      const newIndex = meshes.indexOf(intersect.object as THREE.Mesh)

      if (intersectedIndex !== newIndex) {
        if (intersectedIndex !== -1 && cubes.value[intersectedIndex]) {
          cubes.value[intersectedIndex].emissive = 0x000000
        }

        intersectedIndex = newIndex
        if (cubes.value[intersectedIndex]) {
          cubes.value[intersectedIndex].emissive = 0xff0000
        }
      }
    } else {
      // if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      // INTERSECTED = null;
      if (intersectedIndex !== -1 && cubes.value[intersectedIndex]) {
        cubes.value[intersectedIndex].emissive = 0x000000
      }
      intersectedIndex = -1
    }
  }
}
</script>

<style scoped></style>
