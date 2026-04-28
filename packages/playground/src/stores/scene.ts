import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { Object3D, Material, BufferGeometry } from 'three'
import type GUI from 'lil-gui'
import {
  generateExportJSON,
  generateVueComponentCode,
  downloadJSON,
  downloadVueCode,
  copyToClipboard
} from '../utils/exportUtils'

export interface SceneObject {
  id: string
  name: string
  type: string
  object: Object3D
  material?: Material
  geometry?: BufferGeometry
}

export const useSceneStore = defineStore('scene', () => {
  const sceneObjects = ref<SceneObject[]>([])
  const selectedObject = shallowRef<SceneObject | null>(null)
  const guiInstance = shallowRef<GUI | null>(null)

  function registerSceneObject(obj: SceneObject) {
    const existing = sceneObjects.value.findIndex(o => o.id === obj.id)
    if (existing === -1) {
      sceneObjects.value.push(obj)
    }
  }

  function unregisterSceneObject(id: string) {
    const index = sceneObjects.value.findIndex(o => o.id === id)
    if (index !== -1) {
      sceneObjects.value.splice(index, 1)
      if (selectedObject.value?.id === id) {
        selectedObject.value = null
      }
    }
  }

  function selectObject(id: string) {
    const obj = sceneObjects.value.find(o => o.id === id)
    selectedObject.value = obj || null
  }

  function setGuiInstance(gui: GUI | null) {
    guiInstance.value = gui
  }

  function clearAll() {
    sceneObjects.value = []
    selectedObject.value = null
  }

  function exportToJSON(): string {
    return generateExportJSON(sceneObjects.value)
  }

  function exportToVueCode(): string {
    return generateVueComponentCode(sceneObjects.value)
  }

  function downloadExportJSON(filename = 'scene-config.json') {
    const content = exportToJSON()
    downloadJSON(content, filename)
  }

  function downloadExportVueCode(filename = 'SceneComponent.vue') {
    const content = exportToVueCode()
    downloadVueCode(content, filename)
  }

  async function copyJSONToClipboard(): Promise<boolean> {
    const content = exportToJSON()
    return await copyToClipboard(content)
  }

  async function copyVueCodeToClipboard(): Promise<boolean> {
    const content = exportToVueCode()
    return await copyToClipboard(content)
  }

  return {
    sceneObjects,
    selectedObject,
    guiInstance,
    registerSceneObject,
    unregisterSceneObject,
    selectObject,
    setGuiInstance,
    clearAll,
    exportToJSON,
    exportToVueCode,
    downloadExportJSON,
    downloadExportVueCode,
    copyJSONToClipboard,
    copyVueCodeToClipboard
  }
})
