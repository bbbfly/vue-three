# Vue-Three 组件库 开发任务清单

## 任务说明

- 所有任务颗粒度控制在 5-15 分钟完成
- 完成一个任务后，记录到 PROGRESS.md 并等待用户确认
- 任务状态：pending → in_progress → completed

---

## 第一阶段：项目基础框架搭建

| 任务ID | 任务名称                                                | 预计耗时 | 优先级 | 状态      |
| ------ | ------------------------------------------------------- | -------- | ------ | --------- |
| F-001  | 初始化 monorepo 项目结构（pnpm workspaces）             | 5min     | 高     | completed |
| F-002  | 配置 TypeScript 严格模式                                | 5min     | 高     | completed |
| F-003  | 安装核心依赖（Vue 3.4+、Three.js 0.160+）               | 5min     | 高     | completed |
| F-004  | 配置 Vite Library 模式构建脚本                          | 10min    | 高     | completed |
| F-005  | 创建组件库目录结构（core/components/composables/types） | 5min     | 高     | completed |
| F-006  | 配置 ESLint + Prettier 代码规范                         | 10min    | 中     | completed |
| F-007  | Playground 项目初始化（Vite + Vue）                     | 5min     | 高     | completed |
| F-008  | Playground 集成 UnoCSS、Vue Router、Pinia               | 10min    | 高     | completed |
| F-009  | 验证项目启动（组件库构建 + Playground 运行）            | 5min     | 高     | completed |

---

## 第二阶段：MVP 核心组件开发（v1.0.0）

### 2.1 核心引擎层

| 任务ID | 任务名称                               | 预计耗时 | 优先级 | 状态      |
| ------ | -------------------------------------- | -------- | ------ | --------- |
| C-001  | 定义 ThreeContext 类型与 InjectionKey  | 5min     | 高     | completed |
| C-002  | 实现对象工厂（Object Factory）基础类   | 10min    | 高     | completed |
| C-003  | 实现配置解析器（Config Parser）        | 10min    | 高     | completed |
| C-004  | 实现资源清理工具函数（dispose）        | 5min     | 高     | completed |
| C-005  | 定义基础配置接口类型（Object3DConfig） | 10min    | 高     | completed |

### 2.2 Composables 层

| 任务ID | 任务名称                    | 预计耗时 | 优先级 | 状态      |
| ------ | --------------------------- | -------- | ------ | --------- |
| CO-001 | 实现 useCanvas composable   | 15min    | 高     | completed |
| CO-002 | 实现 useScene composable    | 10min    | 高     | completed |
| CO-003 | 实现 useRenderer composable | 10min    | 高     | completed |
| CO-004 | 实现 useCamera composable   | 10min    | 高     | completed |
| CO-005 | 实现 useControls composable | 10min    | 高     | completed |
| CO-006 | 实现 useMesh composable     | 10min    | 高     | completed |
| CO-007 | 实现 useLight composable    | 10min    | 高     | completed |

### 2.3 基础组件开发

| 任务ID   | 任务名称                            | 预计耗时 | 优先级 | 状态      |
| -------- | ----------------------------------- | -------- | ------ | --------- |
| COMP-001 | TCanvas 根组件实现                  | 15min    | 高     | completed |
| COMP-002 | TScene 场景组件实现                 | 10min    | 高     | completed |
| COMP-003 | TPerspectiveCamera 相机组件         | 10min    | 高     | completed |
| COMP-004 | TOrthographicCamera 正交相机        | 10min    | 高     | completed |
| COMP-005 | TOrbitControls 轨道控制器           | 10min    | 高     | completed |
| COMP-006 | TFlyControls 飞行控制器             | 15min    | 中     | completed |
| COMP-007 | TFirstPersonControls 第一人称控制器 | 15min    | 中     | completed |
| COMP-008 | TAmbientLight 环境光组件            | 5min     | 高     | completed |
| COMP-009 | TDirectionalLight 方向光组件        | 5min     | 高     | completed |
| COMP-010 | TPointLight 点光源组件              | 5min     | 高     | completed |
| COMP-011 | TSpotLight 聚光灯组件               | 5min     | 高     | completed |
| COMP-012 | THemisphereLight 半球光组件         | 5min     | 中     | completed |
| COMP-013 | TRectAreaLight 区域光组件           | 10min    | 中     | completed |

### 2.4 几何体与材质组件

| 任务ID  | 任务名称                       | 预计耗时 | 优先级 | 状态      |
| ------- | ------------------------------ | -------- | ------ | --------- |
| GEO-001 | TMesh 网格组件 + 几何体工厂    | 15min    | 高     | completed |
| GEO-002 | TBox 立方体组件                | 5min     | 高     | completed |
| GEO-003 | TSphere 球体组件               | 5min     | 高     | completed |
| GEO-004 | TPlane 平面组件                | 5min     | 高     | completed |
| GEO-005 | TCylinder 圆柱体组件           | 5min     | 高     | completed |
| GEO-006 | TTorus 圆环几何体              | 5min     | 高     | completed |
| GEO-007 | TCone 圆锥几何体               | 5min     | 高     | completed |
| GEO-008 | TCustomGeometry 自定义几何体   | 10min    | 中     | pending   |
| MAT-001 | TMeshBasicMaterial 基础材质    | 5min     | 高     | completed |
| MAT-002 | TMeshStandardMaterial PBR材质  | 5min     | 高     | completed |
| MAT-003 | TMeshLambertMaterial 材质      | 5min     | 高     | completed |
| MAT-004 | TMeshPhongMaterial 材质        | 5min     | 高     | completed |
| MAT-005 | TTexture 纹理贴图组件          | 10min    | 高     | completed |
| MAT-006 | TCubeTexture 立方体贴图组件    | 10min    | 中     | pending   |
| MAT-007 | TMeshPhysicalMaterial 物理材质 | 10min    | 高     | completed |

### 2.5 模型加载组件

| 任务ID   | 任务名称             | 预计耗时 | 优先级 | 状态      |
| -------- | -------------------- | -------- | ------ | --------- |
| LOAD-001 | TGLTFLoader 组件实现 | 15min    | 高     | completed |
| LOAD-002 | 加载进度与错误处理   | 10min    | 中     | completed |

### 2.6 组件库入口与导出

| 任务ID  | 任务名称                       | 预计耗时 | 优先级 | 状态      |
| ------- | ------------------------------ | -------- | ------ | --------- |
| EXP-001 | 统一入口 index.ts 导出所有组件 | 5min     | 高     | completed |
| EXP-002 | 实现 Vue 插件 install 方法     | 10min    | 高     | completed |
| EXP-003 | 构建验证：ESM/UMD 产物测试     | 10min    | 高     | completed |
| EXP-004 | Tree Shaking 验证              | 10min    | 中     | completed |

---

## 第三阶段：Playground 演示平台开发

### 3.1 基础布局

| 任务ID | 任务名称                             | 预计耗时 | 优先级 | 状态      |
| ------ | ------------------------------------ | -------- | ------ | --------- |
| PG-001 | Playground 主布局（全屏预览+侧边栏） | 15min    | 高     | completed |
| PG-002 | 侧边栏组件目录树                     | 10min    | 高     | completed |
| PG-003 | 可折叠面板组件实现                   | 10min    | 高     | completed |
| PG-004 | 响应式布局适配                       | 10min    | 中     | completed |

### 3.2 GUI 调试系统

| 任务ID  | 任务名称                    | 预计耗时 | 优先级 | 状态      |
| ------- | --------------------------- | -------- | ------ | --------- |
| GUI-001 | 集成 lil-gui / Three.js GUI | 10min    | 高     | completed |
| GUI-002 | 实现动态 GUI 生成器         | 15min    | 高     | completed |
| GUI-003 | 位置/旋转/缩放控制器        | 10min    | 高     | completed |
| GUI-004 | 材质颜色/属性控制器         | 10min    | 高     | completed |
| GUI-005 | 光源属性实时调试            | 10min    | 高     | completed |
| GUI-006 | 配置变更双向绑定            | 10min    | 高     | completed |

### 3.3 组件演示页面

| 任务ID   | 任务名称                | 预计耗时 | 优先级 | 状态      |
| -------- | ----------------------- | -------- | ------ | --------- |
| DEMO-001 | TCanvas/TScene 演示页面 | 10min    | 高     | completed |
| DEMO-002 | 几何体组件演示页面      | 10min    | 高     | completed |
| DEMO-003 | 材质组件演示页面        | 10min    | 高     | completed |
| DEMO-004 | 光源组件演示页面        | 10min    | 高     | completed |
| DEMO-005 | 相机/控制器演示页面     | 10min    | 高     | completed |
| DEMO-006 | GLTF模型加载演示页面    | 10min    | 高     | completed |

### 3.4 功能增强

| 任务ID | 任务名称                  | 预计耗时 | 优先级 | 状态      |
| ------ | ------------------------- | -------- | ------ | --------- |
| PG-005 | Playground Store 状态管理 | 10min    | 高     | completed |
| PG-006 | 配置导出功能（JSON/代码） | 10min    | 中     | completed |
| PG-007 | 代码示例展示面板          | 10min    | 中     | completed |

---

## 第四阶段：迭代版本开发（v1.1.0）

### 4.1 动画系统

| 任务ID  | 任务名称                      | 预计耗时 | 优先级 | 状态      |
| ------- | ----------------------------- | -------- | ------ | --------- |
| ANI-001 | TAnimationMixer 动画混合器    | 15min    | 中     | completed |
| ANI-002 | TKeyframeAnimation 关键帧动画 | 15min    | 中     | completed |
| ANI-003 | GLTF 模型动画播放             | 10min    | 中     | completed |
| ANI-004 | 动画时间轴 GUI 调试           | 10min    | 中     | completed |

### 4.2 后期处理

| 任务ID | 任务名称                   | 预计耗时 | 优先级 | 状态      |
| ------ | -------------------------- | -------- | ------ | --------- |
| PP-001 | TEffectComposer 效果合成器 | 15min    | 中     | completed |
| PP-002 | TBloomPass 发光效果        | 10min    | 中     | completed |
| PP-003 | TSSAAPass 抗锯齿           | 10min    | 中     | completed |
| PP-005 | TOutlinePass 发光描边组件  | 15min    | 中     | completed |
| PP-006 | 描边颜色与粗细配置支持     | 10min    | 中     | completed |
| PP-007 | 选中对象发光描边交互效果   | 10min    | 中     | pending   |
| PP-004 | 后期效果 GUI 调试          | 10min    | 中     | completed |

### 4.3 更多加载器

| 任务ID   | 任务名称              | 预计耗时 | 优先级 | 状态      |
| -------- | --------------------- | -------- | ------ | --------- |
| LOAD-003 | TOBJLoader 组件       | 10min    | 低     | completed |
| LOAD-004 | TFBXLoader 组件       | 10min    | 低     | completed |
| LOAD-005 | TDRACOLoader 解码支持 | 15min    | 低     | completed |

---

## 第五阶段：优化与完善

| 任务ID  | 任务名称                     | 预计耗时 | 优先级 | 状态      |
| ------- | ---------------------------- | -------- | ------ | --------- |
| OPT-003 | 组件单元测试编写             | 15min    | 中     | completed |
| OPT-004 | 构建产物优化（体积分析）     | 10min    | 中     | completed |
| OPT-005 | 完整类型声明文件（d.ts）验证 | 10min    | 中     | completed |

---

## 第六阶段：曲线与高级几何体开发（v1.2.0）

### 6.1 核心类型与工厂扩展

| 任务ID  | 任务名称                                  | 预计耗时 | 优先级 | 状态      |
| ------- | ----------------------------------------- | -------- | ------ | --------- |
| CUR-001 | CurveConfig 曲线配置类型定义              | 5min     | 高     | completed |
| CUR-002 | ShapeConfig 形状配置类型定义              | 5min     | 高     | completed |
| CUR-003 | 扩展 GeometryConfig 支持高级几何体        | 5min     | 高     | completed |
| CUR-004 | ThreeObjectFactory 添加 createCurve 方法  | 10min    | 高     | completed |
| CUR-005 | ThreeObjectFactory 添加 createShape 方法  | 10min    | 高     | completed |
| CUR-006 | ThreeObjectFactory 添加高级几何体创建方法 | 15min    | 高     | completed |

### 6.2 Composables 扩展

| 任务ID  | 任务名称                 | 预计耗时 | 优先级 | 状态      |
| ------- | ------------------------ | -------- | ------ | --------- |
| CUR-007 | 实现 useCurve composable | 10min    | 高     | completed |
| CUR-008 | 实现 useLine composable  | 10min    | 高     | completed |

### 6.3 曲线组件开发

| 任务ID  | 任务名称                         | 预计耗时 | 优先级 | 状态      |
| ------- | -------------------------------- | -------- | ------ | --------- |
| CUR-009 | TArcCurve 圆弧曲线组件           | 5min     | 高     | completed |
| CUR-010 | TEllipseCurve 椭圆曲线组件       | 5min     | 高     | completed |
| CUR-011 | TBezierCurve 三次贝塞尔曲线      | 5min     | 高     | completed |
| CUR-012 | TQuadraticBezierCurve 二次贝塞尔 | 5min     | 高     | completed |
| CUR-013 | TCatmullRomCurve 样条曲线        | 5min     | 高     | completed |
| CUR-014 | TSplineCurve 插值曲线            | 5min     | 中     | completed |
| CUR-015 | TLine 线条渲染组件               | 5min     | 高     | completed |
| CUR-016 | TLineLoop 闭环线条组件           | 5min     | 高     | completed |
| CUR-017 | TLineDashed 虚线线条组件         | 5min     | 高     | completed |

### 6.4 高级几何体组件开发

| 任务ID  | 任务名称                      | 预计耗时 | 优先级 | 状态      |
| ------- | ----------------------------- | -------- | ------ | --------- |
| GEO-009 | TTubeGeometry 曲线路径管道    | 10min    | 高     | completed |
| GEO-010 | TLatheGeometry 旋转成型       | 10min    | 高     | completed |
| GEO-011 | TShapeGeometry 轮廓填充       | 10min    | 高     | completed |
| GEO-012 | TExtrudeGeometry 拉伸几何体   | 15min    | 高     | completed |
| GEO-013 | TSweepGeometry 扫描几何体     | 15min    | 中     | completed |
| GEO-014 | TEdgesGeometry 模型边界线     | 5min     | 高     | completed |
| GEO-015 | TWireframeGeometry 线框几何体 | 5min     | 高     | completed |

### 6.5 Playground 演示页面

| 任务ID   | 任务名称            | 预计耗时 | 优先级 | 状态      |
| -------- | ------------------- | -------- | ------ | --------- |
| DEMO-007 | 曲线组件演示页面    | 15min    | 高     | completed |
| DEMO-008 | 高级几何体演示页面  | 15min    | 高     | completed |
| DEMO-009 | 曲线编辑器 GUI 工具 | 20min    | 中     | completed |

---

## 第七阶段：交互事件系统开发（v1.2.0）

### 7.1 核心类型与上下文

| 任务ID  | 任务名称                                     | 预计耗时 | 优先级 | 状态      |
| ------- | -------------------------------------------- | -------- | ------ | --------- |
| EVT-001 | InteractionEvent 交互事件类型定义            | 5min     | 高     | completed |
| EVT-002 | InteractionHandlers 事件处理器类型定义       | 5min     | 高     | completed |
| EVT-003 | InteractionContext 交互上下文与 InjectionKey | 5min     | 高     | completed |

### 7.2 Composables 实现

| 任务ID  | 任务名称                                 | 预计耗时 | 优先级 | 状态      |
| ------- | ---------------------------------------- | -------- | ------ | --------- |
| EVT-004 | 实现 useInteraction composable 核心逻辑  | 15min    | 高     | completed |
| EVT-005 | Raycaster 射线检测与坐标转换实现         | 10min    | 高     | completed |
| EVT-006 | 交互对象注册表与事件派发机制             | 10min    | 高     | completed |
| EVT-007 | pointerenter / pointerleave 悬停状态检测 | 10min    | 高     | completed |
| EVT-008 | 事件冒泡与 stopPropagation 实现          | 10min    | 高     | completed |

### 7.3 组件事件集成

| 任务ID  | 任务名称                                      | 预计耗时 | 优先级 | 状态      |
| ------- | --------------------------------------------- | -------- | ------ | --------- |
| EVT-009 | TCanvas 集成 useInteraction 并 provide 上下文 | 5min     | 高     | completed |
| EVT-010 | TMesh 组件支持 click / pointer-\* 系列事件    | 10min    | 高     | completed |
| EVT-011 | TMesh 自动注册 / 注销交互对象                 | 5min     | 高     | completed |

### 7.4 扩展支持

| 任务ID  | 任务名称                        | 预计耗时 | 优先级 | 状态    |
| ------- | ------------------------------- | -------- | ------ | ------- |
| EVT-012 | TGroup 组对象支持交互事件       | 5min     | 中     | pending |
| EVT-013 | TLine 线条对象支持交互事件      | 5min     | 中     | pending |
| EVT-014 | TGLTFModel 加载模型支持交互事件 | 10min    | 中     | pending |

### 7.5 Playground 演示页面

| 任务ID   | 任务名称                    | 预计耗时 | 优先级 | 状态      |
| -------- | --------------------------- | -------- | ------ | --------- |
| DEMO-010 | 交互事件系统演示页面        | 15min    | 高     | completed |
| DEMO-011 | 点击变色 / 悬停高亮效果演示 | 10min    | 高     | completed |

---

## 第八阶段：CSS2D 标签渲染系统开发（v1.4.0）

### 8.1 核心类型与上下文

| 任务ID  | 任务名称                             | 预计耗时 | 优先级 | 状态      |
| ------- | ------------------------------------ | -------- | ------ | --------- |
| CSS-001 | CSS2DContext 类型定义与 InjectionKey | 5min     | 高     | completed |
| CSS-002 | CSS2DLabelConfig 标签配置类型定义    | 5min     | 高     | completed |

### 8.2 Composables 实现

| 任务ID  | 任务名称                               | 预计耗时 | 优先级 | 状态      |
| ------- | -------------------------------------- | -------- | ------ | --------- |
| CSS-003 | 实现 useCSS2DRenderer composable 核心  | 15min    | 高     | completed |
| CSS-004 | CSS2DRenderer 实例初始化与容器管理     | 10min    | 高     | completed |
| CSS-005 | 标签注册表与 addLabel/removeLabel 方法 | 10min    | 高     | completed |
| CSS-006 | 距离计算与可见性控制                   | 10min    | 高     | completed |
| CSS-007 | 距离缩放衰减与透明度衰减实现           | 10min    | 中     | completed |
| CSS-008 | 集成到主渲染循环                       | 5min     | 高     | completed |

### 8.3 组件实现

| 任务ID  | 任务名称                              | 预计耗时 | 优先级 | 状态      |
| ------- | ------------------------------------- | -------- | ------ | --------- |
| CSS-009 | TCSS2DRenderer 根组件实现             | 10min    | 高     | completed |
| CSS-010 | TCSS2DRenderer 提供 CSS2DContext      | 5min     | 高     | completed |
| CSS-011 | TCSS2DLabel 标签组件（基础版）        | 10min    | 高     | completed |
| CSS-012 | TCSS2DLabel 支持 position/offset 配置 | 10min    | 高     | completed |
| CSS-013 | TCSS2DLabel 距离范围配置（min/max）   | 10min    | 中     | completed |
| CSS-014 | TCSS2DLabel scaleByDistance 功能      | 10min    | 中     | completed |
| CSS-015 | TCSS2DLabel className/style 样式支持  | 10min    | 高     | completed |
| CSS-016 | TCSS2DLabel 支持默认插槽自定义内容    | 10min    | 高     | completed |
| CSS-017 | TCSS2DLabel 支持原生 DOM 事件         | 10min    | 中     | completed |
| CSS-018 | TCSS2DObject 通用对象组件             | 10min    | 中     | completed |

### 8.4 资源清理

| 任务ID  | 任务名称                        | 预计耗时 | 优先级 | 状态      |
| ------- | ------------------------------- | -------- | ------ | --------- |
| CSS-019 | 组件卸载时正确移除标签 DOM 元素 | 5min     | 高     | completed |
| CSS-020 | 组件卸载时正确注销 CSS2DObject  | 5min     | 高     | completed |
| CSS-021 | 渲染器销毁时正确清理容器        | 5min     | 高     | completed |

### 8.5 Playground 演示页面

| 任务ID   | 任务名称                   | 预计耗时 | 优先级 | 状态      |
| -------- | -------------------------- | -------- | ------ | --------- |
| DEMO-012 | CSS2D 标签系统演示页面     | 15min    | 高     | completed |
| DEMO-013 | 距离可见性/缩放效果演示    | 10min    | 高     | completed |
| DEMO-014 | 自定义 HTML 内容与样式演示 | 10min    | 高     | completed |
| DEMO-015 | 标签点击事件交互演示       | 10min    | 中     | completed |
| DEMO-016 | 标签样式 GUI 实时调试      | 15min    | 中     | completed |

---

## 第九阶段：Sprite 精灵模型系统开发（v1.5.0）

### 9.1 核心类型与上下文

| 任务ID  | 任务名称                              | 预计耗时 | 优先级 | 状态      |
| ------- | ------------------------------------- | -------- | ------ | --------- |
| SPR-001 | SpriteConfig 精灵配置类型定义         | 5min     | 高     | completed |
| SPR-002 | SpriteMaterialConfig 材质配置类型定义 | 5min     | 高     | completed |
| SPR-003 | BlendingMode / BlendingFactor 枚举    | 5min     | 高     | completed |
| SPR-004 | SpriteContext 类型与 InjectionKey     | 5min     | 高     | completed |

### 9.2 核心工厂扩展

| 任务ID  | 任务名称                                     | 预计耗时 | 优先级 | 状态      |
| ------- | -------------------------------------------- | -------- | ------ | --------- |
| SPR-005 | ThreeObjectFactory 添加 createSprite 方法    | 10min    | 高     | completed |
| SPR-006 | ThreeObjectFactory 添加 createSpriteMaterial | 10min    | 高     | completed |
| SPR-007 | resolveBlendingMode 混合模式映射实现         | 5min     | 高     | completed |

### 9.3 Composables 实现

| 任务ID  | 任务名称                                  | 预计耗时 | 优先级 | 状态      |
| ------- | ----------------------------------------- | -------- | ------ | --------- |
| SPR-008 | 实现 useSprite composable 核心逻辑        | 15min    | 高     | completed |
| SPR-009 | 提供 SpriteContext 上下文                 | 5min     | 高     | completed |
| SPR-010 | setMaterial 材质切换方法实现              | 5min     | 高     | completed |
| SPR-011 | 距离可见性控制（minDistance/maxDistance） | 10min    | 中     | completed |
| SPR-012 | center 中心点对齐配置实现                 | 5min     | 中     | completed |
| SPR-013 | Sprite 资源自动清理机制实现               | 5min     | 高     | completed |

### 9.4 着色器特效实现

| 任务ID  | 任务名称                         | 预计耗时 | 优先级 | 状态      |
| ------- | -------------------------------- | -------- | ------ | --------- |
| SPR-014 | circle 圆形裁剪着色器扩展        | 10min    | 中     | completed |
| SPR-015 | rounded 圆角裁剪着色器扩展       | 15min    | 中     | completed |
| SPR-016 | color tint 颜色叠加效果实现      | 10min    | 中     | completed |
| SPR-017 | onBeforeCompile 着色器注入机制   | 5min     | 高     | completed |
| SPR-018 | sizeAttenuation 透视大小衰减开关 | 5min     | 高     | completed |

### 9.5 组件开发

| 任务ID  | 任务名称                                 | 预计耗时 | 优先级 | 状态      |
| ------- | ---------------------------------------- | -------- | ------ | --------- |
| SPR-019 | TSprite 精灵组件基础实现                 | 10min    | 高     | completed |
| SPR-020 | TSprite 支持 config prop 配置驱动        | 5min     | 高     | completed |
| SPR-021 | TSprite 暴露 sprite 实例                 | 5min     | 高     | completed |
| SPR-022 | TSprite 支持交互事件（click/pointer-\*） | 10min    | 高     | completed |
| SPR-023 | TSprite 支持 TSpriteMaterial 子组件插槽  | 5min     | 高     | completed |
| SPR-024 | TSpriteMaterial 精灵材质组件基础实现     | 10min    | 高     | completed |
| SPR-025 | TSpriteMaterial 纹理 map / alphaMap 支持 | 10min    | 高     | completed |
| SPR-026 | TSpriteMaterial blending 混合模式支持    | 5min     | 高     | completed |
| SPR-027 | TSpriteMaterial clip 裁剪模式支持        | 10min    | 中     | completed |
| SPR-028 | TSpriteMaterial 配置变更响应式更新       | 5min     | 高     | completed |

### 9.6 Playground 演示页面

| 任务ID   | 任务名称                  | 预计耗时 | 优先级 | 状态      |
| -------- | ------------------------- | -------- | ------ | --------- |
| DEMO-017 | Sprite 精灵组件演示页面   | 15min    | 高     | completed |
| DEMO-018 | 标记点 POI 系统演示       | 10min    | 高     | completed |
| DEMO-019 | 圆形/圆角裁剪效果演示     | 10min    | 中     | completed |
| DEMO-020 | 混合模式效果对比演示      | 10min    | 中     | completed |
| DEMO-021 | 距离可见性/像素级渲染演示 | 10min    | 中     | completed |
| DEMO-022 | Sprite 交互点击事件演示   | 10min    | 高     | completed |
| DEMO-023 | 精灵属性 GUI 实时调试面板 | 15min    | 中     | completed |

---

## 任务统计

- **总任务数**：192 个
- **MVP 核心任务**：43 个（完成后可发布 v1.0.0）
- **交互事件系统任务**：17 个（v1.2.0）
- **曲线与高级几何体任务**：30 个（v1.3.0）
- **CSS2D 标签渲染系统任务**：28 个（v1.4.0）
- **Sprite 精灵模型系统任务**：35 个（v1.5.0）
- **高优先级任务**：112 个
- **平均每个任务**：~10 分钟
- **MVP 预计总开发时间**：~6.5 小时
- **交互事件系统预计开发时间**：~2.5 小时
- **曲线与高级几何体预计开发时间**：~4.5 小时
- **CSS2D 标签系统预计开发时间**：~4 小时
- **Sprite 精灵模型预计开发时间**：~5 小时
