<template>
  <TCanvas :antialias="true" :autoClear="false" :on-render="onRender" @mousemove="handleMouseMove" ref="canvasRef">
    <TScene :background="0xf2f7ff" :fog="{ color: 0xf2f7ff, near: 1, far: 25000 }">
      <TPerspectiveCamera :fov="35" :near="1" :far="25000" :position="[0, 0, 1500]" ref="cameraRef" />

      <TAmbientLight :color="0xeef0ff" :intensity="3" />
      <TDirectionalLight :color="0xffffff" :intensity="6" :position="[1, 1, 1]" />

      <TMesh :rotation="[-Math.PI / 2, 0, 0]" :scale="[1000, 1000, 1000]">
        <TPlane :args="[100, 100]" />
        <TMeshPhongMaterial :color="0xffffff">
          <TTexture url="/textures/crate.gif" map-type="map" :repeat="[512, 512]" ref="textureRef" />
        </TMeshPhongMaterial>
      </TMesh>
    </TScene>
  </TCanvas>

  <div class="labels">
    <div class="label label-left">
      anisotropy: <span class="value">{{ maxAnisotropy > 0 ? maxAnisotropy : 'not supported' }}</span>
    </div>
    <div class="label label-right">
      anisotropy: <span class="value">{{ 1 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TAmbientLight,
  TDirectionalLight,
  TMesh,
  TPlane,
  TMeshPhongMaterial,
  TTexture
} from '@vue-three/vue-three'

const canvasRef = ref<InstanceType<typeof TCanvas> | null>(null)
const cameraRef = ref<InstanceType<typeof TPerspectiveCamera> | null>(null)
const textureRef = ref<InstanceType<typeof TTexture> | null>(null)

const maxAnisotropy = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)

let texture1: THREE.Texture | null = null
let texture2: THREE.Texture | null = null
let material1: THREE.MeshPhongMaterial | null = null
let material2: THREE.MeshPhongMaterial | null = null
let scene2: THREE.Scene | null = null
let mesh1: THREE.Mesh | null = null
let mesh2: THREE.Mesh | null = null

const onRender = (params: { renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera; size: { width: number; height: number } }) => {
  const { renderer, scene, camera, size } = params

  camera.position.x += (mouseX.value - camera.position.x) * 0.05
  camera.position.y = THREE.MathUtils.clamp(
    camera.position.y + (-(mouseY.value - 200) - camera.position.y) * 0.05,
    50,
    1000
  )
  camera.lookAt(scene.position)

  renderer.clear()
  renderer.setScissorTest(true)

  const halfWidth = size.width / 2

  renderer.setScissor(0, 0, halfWidth - 2, size.height)
  renderer.render(scene, camera)

  if (scene2) {
    renderer.setScissor(halfWidth, 0, halfWidth - 2, size.height)
    renderer.render(scene2, camera)
  }

  renderer.setScissorTest(false)
}

const handleMouseMove = (event: MouseEvent) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  mouseX.value = event.clientX - rect.left - rect.width / 2
  mouseY.value = event.clientY - rect.top - rect.height / 2
}

onMounted(() => {
  if (canvasRef.value?.context?.renderer) {
    maxAnisotropy.value = canvasRef.value.context.renderer.capabilities.getMaxAnisotropy()

    const textureLoader = new THREE.TextureLoader()

    texture1 = textureLoader.load('/textures/crate.gif')
    texture1.colorSpace = THREE.SRGBColorSpace
    texture1.anisotropy = maxAnisotropy.value
    texture1.wrapS = THREE.RepeatWrapping
    texture1.wrapT = THREE.RepeatWrapping
    texture1.repeat.set(512, 512)

    texture2 = textureLoader.load('/textures/crate.gif')
    texture2.colorSpace = THREE.SRGBColorSpace
    texture2.anisotropy = 1
    texture2.wrapS = THREE.RepeatWrapping
    texture2.wrapT = THREE.RepeatWrapping
    texture2.repeat.set(512, 512)

    material1 = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture1 })
    material2 = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture2 })

    const geometry = new THREE.PlaneGeometry(100, 100)

    if (canvasRef.value.context.scene) {
      const existingMeshes = canvasRef.value.context.scene.children.filter(
        (child) => child instanceof THREE.Mesh
      )
      if (existingMeshes.length > 0) {
        const existingMesh = existingMeshes[0] as THREE.Mesh
        existingMesh.material = material1
        mesh1 = existingMesh
      }
    }

    scene2 = new THREE.Scene()
    scene2.background = new THREE.Color(0xf2f7ff)
    scene2.fog = new THREE.Fog(0xf2f7ff, 1, 25000)

    const ambientLight = new THREE.AmbientLight(0xeef0ff, 3)
    scene2.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 6)
    directionalLight.position.set(1, 1, 1)
    scene2.add(directionalLight)

    mesh2 = new THREE.Mesh(geometry, material2)
    mesh2.rotation.x = -Math.PI / 2
    mesh2.scale.set(1000, 1000, 1000)
    scene2.add(mesh2)
  }
})

onUnmounted(() => {
  if (texture1) {
    texture1.dispose()
  }
  if (texture2) {
    texture2.dispose()
  }
  if (material1) {
    material1.dispose()
  }
  if (material2) {
    material2.dispose()
  }
})
</script>

<style scoped>
.labels {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.label {
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 1em;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: #000 1px 1px 1px;
}

.label-left {
  left: 0;
  text-align: left;
}

.label-right {
  right: 0;
  text-align: left;
}

.value {
  color: #fa0;
}
</style>
