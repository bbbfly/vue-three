<template>
  <TCanvas antialias animation-loop @animate="onAnimate">
    <TPerspectiveCamera :fov="70" :near="0.01" :far="10" :position="[0, 0, 5]" />

    <TScene>
      <!-- 箭头网格（朝向目标） -->
      <TMesh ref="meshRef">
        <TCone :args="[0.1, 0.5, 8]" />
        <TMeshNormalMaterial />
      </TMesh>

      <!-- 目标点（红色小球） -->
      <TMesh ref="targetRef" :position="targetPosition">
        <TSphere :args="[0.05]" />
        <TMeshBasicMaterial color="#ff0000" />
      </TMesh>

      <!-- 球体线框（参考球面） -->
      <TMesh :position="[0, 0, 0]">
        <TSphere :args="[2, 32, 32]" />
        <TMeshBasicMaterial color="#cccccc" :wireframe="true" :transparent="true" :opacity="0.3" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TPerspectiveCamera,
  TScene,
  TMesh,
  TCone,
  TSphere,
  TMeshNormalMaterial,
  TMeshBasicMaterial
} from '@vue-three/vue-three'

// 组件引用
const meshRef = ref<any>(null)
const targetRef = ref<any>(null)

// 响应式状态
const targetPosition = ref<[number, number, number]>([0, 0, 0])

// Three.js 对象
let mesh: THREE.Mesh | null = null
let target: THREE.Mesh | null = null

// 数学工具
const spherical = new THREE.Spherical()
const rotationMatrix = new THREE.Matrix4()
const targetQuaternion = new THREE.Quaternion()
const clock = new THREE.Clock()

// 配置参数
const speed = Math.PI / 2 // 旋转速度（弧度/秒）
const useLookAt = false // 是否使用 lookAt（instant vs gradual）

// 监听场景引用
watch(
  () => meshRef.value,
  async () => {
    if (meshRef.value?.mesh) {
      mesh = meshRef.value.mesh
    }
  },
  { immediate: true }
)

watch(
  () => targetRef.value,
  async () => {
    if (targetRef.value?.mesh) {
      target = targetRef.value.mesh
      console.log(target)
    }
  },
  { immediate: true }
)

onMounted(() => {
  // 启动时钟
  clock.start()

  // 生成初始目标点
  generateTarget()
})

/**
 * TCanvas animate 事件回调
 */
function onAnimate() {
  if (!mesh || !target) return

  // 获取时间增量
  const delta = clock.getDelta()

  // 检查是否需要旋转
  if (!mesh.quaternion.equals(targetQuaternion)) {
    if (useLookAt) {
      // 使用 lookAt() 立即朝向目标
      mesh.lookAt(target.position)
    } else {
      // 使用 rotateTowards() 逐步旋转到目标朝向
      // speed 变量表示每秒旋转的弧度
      const step = speed * delta
      mesh.quaternion.rotateTowards(targetQuaternion, step)
    }
  }
}

/**
 * 生成随机目标点（在球面上）
 */
function generateTarget() {

  if (target && mesh) {
    // 在球面上生成随机点
    spherical.theta = Math.random() * Math.PI * 2
    spherical.phi = Math.acos(2 * Math.random() - 1)
    spherical.radius = 2

    target.position.setFromSpherical(spherical)

    // 更新响应式位置
    targetPosition.value = [
      target.position.x,
      target.position.y,
      target.position.z
    ]

    // 计算目标旋转
    rotationMatrix.lookAt(target.position, mesh.position, mesh.up)
    targetQuaternion.setFromRotationMatrix(rotationMatrix)

  }


  // 2秒后重新生成目标
  setTimeout(generateTarget, 2000)

}
</script>

<style scoped></style>
