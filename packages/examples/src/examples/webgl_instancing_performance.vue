<template>
  <TCanvas ref="canvasRef" antialias animation-loop @animate="animate">
    <TPerspectiveCamera ref="cameraRef" :fov="70" :near="1" :far="100" :position="[0, 0, 30]" />

    <TScene ref="sceneRef" :background="0xffffff">
      <TOrbitControls :auto-rotate="true" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { TCanvas, TScene, TPerspectiveCamera, TOrbitControls } from '@vue-three/vue-three'

// 渲染方法枚举
enum Method {
  INSTANCED = 'INSTANCED',
  MERGED = 'MERGED',
  NAIVE = 'NAIVE'
}

// 引用
const canvasRef = ref<any>(null)
const cameraRef = ref<any>(null)
const sceneRef = ref<any>(null)

// GUI 配置
const api = ref({
  method: Method.INSTANCED,
  count: 1000
})

// 变量
let material: THREE.MeshNormalMaterial | null = null
let gui: GUI | null = null
let guiStatsEl: HTMLElement | null = null
let geometry: THREE.BufferGeometry | null = null

onMounted(async () => {
  await nextTick()
  initGUI()
  await loadGeometry()
  initMesh()
})

onBeforeUnmount(() => {
  // 清理资源
  if (gui) {
    gui.destroy()
  }
  if (material) {
    material.dispose()
  }
  if (geometry) {
    geometry.dispose()
  }
  clean()
})

/**
 * 初始化 GUI
 */
function initGUI() {
  gui = new GUI()
  gui.add(api.value, 'method', Method).onChange(() => {
    initMesh()
  })
  gui
    .add(api.value, 'count', 1, 10000)
    .step(1)
    .onChange(() => {
      initMesh()
    })

  const perfFolder = gui.addFolder('Performance')

  guiStatsEl = document.createElement('div')
  guiStatsEl.classList.add('gui-stats')
  guiStatsEl.style.cssText = `
    line-height: var(--widget-height);
    padding: var(--padding);
  `

  perfFolder.domElement.appendChild(guiStatsEl)
  perfFolder.open()
}

/**
 * 加载几何体
 */
async function loadGeometry(): Promise<void> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.BufferGeometryLoader()
    loader.setPath('/lib/models/json/')
    loader.load(
      'suzanne_buffergeometry.json',
      (loadedGeometry: THREE.BufferGeometry) => {
        geometry = loadedGeometry
        geometry.computeVertexNormals()
        resolve()
      },
      undefined,
      (error: unknown) => {
        console.error('Error loading geometry:', error)
        reject(error)
      }
    )
  })
}

/**
 * 清理场景中的网格
 */
function clean() {
  if (!sceneRef.value?.scene) return

  const meshes: THREE.Mesh[] = []

  sceneRef.value.scene.traverse((object: THREE.Object3D) => {
    if ((object as THREE.Mesh).isMesh) {
      meshes.push(object as THREE.Mesh)
    }
  })

  for (let i = 0; i < meshes.length; i++) {
    const mesh = meshes[i]
    mesh.material.dispose()
    mesh.geometry.dispose()
    sceneRef.value.scene.remove(mesh)
  }
}

/**
 * 随机化矩阵
 */
function randomizeMatrix(matrix: THREE.Matrix4): void {
  const position = new THREE.Vector3()
  const quaternion = new THREE.Quaternion()
  const scale = new THREE.Vector3()

  position.x = Math.random() * 40 - 20
  position.y = Math.random() * 40 - 20
  position.z = Math.random() * 40 - 20

  quaternion.random()

  scale.x = scale.y = scale.z = Math.random() * 1

  matrix.compose(position, quaternion, scale)
}

/**
 * 初始化网格
 */
function initMesh() {
  if (!geometry) return

  clean()

  material = new THREE.MeshNormalMaterial()

  console.time(`${api.value.method} (build)`)

  switch (api.value.method) {
    case Method.INSTANCED:
      makeInstanced()
      break
    case Method.MERGED:
      makeMerged()
      break
    case Method.NAIVE:
      makeNaive()
      break
  }

  console.timeEnd(`${api.value.method} (build)`)
}

/**
 * 实例化方法
 */
function makeInstanced() {
  if (!geometry || !material || !sceneRef.value?.scene) return

  const matrix = new THREE.Matrix4()
  const mesh = new THREE.InstancedMesh(geometry, material, api.value.count)

  for (let i = 0; i < api.value.count; i++) {
    randomizeMatrix(matrix)
    mesh.setMatrixAt(i, matrix)
  }

  sceneRef.value.scene.add(mesh)

  // 显示性能信息
  const geometryByteLength = getGeometryByteLength(geometry)
  if (guiStatsEl) {
    guiStatsEl.innerHTML = [
      '<i>GPU draw calls</i>: 1',
      `<i>GPU memory</i>: ${formatBytes(api.value.count * 16 + geometryByteLength, 2)}`
    ].join('<br/>')
  }
}

/**
 * 合并几何体方法
 */
function makeMerged() {
  if (!geometry || !material || !sceneRef.value?.scene) return

  const geometries: THREE.BufferGeometry[] = []
  const matrix = new THREE.Matrix4()

  for (let i = 0; i < api.value.count; i++) {
    randomizeMatrix(matrix)

    const instanceGeometry = geometry.clone()
    instanceGeometry.applyMatrix4(matrix)

    geometries.push(instanceGeometry)
  }

  const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries)

  sceneRef.value.scene.add(new THREE.Mesh(mergedGeometry, material))

  // 显示性能信息
  if (guiStatsEl) {
    guiStatsEl.innerHTML = [
      '<i>GPU draw calls</i>: 1',
      `<i>GPU memory</i>: ${formatBytes(getGeometryByteLength(mergedGeometry), 2)}`
    ].join('<br/>')
  }
}

/**
 * 朴素方法（创建多个独立网格）
 */
function makeNaive() {
  if (!geometry || !material || !sceneRef.value?.scene) return

  const matrix = new THREE.Matrix4()

  for (let i = 0; i < api.value.count; i++) {
    randomizeMatrix(matrix)

    const mesh = new THREE.Mesh(geometry, material)
    mesh.applyMatrix4(matrix)

    sceneRef.value.scene.add(mesh)
  }

  // 显示性能信息
  const geometryByteLength = getGeometryByteLength(geometry)
  if (guiStatsEl) {
    guiStatsEl.innerHTML = [
      `<i>GPU draw calls</i>: ${api.value.count}`,
      `<i>GPU memory</i>: ${formatBytes(api.value.count * 16 + geometryByteLength, 2)}`
    ].join('<br/>')
  }
}

/**
 * 获取几何体内存占用
 */
function getGeometryByteLength(geometry: THREE.BufferGeometry): number {
  let total = 0

  if (geometry.index) {
    total += geometry.index.array.byteLength
  }

  for (const name in geometry.attributes) {
    total += geometry.attributes[name].array.byteLength
  }

  return total
}

/**
 * 格式化字节数
 */
function formatBytes(bytes: number, decimals: number): string {
  if (bytes === 0) return '0 bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['bytes', 'KB', 'MB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 动画循环
 */
function animate() {
  // OrbitControls 会自动更新
}
</script>

<style scoped></style>
