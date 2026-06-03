<template>
  <TCanvas
    antialias
    :shadow-map-enabled="true"
    shadow-map-type="PCFSoftShadowMap"
    background="#060708"
  >
    <TScene>
      <TPerspectiveCamera :position="[0, 0, 12]" :fov="27" :near="0.1" :far="100" />
      <TOrbitControls
        :enable-damping="true"
        :min-distance="8"
        :max-distance="50"
        :enable-pan="false"
      />

      <THemisphereLight color="#8d7c7c" ground-color="#494966" :intensity="3" />
      <TSpotLight
        color="#ffffde"
        :intensity="200"
        :position="[3.5, 0, 7]"
        :cast-shadow="true"
        :shadow-map-size="[2048, 2048]"
        :shadow-camera-near="2"
        :shadow-camera-far="15"
        :shadow-camera-fov="40"
        :shadow-bias="-0.005"
      />

      <TMesh ref="meshRef" :cast-shadow="true" :receive-shadow="true" :position="[0, -0.5, 0]">
        <TGLTFLoader ref="gltfLoaderRef" :src="modelUrl" />
        <TMeshPhongMaterial
          :color="0x9c6e49"
          :specular="0x666666"
          :shininess="25"
          :bump-scale="params.bumpScale"
        >
          <TTexture
            v-if="params.enableBumpMap"
            map-type="bumpMap"
            url="/models/gltf/LeePerrySmith/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg"
          />
        </TMeshPhongMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  useGui,
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  THemisphereLight,
  TSpotLight,
  TMesh,
  TMeshPhongMaterial,
  TTexture,
  TGLTFLoader
} from '@vue-three/vue-three'

const modelUrl = '/models/gltf/LeePerrySmith/LeePerrySmith.glb'

const params = reactive({
  enableBumpMap: true,
  bumpScale: 10
})

const { gui } = useGui()

onMounted(() => {
  gui.add(params, 'enableBumpMap').name('enable bump map')
  gui.add(params, 'bumpScale', 0, 40).name('bump scale')
  // gui.open()
})
</script>
