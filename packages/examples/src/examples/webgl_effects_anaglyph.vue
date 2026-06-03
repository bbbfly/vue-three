<template>
  <TCanvas ref="canvasRef" antialias animation-loop :on-render="onAnimate" @mousemove="onCanvasMouseMove">
    <TScene ref="sceneRef" :background="backgroundTexture">
      <TPerspectiveCamera ref="cameraRef" :fov="60" :near="0.01" :far="100" :position="[0, 0, 3]" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
// @ts-ignore
import { AnaglyphEffect } from 'three/addons/effects/AnaglyphEffect.js'
import { TCanvas, TScene, TPerspectiveCamera } from '@vue-three/vue-three'

// 引用
const canvasRef = ref<any>(null)
const sceneRef = ref<any>(null)
const cameraRef = ref<any>(null)

// 背景纹理
const backgroundTexture = ref<THREE.CubeTexture | undefined>(undefined)

// 球体数组
const spheres: THREE.Mesh[] = []

// 鼠标位置
let mouseX = 0
let mouseY = 0

// 鼠标移动事件处理(Canvas 事件)
function onCanvasMouseMove(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target) return

  const rect = target.getBoundingClientRect()
  mouseX = (event.clientX - rect.left - rect.width / 2) / 100
  mouseY = (event.clientY - rect.top - rect.height / 2) / 100
}

// AnaglyphEffect 实例
let effect: AnaglyphEffect | null = null
let effectInitialized = false

onMounted(async () => {

  // 加载立方体贴图
  const path = '/textures/cube/pisa/'
  const format = '.png'
  const urls = [
    path + 'px' + format,
    path + 'nx' + format,
    path + 'py' + format,
    path + 'ny' + format,
    path + 'pz' + format,
    path + 'nz' + format
  ]

  const loader = new THREE.CubeTextureLoader()
  backgroundTexture.value = loader.load(urls)
})

onBeforeUnmount(() => {

  // 清理 AnaglyphEffect
  if (effect) {
    effect = null
  }

  // 清理球体
  spheres.length = 0
})

/**
 * 初始化 AnaglyphEffect
 */
function initEffect(renderer: THREE.WebGLRenderer, size: { width: number; height: number }) {
  if (effectInitialized) return

  effect = new AnaglyphEffect(renderer)
  effect.setSize(window.innerWidth, window.innerHeight)

  // 配置立体参数(物理正确的渲染)
  // eyeSep: 瞳距(人类默认 0.064m / 64mm)
  // planeDistance: 零视差平面距离(此处的物体出现在屏幕深度)
  effect.eyeSep = 0.064
  effect.planeDistance = 3 // 匹配相机到原点的距离,场景中心零视差

  effectInitialized = true
}

/**
 * 初始化场景中的球体
 */
function initSpheres(scene) {

  const textureCube = backgroundTexture.value
  if (!textureCube) return

  const geometry = new THREE.SphereGeometry(0.1, 32, 16)
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: textureCube
  })

  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.x = Math.random() * 10 - 5
    mesh.position.y = Math.random() * 10 - 5
    mesh.position.z = Math.random() * 10 - 5

    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1

    scene.add(mesh)
    spheres.push(mesh)
  }

}

/**
 * 动画回调
 */
function onAnimate({
  scene,
  camera,
  renderer,
  size
}: {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer,
  size: { width: number; height: number }
}) {
  // 初始化 Effect
  if (!effectInitialized && renderer && backgroundTexture.value) {
    initEffect(renderer, size)
    initSpheres(scene)
  }

  // 使用 AnaglyphEffect 渲染
  if (effect && effectInitialized) {
    const timer = 0.0001 * Date.now()

    // 相机跟随鼠标移动
    const perspectiveCamera = camera as THREE.PerspectiveCamera
    perspectiveCamera.position.x += (mouseX - perspectiveCamera.position.x) * 0.05
    perspectiveCamera.position.y += (-mouseY - perspectiveCamera.position.y) * 0.05

    perspectiveCamera.lookAt(scene.position)

    // 更新球体位置
    for (let i = 0, il = spheres.length; i < il; i++) {
      const sphere = spheres[i]
      sphere.position.x = 5 * Math.cos(timer + i)
      sphere.position.y = 5 * Math.sin(timer + i * 1.1)
    }

    // 使用 effect 渲染而不是默认的 renderer.render
    effect.render(scene, camera)
  }
}
</script>

<style scoped></style>
