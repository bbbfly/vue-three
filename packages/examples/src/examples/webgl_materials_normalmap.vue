<template>
  <TCanvas antialias background="#494949">
    <TScene>
      <TPerspectiveCamera :position="[0, 0, 12]" :fov="27" :near="0.1" :far="100" />
      <TOrbitControls
        :enable-damping="true"
        :min-distance="8"
        :max-distance="50"
        :enable-pan="false"
      />

      <TAmbientLight color="#ffffff" :intensity="1" />
      <TPointLight color="#ffffff" :intensity="30" :position="[0, 0, 6]" />
      <TDirectionalLight color="#ffffff" :intensity="3" :position="[1, -0.5, -1]" />

      <TMesh :position="[0, -0.5, 0]">
        <TGLTFLoader :src="modelUrl" />
        <TMeshPhongMaterial
          :color="0xefefef"
          :specular="0x222222"
          :shininess="35"
          :normal-scale="normalScale"
        >
          <TTexture map-type="map" url="/models/gltf/LeePerrySmith/Map-COL.jpg" />
          <TTexture map-type="specularMap" url="/models/gltf/LeePerrySmith/Map-SPEC.jpg" />
          <TTexture
            v-if="params.enableNormalMap"
            map-type="normalMap"
            url="/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg"
          />
        </TMeshPhongMaterial>
      </TMesh>
    </TScene>

    <TEffectComposer>
      <TRenderPass />
      <TShaderPass :shader="BleachBypassShader" :uniforms="{ opacity: { value: 0.2 } }" />
      <TShaderPass
        :shader="ColorCorrectionShader"
        :uniforms="{
          powRGB: { value: { x: 1.4, y: 1.45, z: 1.45 } },
          mulRGB: { value: { x: 1.1, y: 1.1, z: 1.1 } }
        }"
      />
      <TOutputPass />
      <TFXAAPass />
    </TEffectComposer>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, shallowRef, computed } from 'vue'
import {
  useGui,
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TAmbientLight,
  TPointLight,
  TDirectionalLight,
  TMesh,
  TMeshPhongMaterial,
  TTexture,
  TGLTFLoader,
  TEffectComposer,
  TRenderPass,
  TOutputPass,
  TShaderPass,
  TFXAAPass
} from '@vue-three/vue-three'
import { BleachBypassShader } from 'three/addons/shaders/BleachBypassShader.js'
import { ColorCorrectionShader } from 'three/addons/shaders/ColorCorrectionShader.js'
import { ShaderMaterial } from 'three'

const modelUrl = '/models/gltf/LeePerrySmith/LeePerrySmith.glb'

const params = reactive({
  enableNormalMap: true,
  normalScale: 1
})

const normalScaleValue = shallowRef({ x: params.normalScale, y: params.normalScale })
const normalScale = computed(() => [normalScaleValue.value.x, normalScaleValue.value.y])

const { gui } = useGui()

onMounted(() => {
  gui.add(params, 'enableNormalMap').name('enable normal map')
  gui
    .add(params, 'normalScale', 0, 2)
    .name('normal scale')
    .onChange((value: number) => {
      normalScaleValue.value = { x: value, y: value }
    })
})
</script>
