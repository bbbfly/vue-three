import { inject, shallowRef, onBeforeUnmount, watch, provide, computed, unref } from 'vue'
import type { MaybeRef } from 'vue'
import { Sprite, SpriteMaterial, Color } from 'three'
import { ThreeContextKey, SpriteContextKey } from '../core/context'
import { ThreeObjectFactory } from '../core/factory'
import type { SpriteConfig, SpriteMaterialConfig } from '../types'
import { disposeMaterial } from '../core/cleanup'

export function useSprite(config?: MaybeRef<SpriteConfig>) {
  const ctx = inject(ThreeContextKey)

  if (!ctx) {
    throw new Error('useSprite must be used within a TCanvas component')
  }

  const sprite = shallowRef<Sprite>()
  const spriteMaterial = shallowRef<SpriteMaterial>()

  function applyShaderExtensions(material: SpriteMaterial): void {
    material.onBeforeCompile = shader => {
      shader.uniforms.uClipMode = { value: 0 }
      shader.uniforms.uBorderRadius = { value: 0 }
      shader.uniforms.uTintColor = { value: null }

      if (material.userData.clip === 'circle') {
        shader.uniforms.uClipMode.value = 1
      } else if (material.userData.clip === 'rounded') {
        shader.uniforms.uClipMode.value = 2
        shader.uniforms.uBorderRadius.value = material.userData.borderRadius ?? 0
      }

      if (material.userData.tint) {
        const color = new Color(material.userData.tint)
        shader.uniforms.uTintColor.value = [color.r, color.g, color.b]
        shader.uniforms.uUseTint = { value: 1 }
      } else {
        shader.uniforms.uUseTint = { value: 0 }
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
    spriteMaterial.value = newSprite.material as SpriteMaterial

    if (
      spriteConfig.material.clip === 'circle' ||
      spriteConfig.material.clip === 'rounded' ||
      spriteConfig.material.tint
    ) {
      applyShaderExtensions(spriteMaterial.value)
    }

    return newSprite
  }

  const ctx_ = ctx!

  if (config) {
    const configValue = unref(config)
    sprite.value = createSprite(configValue)

    if (ctx_.scene.value) {
      ctx_.scene.value.add(sprite.value)
    }
  } else {
    const defaultConfig: SpriteConfig = {
      material: { type: 'sprite' }
    }
    sprite.value = createSprite(defaultConfig)

    if (ctx_.scene.value) {
      ctx_.scene.value.add(sprite.value)
    }
  }

  function setMaterial(material: SpriteMaterial): void {
    if (!sprite.value) return

    if (spriteMaterial.value) {
      disposeMaterial(spriteMaterial.value)
    }

    spriteMaterial.value = material
    sprite.value.material = material
    material.needsUpdate = true
  }

  function setCenter(center: [number, number]): void {
    if (sprite.value) {
      sprite.value.center.set(...center)
    }
  }

  function updateDistanceVisibility(): void {
    if (!sprite.value || !ctx_.camera.value) return

    const material = sprite.value.material as SpriteMaterial
    const minDistance = material.userData.minDistance ?? 0
    const maxDistance = material.userData.maxDistance ?? Infinity

    const distance = sprite.value.position.distanceTo(ctx_.camera.value.position)
    sprite.value.visible = distance >= minDistance && distance <= maxDistance
  }

  function setMaterialConfig(materialConfig: SpriteMaterialConfig): void {
    if (!sprite.value) return

    const material = sprite.value.material as SpriteMaterial

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

    if (materialConfig.blending) {
      material.blending = ThreeObjectFactory.resolveBlendingMode(materialConfig.blending) as any
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
    material.userData.minDistance = materialConfig.minDistance ?? 0
    material.userData.maxDistance = materialConfig.maxDistance ?? Infinity

    if (
      materialConfig.clip === 'circle' ||
      materialConfig.clip === 'rounded' ||
      materialConfig.tint
    ) {
      if (!material.onBeforeCompile) {
        applyShaderExtensions(material)
      } else {
        material.customProgramCacheKey = () =>
          `${material.userData.clip}-${material.userData.borderRadius}-${material.userData.tint}`
      }
    }

    material.needsUpdate = true
  }

  if (config) {
    watch(
      () => unref(config),
      newConfig => {
        ThreeObjectFactory.updateObject3DConfig(sprite.value!, newConfig)

        if (newConfig.material) {
          setMaterialConfig(newConfig.material)
        }

        if (newConfig.center) {
          setCenter(newConfig.center)
        }

        if (newConfig.renderOrder !== undefined && sprite.value) {
          sprite.value.renderOrder = newConfig.renderOrder
        }
      },
      { deep: true }
    )
  }

  let animationFrameId: number | null = null

  const hasDistanceControl = computed(() => {
    if (!spriteMaterial.value) return false
    const minDistance = spriteMaterial.value.userData.minDistance ?? 0
    const maxDistance = spriteMaterial.value.userData.maxDistance ?? Infinity
    return minDistance > 0 || maxDistance < Infinity
  })

  if (hasDistanceControl.value) {
    const animate = () => {
      updateDistanceVisibility()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  onBeforeUnmount(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }

    if (ctx_.scene.value && sprite.value) {
      ctx_.scene.value.remove(sprite.value)
    }

    if (spriteMaterial.value) {
      disposeMaterial(spriteMaterial.value)
    }

    if (sprite.value) {
      sprite.value = undefined
    }
  })

  provide(SpriteContextKey, {
    sprite: sprite as any,
    setMaterial
  })

  return {
    sprite,
    setMaterial,
    setCenter,
    setMaterialConfig,
    updateDistanceVisibility
  }
}
