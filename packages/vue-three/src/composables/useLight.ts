import { inject, onBeforeUnmount, watch } from 'vue'
import { Light } from 'three'
import { ThreeContextKey, GroupContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { LightConfig } from '../types'
import { disposeObject3D } from '../core/cleanup'

export function useLight(config: LightConfig) {
  const ctx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useLight must be used within a TCanvas component')
  }

  // 直接使用普通变量
  const light: Light = createLight(config)

  // 直接获取 parent
  const parent = groupCtx?.group || ctx.scene

  // 立即添加到父对象
  if (!parent.children.includes(light)) {
    parent.add(light)
  }

  function createLight(lightConfig: LightConfig) {
    const newLight = ThreeObjectFactory.createLight(lightConfig) as Light
    ThreeObjectFactory.applyObject3DConfig(newLight, lightConfig)
    return newLight
  }

  watch(
    () => config,
    newConfig => {
      ThreeObjectFactory.updateObject3DConfig(light, newConfig)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    parent.remove(light)
    disposeObject3D(light)
  })

  return {
    light
  }
}
