<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#050505" :fog="{ color: '#050505', near: 2000, far: 3500 }">
      <TPerspectiveCamera :fov="27" :near="1" :far="3500" :position="[0, 0, 2500]" />

      <TMesh v-if="geometryAttributes.position" ref="meshRef">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TShaderMaterial
          :uniforms="shaderUniforms"
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :side="2"
          :glsl-version="THREE.GLSL3"
        />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TMesh,
  TBufferGeometry,
  TShaderMaterial
} from '@vue-three/vue-three'

const meshRef = ref<any>(null)
const geometryAttributes = ref<Record<string, THREE.BufferAttribute>>({})
const shaderUniforms = shallowRef<Record<string, THREE.IUniform<any>>>({})

const vertexShader = `
  in int textureIndex;

  flat out int vIndex;
  out vec2 vUv;

  void main() {
    vIndex = textureIndex;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  flat in int vIndex;
  in vec2 vUv;

  uniform sampler2D uTextures[3];

  out vec4 outColor;

  void main() {
    if (vIndex == 0) outColor = texture(uTextures[0], vUv);
    else if (vIndex == 1) outColor = texture(uTextures[1], vUv);
    else if (vIndex == 2) outColor = texture(uTextures[2], vUv);
  }
`

onMounted(() => {
  createBufferGeometry()
})

function createBufferGeometry() {
  const triangles = 10000
  const positions: number[] = []
  const uvs: number[] = []
  const textureIndices: number[] = []

  const n = 800
  const n2 = n / 2
  const d = 50
  const d2 = d / 2

  for (let i = 0; i < triangles; i++) {
    const x = Math.random() * n - n2
    const y = Math.random() * n - n2
    const z = Math.random() * n - n2

    const ax = x + Math.random() * d - d2
    const ay = y + Math.random() * d - d2
    const az = z + Math.random() * d - d2

    const bx = x + Math.random() * d - d2
    const by = y + Math.random() * d - d2
    const bz = z + Math.random() * d - d2

    const cx = x + Math.random() * d - d2
    const cy = y + Math.random() * d - d2
    const cz = z + Math.random() * d - d2

    positions.push(ax, ay, az)
    positions.push(bx, by, bz)
    positions.push(cx, cy, cz)

    uvs.push(0, 0)
    uvs.push(0.5, 1)
    uvs.push(1, 0)

    const t = i % 3
    textureIndices.push(t, t, t)
  }

  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3)
  const uvAttribute = new THREE.Float32BufferAttribute(uvs, 2)
  const textureIndexAttribute = new THREE.Int16BufferAttribute(textureIndices, 1)
  textureIndexAttribute.gpuType = THREE.IntType

  geometryAttributes.value = {
    position: positionAttribute,
    uv: uvAttribute,
    textureIndex: textureIndexAttribute
  }

  if (meshRef.value?.mesh) {
    meshRef.value.mesh.geometry.computeBoundingSphere()
  }

  const loader = new THREE.TextureLoader()

  const map1 = loader.load('/textures/crate.gif')
  const map2 = loader.load('/textures/floors/FloorsCheckerboard_S_Diffuse.jpg')
  const map3 = loader.load('/textures/terrain/grasslight-big.jpg')

  shaderUniforms.value = {
    uTextures: {
      value: [map1, map2, map3]
    }
  }
}

function onAnimate() {
  const time = Date.now() * 0.001
  if (meshRef.value?.mesh) {
    meshRef.value.mesh.rotation.x = time * 0.25
    meshRef.value.mesh.rotation.y = time * 0.5
  }
}
</script>

<style scoped></style>
