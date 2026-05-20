<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#000000">
      <TPerspectiveCamera :fov="50" :near="1" :far="10" :position="[0, 0, 2]" />

      <TMesh ref="meshRef" v-if="geometryAttributes.position">
        <TInstancedBufferGeometry :attributes="geometryAttributes" :instanceCount="instances" />
        <TShaderMaterial shaderType="rawShader" :uniforms="uniforms" :vertexShader="vertexShader"
          :fragmentShader="fragmentShader" :side="2" :transparent="true" />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TMesh,
  TShaderMaterial,
  TInstancedBufferGeometry
} from '@vue-three/vue-three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const meshRef = ref<any>(null)
const instances = ref<number>(50000)
const geometryAttributes = ref<Record<string, THREE.BufferAttribute | THREE.InstancedBufferAttribute>>({})

const uniforms = ref({
  time: { value: 1.0 },
  sineTime: { value: 1.0 }
})

const vertexShader = `
  precision highp float;

  uniform float sineTime;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  attribute vec3 position;
  attribute vec3 offset;
  attribute vec4 color;
  attribute vec4 orientationStart;
  attribute vec4 orientationEnd;

  varying vec3 vPosition;
  varying vec4 vColor;

  void main(){

    vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
    vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
    vec3 vcV = cross( orientation.xyz, vPosition );
    vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );

    vColor = color;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

  }
`

const fragmentShader = `
  precision highp float;

  uniform float time;

  varying vec3 vPosition;
  varying vec4 vColor;

  void main() {

    vec4 color = vec4( vColor );
    color.r += sin( vPosition.x * 10.0 + time ) * 0.5;

    gl_FragColor = color;

  }
`
const gui = new GUI()
onMounted(() => {
  createInstancedGeometry()
  gui.add({ instances: instances.value }, 'instances', 0, instances.value).onChange((value: number) => {
    instances.value = value
  })
})
onBeforeUnmount(() => {
  gui.destroy()
})

function createInstancedGeometry() {
  const vector = new THREE.Vector4()

  const positions: number[] = []
  const offsets: number[] = []
  const colors: number[] = []
  const orientationsStart: number[] = []
  const orientationsEnd: number[] = []

  positions.push(0.025, -0.025, 0)
  positions.push(-0.025, 0.025, 0)
  positions.push(0, 0, 0.025)

  for (let i = 0; i < instances.value; i++) {
    offsets.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)

    colors.push(Math.random(), Math.random(), Math.random(), Math.random())

    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    )
    vector.normalize()
    orientationsStart.push(vector.x, vector.y, vector.z, vector.w)

    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    )
    vector.normalize()
    orientationsEnd.push(vector.x, vector.y, vector.z, vector.w)
  }

  geometryAttributes.value = {
    position: new THREE.Float32BufferAttribute(positions, 3),
    offset: new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3),
    color: new THREE.InstancedBufferAttribute(new Float32Array(colors), 4),
    orientationStart: new THREE.InstancedBufferAttribute(new Float32Array(orientationsStart), 4),
    orientationEnd: new THREE.InstancedBufferAttribute(new Float32Array(orientationsEnd), 4)
  }
}

function onAnimate() {
  const time = performance.now()

  if (meshRef.value?.mesh) {
    meshRef.value.mesh.rotation.y = time * 0.0005
    uniforms.value.time.value = time * 0.005
    uniforms.value.sineTime.value = Math.sin(uniforms.value.time.value * 0.05)
  }
}
</script>

<style scoped></style>