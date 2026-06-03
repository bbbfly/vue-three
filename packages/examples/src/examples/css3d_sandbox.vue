<template>
  <TCanvas antialias :clear-color="'#f0f0f0'">
    <TScene>
      <TPerspectiveCamera
        ref="cameraRef"
        :fov="45"
        :near="1"
        :far="1000"
        :position="[200, 200, 200]"
      />
      <TTrackballControls ref="controlsRef" />

      <TMesh
        v-for="(item, index) in meshItems"
        :key="'mesh-' + index"
        :position="item.position"
        :rotation="item.rotation"
        :scale="item.scale"
      >
        <TPlane :args="[100, 100]" />
        <TMeshBasicMaterial :color="0x000000" :wireframe="true" :side="THREE.DoubleSide" />
      </TMesh>
    </TScene>
    <TCSS3DRenderer ref="cssRendererRef" class="css3d-renderer">
      <TCSS3DObject
        v-for="(item, index) in cssItems"
        :key="'css-' + index"
        :position="item.position"
        :rotation="item.rotation"
        :scale="item.scale"
        :style="{
          width: '100px',
          height: '100px',
          opacity: item.opacity,
          backgroundColor: item.color
        }"
      />
    </TCSS3DRenderer>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TTrackballControls,
  TMesh,
  TPlane,
  TMeshBasicMaterial,
  TCSS3DRenderer,
  TCSS3DObject
} from '@vue-three/vue-three'

interface Item {
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  color?: string
  opacity?: number
}

const cameraRef = ref<any>(null)
const cssRendererRef = ref<any>(null)

const items = computed((): Item[] => {
  const result: Item[] = []
  for (let i = 0; i < 10; i++) {
    result.push({
      position: new THREE.Vector3(
        Math.random() * 200 - 100,
        Math.random() * 200 - 100,
        Math.random() * 200 - 100
      ),
      rotation: new THREE.Euler(Math.random(), Math.random(), Math.random()),
      scale: new THREE.Vector3(Math.random() + 0.5, Math.random() + 0.5, 1),
      color: new THREE.Color(Math.random() * 0xffffff).getStyle(),
      opacity: i < 5 ? 0.5 : 1
    })
  }
  return result
})

const meshItems = computed(() => items.value)
const cssItems = computed(() => items.value)

const handleResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  if (cameraRef.value?.camera) {
    cameraRef.value.camera.aspect = width / height
    cameraRef.value.camera.updateProjectionMatrix()
  }

  if (cssRendererRef.value?.renderer) {
    cssRendererRef.value.renderer.setSize(width, height)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.css-box {
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.2);
}
</style>
