<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch, onMounted, inject, onBeforeUnmount } from 'vue'
import { useMesh } from '../composables/useMesh'
import { ThreeObjectFactory } from '../core/factory'
import { InteractionContextKey } from '../core/context'
import type { Object3DConfig } from '../types'
import type { InteractionEvent } from '../core/context'

/**
 * 网格组件
 * @description Three.js 网格对象，是几何体和材质的组合体，是3D场景的基础渲染单元
 * @component TMesh
 * @example
 * <TMesh :position="[0, 0, 0]" :castShadow="true">
 *   <TBox :args="[1, 1, 1]" />
 *   <TMeshStandardMaterial :color="0xff0000" />
 * </TMesh>
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

const { mesh, setGeometry, setMaterial } = useMesh()

onMounted(() => {
  ThreeObjectFactory.applyObject3DConfig(mesh, config)
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
    ThreeObjectFactory.updateObject3DConfig(mesh, newConfig)
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
    if (interactionCtx) {
      interactionCtx.unregisterObject(mesh)
      interactionCtx.registerObject(mesh, {
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
  if (interactionCtx) {
    interactionCtx.unregisterObject(mesh)
  }
})

/**
 * @expose
 * @property mesh - Three.js Mesh 实例
 * @property setGeometry - 设置网格几何体
 * @property setMaterial - 设置网格材质
 */
defineExpose({
  mesh,
  setGeometry,
  setMaterial
})
</script>
