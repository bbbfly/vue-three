<template>
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

import type { PropType } from 'vue'
import { watch, onMounted, inject, onBeforeUnmount, computed } from 'vue'
import { useSprite } from '../composables/useSprite'
import { ThreeObjectFactory } from '../core/factory'
import { InteractionContextKey } from '../core/context'
import type { SpriteConfig, SpriteMaterialConfig } from '../types'
import type { InteractionEvent } from '../core/context'

/**
 * 精灵组件
 * @description 面向相机的 2D 广告牌精灵，用于标记点、光晕、粒子等效果，支持圆形/圆角裁剪和颜色叠加
 * @component TSprite
 * @example
 * // 基础圆形精灵
 * <TSprite
 *   :position="[0, 2, 0]"
 *   :scale="[0.5, 0.5, 0.5]"
 *   color="#ff4444"
 *   clip="circle"
 *   @click="handleClick"
 * />
 * @example
 * // 使用配置对象
 * <TSprite :config="spriteConfig" />
 * @example
 * // 插槽模式自定义材质
 * <TSprite :position="[0, 2, 0]">
 *   <TSpriteMaterial
 *     map="/textures/marker.png"
 *     clip="rounded"
 *     :border-radius="0.2"
 *     blending="additive"
 *   />
 * </TSprite>
 */
const props = defineProps({
  /**
   * 完整配置对象，设置后将忽略其他独立属性
   */
  config: {
    type: Object as PropType<SpriteConfig>,
    default: undefined
  },
  /**
   * 精灵位置坐标 [x, y, z]
   * @default [0, 0, 0]
   */
  position: {
    type: Array as unknown as PropType<[number, number, number]>,
    default: () => [0, 0, 0]
  },
  /**
   * 精灵缩放比例 [x, y, z]，控制精灵大小
   * @default [1, 1, 1]
   */
  scale: {
    type: Array as unknown as PropType<[number, number, number]>,
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
   * 渲染顺序，值越大越晚渲染（显示在前面）
   * @default undefined
   */
  renderOrder: {
    type: Number,
    default: undefined
  },
  /**
   * 精灵中心点对齐 [x, y]，范围 0-1，[0.5, 0.5] 表示居中
   * @default undefined
   */
  center: {
    type: Array as unknown as PropType<[number, number]>,
    default: undefined
  },
  /**
   * 精灵颜色，支持十六进制或 CSS 颜色字符串
   * @default 0xffffff (白色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 透明度，范围 0-1
   * @default 1 (不透明)
   */
  opacity: {
    type: Number,
    default: 1
  },
  /**
   * 是否启用透明度，启用混合模式时必须设为 true
   * @default true
   */
  transparent: {
    type: Boolean,
    default: true
  },
  /**
   * 精灵旋转角度，单位弧度
   * @default 0
   */
  rotation: {
    type: Number,
    default: 0
  },
  /**
   * 是否受场景雾效影响
   * @default false
   */
  fog: {
    type: Boolean,
    default: false
  },
  /**
   * 是否启用深度测试，关闭后精灵总是显示在最前面
   * @default true
   */
  depthTest: {
    type: Boolean,
    default: true
  },
  /**
   * 是否写入深度缓存，半透明物体建议关闭
   * @default false
   */
  depthWrite: {
    type: Boolean,
    default: false
  },
  /**
   * 是否启用透视大小衰减，关闭后精灵像素级大小不变
   * @default true
   */
  sizeAttenuation: {
    type: Boolean,
    default: true
  },
  /**
   * 混合模式，控制与背景颜色的混合方式
   * @default undefined
   */
  blending: {
    type: String as PropType<'normal' | 'additive' | 'subtractive' | 'multiply' | 'screen'>,
    default: undefined
  },
  /**
   * 裁剪模式，精灵形状控制
   * @default 'none'
   */
  clip: {
    type: String as PropType<'none' | 'circle' | 'rounded'>,
    default: 'none'
  },
  /**
   * 圆角裁剪半径，clip="rounded" 时生效
   * @default 0
   */
  borderRadius: {
    type: Number,
    default: 0
  },
  /**
   * 颜色叠加着色，给精灵整体上色
   * @default undefined
   */
  tint: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  /**
   * 最小可见距离，相机距离小于此值时精灵隐藏
   * @default 0
   */
  minDistance: {
    type: Number,
    default: 0
  },
  /**
   * 最大可见距离，相机距离大于此值时精灵隐藏
   * @default Infinity
   */
  maxDistance: {
    type: Number,
    default: Infinity
  },
  /**
   * 点击事件回调
   */
  onClick: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 双击事件回调
   */
  onDblclick: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 右键菜单事件回调
   */
  onContextmenu: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 鼠标进入事件回调
   */
  onPointerEnter: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 鼠标离开事件回调
   */
  onPointerLeave: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  },
  /**
   * 鼠标移动事件回调
   */
  onPointerMove: {
    type: Function as PropType<(e: InteractionEvent) => void>,
    default: undefined
  }
})

/**
 * 交互上下文，用于注册/注销鼠标事件
 */
const interactionCtx = inject(InteractionContextKey, null)

/**
 * 精灵配置计算属性
 * 优先使用 config 属性，否则根据独立属性合成配置
 */
const spriteConfig = computed((): SpriteConfig => {
  if (props.config) {
    return props.config
  }
  const materialConfig: SpriteMaterialConfig = {
    type: 'sprite',
    color: props.color,
    opacity: props.opacity,
    transparent: props.transparent,
    rotation: props.rotation,
    fog: props.fog,
    depthTest: props.depthTest,
    depthWrite: props.depthWrite,
    sizeAttenuation: props.sizeAttenuation,
    blending: props.blending,
    clip: props.clip,
    borderRadius: props.borderRadius,
    tint: props.tint
  }

  if (props.minDistance > 0) {
    materialConfig.minDistance = props.minDistance
  }
  if (isFinite(props.maxDistance)) {
    materialConfig.maxDistance = props.maxDistance
  }

  return {
    position: props.position,
    scale: props.scale,
    visible: props.visible,
    renderOrder: props.renderOrder,
    center: props.center,
    material: materialConfig
  }
})

/**
 * useSprite composable 实例化
 * sprite: ShallowRef<Sprite> - Three.js Sprite 实例
 * setMaterial: 切换精灵材质
 * setCenter: 设置中心点对齐
 * setMaterialConfig: 更新材质配置
 */
const { sprite, setMaterial, setCenter, setMaterialConfig } = useSprite(spriteConfig)

/**
 * 组件挂载后应用初始配置
 */
onMounted(() => {
  if (sprite.value) {
    ThreeObjectFactory.applyObject3DConfig(sprite.value, spriteConfig.value)
  }
})

/**
 * 监听 Object3D 属性变化，实时更新精灵变换
 * 仅在未使用 config 属性时生效
 */
function updateSpriteTransform() {
  if (!sprite.value || props.config) return
  const config: Partial<SpriteConfig> = {
    position: props.position,
    scale: props.scale,
    visible: props.visible,
    renderOrder: props.renderOrder
  }
  ThreeObjectFactory.updateObject3DConfig(sprite.value, config)
}

function updateSpriteMaterial() {
  if (!sprite.value || props.config) return
  const materialConfig: SpriteMaterialConfig = {
    type: 'sprite',
    color: props.color,
    opacity: props.opacity,
    transparent: props.transparent,
    rotation: props.rotation,
    fog: props.fog,
    depthTest: props.depthTest,
    depthWrite: props.depthWrite,
    sizeAttenuation: props.sizeAttenuation,
    blending: props.blending as any,
    clip: props.clip,
    borderRadius: props.borderRadius,
    tint: props.tint
  }
  if (props.minDistance > 0) {
    materialConfig.minDistance = props.minDistance
  }
  if (isFinite(props.maxDistance)) {
    materialConfig.maxDistance = props.maxDistance
  }
  setMaterialConfig(materialConfig)
}

watch(() => props.position, updateSpriteTransform, { deep: true })
watch(() => props.scale, updateSpriteTransform, { deep: true })
watch(() => props.visible, updateSpriteTransform)
watch(() => props.renderOrder, updateSpriteTransform)

watch(
  () => props.color,
  () => updateSpriteMaterial()
)
watch(
  () => props.opacity,
  () => updateSpriteMaterial()
)
watch(
  () => props.transparent,
  () => updateSpriteMaterial()
)
watch(
  () => props.rotation,
  () => updateSpriteMaterial()
)
watch(
  () => props.fog,
  () => updateSpriteMaterial()
)
watch(
  () => props.depthTest,
  () => updateSpriteMaterial()
)
watch(
  () => props.depthWrite,
  () => updateSpriteMaterial()
)
watch(
  () => props.sizeAttenuation,
  () => updateSpriteMaterial()
)
watch(
  () => props.blending,
  () => updateSpriteMaterial()
)
watch(
  () => props.clip,
  () => updateSpriteMaterial()
)
watch(
  () => props.borderRadius,
  () => updateSpriteMaterial()
)
watch(
  () => props.tint,
  () => updateSpriteMaterial()
)
watch(
  () => props.minDistance,
  () => updateSpriteMaterial()
)
watch(
  () => props.maxDistance,
  () => updateSpriteMaterial()
)

watch(
  () => props.center,
  newCenter => {
    if (!sprite.value || props.config) return
    if (newCenter) {
      setCenter(newCenter)
    }
  }
)

/**
 * 监听精灵实例和事件回调，注册交互事件
 */
watch(
  [
    () => sprite.value,
    () => props.onClick,
    () => props.onDblclick,
    () => props.onContextmenu,
    () => props.onPointerEnter,
    () => props.onPointerLeave,
    () => props.onPointerMove
  ],
  ([spriteObj]) => {
    if (spriteObj && interactionCtx) {
      interactionCtx.unregisterObject(spriteObj)
      interactionCtx.registerObject(spriteObj, {
        onClick: props.onClick,
        onDblclick: props.onDblclick,
        onContextmenu: props.onContextmenu,
        onPointerEnter: props.onPointerEnter,
        onPointerLeave: props.onPointerLeave,
        onPointerMove: props.onPointerMove
      })
    }
  },
  { immediate: true, deep: false, flush: 'post' }
)

/**
 * 组件卸载前注销交互事件
 */
onBeforeUnmount(() => {
  if (sprite.value && interactionCtx) {
    interactionCtx.unregisterObject(sprite.value)
  }
})

/**
 * @expose
 * @property sprite - Three.js Sprite 实例引用
 * @property setMaterial - 设置精灵材质
 * @property setCenter - 设置精灵中心点对齐
 * @property setMaterialConfig - 更新材质配置
 */
defineExpose({
  sprite,
  setMaterial,
  setCenter,
  setMaterialConfig
})
</script>
