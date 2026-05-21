<template>
  <TCanvas antialias @animate="onAnimate">
    <TPerspectiveCamera :fov="50" :near="1" :far="10" :position="[0, 0, 2]" />
    <TScene background="#101010">
      <TMesh v-if="geometryAttributes.position" ref="meshRef">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TShaderMaterial
          shader-type="rawShader"
          :uniforms="uniforms"
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :side="THREE.DoubleSide"
          :transparent="true"
        />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TMesh,
  TBufferGeometry,
  TShaderMaterial
} from '@vue-three/vue-three'

const meshRef = ref<{ mesh: THREE.Mesh } | null>(null)
const geometryAttributes = ref<Record<string, THREE.BufferAttribute>>({})

const uniforms = ref({
  time: { value: 1.0 }
})

const vertexShader = `
precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec4 color;

varying vec3 vPosition;
varying vec4 vColor;

void main()	{

  vPosition = position;
  vColor = color;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`

const fragmentShader = `
precision mediump float;
precision mediump int;

uniform float time;

varying vec3 vPosition;
varying vec4 vColor;

void main()	{

  vec4 color = vec4( vColor );
  color.r += sin( vPosition.x * 10.0 + time ) * 0.5;

  gl_FragColor = color;

}
`

onMounted(() => {
  // geometry - nr of triangles with 3 vertices per triangle
  const vertexCount = 200 * 3

  const positions: number[] = []
  const colors: number[] = []

  for (let i = 0; i < vertexCount; i++) {
    // adding x, y, z
    positions.push(Math.random() - 0.5)
    positions.push(Math.random() - 0.5)
    positions.push(Math.random() - 0.5)

    // adding r, g, b, a
    colors.push(Math.random() * 255)
    colors.push(Math.random() * 255)
    colors.push(Math.random() * 255)
    colors.push(Math.random() * 255)
  }

  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3)
  const colorAttribute = new THREE.Uint8BufferAttribute(colors, 4)
  colorAttribute.normalized = true // this will map the buffer values to 0.0f - +1.0f in the shader

  geometryAttributes.value = {
    position: positionAttribute,
    color: colorAttribute
  }
})

function onAnimate() {
  const time = performance.now()
  if (meshRef.value?.mesh) {
    meshRef.value.mesh.rotation.y = time * 0.0005
    uniforms.value.time.value = time * 0.005
  }
}
</script>

<style scoped></style>
