<template>
  <div ref="wrapperRef" style="width:100%; height: 100%" @mousemove="onMousemove">
    <TCanvas antialias animation-loop :enable-controls="false" @animate="animate">
      <TPerspectiveCamera ref="cameraRef" :fov="20" :near="1" :far="10000" :position="[0, 0, 1800]" />

      <TScene ref="sceneRef" background="#ffffff">
        <TDirectionalLight :color="0xffffff" :intensity="3" :position="[0, 0, 1]" />

        <TMesh :position="[0, -250, 0]" :rotation="[-Math.PI / 2, 0, 0]">
          <TPlane :args="[300, 300, 1, 1]" />
          <TMeshBasicMaterial>
            <TCanvasTexture :canvas="shadowCanvas1" />
          </TMeshBasicMaterial>
        </TMesh>

        <TMesh :position="[-400, -250, 0]" :rotation="[-Math.PI / 2, 0, 0]">
          <TPlane :args="[300, 300, 1, 1]" />
          <TMeshBasicMaterial>
            <TCanvasTexture :canvas="shadowCanvas2" />
          </TMeshBasicMaterial>
        </TMesh>

        <TMesh :position="[400, -250, 0]" :rotation="[-Math.PI / 2, 0, 0]">
          <TPlane :args="[300, 300, 1, 1]" />
          <TMeshBasicMaterial>
            <TCanvasTexture :canvas="shadowCanvas3" />
          </TMeshBasicMaterial>
        </TMesh>

        <TMesh :position="[-400, 0, 0]" :rotation="[-1.87, 0, 0]">
          <TIcosahedron ref="geometry1" :args="[200, 1]" />
          <TMeshPhongMaterial ref="material1" :color="0xffffff" :flat-shading="true" :vertex-colors="true"
            :shininess="0" />
          <TMesh :position="[-400, 0, 0]" :rotation="[-1.87, 0, 0]">
            <TIcosahedron :args="[200, 1]" />
            <TMeshBasicMaterial :color="0x000000" :wireframe="true" :transparent="true" />
          </TMesh>
        </TMesh>


        <TMesh :position="[400, 0, 0]">
          <TIcosahedron ref="geometry2" :args="[200, 1]" />
          <TMeshPhongMaterial ref="material2" :color="0xffffff" :flat-shading="true" :vertex-colors="true"
            :shininess="0" />
          <TMesh :position="[400, 0, 0]">
            <TIcosahedron :args="[200, 1]" />
            <TMeshBasicMaterial :color="0x000000" :wireframe="true" :transparent="true" />
          </TMesh>
        </TMesh>


        <TMesh :position="[0, 0, 0]">
          <TIcosahedron ref="geometry3" :args="[200, 1]" />
          <TMeshPhongMaterial ref="material3" color="#ffffff" :flat-shading="true" :vertex-colors="true"
            :shininess="0" />
          <TMesh :position="[0, 0, 0]">
            <TIcosahedron :args="[200, 1]" />
            <TMeshBasicMaterial :color="0x000000" :wireframe="true" :transparent="true" />
          </TMesh>
        </TMesh>

      </TScene>
    </TCanvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, markRaw } from 'vue'
import {
  Color,
  SRGBColorSpace,
  BufferAttribute,
  type Camera,
  type Scene
} from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TMesh,
  TDirectionalLight,
  TPlane,
  TIcosahedron,
  TMeshPhongMaterial,
  TMeshBasicMaterial,
  TCanvasTexture
} from '@vue-three/vue-three'

const wrapperRef = ref<HTMLDivElement>()
const mouseX = ref(0)
const mouseY = ref(0)


const createShadowCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')!
  const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
  gradient.addColorStop(0.1, 'rgba(210,210,210,1)')
  gradient.addColorStop(1, 'rgba(255,255,255,1)')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
  return canvas
}

const shadowCanvas1 = markRaw(createShadowCanvas())
const shadowCanvas2 = markRaw(createShadowCanvas())
const shadowCanvas3 = markRaw(createShadowCanvas())

const geometry1 = ref<TIcosahedron>()
const material1 = ref<TMeshPhongMaterial>()
const geometry2 = ref<TIcosahedron>()
const material2 = ref<TMeshPhongMaterial>()
const geometry3 = ref<TIcosahedron>()
const material3 = ref<TMeshMeshPhongMaterial>()

const onMousemove = (event) => {
  mouseX.value = event.clientX - wrapperRef.value.offsetWidth / 2
  mouseY.value = event.clientY - wrapperRef.value.offsetHeight / 2
}

onMounted(() => {
  nextTick(() => {
    setupVertexColors()
  })
})


function setupVertexColors() {
  const color = new Color()
  const radius = 200
  const count = geometry1.value.geometry.attributes.position.count

  const arrayType = (typeof window.Float16Array !== 'undefined') ? window.Float16Array : window.Float32Array;
  geometry1.value.geometry.setAttribute('color', new BufferAttribute(new arrayType(count * 3), 3));
  geometry2.value.geometry.setAttribute('color', new BufferAttribute(new arrayType(count * 3), 3));
  geometry3.value.geometry.setAttribute('color', new BufferAttribute(new arrayType(count * 3), 3));

  const positions1 = geometry1.value.geometry.attributes.position
  const colors1 = geometry1.value.geometry.attributes.color
  const positions2 = geometry2.value.geometry.attributes.position
  const colors2 = geometry2.value.geometry.attributes.color
  const positions3 = geometry3.value.geometry.attributes.position
  const colors3 = geometry3.value.geometry.attributes.color



  for (let i = 0; i < count; i++) {
    color.setHSL((positions1.getY(i) / radius + 1) / 2, 1.0, 0.5, SRGBColorSpace);
    colors1.setXYZ(i, color.r, color.g, color.b);

    color.setHSL(0, (positions2.getY(i) / radius + 1) / 2, 0.5, SRGBColorSpace);
    colors2.setXYZ(i, color.r, color.g, color.b);

    color.setRGB(1, 0.8 - (positions3.getY(i) / radius + 1) / 2, 0, SRGBColorSpace);
    colors3.setXYZ(i, color.r, color.g, color.b);
  }

  material1.value.material.needsUpdate = true
  material2.value.material.needsUpdate = true
  material3.value.material.needsUpdate = true
}

const animate = ({ camera, scene }: { camera: Camera, scene: Scene }) => {
  camera.position.x += (mouseX.value - camera.position.x) * 0.05
  camera.position.y += (-mouseY.value - camera.position.y) * 0.05
  camera.lookAt(scene.position)
}
</script>
