<template>
  <TCanvas antialias animation-loop :enable-controls="false" @before-render="animate">
    <TPerspectiveCamera ref="cameraRef" :fov="33" :near="1" :far="10000" :position="[0, 0, 1000]" />

    <TScene ref="sceneRef">
      <TLine v-for="(lineConfig, index) in lineConfigs" :key="index" :geometry="lineConfig.geometry"
        :vertex-colors="true" :position="lineConfig.position" :scale="lineConfig.scale" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Vector3, BufferGeometry, Color, CatmullRomCurve3, Float32BufferAttribute } from 'three'
import { TCanvas, TScene, TPerspectiveCamera, TLine } from '@vue-three/vue-three'

const sceneRef = ref<any>(null)
const cameraRef = ref<any>(null)

const mouseX = ref(0)
const mouseY = ref(0)
const windowHalfX = ref(window.innerWidth / 2)
const windowHalfY = ref(window.innerHeight / 2)

const hilbertPoints = computed(() => {
  const points: Vector3[] = []
  hilbert3D(new Vector3(0, 0, 0), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7)
  return points

  function hilbert3D(point: Vector3, scale: number, ...indexes: number[]) {
    for (const i of indexes) {
      const v = new Vector3()
      switch (i) {
        case 0: v.set(0, 0, 0); break
        case 1: v.set(0, 1, 0); break
        case 2: v.set(1, 1, 0); break
        case 3: v.set(1, 0, 0); break
        case 4: v.set(1, 0, 1); break
        case 5: v.set(1, 1, 1); break
        case 6: v.set(0, 1, 1); break
        case 7: v.set(0, 0, 1); break
      }
      v.multiplyScalar(scale).add(point)
      points.push(v)
    }
  }
})

const geometries = computed(() => {
  const geometry1 = new BufferGeometry()
  const geometry2 = new BufferGeometry()
  const geometry3 = new BufferGeometry()

  const subdivisions = 6
  const vertices: number[] = []
  const colors1: number[] = []
  const colors2: number[] = []
  const colors3: number[] = []

  const point = new Vector3()
  const color = new Color()

  const spline = new CatmullRomCurve3(hilbertPoints.value)

  for (let i = 0; i < hilbertPoints.value.length * subdivisions; i++) {
    const t = i / (hilbertPoints.value.length * subdivisions)
    spline.getPoint(t, point)

    vertices.push(point.x, point.y, point.z)

    color.setHSL(0.6, 1.0, Math.max(0, -point.x / 200) + 0.5)
    colors1.push(color.r, color.g, color.b)

    color.setHSL(0.9, 1.0, Math.max(0, -point.y / 200) + 0.5)
    colors2.push(color.r, color.g, color.b)

    color.setHSL(i / (hilbertPoints.value.length * subdivisions), 1.0, 0.5)
    colors3.push(color.r, color.g, color.b)
  }

  geometry1.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry2.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry3.setAttribute('position', new Float32BufferAttribute(vertices, 3))

  geometry1.setAttribute('color', new Float32BufferAttribute(colors1, 3))
  geometry2.setAttribute('color', new Float32BufferAttribute(colors2, 3))
  geometry3.setAttribute('color', new Float32BufferAttribute(colors3, 3))

  const geometry4 = new BufferGeometry()
  const geometry5 = new BufferGeometry()
  const geometry6 = new BufferGeometry()

  const vertices2: number[] = []
  const c1: number[] = []
  const c2: number[] = []
  const c3: number[] = []

  for (let i = 0; i < hilbertPoints.value.length; i++) {
    const pt = hilbertPoints.value[i]

    vertices2.push(pt.x, pt.y, pt.z)

    color.setHSL(0.6, 1.0, Math.max(0, (200 - pt.x) / 400) * 0.5 + 0.5)
    c1.push(color.r, color.g, color.b)

    color.setHSL(0.3, 1.0, Math.max(0, (200 + pt.x) / 400) * 0.5)
    c2.push(color.r, color.g, color.b)

    color.setHSL(i / hilbertPoints.value.length, 1.0, 0.5)
    c3.push(color.r, color.g, color.b)
  }

  geometry4.setAttribute('position', new Float32BufferAttribute(vertices2, 3))
  geometry5.setAttribute('position', new Float32BufferAttribute(vertices2, 3))
  geometry6.setAttribute('position', new Float32BufferAttribute(vertices2, 3))

  geometry4.setAttribute('color', new Float32BufferAttribute(c1, 3))
  geometry5.setAttribute('color', new Float32BufferAttribute(c2, 3))
  geometry6.setAttribute('color', new Float32BufferAttribute(c3, 3))

  return [geometry1, geometry2, geometry3, geometry4, geometry5, geometry6]
})

const lineConfigs = computed(() => {
  const d = 225
  const s = 0.3 * 1.5
  const scale: [number, number, number] = [s, s, s]

  return [
    { geometry: geometries.value[0], position: [-d, -d / 2, 0] as [number, number, number], scale },
    { geometry: geometries.value[1], position: [0, -d / 2, 0] as [number, number, number], scale },
    { geometry: geometries.value[2], position: [d, -d / 2, 0] as [number, number, number], scale },
    { geometry: geometries.value[3], position: [-d, d / 2, 0] as [number, number, number], scale },
    { geometry: geometries.value[4], position: [0, d / 2, 0] as [number, number, number], scale },
    { geometry: geometries.value[5], position: [d, d / 2, 0] as [number, number, number], scale }
  ]
})

onMounted(() => {
  document.body.addEventListener('pointermove', (event) => {
    if (!event.isPrimary) return
    mouseX.value = event.clientX - windowHalfX.value
    mouseY.value = event.clientY - windowHalfY.value
  })
})

function animate() {
  const camera = cameraRef.value.camera
  camera.position.x += (mouseX.value - camera.position.x) * 0.05
  camera.position.y += (-mouseY.value + 200 - camera.position.y) * 0.05
  camera.lookAt(0, 0, 0)

  const scene = sceneRef.value.scene
  const time = Date.now() * 0.0005

  for (let i = 0; i < scene.children.length; i++) {
    const object = scene.children[i]
    if (object.isLine) {
      object.rotation.y = time * (i % 2 ? 1 : -1)
    }
  }
}
</script>
