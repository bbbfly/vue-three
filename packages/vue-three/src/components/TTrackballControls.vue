<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch } from 'vue'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import { ThreeContextKey } from '../core/context'

defineOptions({
  inheritAttrs: false,
})

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

let controls: TrackballControls = new TrackballControls(ctx.camera)

const update = () => {
  if (controls) {
    controls.update()
  }
}

const reset = () => {
  if (controls) {
    controls.reset()
  }
}

const saveState = () => {
  if (controls) {
    controls.saveState()
  }
}

const setTarget = (x: number, y: number, z: number) => {
  if (controls) {
    controls.target.set(x, y, z)
  }
}

ctx.ready((context) => {
  controls.domElement = context.renderer!.domElement

  if (props.enableDamping !== undefined) {
    controls.enableDamping = props.enableDamping
  }
  if (props.dampingFactor !== undefined) {
    controls.dampingFactor = props.dampingFactor
  }
  if (props.enableZoom !== undefined) {
    controls.enableZoom = props.enableZoom
  }
  if (props.zoomSpeed !== undefined) {
    controls.zoomSpeed = props.zoomSpeed
  }
  if (props.enableRotate !== undefined) {
    controls.enableRotate = props.enableRotate
  }
  if (props.rotateSpeed !== undefined) {
    controls.rotateSpeed = props.rotateSpeed
  }
  if (props.enablePan !== undefined) {
    controls.enablePan = props.enablePan
  }
  if (props.panSpeed !== undefined) {
    controls.panSpeed = props.panSpeed
  }
  if (props.minDistance !== undefined) {
    controls.minDistance = props.minDistance
  }
  if (props.maxDistance !== undefined) {
    controls.maxDistance = props.maxDistance
  }
  if (props.minZoom !== undefined) {
    controls.minZoom = props.minZoom
  }
  if (props.maxZoom !== undefined) {
    controls.maxZoom = props.maxZoom
  }
  update()
})

watch(
  () => props,
  (newProps) => {
    if (!controls) return

    if (newProps.enableDamping !== undefined) {
      controls.enableDamping = newProps.enableDamping
    }
    if (newProps.dampingFactor !== undefined) {
      controls.dampingFactor = newProps.dampingFactor
    }
    if (newProps.enableZoom !== undefined) {
      controls.enableZoom = newProps.enableZoom
    }
    if (newProps.zoomSpeed !== undefined) {
      controls.zoomSpeed = newProps.zoomSpeed
    }
    if (newProps.enableRotate !== undefined) {
      controls.enableRotate = newProps.enableRotate
    }
    if (newProps.rotateSpeed !== undefined) {
      controls.rotateSpeed = newProps.rotateSpeed
    }
    if (newProps.enablePan !== undefined) {
      controls.enablePan = newProps.enablePan
    }
    if (newProps.panSpeed !== undefined) {
      controls.panSpeed = newProps.panSpeed
    }
    if (newProps.minDistance !== undefined) {
      controls.minDistance = newProps.minDistance
    }
    if (newProps.maxDistance !== undefined) {
      controls.maxDistance = newProps.maxDistance
    }
    if (newProps.minZoom !== undefined) {
      controls.minZoom = newProps.minZoom
    }
    if (newProps.maxZoom !== undefined) {
      controls.maxZoom = newProps.maxZoom
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
