<script setup lang="ts">
import { computed } from 'vue'
import { useOutlinePass } from '../composables/useOutlinePass'
import type { OutlinePassConfig } from '../composables/useOutlinePass'
import type { Object3D, Color } from 'three'

/**
 * Outline发光描边通道组件
 * @description 提供物体轮廓发光描边效果，常用于选中高亮、鼠标悬停提示等交互场景
 * @component TOutlinePass
 * @example
 * <TOutlinePass
 *   :edgeStrength="3"
 *   :edgeThickness="1"
 *   visible-edge-color="#ffffff"
 *   :selectedObjects="[meshRef]"
 * />
 */
const props = defineProps({
  /**
   * 描边强度，数值越大描边越亮
   * @default 3
   */
  edgeStrength: {
    type: Number,
    default: 3
  },
  /**
   * 描边光晕扩散程度，数值越大光晕越明显
   * @default 0
   */
  edgeGlow: {
    type: Number,
    default: 0
  },
  /**
   * 描边粗细，数值越大描边越粗
   * @default 1
   */
  edgeThickness: {
    type: Number,
    default: 1
  },
  /**
   * 闪烁动画周期，0 表示不闪烁
   * @default 0
   */
  pulsePeriod: {
    type: Number,
    default: 0
  },
  /**
   * 可见边缘颜色
   * @default 0xffffff
   */
  visibleEdgeColor: {
    type: [String, Number],
    default: 0xffffff
  },
  /**
   * 隐藏边缘颜色（被遮挡部分的描边颜色）
   * @default 0x190a05
   */
  hiddenEdgeColor: {
    type: [String, Number],
    default: 0x190a05
  },
  /**
   * 需要显示描边的对象数组
   * @default []
   */
  selectedObjects: {
    type: Array as () => Object3D[],
    default: () => []
  }
})

const config = computed<OutlinePassConfig>(() => ({
  edgeStrength: props.edgeStrength,
  edgeGlow: props.edgeGlow,
  edgeThickness: props.edgeThickness,
  pulsePeriod: props.pulsePeriod,
  visibleEdgeColor: props.visibleEdgeColor as string | number | Color,
  hiddenEdgeColor: props.hiddenEdgeColor as string | number | Color,
  selectedObjects: props.selectedObjects
}))

const { outlinePass } = useOutlinePass(config)

/**
 * @expose
 * @property outlinePass - Three.js OutlinePass 实例
 */
defineExpose({
  outlinePass
})
</script>
