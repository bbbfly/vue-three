<template>
  <div class="texture-partialupdate-example">
    <TCanvas ref="canvasRef" :antialias="true" :on-render="onRender">
      <TScene>
        <TPerspectiveCamera
          ref="cameraRef"
          :fov="70"
          :near="0.01"
          :far="10"
          :position="[0, 0, 2]"
        />
        <TMesh>
          <TPlane :args="[2, 2]" />
          <TMeshBasicMaterial ref="materialRef" :map="diffuseMapRef" />
        </TMesh>
      </TScene>
    </TCanvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TMesh,
  TPlane,
  TMeshBasicMaterial
} from '@vue-three/vue-three'

const canvasRef = ref<InstanceType<typeof TCanvas> | null>(null)
const cameraRef = ref<InstanceType<typeof TPerspectiveCamera> | null>(null)
const materialRef = ref<InstanceType<typeof TMeshBasicMaterial> | null>(null)

/** diffuseMap 纹理引用，供模板绑定 */
const diffuseMapRef = ref<THREE.Texture | null>(null)

/** 起始时间戳（秒） */
let startTime = 0

/** 上次更新时间（秒） */
let last = 0

/** 随机位置 */
const position = new THREE.Vector2()

/** 随机颜色 */
const color = new THREE.Color()

/** DataTexture - 每次更新时填充随机颜色 */
let dataTexture: THREE.DataTexture | null = null

/** diffuseMap - 棋盘格基础纹理 */
let diffuseMap: THREE.Texture | null = null

/** 需要清理的资源 */
const disposables: { dispose: () => void }[] = []

/**
 * 更新 DataTexture 的颜色数据
 * @param texture - 目标 DataTexture
 */
function updateDataTexture(texture: THREE.DataTexture): void {
  const size = texture.image.width * texture.image.height
  const data = texture.image.data

  // 生成随机颜色并更新纹理数据
  color.setHex(Math.random() * 0xffffff)

  const r = Math.floor(color.r * 255)
  const g = Math.floor(color.g * 255)
  const b = Math.floor(color.b * 255)

  for (let i = 0; i < size; i++) {
    const stride = i * 4
    data[stride] = r
    data[stride + 1] = g
    data[stride + 2] = b
    data[stride + 3] = 1
  }
}

/**
 * 自定义渲染回调 - 定时更新 DataTexture 并复制到 diffuseMap
 */
const onRender = (params: {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.Camera
}): void => {
  const { renderer } = params

  const now = performance.now() / 1000
  if (startTime === 0) startTime = now
  const elapsedTime = now - startTime

  if (elapsedTime - last > 0.1 && dataTexture && diffuseMap) {
    last = elapsedTime

    // 随机位置（32 的倍数，范围 -32 到 480）
    position.x = 32 * THREE.MathUtils.randInt(1, 16) - 32
    position.y = 32 * THREE.MathUtils.randInt(1, 16) - 32

    // 生成新的随机颜色数据
    updateDataTexture(dataTexture)

    // 将 DataTexture 复制到 diffuseMap 的随机位置
    // 注意：@types/three 类型签名与 Three.js 0.184 运行时 API 不一致，使用类型断言
    ;(renderer as any).copyTextureToTexture(dataTexture, diffuseMap, null, position)
    materialRef.value.material.map = diffuseMap
    materialRef.value.material.needsUpdate = true
  }
  renderer.render(params.scene, params.camera)
}

onMounted(async () => {
  const renderer = canvasRef.value?.context?.renderer
  if (!renderer) return

  // 记录起始时间
  startTime = performance.now() / 1000
  last = startTime

  // 加载棋盘格纹理
  const loader = new THREE.TextureLoader()
  diffuseMap = await loader.loadAsync('/textures/floors/FloorsCheckerboard_S_Diffuse.jpg')
  diffuseMap.colorSpace = THREE.SRGBColorSpace
  diffuseMap.minFilter = THREE.LinearFilter
  diffuseMap.generateMipmaps = false
  disposables.push(diffuseMap)

  // 设置模板绑定的纹理引用
  diffuseMapRef.value = diffuseMap

  // 创建 32x32 DataTexture
  const width = 32
  const height = 32
  const data = new Uint8Array(width * height * 4)
  dataTexture = new THREE.DataTexture(data, width, height)
  dataTexture.colorSpace = THREE.SRGBColorSpace
  disposables.push(dataTexture)
})

onUnmounted(() => {
  // 清理资源
  disposables.forEach(d => d.dispose())
  disposables.length = 0

  dataTexture = null
  diffuseMap = null
  diffuseMapRef.value = null
})
</script>

<style scoped>
.texture-partialupdate-example {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
