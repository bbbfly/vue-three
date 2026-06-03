<template>
  <TCanvas
    antialias
    :tone-mapping="'ACESFilmicToneMapping'"
    :tone-mapping-exposure="0.85"
    background="#333333"
    @animate="onAnimate"
  >
    <TScene :environment="environmentMap" :fog="{ color: '#333333', near: 10, far: 15 }">
      <TPerspectiveCamera :position="[4.25, 1.4, -4.5]" :fov="40" :near="0.1" :far="100" />
      <TOrbitControls
        :max-distance="9"
        :max-polar-angle="Math.PI / 2"
        :target="[0, 0.5, 0]"
        :enable-damping="true"
      />

      <TGridHelper :size="20" :divisions="40" color="#ffffff" :opacity="0.2" />

      <TGLTFLoader ref="gltfLoaderRef" :src="modelUrl" :draco="true" @load="onModelLoad" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  useGui,
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TGridHelper,
  TGLTFLoader
} from '@vue-three/vue-three'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import {
  EquirectangularReflectionMapping,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  TextureLoader,
  Object3D,
  MultiplyBlending
} from 'three'

const modelUrl = '/models/gltf/ferrari.glb'

const environmentMap = ref(null)
const environmentLoaded = ref(false)
const wheels: any[] = []
let carModel: Object3D | null = null
let shadowMesh: any = null

const params = reactive({
  bodyColor: '#ff0000',
  detailsColor: '#ffffff',
  glassColor: '#ffffff'
})

const shadowTexture = new TextureLoader().load('/models/gltf/ferrari_ao.png')

// 预先创建材质
const bodyMaterial = new MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03
})

const detailsMaterial = new MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.5
})

const glassMaterial = new MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.25,
  roughness: 0,
  transmission: 1.0
})

const { gui } = useGui()

const hdrLoader = new HDRLoader()
hdrLoader.load('/textures/equirectangular/venice_sunset_1k.hdr', texture => {
  texture.mapping = EquirectangularReflectionMapping
  environmentMap.value = texture
  environmentLoaded.value = true
})

onMounted(() => {
  gui
    .addColor(params, 'bodyColor')
    .name('Body')
    .onChange((color: string) => {
      bodyMaterial.color.set(color)
    })

  gui
    .addColor(params, 'detailsColor')
    .name('Details')
    .onChange((color: string) => {
      detailsMaterial.color.set(color)
    })

  gui
    .addColor(params, 'glassColor')
    .name('Glass')
    .onChange((color: string) => {
      glassMaterial.color.set(color)
    })
})

const onModelLoad = (loadedModel: any) => {
  carModel = loadedModel.children[0]
  if (!carModel) return

  console.log('Model loaded:', carModel)

  // 遍历模型，打印所有子对象名称
  console.log('=== All objects in model ===')
  carModel.traverse((child: any) => {
    if (child.isMesh) {
      console.log('Mesh:', child.name, '| Material:', child.material?.type)
    }
  })
  console.log('=== End of objects ===')

  // 应用预先创建的材质到模型
  const body = carModel.getObjectByName('body')
  if (body) {
    body.material = bodyMaterial
    console.log('Applied bodyMaterial to body')
  } else {
    console.log('WARNING: body object not found!')
  }

  const rim_fl = carModel.getObjectByName('rim_fl')
  const rim_fr = carModel.getObjectByName('rim_fr')
  const rim_rr = carModel.getObjectByName('rim_rr')
  const rim_rl = carModel.getObjectByName('rim_rl')
  const trim = carModel.getObjectByName('trim')

  if (rim_fl) rim_fl.material = detailsMaterial
  else console.log('WARNING: rim_fl not found!')
  if (rim_fr) rim_fr.material = detailsMaterial
  else console.log('WARNING: rim_fr not found!')
  if (rim_rr) rim_rr.material = detailsMaterial
  else console.log('WARNING: rim_rr not found!')
  if (rim_rl) rim_rl.material = detailsMaterial
  else console.log('WARNING: rim_rl not found!')
  if (trim) trim.material = detailsMaterial
  else console.log('WARNING: trim not found!')

  const glass = carModel.getObjectByName('glass')
  if (glass) {
    glass.material = glassMaterial
    console.log('Applied glassMaterial to glass')
  } else {
    console.log('WARNING: glass object not found!')
  }

  const wheel_fl = carModel.getObjectByName('wheel_fl')
  const wheel_fr = carModel.getObjectByName('wheel_fr')
  const wheel_rl = carModel.getObjectByName('wheel_rl')
  const wheel_rr = carModel.getObjectByName('wheel_rr')

  if (wheel_fl) wheels.push(wheel_fl)
  if (wheel_fr) wheels.push(wheel_fr)
  if (wheel_rl) wheels.push(wheel_rl)
  if (wheel_rr) wheels.push(wheel_rr)

  shadowMesh = new Mesh(
    new PlaneGeometry(0.655 * 4, 1.3 * 4),
    new MeshBasicMaterial({
      map: shadowTexture,
      blending: MultiplyBlending,
      toneMapped: false,
      transparent: true,
      premultipliedAlpha: true
    })
  )
  shadowMesh.rotation.x = -Math.PI / 2
  shadowMesh.renderOrder = 2
  carModel.add(shadowMesh)
}

const onAnimate = () => {
  const time = -performance.now() / 1000

  if (wheels.length > 0) {
    wheels.forEach(wheel => {
      wheel.rotation.x = time * Math.PI * 2
    })
  }
}
</script>
