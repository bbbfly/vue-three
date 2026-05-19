<template>
  <TCanvas antialias @animate="onAnimate">
    <TScene background="#000000">
      <TPerspectiveCamera :fov="45" :near="1" :far="4000" :position="[0, 0, 1750]" />

      <TGroup ref="groupRef">
        <TBoxHelper :object="boundingBox" :color="0x474747" />

        <TPoints ref="pointCloudRef" :visible="showDots">
          <TBufferGeometry :attributes="attributes"></TBufferGeometry>
          <TPointsMaterial :color="0xFFFFFF" :size="3" :blending="THREE.AdditiveBlending" :transparent="true"
            :sizeAttenuation="false" />
        </TPoints>

        <TLineSegments ref="lineMeshRef">
          <TBufferGeometry :attributes="lineAttributes" />
          <TLineBasicMaterial :vertexColors="true" :blending="THREE.AdditiveBlending" :transparent="true" />
        </TLineSegments>
      </TGroup>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { TLineSegments, TLineBasicMaterial, TCanvas, TScene, TPerspectiveCamera, TGroup, TPoints, TBufferGeometry, TPointsMaterial, TBoxHelper } from '@vue-three/vue-three';

interface ParticleData {
  velocity: THREE.Vector3;
  numConnections: number;
}

const maxParticleCount = 500;
let particleCount = 300;
const r = 800;
const rHalf = r / 2;

const groupRef = ref<any>(null);
const pointCloudRef = ref<any>(null);
const lineMeshRef = ref<any>(null);

const showDots = ref(true);
const minDistance = ref(150);
const limitConnections = ref(false);
const maxConnections = ref(20);

const particlesData: ParticleData[] = [];
const particlePositions = new Float32Array(maxParticleCount * 3);
const positions = new Float32Array(maxParticleCount * maxParticleCount * 3);
const colors = new Float32Array(maxParticleCount * maxParticleCount * 3);

const attributes = ref({
  position: {
    array: particlePositions,
    itemSize: 3
  }
});

const lineAttributes = ref({
  position: {
    array: positions,
    itemSize: 3
  },
  color: {
    array: colors,
    itemSize: 3
  }
});

const boundingBox = new THREE.Mesh(new THREE.BoxGeometry(r, r, r));

initGeometry();

function initGeometry() {
  for (let i = 0; i < maxParticleCount; i++) {
    const x = Math.random() * r - r / 2;
    const y = Math.random() * r - r / 2;
    const z = Math.random() * r - r / 2;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particlesData.push({
      velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
      numConnections: 0
    });
  }
}

function onAnimate() {
  let vertexpos = 0;
  let colorpos = 0;
  let numConnected = 0;

  for (let i = 0; i < particleCount; i++) {
    particlesData[i].numConnections = 0;
  }

  for (let i = 0; i < particleCount; i++) {
    const particleData = particlesData[i];

    particlePositions[i * 3] += particleData.velocity.x;
    particlePositions[i * 3 + 1] += particleData.velocity.y;
    particlePositions[i * 3 + 2] += particleData.velocity.z;

    if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf) {
      particleData.velocity.y = -particleData.velocity.y;
    }

    if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf) {
      particleData.velocity.x = -particleData.velocity.x;
    }

    if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf) {
      particleData.velocity.z = -particleData.velocity.z;
    }

    if (limitConnections.value && particleData.numConnections >= maxConnections.value) {
      continue;
    }

    for (let j = i + 1; j < particleCount; j++) {
      const particleDataB = particlesData[j];

      if (limitConnections.value && particleDataB.numConnections >= maxConnections.value) {
        continue;
      }

      const dx = particlePositions[i * 3] - particlePositions[j * 3];
      const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
      const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < minDistance.value) {
        particleData.numConnections++;
        particleDataB.numConnections++;

        const alpha = 1.0 - dist / minDistance.value;

        positions[vertexpos++] = particlePositions[i * 3];
        positions[vertexpos++] = particlePositions[i * 3 + 1];
        positions[vertexpos++] = particlePositions[i * 3 + 2];

        positions[vertexpos++] = particlePositions[j * 3];
        positions[vertexpos++] = particlePositions[j * 3 + 1];
        positions[vertexpos++] = particlePositions[j * 3 + 2];

        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;

        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;

        numConnected++;
      }
    }
  }

  if (pointCloudRef.value?.mesh) {
    const geometry = pointCloudRef.value.mesh.geometry;
    const positionAttr = geometry.attributes.position;
    if (positionAttr) {
      positionAttr.needsUpdate = true;
    }
  }

  if (lineMeshRef.value?.lineSegments) {
    const geometry = lineMeshRef.value.lineSegments.geometry;
    geometry.setDrawRange(0, numConnected * 2);

    const positionAttr = geometry.attributes.position;
    const colorAttr = geometry.attributes.color;

    if (positionAttr) {
      positionAttr.needsUpdate = true;
    }
    if (colorAttr) {
      colorAttr.needsUpdate = true;
    }
  }

  const time = Date.now() * 0.001;
  if (groupRef.value?.group) {
    groupRef.value.group.rotation.y = time * 0.1;
  }
}
</script>

<style scoped></style>