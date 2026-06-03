<template>
  <TCanvas antialias background="#1a1a1a">
    <TScene ref="sceneRef">
      <TPerspectiveCamera :position="[-10, 0, 23]" :fov="40" :near="1" :far="1000" />
      <TOrbitControls :min-distance="10" :max-distance="50" :enable-pan="false" />

      <TAmbientLight color="#ffffff" :intensity="0.6" />
      <TPointLight color="#ffffff" :intensity="4.5" :decay="0" />

      <TGLTFLoader :src="modelUrl" @load="onModelLoad" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TPointLight,
  TMesh,
  TGLTFLoader,
  TMeshStandardMaterial
} from '@vue-three/vue-three'
import { ObjectSpaceNormalMap, Box3 } from 'three'

const modelUrl = '/models/gltf/Nefertiti/Nefertiti.glb'
const sceneRef = ref()

const onModelLoad = (model: any) => {
  model.children.forEach((child: any) => {
    if (child.isMesh) {
      child.material.normalMapType = ObjectSpaceNormalMap
      child.geometry.deleteAttribute('normal')
      child.material.side = 2
      child.scale.multiplyScalar(0.5)
      new Box3().setFromObject(child).getCenter(child.position).multiplyScalar(-1)
    }
  })
}
</script>
