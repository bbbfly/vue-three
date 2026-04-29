<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watch, inject, onBeforeUnmount, computed, shallowRef } from 'vue'
import { Texture, TextureLoader } from 'three'
import { SpriteContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { SpriteMaterialConfig, BlendingMode, SpriteClipMode } from '../types'

/**
 * 精灵材质组件
 * @description 精灵专用材质组件，支持纹理、混合模式、裁剪着色器、颜色叠加等特效
 * @component TSpriteMaterial
 * @example
 * // 基础带纹理精灵
 * <TSpriteMaterial
 *   map="/textures/marker.png"
 *   transparent
 * />
 * @example
 * // 圆形裁剪 + 颜色叠加
 * <TSpriteMaterial
 *   clip="circle"
 *   tint="#ff0000"
 *   blending="additive"
 * />
 * @example
 * // 圆角裁剪
 * <TSpriteMaterial
 *   clip="rounded"
 *   :border-radius="0.2"
 * />
 */
const props = defineProps({
  /**
   * 材质颜色，支持十六进制或 CSS 颜色字符串
   * @default 0xffffff (白色)
   */
  color: {
    type: [String, Number] as PropType<string | number>,
    default: 0xffffff
  },
  /**
   * 颜色纹理贴图 URL，加载后作为精灵图案
   * @default undefined
   */
  map: {
    type: String,
    default: undefined
  },
  /**
   * Alpha 透明度贴图 URL，控制各区域透明度
   * @default undefined
   */
  alphaMap: {
    type: String,
    default: undefined
  },
  /**
   * 材质旋转角度，单位弧度
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
   * 是否启用透明度，使用纹理或混合模式时必须设为 true
   * @default true
   */
  transparent: {
    type: Boolean,
    default: true
  },
  /**
   * 透明度值，范围 0-1
   * @default 1 (不透明)
   */
  opacity: {
    type: Number,
    default: 1
  },
  /**
   * 是否启用深度测试，关闭后总是显示在最前面
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
   * 是否启用透视大小衰减，关闭后像素级大小不变
   * @default true
   */
  sizeAttenuation: {
    type: Boolean,
    default: true
  },
  /**
   * 混合模式
   * - normal: 正常混合
   * - additive: 加法混合（光晕、发光效果）
   * - subtractive: 减法混合
   * - multiply: 正片叠底
   * - screen: 滤色混合
   * @default undefined
   */
  blending: {
    type: String as PropType<BlendingMode>,
    default: undefined
  },
  /**
   * 混合源因子，自定义混合使用
   * @default undefined
   */
  blendSrc: {
    type: String as PropType<
      'SrcAlpha' | 'OneMinusSrcAlpha' | 'One' | 'DstColor' | 'OneMinusDstColor'
    >,
    default: undefined
  },
  /**
   * 混合目标因子，自定义混合使用
   * @default undefined
   */
  blendDst: {
    type: String as PropType<
      'SrcAlpha' | 'OneMinusSrcAlpha' | 'One' | 'DstColor' | 'OneMinusDstColor'
    >,
    default: undefined
  },
  /**
   * 颜色叠加着色，给精灵整体上色（需要着色器扩展）
   * @default undefined
   */
  tint: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  /**
   * 裁剪模式（需要着色器扩展）
   * - none: 无裁剪，方形
   * - circle: 圆形裁剪
   * - rounded: 圆角矩形裁剪
   * @default 'none'
   */
  clip: {
    type: String as PropType<SpriteClipMode>,
    default: 'none'
  },
  /**
   * 圆角裁剪半径，clip="rounded" 时生效，范围 0-0.5
   * @default 0
   */
  borderRadius: {
    type: Number,
    default: 0
  },
  /**
   * 最小可见距离，相机距离小于此值时隐藏
   * @default 0
   */
  minDistance: {
    type: Number,
    default: 0
  },
  /**
   * 最大可见距离，相机距离大于此值时隐藏
   * @default Infinity
   */
  maxDistance: {
    type: Number,
    default: Infinity
  }
})

/**
 * 注入父精灵上下文
 * 必须在 TSprite 组件插槽内使用
 */
const spriteCtx = inject(SpriteContextKey)

if (!spriteCtx) {
  throw new Error('TSpriteMaterial 必须在 TSprite 组件内使用')
}

/**
 * 材质配置计算属性
 */
const materialConfig = computed(
  (): SpriteMaterialConfig => ({
    type: 'sprite',
    color: props.color,
    rotation: props.rotation,
    fog: props.fog,
    transparent: props.transparent,
    opacity: props.opacity,
    depthTest: props.depthTest,
    depthWrite: props.depthWrite,
    sizeAttenuation: props.sizeAttenuation,
    blending: props.blending,
    blendSrc: props.blendSrc,
    blendDst: props.blendDst,
    tint: props.tint,
    clip: props.clip,
    borderRadius: props.borderRadius,
    minDistance: props.minDistance,
    maxDistance: props.maxDistance
  })
)

/**
 * 创建 SpriteMaterial 实例并绑定到父精灵
 */
const material = ThreeObjectFactory.createSpriteMaterial(materialConfig.value)

spriteCtx.setMaterial(material)

/**
 * 加载纹理贴图
 */
const loader = new TextureLoader()
const mapTexture = shallowRef<Texture | null>(null)
const alphaMapTexture = shallowRef<Texture | null>(null)

if (props.map) {
  mapTexture.value = loader.load(props.map, () => {
    material.map = mapTexture.value
    material.needsUpdate = true
  })
}

if (props.alphaMap) {
  alphaMapTexture.value = loader.load(props.alphaMap, () => {
    material.alphaMap = alphaMapTexture.value
    material.needsUpdate = true
  })
}

/**
 * 监听颜色变化
 */
watch(
  () => props.color,
  newColor => {
    material.color.set(newColor)
  }
)

/**
 * 监听旋转变化
 */
watch(
  () => props.rotation,
  newValue => {
    material.rotation = newValue
  }
)

/**
 * 监听透明度变化
 */
watch(
  () => props.opacity,
  newValue => {
    material.opacity = newValue
  }
)

/**
 * 监听透明度开关变化
 */
watch(
  () => props.transparent,
  newValue => {
    material.transparent = newValue
  }
)

/**
 * 监听深度测试开关变化
 */
watch(
  () => props.depthTest,
  newValue => {
    material.depthTest = newValue
  }
)

/**
 * 监听深度写入开关变化
 */
watch(
  () => props.depthWrite,
  newValue => {
    material.depthWrite = newValue
  }
)

/**
 * 监听透视大小衰减开关变化
 */
watch(
  () => props.sizeAttenuation,
  newValue => {
    material.sizeAttenuation = newValue
  }
)

/**
 * 监听混合模式变化
 */
watch(
  () => props.blending,
  newValue => {
    if (newValue) {
      material.blending = ThreeObjectFactory.resolveBlendingMode(newValue) as any
      material.needsUpdate = true
    }
  }
)

/**
 * 监听裁剪模式变化
 * 触发着色器重新编译
 */
watch(
  () => props.clip,
  newValue => {
    material.userData.clip = newValue
    if (newValue !== 'none' && !material.onBeforeCompile) {
      material.customProgramCacheKey = () =>
        `${newValue}-${material.userData.borderRadius}-${material.userData.tint}`
      material.needsUpdate = true
    }
  }
)

/**
 * 监听圆角半径变化
 * 触发着色器重新编译
 */
watch(
  () => props.borderRadius,
  newValue => {
    material.userData.borderRadius = newValue
    material.customProgramCacheKey = () =>
      `${material.userData.clip}-${newValue}-${material.userData.tint}`
    material.needsUpdate = true
  }
)

/**
 * 监听颜色叠加变化
 * 触发着色器重新编译
 */
watch(
  () => props.tint,
  newValue => {
    material.userData.tint = newValue
    if (newValue && !material.onBeforeCompile) {
      material.customProgramCacheKey = () =>
        `${material.userData.clip}-${material.userData.borderRadius}-${newValue}`
      material.needsUpdate = true
    }
  }
)

/**
 * 组件卸载时释放材质资源
 */
onBeforeUnmount(() => {
  material.dispose()
})

/**
 * @expose
 * @property material - Three.js SpriteMaterial 实例引用
 */
defineExpose({
  material
})
</script>
