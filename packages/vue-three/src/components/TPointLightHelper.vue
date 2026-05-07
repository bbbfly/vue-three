<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { PointLight, PointLightHelper, Color } from 'three'
import { useHelper } from '../composables/useHelper'
import { watch, shallowRef, toValue } from 'vue'

/**
 * 点光源辅助线组件
 * @description 创建一个表示点光源的辅助对象
 * @component TPointLightHelper
 * @example
 * <TPointLightHelper
 *   :light="pointLight"
 *   :sphere-size="15"
 * />
 */
const props = defineProps({
  /**
   * 要显示的点光源引用
   */
  light: {
    type: Object as PropType<PointLight>,
    required: true
  },
  /**
   * 辅助球体大小
   * @default 1
   */
  sphereSize: {
    type: Number,
    default: 1
  },
  /**
   * 辅助线颜色，如果未设置则使用光源颜色
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  }
})

const helperInstance = shallowRef<PointLightHelper | null>(null)

const { helper } = useHelper(helperInstance)

function createHelper() {
  const light = toValue(props.light)
  if (light) {
    helperInstance.value = new PointLightHelper(
      light,
      props.sphereSize,
      props.color
    )
  }
}

watch(
  () => props.light,
  () => {
    createHelper()
  },
  { immediate: true }
)

watch(
  () => [props.sphereSize, props.color],
  () => {
    if (helperInstance.value) {
      helperInstance.value.dispose()
    }
    createHelper()
  }
)

watch(
  () => props.color,
  newColor => {
    if (helperInstance.value) {
      helperInstance.value.color = newColor ? new Color(newColor) : undefined
      helperInstance.value.update()
    }
  }
)

defineExpose({
  helper,
  update: () => helperInstance.value?.update()
})
</script>
