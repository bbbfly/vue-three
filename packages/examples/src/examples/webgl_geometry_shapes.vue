<template>
  <TCanvas antialias clear-color="#f0f0f0">
    <TScene ref="sceneRef">
      <TPerspectiveCamera
        ref="cameraRef"
        :fov="50"
        :near="1"
        :far="1000"
        :position="[0, 150, 500]"
      />

      <TPointLight :intensity="2.5" :distance="0" :decay="0" :position="[0, 150, 500]" />

      <TGroup ref="groupRef" :position="[0, 50, 0]">
        <!-- 使用 TMesh 和 TBufferGeometry 创建各种形状 -->
        <template v-for="(item, index) in shapeItems" :key="index">
          <!-- 带纹理的扁平形状 -->
          <TMesh
            :position="[item.x, item.y, item.z - 175]"
            :rotation="[item.rx, item.ry, item.rz]"
            :scale="[item.s, item.s, item.s]"
          >
            <TBufferGeometry :attributes="item.shapeAttributes" />
            <TMeshPhongMaterial :side="DoubleSide">
              <TTexture
                :url="textureUrl"
                :wrap-s="RepeatWrapping"
                :wrap-t="RepeatWrapping"
                :repeat="[0.008, 0.008]"
              />
            </TMeshPhongMaterial>
          </TMesh>

          <!-- 纯色扁平形状 -->
          <TMesh
            :position="[item.x, item.y, item.z - 125]"
            :rotation="[item.rx, item.ry, item.rz]"
            :scale="[item.s, item.s, item.s]"
          >
            <TBufferGeometry :attributes="item.shapeAttributes" />
            <TMeshPhongMaterial :color="item.color" :side="DoubleSide" />
          </TMesh>

          <!-- 拉伸形状 -->
          <TMesh
            :position="[item.x, item.y, item.z - 75]"
            :rotation="[item.rx, item.ry, item.rz]"
            :scale="[item.s, item.s, item.s]"
          >
            <TBufferGeometry :attributes="item.extrudeAttributes" />
            <TMeshPhongMaterial :color="item.color" />
          </TMesh>

          <!-- 实体线条 -->
          <TLine
            :position="[item.x, item.y, item.z - 25]"
            :rotation="[item.rx, item.ry, item.rz]"
            :scale="[item.s, item.s, item.s]"
          >
            <TBufferGeometry :attributes="item.pointsAttributes" />
            <TLineBasicMaterial :color="item.color" />
          </TLine>

          <!-- 等距采样线条 -->
          <TLine
            :position="[item.x, item.y, item.z + 25]"
            :rotation="[item.rx, item.ry, item.rz]"
            :scale="[item.s, item.s, item.s]"
          >
            <TBufferGeometry :attributes="item.spacedPointsAttributes" />
            <TLineBasicMaterial :color="item.color" />
          </TLine>

          <!-- 点（真实点） -->
          <TPoints
            :position="[item.x, item.y, item.z + 75]"
            :rotation="[item.rx, item.ry, item.rz]"
            :scale="[item.s, item.s, item.s]"
          >
            <TBufferGeometry :attributes="item.pointsAttributes" />
            <TPointsMaterial :color="item.color" :size="4" />
          </TPoints>

          <!-- 等距采样点 -->
          <TPoints
            :position="[item.x, item.y, item.z + 125]"
            :rotation="[item.rx, item.ry, item.rz]"
            :scale="[item.s, item.s, item.s]"
          >
            <TBufferGeometry :attributes="item.spacedPointsAttributes" />
            <TPointsMaterial :color="item.color" :size="4" />
          </TPoints>
        </template>

        <!-- 孔洞路径 -->
        <template v-for="(holeItem, index) in holeItems" :key="'hole-' + index">
          <TLine
            :position="[holeItem.x, holeItem.y, holeItem.z - 25]"
            :rotation="[holeItem.rx, holeItem.ry, holeItem.rz]"
            :scale="[holeItem.s, holeItem.s, holeItem.s]"
          >
            <TBufferGeometry :attributes="holeItem.pointsAttributes" />
            <TLineBasicMaterial :color="holeItem.color" />
          </TLine>
          <TLine
            :position="[holeItem.x, holeItem.y, holeItem.z + 25]"
            :rotation="[holeItem.rx, holeItem.ry, holeItem.rz]"
            :scale="[holeItem.s, holeItem.s, holeItem.s]"
          >
            <TBufferGeometry :attributes="holeItem.spacedPointsAttributes" />
            <TLineBasicMaterial :color="holeItem.color" />
          </TLine>
          <TPoints
            :position="[holeItem.x, holeItem.y, holeItem.z + 75]"
            :rotation="[holeItem.rx, holeItem.ry, holeItem.rz]"
            :scale="[holeItem.s, holeItem.s, holeItem.s]"
          >
            <TBufferGeometry :attributes="holeItem.pointsAttributes" />
            <TPointsMaterial :color="holeItem.color" :size="4" />
          </TPoints>
          <TPoints
            :position="[holeItem.x, holeItem.y, holeItem.z + 125]"
            :rotation="[holeItem.rx, holeItem.ry, holeItem.rz]"
            :scale="[holeItem.s, holeItem.s, holeItem.s]"
          >
            <TBufferGeometry :attributes="holeItem.spacedPointsAttributes" />
            <TPointsMaterial :color="holeItem.color" :size="4" />
          </TPoints>
        </template>
      </TGroup>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TPointLight,
  TGroup,
  TMesh,
  TLine,
  TPoints,
  TMeshPhongMaterial,
  TLineBasicMaterial,
  TPointsMaterial,
  TBufferGeometry,
  TTexture
} from '@vue-three/vue-three'
import { RepeatWrapping, DoubleSide, BufferAttribute } from 'three'

const textureUrl = '/textures/uv_grid_opengl.jpg'

const sceneRef = ref<any>(null)
const cameraRef = ref<any>(null)
const groupRef = ref<any>(null)

const targetRotation = ref(0)
const targetRotationOnPointerDown = ref(0)
const pointerX = ref(0)
const pointerXOnPointerDown = ref(0)
let windowHalfX = window.innerWidth / 2

const extrudeSettings = {
  depth: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 1,
  bevelThickness: 1
}

function createShapeAttributes(shape: THREE.Shape) {
  const shapeGeometry = new THREE.ShapeGeometry(shape)
  const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

  const shapePositions = shapeGeometry.attributes.position.array as Float32Array
  const extrudePositions = extrudeGeometry.attributes.position.array as Float32Array

  const points = shape.getPoints()
  const spacedPoints = shape.getSpacedPoints(50)

  const pointsArray = new Float32Array(points.length * 3)
  const spacedPointsArray = new Float32Array(spacedPoints.length * 3)

  points.forEach((p, i) => {
    pointsArray[i * 3] = p.x
    pointsArray[i * 3 + 1] = p.y
    pointsArray[i * 3 + 2] = 0
  })

  spacedPoints.forEach((p, i) => {
    spacedPointsArray[i * 3] = p.x
    spacedPointsArray[i * 3 + 1] = p.y
    spacedPointsArray[i * 3 + 2] = 0
  })

  shapeGeometry.dispose()
  extrudeGeometry.dispose()

  return {
    shapeAttributes: {
      position: { array: shapePositions, itemSize: 3 }
    },
    extrudeAttributes: {
      position: { array: extrudePositions, itemSize: 3 }
    },
    pointsAttributes: {
      position: { array: pointsArray, itemSize: 3 }
    },
    spacedPointsAttributes: {
      position: { array: spacedPointsArray, itemSize: 3 }
    }
  }
}

const californiaPts = []
californiaPts.push(new THREE.Vector2(610, 320))
californiaPts.push(new THREE.Vector2(450, 300))
californiaPts.push(new THREE.Vector2(392, 392))
californiaPts.push(new THREE.Vector2(266, 438))
californiaPts.push(new THREE.Vector2(190, 570))
californiaPts.push(new THREE.Vector2(190, 600))
californiaPts.push(new THREE.Vector2(160, 620))
californiaPts.push(new THREE.Vector2(160, 650))
californiaPts.push(new THREE.Vector2(180, 640))
californiaPts.push(new THREE.Vector2(165, 680))
californiaPts.push(new THREE.Vector2(150, 670))
californiaPts.push(new THREE.Vector2(90, 737))
californiaPts.push(new THREE.Vector2(80, 795))
californiaPts.push(new THREE.Vector2(50, 835))
californiaPts.push(new THREE.Vector2(64, 870))
californiaPts.push(new THREE.Vector2(60, 945))
californiaPts.push(new THREE.Vector2(300, 945))
californiaPts.push(new THREE.Vector2(300, 743))
californiaPts.push(new THREE.Vector2(600, 473))
californiaPts.push(new THREE.Vector2(626, 425))
californiaPts.push(new THREE.Vector2(600, 370))
californiaPts.push(new THREE.Vector2(610, 320))

for (let i = 0; i < californiaPts.length; i++) {
  californiaPts[i].multiplyScalar(0.25)
}

const californiaShape = new THREE.Shape(californiaPts)

const triangleShape = new THREE.Shape().moveTo(80, 20).lineTo(40, 80).lineTo(120, 80).lineTo(80, 20)

const x = 0,
  y = 0
const heartShape = new THREE.Shape()
  .moveTo(x + 25, y + 25)
  .bezierCurveTo(x + 25, y + 25, x + 20, y, x, y)
  .bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35)
  .bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95)
  .bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35)
  .bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y)
  .bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25)

const sqLength = 80
const squareShape = new THREE.Shape()
  .moveTo(0, 0)
  .lineTo(0, sqLength)
  .lineTo(sqLength, sqLength)
  .lineTo(sqLength, 0)
  .lineTo(0, 0)

const roundedRectShape = new THREE.Shape()
;(function roundedRect(
  ctx: THREE.Shape,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.moveTo(x, y + radius)
  ctx.lineTo(x, y + height - radius)
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
  ctx.lineTo(x + width - radius, y + height)
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
  ctx.lineTo(x + width, y + radius)
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
  ctx.lineTo(x + radius, y)
  ctx.quadraticCurveTo(x, y, x, y + radius)
})(roundedRectShape, 0, 0, 50, 50, 20)

const trackShape = new THREE.Shape()
  .moveTo(40, 40)
  .lineTo(40, 160)
  .absarc(60, 160, 20, Math.PI, 0, true)
  .lineTo(80, 40)
  .absarc(60, 40, 20, 2 * Math.PI, Math.PI, true)

const circleRadius = 40
const circleShape = new THREE.Shape()
  .moveTo(0, circleRadius)
  .quadraticCurveTo(circleRadius, circleRadius, circleRadius, 0)
  .quadraticCurveTo(circleRadius, -circleRadius, 0, -circleRadius)
  .quadraticCurveTo(-circleRadius, -circleRadius, -circleRadius, 0)
  .quadraticCurveTo(-circleRadius, circleRadius, 0, circleRadius)

const fishShape = new THREE.Shape()
  .moveTo(x, y)
  .quadraticCurveTo(x + 50, y - 80, x + 90, y - 10)
  .quadraticCurveTo(x + 100, y - 10, x + 115, y - 40)
  .quadraticCurveTo(x + 115, y, x + 115, y + 40)
  .quadraticCurveTo(x + 100, y + 10, x + 90, y + 10)
  .quadraticCurveTo(x + 50, y + 80, x, y)

const arcShape = new THREE.Shape().moveTo(50, 10).absarc(10, 10, 40, 0, Math.PI * 2, false)

const holePath = new THREE.Path().moveTo(20, 10).absarc(10, 10, 10, 0, Math.PI * 2, true)
arcShape.holes.push(holePath)

const smileyShape = new THREE.Shape().moveTo(80, 40).absarc(40, 40, 40, 0, Math.PI * 2, false)

const smileyEye1Path = new THREE.Path()
  .moveTo(35, 20)
  .absellipse(25, 20, 10, 10, 0, Math.PI * 2, true)

const smileyEye2Path = new THREE.Path().moveTo(65, 20).absarc(55, 20, 10, 0, Math.PI * 2, true)

const smileyMouthPath = new THREE.Path()
  .moveTo(20, 40)
  .quadraticCurveTo(40, 60, 60, 40)
  .bezierCurveTo(70, 45, 70, 50, 60, 60)
  .quadraticCurveTo(40, 80, 20, 60)
  .quadraticCurveTo(5, 50, 20, 40)

smileyShape.holes.push(smileyEye1Path)
smileyShape.holes.push(smileyEye2Path)
smileyShape.holes.push(smileyMouthPath)

const splinepts = []
splinepts.push(new THREE.Vector2(70, 20))
splinepts.push(new THREE.Vector2(80, 90))
splinepts.push(new THREE.Vector2(-30, 70))
splinepts.push(new THREE.Vector2(0, 0))

const splineShape = new THREE.Shape().moveTo(0, 0).splineThru(splinepts)

const shapeItems = computed(() => [
  {
    ...createShapeAttributes(californiaShape),
    color: 0xf08000,
    x: -300,
    y: -100,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  },
  {
    ...createShapeAttributes(triangleShape),
    color: 0x8080f0,
    x: -180,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  },
  {
    ...createShapeAttributes(roundedRectShape),
    color: 0x008000,
    x: -150,
    y: 150,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  },
  {
    ...createShapeAttributes(trackShape),
    color: 0x008080,
    x: 200,
    y: -100,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  },
  {
    ...createShapeAttributes(squareShape),
    color: 0x0040f0,
    x: 150,
    y: 100,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  },
  {
    ...createShapeAttributes(heartShape),
    color: 0xf00000,
    x: 60,
    y: 100,
    z: 0,
    rx: 0,
    ry: 0,
    rz: Math.PI,
    s: 1
  },
  {
    ...createShapeAttributes(circleShape),
    color: 0x00f000,
    x: 120,
    y: 250,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  },
  {
    ...createShapeAttributes(fishShape),
    color: 0x404040,
    x: -60,
    y: 200,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  },
  {
    ...createShapeAttributes(smileyShape),
    color: 0xf000f0,
    x: -200,
    y: 250,
    z: 0,
    rx: 0,
    ry: 0,
    rz: Math.PI,
    s: 1
  },
  {
    ...createShapeAttributes(arcShape),
    color: 0x804000,
    x: 150,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  },
  {
    ...createShapeAttributes(splineShape),
    color: 0x808080,
    x: -50,
    y: -100,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  }
])

const holeItems = computed(() => {
  const items = []

  holePath.autoClose = true
  const holePoints = holePath.getPoints()
  const holeSpacedPoints = holePath.getSpacedPoints(50)

  const holePointsArray = new Float32Array(holePoints.length * 3)
  const holeSpacedPointsArray = new Float32Array(holeSpacedPoints.length * 3)

  holePoints.forEach((p, i) => {
    holePointsArray[i * 3] = p.x
    holePointsArray[i * 3 + 1] = p.y
    holePointsArray[i * 3 + 2] = 0
  })

  holeSpacedPoints.forEach((p, i) => {
    holeSpacedPointsArray[i * 3] = p.x
    holeSpacedPointsArray[i * 3 + 1] = p.y
    holeSpacedPointsArray[i * 3 + 2] = 0
  })

  items.push({
    pointsAttributes: { position: { array: holePointsArray, itemSize: 3 } },
    spacedPointsAttributes: { position: { array: holeSpacedPointsArray, itemSize: 3 } },
    color: 0x804000,
    x: 150,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    s: 1
  })

  for (const hole of smileyShape.holes) {
    hole.autoClose = true
    const smileyHolePoints = hole.getPoints()
    const smileyHoleSpacedPoints = hole.getSpacedPoints(50)

    const smileyPointsArray = new Float32Array(smileyHolePoints.length * 3)
    const smileySpacedPointsArray = new Float32Array(smileyHoleSpacedPoints.length * 3)

    smileyHolePoints.forEach((p, i) => {
      smileyPointsArray[i * 3] = p.x
      smileyPointsArray[i * 3 + 1] = p.y
      smileyPointsArray[i * 3 + 2] = 0
    })

    smileyHoleSpacedPoints.forEach((p, i) => {
      smileySpacedPointsArray[i * 3] = p.x
      smileySpacedPointsArray[i * 3 + 1] = p.y
      smileySpacedPointsArray[i * 3 + 2] = 0
    })

    items.push({
      pointsAttributes: { position: { array: smileyPointsArray, itemSize: 3 } },
      spacedPointsAttributes: { position: { array: smileySpacedPointsArray, itemSize: 3 } },
      color: 0xf000f0,
      x: -200,
      y: 250,
      z: 0,
      rx: 0,
      ry: 0,
      rz: Math.PI,
      s: 1
    })
  }

  return items
})

const onPointerDown = (event: PointerEvent) => {
  if (event.isPrimary === false) return
  pointerXOnPointerDown.value = event.clientX - windowHalfX
  targetRotationOnPointerDown.value = targetRotation.value
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

const onPointerMove = (event: PointerEvent) => {
  if (event.isPrimary === false) return
  pointerX.value = event.clientX - windowHalfX
  targetRotation.value =
    targetRotationOnPointerDown.value + (pointerX.value - pointerXOnPointerDown.value) * 0.02
}

const onPointerUp = () => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
}

const onWindowResize = () => {
  windowHalfX = window.innerWidth / 2
}

const animate = () => {
  requestAnimationFrame(animate)
  const group = groupRef.value?.group
  if (group) {
    group.rotation.y += (targetRotation.value - group.rotation.y) * 0.05
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('resize', onWindowResize)
  animate()
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped></style>
