<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, onMounted, watch, shallowRef } from 'vue'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import { ThreeContextKey } from '../core/context'

const props = defineProps({
  enableDamping: {
    type: Boolean,
    default: false
  },
  dampingFactor: {
    type: Number,
    default: 0.05
  },
  enableZoom: {
    type: Boolean,
    default: true
  },
  zoomSpeed: {
    type: Number,
    default: 1.0
  },
  enableRotate: {
    type: Boolean,
    default: true
  },
  rotateSpeed: {
    type: Number,
    default: 1.0
  },
  enablePan: {
    type: Boolean,
    default: true
  },
  panSpeed: {
    type: Number,
    default: 1.0
  },
  minDistance: {
    type: Number,
    default: 0
  },
  maxDistance: {
    type: Number,
    default: Infinity
  },
  minZoom: {
    type: Number,
    default: 0
  },
  maxZoom: {
    type: Number,
    default: Infinity
  }
})

const ctx = inject(ThreeContextKey)

if (!ctx) {
  throw new Error('TTrackballControls must be used within a TCanvas component')
}

const controls = shallowRef<TrackballControls | null>(null)

const update = () => {
  if (controls.value) {
    controls.value.update()
  }
}

const reset = () => {
  if (controls.value) {
    controls.value.reset()
  }
}

const saveState = () => {
  if (controls.value) {
    controls.value.saveState()
  }
}

const setTarget = (x: number, y: number, z: number) => {
  if (controls.value) {
    controls.value.target.set(x, y, z)
  }
}

onMounted(() => {
  if (ctx && ctx.camera.value && ctx.renderer.value) {
    controls.value = new TrackballControls(ctx.camera.value, ctx.renderer.value.domElement)
    
    if (props.enableDamping !== undefined) {
      controls.value.enableDamping = props.enableDamping
    }
    if (props.dampingFactor !== undefined) {
      controls.value.dampingFactor = props.dampingFactor
    }
    if (props.enableZoom !== undefined) {
      controls.value.enableZoom = props.enableZoom
    }
    if (props.zoomSpeed !== undefined) {
      controls.value.zoomSpeed = props.zoomSpeed
    }
    if (props.enableRotate !== undefined) {
      controls.value.enableRotate = props.enableRotate
    }
    if (props.rotateSpeed !== undefined) {
      controls.value.rotateSpeed = props.rotateSpeed
    }
    if (props.enablePan !== undefined) {
      controls.value.enablePan = props.enablePan
    }
    if (props.panSpeed !== undefined) {
      controls.value.panSpeed = props.panSpeed
    }
    if (props.minDistance !== undefined) {
      controls.value.minDistance = props.minDistance
    }
    if (props.maxDistance !== undefined) {
      controls.value.maxDistance = props.maxDistance
    }
    if (props.minZoom !== undefined) {
      controls.value.minZoom = props.minZoom
    }
    if (props.maxZoom !== undefined) {
      controls.value.maxZoom = props.maxZoom
    }
  }
})

watch(
  () => props,
  (newProps) => {
    if (!controls.value) return
    
    if (newProps.enableDamping !== undefined) {
      controls.value.enableDamping = newProps.enableDamping
    }
    if (newProps.dampingFactor !== undefined) {
      controls.value.dampingFactor = newProps.dampingFactor
    }
    if (newProps.enableZoom !== undefined) {
      controls.value.enableZoom = newProps.enableZoom
    }
    if (newProps.zoomSpeed !== undefined) {
      controls.value.zoomSpeed = newProps.zoomSpeed
    }
    if (newProps.enableRotate !== undefined) {
      controls.value.enableRotate = newProps.enableRotate
    }
    if (newProps.rotateSpeed !== undefined) {
      controls.value.rotateSpeed = newProps.rotateSpeed
    }
    if (newProps.enablePan !== undefined) {
      controls.value.enablePan = newProps.enablePan
    }
    if (newProps.panSpeed !== undefined) {
      controls.value.panSpeed = newProps.panSpeed
    }
    if (newProps.minDistance !== undefined) {
      controls.value.minDistance = newProps.minDistance
    }
    if (newProps.maxDistance !== undefined) {
      controls.value.maxDistance = newProps.maxDistance
    }
    if (newProps.minZoom !== undefined) {
      controls.value.minZoom = newProps.minZoom
    }
    if (newProps.maxZoom !== undefined) {
      controls.value.maxZoom = newProps.maxZoom
    }
  },
  { deep: true }
)

defineExpose({
  controls,
  update,
  reset,
  saveState,
  setTarget
})
</script>
