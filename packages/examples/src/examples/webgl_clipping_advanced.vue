<template>
  <TCanvas ref="canvasRef" antialias :localClippingEnabled="localClippingEnabled" :clippingPlanes="globalClippingPlanes"
    :shadowMap="{ enabled: true }" @animate="onAnimate">
    <TScene>
      <TPerspectiveCamera :position="[0, 1.5, 3]" :fov="36" :near="0.25" :far="16" />

      <TAmbientLight :intensity="1" />

      <TSpotLight :position="[2, 3, 3]" :intensity="60" :angle="Math.PI / 5" :penumbra="0.2" :castShadow="true"
        :shadow-mapSize="[1024, 1024]" :shadow-camera-near="3" :shadow-camera-far="10" />

      <TDirectionalLight :position="[0, 2, 0]" :intensity="1.5" :castShadow="true" :shadow-camera-near="1"
        :shadow-camera-far="10" :shadow-camera-right="1" :shadow-camera-left="-1" :shadow-camera-top="1"
        :shadow-camera-bottom="-1" :shadow-mapSize="[1024, 1024]" />

      <TGroup :visible="volumeVisualizationVisible">
        <TMesh v-for="(planeMesh, index) in volumePlaneMeshes" :key="index" :matrix="planeMesh.matrix"
          :matrixAutoUpdate="false">
          <TPlane :args="[3, 3, 1, 1]" />
          <TMeshBasicMaterial :color="planeMesh.color" :side="THREE.DoubleSide" :opacity="0.2" :transparent="true"
            :clippingPlanes="planeMesh.clippingPlanes" />
        </TMesh>
      </TGroup>

      <TMesh :rotation="[-Math.PI / 2, 0, 0]" :scale="[3, 3, 3]" :receiveShadow="true">
        <TPlane :args="[3, 3, 1, 1]" />
        <TMeshPhongMaterial :color="0xa0adaf" :shininess="10" />
      </TMesh>
    </TScene>

    <TOrbitControls :minDistance="1" :maxDistance="8" :target="[0, 1, 0]" />
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, inject } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TAmbientLight,
  TSpotLight,
  TDirectionalLight,
  TMesh,
  TPlane,
  TMeshPhongMaterial,
  TMeshBasicMaterial,
  TOrbitControls
} from '@vue-three/vue-three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const canvasRef = ref()
const startTime = ref(Date.now())

const localClippingEnabled = ref(true)
const clipShadows = ref(true)
const volumeVisualizationVisible = ref(false)
const globalClippingEnabled = ref(false)

const Empty = Object.freeze([])

// 正四面体顶点
const Vertices = [
  new THREE.Vector3(1, 0, Math.SQRT1_2),
  new THREE.Vector3(-1, 0, Math.SQRT1_2),
  new THREE.Vector3(0, 1, -Math.SQRT1_2),
  new THREE.Vector3(0, -1, -Math.SQRT1_2)
]

// 正四面体索引
const Indices = [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2]

// 从网格创建裁剪平面
function planesFromMesh(vertices: THREE.Vector3[], indices: number[]): THREE.Plane[] {
  const n = indices.length / 3
  const result = new Array(n)

  for (let i = 0, j = 0; i < n; ++i, j += 3) {
    const a = vertices[indices[j]]
    const b = vertices[indices[j + 1]]
    const c = vertices[indices[j + 2]]

    result[i] = new THREE.Plane().setFromCoplanarPoints(a, b, c)
  }

  return result
}

// 创建空平面数组
function createPlanes(n: number): THREE.Plane[] {
  const result = new Array(n)
  for (let i = 0; i !== n; ++i) {
    result[i] = new THREE.Plane()
  }
  return result
}

// 变换平面
function assignTransformedPlanes(planesOut: THREE.Plane[], planesIn: THREE.Plane[], matrix: THREE.Matrix4): void {
  for (let i = 0, n = planesIn.length; i !== n; ++i) {
    planesOut[i].copy(planesIn[i]).applyMatrix4(matrix)
  }
}

// 创建圆柱形裁剪平面
function cylindricalPlanes(n: number, innerRadius: number): THREE.Plane[] {
  const result = createPlanes(n)

  for (let i = 0; i !== n; ++i) {
    const plane = result[i]
    const angle = i * Math.PI * 2 / n

    plane.normal.set(Math.cos(angle), 0, Math.sin(angle))
    plane.constant = innerRadius
  }

  return result
}

// 平面转矩阵
const planeToMatrix = (() => {
  const xAxis = new THREE.Vector3()
  const yAxis = new THREE.Vector3()
  const trans = new THREE.Vector3()

  return function (plane: THREE.Plane): THREE.Matrix4 {
    const zAxis = plane.normal
    const matrix = new THREE.Matrix4()

    if (Math.abs(zAxis.x) > Math.abs(zAxis.z)) {
      yAxis.set(-zAxis.y, zAxis.x, 0)
    } else {
      yAxis.set(0, -zAxis.z, zAxis.y)
    }

    xAxis.crossVectors(yAxis.normalize(), zAxis)
    plane.coplanarPoint(trans)

    return matrix.set(
      xAxis.x, yAxis.x, zAxis.x, trans.x,
      xAxis.y, yAxis.y, zAxis.y, trans.y,
      xAxis.z, yAxis.z, zAxis.z, trans.z,
      0, 0, 0, 1
    )
  }
})()

// 初始化平面
const Planes = planesFromMesh(Vertices, Indices)
const PlaneMatrices = Planes.map(planeToMatrix)
const GlobalClippingPlanes = cylindricalPlanes(5, 2.5)

// 材质裁剪平面
const clipMaterialClippingPlanes = ref<THREE.Plane[]>(createPlanes(Planes.length))

// 全局裁剪平面
const globalClippingPlanes = ref<THREE.Plane[]>(Empty)

// 体积可视化平面网格数据
const volumePlaneMeshes = ref<{ matrix: THREE.Matrix4; color: number; clippingPlanes: THREE.Plane[] }[]>([])

// Three.js 对象引用
let instancedMesh: THREE.InstancedMesh | null = null
let clipMaterial: THREE.MeshPhongMaterial | null = null

// 初始化体积可视化
function initVolumeVisualization() {
  const color = new THREE.Color()
  const meshes: { matrix: THREE.Matrix4; color: number; clippingPlanes: THREE.Plane[] }[] = []

  for (let i = 0, n = Planes.length; i !== n; ++i) {
    const clipPlanes = clipMaterialClippingPlanes.value.filter((_, j) => j !== i)

    meshes.push({
      matrix: new THREE.Matrix4(),
      color: color.setHSL(i / n, 0.5, 0.5).getHex(),
      clippingPlanes: clipPlanes
    })
  }

  volumePlaneMeshes.value = meshes
}

// 更新体积可视化矩阵
function updateVolumeVisualization(transform: THREE.Matrix4) {
  const tmpMatrix = new THREE.Matrix4()

  for (let i = 0, n = volumePlaneMeshes.value.length; i !== n; ++i) {
    tmpMatrix.multiplyMatrices(transform, PlaneMatrices[i])
    volumePlaneMeshes.value[i].matrix.copy(tmpMatrix)
  }
}

// 更新裁剪平面
function updateClippingPlanes(time: number) {
  const transform = new THREE.Matrix4()
  const tmpMatrix = new THREE.Matrix4()

  // 对象变换
  transform.makeTranslation(0, 1, 0)
  transform.multiply(tmpMatrix.makeRotationX(time * 0.5))
  transform.multiply(tmpMatrix.makeRotationY(time * 0.2))

  const bouncy = Math.cos(time * 0.5) * 0.5 + 0.7
  transform.multiply(tmpMatrix.makeScale(bouncy, bouncy, bouncy))

  // 更新材质裁剪平面
  assignTransformedPlanes(clipMaterialClippingPlanes.value, Planes, transform)

  // 更新实例化网格变换
  if (instancedMesh) {
    instancedMesh.position.y = 1
    instancedMesh.rotation.x = time * 0.5
    instancedMesh.rotation.y = time * 0.2
    instancedMesh.updateMatrix()
  }

  // 更新体积可视化
  updateVolumeVisualization(transform)

  // 更新全局裁剪平面
  if (globalClippingEnabled.value) {
    const globalTransform = new THREE.Matrix4().makeRotationY(time * 0.1)
    assignTransformedPlanes(globalClippingPlanes.value, GlobalClippingPlanes, globalTransform)
  }
}

// 动画回调
function onAnimate() {
  const currentTime = Date.now()
  const time = (currentTime - startTime.value) / 1000
  updateClippingPlanes(time)
}

let gui: GUI | null = null


onMounted(async () => {
  initVolumeVisualization()

  const ctx = await canvasRef.value.context.ready()

  const scene = ctx.scene

  // 创建裁剪材质
  clipMaterial = new THREE.MeshPhongMaterial({
    color: 0xee0a10,
    shininess: 100,
    side: THREE.DoubleSide,
    clippingPlanes: clipMaterialClippingPlanes.value,
    clipShadows: clipShadows.value
  })

  // 创建实例化网格
  const count = 5 * 5 * 5
  const geometry = new THREE.BoxGeometry(0.18, 0.18, 0.18)
  instancedMesh = new THREE.InstancedMesh(geometry, clipMaterial, count)
  instancedMesh.castShadow = true

  const matrix = new THREE.Matrix4()
  let i = 0

  for (let z = -2; z <= 2; ++z) {
    for (let y = -2; y <= 2; ++y) {
      for (let x = -2; x <= 2; ++x) {
        matrix.setPosition(x / 5, y / 5, z / 5)
        instancedMesh.setMatrixAt(i++, matrix)
      }
    }
  }

  instancedMesh.instanceMatrix.needsUpdate = true
  scene.add(instancedMesh)

  // GUI 控制
  gui = new GUI()

  const folderLocal = gui.addFolder('Local Clipping')

  const props = {
    get Enabled() {
      return localClippingEnabled.value
    },
    set Enabled(v: boolean) {
      localClippingEnabled.value = v
      if (!v) volumeVisualizationVisible.value = false
    },
    get Shadows() {
      return clipShadows.value
    },
    set Shadows(v: boolean) {
      clipShadows.value = v
      if (clipMaterial) {
        clipMaterial.clipShadows = v
      }
    },
    get Visualize() {
      return volumeVisualizationVisible.value
    },
    set Visualize(v: boolean) {
      if (localClippingEnabled.value) {
        volumeVisualizationVisible.value = v
      }
    }
  }

  folderLocal.add(props, 'Enabled')
  folderLocal.add(props, 'Shadows')
  folderLocal.add(props, 'Visualize').listen()

  const folderGlobal = gui.addFolder('Global Clipping')

  folderGlobal.add({
    get Enabled() {
      return globalClippingEnabled.value
    },
    set Enabled(v: boolean) {
      globalClippingEnabled.value = v
      if (v) {
        if (globalClippingPlanes.value === Empty) {
          globalClippingPlanes.value = createPlanes(GlobalClippingPlanes.length)
        }
      } else {
        globalClippingPlanes.value = Empty
      }
    }
  }, 'Enabled')
})

onUnmounted(() => {
  if (gui !== null) {
    gui.destroy()
  }
  // 清理资源
  if (instancedMesh) {
    instancedMesh.geometry.dispose()
    if (clipMaterial) {
      clipMaterial.dispose()
    }
  }
})

// 监听本地裁剪启用状态变化
watch(localClippingEnabled, (enabled) => {
  if (!enabled) {
    volumeVisualizationVisible.value = false
  }
})
</script>

<style scoped></style>