import { inject, onBeforeUnmount, watch, provide } from 'vue'
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

  // 直接使用普通变量
  const group = new Group()

  // 多场景父容器优先级逻辑
  // 优先级：同类型 GroupContext > 对应渲染器上下文场景 > WebGL 主场景
  let parent: Group | THREE.Scene
  if (css3dGroupCtx) {
    parent = css3dGroupCtx.group
  } else if (css2dGroupCtx) {
    parent = css2dGroupCtx.group
  } else if (parentGroupCtx) {
    parent = parentGroupCtx.group
  } else {
    const css3dScene = ctx.getScene('css3d')
    const css2dScene = ctx.getScene('css2d')
    if (css3dCtx && css3dScene) {
      parent = css3dScene
    } else if (css2dCtx && css2dScene) {
      parent = css2dScene
    } else {
      parent = ctx.scene
    }
  }

  // 立即添加到父对象
  if (!parent.children.includes(group)) {
    parent.add(group)
  }

  if (config) {
    watch(
      () => config,
      newConfig => {
        ThreeObjectFactory.updateObject3DConfig(group, newConfig)
        if (newConfig.name !== undefined) {
          group.name = newConfig.name
        }
      },
      { deep: true }
    )

    if (config.name !== undefined) {
      group.name = config.name
    }
  }

  // 根据上下文提供对应类型的 GroupContext
  if (css3dCtx) {
    provide(CSS3DGroupContextKey, { group })
  } else if (css2dCtx) {
    provide(CSS2DGroupContextKey, { group })
  } else {
    provide(GroupContextKey, { group })
  }

  onBeforeUnmount(() => {
    parent.remove(group)
    disposeObject3D(group)
  })

  return { group }
}
