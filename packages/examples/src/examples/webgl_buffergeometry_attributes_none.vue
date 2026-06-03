<template>
  <TCanvas antialias @animate="onAnimate">
    <TPerspectiveCamera :fov="27" :near="1" :far="3500" :position="[0, 0, 4]" />
    <TScene background="#050505">
      <TMesh ref="meshRef" :frustum-culled="false">
        <TBufferGeometry :draw-range="[0, vertexCount]" />
        <TShaderMaterial
          shader-type="rawShader"
          :uniforms="uniforms"
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :side="THREE.DoubleSide"
          :glsl-version="THREE.GLSL3"
        />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const triangleCount = 10000
const vertexCountPerTriangle = 3
const vertexCount = triangleCount * vertexCountPerTriangle

const uniforms = {
  seed: { value: 42 }
}

const vertexShader = `
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float seed;

const uint ieeeMantissa = 0x007FFFFFu;
const uint ieeeOne = 0x3F800000u;

uint hash(uint x) {
  x += ( x << 10u );
  x ^= ( x >>  6u );
  x += ( x <<  3u );
  x ^= ( x >> 11u );
  x += ( x << 15u );
  return x;
}

uint hash(uvec2 v) { return hash( v.x ^ hash(v.y) ); }

float hashNoise(vec2 xy) {
  uint m = hash(floatBitsToUint(xy));

  m &= ieeeMantissa;
  m |= ieeeOne;

  return uintBitsToFloat( m ) - 1.0;
}

float pseudoRandom(float lower, float delta, in vec2 xy) {
  return lower + delta*hashNoise(xy);
}

vec3 pseudoRandomVec3(float lower, float upper, int index) {
  float delta = upper - lower;
  float x = pseudoRandom(lower, delta, vec2(index, 0));
  float y = pseudoRandom(lower, delta, vec2(index, 1));
  float z = pseudoRandom(lower, delta, vec2(index, 2));
  return vec3(x, y, z);
}

out vec3 vColor;

void main()	{

  const float scale = 1.0/64.0;
  vec3 position = pseudoRandomVec3(-1.0, +1.0, gl_VertexID/3) + scale * pseudoRandomVec3(-1.0, +1.0, gl_VertexID);
  vec3 color = pseudoRandomVec3(0.25, 1.0, gl_VertexID/3);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
  vColor = color;

}
`

const fragmentShader = `
precision mediump float;

in vec3 vColor;

out vec4 fColor;

void main()	{

  fColor = vec4(vColor, 1);

}
`

function onAnimate({ delta }) {
  if (meshRef.value?.mesh) {
    meshRef.value.mesh.rotation.x += delta * 0.25
    meshRef.value.mesh.rotation.y += delta * 0.5
  }
}
</script>

<style scoped></style>
