<template>
  <TCanvas antialias background="#000000" @animate="onAnimate">
    <TScene>
      <TPerspectiveCamera
        v-if="cameraType === 'perspective'"
        ref="perspectiveCameraRef"
        :position="[0, 0, 1500]"
        :fov="45"
        :near="500"
        :far="3000"
      />
      <TOrthographicCamera
        v-else
        ref="orthoCameraRef"
        :position="[0, 0, 1500]"
        :zoom="1"
        :near="1000"
        :far="2500"
      />

      <TOrbitControls ref="orbitControlsRef" :enable-damping="true" />

      <TAmbientLight :intensity="0.3" />
      <TPointLight color="#ff0000" :intensity="1.5" :position="[0, 0, 2500]" />
      <TPointLight color="#ff6666" :intensity="3" :position="[0, 0, 0]" />
      <TPointLight color="#0000ff" :intensity="1.5" :position="[-1000, 0, 1000]" />

      <TMesh ref="meshRef" :scale="[25, 25, 25]">
        <TOBJLoader ref="objLoaderRef" :src="modelUrl" />

        <TMeshNormalMaterial
          v-if="currentMaterial === 'normal'"
          :side="currentSide"
          :displacement-scale="SCALE"
          :displacement-bias="BIAS"
          :normal-scale="[1, -1]"
        >
          <TTexture map-type="displacementMap" url="/models/obj/ninja/displacement.jpg" />
          <TTexture map-type="normalMap" url="/models/obj/ninja/normal.png" />
        </TMeshNormalMaterial>

        <TMeshStandardMaterial
          v-else-if="currentMaterial === 'standard'"
          :side="currentSide"
          :color="0xffffff"
          :metalness="0.5"
          :roughness="0.6"
          :displacement-scale="SCALE"
          :displacement-bias="BIAS"
          :normal-scale="[1, -1]"
        >
          <TTexture map-type="displacementMap" url="/models/obj/ninja/displacement.jpg" />
          <TTexture map-type="aoMap" url="/models/obj/ninja/ao.jpg" />
          <TTexture map-type="normalMap" url="/models/obj/ninja/normal.png" />
        </TMeshStandardMaterial>

        <TMeshDepthMaterial
          v-else-if="currentMaterial === 'depthBasic'"
          :side="currentSide"
          depth-packing="BasicDepthPacking"
          :displacement-scale="SCALE"
          :displacement-bias="BIAS"
        >
          <TTexture map-type="displacementMap" url="/models/obj/ninja/displacement.jpg" />
        </TMeshDepthMaterial>

        <TMeshDepthMaterial
          v-else-if="currentMaterial === 'depthRGBA'"
          :side="currentSide"
          depth-packing="RGBADepthPacking"
          :displacement-scale="SCALE"
          :displacement-bias="BIAS"
        >
          <TTexture map-type="displacementMap" url="/models/obj/ninja/displacement.jpg" />
        </TMeshDepthMaterial>

        <TMeshDepthMaterial
          v-else-if="currentMaterial === 'depthRGB'"
          :side="currentSide"
          depth-packing="RGBDepthPacking"
          :displacement-scale="SCALE"
          :displacement-bias="BIAS"
        >
          <TTexture map-type="displacementMap" url="/models/obj/ninja/displacement.jpg" />
        </TMeshDepthMaterial>

        <TMeshDepthMaterial
          v-else-if="currentMaterial === 'depthRG'"
          :side="currentSide"
          depth-packing="RGDepthPacking"
          :displacement-scale="SCALE"
          :displacement-bias="BIAS"
        >
          <TTexture map-type="displacementMap" url="/models/obj/ninja/displacement.jpg" />
        </TMeshDepthMaterial>

        <TShaderMaterial
          v-else-if="currentMaterial === 'velocity'"
          :side="currentSide"
          :uniforms="velocityUniforms"
          :vertex-shader="velocityShader.vertexShader"
          :fragment-shader="velocityShader.fragmentShader"
        />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from 'vue'
import {
  useGui,
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrthographicCamera,
  TOrbitControls,
  TAmbientLight,
  TPointLight,
  TMesh,
  TOBJLoader,
  TMeshNormalMaterial,
  TMeshStandardMaterial,
  TMeshDepthMaterial,
  TShaderMaterial,
  TTexture
} from '@vue-three/vue-three'
import {
  Matrix4,
  UniformsUtils,
  FrontSide,
  BackSide,
  DoubleSide,
  PerspectiveCamera,
  OrthographicCamera,
  OrbitControls,
  Mesh,
  Object3D,
  TextureLoader
} from 'three'
import { VelocityShader } from 'three/addons/shaders/VelocityShader.js'

const SCALE = 2.436143
const BIAS = -0.428408

const modelUrl = '/models/obj/ninja/ninjaHead_Low.obj'

const currentMaterial = ref('normal')
const cameraType = ref('perspective')
const currentSide = ref(DoubleSide)

const perspectiveCameraRef = ref<PerspectiveCamera | null>(null)
const orthoCameraRef = ref<OrthographicCamera | null>(null)
const orbitControlsRef = ref<OrbitControls | null>(null)
const meshRef = ref<any>(null)

const velocityUniforms = markRaw(UniformsUtils.clone(VelocityShader.uniforms))

const velocityShader = {
  vertexShader: VelocityShader.vertexShader,
  fragmentShader: VelocityShader.fragmentShader
}

const params = reactive({
  material: 'normal',
  camera: 'perspective',
  side: 'double'
})

const sides = {
  front: FrontSide,
  back: BackSide,
  double: DoubleSide
}

onMounted(() => {
  const textureLoader = new TextureLoader()
  const displacementMap = textureLoader.load('/models/obj/ninja/displacement.jpg')

  velocityUniforms.displacementMap.value = displacementMap
  velocityUniforms.displacementScale.value = SCALE
  velocityUniforms.displacementBias.value = BIAS
  velocityUniforms.currentProjectionViewMatrix.value = new Matrix4()
  velocityUniforms.previousProjectionViewMatrix.value = new Matrix4()
  velocityUniforms.modelMatrixPrev.value = new Matrix4()

  const { gui } = useGui()
  gui
    .add(params, 'material', [
      'standard',
      'normal',
      'velocity',
      'depthBasic',
      'depthRGBA',
      'depthRGB',
      'depthRG'
    ])
    .name('Material')
    .onChange((value: string) => {
      currentMaterial.value = value
    })

  gui
    .add(params, 'camera', ['perspective', 'ortho'])
    .name('Camera')
    .onChange((value: string) => {
      cameraType.value = value
    })

  gui
    .add(params, 'side', ['front', 'back', 'double'])
    .name('Side')
    .onChange((value: string) => {
      currentSide.value = sides[value as keyof typeof sides]
    })
})

const onAnimate = () => {
  const camera =
    cameraType.value === 'perspective' ? perspectiveCameraRef.value : orthoCameraRef.value

  if (camera && currentMaterial.value === 'velocity') {
    velocityUniforms.previousProjectionViewMatrix.value.copy(
      velocityUniforms.currentProjectionViewMatrix.value
    )

    const projectionMatrix = camera.projectionMatrix
    const matrixWorldInverse = camera.matrixWorldInverse
    const tempMatrix = new Matrix4()
    velocityUniforms.currentProjectionViewMatrix.value = tempMatrix.multiplyMatrices(
      projectionMatrix,
      matrixWorldInverse
    )

    if (meshRef.value?.mesh?.userData?.matrixWorldPrevious) {
      velocityUniforms.modelMatrixPrev.value.copy(meshRef.value.mesh.userData.matrixWorldPrevious)
    }
  }

  if (meshRef.value?.mesh) {
    if (!meshRef.value.mesh.userData.matrixWorldPrevious) {
      meshRef.value.mesh.userData.matrixWorldPrevious = new Matrix4()
    }
    meshRef.value.mesh.userData.matrixWorldPrevious.copy(meshRef.value.mesh.matrixWorld)
  }
}
</script>
