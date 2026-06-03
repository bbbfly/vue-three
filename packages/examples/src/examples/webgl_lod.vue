<template>
  <TCanvas ref="canvasRef" antialias animation-loop @animate="animate">
    <TPerspectiveCamera ref="cameraRef" :fov="45" :near="1" :far="15000" :position="[0, 0, 1000]" />

    <TScene
      ref="sceneRef"
      :background="0x000000"
      :fog="{ type: 'exp', color: 0x000000, near: 1, far: 15000 }"
    >
      <TFlyControls ref="flyControlsRef" :movement-speed="1000" :roll-speed="0.314" />

      <TPointLight
        :color="0xff2200"
        :intensity="3"
        :distance="0"
        :decay="0"
        :position="[0, 0, 0]"
      />
      <TDirectionalLight :color="0xffffff" :intensity="3" :position="[0, 0, 1]" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TFlyControls,
  TPointLight,
  TDirectionalLight
} from '@vue-three/vue-three'

// 引用
const sceneRef = ref<any>(null)
const flyControlsRef = ref<any>(null)

// LOD 网格数组
const lodMeshes: THREE.LOD[] = []

// 时间追踪
let lastTime = Date.now()

onMounted(async () => {
  await nextTick()
  init()
})

onBeforeUnmount(() => {
  // 清理资源
  clean()
})

/**
 * 初始化场景
 */
function init() {
  if (!sceneRef.value?.scene) return

  const scene = sceneRef.value.scene

  // 定义不同层级的几何体和距离
  const geometryLevels: [THREE.IcosahedronGeometry, number][] = [
    [new THREE.IcosahedronGeometry(100, 16), 50],
    [new THREE.IcosahedronGeometry(100, 8), 300],
    [new THREE.IcosahedronGeometry(100, 4), 1000],
    [new THREE.IcosahedronGeometry(100, 2), 2000],
    [new THREE.IcosahedronGeometry(100, 1), 8000]
  ]

  // 创建材质
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wireframe: true
  })

  // 创建 1000 个 LOD 对象
  for (let j = 0; j < 1000; j++) {
    const lod = new THREE.LOD()

    // 为每个 LOD 添加 5 个层级
    for (let i = 0; i < geometryLevels.length; i++) {
      const [geometry, distance] = geometryLevels[i]
      const mesh = new THREE.Mesh(geometry, material)
      mesh.scale.set(1.5, 1.5, 1.5)
      mesh.updateMatrix()
      mesh.matrixAutoUpdate = false
      lod.addLevel(mesh, distance)
    }

    // 随机位置
    lod.position.x = 10000 * (0.5 - Math.random())
    lod.position.y = 7500 * (0.5 - Math.random())
    lod.position.z = 10000 * (0.5 - Math.random())
    lod.updateMatrix()
    lod.matrixAutoUpdate = false

    scene.add(lod)
    lodMeshes.push(lod)
  }
}

/**
 * 清理资源
 */
function clean() {
  if (!sceneRef.value?.scene) return

  const scene = sceneRef.value.scene

  // 移除所有 LOD 对象
  for (const lod of lodMeshes) {
    scene.remove(lod)
    // 清理每个层级的网格
    lod.levels.forEach((level: any) => {
      if (level.object) {
        level.object.geometry.dispose()
      }
    })
  }
  lodMeshes.length = 0
}

/**
 * 动画循环
 */
function animate() {
  const currentTime = Date.now()
  const delta = (currentTime - lastTime) / 1000
  lastTime = currentTime

  // 更新 FlyControls
  if (flyControlsRef.value?.controls) {
    flyControlsRef.value.controls.update(delta)
  }
}
</script>

<style scoped></style>
