# Vue-Three 组件库 技术方案设计文档

## 一、技术架构总览

### 1.1 架构分层设计

```
┌─────────────────────────────────────────┐
│              Playground                 │
│  演示平台 / GUI调试 / 示例展示           │
├─────────────────────────────────────────┤
│          Vue Components Layer           │
│  TCanvas / TScene / TBox / TLight 等    │
├─────────────────────────────────────────┤
│          Composables Layer              │
│  useThree / useScene / useRenderer 等   │
├─────────────────────────────────────────┤
│              Core Engine                │
│  实例管理 / 生命周期 / 配置解析          │
├─────────────────────────────────────────┤
│            Three.js Runtime             │
│  WebGLRenderer / Scene / Object3D       │
└─────────────────────────────────────────┘
```

### 1.2 核心技术栈

| 技术         | 版本   | 选型理由                                 |
| ------------ | ------ | ---------------------------------------- |
| Vue          | 3.4+   | Composition API, `<script setup>` 语法糖 |
| TypeScript   | 5.3+   | 严格类型检查，完整类型推导               |
| Three.js     | 0.160+ | 3D渲染核心引擎                           |
| Vite         | 5.0+   | 极速开发体验，Library模式构建            |
| Vitest       | 1.0+   | 单元测试，E2E测试                        |
| Vue Router   | 4.2+   | Playground 路由管理                      |
| Pinia        | 2.1+   | Playground 状态管理                      |
| UnoCSS       | 0.58+  | 原子化CSS，高性能样式系统                |
| three/addons | 0.160+ | GLTFLoader、OrbitControls等官方扩展      |

---

## 二、核心引擎设计

### 2.1 上下文（Context）设计

#### 2.1.1 ThreeContext 核心上下文

```typescript
// core/context.ts
export interface ThreeContext {
  renderer: ShallowRef<WebGLRenderer | null>
  scene: ShallowRef<Scene> // Setup 阶段创建，永不为 null
  camera: ShallowRef<Camera> // Setup 阶段创建，永不为 null
  controls: ShallowRef<OrbitControls | null>
  canvas: Ref<HTMLCanvasElement | null>
  size: Ref<Size>
}

export interface MeshContext {
  mesh: ShallowRef<Mesh> // Setup 阶段创建，永不为 null
  setGeometry: (geometry: BufferGeometry) => void
  setMaterial: (material: Material) => void
}

export const ThreeContextKey = Symbol('ThreeContext') as InjectionKey<ThreeContext>
export const MeshContextKey = Symbol('MeshContext') as InjectionKey<MeshContext>
```

#### 2.1.2 上下文注入机制

- `TCanvas` 作为根组件，初始化并 provide 上下文
- 所有子组件通过 inject 获取上下文
- 支持嵌套场景（多画布、多场景）

### 2.2 配置驱动引擎

#### 2.2.1 统一配置接口设计

```typescript
export interface Object3DConfig {
  id?: string
  name?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  visible?: boolean
  castShadow?: boolean
  receiveShadow?: boolean
  userData?: Record<string, any>
}

export interface MeshConfig extends Object3DConfig {
  geometry: GeometryConfig
  material: MaterialConfig
}

export type GeometryConfig =
  | { type: 'box'; args?: [number?, number?, number?] }
  | { type: 'sphere'; args?: [number?, number?, number?] }
  | { type: 'plane'; args?: [number?, number?] }
  | { type: 'cylinder'; args?: [number?, number?, number?, number?] }
  | { type: 'torus'; args?: [number?, number?, number?, number?] }
  | { type: 'cone'; args?: [number?, number?, number?, number?] }
  | {
      type: 'tube'
      path: CurveConfig
      radius?: number
      tubularSegments?: number
      radialSegments?: number
      closed?: boolean
    }
  | {
      type: 'lathe'
      points: [number, number][]
      segments?: number
      phiStart?: number
      phiLength?: number
    }
  | { type: 'extrude'; shape: ShapeConfig; options?: ExtrudeOptions }
  | { type: 'shape'; shape: ShapeConfig; curveSegments?: number }
  | { type: 'edges'; thresholdAngle?: number }
  | { type: 'wireframe' }
  | { type: 'custom'; buffer: BufferGeometry }

export type CurveConfig =
  | { type: 'arc'; radius: number; startAngle?: number; endAngle?: number; clockwise?: boolean }
  | {
      type: 'ellipse'
      xRadius: number
      yRadius: number
      startAngle?: number
      endAngle?: number
      rotation?: number
      clockwise?: boolean
    }
  | {
      type: 'bezier'
      start: [number, number, number]
      cp1: [number, number, number]
      cp2: [number, number, number]
      end: [number, number, number]
    }
  | {
      type: 'quadraticBezier'
      start: [number, number, number]
      cp: [number, number, number]
      end: [number, number, number]
    }
  | { type: 'catmullRom'; points: [number, number, number][]; tension?: number; closed?: boolean }
  | { type: 'spline'; points: [number, number, number][]; closed?: boolean }

export interface ShapeConfig {
  points: [number, number][]
  holes?: [number, number][][]
}

export interface ExtrudeOptions {
  depth?: number
  bevelEnabled?: boolean
  bevelThickness?: number
  bevelSize?: number
  bevelSegments?: number
  curveSegments?: number
  steps?: number
}

export type MaterialConfig =
  | { type: 'basic'; color?: string; transparent?: boolean }
  | { type: 'standard'; color?: string; metalness?: number; roughness?: number }
  | { type: 'lambert'; color?: string }
  | { type: 'phong'; color?: string; shininess?: number }
```

#### 2.2.2 对象工厂模式

```typescript
// core/factory.ts
export class ThreeObjectFactory {
  static createGeometry(config: GeometryConfig): BufferGeometry {
    switch (config.type) {
      case 'box':
        return new BoxGeometry(...(config.args || []))
      case 'sphere':
        return new SphereGeometry(...(config.args || []))
      // ... 其他几何体
    }
  }

  static createMaterial(config: MaterialConfig): Material {
    switch (config.type) {
      case 'basic':
        return new MeshBasicMaterial(config)
      case 'standard':
        return new MeshStandardMaterial(config)
      // ... 其他材质
    }
  }

  static createMesh(config: MeshConfig): Mesh {
    const geometry = this.createGeometry(config.geometry)
    const material = this.createMaterial(config.material)
    const mesh = new Mesh(geometry, material)
    this.applyObject3DConfig(mesh, config)
    return mesh
  }
}
```

### 2.3 生命周期管理

#### 2.3.1 关键设计原则：不使用 onMounted

**重要修正**：Three.js 对象不依赖真实 DOM，完全不需要等待 `onMounted` 生命周期。

**问题根源**：Vue 生命周期执行顺序

- ❌ `onMounted`: 子组件先执行，父组件后执行（从内到外）→ 导致父子组件依赖混乱
- ✅ **Setup 阶段**: 父组件先执行，子组件后执行（从外到内）→ 形成正确的依赖链

**执行顺序对比**：

| 阶段                | 旧方案 (onMounted) ❌        | 新方案 (Setup 阶段) ✅                              |
| ------------------- | ---------------------------- | --------------------------------------------------- |
| TCanvas Setup       | -                            | 创建 scene、camera                                  |
| TMesh Setup         | -                            | 创建 mesh, 加入 scene, provide MeshContext          |
| TGeometry Setup     | -                            | inject MeshContext, 创建 geometry, 调用 setGeometry |
| TMaterial Setup     | -                            | inject MeshContext, 创建 material, 调用 setMaterial |
| TCanvas onMounted   | 创建 scene、camera、renderer | 只创建 renderer、controls (需要 DOM 的部分)         |
| TMesh onMounted     | 创建 mesh, 加入 scene        | -                                                   |
| TGeometry onMounted | inject → mesh 还是 null!     | -                                                   |

#### 2.3.2 资源清理机制

```typescript
// core/cleanup.ts
export function disposeObject3D(object: Object3D): void {
  if (object instanceof Mesh) {
    object.geometry?.dispose()
    if (Array.isArray(object.material)) {
      object.material.forEach(m => m.dispose())
    } else {
      object.material?.dispose()
    }
  }
  object.traverse(child => {
    if (child instanceof Mesh) {
      disposeObject3D(child)
    }
  })
}
```

### 2.4 响应式配置更新

#### 2.4.1 深度监听配置变化

```typescript
watch(
  () => props.config,
  (newConfig, oldConfig) => {
    if (!deepEqual(newConfig, oldConfig)) {
      updateObject3DConfig(mesh.value, newConfig)
    }
  },
  { deep: true }
)
```

#### 2.4.2 批量更新优化

- 配置变更防抖
- 只更新变化的属性
- 避免不必要的渲染触发

### 2.5 交互事件系统

#### 2.5.1 核心技术原理

Three.js 3D 对象点击检测基于 **Raycaster 光线投射** 算法：

1. **坐标转换**：屏幕坐标 → Three.js 标准化设备坐标 `[-1, 1]`
2. **射线发射**：从相机向鼠标方向发射射线
3. **相交检测**：检测射线与场景对象的相交
4. **事件派发**：对相交对象触发事件回调

#### 2.5.2 交互上下文定义

```typescript
// core/context.ts
export interface InteractionEvent {
  type: 'click' | 'pointerenter' | 'pointerleave' | 'pointermove'
  object: Object3D
  point: Vector3
  distance: number
  face: Face | null
  uv: Vector2 | null
  event: MouseEvent
  stopPropagation: () => void
}

export interface InteractionHandlers {
  onClick?: (e: InteractionEvent) => void
  onPointerEnter?: (e: InteractionEvent) => void
  onPointerLeave?: (e: InteractionEvent) => void
  onPointerMove?: (e: InteractionEvent) => void
}

export interface InteractionContext {
  registerObject: (object: Object3D, handlers: InteractionHandlers) => void
  unregisterObject: (object: Object3D) => void
  raycaster: ShallowRef<Raycaster>
}

export const InteractionContextKey = Symbol(
  'InteractionContext'
) as InjectionKey<InteractionContext>
```

#### 2.5.3 分层实现架构

```
┌─────────────────────────────────────────────────────────┐
│                   TCanvas (根组件)                      │
│  - 监听 canvas 原生 click/mousemove 事件                │
│  - 全局唯一 Raycaster 实例                              │
│  - 执行射线检测，向交互系统派发事件                      │
├─────────────────────────────────────────────────────────┤
│                   useInteraction                        │
│  - 注册/注销可交互对象（Object3D）                      │
│  - 维护全局交互对象注册表                               │
│  - 鼠标悬停状态追踪（pointerenter/leave 检测）          │
│  - 事件匹配与触发回调                                  │
├─────────────────────────────────────────────────────────┤
│                   TMesh / TGroup 等组件                 │
│  - 对外暴露 @click / @pointer-enter 等 Vue 事件         │
│  - 自动向交互管理器注册自身                             │
│  - 配置变更时自动更新事件处理器                         │
└─────────────────────────────────────────────────────────┘
```

#### 2.5.4 核心实现要点

**性能优化策略**：

- ✅ 按需检测：只检测 `interactionMap` 中注册的对象
- ✅ 实例复用：全局唯一 Raycaster 实例，避免重复创建
- ✅ 事件防抖：mousemove 事件加入性能优化
- ✅ 自动清理：组件卸载时自动注销交互注册

**事件特性**：

- ✅ 支持嵌套对象，射线检测递归遍历子对象
- ✅ 支持 `stopPropagation()` 阻止事件冒泡
- ✅ TypeScript 完整类型推导
- ✅ 支持 dblclick / contextmenu 等扩展事件

---

## 八、CSS2D 标签渲染系统设计

### 8.1 核心技术原理

**CSS2DRenderer 技术优势**：

1. **HTML 原生渲染**：使用 DOM 元素渲染，支持完整 CSS 样式
2. **3D 坐标对齐**：通过投影矩阵计算屏幕位置
3. **自动面向相机**：CSS2DObject 始终保持面向相机
4. **层级分离**：CSS2D 容器独立于 WebGL 画布

**渲染流程**：

```
┌─────────────────────────────────────────────────────────┐
│                    渲染循环                              │
│  1. WebGLRenderer 渲染 3D 场景                          │
│  2. CSS2DRenderer 遍历 CSS2DObject                      │
│  3. 对每个对象执行：                                     │
│     - 3D 坐标 → 相机投影 → NDC 坐标 [-1, 1]              │
│     - NDC 坐标 → 屏幕像素坐标                            │
│     - 应用 translate/scale/opacity 到 DOM 元素           │
└─────────────────────────────────────────────────────────┘
```

### 8.2 上下文类型定义

```typescript
// core/context.ts
export interface CSS2DContext {
  renderer: ShallowRef<CSS2DRenderer | null>
  labelContainer: Ref<HTMLElement | null>
  addLabel: (label: CSS2DObject) => void
  removeLabel: (label: CSS2DObject) => void
}

export interface CSS2DLabelConfig {
  position: [number, number, number]
  offset?: [number, number]
  minDistance?: number
  maxDistance?: number
  scaleByDistance?: boolean
  scaleFactor?: number
  opacity?: number
  className?: string
  style?: Record<string, string>
}

export const CSS2DContextKey = Symbol(
  'CSS2DContext'
) as InjectionKey<CSS2DContext>
```

### 8.3 分层实现架构

```
┌─────────────────────────────────────────────────────────┐
│                   TCanvas (根组件)                      │
│  - 容器使用 relative 定位                               │
│  - canvas 使用 absolute 定位 (z-index: 1)               │
├─────────────────────────────────────────────────────────┤
│                TCSS2DRenderer 组件                      │
│  - 创建 CSS2DRenderer 实例                              │
│  - 创建 div 容器 (z-index: 2, pointer-events: none)     │
│  - 容器使用 absolute 定位，与 canvas 完全重叠            │
│  - provide CSS2DContext                                │
│  - 在渲染循环中执行 renderer.render(scene, camera)      │
├─────────────────────────────────────────────────────────┤
│              useCSS2DRenderer composable                │
│  - 管理 CSS2DRenderer 实例生命周期                      │
│  - 维护标签对象注册表                                   │
│  - 计算每个标签到相机的距离                             │
│  - 应用距离衰减：可见性 / 缩放 / 透明度                 │
├─────────────────────────────────────────────────────────┤
│               TCSS2DLabel / TCSS2DObject                │
│  - 创建 CSS2DObject 实例，包含自定义 HTML               │
│  - 注册到 CSS2DContext                                 │
│  - 支持默认插槽（自定义 HTML 内容）                     │
│  - 支持 @click / @mouseenter 等原生事件                 │
│  - 配置变更实时更新位置与样式                          │
└─────────────────────────────────────────────────────────┘
```

### 8.4 核心实现要点

#### 8.4.1 距离计算与衰减逻辑

```typescript
function updateLabelVisibilityAndScale(
  label: CSS2DObject,
  camera: Camera,
  config: CSS2DLabelConfig
) {
  const distance = label.position.distanceTo(camera.position)
  
  // 1. 距离范围控制
  if (config.minDistance && distance < config.minDistance) {
    label.element.style.display = 'none'
    return
  }
  if (config.maxDistance && distance > config.maxDistance) {
    label.element.style.display = 'none'
    return
  }
  label.element.style.display = ''
  
  // 2. 距离缩放衰减
  if (config.scaleByDistance) {
    const baseScale = config.scaleFactor || 1
    const scale = baseScale * (1 / Math.max(distance * 0.1, 0.5))
    label.element.style.transform = `translate(-50%, -50%) scale(${scale})`
  }
  
  // 3. 距离透明度衰减
  const opacity = config.opacity || 1
  const distanceOpacity = Math.max(0, 1 - (distance / (config.maxDistance || 100)) * 0.5)
  label.element.style.opacity = String(opacity * distanceOpacity)
}
```

#### 8.4.2 像素偏移实现

```typescript
function applyOffset(label: CSS2DObject, offset: [number, number] = [0, 0]) {
  const [offsetX, offsetY] = offset
  label.center.set(0.5, 0.5)
  
  // 通过 margin 实现偏移，不影响 transform 定位
  label.element.style.marginLeft = `${offsetX}px`
  label.element.style.marginTop = `${offsetY}px`
}
```

#### 8.4.3 事件穿透配置

```css
/* CSS2D 容器样式 */
.css2d-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;  /* 容器本身不阻挡事件 */
  overflow: hidden;
  z-index: 2;
}

.css2d-label {
  pointer-events: auto;   /* 标签本身可接收事件 */
  user-select: none;
}
```

---

## 三、组件系统设计

### 3.1 组件层级结构

```
TCanvas
├── TScene
│   ├── TPerspectiveCamera
│   ├── TOrbitControls
│   ├── TAmbientLight
│   ├── TDirectionalLight
│   ├── TMesh
│   │   ├── TBoxGeometry
│   │   └── TStandardMaterial
│   ├── TGLTFModel
│   └── TGroup
```

### 3.2 核心组件实现

#### 3.2.1 TCanvas 画布根组件

```vue
<template>
  <canvas ref="canvasRef" :style="canvasStyle"></canvas>
</template>

<script setup lang="ts">
import { useCanvas } from '../composables/useCanvas'

const props = defineProps<{
  width?: number
  height?: number
  antialias?: boolean
  alpha?: boolean
  shadowMap?: boolean
}>()

const { canvasRef, context } = useCanvas(props)

provide(ThreeContextKey, context)
</script>
```

#### 3.2.2 TMesh 网格组件

```vue
<script setup lang="ts">
import { useMesh } from '../composables/useMesh'

const props = defineProps<{
  config: MeshConfig
}>()

const ctx = inject(ThreeContextKey)!
const meshRef = useMesh(props.config, ctx)

defineExpose({ mesh: meshRef })
</script>
```

### 3.3 Composables 设计

#### 3.3.1 useCanvas

```typescript
export function useCanvas(options: CanvasOptions) {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const renderer = shallowRef<WebGLRenderer | null>(null)

  // Setup 阶段同步创建（不需要 DOM）
  const scene = shallowRef<Scene>(new Scene())
  const camera = shallowRef<Camera>(new PerspectiveCamera(...))
  const controls = shallowRef<OrbitControls | null>(null)

  onMounted(() => {
    // 只在 onMounted 创建需要真实 DOM 的对象
    renderer.value = new WebGLRenderer({ canvas: canvasRef.value! })
    controls.value = new OrbitControls(camera.value, renderer.value.domElement)
    startRenderLoop()
  })

  return { canvasRef, context: { renderer, scene, camera, controls } }
}
```

#### 3.3.2 useMesh

```typescript
export function useMesh(config: MeshConfig) {
  const ctx = inject(ThreeContextKey)!
  const mesh = shallowRef<Mesh>(ThreeObjectFactory.createMesh(config))

  // Setup 阶段同步加入场景
  ctx.scene.value.add(mesh.value)

  provide(MeshContextKey, {
    mesh,
    setGeometry: geometry => {
      mesh.value.geometry?.dispose()
      mesh.value.geometry = geometry
    },
    setMaterial: material => {
      const oldMat = mesh.value.material as Material
      oldMat?.dispose()
      mesh.value.material = material
    }
  })

  watch(
    () => config,
    () => {
      updateMeshConfig(mesh.value, config)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    ctx.scene.value.remove(mesh.value)
    disposeObject3D(mesh.value)
  })

  return { mesh }
}
```

#### 3.3.3 useGeometry / useMaterial

```typescript
export function useGeometry(config: GeometryConfig) {
  const meshCtx = inject(MeshContextKey)!
  const geometry = shallowRef<BufferGeometry>(ThreeObjectFactory.createGeometry(config))

  // Setup 阶段同步调用，此时 mesh 已存在！
  meshCtx.setGeometry(geometry.value)

  onBeforeUnmount(() => {
    geometry.value.dispose()
  })

  return { geometry }
}
```

#### 3.3.4 useCurve - 曲线组合式函数

```typescript
export function useCurve(config: CurveConfig) {
  const ctx = inject(ThreeContextKey)!
  const curve = shallowRef<Curve>(ThreeObjectFactory.createCurve(config))
  const points = curve.value.getPoints(50)
  const geometry = new BufferGeometry().setFromPoints(points)
  const line = shallowRef<Line>(new Line(geometry, new LineBasicMaterial({ color: 0xffffff })))

  // Setup 阶段同步加入场景
  ctx.scene.value.add(line.value)

  watch(
    () => config,
    () => {
      const newCurve = ThreeObjectFactory.createCurve(config)
      const newPoints = newCurve.getPoints(50)
      line.value.geometry.dispose()
      line.value.geometry = new BufferGeometry().setFromPoints(newPoints)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    ctx.scene.value.remove(line.value)
    line.value.geometry.dispose()
    ;(line.value.material as Material).dispose()
  })

  return { curve, line }
}
```

### 3.4 曲线与高级几何体工厂扩展

```typescript
// core/factory.ts 扩展
export class ThreeObjectFactory {
  static createCurve(config: CurveConfig): Curve {
    switch (config.type) {
      case 'arc':
        return new ArcCurve(
          0,
          0,
          config.radius,
          config.startAngle || 0,
          config.endAngle || Math.PI * 2,
          config.clockwise || false
        )
      case 'ellipse':
        return new EllipseCurve(
          0,
          0,
          config.xRadius,
          config.yRadius,
          config.startAngle || 0,
          config.endAngle || Math.PI * 2,
          config.clockwise || false,
          config.rotation || 0
        )
      case 'bezier':
        return new CubicBezierCurve3(
          new Vector3(...config.start),
          new Vector3(...config.cp1),
          new Vector3(...config.cp2),
          new Vector3(...config.end)
        )
      case 'quadraticBezier':
        return new QuadraticBezierCurve3(
          new Vector3(...config.start),
          new Vector3(...config.cp),
          new Vector3(...config.end)
        )
      case 'catmullRom':
        return new CatmullRomCurve3(
          config.points.map(p => new Vector3(...p)),
          config.closed || false,
          'catmullrom',
          config.tension || 0.5
        )
      case 'spline':
        return new SplineCurve(config.points.map(p => new Vector2(p[0], p[1])))
    }
  }

  static createShape(config: ShapeConfig): Shape {
    const shape = new Shape()
    const points = config.points.map(p => new Vector2(p[0], p[1]))
    shape.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y)
    }
    shape.closePath()

    if (config.holes) {
      config.holes.forEach(holePoints => {
        const hole = new Path()
        const hp = holePoints.map(p => new Vector2(p[0], p[1]))
        hole.moveTo(hp[0].x, hp[0].y)
        for (let i = 1; i < hp.length; i++) {
          hole.lineTo(hp[i].x, hp[i].y)
        }
        hole.closePath()
        shape.holes.push(hole)
      })
    }

    return shape
  }

  static createAdvancedGeometry(config: GeometryConfig): BufferGeometry {
    switch (config.type) {
      case 'tube': {
        const path = this.createCurve(config.path)
        return new TubeGeometry(
          path,
          config.tubularSegments || 64,
          config.radius || 1,
          config.radialSegments || 8,
          config.closed || false
        )
      }
      case 'lathe': {
        const points = config.points.map(p => new Vector2(p[0], p[1]))
        return new LatheGeometry(
          points,
          config.segments || 12,
          config.phiStart || 0,
          config.phiLength || Math.PI * 2
        )
      }
      case 'extrude': {
        const shape = this.createShape(config.shape)
        return new ExtrudeGeometry(shape, config.options)
      }
      case 'shape': {
        const shape = this.createShape(config.shape)
        return new ShapeGeometry(shape, config.curveSegments || 12)
      }
      case 'edges':
        return new EdgesGeometry(null, config.thresholdAngle || 1)
      case 'wireframe':
        return new WireframeGeometry(null)
    }
  }
}
```

### 3.5 组件层级扩展

```
TCanvas
├── TScene
│   ├── TPerspectiveCamera
│   ├── TOrbitControls
│   ├── TAmbientLight
│   ├── TMesh
│   │   ├── TBoxGeometry / TSphereGeometry
│   │   ├── TTubeGeometry      ← 新增
│   │   ├── TLatheGeometry     ← 新增
│   │   ├── TExtrudeGeometry   ← 新增
│   │   ├── TShapeGeometry     ← 新增
│   │   ├── TEdgesGeometry     ← 新增
│   │   ├── TWireframeGeometry ← 新增
│   │   └── TStandardMaterial
│   ├── TArcCurve              ← 新增
│   ├── TEllipseCurve         ← 新增
│   ├── TBezierCurve          ← 新增
│   ├── TCatmullRomCurve      ← 新增
│   └── TLine / TLineDashed   ← 新增
```

---

## 四、Playground 架构设计

### 4.1 状态管理设计

```typescript
// stores/playground.ts
export const usePlaygroundStore = defineStore('playground', {
  state: () => ({
    currentComponent: 'TBox',
    sceneConfig: {
      objects: [],
      lights: [],
      camera: {}
    },
    selectedObjectId: null,
    guiControls: new Map()
  }),

  actions: {
    selectObject(id: string) {
      this.selectedObjectId = id
      this.updateGUIPanel(id)
    },

    updateObjectConfig(id: string, key: string, value: any) {
      // 更新配置
      // 触发场景重新渲染
    },

    updateGUIPanel(id: string) {
      // 重建 GUI 控制面板
    }
  }
})
```

### 4.2 GUI 调试系统集成

#### 4.2.1 动态 GUI 生成

```typescript
// utils/guiBuilder.ts
export function buildGUIForObject(gui: GUI, object: Object3D, config: any) {
  const folder = gui.addFolder(config.name || object.type)

  // 位置控制器
  folder.add(object.position, 'x', -10, 10).name('Position X')
  folder.add(object.position, 'y', -10, 10).name('Position Y')
  folder.add(object.position, 'z', -10, 10).name('Position Z')

  // 旋转控制器
  folder.add(object.rotation, 'x', 0, Math.PI * 2).name('Rotation X')
  folder.add(object.rotation, 'y', 0, Math.PI * 2).name('Rotation Y')
  folder.add(object.rotation, 'z', 0, Math.PI * 2).name('Rotation Z')

  // 缩放控制器
  folder.add(object.scale, 'x', 0.1, 5).name('Scale X')
  folder.add(object.scale, 'y', 0.1, 5).name('Scale Y')
  folder.add(object.scale, 'z', 0.1, 5).name('Scale Z')

  // 材质属性（如适用）
  if (object instanceof Mesh && object.material) {
    const matFolder = folder.addFolder('Material')
    if ('color' in object.material) {
      matFolder.addColor(object.material, 'color').name('Color')
    }
  }

  folder.open()
}
```

### 4.3 界面布局

```
┌───────────────────────┬─────────────────────────────┐
│ Component Navigator   │    Fullscreen 3D Viewport    │
│ ┌───────────────────┐ │                             │
│ │ 🌍 Scene          │ │                             │
│ │ 📦 Geometries     │ │    Interactive Scene        │
│ │ 🎨 Materials      │ │    with OrbitControls       │
│ │ 💡 Lights         │ │                             │
│ │ 🎥 Cameras        │ │                             │
│ │ 📦 Models         │ │                             │
│ └───────────────────┘ │                             │
│                       │                             │
│ ┌───────────────────┐ │                             │
│ │  Selected Object  │ │                             │
│ │  Properties GUI   │ │                             │
│ │   - Position      │ │                             │
│ │   - Rotation      │ │                             │
│ │   - Scale         │ │                             │
│ │   - Material      │ │                             │
│ └───────────────────┘ │                             │
│                       │                             │
│ ┌───────────────────┐ │                             │
│ │ Code Snippet      │ │                             │
│ │ Export Config     │ │                             │
│ └───────────────────┘ └─────────────────────────────┘
```

---

## 五、构建与发布配置

### 5.1 Vite 构建配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts({ include: ['packages/vue-three/src'] })],
  build: {
    lib: {
      entry: 'packages/vue-three/src/index.ts',
      name: 'VueThree',
      formats: ['es', 'umd'],
      fileName: format => `vue-three.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'three'],
      output: {
        globals: {
          vue: 'Vue',
          three: 'THREE'
        },
        exports: 'named'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true }
    }
  }
})
```

### 5.2 按需引入支持

#### 5.2.1 目录结构

```
dist/
├── vue-three.es.js
├── vue-three.umd.js
├── index.d.ts
└── components/
    ├── TCanvas/
    │   ├── index.d.ts
    │   └── index.mjs
    ├── TMesh/
    ├── TBox/
    └── ...
```

#### 5.2.2 Package.json 配置

```json
{
  "name": "vue-three",
  "module": "./dist/vue-three.es.js",
  "main": "./dist/vue-three.umd.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/vue-three.es.js",
      "require": "./dist/vue-three.umd.js",
      "types": "./dist/index.d.ts"
    },
    "./components/*": "./dist/components/*/index.mjs"
  },
  "peerDependencies": {
    "vue": ">=3.4.0",
    "three": ">=0.160.0"
  },
  "sideEffects": false
}
```

---

## 六、类型系统设计

### 6.1 完整类型推导

```typescript
// types/config.ts
type ExtractConfigType<T> = T extends { type: infer U } ? U : never

export type GeometryType = ExtractConfigType<GeometryConfig>
export type MaterialType = ExtractConfigType<MaterialConfig>

export type ConfigForGeometry<T extends GeometryType> = Extract<GeometryConfig, { type: T }>

export type ConfigForMaterial<T extends MaterialType> = Extract<MaterialConfig, { type: T }>

// 组件泛型支持
export interface TMeshProps<TGeom extends GeometryType, TMat extends MaterialType> {
  config: {
    geometry: ConfigForGeometry<TGeom>
    material: ConfigForMaterial<TMat>
  } & Object3DConfig
}
```

### 6.2 类型安全保障

- 配置对象字面量类型检查
- 自动补全提示
- 非法配置编译时报错
- 运行时二次校验

---

## 七、性能优化策略

### 7.1 渲染优化

1. **按需渲染**：只有配置变更时才触发渲染
2. **防抖合并**：多次配置变更合并为一次渲染
3. **实例化渲染**：相同几何体使用 InstancedMesh
4. **LOD策略**：远景使用低精度模型

### 7.2 内存优化

1. **资源池**：复用几何体和材质
2. **及时清理**：组件卸载时自动 dispose
3. **纹理压缩**：使用 Basis Universal 压缩纹理
4. **BufferGeometry 复用**：避免重复创建相同几何

### 7.3 构建优化

1. **Tree Shaking**：sideEffects: false
2. **外部化依赖**：Three.js 不打入包中
3. **ES Module 优先**：现代构建工具优先使用 ESM
4. **自动摇树**：每个组件单独导出

---

## 八、测试策略

### 8.1 单元测试

- Composables 逻辑测试
- 工厂函数输出验证
- 配置解析正确性测试

### 8.2 组件测试

- 组件渲染测试
- Props 响应性测试
- 生命周期清理测试

### 8.3 E2E 测试

- Playground 功能测试
- 场景渲染截图对比
- 配置变更实时性测试
