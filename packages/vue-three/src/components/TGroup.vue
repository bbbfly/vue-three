<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import { useGroup, type GroupConfig } from '../composables/useGroup'
import { ThreeObjectFactory } from '../core/factory'

/**
 * 组容器组件
 * @description Three.js Group 容器，用于组织和管理3D对象的层级结构
 * @component TGroup
 * @example
 * <TScene>
 *   <TGroup :position="[0, 0, 0]" :rotation="[0, 0, 0]" :scale="[1, 1, 1]">
 *     <TMesh />
 *     <TLight />
 *     <TGroup>
 *       <TMesh />
 *     </TGroup>
 *   </TGroup>
 * </TScene>
 */
const props = defineProps({
  /**
   * 组名称
   * @default undefined
   */
  name: {
    type: String,
    default: undefined
  },
  /**
   * 位置
   * @default [0, 0, 0]
   */
  position: {
    type: Array as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 旋转角度（弧度）
   * @default [0, 0, 0]
   */
  rotation: {
    type: Array as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 缩放
   * @default [1, 1, 1]
   */
  scale: {
    type: Array as PropType<[number, number, number]>,
    default: () => [1, 1, 1]
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
   * 是否接收阴影
   * @default false
   */
  receiveShadow: {
    type: Boolean,
    default: false
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
   * 用户自定义数据
   * @default undefined
   */
  userData: {
    type: Object,
    default: undefined
  }
})

const { group } = useGroup()

onMounted(() => {
  const initConfig: GroupConfig = {
    name: props.name,
    position: props.position,
    rotation: props.rotation,
    scale: props.scale,
    visible: props.visible,
    receiveShadow: props.receiveShadow,
    castShadow: props.castShadow,
    userData: props.userData
  }
  ThreeObjectFactory.applyObject3DConfig(group, initConfig)
  if (props.name !== undefined) {
    group.name = props.name
  }
})

watch(
  () => props,
  newProps => {
    const newConfig: GroupConfig = {
      name: newProps.name,
      position: newProps.position,
      rotation: newProps.rotation,
      scale: newProps.scale,
      visible: newProps.visible,
      receiveShadow: newProps.receiveShadow,
      castShadow: newProps.castShadow,
      userData: newProps.userData
    }
    ThreeObjectFactory.updateObject3DConfig(group, newConfig)
    if (newProps.name !== undefined) {
      group.name = newProps.name
    }
  },
  { deep: true }
)

/**
 * @expose
 * @property group - Three.js Group 实例
 */
defineExpose({
  group
})
</script>