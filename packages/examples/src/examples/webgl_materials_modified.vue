<template>
  <TCanvas antialias @animate="animate">
    <TScene>
      <TPerspectiveCamera :position="[0, 0, 20]" :fov="27" />
      <TOrbitControls :min-distance="10" :max-distance="50" />

      <TMesh v-for="(twistAmount, index) in twistAmounts" :key="index" :position="positions[index]">
        <TGLTFLoader :src="modelSrc" />
        <TMeshNormalMaterial :ref="el => setMaterialRef(el, index)" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TGLTFLoader,
  TBufferGeometry,
  TMeshNormalMaterial
} from '@vue-three/vue-three'
import * as THREE from 'three'

const modelSrc = '/models/gltf/LeePerrySmith/LeePerrySmith.glb'
const twistAmounts = [2.0, -2.0]
const positions = [
  [-3.5, -0.5, 0],
  [3.5, -0.5, 0]
]

const geometries = ref<(THREE.BufferGeometry | null)[]>([null, null])
const materialRefs = ref<(InstanceType<typeof TMeshNormalMaterial> | null)[]>([null, null])

function setMaterialRef(el: InstanceType<typeof TMeshNormalMaterial> | null, index: number) {
  materialRefs.value[index] = el
  if (el?.material) {
    setupTwistMaterial(el.material, twistAmounts[index])
  }
}

function getGeometry(model: THREE.Object3D, index: number): THREE.BufferGeometry | null {
  if (!geometries.value[index]) {
    const mesh = model.children[0] as THREE.Mesh
    if (mesh && mesh.geometry) {
      geometries.value[index] = index === 0 ? mesh.geometry : mesh.geometry.clone()
    }
  }
  return geometries.value[index]
}

function setupTwistMaterial(material: THREE.MeshNormalMaterial, amount: number) {
  material.onBeforeCompile = function (shader) {
    shader.uniforms.time = { value: 0 }
    shader.vertexShader = 'uniform float time;\n' + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      [
        `float theta = sin( time + position.y ) / ${amount.toFixed(1)};`,
        'float c = cos( theta );',
        'float s = sin( theta );',
        'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
        'vec3 transformed = vec3( position ) * m;',
        'vNormal = vNormal * m;'
      ].join('\n')
    )
    material.userData.shader = shader
  }
  material.customProgramCacheKey = function () {
    return amount.toFixed(1)
  }
}

function animate() {
  const time = performance.now() / 1000
  materialRefs.value.forEach(materialRef => {
    if (materialRef && materialRef.material) {
      const material = materialRef.material as THREE.MeshNormalMaterial
      if (material.userData.shader) {
        material.userData.shader.uniforms.time.value = time
      }
    }
  })
}
</script>

<style scoped></style>
