<template>
  <div class="texture-filters-example">
    <TCanvas
      ref="canvasRef"
      :antialias="true"
      :auto-clear="false"
      :on-render="onRender"
      @mousemove="handleMouseMove"
    >
      <TScene :background="0x000000" :fog="{ color: 0x000000, near: 1500, far: 4000 }">
        <TPerspectiveCamera
          ref="cameraRef"
          :fov="35"
          :near="1"
          :far="5000"
          :position="[0, 0, 1500]"
        />
      </TScene>
    </TCanvas>

    <div class="labels">
      <div class="label label-left">
        Floor <span class="g">(128x128)</span><br />
        mag: <span class="c">Linear</span><br />
        min: <span class="c">LinearMipmapLinear</span><br />
        <br />
        Painting <span class="g">(748x600)</span><br />
        mag: <span class="c">Linear</span><br />
        min: <span class="c">Linear</span>
      </div>
      <div class="label label-right">
        Floor <br />
        mag: <span class="c">Nearest</span><br />
        min: <span class="c">Nearest</span><br />
        <br />
        Painting <br />
        mag: <span class="c">Nearest</span><br />
        min: <span class="c">Nearest</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { TCanvas, TScene, TPerspectiveCamera } from '@vue-three/vue-three'

const canvasRef = ref<InstanceType<typeof TCanvas> | null>(null)
const cameraRef = ref<InstanceType<typeof TPerspectiveCamera> | null>(null)

const mouseX = ref(0)
const mouseY = ref(0)

/** 场景2 - Nearest 过滤 */
let scene2: THREE.Scene | null = null

/** 纹理和材质引用，用于清理 */
const textures: THREE.Texture[] = []
const materials: THREE.Material[] = []

/**
 * 创建棋盘格 Canvas 纹理
 * @returns CanvasTexture 对象
 */
function createCheckerTexture(): THREE.CanvasTexture {
  const imageCanvas = document.createElement('canvas')
  const context = imageCanvas.getContext('2d')!

  imageCanvas.width = imageCanvas.height = 128

  context.fillStyle = '#444'
  context.fillRect(0, 0, 128, 128)

  context.fillStyle = '#fff'
  context.fillRect(0, 0, 64, 64)
  context.fillRect(64, 64, 64, 64)

  const texture = new THREE.CanvasTexture(imageCanvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.repeat.set(1000, 1000)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  return texture
}

/**
 * 添加画作（含画框和阴影）到场景
 * @param scene - 目标场景
 * @param mesh - 画作 Mesh
 * @param imageWidth - 图片宽度
 * @param imageHeight - 图片高度
 * @param floorMesh - 地面 Mesh，用于设置高度
 */
function addPainting(
  scene: THREE.Scene,
  mesh: THREE.Mesh,
  imageWidth: number,
  imageHeight: number,
  floorMesh: THREE.Mesh
): void {
  mesh.scale.x = imageWidth / 100
  mesh.scale.y = imageHeight / 100
  scene.add(mesh)

  const geometry = new THREE.PlaneGeometry(100, 100)

  // 画框
  const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  materials.push(frameMaterial)
  const meshFrame = new THREE.Mesh(geometry, frameMaterial)
  meshFrame.position.z = -10.0
  meshFrame.scale.x = (1.1 * imageWidth) / 100
  meshFrame.scale.y = (1.1 * imageHeight) / 100
  scene.add(meshFrame)

  // 阴影
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.75,
    transparent: true
  })
  materials.push(shadowMaterial)
  const meshShadow = new THREE.Mesh(geometry, shadowMaterial)
  meshShadow.position.y = (-1.1 * imageHeight) / 2
  meshShadow.position.z = (-1.1 * imageHeight) / 2
  meshShadow.rotation.x = -Math.PI / 2
  meshShadow.scale.x = (1.1 * imageWidth) / 100
  meshShadow.scale.y = (1.1 * imageHeight) / 100
  scene.add(meshShadow)

  // 设置地面高度
  const floorHeight = (-1.117 * imageHeight) / 2
  floorMesh.position.y = floorHeight
}

/**
 * 自定义渲染回调 - 双场景裁剪渲染
 */
const onRender = (params: {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.Camera
  size: { width: number; height: number }
}): void => {
  const { renderer, scene, camera, size } = params

  // 鼠标控制相机位置
  camera.position.x += (mouseX.value - camera.position.x) * 0.05
  camera.position.y += (-(mouseY.value - 200) - camera.position.y) * 0.05
  camera.lookAt(scene.position)

  renderer.clear()
  renderer.setScissorTest(true)

  const halfWidth = size.width / 2

  // 左半屏 - Linear 过滤
  renderer.setScissor(0, 0, halfWidth - 2, size.height)
  renderer.render(scene, camera)

  // 右半屏 - Nearest 过滤
  if (scene2) {
    renderer.setScissor(halfWidth, 0, halfWidth - 2, size.height)
    renderer.render(scene2, camera)
  }

  renderer.setScissorTest(false)
}

/**
 * 鼠标移动回调
 */
const handleMouseMove = (event: MouseEvent): void => {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  mouseX.value = event.clientX - rect.left - rect.width / 2
  mouseY.value = event.clientY - rect.top - rect.height / 2
}

onMounted(() => {
  const renderer = canvasRef.value?.context?.renderer
  const scene = canvasRef.value?.context?.scene
  if (!renderer || !scene) return

  // === 地面（棋盘格纹理） ===
  const textureCanvas = createCheckerTexture()
  textures.push(textureCanvas)

  const textureCanvas2 = textureCanvas.clone()
  textureCanvas2.magFilter = THREE.NearestFilter
  textureCanvas2.minFilter = THREE.NearestFilter
  textureCanvas2.generateMipmaps = false
  textures.push(textureCanvas2)

  const materialCanvas = new THREE.MeshBasicMaterial({ map: textureCanvas })
  const materialCanvas2 = new THREE.MeshBasicMaterial({ color: 0xffccaa, map: textureCanvas2 })
  materials.push(materialCanvas, materialCanvas2)

  const geometry = new THREE.PlaneGeometry(100, 100)

  const meshCanvas = new THREE.Mesh(geometry, materialCanvas)
  meshCanvas.rotation.x = -Math.PI / 2
  meshCanvas.scale.set(1000, 1000, 1000)
  scene.add(meshCanvas)

  const meshCanvas2 = new THREE.Mesh(geometry, materialCanvas2)
  meshCanvas2.rotation.x = -Math.PI / 2
  meshCanvas2.scale.set(1000, 1000, 1000)

  // === 立即创建场景2 并加入地面 ===
  scene2 = new THREE.Scene()
  scene2.background = new THREE.Color(0x000000)
  scene2.fog = new THREE.Fog(0x000000, 1500, 4000)
  scene2.add(meshCanvas2)

  // === 画作纹理 ===
  const textureLoader = new THREE.TextureLoader()

  const texturePainting2 = new THREE.Texture()
  texturePainting2.colorSpace = THREE.SRGBColorSpace
  texturePainting2.minFilter = THREE.NearestFilter
  texturePainting2.magFilter = THREE.NearestFilter
  textures.push(texturePainting2)

  const materialPainting2 = new THREE.MeshBasicMaterial({ color: 0xffccaa, map: texturePainting2 })
  materials.push(materialPainting2)

  // 使用 TextureLoader 的回调参数，在纹理加载完成后添加画作
  const texturePainting = textureLoader.load(
    '/textures/758px-Canestra_di_frutta_(Caravaggio).jpg',
    loadedTexture => {
      const image = loadedTexture.image as HTMLImageElement

      // 将加载的图片设置到 texturePainting2
      texturePainting2.image = image
      texturePainting2.needsUpdate = true

      const paintingGeometry = new THREE.PlaneGeometry(100, 100)
      const materialPainting = new THREE.MeshBasicMaterial({ color: 0xffffff, map: loadedTexture })
      materials.push(materialPainting)

      const meshPainting = new THREE.Mesh(paintingGeometry, materialPainting)
      const meshPainting2 = new THREE.Mesh(paintingGeometry, materialPainting2)

      addPainting(scene, meshPainting, image.width, image.height, meshCanvas)
      addPainting(scene2!, meshPainting2, image.width, image.height, meshCanvas2)
    }
  )
  texturePainting.colorSpace = THREE.SRGBColorSpace
  texturePainting.minFilter = THREE.LinearFilter
  texturePainting.magFilter = THREE.LinearFilter
  texturePainting.mapping = THREE.UVMapping
  textures.push(texturePainting)
})

onUnmounted(() => {
  // 清理纹理
  textures.forEach(t => t.dispose())
  textures.length = 0

  // 清理材质
  materials.forEach(m => m.dispose())
  materials.length = 0

  // 清理场景2
  if (scene2) {
    scene2.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
      }
    })
    scene2 = null
  }
})
</script>

<style scoped>
.texture-filters-example {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.labels {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.label {
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 1em;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: #000 1px 1px 1px;
}

.label-left {
  left: 0;
  text-align: left;
}

.label-right {
  right: 0;
  text-align: left;
}

.g {
  color: #aaa;
}

.c {
  color: #fa0;
}
</style>
