<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { watch, onMounted, inject, onBeforeUnmount } from 'vue'
import { useInstancedMesh } from '../composables/useInstancedMesh'
import { ThreeObjectFactory } from '../core/factory'
import { InteractionContextKey } from '../core/context'
import type { Object3DConfig } from '../types'
import type { InteractionEvent } from '../core/context'

/**
 * 实例化网格组件
 * @description Three.js InstancedMesh 对象，用于高效渲染大量相同几何体的实例
 * @component TInstancedMesh
 * @example
 * <TInstancedMesh :instanceCount="1000" :position="[0, 0, 0]">
 *   <TBox :args="[1, 1, 1]" />
 *   <TMeshStandardMaterial :color="0xff0000" />
 * </TInstancedMesh>
 */
const props = defineProps({
  /**
   * 网格位置坐标 [x, y, z]
   * @default [0, 0, 0]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 网格旋转角度 [x, y, z]，单位弧度
   * @default undefined
   */
  rotation: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: undefined
  },
  /**
   * 网格缩放比例 [x, y, z]
   * @default undefined
   */
  scale: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: undefined
  },
  /**
   * 是否投射阴影
   * @default false
   */
  castShadow: {
    type: Boolean,
    default: false
  },
  /**
   * 是否接收阴影
   * @default false
   */
  receiveShadow: {
    type: Boolean,
    default: false
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
   * 渲染顺序
   * @default 0
   */
  renderOrder: {
    type: Number,
    default: 0
  },
  /**
   * 是否进行视锥剔除
   * @default true
   */
  frustumCulled: {
    type: Boolean,
    default: true
  },
  /**
   * 实例数量
   * @default 1
   */
  instanceCount: {
    type: Number,
    default: 1
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

const interactionCtx = inject(InteractionContextKey, null)

const config: Object3DConfig = {
  position: props.position,
  rotation: props.rotation,
  scale: props.scale,
  castShadow: props.castShadow,
  receiveShadow: props.receiveShadow,
  visible: props.visible,
  renderOrder: props.renderOrder,
  frustumCulled: props.frustumCulled
}

const { mesh, setGeometry, setMaterial } = useInstancedMesh({
  ...config,
  instanceCount: props.instanceCount
})

watch(
  () => props,
  newProps => {
    const newConfig: Object3DConfig = {
      position: newProps.position,
      rotation: newProps.rotation,
      scale: newProps.scale,
      castShadow: newProps.castShadow,
      receiveShadow: newProps.receiveShadow,
      visible: newProps.visible,
      renderOrder: newProps.renderOrder,
      frustumCulled: newProps.frustumCulled
    }
    if (mesh.value) {
      ThreeObjectFactory.updateObject3DConfig(mesh.value, newConfig)
      if (newProps.instanceCount !== undefined) {
        mesh.value.count = newProps.instanceCount
      }
    }
  },
  { deep: true }
)

watch(
  [
    () => props.onClick,
    () => props.onDblclick,
    () => props.onContextmenu,
    () => props.onPointerEnter,
    () => props.onPointerLeave,
    () => props.onPointerMove
  ],
  () => {
    if (interactionCtx && mesh.value) {
      interactionCtx.unregisterObject(mesh.value)
      interactionCtx.registerObject(mesh.value, {
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
  if (interactionCtx && mesh.value) {
    interactionCtx.unregisterObject(mesh.value)
  }
})

/**
 * @expose
 * @property mesh - Three.js InstancedMesh 实例
 * @property setGeometry - 设置网格几何体
 * @property setMaterial - 设置网格材质
 */
defineExpose({
  mesh,
  setGeometry,
  setMaterial
})
</script>