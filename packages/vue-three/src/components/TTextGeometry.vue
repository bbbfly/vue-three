<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { Font } from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { useGeometry } from '../composables/useGeometry'
import type { TextGeometryArgs } from '../types'

/**
 * 文字几何体组件
 * @description 根据输入的文字内容和字体创建 3D 文字几何体
 * @component TTextGeometry
 * @example
 * <TTextGeometry text="Hello" :font="fontObject" :args="{ size: 100, depth: 20 }" />
 */
const props = defineProps({
  /**
   * 文字内容
   * @required 要显示的文字
   */
  text: {
    type: String,
    required: true
  },
  /**
   * 字体对象，通过 FontLoader 加载获得
   * @required 字体资源
   */
  font: {
    type: Object as PropType<Font>,
    required: true
  },
  /**
   * 文字几何体参数配置
   * @default { size: 100, depth: 50, curveSegments: 12, bevelThickness: 10, bevelSize: 8, bevelEnabled: false }
   */
  args: {
    type: Object as PropType<TextGeometryArgs>,
    default: () => ({
      size: 100,
      depth: 50,
      curveSegments: 12,
      bevelThickness: 10,
      bevelSize: 8,
      bevelEnabled: false
    })
  }
})

const { geometry, updateGeometry } = useGeometry({
  type: 'text',
  text: props.text,
  font: props.font,
  args: props.args
})

watch(
  () => [props.text, props.font, props.args],
  ([newText, newFont, newArgs]) => {
    updateGeometry({
      type: 'text',
      text: newText,
      font: newFont,
      args: newArgs as TextGeometryArgs
    })
  },
  { deep: true }
)

/**
 * @expose
 * @property geometry - Three.js TextGeometry 实例
 */
defineExpose({
  geometry
})
</script>
