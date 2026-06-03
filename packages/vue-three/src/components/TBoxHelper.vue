<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { BoxHelper, Object3D, Color } from 'three'
import { useHelper } from '../composables/useHelper'
import { ref, watch, toValue } from 'vue'

/**
 * 包围盒辅助线组件
 * @description 创建一个表示对象包围盒的辅助对象
 * @component TBoxHelper
 * @example
 * <TBoxHelper
 *   :object="mesh"
 *   :color="0xffff00"
 * />
 */
const props = defineProps({
  /**
   * 要显示包围盒的3D对象
   */
  object: {
    type: Object as PropType<Object3D>,
    required: true
  },
  /**
   * 辅助线颜色
   * @default 0xffff00 (黄色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffff00
  }
})

let helperInstance: BoxHelper | null = null
const trigger = ref(0)

const { helper } = useHelper(() => {
  trigger.value
  return helperInstance
})

function createHelper() {
  const obj = toValue(props.object)
  if (obj) {
    if (helperInstance) {
      helperInstance.dispose()
    }
    helperInstance = new BoxHelper(obj, props.color)
    trigger.value++
  }
}

watch(
  () => props.object,
  () => {
    createHelper()
  },
  { immediate: true, deep: true }
)

watch(
  () => props.color,
  newColor => {
    if (helperInstance) {
      ;(helperInstance.material as any).color = new Color(newColor)
    }
  }
)

defineExpose({
  helper: () => helperInstance,
  update: () => helperInstance?.update()
})
</script>
