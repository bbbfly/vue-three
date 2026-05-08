<template>
  <div class="audio-visualizer-container">
    <div v-if="!isPlaying" class="overlay" @click="initAudio">
      <button class="start-button">Play</button>
    </div>
    <TCanvas antialias>
      <TScene>
        <TCamera />
        <TMesh ref="meshRef">
          <TPlane :args="[1, 1]" />
          <TShaderMaterial :uniforms="uniforms" :vertexShader="vertexShader" :fragmentShader="fragmentShader" />
        </TMesh>
      </TScene>
    </TCanvas>
    <div class="info">
      <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">three.js</a> webaudio - visualizer<br />
      music by <a href="http://www.newgrounds.com/audio/listen/376737" target="_blank" rel="noopener">skullbeatz</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TCanvas, TScene, TCamera, TMesh, TPlane, TShaderMaterial } from '@vue-three/vue-three'
import * as THREE from 'three'

const isPlaying = ref(false)
const fftSize = 128

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4( position, 1.0 );
  }
`

const fragmentShader = `
  uniform sampler2D tAudioData;
  varying vec2 vUv;
  void main() {
    vec3 backgroundColor = vec3( 0.125, 0.125, 0.125 );
    vec3 color = vec3( 1.0, 1.0, 0.0 );
    float f = texture2D( tAudioData, vec2( vUv.x, 0.0 ) ).r;
    float i = step( vUv.y, f ) * step( f - 0.0125, vUv.y );
    gl_FragColor = vec4( mix( backgroundColor, color, i ), 1.0 );
  }
`

const audioDataTexture = ref<THREE.DataTexture | null>(null)
const analyser = ref<THREE.AudioAnalyser | null>(null)
const audio = ref<THREE.Audio | null>(null)

const uniforms = {
  tAudioData: { value: null as unknown as THREE.DataTexture }
}

const initAudio = () => {
  isPlaying.value = true

  const listener = new THREE.AudioListener()
  audio.value = new THREE.Audio(listener)

  const file = '/lib/sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3'

  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
    const loader = new THREE.AudioLoader()
    loader.load(file, (buffer) => {
      audio.value?.setBuffer(buffer)
      audio.value?.play()
      setupAnalyser()
    })
  } else {
    const mediaElement = new Audio(file)
    mediaElement.play()
    audio.value?.setMediaElementSource(mediaElement)
    setupAnalyser()
  }
}

const setupAnalyser = () => {
  if (!audio.value) return

  analyser.value = new THREE.AudioAnalyser(audio.value, fftSize)
  audioDataTexture.value = new THREE.DataTexture(analyser.value.data, fftSize / 2, 1, THREE.RedFormat)
  uniforms.tAudioData.value = audioDataTexture.value

  animate()
}

const animate = () => {
  if (!analyser.value || !audioDataTexture.value) return

  analyser.value.getFrequencyData()
  audioDataTexture.value.needsUpdate = true

  requestAnimationFrame(animate)
}

onMounted(() => { })

onUnmounted(() => {
  audio.value?.stop()
})
</script>

<style scoped>
.audio-visualizer-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  z-index: 100;
}

.start-button {
  padding: 20px 40px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background-color: #3366ff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #2255ee;
}

.info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #fff;
  font-size: 12px;
  z-index: 100;
}

.info a {
  color: #fff;
  text-decoration: none;
}

.info a:hover {
  text-decoration: underline;
}
</style>