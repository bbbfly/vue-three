<template>
  <MainLayout>
    <template #sidebar>
      <ComponentTree />
    </template>
    <template #viewport>
      <TCanvas antialias alpha :shadow-map="true">
        <TScene background="#1a1a2e">
          <TPerspectiveCamera :position="[8, 8, 8]" :fov="60" />
          <TOrbitControls :enable-damping="true" :enable-pan="true" :enable-zoom="true" />
          <TAmbientLight :intensity="0.5" />
          <TDirectionalLight
            :position="[10, 10, 10]"
            :intensity="1"
            :cast-shadow="true"
          />

          <!-- 外层组 - 红色组 -->
          <TGroup
            ref="outerGroupRef"
            :position="[0, 0, 0]"
            :scale="outerScale"
          >
            <!-- 外层组内的立方体 -->
            <TMesh
              ref="outerCubeRef"
              :position="[0, 1, 0]"
              :cast-shadow="true"
              :receive-shadow="true"
            >
              <TBox :args="[2, 2, 2]" />
              <TMeshStandardMaterial color="#ff4444" :metalness="0.3" :roughness="0.7" />
            </TMesh>

            <!-- 中层组 - 绿色组，嵌套在外层组内 -->
            <TGroup
              ref="middleGroupRef"
              :position="[3, 0, 0]"
              :rotation="middleRotation"
            >
              <!-- 中层组内的球体 -->
              <TMesh
                ref="middleSphereRef"
                :position="[0, 1, 0]"
                :cast-shadow="true"
                :receive-shadow="true"
              >
                <TSphere :args="[1]" />
                <TMeshStandardMaterial color="#44ff44" :metalness="0.3" :roughness="0.7" />
              </TMesh>

              <!-- 内层组 - 蓝色组，嵌套在中层组内 -->
              <TGroup
                ref="innerGroupRef"
                :position="[2, 0, 0]"
                :scale="innerScale"
              >
                <!-- 内层组内的圆锥 -->
                <TMesh
                  ref="innerConeRef"
                  :position="[0, 1, 0]"
                  :cast-shadow="true"
                  :receive-shadow="true"
                >
                  <TCone :args="[0.6, 1.5]" />
                  <TMeshStandardMaterial color="#4444ff" :metalness="0.3" :roughness="0.7" />
                </TMesh>
              </TGroup>
            </TGroup>
          </TGroup>

          <!-- 独立物体 - 直接添加到 scene（向后兼容） -->
          <TMesh
            ref="standaloneCylinderRef"
            :position="[-4, 0.75, 0]"
            :cast-shadow="true"
            :receive-shadow="true"
          >
            <TCylinder :args="[0.5, 1.5, 0.5]" />
            <TMeshStandardMaterial color="#ffff44" :metalness="0.3" :roughness="0.7" />
          </TMesh>

          <!-- 地面 -->
          <TMesh
            ref="groundMeshRef"
            :position="[0, -2, 0]"
            :rotation="[-Math.PI / 2, 0, 0]"
            :receive-shadow="true"
          >
            <TPlane :args="[20, 20]" />
            <TMeshStandardMaterial color="#333" />
          </TMesh>
        </TScene>
      </TCanvas>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ComponentTree from '../components/ComponentTree.vue'
import { useSceneStore } from '../stores/scene'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TBox,
  TSphere,
  TCone,
  TCylinder,
  TPlane,
  TMeshStandardMaterial,
  TGroup
} from '@vue-three/vue-three'

const sceneStore = useSceneStore()

// 响应式状态用于动态控制
const outerScale = ref([1, 1, 1])
const middleRotation = ref([0, 0, 0])
const innerScale = ref([1, 1, 1])

// Refs
const outerGroupRef = shallowRef<any>(null)
const middleGroupRef = shallowRef<any>(null)
const innerGroupRef = shallowRef<any>(null)
const outerCubeRef = shallowRef<any>(null)
const middleSphereRef = shallowRef<any>(null)
const innerConeRef = shallowRef<any>(null)
const standaloneCylinderRef = shallowRef<any>(null)
const groundMeshRef = shallowRef<any>(null)

let animationId: number | null = null

function animate() {
  // 中层组旋转
  middleRotation.value[1] += 0.01
  // 内层组呼吸效果
  const breathing = Math.sin(Date.now() * 0.003) * 0.2 + 1
  innerScale.value = [breathing, breathing, breathing]
  // 外层组轻微缩放
  const pulse = Math.sin(Date.now() * 0.002) * 0.05 + 1
  outerScale.value = [pulse, pulse, pulse]
  
  animationId = requestAnimationFrame(animate)
}

function registerSceneObjects() {
  const objects = [
    { ref: outerGroupRef, name: '外层组 (红色)', type: 'Group' },
    { ref: middleGroupRef, name: '中层组 (绿色)', type: 'Group' },
    { ref: innerGroupRef, name: '内层组 (蓝色)', type: 'Group' },
    { ref: outerCubeRef, name: '红色立方体', type: 'Mesh' },
    { ref: middleSphereRef, name: '绿色球体', type: 'Mesh' },
    { ref: innerConeRef, name: '蓝色圆锥', type: 'Mesh' },
    { ref: standaloneCylinderRef, name: '独立圆柱体', type: 'Mesh' },
    { ref: groundMeshRef, name: '地面', type: 'Mesh' }
  ]

  objects.forEach(({ ref: objRef, name, type }, index) => {
    if (objRef.value?.group || objRef.value?.mesh) {
      const object = objRef.value.group || objRef.value.mesh
      const material = objRef.value?.mesh?.material
      sceneStore.registerSceneObject({
        id: `group-${index}`,
        name,
        type,
        object,
        material: Array.isArray(material) ? material[0] : material
      })
    }
  })
}

onMounted(() => {
  setTimeout(registerSceneObjects, 100)
  animate()
})

onUnmounted(() => {
  sceneStore.clearAll()
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
})
</script>
