import { inject, onBeforeUnmount, watch, provide, ref, unref } from 'vue'
import type { MaybeRef } from 'vue'
import { Sprite, SpriteMaterial as ThreeSpriteMaterial, Color } from 'three'
import type { SpriteMaterial } from 'three'
import { ThreeContextKey, SpriteContextKey, GroupContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { SpriteConfig, SpriteMaterialConfig } from '../types'
import { disposeMaterial } from '../core/cleanup'

export function useSprite(config?: MaybeRef<SpriteConfig>) {
  const ctx = inject(ThreeContextKey)
  const groupCtx = inject(GroupContextKey, null)

  if (!ctx) {
    throw new Error('useSprite must be used within a TCanvas component')
  }

  // 使用普通变量存储
  let sprite: Sprite | undefined
  let spriteMaterial: ThreeSpriteMaterial | undefined

  function applyShaderExtensions(material: SpriteMaterial): void {
    material.onBeforeCompile = shader => {
      shader.uniforms.uClipMode = { value: 0 }
      shader.uniforms.uBorderRadius = { value: 0 }
      shader.uniforms.uTintColor = { value: [1.0, 1.0, 1.0] }
      shader.uniforms.uUseTint = { value: 0 }

      if (material.userData.clip === 'circle') {
        shader.uniforms.uClipMode.value = 1
      } else if (material.userData.clip === 'rounded') {
        shader.uniforms.uClipMode.value = 2
        shader.uniforms.uBorderRadius.value = material.userData.borderRadius ?? 0
      }

      if (material.userData.tint) {
        const color = new Color(material.userData.tint)
        shader.uniforms.uTintColor.value = [color.r, color.g, color.b]
        shader.uniforms.uUseTint.value = 1
      }

      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `
        uniform int uClipMode;
        uniform float uBorderRadius;
        uniform vec3 uTintColor;
        uniform int uUseTint;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 q = abs(p) - b + r;
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
        }

        void main() {
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        #include <map_fragment>

        vec2 uv = gl_PointCoord - 0.5;

        if (uClipMode == 1) {
          float dist = length(uv);
          if (dist > 0.5) discard;
        }

        if (uClipMode == 2) {
          float d = roundedBoxSDF(uv, vec2(0.5 - uBorderRadius), uBorderRadius);
          if (d > 0.0) discard;
        }

        if (uUseTint == 1) {
          diffuseColor.rgb *= uTintColor;
        }
        `
      )
    }

    material.needsUpdate = true
  }

  function createSprite(spriteConfig: SpriteConfig): Sprite {
    const newSprite = ThreeObjectFactory.createSprite(spriteConfig)
    spriteMaterial = newSprite.material as ThreeSpriteMaterial

    if (
      spriteConfig.material.clip === 'circle' ||
      spriteConfig.material.clip === 'rounded' ||
      spriteConfig.material.tint
    ) {
      applyShaderExtensions(spriteMaterial)
    }

    return newSprite
  }

  // 直接获取 parent
  const parent = groupCtx?.group || ctx.scene

  if (config) {
    const configValue = unref(config)
    sprite = createSprite(configValue)
    parent.add(sprite)
  } else {
    const defaultConfig: SpriteConfig = {
      material: { type: 'sprite' }
    }
    sprite = createSprite(defaultConfig)
    parent.add(sprite)
  }

  function setMaterial(material: ThreeSpriteMaterial): void {
    if (!sprite) return

    if (spriteMaterial) {
      disposeMaterial(spriteMaterial)
    }

    spriteMaterial = material
    sprite.material = material
    material.needsUpdate = true
  }

  function setCenter(center: [number, number]): void {
    if (sprite) {
      sprite.center.set(...center)
    }
  }

  function updateDistanceVisibility(): void {
    if (!sprite) return

    const material = sprite.material as ThreeSpriteMaterial
    const minDistance = material.userData.minDistance
    const maxDistance = material.userData.maxDistance

    const hasMinDistance = typeof minDistance === 'number' && minDistance > 0
    const hasMaxDistance = typeof maxDistance === 'number' && isFinite(maxDistance)

    if (!hasMinDistance && !hasMaxDistance) {
      return
    }

    const distance = sprite.position.distanceTo(ctx.camera.position)
    const minOk = hasMinDistance ? distance >= minDistance : true
    const maxOk = hasMaxDistance ? distance <= maxDistance : true
    sprite.visible = minOk && maxOk
  }

  function setMaterialConfig(materialConfig: SpriteMaterialConfig): void {
    if (!sprite || !materialConfig) return

    const material = sprite.material as ThreeSpriteMaterial

    if (materialConfig.color !== undefined) {
      material.color.set(materialConfig.color)
    }

    if (materialConfig.rotation !== undefined) {
      material.rotation = materialConfig.rotation
    }

    if (materialConfig.fog !== undefined) {
      material.fog = materialConfig.fog
    }

    if (materialConfig.transparent !== undefined) {
      material.transparent = materialConfig.transparent
    }

    if (materialConfig.opacity !== undefined) {
      material.opacity = materialConfig.opacity
    }

    if (materialConfig.depthTest !== undefined) {
      material.depthTest = materialConfig.depthTest
    }

    if (materialConfig.depthWrite !== undefined) {
      material.depthWrite = materialConfig.depthWrite
    }

    if (materialConfig.sizeAttenuation !== undefined) {
      material.sizeAttenuation = materialConfig.sizeAttenuation
    }

    const blendingValue = materialConfig.blending
    const validBlendingModes = ['additive', 'multiply', 'screen']
    if (blendingValue && validBlendingModes.includes(String(blendingValue))) {
      material.blending = ThreeObjectFactory.resolveBlendingMode(blendingValue as any) as any
      material.premultipliedAlpha = blendingValue === 'multiply'
    } else {
      material.blending = 1 // NormalBlending
      material.premultipliedAlpha = false
    }

    if (materialConfig.blendSrc) {
      material.blendSrc = ThreeObjectFactory.resolveBlendingFactor(materialConfig.blendSrc) as any
    }

    if (materialConfig.blendDst) {
      material.blendDst = ThreeObjectFactory.resolveBlendingFactor(materialConfig.blendDst) as any
    }

    material.userData.clip = materialConfig.clip ?? 'none'
    material.userData.borderRadius = materialConfig.borderRadius ?? 0
    material.userData.tint = materialConfig.tint
    if (typeof materialConfig.minDistance === 'number' && materialConfig.minDistance > 0) {
      material.userData.minDistance = materialConfig.minDistance
    }
    if (typeof materialConfig.maxDistance === 'number' && isFinite(materialConfig.maxDistance)) {
      material.userData.maxDistance = materialConfig.maxDistance
    }

    const needsShader =
      material.userData.clip === 'circle' ||
      material.userData.clip === 'rounded' ||
      material.userData.tint

    if (needsShader) {
      if (!material.onBeforeCompile) {
        applyShaderExtensions(material)
      }
      ;(material as any).customProgramCacheKey = () =>
        `${material.userData.clip}-${material.userData.borderRadius}-${material.userData.tint}`
    } else {
      material.onBeforeCompile = null as any
      if ('customProgramCacheKey' in material) {
        delete (material as any).customProgramCacheKey
      }
    }

    material.needsUpdate = true
  }

  // 使用 ref 来触发距离控制的响应式
  const hasDistanceControl = ref(false)

  const updateDistanceControl = () => {
    if (!spriteMaterial) {
      hasDistanceControl.value = false
      return
    }
    const minDistance = spriteMaterial.userData.minDistance
    const maxDistance = spriteMaterial.userData.maxDistance
    const hasMinDistance = typeof minDistance === 'number' && minDistance > 0
    const hasMaxDistance = typeof maxDistance === 'number' && isFinite(maxDistance)
    hasDistanceControl.value = hasMinDistance || hasMaxDistance
  }

  // 初始化时检查
  updateDistanceControl()

  // 监听配置变化
  if (unref(config) !== undefined) {
    watch(
      () => unref(config),
      newConfig => {
        if (!newConfig || !sprite) return
        ThreeObjectFactory.updateObject3DConfig(sprite, newConfig)

        if (newConfig.material) {
          setMaterialConfig(newConfig.material)
          updateDistanceControl()
        }

        if (newConfig.center) {
          setCenter(newConfig.center)
        }

        if (newConfig.renderOrder !== undefined) {
          sprite.renderOrder = newConfig.renderOrder
        }
      },
      { deep: true }
    )
  }

  let animationFrameId: number | null = null

  function startDistanceLoop() {
    if (animationFrameId !== null) return
    const animate = () => {
      updateDistanceVisibility()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  function stopDistanceLoop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  watch(
    hasDistanceControl,
    shouldEnable => {
      if (shouldEnable) {
        startDistanceLoop()
      } else {
        stopDistanceLoop()
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }

    if (sprite) {
      parent.remove(sprite)
    }

    if (spriteMaterial) {
      disposeMaterial(spriteMaterial)
    }
  })

  provide(SpriteContextKey, {
    sprite: sprite!,
    setMaterial
  })

  return {
    sprite: sprite!,
    setMaterial,
    setCenter,
    setMaterialConfig,
    updateDistanceVisibility
  }
}
