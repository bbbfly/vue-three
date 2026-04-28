import type GUI from 'lil-gui'
import type { SceneObject } from '../stores/scene'
import type { Material, MeshStandardMaterial, MeshLambertMaterial, MeshPhongMaterial } from 'three'

interface ControllerConfig {
  name: string
  property: string
  min?: number
  max?: number
  step?: number
  isColor?: boolean
}

interface FolderConfig {
  name: string
  controllers: ControllerConfig[]
}

export interface GuiObjectConfig {
  folders: FolderConfig[]
}

export function getDefaultObjectConfig(type: string): GuiObjectConfig {
  const transformConfig: FolderConfig = {
    name: 'Transform',
    controllers: [
      { name: 'Position X', property: 'position.x', min: -50, max: 50, step: 0.1 },
      { name: 'Position Y', property: 'position.y', min: -50, max: 50, step: 0.1 },
      { name: 'Position Z', property: 'position.z', min: -50, max: 50, step: 0.1 },
      { name: 'Rotation X', property: 'rotation.x', min: -Math.PI, max: Math.PI, step: 0.01 },
      { name: 'Rotation Y', property: 'rotation.y', min: -Math.PI, max: Math.PI, step: 0.01 },
      { name: 'Rotation Z', property: 'rotation.z', min: -Math.PI, max: Math.PI, step: 0.01 },
      { name: 'Scale X', property: 'scale.x', min: 0.01, max: 10, step: 0.1 },
      { name: 'Scale Y', property: 'scale.y', min: 0.01, max: 10, step: 0.1 },
      { name: 'Scale Z', property: 'scale.z', min: 0.01, max: 10, step: 0.1 }
    ]
  }

  const configs: Record<string, GuiObjectConfig> = {
    Mesh: {
      folders: [transformConfig]
    },
    AmbientLight: {
      folders: [
        transformConfig,
        {
          name: 'Light',
          controllers: [
            { name: 'Color', property: 'color', isColor: true },
            { name: 'Intensity', property: 'intensity', min: 0, max: 5, step: 0.1 }
          ]
        }
      ]
    },
    DirectionalLight: {
      folders: [
        transformConfig,
        {
          name: 'Light',
          controllers: [
            { name: 'Color', property: 'color', isColor: true },
            { name: 'Intensity', property: 'intensity', min: 0, max: 5, step: 0.1 }
          ]
        }
      ]
    },
    PointLight: {
      folders: [
        transformConfig,
        {
          name: 'Light',
          controllers: [
            { name: 'Color', property: 'color', isColor: true },
            { name: 'Intensity', property: 'intensity', min: 0, max: 10, step: 0.1 },
            { name: 'Distance', property: 'distance', min: 0, max: 100, step: 1 },
            { name: 'Decay', property: 'decay', min: 0, max: 5, step: 0.1 }
          ]
        }
      ]
    },
    SpotLight: {
      folders: [
        transformConfig,
        {
          name: 'Light',
          controllers: [
            { name: 'Color', property: 'color', isColor: true },
            { name: 'Intensity', property: 'intensity', min: 0, max: 500, step: 10 },
            { name: 'Distance', property: 'distance', min: 0, max: 100, step: 1 },
            { name: 'Angle', property: 'angle', min: 0, max: Math.PI / 2, step: 0.01 },
            { name: 'Penumbra', property: 'penumbra', min: 0, max: 1, step: 0.01 },
            { name: 'Decay', property: 'decay', min: 0, max: 5, step: 0.1 }
          ]
        }
      ]
    },
    PerspectiveCamera: {
      folders: [
        transformConfig,
        {
          name: 'Camera',
          controllers: [
            { name: 'FOV', property: 'fov', min: 1, max: 120, step: 1 },
            { name: 'Near', property: 'near', min: 0.01, max: 100, step: 0.1 },
            { name: 'Far', property: 'far', min: 10, max: 5000, step: 10 },
            { name: 'Zoom', property: 'zoom', min: 0.1, max: 10, step: 0.1 }
          ]
        }
      ]
    },
    OrthographicCamera: {
      folders: [
        transformConfig,
        {
          name: 'Camera',
          controllers: [
            { name: 'Left', property: 'left', min: -50, max: 0, step: 1 },
            { name: 'Right', property: 'right', min: 0, max: 50, step: 1 },
            { name: 'Top', property: 'top', min: 0, max: 50, step: 1 },
            { name: 'Bottom', property: 'bottom', min: -50, max: 0, step: 1 },
            { name: 'Near', property: 'near', min: 0.01, max: 100, step: 0.1 },
            { name: 'Far', property: 'far', min: 10, max: 5000, step: 10 },
            { name: 'Zoom', property: 'zoom', min: 0.1, max: 10, step: 0.1 }
          ]
        }
      ]
    }
  }

  return configs[type] || { folders: [transformConfig] }
}

function getMaterialFolderConfig(material: Material): FolderConfig | null {
  if ((material as MeshStandardMaterial).isMeshStandardMaterial) {
    return {
      name: 'Material',
      controllers: [
        { name: 'Color', property: 'color', isColor: true },
        { name: 'Metalness', property: 'metalness', min: 0, max: 1, step: 0.01 },
        { name: 'Roughness', property: 'roughness', min: 0, max: 1, step: 0.01 },
        { name: 'Opacity', property: 'opacity', min: 0, max: 1, step: 0.01 }
      ]
    }
  }

  if ((material as MeshLambertMaterial).isMeshLambertMaterial) {
    return {
      name: 'Material',
      controllers: [
        { name: 'Color', property: 'color', isColor: true },
        { name: 'Opacity', property: 'opacity', min: 0, max: 1, step: 0.01 }
      ]
    }
  }

  if ((material as MeshPhongMaterial).isMeshPhongMaterial) {
    return {
      name: 'Material',
      controllers: [
        { name: 'Color', property: 'color', isColor: true },
        { name: 'Shininess', property: 'shininess', min: 0, max: 100, step: 1 },
        { name: 'Opacity', property: 'opacity', min: 0, max: 1, step: 0.01 }
      ]
    }
  }

  return {
    name: 'Material',
    controllers: [
      { name: 'Color', property: 'color', isColor: true },
      { name: 'Opacity', property: 'opacity', min: 0, max: 1, step: 0.01 }
    ]
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

function setNestedValue(obj: any, path: string, value: any): void {
  const parts = path.split('.')
  const last = parts.pop()!
  const target = parts.reduce((acc, part) => acc && acc[part], obj)
  if (target && last) {
    target[last] = value
  }
}

export function buildControllersForObject(
  gui: GUI,
  sceneObject: SceneObject,
  onChange?: () => void
): void {
  cleanGui(gui)

  const config = getDefaultObjectConfig(sceneObject.type)
  const object = sceneObject.object

  config.folders.forEach(folderConfig => {
    const folder = gui.addFolder(folderConfig.name)

    folderConfig.controllers.forEach(controllerConfig => {
      const currentValue = getNestedValue(object, controllerConfig.property)

      if (currentValue !== undefined) {
        let controller: any

        if (controllerConfig.isColor) {
          controller = folder
            .addColor(
              { [controllerConfig.name]: `#${currentValue.getHexString()}` },
              controllerConfig.name
            )
            .onChange((value: string) => {
              const targetValue = getNestedValue(object, controllerConfig.property)
              if (targetValue && targetValue.setStyle) {
                targetValue.setStyle(value)
              }
              onChange?.()
            })
        } else {
          controller = folder
            .add(
              { [controllerConfig.name]: currentValue },
              controllerConfig.name,
              controllerConfig.min,
              controllerConfig.max,
              controllerConfig.step
            )
            .onChange((value: number) => {
              setNestedValue(object, controllerConfig.property, value)
              onChange?.()
            })
        }

        controller.name(controllerConfig.name)
      }
    })
  })

  if (sceneObject.type === 'Mesh' && sceneObject.material) {
    const materialFolderConfig = getMaterialFolderConfig(sceneObject.material)
    if (materialFolderConfig) {
      const folder = gui.addFolder(materialFolderConfig.name)
      materialFolderConfig.controllers.forEach(controllerConfig => {
        const currentValue = getNestedValue(sceneObject.material, controllerConfig.property)
        if (currentValue !== undefined) {
          let controller: any

          if (controllerConfig.isColor) {
            controller = folder
              .addColor(
                { [controllerConfig.name]: `#${currentValue.getHexString()}` },
                controllerConfig.name
              )
              .onChange((value: string) => {
                const targetValue = getNestedValue(sceneObject.material!, controllerConfig.property)
                if (targetValue && targetValue.setStyle) {
                  targetValue.setStyle(value)
                }
                onChange?.()
              })
          } else {
            controller = folder
              .add(
                { [controllerConfig.name]: currentValue },
                controllerConfig.name,
                controllerConfig.min,
                controllerConfig.max,
                controllerConfig.step
              )
              .onChange((value: number) => {
                setNestedValue(sceneObject.material!, controllerConfig.property, value)
                onChange?.()
              })
          }

          controller.name(controllerConfig.name)
        }
      })
    }
  }
}

export function cleanGui(gui: GUI): void {
  while (gui.controllers.length > 0) {
    gui.controllers[0].destroy()
  }

  while (gui.folders.length > 0) {
    gui.folders[0].destroy()
  }
}
