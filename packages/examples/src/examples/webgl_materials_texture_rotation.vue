<template>
  <TCanvas ref="canvasRef" antialias>
    <TScene>
      <TPerspectiveCamera :fov="40" :near="1" :far="1000" :position="[10, 15, 25]" />
      <TOrbitControls :min-distance="20" :max-distance="50" :max-polar-angle="Math.PI / 2" />

      <TMesh>
        <TBox :args="[10, 10, 10]" />
        <TMeshBasicMaterial>
          <TTexture
            url="/textures/uv_grid_opengl.jpg"
            map-type="map"
            :wrap-s="RepeatWrapping"
            :wrap-t="RepeatWrapping"
            :repeat="[params.repeatX, params.repeatY]"
            :offset="[params.offsetX, params.offsetY]"
            :center="[params.centerX, params.centerY]"
            :rotation="params.rotation"
            color-space="srgb"
          />
        </TMeshBasicMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  useGui,
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TBox,
  TMeshBasicMaterial,
  TTexture
} from '@vue-three/vue-three'

const RepeatWrapping = THREE.RepeatWrapping

const canvasRef = ref<InstanceType<typeof TCanvas> | null>(null)

/** UV 变换参数，与 GUI 控制面板绑定 */
const params = reactive({
  offsetX: 0,
  offsetY: 0,
  repeatX: 0.25,
  repeatY: 0.25,
  rotation: Math.PI / 4, // 正值为逆时针旋转
  centerX: 0.5,
  centerY: 0.5
})

const { gui } = useGui()

onMounted(() => {
  // 设置各向异性过滤
  const renderer = canvasRef.value?.context?.renderer
  const scene = canvasRef.value?.context?.scene
  if (renderer && scene) {
    scene.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        const texture = child.material.map
        if (texture) {
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
          texture.needsUpdate = true
        }
      }
    })
  }

  // GUI 控制面板 - 纹理 UV 变换参数
  gui.add(params, 'offsetX', 0.0, 1.0).name('offset.x')
  gui.add(params, 'offsetY', 0.0, 1.0).name('offset.y')
  gui.add(params, 'repeatX', 0.25, 2.0).name('repeat.x')
  gui.add(params, 'repeatY', 0.25, 2.0).name('repeat.y')
  gui.add(params, 'rotation', -2.0, 2.0).name('rotation')
  gui.add(params, 'centerX', 0.0, 1.0).name('center.x')
  gui.add(params, 'centerY', 0.0, 1.0).name('center.y')
})

onUnmounted(() => {
  gui.destroy()
})
</script>
