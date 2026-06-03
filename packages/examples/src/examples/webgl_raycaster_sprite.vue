<template>
  <TCanvas ref="canvasRef" antialias>
    <TScene background="#ffffff">
      <TPerspectiveCamera :position="[15, 15, 15]" :fov="50" :near="1" :far="1000" />
      <TOrbitControls :min-distance="15" :max-distance="250" />

      <TGroup ref="groupRef">
        <!-- Sprite 1 -->
        <TSprite ref="sprite1Ref" :position="[6, 5, 5]" :scale="[2, 5, 1]" color="#69f" />

        <!-- Sprite 2 -->
        <TSprite
          ref="sprite2Ref"
          :position="[8, -2, 2]"
          :scale="[0.1, 0.5, 0.1]"
          :center="[0.5, 0]"
          color="#69f"
          :size-attenuation="false"
          :rotation="(Math.PI / 3) * 4"
        />

        <!-- Group 2 -->
        <TGroup :position="[-5, 0, 0]" :scale="[1, 2, 1]" :rotation="[Math.PI / 2, 0, 0]">
          <!-- Sprite 3 -->
          <TSprite
            ref="sprite3Ref"
            :position="[0, 2, 5]"
            :scale="[10, 2, 3]"
            :center="[-0.1, 0]"
            color="#69f"
            :rotation="Math.PI / 3"
          />
        </TGroup>
      </TGroup>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TGroup,
  TSprite,
  useRaycaster
} from '@vue-three/vue-three'
import type { Sprite, Intersection } from 'three'

const canvasRef = ref()
const groupRef = ref()

let selectedObject: Sprite | null = null

const onRaycasterResult = (result: { intersects: Intersection[] }) => {
  if (selectedObject) {
    selectedObject.material.color.set('#69f')
    selectedObject = null
  }

  if (result.intersects.length > 0) {
    const res = result.intersects.filter(res => res && res.object)[0]
    if (res && res.object) {
      selectedObject = res.object as Sprite
      selectedObject.material.color.set('#f00')
    }
  }
}

const { intersectObject } = useRaycaster(canvasRef)
onMounted(() => {
  intersectObject(groupRef.value.group, onRaycasterResult)
})
</script>

<style scoped></style>
