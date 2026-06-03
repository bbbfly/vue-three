<template>
  <TCanvas ref="canvasRef" antialias animation-loop @animate="animate">
    <TPerspectiveCamera ref="cameraRef" :fov="60" :near="0.1" :far="100" :position="[10, 10, 10]" />

    <TScene ref="sceneRef" :background="0xadd8e6">
      <TInstancedMesh ref="instancedMeshRef" :instance-count="instanceCount">
        <TBox />
        <TMeshStandardMaterial />
      </TInstancedMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import TWEEN from 'three/addons/libs/tween.module.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TInstancedMesh,
  TBox,
  TMeshStandardMaterial,
  TTexture
} from '@vue-three/vue-three'

// 实例数量
const amount = 100
const instanceCount = Math.pow(amount, 2)

// 引用
const instancedMeshRef = ref<any>(null)
const cameraRef = ref<any>(null)
const canvasRef = ref<any>(null)
const sceneRef = ref<any>(null)

// 数据数组
const seeds: number[] = []
const baseColors: number[] = []
const dummy = new THREE.Object3D()
const color = new THREE.Color()

// 颜色动画
const colors = [new THREE.Color(0x00ffff), new THREE.Color(0xffff00), new THREE.Color(0xff00ff)]
const animation = { t: 0 }
let currentColorIndex = 0
let nextColorIndex = 1

// 相机
let cameraTarget = new THREE.Vector3()
let pmremGenerator: THREE.PMREMGenerator | null = null
let startTime = Date.now()

onMounted(async () => {
  await nextTick()
  setupEnvironment()
  startTween()
  setInterval(startTween, 3000)
  initInstances()
})

onBeforeUnmount(() => {
  // 清理资源
  if (pmremGenerator) {
    pmremGenerator.dispose()
  }
  TWEEN.removeAll()
})

/**
 * 初始化实例数据
 */
function initInstances() {
  const mesh = instancedMeshRef.value?.mesh
  if (!mesh) {
    console.warn('InstancedMesh not ready')
    return
  }

  console.log('Initializing instances with count:', instanceCount, 'mesh:', mesh)

  // 设置动态更新
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

  let i = 0
  const offset = (amount - 1) / 2

  for (let x = 0; x < amount; x++) {
    for (let z = 0; z < amount; z++) {
      dummy.position.set(offset - x, 0, offset - z)
      dummy.scale.set(1, 2, 1)
      dummy.updateMatrix()

      // 保存基础颜色
      color.setHSL(1, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5)
      baseColors.push(color.getHex())

      // 设置实例矩阵和颜色
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, color.clone().multiply(colors[0]))

      i++
      seeds.push(Math.random())
    }
  }

  mesh.instanceMatrix.needsUpdate = true
  mesh.instanceColor.needsUpdate = true
}

/**
 * 设置环境贴图
 */
function setupEnvironment() {
  console.log('setupEnvironment called')
  console.log('canvasRef:', canvasRef.value)
  console.log('sceneRef:', sceneRef.value)

  if (!canvasRef.value?.context?.renderer || !sceneRef.value?.scene) {
    console.warn('Renderer or scene not ready')
    return
  }

  pmremGenerator = new THREE.PMREMGenerator(canvasRef.value.context.renderer)
  pmremGenerator.compileCubemapShader()

  const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
  ;(sceneRef.value.scene as any).environment = envTexture

  console.log('Environment set:', (sceneRef.value.scene as any).environment)
}

/**
 * 启动颜色过渡动画
 */
function startTween() {
  new TWEEN.Tween(animation)
    .to({ t: 1 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.In)
    .onComplete(() => {
      animation.t = 0
      currentColorIndex = nextColorIndex
      nextColorIndex++
      if (nextColorIndex >= colors.length) nextColorIndex = 0
    })
    .start()
}

/**
 * 动画循环
 */
function animate({ camera }) {
  const time = (Date.now() - startTime) / 1000
  TWEEN.update()

  const mesh = instancedMeshRef.value?.mesh
  if (!mesh) return

  // 相机动画
  camera.position.x = Math.sin(time / 4) * 10
  camera.position.z = Math.cos(time / 4) * 10
  camera.position.y = 8 + Math.cos(time / 2) * 2

  cameraTarget.x = Math.sin(time / 4) * -8
  cameraTarget.z = Math.cos(time / 2) * -8

  camera.lookAt(cameraTarget)
  camera.up.x = Math.sin(time / 400)

  // 更新实例位置和颜色
  const maxDistance = 75

  for (let i = 0; i < mesh.count; i++) {
    mesh.getMatrixAt(i, dummy.matrix)
    dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)

    // Y轴波浪动画
    dummy.position.y = Math.abs(Math.sin((time + seeds[i]) * 2 + seeds[i]))
    dummy.updateMatrix()

    mesh.setMatrixAt(i, dummy.matrix)

    // 颜色渐变
    if (animation.t > 0) {
      const currentColor = colors[currentColorIndex]
      const nextColor = colors[nextColorIndex]
      const f = dummy.position.length() / maxDistance

      if (f <= animation.t) {
        color.set(baseColors[i]).multiply(nextColor)
      } else {
        color.set(baseColors[i]).multiply(currentColor)
      }

      mesh.setColorAt(i, color)
    }
  }

  mesh.instanceMatrix.needsUpdate = true
  if (animation.t > 0) {
    mesh.instanceColor.needsUpdate = true
  }

  mesh.computeBoundingSphere()
}
</script>

<style scoped></style>
