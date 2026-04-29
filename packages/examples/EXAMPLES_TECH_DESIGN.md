# Three.js 官方示例验证平台 - 技术设计方案

## 一、架构设计

### 1.1 项目定位

```
┌─────────────────────────────────────────────────────────┐
│                  项目层级架构                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐                                         │
│  │   lib/      │  ◄── 官方原始资源（只读，不修改）        │
│  │  - jsm/     │      - Three.js addons 源码            │
│  │  - models/  │      - 3D 模型文件                     │
│  │  - textures/│      - 纹理图片资源                     │
│  │  - fonts/   │      - 字体文件                        │
│  │  - *.html   │      - 官方原始示例（约 200+ 个）       │
│  └─────────────┘                                         │
│        │                                                 │
│        ▼ 静态资源复用                                     │
│  ┌─────────────┐                                         │
│  │  src/       │  ◄── Vue 组件化实现                     │
│  │  ├ examples/│      - 按分类组织的 Vue 组件            │
│  │  ├ router/  │      - 示例路由与导航                   │
│  │  └ views/   │      - 示例展示与代码对比               │
│  └─────────────┘                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**核心设计原则：零侵入式资源复用**

- ✅ 不修改 `lib/` 目录下任何官方文件
- ✅ 通过 Vite `publicDir` 实现静态资源路径完全兼容
- ✅ 官方示例中 `textures/crate.gif` 等路径直接可用
- ✅ 官方更新时只需替换 `lib/` 目录

### 1.2 目录结构

```
packages/examples/
├── lib/                              # 官方原始资源（保持不变）
│   ├── jsm/                          # Three.js addons
│   ├── models/                       # 3D 模型
│   ├── textures/                     # 纹理
│   └── *.html                        # 官方原始示例
│
├── src/
│   ├── main.ts                       # Vite 入口
│   ├── App.vue                       # 根组件
│   ├── style.css                     # 复用官方 main.css
│   │
│   ├── router/
│   │   └── index.ts                  # 路由配置
│   │         ├── /                   # 首页（示例列表）
│   │         ├── /webgl/:name        # WebGL 示例
│   │         ├── /css2d/:name        # CSS2D 示例
│   │         ├── /css3d/:name        # CSS3D 示例
│   │         └── /physics/:name      # 物理引擎示例
│   │
│   ├── components/
│   │   ├── ExampleList.vue           # 示例分类列表
│   │   ├── CodeCompare.vue           # 代码对比查看器
│   │   └── CodeBlock.vue             # 代码高亮显示
│   │
│   ├── views/
│   │   ├── Home.vue                  # 首页（示例浏览器）
│   │   └── ExampleView.vue           # 单示例查看页面
│   │         ├── 3D 预览区            │
│   │         ├── Vue 组件代码          │
│   │         └── 官方 JS 代码          │
│   │
│   └── examples/                     # 转换后的 Vue 示例
│       ├── webgl/
│       │   ├── geometry_cube.vue
│       │   ├── controls_orbit.vue
│       │   ├── loader_gltf.vue
│       │   └── ... (80+ 个)
│       ├── css2d/
│       │   └── label.vue
│       ├── css3d/
│       └── physics/
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 二、核心技术实现

### 2.1 Vite 静态资源配置

```typescript
// packages/examples/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  // ✅ 关键配置：将官方 lib 作为静态资源目录
  publicDir: 'lib',
  
  server: {
    port: 5174,
    fs: {
      // 允许访问 lib 目录下的资源
      allow: ['lib', 'src']
    }
  },
  
  resolve: {
    alias: {
      // jsm 模块别名，与官方 import 路径兼容
      'three/addons/': '/jsm/'
    }
  }
})
```

**路径兼容性保证**：

| 官方示例路径 | Vue 组件中路径 | 实际文件位置 |
|------------|---------------|-------------|
| `textures/crate.gif` | `textures/crate.gif` | `lib/textures/crate.gif` |
| `models/gltf/Duck.glb` | `models/gltf/Duck.glb` | `lib/models/gltf/Duck.glb` |
| `three/addons/controls/OrbitControls.js` | `three/addons/controls/OrbitControls.js` | `lib/jsm/controls/OrbitControls.js` |

### 2.2 示例转换规则

**标准转换模板**：

```vue
<!-- examples/webgl/geometry_cube.vue -->
<template>
  <TCanvas 
    antialias 
    :pixel-ratio="Math.min(window.devicePixelRatio, 2)"
    animation-loop
  >
    <TPerspectiveCamera :fov="70" :near="0.1" :far="100" position-z="2" />
    
    <TScene>
      <TMesh @before-render="animate">
        <TBoxGeometry />
        <TMeshBasicMaterial>
          <TTexture 
            url="textures/crate.gif" 
            color-space="SRGBColorSpace" 
          />
        </TMeshBasicMaterial>
      </TMesh>
    </TScene>
  </TCanvas>
</template>

<script setup lang="ts">
const animate = (mesh) => {
  mesh.rotation.x += 0.005
  mesh.rotation.y += 0.01
}
</script>
```

**转换对照表**：

| 官方原生 JavaScript | vue-three 声明式写法 |
|-------------------|-------------------|
| `new WebGLRenderer({ antialias: true })` | `<TCanvas antialias />` |
| `renderer.setPixelRatio(window.devicePixelRatio)` | `:pixel-ratio="Math.min(window.devicePixelRatio, 2)"` |
| `renderer.setAnimationLoop(animate)` | `animation-loop` prop |
| `new PerspectiveCamera(70, w/h, 0.1, 100)` | `<TPerspectiveCamera :fov="70" :near="0.1" :far="100" />` |
| `camera.position.z = 2` | `position-z="2"` |
| `new Scene()` | `<TScene>` 组件 |
| `mesh = new Mesh(geometry, material)` | `<TMesh>` 组件嵌套 |
| `requestAnimationFrame` + 渲染循环 | `@before-render` 事件钩子 |
| `window.addEventListener('resize', ...)` | TCanvas 内部自动处理 |

### 2.3 路由系统设计

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const exampleCategories = [
  {
    category: 'webgl',
    name: 'WebGL 基础',
    examples: [
      { id: 'geometry_cube', title: '几何体 - Cube' },
      { id: 'controls_orbit', title: '控制器 - Orbit' },
      { id: 'loader_gltf', title: '模型加载 - GLTF' },
      // ... 80+ 个示例
    ]
  },
  {
    category: 'css2d',
    name: 'CSS2D 标签',
    examples: [
      { id: 'label', title: '2D 标签' }
    ]
  },
  {
    category: 'css3d',
    name: 'CSS3D 渲染',
    examples: [/* ... */]
  },
  {
    category: 'physics',
    name: '物理引擎',
    examples: [/* ... */]
  }
]

// 动态生成路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  ...exampleCategories.flatMap(category =>
    category.examples.map(example => ({
      path: `/${category.category}/${example.id}`,
      name: `${category.category}_${example.id}`,
      component: () => import(`../examples/${category.category}/${example.id}.vue`),
      meta: {
        category: category.name,
        title: example.title
      }
    }))
  )
]
```

### 2.4 代码对比查看器

```vue
<!-- src/components/CodeCompare.vue -->
<template>
  <div class="code-compare">
    <div class="code-panel">
      <h3>Vue 声明式组件</h3>
      <CodeBlock :code="vueCode" lang="vue" />
    </div>
    <div class="code-panel">
      <h3>官方原生 JS</h3>
      <CodeBlock :code="officialCode" lang="js" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ examplePath: string }>()
const vueCode = ref('')
const officialCode = ref('')

onMounted(async () => {
  // 1. 加载 Vue 组件源码
  const vueModule = await import(`../examples/${props.examplePath}.vue?raw`)
  vueCode.value = vueModule.default
  
  // 2. 加载官方 HTML 源码，提取 script 部分
  const response = await fetch(`/${props.examplePath.replace('/', '_')}.html`)
  const html = await response.text()
  const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/)
  officialCode.value = scriptMatch ? scriptMatch[1].trim() : '源码不可用'
})
</script>
```

## 三、实施阶段与优先级

### 3.1 阶段 1：基础框架（高优先级）

| 任务项 | 预计耗时 | 说明 |
|--------|---------|------|
| Vite 项目初始化 | 10min | Vue 3 + TypeScript |
| publicDir 静态资源配置 | 5min | lib 目录作为静态资源 |
| 路由系统实现 | 15min | 示例分类与动态路由 |
| 首页示例列表 | 15min | 分类导航 + 搜索 |
| 代码对比组件 | 20min | 双栏源码对比 + 高亮 |

**总计约 65 分钟**

### 3.2 阶段 2：核心示例实现（高优先级）

| 分类 | 数量 | 示例列表 |
|------|------|---------|
| 基础几何体 | 10 | cube, sphere, plane, line, geometries |
| 材质灯光 | 10 | lights, materials, shadows, pbr |
| 控制器 | 8 | orbit, fly, map, transform |
| 动画系统 | 5 | keyframes, skinning, morph |
| 模型加载 | 15 | gltf, fbx, obj, draco |

**总计约 48 个核心示例**

### 3.3 阶段 3：功能增强（中优先级）

| 任务项 | 预计耗时 | 说明 |
|--------|---------|------|
| 示例搜索功能 | 10min | 按名称/分类搜索 |
| 覆盖度统计面板 | 15min | 已完成/总数统计 |
| 一键复制代码 | 5min | 复制到剪贴板 |
| 响应式布局适配 | 10min | 移动端适配 |

**总计约 40 分钟**

### 3.4 阶段 4：高级示例（低优先级）

| 分类 | 数量 | 示例列表 |
|------|------|---------|
| 后期处理 | 15 | bloom, ssao, outline, dof |
| 交互事件 | 10 | raycasting, selection, drag |
| 物理引擎 | 5 | ammo, jolt, rapier |
| 着色器特效 | 10 | custom shader, gpgpu |

**总计约 40 个高级示例**

## 四、质量保证标准

### 4.1 功能对等性检查清单

- ✅ **视觉效果一致**：渲染结果与官方示例像素级接近
- ✅ **交互行为一致**：鼠标/键盘操作与官方完全相同
- ✅ **性能指标相当**：FPS 与官方示例差距 < 5%
- ✅ **资源路径兼容**：不修改任何官方资源文件路径
- ✅ **代码行数对比**：Vue 版本代码行数 ≤ 官方版本 70%

### 4.2 代码质量标准

```typescript
// 每个示例组件必须满足：
1. <script setup lang="ts"> 语法
2. 完整的类型标注，无 any 类型
3. 无 ESLint 警告和错误
4. 无硬编码路径，全部使用官方资源路径
5. 注释清晰，关键逻辑说明
```

### 4.3 验收流程

1. 打开官方示例：`lib/webgl_geometry_cube.html`
2. 打开 Vue 实现示例：`/webgl/geometry_cube`
3. 对比视觉效果、交互、性能三者完全一致
4. 代码对比：展示声明式优势
5. 确认无内存泄漏，组件卸载后资源正确清理
