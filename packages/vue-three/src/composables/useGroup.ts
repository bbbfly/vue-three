import { inject, shallowRef, onBeforeUnmount, watch, provide, computed } from 'vue'
import { Group } from 'three'
import {
  ThreeContextKey,
  GroupContextKey,
  CSS3DGroupContextKey,
  CSS2DGroupContextKey,
  CSS3DContextKey,
  CSS2DContextKey
} from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { Object3DConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export interface GroupConfig extends Object3DConfig {
  name?: string
}

export function useGroup(config?: GroupConfig) {
  const ctx = inject(ThreeContextKey)

  // 注入多种上下文（按优先级顺序）
  const parentGroupCtx = inject(GroupContextKey, null)
  const css3dGroupCtx = inject(CSS3DGroupContextKey, null)
  const css2dGroupCtx = inject(CSS2DGroupContextKey, null)
  const css3dCtx = inject(CSS3DContextKey, null)
  const css2dCtx = inject(CSS2DContextKey, null)

  if (!ctx) {
    throw new Error('useGroup must be used within a TCanvas component')
  }

  const group = shallowRef<Group>(new Group())

  // 多场景父容器优先级逻辑
  // 优先级：同类型 GroupContext > 对应渲染器上下文场景 > WebGL 主场景
  const parent = computed(() => {
    // 1. 优先使用同类型的父 Group
    if (css3dGroupCtx) {
      return css3dGroupCtx.group.value
    }
    if (css2dGroupCtx) {
      return css2dGroupCtx.group.value
    }
    if (parentGroupCtx) {
      return parentGroupCtx.group.value
    }

    // 2. 检查是否在 CSS3D/CSS2D 上下文中
    const css3dScene = ctx.getScene('css3d')
    const css2dScene = ctx.getScene('css2d')

    // 根据注入的上下文判断目标场景
    console.log(css3dCtx, css3dScene, 'hasParent')
    if (css3dCtx && css3dScene) {
      return css3dScene
    }
    if (css2dCtx && css2dScene) {
      return css2dScene
    }

    // 3. 默认使用 WebGL 主场景
    return ctx.scene.value
  })

  watch(
    parent,
    newParent => {
      console.log(newParent, 'useGroup')
      if (newParent && !newParent.children.includes(group.value)) {
        newParent.add(group.value)
      }
    },
    { immediate: true }
  )

  if (config) {
    watch(
      () => config,
      newConfig => {
        ThreeObjectFactory.updateObject3DConfig(group.value, newConfig)
        if (newConfig.name !== undefined) {
          group.value.name = newConfig.name
        }
      },
      { deep: true }
    )

    if (config.name !== undefined) {
      group.value.name = config.name
    }
  }

  // 根据上下文提供对应类型的 GroupContext
  // 在 CSS3D 上下文中提供 CSS3DGroupContext
  if (css3dCtx) {
    provide(CSS3DGroupContextKey, { group })
  }
  // 在 CSS2D 上下文中提供 CSS2DGroupContext
  else if (css2dCtx) {
    provide(CSS2DGroupContextKey, { group })
  }
  // 默认提供 WebGL 的 GroupContext
  else {
    provide(GroupContextKey, { group })
  }

  onBeforeUnmount(() => {
    if (parent.value) {
      parent.value.remove(group.value)
    }
    disposeObject3D(group.value)
  })

  return { group }
}
