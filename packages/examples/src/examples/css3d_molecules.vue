<template>
  <TCanvas antialias :clear-color="'#050505'">
    <TScene>
      <TPerspectiveCamera :fov="70" :near="1" :far="5000" :position="[0, 0, 1000]" ref="cameraRef" />
      <TTrackballControls ref="controlsRef" :rotate-speed="0.5" />
      <TCSS3DRenderer ref="cssRendererRef" class="css3d-renderer">
        <template v-for="atom in atoms" :key="atom.id">
          <TCSS3DSprite :position="atom.position" :scale="[1, 1, 1]" :style="atom.style"
            :ref="el => setSpriteRef(atom.id, el)">
            <img :src="atom.src" />
          </TCSS3DSprite>
        </template>
        <template v-for="bond in bonds" :key="bond.id">
          <TCSS3DObject :position="bond.position" :rotation="bond.rotation" :scale="[1, 1, 1]" :style="bond.style"
            :ref="el => setBondRef(bond.id, el)">
            <div class="bond"></div>
          </TCSS3DObject>
        </template>
      </TCSS3DRenderer>
    </TScene>
  </TCanvas>

  <div class="controls">
    <label>Visualization Type:</label>
    <select v-model="vizType" @change="changeVizType">
      <option :value="0">Atoms</option>
      <option :value="1">Bonds</option>
      <option :value="2">Atoms + Bonds</option>
    </select>
    <label>Molecule:</label>
    <select v-model="currentMolecule" @change="loadMolecule">
      <option v-for="(value, key) in MOLECULES" :key="key" :value="value">{{ key }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js'
import {
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TTrackballControls,
  TCSS3DRenderer,
  TCSS3DObject,
  TCSS3DSprite
} from '@vue-three/vue-three'

const cameraRef = ref<any>(null)
const controlsRef = ref<any>(null)
const cssRendererRef = ref<any>(null)
const rootRef = ref<any>(null)

const rootRotation = ref(new THREE.Euler(0, 0, 0))

const VIZ_TYPE = {
  'Atoms': 0,
  'Bonds': 1,
  'Atoms + Bonds': 2
}

const MOLECULES: Record<string, string> = {
  'Ethanol': 'ethanol.pdb',
  'Aspirin': 'aspirin.pdb',
  'Caffeine': 'caffeine.pdb',
  'Nicotine': 'nicotine.pdb',
  'LSD': 'lsd.pdb',
  'Cocaine': 'cocaine.pdb',
  'Cholesterol': 'cholesterol.pdb',
  'Lycopene': 'lycopene.pdb',
  'Glucose': 'glucose.pdb',
  'Aluminium oxide': 'Al2O3.pdb',
  'Cubane': 'cubane.pdb',
  'Copper': 'cu.pdb',
  'Fluorite': 'caf2.pdb',
  'Salt': 'nacl.pdb',
  'YBCO superconductor': 'ybco.pdb',
  'Buckyball': 'buckyball.pdb',
  'Graphite': 'graphite.pdb'
}

const vizType = ref(2)
const currentMolecule = ref('caffeine.pdb')

interface Atom {
  id: string
  position: [number, number, number]
  src: string
  style: Record<string, string>
  visible: boolean
}

interface Bond {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  style: Record<string, string>
  visible: boolean
  bondLengthShort: string
  bondLengthFull: string
}

const atoms = ref<Atom[]>([])
const bonds = ref<Bond[]>([])

const spriteRefs = ref<Record<string, any>>({})
const bondRefs = ref<Record<string, any>>({})

const colorSpriteMap = ref<Record<string, string>>({})
const baseSprite = ref<HTMLImageElement | null>(null)
const loader = new PDBLoader()

const tmpVec1 = new THREE.Vector3()
const tmpVec2 = new THREE.Vector3()
const tmpVec3 = new THREE.Vector3()
const tmpVec4 = new THREE.Vector3()

const setSpriteRef = (id: string, el: any) => {
  if (el) {
    spriteRefs.value[id] = el
  }
}

const setBondRef = (id: string, el: any) => {
  if (el) {
    bondRefs.value[id] = el
  }
}

const colorify = (ctx: CanvasRenderingContext2D, width: number, height: number, color: THREE.Color) => {
  const r = color.r, g = color.g, b = color.b
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0, l = data.length; i < l; i += 4) {
    data[i + 0] *= r
    data[i + 1] *= g
    data[i + 2] *= b
  }

  ctx.putImageData(imageData, 0, 0)
}

const imageToCanvas = (image: HTMLImageElement) => {
  const width = image.width
  const height = image.height
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')!
  context.drawImage(image, 0, 0, width, height)
  return canvas
}

const loadMolecule = (model?: string) => {
  const url = '/lib/models/pdb/' + (model || currentMolecule.value)

  atoms.value = []
  bonds.value = []

  loader.load(url, (pdb) => {
    const geometryAtoms = pdb.geometryAtoms
    const geometryBonds = pdb.geometryBonds
    const json = pdb.json

    geometryAtoms.computeBoundingBox()
    const offset = new THREE.Vector3()
    geometryAtoms.boundingBox!.getCenter(offset).negate()

    geometryAtoms.translate(offset.x, offset.y, offset.z)
    geometryBonds.translate(offset.x, offset.y, offset.z)

    const positionAtoms = geometryAtoms.getAttribute('position')
    const colorAtoms = geometryAtoms.getAttribute('color')

    const position = new THREE.Vector3()
    const color = new THREE.Color()

    for (let i = 0; i < positionAtoms.count; i++) {
      position.fromBufferAttribute(positionAtoms, i)
      color.fromBufferAttribute(colorAtoms, i)

      const atomJSON = json.atoms[i]
      const element = atomJSON[4]

      if (!colorSpriteMap.value[element]) {
        const canvas = imageToCanvas(baseSprite.value!)
        const context = canvas.getContext('2d')!
        colorify(context, canvas.width, canvas.height, color)
        const dataUrl = canvas.toDataURL()
        colorSpriteMap.value[element] = dataUrl
      }

      const colorSprite = colorSpriteMap.value[element]

      atoms.value.push({
        id: `atom-${i}`,
        position: [position.x * 75, position.y * 75, position.z * 75],
        src: colorSprite,
        style: {
          width: '50px',
          height: '50px',
          display: 'block'
        },
        visible: true
      })
    }

    const positionBonds = geometryBonds.getAttribute('position')
    const start = new THREE.Vector3()
    const end = new THREE.Vector3()

    for (let i = 0; i < positionBonds.count; i += 2) {
      start.fromBufferAttribute(positionBonds, i)
      end.fromBufferAttribute(positionBonds, i + 1)

      start.multiplyScalar(75)
      end.multiplyScalar(75)

      tmpVec1.subVectors(end, start)
      const bondLength = tmpVec1.length() - 50

      const centerPos = new THREE.Vector3().copy(start).lerp(end, 0.5)

      const axis = tmpVec2.set(0, 1, 0).cross(tmpVec1)
      const radians = Math.acos(tmpVec3.set(0, 1, 0).dot(tmpVec4.copy(tmpVec1).normalize()))

      const quaternion = new THREE.Quaternion().setFromAxisAngle(axis.normalize(), radians)
      const rotation = new THREE.Euler().setFromQuaternion(quaternion)

      bonds.value.push({
        id: `bond-${i}`,
        position: [centerPos.x, centerPos.y, centerPos.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        style: {
          width: '5px',
          height: bondLength + 'px',
          backgroundColor: '#eee',
          display: 'block'
        },
        visible: true,
        bondLengthShort: bondLength + 'px',
        bondLengthFull: (bondLength + 55) + 'px'
      })
    }

    changeVizType(vizType.value)
  })
}

const changeVizType = (value: number) => {
  vizType.value = value

  atoms.value.forEach((atom, index) => {
    const el = spriteRefs.value[atom.id]
    if (el && el.css3dSprite) {
      if (value === 0 || value === 2) {
        el.css3dSprite.element.style.display = ''
        el.css3dSprite.visible = true
      } else {
        el.css3dSprite.element.style.display = 'none'
        el.css3dSprite.visible = false
      }
    }
  })

  bonds.value.forEach((bond, index) => {
    const el = bondRefs.value[bond.id]
    if (el && el.css3dObject) {
      if (value === 1 || value === 2) {
        el.css3dObject.element.style.display = ''
        el.css3dObject.element.style.height = value === 1 ? bond.bondLengthFull : bond.bondLengthShort
        el.css3dObject.visible = true
      } else {
        el.css3dObject.element.style.display = 'none'
        el.css3dObject.visible = false
      }
    }
  })
}

const handleResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  if (cameraRef.value?.camera) {
    cameraRef.value.camera.aspect = width / height
    cameraRef.value.camera.updateProjectionMatrix()
  }

  if (cssRendererRef.value?.renderer) {
    cssRendererRef.value.renderer.setSize(width, height)
  }
}

let animationId: number

const animate = () => {
  animationId = requestAnimationFrame(animate)

  const time = Date.now() * 0.0004
  rootRotation.value.x = time
  rootRotation.value.y = time * 0.7

  if (controlsRef.value?.controls) {
    controlsRef.value.controls.update()
  }
}

onMounted(() => {
  baseSprite.value = new Image()
  baseSprite.value.onload = () => {
    loadMolecule()
  }
  baseSprite.value.src = '/lib/textures/sprites/ball.png'

  window.addEventListener('resize', handleResize)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

watch(currentMolecule, () => {
  loadMolecule()
})
</script>

<style scoped>
.css3d-renderer>div {
  pointer-events: auto;
}

.bond {
  width: 5px;
  height: 10px;
  background: #eee;
  display: block;
  transform-origin: center center;
}

.controls {
  position: fixed;
  top: 140px;
  right: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 8px;
  color: white;
  font-family: Arial, sans-serif;
}

.controls label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.controls select {
  display: block;
  margin-bottom: 15px;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  background: #333;
  color: white;
}
</style>
