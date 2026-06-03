<template>
  <TCanvas antialias animation-loop>
    <TScene>
      <TPerspectiveCamera :position="[0, 0, 200]" :fov="40" :near="1" :far="500" />
      <TOrbitControls :enable-pan="false" :enable-zoom="false" />

      <!-- 左侧：基础线框材质 -->
      <TMesh v-if="geometryAttributes.position" :position="[-40, 0, 0]">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TMeshBasicMaterial color="#e0e0ff" :wireframe="true" />
      </TMesh>

      <!-- 右侧：自定义Shader材质 -->
      <TMesh v-if="geometryAttributes.position" :position="[40, 0, 0]">
        <TBufferGeometry :attributes="geometryAttributes" />
        <TShaderMaterial
          :uniforms="shaderUniforms"
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :side="'DoubleSide'"
          :alpha-to-coverage="true"
        />
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrbitControls,
  TMesh,
  TBufferGeometry,
  TMeshBasicMaterial,
  TShaderMaterial
} from '@vue-three/vue-three'
import { BufferGeometryLoader, Vector3, BufferAttribute } from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import type { BufferAttribute as ThreeBufferAttribute } from 'three'
import type { BufferGeometry as ThreeBufferGeometry } from 'three'

/** 自定义Shader顶点着色器 */
const vertexShader = `
  attribute vec3 center;
  varying vec3 vCenter;

  void main() {
    vCenter = center;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

/** 自定义Shader片段着色器 */
const fragmentShader = `
  uniform float thickness;

  varying vec3 vCenter;

  void main() {
    vec3 afwidth = fwidth( vCenter.xyz );
    vec3 edge3 = smoothstep( ( thickness - 1.0 ) * afwidth, thickness * afwidth, vCenter.xyz );
    float edge = 1.0 - min( min( edge3.x, edge3.y ), edge3.z );
    
    gl_FragColor.rgb = gl_FrontFacing ? vec3( 0.9, 0.9, 1.0 ) : vec3( 0.4, 0.4, 0.5 );
    gl_FragColor.a = edge;
  }
`

/** Shader材质uniforms */
const shaderUniforms = ref({
  thickness: { value: 1.0 }
})

/** 几何体属性 */
const geometryAttributes = shallowRef<Record<string, ThreeBufferAttribute>>({})

/** 加载的几何体（用于清理） */
let loadedGeometry: ThreeBufferGeometry | null = null

/** GUI实例 */
let gui: GUI | null = null

/** 设置几何体属性 */
function processGeometry(geometry: ThreeBufferGeometry): void {
  // 删除不需要的属性
  geometry.deleteAttribute('normal')
  geometry.deleteAttribute('uv')

  const vectors = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]

  const position = geometry.attributes.position
  const centers = new Float32Array(position.count * 3)

  for (let i = 0, l = position.count; i < l; i++) {
    vectors[i % 3].toArray(centers, i * 3)
  }

  geometry.setAttribute('center', new BufferAttribute(centers, 3))

  // 保存属性供组件使用
  geometryAttributes.value = {
    position: geometry.attributes.position,
    center: geometry.attributes.center
  }

  // 保存几何体引用用于清理
  loadedGeometry = geometry
}

/** 初始化GUI控制面板 */
function initGUI(): void {
  if (!gui) {
    gui = new GUI()
    gui
      .add(shaderUniforms.value.thickness, 'value', 0, 4)
      .name('Thickness')
      .onChange(() => {
        // uniforms会自动响应式更新
      })
    gui.open()
  }
}

/** 加载模型并初始化场景 */
onMounted(() => {
  const loader = new BufferGeometryLoader()
  loader.load('/models/json/WaltHeadLo_buffergeometry.json', (geometry: ThreeBufferGeometry) => {
    // 处理几何体
    processGeometry(geometry)

    // 初始化GUI
    initGUI()
  })
})

/** 清理资源 */
onBeforeUnmount(() => {
  if (loadedGeometry) {
    loadedGeometry.dispose()
  }
  if (gui) {
    gui.destroy()
    gui = null
  }
})
</script>
