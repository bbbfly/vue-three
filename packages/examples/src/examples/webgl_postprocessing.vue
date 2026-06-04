<template>
  <TCanvas ref="canvasRef" antialias animation-loop :on-render="onAnimate">
    <TScene ref="sceneRef" background="#000000">
      <TPerspectiveCamera ref="cameraRef" :fov="70" :near="1" :far="1000" :position="[0, 0, 400]" />

      <!-- 容器对象 -->
      <TGroup ref="objectRef" :rotation="groupRotation">
        <!-- 100个随机分布的球体 -->
        <TMesh v-for="i in 100" :key="i" :position="getSpherePosition(i)" :rotation="getSphereRotation(i)"
          :scale="getSphereScale(i)">
          <TSphere :args="[1, 4, 4]" />
          <TMeshPhongMaterial :color="0xffffff" :flat-shading="true" />
        </TMesh>
      </TGroup>

      <!-- 灯光 -->
      <TAmbientLight :color="0xcccccc" />
      <TDirectionalLight :color="0xffffff" :intensity="3" :position="[1, 1, 1]" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
// @ts-ignore
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
// @ts-ignore
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
// @ts-ignore
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
// @ts-ignore
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js'
// @ts-ignore
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js'
// @ts-ignore
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TGroup,
  TMesh,
  TSphere,
  TMeshPhongMaterial,
  TAmbientLight,
  TDirectionalLight
} from '@vue-three/vue-three'

// 引用
const canvasRef = ref<any>(null)
const sceneRef = ref<any>(null)
const cameraRef = ref<any>(null)
const objectRef = ref<any>(null)

// 容器旋转角度
const groupRotation = ref<[number, number, number]>([0, 0, 0])

// 后处理组合器
let composer: EffectComposer | null = null
let composerInitialized = false

// 预计算球体位置、旋转和缩放
const spherePositions: [number, number, number][] = []
const sphereRotations: [number, number, number][] = []
const sphereScales: [number, number, number][] = []

for (let i = 0; i < 100; i++) {
  // 随机位置
  const pos = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize().multiplyScalar(Math.random() * 400)
  spherePositions.push([pos.x, pos.y, pos.z])

  // 随机旋转
  sphereRotations.push([
    Math.random() * 2,
    Math.random() * 2,
    Math.random() * 2
  ])

  // 随机缩放
  const scale = Math.random() * 50
  sphereScales.push([scale, scale, scale])
}

/**
 * 获取球体位置
 */
function getSpherePosition(index: number): [number, number, number] {
  return spherePositions[index - 1]
}

/**
 * 获取球体旋转
 */
function getSphereRotation(index: number): [number, number, number] {
  return sphereRotations[index - 1]
}

/**
 * 获取球体缩放
 */
function getSphereScale(index: number): [number, number, number] {
  return sphereScales[index - 1]
}

/**
 * 初始化后处理
 */
function initPostProcessing(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  size: { width: number; height: number }
) {
  if (composerInitialized || !renderer || !scene || !camera) return

  // 创建 EffectComposer
  composer = new EffectComposer(renderer)

  // 添加渲染通道
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  // 添加点阵屏幕效果
  const dotScreenEffect = new ShaderPass(DotScreenShader)
  dotScreenEffect.uniforms['scale'].value = 4
  composer.addPass(dotScreenEffect)

  // 添加 RGB 偏移效果
  const rgbShiftEffect = new ShaderPass(RGBShiftShader)
  rgbShiftEffect.uniforms['amount'].value = 0.0015
  composer.addPass(rgbShiftEffect)

  // 添加输出通道
  const outputPass = new OutputPass()
  composer.addPass(outputPass)

  // 设置尺寸
  composer.setSize(size.width, size.height)

  composerInitialized = true
}

/**
 * 动画回调
 */
function onAnimate(ctx: {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer?: THREE.WebGLRenderer
  size: { width: number; height: number }
  delta: number
}) {
  const { scene, camera, renderer, size } = ctx

  // 更新容器旋转角度
  groupRotation.value[0] += 0.005
  groupRotation.value[1] += 0.01

  // 初始化后处理
  if (!composerInitialized && renderer) {
    initPostProcessing(renderer, scene, camera, size)
  }

  // 使用 composer 渲染
  if (composer && composerInitialized) {
    composer.render()
  }
}

onBeforeUnmount(() => {
  // 清理后处理组合器
  if (composer) {
    composer = null
  }
  composerInitialized = false
})
</script>

<style scoped></style>
