<template>
  <TCanvas ref="canvasRef" antialias @animate="onAnimate">
    <TScene background="#050505" :fog="{ type: 'Fog', args: [0x050505, 2000, 3500] }">
      <TPerspectiveCamera :fov="27" :near="5" :far="3500" :position="[0, 0, 2750]" />

      <TPoints ref="pointsRef">
        <TBufferGeometry ref="geometryRef" :drawRange="drawRange"></TBufferGeometry>
        <TPointsMaterial :size="15" :vertexColors="true" />
      </TPoints>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { TCanvas, TScene, TPerspectiveCamera, TPoints, TBufferGeometry, TPointsMaterial } from '@vue-three/vue-three';

const particles = 300000;
let drawCount = 10000;
let posAttr1: THREE.GLBufferAttribute | null = null;
let posAttr2: THREE.GLBufferAttribute | null = null;
let switchInterval: ReturnType<typeof setInterval> | null = null;

const canvasRef = ref<any>(null);
const pointsRef = ref<any>(null);
const geometryRef = ref<any>(null);
const drawRange = ref<[number, number]>([0, drawCount]);

function onCanvasCreated(context: any) {
  const { renderer } = context;
  const gl = renderer.getContext();

  const positions: number[] = [];
  const positions2: number[] = [];
  const colors: number[] = [];

  const color = new THREE.Color();
  const n = 1000;
  const n2 = n / 2;

  for (let i = 0; i < particles; i++) {
    const x = Math.random() * n - n2;
    const y = Math.random() * n - n2;
    const z = Math.random() * n - n2;

    positions.push(x, y, z);
    positions2.push(z * 0.3, x * 0.3, y * 0.3);

    const vx = (x / n) + 0.5;
    const vy = (y / n) + 0.5;
    const vz = (z / n) + 0.5;

    color.setRGB(vx, vy, vz, THREE.SRGBColorSpace);
    const hex = color.getHex(THREE.LinearSRGBColorSpace);
    colors.push(hex >> 16 & 255, hex >> 8 & 255, hex & 255);
  }

  // Create raw WebGL buffers
  const posBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const posBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);

  const rgbBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rgbBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);

  // Create GLBufferAttribute
  posAttr1 = new THREE.GLBufferAttribute(posBuffer1, gl.FLOAT, 3, 4, particles);
  posAttr2 = new THREE.GLBufferAttribute(posBuffer2, gl.FLOAT, 3, 4, particles);

  const rgbAttr = new THREE.GLBufferAttribute(rgbBuffer, gl.UNSIGNED_BYTE, 3, 1, particles, true);

  // Set attributes on geometry after geometry is created
  if (geometryRef.value?.geometry) {
    geometryRef.value.geometry.setAttribute('position', posAttr1);
    geometryRef.value.geometry.setAttribute('color', rgbAttr);
    geometryRef.value.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 500);
    geometryRef.value.geometry.needsUpdate = true;
  }

  // Switch position attributes every 2 seconds
  switchInterval = setInterval(() => {
    if (!geometryRef.value?.geometry) return;
    const attr = geometryRef.value.geometry.getAttribute('position');
    geometryRef.value.geometry.setAttribute('position', attr === posAttr1 ? posAttr2! : posAttr1!);
  }, 2000);
}

function onAnimate() {
  drawCount = (Math.max(5000, drawCount) + Math.floor(500 * Math.random())) % particles;
  drawRange.value = [0, drawCount];
  const time = Date.now() * 0.001
  if (pointsRef.value?.mesh) {
    pointsRef.value.mesh.rotation.x = time * 0.1;
    pointsRef.value.mesh.rotation.y = time * 0.2;
  }
}

onMounted(() => {
  // Wait for geometry to be created, then set attributes
  const checkGeometry = setInterval(() => {
    if (geometryRef.value?.geometry && posAttr1) {
      clearInterval(checkGeometry);
    }
  }, 10);
  canvasRef.value?.context.ready(onCanvasCreated);
});

onBeforeUnmount(() => {
  if (switchInterval) {
    clearInterval(switchInterval);
  }
});
</script>

<style scoped></style>
