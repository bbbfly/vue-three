<template>
  <TCanvas antialias :clear-color="'#fff'">
    <TScene>
      <TPerspectiveCamera :fov="75" :near="1" :far="5000" :position="[600, 400, 1500]" ref="cameraRef" />
      <TTrackballControls ref="controlsRef" />
      <TCSS3DRenderer ref="cssRendererRef" class="css3d-renderer">
        <TCSS3DSprite v-for="(object, index) in objects" :key="index" :position="object.position" :scale="object.scale">
          <img :src="spriteSrc" draggable="false" style="width: 64px; height: 64px; user-select: none;" />
        </TCSS3DSprite>
      </TCSS3DRenderer>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, ComputedRef } from 'vue'
import * as TWEEN from 'three/addons/libs/tween.module.js'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TTrackballControls,
  TCSS3DRenderer,
  TCSS3DSprite
} from '@vue-three/vue-three'

const controlsRef = ref<any>(null)


const particlesTotal = 512
const spriteSrc = '/lib/textures/sprite.png'

interface SpriteObject {
  position: ComputedRef<[number, number, number]>
  scale: [number, number, number],
  animatePosition: {
    x: number,
    y: number,
    z: number
  }
}

const objects = ref<SpriteObject[]>([])
const positions = ref<number[]>([])
let currentLayout = ref(0)
let animationId: number

const initPositions = () => {
  positions.value = []

  const amountX = 16
  const amountZ = 32
  const separationPlane = 150
  const offsetX = ((amountX - 1) * separationPlane) / 2
  const offsetZ = ((amountZ - 1) * separationPlane) / 2

  for (let i = 0; i < particlesTotal; i++) {
    const x = (i % amountX) * separationPlane
    const z = Math.floor(i / amountX) * separationPlane
    const y = (Math.sin(x * 0.5) + Math.sin(z * 0.5)) * 200
    positions.value.push(x - offsetX, y, z - offsetZ)
  }

  const amount = 8
  const separationCube = 150
  const offset = ((amount - 1) * separationCube) / 2

  for (let i = 0; i < particlesTotal; i++) {
    const x = (i % amount) * separationCube
    const y = Math.floor((i / amount) % amount) * separationCube
    const z = Math.floor(i / (amount * amount)) * separationCube
    positions.value.push(x - offset, y - offset, z - offset)
  }

  for (let i = 0; i < particlesTotal; i++) {
    positions.value.push(
      Math.random() * 4000 - 2000,
      Math.random() * 4000 - 2000,
      Math.random() * 4000 - 2000
    )
  }

  const radius = 750

  for (let i = 0; i < particlesTotal; i++) {
    const phi = Math.acos(-1 + (2 * i) / particlesTotal)
    const theta = Math.sqrt(particlesTotal * Math.PI) * phi

    positions.value.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    )
  }
}

const createSprites = () => {
  objects.value = []
  for (let i = 0; i < particlesTotal; i++) {
    objects.value.push({
      position: computed(() => {
        const position = objects.value[i].animatePosition
        return [position.x, position.y, position.z]
      }),
      animatePosition: {
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 4000 - 2000
      },
      scale: [1, 1, 1]
    })
  }

  setTimeout(() => {
    transition()
  }, 100)
}

const transition = () => {
  const offset = currentLayout.value * particlesTotal * 3
  const duration = 2000
  objects.value.forEach((object, i) => {
    const j = offset + i * 3
    const targetX = positions.value[j]
    const targetY = positions.value[j + 1]
    const targetZ = positions.value[j + 2]

    new TWEEN.Tween(object.animatePosition)
      .to({ x: targetX, y: targetY, z: targetZ }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()
  })

  new TWEEN.Tween({})
    .to({}, duration * 3)
    .onComplete(transition)
    .start()
  currentLayout.value = (currentLayout.value + 1) % 4
}



const animate = () => {
  animationId = requestAnimationFrame(animate)

  TWEEN.update()

  if (controlsRef.value?.controls) {
    controlsRef.value.controls.update()
  }

  const time = performance.now()

  objects.value.forEach((object) => {
    const scale = Math.sin((Math.floor(object.position[0]) + time) * 0.002) * 0.3 + 1
    object.scale = [scale, scale, scale]
  })
}

onMounted(() => {
  initPositions()
  createSprites()

  animate()
})

onUnmounted(() => {

  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  TWEEN.removeAll()
})
</script>

<style scoped></style>
