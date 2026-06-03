<template>
  <TCanvas
    ref="canvasRef"
    :camera="null"
    :enable-controls="false"
    @mousemove="onDocumentMouseMove"
    @render="onRender"
  >
    <TScene>
      <TPerspectiveCamera
        ref="camera"
        :aspect="aspect"
        :position="[0, 0, 100]"
        :fov="30"
        :near="1"
        :far="10000"
      />
      <TMesh
        v-for="(sphere, index) in spheres"
        :key="index"
        :position="sphere.position"
        :rotation="sphere.rotation"
      >
        <TSphere :args="[10, 64, 32]" />
        <TMeshBasicMaterial v-if="rtTexture" :map="rtTexture?.texture" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, nextTick } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TMesh,
  TSphere,
  TMeshBasicMaterial
} from '@vue-three/vue-three'

const canvasRef = ref<InstanceType<typeof TCanvas> | null>(null)
const camera = ref<InstanceType<typeof TPerspectiveCamera> | null>(null)

const aspect = ref(window.innerWidth / window.innerHeight)

const spheres = ref<{ position: [number, number, number]; rotation: [number, number, number] }[]>(
  []
)

const rtTexture = shallowRef<THREE.WebGLRenderTarget | null>(null)
const sceneRTT = shallowRef<THREE.Scene | null>(null)
const sceneScreen = shallowRef<THREE.Scene | null>(null)
const cameraRTT = shallowRef<THREE.OrthographicCamera | null>(null)
const zmesh1 = shallowRef<THREE.Mesh | null>(null)
const zmesh2 = shallowRef<THREE.Mesh | null>(null)
const material = shallowRef<THREE.ShaderMaterial | null>(null)

const mouseX = ref(0)
const mouseY = ref(0)
const delta = ref(0.01)

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShaderPass1 = `
varying vec2 vUv;
uniform float time;

void main() {
  float r = vUv.x;
  if(vUv.y < 0.5) r = 0.0;
  float g = vUv.y;
  if(vUv.x < 0.5) g = 0.0;
  
  gl_FragColor = vec4(r, g, time, 1.0);
}
`

const fragmentShaderScreen = `
varying vec2 vUv;
uniform sampler2D tDiffuse;

void main() {
  gl_FragColor = texture2D(tDiffuse, vUv);
}
`

const initRTT = () => {
  if (!canvasRef.value?.context.renderer) return

  const width = canvasRef.value.context.canvas.getBoundingClientRect().width
  const height = canvasRef.value.context.canvas.getBoundingClientRect().height
  cameraRTT.value = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    1000
  )
  cameraRTT.value.position.z = 500

  sceneRTT.value = new THREE.Scene()
  sceneScreen.value = new THREE.Scene()

  const light1 = new THREE.DirectionalLight(0xffffff, 3)
  light1.position.set(0, 0, 1).normalize()
  sceneRTT.value.add(light1)

  const light2 = new THREE.DirectionalLight(0xffd5d5, 4.5)
  light2.position.set(0, 0, -1).normalize()
  sceneRTT.value.add(light2)

  rtTexture.value = new THREE.WebGLRenderTarget(width, height)

  material.value = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0.0 } },
    vertexShader,
    fragmentShader: fragmentShaderPass1
  })

  const materialScreen = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: rtTexture.value.texture } },
    vertexShader,
    fragmentShader: fragmentShaderScreen,
    depthWrite: false
  })

  const plane = new THREE.PlaneGeometry(width, height)

  const quad1 = new THREE.Mesh(plane.clone(), material.value)
  quad1.position.z = -100
  sceneRTT.value.add(quad1)

  const torusGeometry = new THREE.TorusGeometry(100, 25, 15, 30)

  const mat1 = new THREE.MeshPhongMaterial({
    color: 0x9c9c9c,
    specular: 0xffaa00,
    shininess: 5
  })
  const mat2 = new THREE.MeshPhongMaterial({
    color: 0x9c0000,
    specular: 0xff2200,
    shininess: 5
  })

  zmesh1.value = new THREE.Mesh(torusGeometry, mat1)
  zmesh1.value.position.set(0, 0, 100)
  zmesh1.value.scale.set(1.5, 1.5, 1.5)
  sceneRTT.value.add(zmesh1.value)

  zmesh2.value = new THREE.Mesh(torusGeometry.clone(), mat2)
  zmesh2.value.position.set(0, 150, 100)
  zmesh2.value.scale.set(0.75, 0.75, 0.75)
  sceneRTT.value.add(zmesh2.value)

  const quad2 = new THREE.Mesh(plane, materialScreen)
  quad2.position.z = -100
  sceneScreen.value.add(quad2)

  const n = 5
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      spheres.value.push({
        position: [(i - (n - 1) / 2) * 20, (j - (n - 1) / 2) * 20, 0],
        rotation: [0, -Math.PI / 2, 0]
      })
    }
  }
}

const onRender = ({ renderer, camera, scene }) => {
  if (
    !rtTexture.value ||
    !sceneRTT.value ||
    !sceneScreen.value ||
    !cameraRTT.value ||
    !material.value
  ) {
    return
  }

  const time = Date.now() * 0.0015

  if (camera) {
    camera.position.x += (mouseX.value - camera.position.x) * 0.05
    camera.position.y += (-mouseY.value - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  }

  if (zmesh1.value && zmesh2.value) {
    zmesh1.value.rotation.y = -time
    zmesh2.value.rotation.y = -time + Math.PI / 2
  }

  if (material.value.uniforms['time'].value > 1 || material.value.uniforms['time'].value < 0) {
    delta.value *= -1
  }
  material.value.uniforms['time'].value += delta.value

  renderer.setRenderTarget(rtTexture.value)
  renderer.clear()
  renderer.render(sceneRTT.value, cameraRTT.value)

  renderer.setRenderTarget(null)
  renderer.clear()
  renderer.render(sceneScreen.value, cameraRTT.value)

  // renderer.setRenderTarget(rtTexture.value)
  // renderer.clear()
  renderer.render(scene, camera)
}

const onDocumentMouseMove = (event: MouseEvent) => {
  const canvas = canvasRef.value.context.canvas
  if (!canvas) return
  mouseX.value = event.clientX - canvas.getBoundingClientRect().width / 2
  mouseY.value = event.clientY - canvas.getBoundingClientRect().height / 2
}

onMounted(async () => {
  await nextTick()
  await nextTick()
  await nextTick()
  await nextTick()
  initRTT()
})

onUnmounted(() => {
  if (rtTexture.value) {
    rtTexture.value.dispose()
  }
  if (material.value) {
    material.value.dispose()
  }
})
</script>

<style scoped lang="scss"></style>
