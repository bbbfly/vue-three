<template>
  <TCanvas ref="canvasRef" antialias :stencil="true" :localClippingEnabled="true" :shadowMap="{ enabled: true }"
    :clearColor="0x263238" @animate="onAnimate">
    <TScene>
      <TPerspectiveCamera :position="[2, 2, 2]" :fov="36" :near="1" :far="100" />

      <TAmbientLight :intensity="1.5" />

      <TDirectionalLight :position="[5, 10, 7.5]" :intensity="3" :castShadow="true" :shadow-mapSize="[1024, 1024]"
        :shadow-camera-right="2" :shadow-camera-left="-2" :shadow-camera-top="2" :shadow-camera-bottom="-2" />



      <TGroup ref="objectGroup">
        <TMesh ref="clippedColorFront" :castShadow="true" :renderOrder="6">
          <TTorusKnotGeometry :args="[0.4, 0.15, 220, 60]" />
          <TMeshStandardMaterial :color="0xFFC107" :metalness="0.1" :roughness="0.75" :clippingPlanes="planes"
            :clipShadows="true" :shadowSide="THREE.DoubleSide" />
        </TMesh>
        <template v-for="(poGroup, index) in planeObjectGroups" :key="index">
          <TGroup>
            <TMesh v-for="(stencilMesh, stencilIndex) in poGroup.stencilMeshes" :key="stencilIndex"
              :renderOrder="index + 1">
              <TTorusKnotGeometry :args="[0.4, 0.15, 220, 60]" />
              <TMeshBasicMaterial :side="stencilMesh.side" :depthWrite="false" :depthTest="false" :colorWrite="false"
                :stencilWrite="true" :stencilFunc="THREE.AlwaysStencilFunc" :stencilFail="stencilMesh.stencilFail"
                :stencilZFail="stencilMesh.stencilZFail" :stencilZPass="stencilMesh.stencilZPass"
                :clippingPlanes="[planes[index]]" />
            </TMesh>
          </TGroup>
        </template>
      </TGroup>

      <TGroup>
        <TMesh v-for="(_, index) in planeObjectGroups" :key="index" :ref="el => setPlaneObjectRef(index, el)"
          :renderOrder="index + 1.1">
          <TPlane :args="[4, 4]" />
          <TMeshStandardMaterial :color="0xE91E63" :metalness="0.1" :roughness="0.75"
            :clippingPlanes="planes.filter((_, i) => i !== index)" :stencilWrite="true" :stencilRef="0"
            :stencilFunc="THREE.NotEqualStencilFunc" :stencilFail="THREE.ReplaceStencilOp"
            :stencilZFail="THREE.ReplaceStencilOp" :stencilZPass="THREE.ReplaceStencilOp" />
        </TMesh>
      </TGroup>

      <TPlaneHelper v-for="(helper, index) in planeHelpers" :key="index" :plane="planes[index]" :size="2"
        :visible="planeHelpersVisible[index]" />

      <TMesh :rotation="[-Math.PI / 2, 0, 0]" :position="[0, -1, 0]" :receiveShadow="true">
        <TPlane :args="[9, 9, 1, 1]" />
        <TShadowMaterial :color="0x000000" :opacity="0.25" :side="THREE.DoubleSide" />
      </TMesh>
    </TScene>

    <TOrbitControls :minDistance="2" :maxDistance="20" />
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TAmbientLight,
  TDirectionalLight,
  TGroup,
  TMesh,
  TTorusKnotGeometry,
  TMeshStandardMaterial,
  TMeshBasicMaterial,
  TPlane,
  TPlaneHelper,
  TShadowMaterial,
  TOrbitControls
} from '@vue-three/vue-three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import Stats from 'three/addons/libs/stats.module.js'

const objectGroup = ref()
const planeObjectRefs = ref<THREE.Mesh[]>([])

const setPlaneObjectRef = (index: number, el: any) => {
  if (el) {
    planeObjectRefs.value[index] = el.mesh
    el.mesh.onAfterRender = (renderer) => {
      renderer.clearStencil()
    }
  }
}

const planes = ref([
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
])

const planeHelpersVisible = ref([false, false, false])

const planeObjectGroups = reactive([
  {
    stencilMeshes: [
      {
        side: THREE.BackSide,
        stencilFail: THREE.IncrementWrapStencilOp,
        stencilZFail: THREE.IncrementWrapStencilOp,
        stencilZPass: THREE.IncrementWrapStencilOp
      },
      {
        side: THREE.FrontSide,
        stencilFail: THREE.DecrementWrapStencilOp,
        stencilZFail: THREE.DecrementWrapStencilOp,
        stencilZPass: THREE.DecrementWrapStencilOp
      }
    ]
  },
  {
    stencilMeshes: [
      {
        side: THREE.BackSide,
        stencilFail: THREE.IncrementWrapStencilOp,
        stencilZFail: THREE.IncrementWrapStencilOp,
        stencilZPass: THREE.IncrementWrapStencilOp
      },
      {
        side: THREE.FrontSide,
        stencilFail: THREE.DecrementWrapStencilOp,
        stencilZFail: THREE.DecrementWrapStencilOp,
        stencilZPass: THREE.DecrementWrapStencilOp
      }
    ]
  },
  {
    stencilMeshes: [
      {
        side: THREE.BackSide,
        stencilFail: THREE.IncrementWrapStencilOp,
        stencilZFail: THREE.IncrementWrapStencilOp,
        stencilZPass: THREE.IncrementWrapStencilOp
      },
      {
        side: THREE.FrontSide,
        stencilFail: THREE.DecrementWrapStencilOp,
        stencilZFail: THREE.DecrementWrapStencilOp,
        stencilZPass: THREE.DecrementWrapStencilOp
      }
    ]
  }
])

const planeHelpers = ref([
  new THREE.PlaneHelper(planes.value[0], 2, 0xffffff),
  new THREE.PlaneHelper(planes.value[1], 2, 0xffffff),
  new THREE.PlaneHelper(planes.value[2], 2, 0xffffff)
])

const params = reactive({
  animate: true,
  planeX: {
    constant: 0,
    negated: false,
    displayHelper: false
  },
  planeY: {
    constant: 0,
    negated: false,
    displayHelper: false
  },
  planeZ: {
    constant: 0,
    negated: false,
    displayHelper: false
  }
})

let gui: GUI | null = null
let stats: Stats | null = null

const onAnimate = ({ delta }: { delta: number }) => {
  if (params.animate && objectGroup.value) {
    objectGroup.value.group.rotation.x += delta * 0.5
    objectGroup.value.group.rotation.y += delta * 0.2
  }

  for (let i = 0; i < planeObjectRefs.value.length; i++) {
    const plane = planes.value[i]
    const po = planeObjectRefs.value[i]
    if (po) {
      plane.coplanarPoint(po.position)
      po.lookAt(
        po.position.x - plane.normal.x,
        po.position.y - plane.normal.y,
        po.position.z - plane.normal.z
      )
    }
  }

  if (stats) {
    stats.update()
  }
}

onMounted(() => {
  stats = new Stats()
  document.body.appendChild(stats.dom)

  gui = new GUI()
  gui.add(params, 'animate')

  const planeX = gui.addFolder('planeX')
  planeX.add(params.planeX, 'displayHelper').onChange((v: boolean) => {
    planeHelpersVisible.value[0] = v
  })
  planeX.add(params.planeX, 'constant').min(-1).max(1).onChange((d: number) => {
    planes.value[0].constant = d
  })
  planeX.add(params.planeX, 'negated').onChange(() => {
    planes.value[0].negate()
    params.planeX.constant = planes.value[0].constant
  })
  planeX.open()

  const planeY = gui.addFolder('planeY')
  planeY.add(params.planeY, 'displayHelper').onChange((v: boolean) => {
    planeHelpersVisible.value[1] = v
  })
  planeY.add(params.planeY, 'constant').min(-1).max(1).onChange((d: number) => {
    planes.value[1].constant = d
  })
  planeY.add(params.planeY, 'negated').onChange(() => {
    planes.value[1].negate()
    params.planeY.constant = planes.value[1].constant
  })
  planeY.open()

  const planeZ = gui.addFolder('planeZ')
  planeZ.add(params.planeZ, 'displayHelper').onChange((v: boolean) => {
    planeHelpersVisible.value[2] = v
  })
  planeZ.add(params.planeZ, 'constant').min(-1).max(1).onChange((d: number) => {
    planes.value[2].constant = d
  })
  planeZ.add(params.planeZ, 'negated').onChange(() => {
    planes.value[2].negate()
    params.planeZ.constant = planes.value[2].constant
  })
  planeZ.open()
})

onUnmounted(() => {
  if (gui) {
    gui.destroy()
  }
  if (stats) {
    document.body.removeChild(stats.dom)
  }
})
</script>

<style scoped></style>