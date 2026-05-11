<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch, onMounted, inject, onBeforeUnmount, shallowRef, provide, computed } from 'vue'
import { Points, BufferGeometry, Material } from 'three'
import { ThreeContextKey, MeshContextKey, GroupContextKey, InteractionContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import { disposeObject3D } from '../core/cleanup'
import type { Object3DConfig } from '../types'
import type { InteractionEvent } from '../core/context'

/**
 * 粒子系统组件
 * @description Three.js 粒子对象，用于渲染大量粒子
 * @component TPoints
 * @example
 * <TPoints :position="[0, 0, 0]">
 *   <TBufferGeometry :attributes="particleAttributes" />
 *   <TPointsMaterial :color="0x888888" :size="1" />
 * </TPoints>
 */
const props = defineProps({
  /**
   * 粒子位置坐标 [x, y, z]
   * @default [0, 0, 0]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 粒子旋转角度 [x, y, z]，单位弧度
   * @default undefined
   */
  rotation: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: undefined
  },
  /**
   * 粒子缩放比例 [x, y, z]
   * @default undefined
   */
  scale: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: undefined
  },
  /**
   * 是否可见
   * @default true
   */
  visible: {
    type: Boolean,
    default: true
  },
  /**
   * 点击事件回调
   */
  onClick: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 双击事件回调
   */
  onDblclick: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 右键菜单事件回调
   */
  onContextmenu: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 鼠标进入事件回调
   */
  onPointerEnter: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 鼠标离开事件回调
   */
  onPointerLeave: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 鼠标移动事件回调
   */
  onPointerMove: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  }
})

const ctx = inject(ThreeContextKey)
const groupCtx = inject(GroupContextKey, null)
const interactionCtx = inject(InteractionContextKey, null)

if (!ctx) {
  throw new Error('TPoints must be used within a TCanvas component')
}

const points = shallowRef<Points>(new Points())

const parent = computed(() => groupCtx?.group.value || ctx.scene.value)

watch(parent, (newParent) => {
  if (newParent && !newParent.children.includes(points.value)) {
    newParent.add(points.value)
  }
}, { immediate: true })

const config: Object3DConfig = {
  position: props.position,
  rotation: props.rotation,
  scale: props.scale,
  visible: props.visible
}

onMounted(() => {
  ThreeObjectFactory.applyObject3DConfig(points.value, config)
})

watch(
  () => props,
  newProps => {
    const newConfig: Object3DConfig = {
      position: newProps.position,
      rotation: newProps.rotation,
      scale: newProps.scale,
      visible: newProps.visible
    }
    ThreeObjectFactory.updateObject3DConfig(points.value, newConfig)
  },
  { deep: true }
)

function setGeometry(geometry: BufferGeometry) {
  if (points.value.geometry) {
    points.value.geometry.dispose()
  }
  points.value.geometry = geometry
  points.value.updateMatrix()
}

function setMaterial(material: Material) {
  if (points.value.material) {
    const oldMaterial = points.value.material as Material
    oldMaterial.dispose()
  }
  points.value.material = material
  material.needsUpdate = true
}

provide(MeshContextKey, {
  mesh: points,
  setGeometry,
  setMaterial
})

watch(
  [
    () => points.value,
    () => props.onClick,
    () => props.onDblclick,
    () => props.onContextmenu,
    () => props.onPointerEnter,
    () => props.onPointerLeave,
    () => props.onPointerMove
  ],
  ([pointsObj]) => {
    if (pointsObj && interactionCtx) {
      interactionCtx.unregisterObject(pointsObj)
      interactionCtx.registerObject(pointsObj, {
        onClick: props.onClick,
        onDblclick: props.onDblclick,
        onContextmenu: props.onContextmenu,
        onPointerEnter: props.onPointerEnter,
        onPointerLeave: props.onPointerLeave,
        onPointerMove: props.onPointerMove
      })
    }
  },
  { immediate: true, deep: false, flush: 'post' }
)

onBeforeUnmount(() => {
  if (parent.value) {
    parent.value.remove(points.value)
  }
  disposeObject3D(points.value)
})



/**
 * @expose
 * @property mesh - Three.js Points 实例
 * @property setGeometry - 设置粒子几何体
 * @property setMaterial - 设置粒子材质
 */
defineExpose({
  mesh: points,
  setGeometry,
  setMaterial
})
</script>
