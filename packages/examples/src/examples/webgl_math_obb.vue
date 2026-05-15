<template>
  <TCanvas antialias background="#ffffff" @click="onClick">
    <TPerspectiveCamera ref="cameraRef" :fov="70" :near="1" :far="1000" :position="[0, 0, 75]" />

    <TScene ref="sceneRef">
      <THemisphereLight sky-color="#ffffff" ground-color="#222222" :intensity="4" :position="[1, 1, 1]" />

      <TMesh v-for="(object, index) in objects" :key="index" :ref="el => setObjectRef(el, index)"
        :position="[object.position.x, object.position.y, object.position.z]"
        :rotation="[object.rotation.x, object.rotation.y, object.rotation.z]"
        :scale="[object.scale.x, object.scale.y, object.scale.z]" :matrix-auto-update="false">
        <TBox :args="[object.size.x, object.size.y, object.size.z]" />
        <TMeshLambertMaterial :color="object.color" />
      </TMesh>

      <TMesh ref="hitboxRef" :visible="hitboxVisible">
        <TBox :args="[10, 5, 6]" />
        <TMeshBasicMaterial color="#000000" wireframe />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import * as THREE from 'three'
import { OBB } from 'three/addons/math/OBB.js'
import {
  TCanvas,
  TPerspectiveCamera,
  TScene,
  THemisphereLight,
  TMesh,
  TBox,
  TMeshLambertMaterial,
  TMeshBasicMaterial
} from '@vue-three/vue-three'

interface ObjectData {
  position: THREE.Vector3
  rotation: THREE.Vector3
  scale: THREE.Vector3
  size: THREE.Vector3
  color: number
  obb: OBB
  geometryObb: OBB
}

const cameraRef = ref<any>(null)
const sceneRef = ref<any>(null)
const hitboxRef = ref<any>(null)
const hitboxVisible = ref(false)

const objects = ref<ObjectData[]>([])
const objectRefs = ref<any[]>([])

let scene: THREE.Scene | null = null
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2

function setObjectRef(el: any, index: number) {
  if (el) {
    objectRefs.value[index] = el
  }
}

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

onMounted(() => {
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  const size = new THREE.Vector3(10, 5, 6)
  const geometryObb = new OBB()
  geometryObb.halfSize.copy(size).multiplyScalar(0.5)

  for (let i = 0; i < 100; i++) {
    const object: ObjectData = {
      position: new THREE.Vector3(
        Math.random() * 80 - 40,
        Math.random() * 80 - 40,
        Math.random() * 80 - 40
      ),
      rotation: new THREE.Vector3(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
      ),
      scale: new THREE.Vector3(
        Math.random() + 0.5,
        Math.random() + 0.5,
        Math.random() + 0.5
      ),
      size: size.clone(),
      color: 0x00ff00,
      obb: new OBB(),
      geometryObb: geometryObb.clone()
    }
    objects.value.push(object)
  }

  ; (sceneRef.value?.scene as THREE.Scene).onBeforeRender = () => {
    const delta = 0.016

    for (let i = 0, il = objects.value.length; i < il; i++) {
      const mesh = objectRefs.value[i]?.mesh as THREE.Mesh
      if (!mesh) continue
      const geometry = mesh.geometry

      mesh.rotation.x += delta * Math.PI * 0.20
      mesh.rotation.y += delta * Math.PI * 0.10

      mesh.updateMatrix()
      mesh.updateMatrixWorld()

      if (!geometry.userData.obb) {
        geometry.userData.obb = new OBB()
        geometry.userData.obb.halfSize.copy(size).multiplyScalar(0.5);
      }
      if (!mesh.userData.obb) {
        mesh.userData.obb = new OBB()
      }
      mesh.userData.obb.copy(geometry.userData.obb)
      mesh.userData.obb.applyMatrix4(mesh.matrixWorld)

      mesh.material.color.setHex(0x00ff00)
    }

    for (let i = 0, il = objects.value.length; i < il; i++) {
      const object = objectRefs.value[i].mesh
      const obb = object.userData.obb

      for (let j = i + 1, jl = objects.value.length; j < jl; j++) {
        const objectToTest = objectRefs.value[j].mesh
        const obbToTest = objectToTest.userData.obb

        if (obb.intersectsOBB(obbToTest)) {
          object.material.color.setHex(0xff0000);
          objectToTest.material.color.setHex(0xff0000);
        }
      }
    }
  }
})

function onClick(event: { clientX: number; clientY: number; target: any }) {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  const camera = cameraRef.value?.camera as THREE.PerspectiveCamera
  if (!camera) return

  raycaster.setFromCamera(mouse, camera)

  const intersectionPoint = new THREE.Vector3()
  const intersections: { distance: number; index: number }[] = []

  for (let i = 0, il = objects.value.length; i < il; i++) {
    const object = objectRefs.value[i].mesh
    const obb = object.userData.obb
    const ray = raycaster.ray

    if (obb.intersectRay(ray, intersectionPoint) !== null) {
      const distance = ray.origin.distanceTo(intersectionPoint)
      intersections.push({ distance, index: i })
    }
  }

  const hitbox = hitboxRef.value?.mesh as THREE.Mesh
  if (hitbox) {
    const parent = hitbox.parent
    if (parent) parent.remove(hitbox)
  }

  if (intersections.length > 0) {
    intersections.sort((a, b) => a.distance - b.distance)
    const closestObject = objectRefs.value[intersections[0].index]?.mesh as THREE.Mesh
    if (closestObject && hitbox) {
      closestObject.add(hitbox)
      hitboxVisible.value = true
    }
  } else {
    hitboxVisible.value = false
  }
}
</script>

<style scoped></style>
