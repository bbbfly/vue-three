<template>
  <TCanvas antialias :tone-mapping="toneMapping" :tone-mapping-exposure="1.25" @animate="animate">
    <TPerspectiveCamera :fov="27" :near="0.25" :far="50" :position="[0, 0, 10]" />
    <TOrbitControls :min-distance="3" :max-distance="30" />

    <TScene v-if="envMap" :background="envMap" :environment="envMap">
      <TGroup ref="groupRef">
        <!-- car paint -->
        <TMesh :position="[-1, 1, 0]">
          <TSphere :args="[0.8, 64, 32]" />
          <TMeshPhysicalMaterial
            :clearcoat="1.0"
            :clearcoat-roughness="0.1"
            :metalness="0.9"
            :roughness="0.5"
            color="#0000ff"
            :normal-map="normalMap3"
            :normal-scale="[0.15, 0.15]"
          />
        </TMesh>

        <!-- fibers -->
        <TMesh :position="[1, 1, 0]">
          <TSphere :args="[0.8, 64, 32]" />
          <TMeshPhysicalMaterial
            :roughness="0.5"
            :clearcoat="1.0"
            :clearcoat-roughness="0.1"
            :map="diffuseMap"
            :normal-map="normalMap"
          />
        </TMesh>

        <!-- golf -->
        <TMesh :position="[-1, -1, 0]">
          <TSphere :args="[0.8, 64, 32]" />
          <TMeshPhysicalMaterial
            :metalness="0.0"
            :roughness="0.1"
            :clearcoat="1.0"
            :clearcoat-normal-scale="[2.0, -2.0]"
          >
            <TTexture map-type="normalMap" url="/textures/golfball.jpg" />
            <TTexture
              map-type="clearcoatNormalMap"
              url="/textures/pbr/Scratched_gold/Scratched_gold_01_1K_Normal.png"
            />
          </TMeshPhysicalMaterial>
        </TMesh>

        <!-- clearcoat + normalmap -->
        <TMesh :position="[1, -1, 0]">
          <TSphere :args="[0.8, 64, 32]" />
          <TMeshPhysicalMaterial
            :clearcoat="1.0"
            :metalness="1.0"
            color="#ff0000"
            :normal-map="normalMap2"
            :normal-scale="[0.15, 0.15]"
            :clearcoat-normal-map="clearcoatNormalMap"
            :clearcoat-normal-scale="[2.0, -2.0]"
          />
        </TMesh>
      </TGroup>

      <!-- particle light -->
      <TMesh :position="lightPosition">
        <TSphere :args="[0.05, 8, 8]" />
        <TMeshBasicMaterial color="#ffffff" />
      </TMesh>
      <TPointLight color="#ffffff" :intensity="30" :position="lightPosition" />
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TPerspectiveCamera,
  TOrbitControls,
  TScene,
  TGroup,
  TMesh,
  TSphere,
  TMeshPhysicalMaterial,
  TMeshBasicMaterial,
  TPointLight,
  TTexture
} from '@vue-three/vue-three'
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js'
import { FlakesTexture } from 'three/addons/textures/FlakesTexture.js'
import { CanvasTexture } from 'three'

const toneMapping = THREE.ACESFilmicToneMapping

const envMap = ref<THREE.CubeTexture | null>(null)
const diffuseMap = ref<THREE.Texture | null>(null)
const normalMap = ref<THREE.Texture | null>(null)
const normalMap2 = ref<THREE.Texture | null>(null)
const normalMap3 = ref<THREE.Texture | null>(null)
const normalMap4 = ref<THREE.Texture | null>(null)
const clearcoatNormalMap = ref<THREE.Texture | null>(null)

const lightPosition = ref([0, 0, 0])
const groupRef = ref()

const textureLoader = new THREE.TextureLoader()

onMounted(() => {
  new HDRCubeTextureLoader()
    .setPath('/textures/cube/pisaHDR/')
    .load(['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'], texture => {
      envMap.value = texture

      diffuseMap.value = textureLoader.load('/textures/carbon/Carbon.png', t => {
        t.colorSpace = THREE.SRGBColorSpace
        t.wrapS = THREE.RepeatWrapping
        t.wrapT = THREE.RepeatWrapping
        t.repeat.set(10, 10)
      })

      normalMap.value = textureLoader.load('/textures/carbon/Carbon_Normal.png', t => {
        t.wrapS = THREE.RepeatWrapping
        t.wrapT = THREE.RepeatWrapping
        t.repeat.set(10, 10)
      })

      normalMap2.value = textureLoader.load('/textures/water/Water_1_M_Normal.jpg')

      const flakes = new FlakesTexture()
      normalMap3.value = new CanvasTexture(flakes)
      normalMap3.value.wrapS = THREE.RepeatWrapping
      normalMap3.value.wrapT = THREE.RepeatWrapping
      normalMap3.value.repeat.x = 10
      normalMap3.value.repeat.y = 6
      normalMap3.value.anisotropy = 16

      normalMap4.value = textureLoader.load('/textures/golfball.jpg')

      clearcoatNormalMap.value = textureLoader.load(
        '/textures/pbr/Scratched_gold/Scratched_gold_01_1K_Normal.png'
      )
    })
})

watch(
  () => lightPosition.value,
  newVal => {
    lightPosition.value = newVal
  },
  { deep: true }
)

function animate() {
  const timer = Date.now() * 0.00025
  lightPosition.value = [Math.sin(timer * 7) * 3, Math.cos(timer * 5) * 4, Math.cos(timer * 3) * 3]
}
</script>
