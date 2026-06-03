<template>
  <TCanvas ref="canvasRef" antialias animation-loop @animate="animate">
    <TPerspectiveCamera ref="cameraRef" :fov="60" :near="100" :far="10000" />

    <TScene ref="sceneRef" :background="0x99ddff">
      <TDirectionalLight
        ref="directionalLightRef"
        :position="[200, 1000, 50]"
        :cast-shadow="true"
      />

      <THemisphereLight :sky-color="0x99ddff" :ground-color="0x669933" :intensity="1 / 3" />

      <TMesh :rotation="[-Math.PI / 2, 0, 0]" :receive-shadow="true">
        <TPlane :args="[1000000, 1000000]" />
        <TMeshStandardMaterial :color="0x669933" :depth-write="true" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject, nextTick } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TDirectionalLight,
  THemisphereLight,
  TMesh,
  TPlane,
  TMeshStandardMaterial
} from '@vue-three/vue-three'

// 引用
const canvasRef = ref<any>(null)
const cameraRef = ref<any>(null)
const sceneRef = ref<any>(null)
const directionalLightRef = ref<any>(null)

// 常量
const offset = 5000
const timeOffsets = new Float32Array(1024)

// 初始化时间偏移
for (let i = 0; i < 1024; i++) {
  timeOffsets[i] = Math.random() * 3
}

// 变量
let instancedMesh: THREE.InstancedMesh | null = null
let dummy: THREE.Object3D | null = null
let mixer: THREE.AnimationMixer | null = null
let startTime = Date.now()

onMounted(async () => {
  await nextTick()
  setupShadowCamera()
  loadHorseModel()
})

onBeforeUnmount(() => {
  // 清理资源
  if (mixer) {
    mixer.stopAllAction()
  }
  if (instancedMesh) {
    instancedMesh.dispose()
  }
})

/**
 * 加载马模型
 */
function loadHorseModel() {
  const loader = new GLTFLoader()

  loader.load(
    '/lib/models/gltf/Horse.glb',
    (glb: any) => {
      // 获取模型
      dummy = glb.scene.children[0] as THREE.Object3D

      // 创建实例化网格
      if (sceneRef.value?.scene && dummy.geometry && dummy.material) {
        instancedMesh = new THREE.InstancedMesh(dummy.geometry, dummy.material, 1024)
        instancedMesh.castShadow = true

        // 设置实例矩阵和颜色
        const position = new THREE.Vector3()
        const color = new THREE.Color()

        let i = 0
        for (let x = 0; x < 32; x++) {
          for (let y = 0; y < 32; y++) {
            position.set(offset - 300 * x + 200 * Math.random(), 0, offset - 300 * y)

            // 更新 dummy 位置并计算矩阵
            dummy.position.copy(position)
            dummy.updateMatrix()

            instancedMesh.setMatrixAt(i, dummy.matrix)
            instancedMesh.setColorAt(i, color.setHSL(Math.random() * 360, 0.5, 0.66))

            i++
          }
        }

        instancedMesh.instanceMatrix.needsUpdate = true
        instancedMesh.instanceColor.needsUpdate = true

        // 添加到场景
        sceneRef.value.scene.add(instancedMesh)

        // 创建动画混合器
        mixer = new THREE.AnimationMixer(glb.scene)
        const action = mixer.clipAction(glb.animations[0])
        action.play()

        console.log('Horse model loaded, InstancedMesh created')
      }
    },
    undefined,
    (error: any) => {
      console.error('Error loading horse model:', error)
    }
  )
}

/**
 * 配置阴影相机
 */
function setupShadowCamera() {
  const light = directionalLightRef.value?.light
  if (light && light.shadow && light.shadow.camera) {
    light.shadow.camera.left = -5000
    light.shadow.camera.right = 5000
    light.shadow.camera.top = 5000
    light.shadow.camera.bottom = -5000
    light.shadow.camera.far = 2000
    light.shadow.camera.updateProjectionMatrix()
    light.shadow.bias = -0.01
  }
}

/**
 * 动画循环
 */
function animate({ camera }: { camera: THREE.Camera }) {
  const time = (Date.now() - startTime) / 1000

  // 相机环绕动画
  const r = 3000
  camera.position.set(
    Math.sin(time / 10) * r,
    1500 + 1000 * Math.cos(time / 5),
    Math.cos(time / 10) * r
  )
  camera.lookAt(0, 0, 0)

  // 更新实例变形目标
  if (instancedMesh && dummy && mixer) {
    for (let i = 0; i < 1024; i++) {
      // 设置每个实例的动画时间
      mixer.setTime(time + timeOffsets[i])

      // 设置变形目标
      instancedMesh.setMorphAt(i, dummy)
    }

    // 标记变形纹理需要更新
    if (instancedMesh.morphTexture) {
      instancedMesh.morphTexture.needsUpdate = true
    }
  }
}
</script>

<style scoped></style>
