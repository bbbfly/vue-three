<template>
  <TCanvas ref="canvasRef" antialias>
    <TScene>
      <TPerspectiveCamera :fov="50" :near="1" :far="10000" :position="[0, 0, 500]" />
      <TOrbitControls :min-polar-angle="Math.PI / 4" :max-polar-angle="Math.PI / 1.5" />

      <TMesh :position="[-100, 0, 0]">
        <TSphere :args="[100, 128, 128]" />
        <TMeshBasicMaterial :color="0xffffff">
          <TCubeTexture :urls="urls" @load="loadCubeTexture" />
        </TMeshBasicMaterial>
      </TMesh>

      <TMesh :position="[100, 0, 0]">
        <TSphere :args="[100, 128, 128]" />
        <TMeshBasicMaterial :color="0xffffff">
          <TCubeTexture :urls="urls" />
        </TMeshBasicMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, toRaw } from 'vue'
import * as THREE from 'three'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TSphere,
  TMeshBasicMaterial,
  TCubeTexture
} from '@vue-three/vue-three'

const canvasRef = shallowRef<typeof TCanvas>()

const urls = [
  '/textures/cube/Park3Med/px.jpg',
  '/textures/cube/Park3Med/nx.jpg',
  '/textures/cube/Park3Med/py.jpg',
  '/textures/cube/Park3Med/ny.jpg',
  '/textures/cube/Park3Med/pz.jpg',
  '/textures/cube/Park3Med/nz.jpg'
]

const CubemapFilterShader = {
  name: 'CubemapFilterShader',

  uniforms: {
    cubeTexture: { value: null as THREE.CubeTexture | null },
    mipIndex: { value: 0 }
  },

  vertexShader: /* glsl */ `
    varying vec3 vWorldDirection;

    #include <common>

    void main() {
      vWorldDirection = transformDirection(position, modelMatrix);
      #include <begin_vertex>
      #include <project_vertex>
      gl_Position.z = gl_Position.w;
    }
    `,

  fragmentShader: /* glsl */ `
    uniform samplerCube cubeTexture;
    varying vec3 vWorldDirection;

    uniform float mipIndex;

    #include <common>

    void main() {
      vec3 cubeCoordinates = normalize(vWorldDirection);

      vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
      if (mipIndex == 0.0) color.rgb = vec3(1.0, 1.0, 1.0);
      else if (mipIndex == 1.0) color.rgb = vec3(0.0, 0.0, 1.0);
      else if (mipIndex == 2.0) color.rgb = vec3(0.0, 1.0, 1.0);
      else if (mipIndex == 3.0) color.rgb = vec3(0.0, 1.0, 0.0);
      else if (mipIndex == 4.0) color.rgb = vec3(1.0, 1.0, 0.0);

      gl_FragColor = textureCube(cubeTexture, cubeCoordinates, 0.0) * color;
    }
    `
}

function loadCubeTexture(texture) {
  const renderer = toRaw(canvasRef.value?.context.renderer)
  if (renderer) {
    renderToCubeTexture(renderer, texture)
  }
}

function allocateCubemapRenderTarget(cubeMapSize: number): THREE.WebGLCubeRenderTarget {
  const params = {
    magFilter: THREE.LinearFilter,
    minFilter: THREE.LinearMipMapLinearFilter,
    generateMipmaps: false,
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    colorSpace: THREE.LinearSRGBColorSpace,
    depthBuffer: false
  }

  const rt = new THREE.WebGLCubeRenderTarget(cubeMapSize, params)

  const mipLevels = Math.log(cubeMapSize) * Math.LOG2E + 1.0
  for (let i = 0; i < mipLevels; i++) {
    rt.texture.mipmaps.push({})
  }

  rt.texture.mapping = THREE.CubeReflectionMapping
  return rt
}
const cubeMapRenderTarget = allocateCubemapRenderTarget(512)

function renderToCubeTexture(renderer, sourceCubeTexture) {
  const geometry = new THREE.BoxGeometry(5, 5, 5)

  const material = new THREE.ShaderMaterial({
    name: CubemapFilterShader.name,
    uniforms: THREE.UniformsUtils.clone(CubemapFilterShader.uniforms),
    vertexShader: CubemapFilterShader.vertexShader,
    fragmentShader: CubemapFilterShader.fragmentShader,
    side: THREE.BackSide,
    blending: THREE.NoBlending
  })

  material.uniforms.cubeTexture.value = sourceCubeTexture

  const mesh = new THREE.Mesh(geometry, material)
  const cubeCamera = new THREE.CubeCamera(1, 10, cubeMapRenderTarget)
  const mipmapCount = Math.floor(
    Math.log2(Math.max(cubeMapRenderTarget.width, cubeMapRenderTarget.height))
  )
  console.log(mipmapCount)
  for (let mipmap = 0; mipmap < mipmapCount; mipmap++) {
    material.uniforms.mipIndex.value = mipmap
    material.needsUpdate = true

    cubeMapRenderTarget.viewport.set(
      0,
      0,
      cubeMapRenderTarget.width >> mipmap,
      cubeMapRenderTarget.height >> mipmap
    )

    cubeCamera.activeMipmapLevel = mipmap
    cubeCamera.update(renderer, mesh)
  }

  mesh.geometry.dispose()
  mesh.material.dispose()
}

onMounted(async () => {})
</script>
