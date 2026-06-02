<template>
  <TCanvas  @animate="onAnimate">
    <TScene :background="0x444488">
      <TPerspectiveCamera :position="[0, 400, 1400]" :fov="40" :near="1" :far="2500" />
      <TOrbitControls :minDistance="200" :maxDistance="2000" />

      <TAmbientLight color="#c1c1c1" :intensity="3" />
      <TPointLight ref="pointLightRef" color="#ffffff" :intensity="2" :distance="800" :decay="0" />

      <!-- 生成卡通材质球体网格 -->
      <TMesh v-for="(mesh, index) in meshes" :key="index" :position="mesh.position">
        <TSphere :args="[sphereRadius, 32, 16]" />
        <TMeshToonMaterial :color="mesh.color" :gradientMap="mesh.gradientMap" />
      </TMesh>

      <!-- 光源指示器 -->
      <TMesh :position="particlePosition">
        <TSphere :args="[4, 8, 8]" />
        <TMeshBasicMaterial color="#ffffff" />
      </TMesh>

      <!-- 标签 -->
      <TMesh :position="[-350, 0, 0]">
        <TTextGeometry :text="'-gradientMap'" :font="font" :size="20" :depth="1" :curveSegments="1" />
        <TMeshBasicMaterial />
      </TMesh>
      <TMesh :position="[350, 0, 0]">
        <TTextGeometry :text="'+gradientMap'" :font="font" :size="20" :depth="1" :curveSegments="1" />
        <TMeshBasicMaterial />
      </TMesh>
      <TMesh :position="[0, 0, -300]">
        <TTextGeometry :text="'-diffuse'" :font="font" :size="20" :depth="1" :curveSegments="1" />
        <TMeshBasicMaterial />
      </TMesh>
      <TMesh :position="[0, 0, 300]">
        <TTextGeometry :text="'+diffuse'" :font="font" :size="20" :depth="1" :curveSegments="1" />
        <TMeshBasicMaterial />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TPointLight,
  TMesh,
  TSphere,
  TMeshToonMaterial,
  TMeshBasicMaterial,
  TTextGeometry,
} from '@vue-three/vue-three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { DataTexture, RedFormat, Color } from 'three'
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js'

interface MeshData {
  position: [number, number, number]
  color: number
  gradientMap: DataTexture | null
}

const sphereRadius = 32
const numberOfSpheresPerSide = 5
const stepSize = 1.0 / numberOfSpheresPerSide

const meshes = ref<MeshData[]>([])
const font = ref<Font | null>(null)
const pointLightRef = ref<any>(null)

const particlePosition = reactive<[number, number, number]>([0, 0, 0])

// 创建渐变贴图
function createGradientMap(levels: number): DataTexture {
  const colors = new Uint8Array(levels + 1)
  for (let c = 0; c <= levels; c++) {
    colors[c] = Math.floor((c / levels) * 256)
  }
  const gradientMap = new DataTexture(colors, colors.length, 1, RedFormat)
  gradientMap.needsUpdate = true
  return gradientMap
}

// 加载字体并初始化场景
onMounted(() => {
  const loader = new FontLoader()
  loader.load('/fonts/gentilis_regular.typeface.json', (loadedFont: Font) => {
    font.value = loadedFont
    initMeshes()
  })
})

// 初始化球体网格
function initMeshes() {
  const result: MeshData[] = []

  for (let alpha = 0; alpha <= 1.0; alpha += stepSize) {
    const alphaIndex = Math.round(alpha / stepSize)
    const gradientMap = createGradientMap(alphaIndex + 1)

    for (let beta = 0; beta <= 1.0; beta += stepSize) {
      for (let gamma = 0; gamma <= 1.0; gamma += stepSize) {
        // 基础单色能量保存
        const diffuseColor = new Color()
          .setHSL(alpha, 0.5, gamma * 0.5 + 0.1)
          .multiplyScalar(1 - beta * 0.2)

        result.push({
          position: [
            alpha * 400 - 200,
            beta * 400 - 200,
            gamma * 400 - 200
          ],
          color: diffuseColor.getHex(),
          gradientMap
        })
      }
    }
  }

  meshes.value = result
}

// 动画循环
let time = 0
const onAnimate = () => {
  time = Date.now() * 0.00025

  particlePosition[0] = Math.sin(time * 7) * 300
  particlePosition[1] = Math.cos(time * 5) * 400
  particlePosition[2] = Math.cos(time * 3) * 300

  // 更新点光源位置
  if (pointLightRef.value?.light) {
    pointLightRef.value.light.position.set(
      particlePosition[0],
      particlePosition[1],
      particlePosition[2]
    )
  }
}

// 清理
onBeforeUnmount(() => {
  meshes.value.forEach((mesh: MeshData) => {
    if (mesh.gradientMap) {
      mesh.gradientMap.dispose()
    }
  })
})
</script>
