<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { BoxHelper, Object3D, Color } from 'three'
import { useHelper } from '../composables/useHelper'
import { watch, shallowRef, toValue } from 'vue'

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

const helperInstance = shallowRef<BoxHelper | null>(null)

const { helper } = useHelper(helperInstance)

function createHelper() {
  const obj = toValue(props.object)
  if (obj) {
    helperInstance.value = new BoxHelper(obj, props.color)
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
    if (helperInstance.value) {
      ;(helperInstance.value.material as any).color = new Color(newColor)
    }
  }
)

defineExpose({
  helper,
  update: () => helperInstance.value?.update()
})
</script>
