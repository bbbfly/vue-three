<template>
  <div class="animation-timeline">
    <div class="timeline-header">
      <span class="timeline-title">⏱️ 时间轴控制</span>
      <span class="timeline-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>

    <div class="timeline-slider-container">
      <input
        type="range"
        class="timeline-slider"
        min="0"
        :max="duration || 100"
        step="0.01"
        :value="currentTime"
        @input="onTimeChange"
        @mousedown="isDragging = true"
        @mouseup="isDragging = false"
        @mouseleave="isDragging = false"
      />
    </div>

    <div class="timeline-controls">
      <div class="control-buttons">
        <button
          class="control-btn"
          :class="{ active: !isPlaying }"
          :title="isPlaying ? '暂停' : '播放'"
          @click="togglePlay"
        >
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button class="control-btn" title="停止" @click="emit('stop')">⏹️</button>
        <button class="control-btn" title="重置" @click="emit('reset')">🔄</button>
      </div>

      <div class="speed-control">
        <span class="speed-label">速度:</span>
        <select class="speed-select" :value="timeScale" @change="onSpeedChange">
          <option v-for="s in speeds" :key="s" :value="s">{{ s }}x</option>
        </select>
      </div>
    </div>

    <div class="loop-controls">
      <span class="loop-label">循环:</span>
      <button
        class="loop-btn"
        :class="{ active: loopMode === 'repeat' }"
        title="循环播放"
        @click="setLoopMode('repeat')"
      >
        🔁
      </button>
      <button
        class="loop-btn"
        :class="{ active: loopMode === 'pingpong' }"
        title="往返循环"
        @click="setLoopMode('pingpong')"
      >
        🔂
      </button>
      <button
        class="loop-btn"
        :class="{ active: loopMode === 'once' }"
        title="播放一次"
        @click="setLoopMode('once')"
      >
        1️⃣
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  currentTime: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  isPlaying: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  play: []
  pause: []
  stop: []
  reset: []
  timeChange: [time: number]
  speedChange: [speed: number]
  loopModeChange: [mode: 'repeat' | 'pingpong' | 'once']
}>()

const isDragging = ref(false)
const timeScale = ref(1)
const loopMode = ref<'repeat' | 'pingpong' | 'once'>('repeat')

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5]

function formatTime(time: number): string {
  return time.toFixed(2) + 's'
}

function togglePlay() {
  if (props.isPlaying) {
    emit('pause')
  } else {
    emit('play')
  }
}

function onTimeChange(event: Event) {
  const target = event.target as HTMLInputElement
  const newTime = parseFloat(target.value)
  emit('timeChange', newTime)
}

function onSpeedChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const newSpeed = parseFloat(target.value)
  timeScale.value = newSpeed
  emit('speedChange', newSpeed)
}

function setLoopMode(mode: 'repeat' | 'pingpong' | 'once') {
  loopMode.value = mode
  emit('loopModeChange', mode)
}
</script>

<style scoped>
.animation-timeline {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px;
  color: white;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.timeline-title {
  font-weight: 600;
  font-size: 14px;
}

.timeline-time {
  font-size: 12px;
  opacity: 0.9;
  font-family: 'Monaco', 'Consolas', monospace;
}

.timeline-slider-container {
  margin-bottom: 16px;
}

.timeline-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.timeline-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
}

.timeline-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.timeline-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.control-buttons {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.05);
}

.control-btn.active {
  background: rgba(255, 255, 255, 0.4);
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.speed-label {
  font-size: 12px;
  opacity: 0.9;
}

.speed-select {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  cursor: pointer;
  outline: none;
}

.speed-select option {
  color: #333;
}

.loop-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.loop-label {
  font-size: 12px;
  opacity: 0.9;
}

.loop-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.loop-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loop-btn.active {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 2px white;
}
</style>
