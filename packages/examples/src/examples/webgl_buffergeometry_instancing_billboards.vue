<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#000000">
      <TPerspectiveCamera :fov="50" :near="1" :far="5000" :position="[0, 0, 1400]" />

      <TMesh v-if="geometryAttributes.position" ref="meshRef" :scale="[500, 500, 500]">
        <TInstancedBufferGeometry
          :attributes="geometryAttributes"
          :instance-count="particleCount"
        />
        <TShaderMaterial
          shader-type="rawShader"
          :uniforms="uniforms"
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :depth-test="true"
          :depth-write="true"
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
  TShaderMaterial,
  TInstancedBufferGeometry
} from '@vue-three/vue-three'

const meshRef = ref<any>(null)
const particleCount = 75000
const geometryAttributes = ref<
  Record<string, THREE.BufferAttribute | THREE.InstancedBufferAttribute>
>({})

const uniforms = ref({
  map: { value: null as any },
  time: { value: 0.0 }
})

const vertexShader = `
  precision highp float;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;

  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 translate;

  varying vec2 vUv;
  varying float vScale;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );
    vec3 trTime = vec3(translate.x + time,translate.y + time,translate.z + time);
    float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );
    vScale = scale;
    scale = scale * 10.0 + 10.0;
    mvPosition.xyz += position * scale;
    vUv = uv;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  precision highp float;

  uniform sampler2D map;

  varying vec2 vUv;
  varying float vScale;

  vec3 HUEtoRGB(float H){
    H = mod(H,1.0);
    float R = abs(H * 6.0 - 3.0) - 1.0;
    float G = 2.0 - abs(H * 6.0 - 2.0);
    float B = 2.0 - abs(H * 6.0 - 4.0);
    return clamp(vec3(R,G,B),0.0,1.0);
  }

  vec3 HSLtoRGB(vec3 HSL){
    vec3 RGB = HUEtoRGB(HSL.x);
    float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
    return (RGB - 0.5) * C + HSL.z;
  }

  void main() {
    vec4 diffuseColor = texture2D( map, vUv );
    gl_FragColor = vec4( diffuseColor.xyz * HSLtoRGB(vec3(vScale/5.0, 1.0, 0.5)), diffuseColor.w );

    if ( diffuseColor.w < 0.5 ) discard;
  }
`

onMounted(() => {
  const circleGeometry = new THREE.CircleGeometry(1, 6)

  const translateArray = new Float32Array(particleCount * 3)

  for (let i = 0, i3 = 0; i < particleCount; i++, i3 += 3) {
    translateArray[i3] = Math.random() * 2 - 1
    translateArray[i3 + 1] = Math.random() * 2 - 1
    translateArray[i3 + 2] = Math.random() * 2 - 1
  }

  geometryAttributes.value = {
    position: circleGeometry.attributes.position,
    uv: circleGeometry.attributes.uv,
    translate: new THREE.InstancedBufferAttribute(translateArray, 3)
  }

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('/textures/sprites/circle.png', texture => {
    uniforms.value.map.value = texture
  })
})

function onAnimate() {
  const time = performance.now() * 0.0005

  uniforms.value.time.value = time

  if (meshRef.value?.mesh) {
    meshRef.value.mesh.rotation.x = time * 0.2
    meshRef.value.mesh.rotation.y = time * 0.4
  }
}
</script>

<style scoped></style>
