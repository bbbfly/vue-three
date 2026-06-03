<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { Plane, PlaneHelper, Color } from 'three'
import { useHelper } from '../composables/useHelper'
import { ref, watch, toValue } from 'vue'

/**
 * 平面辅助线组件
 * @description 创建一个表示平面的辅助对象，显示平面的边界和法线方向
 * @component TPlaneHelper
 * @example
 * <TPlaneHelper
 *   :plane="plane"
 *   :size="2"
 *   :color="0xff0000"
 * />
 */
const props = defineProps({
  /**
   * 要显示的平面对象
   */
  plane: {
    type: Object as PropType<Plane>,
    required: true
  },
  /**
   * 辅助线大小
   * @default 1
   */
  size: {
    type: Number,
    default: 1
  },
  /**
   * 辅助线颜色
   * @default 0xffff00 (黄色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffff00
  },
  /**
   * 是否显示辅助线
   * @default true
   */
  visible: {
    type: Boolean,
    default: true
  }
})

// 使用普通变量存储 Three.js 对象，避免 Vue Proxy 问题
let helperInstance: PlaneHelper | null = null
// 使用 ref 作为触发器，通知 useHelper 更新
const trigger = ref(0)

const { helper } = useHelper(() => {
  // 访问 trigger 使这个 getter 成为响应式依赖
  trigger.value
  return helperInstance
})

function createHelper() {
  const plane = toValue(props.plane)
  if (plane) {
    if (helperInstance) {
      helperInstance.dispose()
    }
    helperInstance = new PlaneHelper(plane, props.size, props.color)
    helperInstance.visible = props.visible
    trigger.value++
  }
}

watch(
  () => props.plane,
  () => {
    createHelper()
  },
  { immediate: true, deep: true }
)

watch(
  () => [props.size, props.color],
  () => {
    createHelper()
  }
)

watch(
  () => props.color,
  newColor => {
    if (helperInstance) {
      ;(helperInstance.material as any).color = new Color(newColor)
    }
  }
)

watch(
  () => props.visible,
  newVisible => {
    if (helperInstance) {
      helperInstance.visible = newVisible
    }
  }
)

defineExpose({
  helper: () => helperInstance,
  update: () => helperInstance?.update()
})
</script>
