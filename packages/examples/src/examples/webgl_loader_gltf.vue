<template>
  <TCanvas ref="canvasRef" antialias :animation-loop="animationLoop" tone-mapping="ACESFilmicToneMapping">
    <TScene ref="sceneRef">
      <TPerspectiveCamera :fov="45" :near="0.25" :far="20" :position="[-1.8, 0.6, 2.7]" />

      <TOrbitControls :enable-damping="true" :damping-factor="0.05" :min-distance="2" :max-distance="10"
        :target="[0, 0, -0.2]" />

      <TAmbientLight :intensity="0.5" />

      <TDirectionalLight :intensity="1" :position="[5, 5, 5]" cast-shadow />

      <TGLTFLoader v-if="currentModelUrl" ref="gltfLoaderRef" :src="currentModelUrl" :cast-shadow="true"
        :receive-shadow="true" @load="onModelLoad" @progress="onProgress" @error="onError">
        <template #default="{ loading, progress: loadProgress, error: loadError, model, animations }">
          <TAnimationMixer v-if="model" :root="model" :auto-update="true">
            <TKeyframeAnimation v-for="(clip, index) in animations" :key="index" :clip="clip" :loop="true"
              :clamp-when-finished="true" />
          </TAnimationMixer>
        </template>
      </TGLTFLoader>

      <div class="loader-ui">
        <div v-if="loading" class="loading-panel">
          <div class="spinner"></div>
          <p>加载模型中... {{ Math.round(progress) }}%</p>
        </div>
        <div v-else-if="error" class="error-panel">
          <p>加载失败: {{ error.message }}</p>
        </div>
        <div v-else-if="modelLoaded" class="success-panel">
          <p>Duck 模型加载成功</p>
        </div>
      </div>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Object3D, AnimationClip } from 'three'
import {
  TCanvas,
  TPerspectiveCamera,
  TScene,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TGLTFLoader,
  TAnimationMixer,
  TKeyframeAnimation
} from '@vue-three/vue-three'

const canvasRef = ref<any>(null)
const sceneRef = ref<any>(null)
const gltfLoaderRef = ref<any>(null)

const loading = ref(false)
const progress = ref(0)
const error = ref<Error | null>(null)
const modelLoaded = ref(false)
const loadedModel = ref<Object3D | null>(null)

const currentModelUrl = computed(() => {
  return 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb'
})

function animationLoop() {
  if (gltfLoaderRef.value?.mixer) {
    gltfLoaderRef.value.mixer.update(0.016)
  }
}

function onModelLoad(model: Object3D, animations: AnimationClip[], gltf: any) {
  loadedModel.value = model
  modelLoaded.value = true
  loading.value = false
  console.log('Model loaded:', model)
  console.log('Animations:', animations.length)
}

function onProgress(event: { loaded: number; total: number }) {
  if (event.total > 0) {
    progress.value = (event.loaded / event.total) * 100
  }
}

function onError(err: Error) {
  error.value = err
  loading.value = false
  console.error('Load error:', err)
}
</script>

<style scoped>
.loader-ui {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.loading-panel,
.error-panel,
.success-panel {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-panel {
  background: rgba(255, 71, 87, 0.9);
}

.success-panel {
  background: rgba(66, 184, 131, 0.9);
}

p {
  margin: 0;
}
</style>