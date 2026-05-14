<template>
  <div class="t-canvas relative">
    <canvas ref="canvasRef" width="100%" height="100%" class="block"></canvas>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { ThreeContextKey, InteractionContextKey } from '../core/context'
import { useCanvas, type CanvasOptions, type AnimateFn } from '../composables/useCanvas'
import { useInteraction } from '../composables/useInteraction'
import type { ShadowMapType } from 'three'

/**
 * 画布根组件
 * @description Three.js 渲染画布，是所有3D内容的根容器，提供渲染上下文和全局配置
 * @component TCanvas
 * @example
 * <TCanvas
 *   :antialias="true"
 *   :clearColor="0x000000"
 *   :enableControls="true"
 * >
 *   <TScene>
 *     <TPerspectiveCamera />
 *     <TDirectionalLight />
 *   </TScene>
 * </TCanvas>
 */
const props = defineProps({
  /**
   * 画布宽度，不设置则自适应父容器
   * @default undefined (自适应)
   */
  width: {
    type: Number,
    default: undefined
  },
  /**
   * 画布高度，不设置则自适应父容器
   * @default undefined (自适应)
   */
  height: {
    type: Number,
    default: undefined
  },
  /**
   * 是否启用抗锯齿
   * @default true
   */
  antialias: {
    type: Boolean,
    default: true
  },
  /**
   * 是否启用透明度
   * @default false
   */
  alpha: {
    type: Boolean,
    default: false
  },
  /**
   * 画布清除颜色
   * @default undefined
   */
  clearColor: {
    type: [String, Number],
    default: undefined
  },
  /**
   * 清除颜色的透明度
   * @default 1
   */
  clearAlpha: {
    type: Number,
    default: 1
  },
  /**
   * 阴影贴图配置
   * @default undefined (无阴影)
   */
  shadowMap: {
    type: Object as PropType<{
      enabled: boolean
      type?: ShadowMapType
    }>,
    default: undefined
  },
  /**
   * 默认相机配置
   * @default { position: [0, 0, 5] }
   */
  camera: {
    type: Object as PropType<{
      fov?: number
      near?: number
      far?: number
      position?: [number, number, number]
    }>,
    default: () => ({
      position: [0, 0, 5]
    })
  },
  /**
   * 是否自动清除画布
   * @default true
   */
  autoClear: {
    type: Boolean,
    default: true
  },
  /**
   * 是否启用默认轨道控制器
   * @default true
   */
  enableControls: {
    type: Boolean,
    default: true
  },
  /**
   * 自定义渲染函数
   * @default undefined
   */
  onRender: {
    type: Function as PropType<AnimateFn>,
    default: undefined
  }
})

const options = computed<CanvasOptions>(() => ({
  width: props.width,
  height: props.height,
  antialias: props.antialias,
  alpha: props.alpha,
  clearColor: props.clearColor,
  clearAlpha: props.clearAlpha,
  shadowMap: props.shadowMap,
  camera: props.camera,
  autoClear: props.autoClear,
  enableControls: props.enableControls
}))

const emit = defineEmits<{
  animate: [{ scene: THREE.Scene; camera: THREE.Camera; delta: number; renderer: THREE.WebGLRenderer; size: { width: number; height: number } }]
}>()

const { canvasRef, context } = useCanvas(
  {
    options: options.value,
    animateFn: ({ scene, camera, delta }) => {
      emit('animate', { scene, camera, delta, renderer: context.renderer!, size: context.size })
    },
    renderFn: props.onRender
  })
const interaction = useInteraction(context)

watch(
  options,
  newOptions => {
    if (context.renderer && context.camera) {
      const cameraPos = newOptions.camera?.position
      if (cameraPos) {
        context.camera.position.set(...cameraPos)
      }
    }
  },
  { deep: true }
)

provide(ThreeContextKey, context)
provide(InteractionContextKey, interaction)

/**
 * @expose
 * @property canvasRef - Canvas DOM 元素引用
 * @property context - Three.js 上下文对象，包含 renderer、scene、camera 等
 */
defineExpose({
  canvasRef,
  context
})
</script>

<style scoped>
.t-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
