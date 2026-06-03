<template>
  <TCanvas antialias clear-color="#000000">
    <TScene ref="sceneRef">
      <TPerspectiveCamera
        ref="cameraRef"
        :fov="45"
        :near="1"
        :far="2000"
        :position="[0, 500, 800]"
      />

      <TAmbientLight :intensity="1.5" :color="0xcccccc" />
      <TPointLight :intensity="2.5" :distance="0" :decay="0" />

      <!-- 第一行 - 多面体 -->
      <TMesh :ref="setMeshRef" :position="[-300, 0, 300]">
        <TSphere :args="[75, 20, 10]" />
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[-100, 0, 300]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[100, 0, 300]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[300, 0, 300]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <!-- 第二行 - 基础几何体 -->
      <TMesh :ref="setMeshRef" :position="[-300, 0, 100]">
        <TPlane :args="[100, 100, 4, 4]" />
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[-100, 0, 100]">
        <TBox :args="[100, 100, 100, 4, 4, 4]" />
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[100, 0, 100]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[300, 0, 100]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <!-- 第三行 -->
      <TMesh :ref="setMeshRef" :position="[-300, 0, -100]">
        <TCylinder :args="[25, 75, 100, 40, 5]" />
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[-100, 0, -100]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[100, 0, -100]">
        <TTorus :args="[50, 20, 20, 20]" />
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[300, 0, -100]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <!-- 第四行 -->
      <TMesh :ref="setMeshRef" :position="[-300, 0, -300]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[-100, 0, -300]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[100, 0, -300]">
        <TMeshPhongMaterial :side="2">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
      </TMesh>

      <TMesh :ref="setMeshRef" :position="[300, 0, -300]">
        <TMeshPhongMaterial :side="THREE.DoubleSide">
          <TTexture
            :url="textureUrl"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :anisotropy="16"
          />
        </TMeshPhongMaterial>
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
  TAmbientLight,
  TPointLight,
  TMesh,
  TBox,
  TSphere,
  TPlane,
  TCylinder,
  TTorus,
  TMeshPhongMaterial,
  TTexture
} from '@vue-three/vue-three'
import { RepeatWrapping, SRGBColorSpace } from 'three'
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'
import { plane, klein, mobius } from 'three/addons/geometries/ParametricFunctions.js'

const textureUrl = '/textures/uv_grid_opengl.jpg'

const sceneRef = ref<any>(null)
const cameraRef = ref<any>(null)
const meshRefs = ref<any[]>([])

const setMeshRef = (el: any) => {
  if (el && !meshRefs.value.includes(el)) {
    meshRefs.value.push(el)
  }
}

onMounted(() => {
  nextTick(() => {
    setupCustomGeometries()
    setupAnimationLoop()
    setupTextureColorSpace()
  })
})

function setupTextureColorSpace() {
  meshRefs.value.forEach(meshWrapper => {
    const mesh = meshWrapper.mesh?.value
    if (mesh?.material?.map) {
      mesh.material.map.colorSpace = SRGBColorSpace
    }
  })
}

function setupCustomGeometries() {
  const meshes = meshRefs.value
  if (meshes.length < 16) return

  meshes[1]?.geometry?.dispose()
  meshes[1]?.setGeometry(new THREE.IcosahedronGeometry(75))

  meshes[2]?.geometry?.dispose()
  meshes[2]?.setGeometry(new THREE.OctahedronGeometry(75))

  meshes[3]?.geometry?.dispose()
  meshes[3]?.setGeometry(new THREE.TetrahedronGeometry(75))

  meshes[6]?.geometry?.dispose()
  meshes[6]?.setGeometry(new THREE.CircleGeometry(50, 20, 0, Math.PI * 2))

  meshes[7]?.geometry?.dispose()
  meshes[7]?.setGeometry(new THREE.RingGeometry(10, 50, 20, 5, 0, Math.PI * 2))

  const points = []
  for (let i = 0; i < 50; i++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * Math.sin(i * 0.1) * 15 + 50, (i - 5) * 2))
  }
  meshes[9]?.geometry?.dispose()
  meshes[9]?.setGeometry(new THREE.LatheGeometry(points, 20))

  meshes[11]?.geometry?.dispose()
  meshes[11]?.setGeometry(new THREE.TorusKnotGeometry(50, 10, 50, 20))

  meshes[12]?.geometry?.dispose()
  meshes[12]?.setGeometry(new THREE.CapsuleGeometry(20, 50))

  const planeGeometry = new ParametricGeometry(plane, 10, 10)
  planeGeometry.scale(100, 100, 100)
  planeGeometry.center()
  meshes[13]?.geometry?.dispose()
  meshes[13]?.setGeometry(planeGeometry)

  meshes[14]?.geometry?.dispose()
  meshes[14]?.setGeometry(new ParametricGeometry(klein, 20, 20))
  meshes[14]?.mesh.scale.multiplyScalar(5)

  meshes[15]?.geometry?.dispose()
  meshes[15]?.setGeometry(new ParametricGeometry(mobius, 20, 20))
  meshes[15]?.mesh.scale.multiplyScalar(30)
}

function setupAnimationLoop() {
  const scene = sceneRef.value?.scene
  const camera = cameraRef.value

  console.log(scene.value, cameraRef.value)
  if (!scene || !camera) return
  const animate = () => {
    requestAnimationFrame(animate)

    const timer = Date.now() * 0.0001

    camera.camera.position.x = Math.cos(timer) * 800
    camera.camera.position.z = Math.sin(timer) * 800
    camera.lookAt(scene.position)

    scene.traverse((object: any) => {
      if (object.isMesh === true) {
        object.rotation.x = timer * 5
        object.rotation.y = timer * 2.5
      }
    })
  }

  animate()
}
</script>

<style scoped></style>
