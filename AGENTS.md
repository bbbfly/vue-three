# Vue-Three 开发代理

## 项目概述

**技术栈**: Vue 3.4 + TypeScript 5.3 + Three.js 0.160 + Vite 5.0

---

## 规则

### 文档说明

#### 根目录核心文档

- **PRD.md**: 产品需求文档，记录完整的功能和设计要求
- **TECH_DESIGN.md**: 技术方案文档，记录架构和实现细节
- **TASKS.md**: 开发任务列表，所有任务按优先级和阶段划分
- **CHECK_LIST.md**: 验收清单，每个任务完成后对照检查
- **UNIT_TEST.md**: 测试用例，每个功能对应测试
- **PROGRESS.md**: 任务进度日志，记录已完成的工作

#### Examples 项目专属文档（packages/examples/）

- **EXAMPLES_PRD.md**: Three.js 官方示例验证平台产品需求
- **EXAMPLES_TECH_DESIGN.md**: Examples 项目技术设计方案
- **EXAMPLES_TASKS.md**: Examples 项目开发任务清单
- **EXAMPLES_CHECK_LIST.md**: Examples 项目验收清单

---

### 开发流程

1. **开始任务前**
   - 从 TASKS.md 选择当前优先级最高的 pending 状态任务
   - 更新任务状态为 "in_progress"
   - 阅读 TECH_DESIGN.md 中对应技术实现方案

2. **任务开发中**
   - 实现对应功能的单元测试
   - 保证 TypeScript 类型完整

3. **任务完成后**
   - 记录任务内容和完成时间到 PROGRESS.md
   - 对照 CHECK_LIST.md 对应验收项自检
   - 运行 npm run lint 确保无代码规范问题
   - 运行 npm run type-check 确保无类型错误
   - 运行 npm run test 确保相关测试通过
   - 更新 TASKS.md 任务状态为 "completed"

4. **用户确认**
   - 完成一个任务后必须等待用户确认通过
   - 用户通过后才能继续下一个任务
   - 如有问题根据反馈返工调整

---

### 代码规范

1. **TypeScript 严格模式**
   - 代码添加 JSDoc 文档注释
2. **Vue 3 Composition API**
3. **Three.js 规范**
   - 避免内存泄漏和重复创建
4. **命名规范**
   - 组件名：PascalCase，以 T 开头（如 TCanvas, TMesh）

---

### Git 提交规范

> ⚠️ **重要说明：所有代码提交仅保存在本地仓库，不用推送到远程仓库**
>
> 本地开发完成后，所有代码和提交历史都只需要存在于本地 git 仓库，无需执行 `git push` 操作。

#### 1. 提交消息格式

```
<type>: <subject>
```

#### 2. type 类型说明

| 类型       | 说明                                              |
| ---------- | ------------------------------------------------- |
| `feat`     | 新功能开发                                        |
| `fix`      | 修复 bug                                          |
| `docs`     | 文档更新                                          |
| `style`    | 代码风格/格式调整（不影响代码运行）               |
| `refactor` | 重构（既不是新增功能，也不是修改 bug 的代码变动） |
| `perf`     | 性能优化                                          |
| `test`     | 增加测试                                          |
| `chore`    | 构建过程或辅助工具的变动                          |
| `revert`   | 回滚提交                                          |

#### 3. 示例

```bash
# 新功能
git commit -m "feat: 实现 TMesh 点击事件支持"

# 修复 bug
git commit -m "fix: 修复 Flex 布局高度溢出导致场景放大问题"

# 文档
git commit -m "docs: 更新交互事件系统 PROGRESS 进度记录"

# 重构
git commit -m "refactor: 优化 useInteraction 事件绑定逻辑"
```

---

### 目录结构

```
packages/
├── vue-three/              # 组件库核心
│   ├── src/
│   │   ├── core/           # 引擎核心
│   │   │   ├── factory.ts  # 对象工厂
│   │   │   ├── context.ts  # 上下文定义
│   │   │   ├── cleanup.ts  # 资源清理
│   │   │   └── config.ts   # 配置解析
│   │   ├── components/     # Vue 组件
│   │   ├── composables/    # 组合式函数
│   │   ├── types/          # 类型定义
│   │   ├── utils/          # 工具函数
│   │   └── index.ts        # 入口文件
│   └── package.json
│
├── playground/             # 演示平台
│   ├── src/
│   │   ├── views/          # 演示页面
│   │   ├── components/     # UI 组件
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # Pinia 状态
│   │   ├── utils/          # GUI 工具
│   │   └── examples/       # 示例配置
│   └── package.json
│
└── examples/               # Three.js 官方示例验证平台
    ├── lib/                # 官方原始资源（只读，不修改）
    │   ├── jsm/            # Three.js addons
    │   ├── models/         # 3D 模型文件
    │   ├── textures/       # 纹理图片
    │   ├── fonts/          # 字体文件
    │   └── *.html          # 官方原始 HTML 示例
    │
    ├── src/
    │   ├── examples/       # 转换后的 Vue 示例组件
    │   │   ├── webgl/      # WebGL 基础示例
    │   │   ├── css2d/      # CSS2D 标签示例
    │   │   ├── css3d/      # CSS3D 渲染示例
    │   │   └── physics/    # 物理引擎示例
    │   ├── components/     # 平台功能组件
    │   ├── router/         # 示例路由配置
    │   ├── views/          # 平台页面
    │   ├── main.ts         # Vite 入口
    │   └── App.vue         # 根组件
    │
    ├── EXAMPLES_PRD.md             # ✅ 项目需求文档
    ├── EXAMPLES_TECH_DESIGN.md     # ✅ 技术设计方案
    ├── EXAMPLES_TASKS.md           # ✅ 开发任务清单
    ├── EXAMPLES_CHECK_LIST.md      # ✅ 验收检查清单
    ├── EXAMPLES_UNIT_TEST.md       # ✅ 测试用例文档
    ├── vite.config.ts
    └── package.json
```

---

### 当前执行计划

#### 第一轮：基础框架搭建（9 个任务）

1. ✅ F-001 初始化 monorepo 项目结构
2. ✅ F-002 配置 TypeScript 严格模式
3. ✅ F-003 安装核心依赖
4. ✅ F-004 配置 Vite Library 模式构建
5. ✅ F-005 创建组件库目录结构
6. ✅ F-006 配置 ESLint + Prettier
7. ✅ F-007 Playground 项目初始化
8. ✅ F-008 Playground 集成路由和状态管理
9. ✅ F-009 验证项目启动

#### 第二轮：MVP 核心开发（40 个任务）

- 核心引擎层 5 个
- Composables 层 7 个
- 基础组件 7 个
- 几何体与材质 9 个
- 模型加载 2 个
- 组件库入口 4 个

#### 第三轮：Playground 开发（22 个任务）

- 基础布局 4 个
- GUI 调试系统 6 个
- 组件演示页面 6 个
- 功能增强 6 个

---

### 紧急程度说明

- 🔴 **高优先级**：框架搭建、核心组件、基础功能
- 🟡 **中优先级**：优化增强、演示平台、测试
- 🟢 **低优先级**：文档、示例、高级功能

---

### 开始执行

现在项目设计已全部完成，有两种执行选项：

1. **开始执行开发任务** - 由开发代理按照 TASKS.md 逐任务执行，每个任务完成后等待确认
2. **继续优化设计** - 对现有设计文档进行调整和完善

请选择执行方向。
