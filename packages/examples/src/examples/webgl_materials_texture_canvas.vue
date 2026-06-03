<template>
  <div class="canvas-texture-example">
    <canvas
      ref="drawingCanvas"
      class="drawing-canvas"
      width="128"
      height="128"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointerleave="handlePointerLeave"
    ></canvas>
    <TCanvas antialias background="#1a1a2e">
      <TScene>
        <TPerspectiveCamera :position="[0, 0, 500]" :fov="50" />
        <TOrbitControls />

        <TMesh :rotation="rotation">
          <TBox :args="[200, 200, 200]" />
          <TMeshBasicMaterial :map="canvasTexture" />
        </TMesh>
      </TScene>
    </TCanvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TBox,
  TMeshBasicMaterial
} from '@vue-three/vue-three'
import * as THREE from 'three'

const drawingCanvas = ref<HTMLCanvasElement | null>(null)
const canvasTexture = ref<THREE.CanvasTexture | null>(null)
const rotation = ref([0, 0, 0])

const drawStartPos = new THREE.Vector2()
let paint = false

const draw = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.moveTo(drawStartPos.x, drawStartPos.y)
  ctx.strokeStyle = '#000000'
  ctx.lineTo(x, y)
  ctx.stroke()
  drawStartPos.set(x, y)
  if (canvasTexture.value) {
    canvasTexture.value.needsUpdate = true
  }
}

const handlePointerDown = (e: PointerEvent) => {
  paint = true
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  drawStartPos.set(e.clientX - rect.left, e.clientY - rect.top)
}

const handlePointerMove = (e: PointerEvent) => {
  if (paint && drawingCanvas.value) {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const ctx = drawingCanvas.value.getContext('2d')
    if (ctx) {
      draw(ctx, e.clientX - rect.left, e.clientY - rect.top)
    }
  }
}

const handlePointerUp = () => {
  paint = false
}

const handlePointerLeave = () => {
  paint = false
}

onMounted(() => {
  if (drawingCanvas.value) {
    const ctx = drawingCanvas.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, 128, 128)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2

      canvasTexture.value = new THREE.CanvasTexture(drawingCanvas.value)
    }
  }

  const animate = () => {
    rotation.value[0] += 0.01
    rotation.value[1] += 0.01
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<style scoped>
.canvas-texture-example {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.drawing-canvas {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 128px;
  height: 128px;
  background-color: #ffffff;
  cursor: crosshair;
  z-index: 100;
  border: 2px solid #fff;
  border-radius: 4px;
}
</style>
