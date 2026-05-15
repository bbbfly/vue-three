<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

import type { PropType } from 'vue'
import { useLight } from '../composables/useLight'
import type { SpotLightConfig } from '../types'

/**
 * 聚光灯光源组件
 * @description 聚光灯是一种具有方向性的光源，光线从一个点发出，沿着一个圆锥体方向传播
 * @component TSpotLight
 * @example
 * <TSpotLight
 *   :color="0xffffff"
 *   :intensity="1"
 *   :position="[0, 5, 0]"
 *   :angle="Math.PI / 4"
 *   :penumbra="0.5"
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
   * @default [0, 5, 0]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 5, 0]
  },
  /**
   * 光照最大距离，超出该距离的物体不受光照影响
   * @default 0 (无限远)
   */
  distance: {
    type: Number,
    default: 0
  },
  /**
   * 光线散射角度，单位弧度
   * @default Math.PI / 3 (60度)
   */
  angle: {
    type: Number,
    default: Math.PI / 3
  },
  /**
   * 光照边缘衰减百分比，范围 0 到 1
   * @default 0 (无衰减)
   */
  penumbra: {
    type: Number,
    default: 0
  },
  /**
   * 光照衰减系数
   * @default 2 (物理正确衰减)
   */
  decay: {
    type: Number,
    default: 2
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
   * 阴影相机视野角度（仅适用于聚光灯）
   * @default undefined (使用默认值)
   */
  shadowCameraFov: {
    type: Number,
    default: undefined
  }
})

const config: SpotLightConfig = {
  type: 'spot',
  color: props.color,
  intensity: props.intensity,
  position: props.position,
  distance: props.distance,
  angle: props.angle,
  penumbra: props.penumbra,
  decay: props.decay,
  castShadow: props.castShadow,
  shadowMapSize: props.shadowMapSize,
  shadowCameraNear: props.shadowCameraNear,
  shadowCameraFar: props.shadowCameraFar,
  shadowCameraFov: props.shadowCameraFov
}

const { light } = useLight(config)

/**
 * @expose
 * @property light - Three.js SpotLight 实例
 */
defineExpose({
  light
})
</script>
