<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { useLight } from '../composables/useLight'
import type { DirectionalLightConfig } from '../types'

/**
 * 平行光组件
 * @description 平行光是具有方向的光源，光线互相平行，常用于模拟太阳光等远距离光源
 * @component TDirectionalLight
 * @example
 * <TDirectionalLight
 *   :color="0xffffff"
 *   :intensity="1"
 *   :position="[5, 5, 5]"
 *   :castShadow="true"
 * />
 */
const props = defineProps({
  /**
   * 光源颜色
   * @default 0xffffff (白色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 光源强度
   * @default 1
   */
  intensity: {
    type: Number,
    default: 1
  },
  /**
   * 光源位置坐标 [x, y, z]
   * @default [5, 5, 5]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [5, 5, 5]
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
   * 阴影贴图尺寸 [width, height]
   * @default [2048, 2048]
   */
  shadowMapSize: {
    type: Array as unknown as PropType<[number, number]>,
    default: () => [2048, 2048]
  },
  /**
   * 阴影相机近裁剪面距离
   * @default 0.5
   */
  shadowCameraNear: {
    type: Number,
    default: 0.5
  },
  /**
   * 阴影相机远裁剪面距离
   * @default 50
   */
  shadowCameraFar: {
    type: Number,
    default: 50
  },
  /**
   * 阴影相机左边界
   * @default -20
   */
  shadowCameraLeft: {
    type: Number,
    default: -20
  },
  /**
   * 阴影相机右边界
   * @default 20
   */
  shadowCameraRight: {
    type: Number,
    default: 20
  },
  /**
   * 阴影相机上边界
   * @default 20
   */
  shadowCameraTop: {
    type: Number,
    default: 20
  },
  /**
   * 阴影相机下边界
   * @default -20
   */
  shadowCameraBottom: {
    type: Number,
    default: -20
  }
})

const config: DirectionalLightConfig = {
  type: 'directional',
  color: props.color,
  intensity: props.intensity,
  position: props.position,
  castShadow: props.castShadow,
  shadowMapSize: props.shadowMapSize,
  shadowCameraNear: props.shadowCameraNear,
  shadowCameraFar: props.shadowCameraFar,
  shadowCameraLeft: props.shadowCameraLeft,
  shadowCameraRight: props.shadowCameraRight,
  shadowCameraTop: props.shadowCameraTop,
  shadowCameraBottom: props.shadowCameraBottom
}

const { light } = useLight(config)

/**
 * @expose
 * @property light - Three.js DirectionalLight 实例
 */
defineExpose({
  light
})
</script>
