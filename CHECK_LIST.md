# Vue-Three 组件库 验收清单

## 验收说明

- 每完成一个任务，对照此清单进行验收
- 所有项目标记 ✅ 后才算验收通过
- 未通过项需要返工并重新验收

---

## 第一阶段：项目基础框架验收

### 1.1 项目初始化

- [ ] ✅ 项目根目录结构符合 monorepo 规范
- [ ] ✅ pnpm workspaces 配置正确
- [ ] ✅ 可使用单一命令安装所有依赖
- [ ] ✅ packages/vue-three 目录结构完整
- [ ] ✅ packages/playground 目录结构完整
- [ ] ✅ 根目录 package.json 脚本配置正确

### 1.2 TypeScript 配置

- [ ] ✅ tsconfig.json strict 模式已启用
- [ ] ✅ noImplicitAny = true
- [ ] ✅ strictNullChecks = true
- [ ] ✅ strictFunctionTypes = true
- [ ] ✅ 类型声明文件输出配置正确
- [ ] ✅ 无隐式 any 类型错误

### 1.3 构建配置

- [ ] ✅ Vite Library 模式配置正确
- [ ] ✅ ESM 格式产物正常生成
- [ ] ✅ UMD 格式产物正常生成
- [ ] ✅ Three.js 和 Vue 已外部化（external）
- [ ] ✅ 产物中无重复依赖
- [ ] ✅ Tree Shaking 生效（sideEffects: false）
- [ ] ✅ 类型声明文件（.d.ts）正确输出

### 1.4 代码规范

- [ ] ✅ ESLint 配置完整
- [ ] ✅ Prettier 配置完整
- [ ] ✅ npm run lint 可正常执行
- [ ] ✅ npm run format 可正常执行
- [ ] ✅ 无 ESLint 错误

### 1.5 项目启动验证

- [ ] ✅ npm run dev 可正常启动 Playground
- [ ] ✅ npm run build 可正常构建组件库
- [ ] ✅ 构建产物无错误
- [ ] ✅ Playground 页面可正常访问
- [ ] ✅ 控制台无报错

---

## 第二阶段：MVP 核心组件验收

### 2.1 核心引擎验收

- [ ] ✅ ThreeContext 类型定义完整
- [ ] ✅ ThreeContextKey InjectionKey 正确导出
- [ ] ✅ 对象工厂可正确创建所有几何体
- [ ] ✅ 对象工厂可正确创建所有材质
- [ ] ✅ disposeObject3D 正确销毁所有资源
- [ ] ✅ 配置解析器正确解析所有 Object3D 属性
- [ ] ✅ 配置变更深度检测生效

### 2.2 Composables 验收

- [ ] ✅ useCanvas 正确初始化渲染器
- [ ] ✅ useCanvas 正确初始化场景
- [ ] ✅ useCanvas 正确初始化相机
- [ ] ✅ useCanvas 正确初始化控制器
- [ ] ✅ useCanvas 启动渲染循环
- [ ] ✅ useCanvas 组件卸载时正确清理资源
- [ ] ✅ useMesh 正确创建网格
- [ ] ✅ useMesh 响应配置变更
- [ ] ✅ useMesh 正确清理资源
- [ ] ✅ useLight 正确创建各种光源
- [ ] ✅ 所有 composables 有完整类型标注

### 2.3 基础组件验收

- [ ] ✅ TCanvas 渲染 canvas 元素
- [ ] ✅ TCanvas provide ThreeContext
- [ ] ✅ TCanvas 响应 resize 事件
- [ ] ✅ TScene 正确管理场景
- [ ] ✅ TPerspectiveCamera fov/near/far 配置生效
- [ ] ✅ TOrbitControls 所有配置生效
- [ ] ✅ TOrbitControls 可正常交互
- [ ] ✅ TAmbientLight 颜色/强度生效
- [ ] ✅ TDirectionalLight 位置/阴影生效
- [ ] ✅ TPointLight 距离/衰减生效
- [ ] ✅ 所有组件有完整 Props 类型
- [ ] ✅ 所有组件暴露正确的实例

### 2.4 几何体与材质验收

- [ ] ✅ TMesh 正确合并几何体和材质
- [ ] ✅ TBox width/height/depth 正确
- [ ] ✅ TSphere radius/widthSegments 正确
- [ ] ✅ TPlane width/height 正确
- [ ] ✅ TCylinder 参数全部生效
- [ ] ✅ TMeshBasicMaterial color/transparent 生效
- [ ] ✅ TMeshStandardMaterial metalness/roughness 生效
- [ ] TMeshPhysicalMaterial clearcoat/clearcoatRoughness 生效
- [ ] TMeshPhysicalMaterial transmission/thickness 透射效果生效
- [ ] TMeshPhysicalMaterial ior/iridescence 彩虹效果生效
- [ ] TMeshPhysicalMaterial sheen 光泽效果生效
- [ ] TMeshPhysicalMaterial specularIntensity/specularColor 生效
- [ ] ✅ TMeshLambertMaterial 正确渲染
- [ ] ✅ TMeshPhongMaterial shininess 生效
- [ ] ✅ 所有配置变更实时响应

### 2.5 模型加载验收

- [ ] ✅ TGLTFLoader 可正常加载 .gltf 模型
- [ ] ✅ TGLTFLoader 可正常加载 .glb 模型
- [ ] ✅ onLoad 回调正常触发
- [ ] ✅ onProgress 回调正常触发
- [ ] ✅ onError 回调错误时触发
- [ ] ✅ 模型 position/scale/rotation 可配置
- [ ] ✅ 加载中的 loading 状态正确展示

### 2.6 组件库导出验收

- [ ] ✅ index.ts 导出所有公开 API
- [ ] ✅ Vue 插件 install 方法正确实现
- [ ] ✅ 可全量 import VueThree from 'vue-three'
- [ ] ✅ 可按需 import { TCanvas } from 'vue-three'
- [ ] ✅ 所有类型可从 'vue-three' 导入
- [ ] ✅ 构建后 dist 目录结构完整

---

## 第三阶段：Playground 演示平台验收

### 3.1 界面布局验收

- [ ] ✅ 采用全屏预览 + 侧边配置布局
- [ ] ✅ 左侧边栏：组件导航树
- [ ] ✅ 左侧边栏：属性配置面板
- [ ] ✅ 主区域：3D 场景全屏预览
- [ ] ✅ 可折叠侧边栏
- [ ] ✅ 可调整侧边栏宽度
- [ ] ✅ 响应式布局适配桌面端
- [ ] ✅ 深色主题配色统一

### 3.2 GUI 调试验收

- [ ] ✅ lil-gui 正确集成
- [ ] ✅ 选择场景对象显示对应属性
- [ ] ✅ Position X/Y/Z slider 实时生效
- [ ] ✅ Rotation X/Y/Z slider 实时生效
- [ ] ✅ Scale X/Y/Z slider 实时生效
- [ ] ✅ Color picker 实时更新材质颜色
- [ ] ✅ Light intensity 实时更新
- [ ] ✅ Material 属性全部可调试
- [ ] ✅ GUI 值与配置双向绑定

### 3.3 组件演示验收

- [ ] ✅ TCanvas + TScene 演示页面
- [ ] ✅ 几何体组件演示页面（Box/Sphere/Plane/Cylinder）
- [ ] ✅ 材质组件演示页面（4种材质对比）
- [ ] ✅ 光源组件演示页面（所有光源类型）
- [ ] ✅ 相机/控制器演示页面
- [ ] ✅ GLTF 模型演示页面
- [ ] ✅ 每个演示都有可交互的 GUI
- [ ] ✅ 每个演示显示对应的代码示例

### 3.4 功能增强验收

- [ ] ✅ Pinia Store 正确管理状态
- [ ] ✅ 当前选中对象高亮显示
- [ ] ✅ 配置可导出为 JSON
- [ ] ✅ 配置可导出为 Vue 代码
- [ ] ✅ 一键复制代码按钮
- [ ] ✅ 代码示例语法高亮
- [ ] ✅ 预设配置快速切换

---

## 第四阶段：迭代版本验收

### 4.1 动画系统验收

- [ ] ✅ TAnimationMixer 正确创建
- [ ] ✅ TKeyframeAnimation 关键帧动画播放
- [ ] ✅ GLTF 模型动画正确播放
- [ ] ✅ 动画时间轴 GUI 控制
- [ ] ✅ 播放/暂停/停止控制
- [ ] ✅ 动画速度调节

### 4.2 后期处理验收

- [ ] ✅ TEffectComposer 正确集成
- [ ] ✅ TBloomPass 发光效果
- [ ] ✅ TSSAAPass 抗锯齿效果
- [ ] ✅ 后期参数 GUI 调试
- [ ] ✅ 多 Pass 效果叠加

---

## 第五阶段：交互事件系统验收（v1.2.0）

### 5.1 核心类型与上下文验收

- [ ] InteractionEvent 类型定义完整，包含所有字段
- [ ] InteractionHandlers 类型定义完整
- [ ] InteractionContext 类型定义完整
- [ ] InteractionContextKey InjectionKey 正确导出
- [ ] stopPropagation 方法类型正确

### 5.2 useInteraction 验收

- [ ] 在 TCanvas onMounted 时绑定 click 事件监听
- [ ] 在 TCanvas onMounted 时绑定 mousemove 事件监听
- [ ] Raycaster 实例正确初始化
- [ ] 鼠标屏幕坐标正确转换为 NDC 坐标 [-1, 1]
- [ ] 只检测 interactionMap 中注册的对象
- [ ] 射线检测支持递归遍历子对象
- [ ] interactionMap 正确维护注册的对象
- [ ] 事件按距离排序，只触发最前面的对象
- [ ] pointerenter 事件正确触发
- [ ] pointerleave 事件正确触发
- [ ] stopPropagation() 可阻止事件冒泡
- [ ] 组件卸载时正确移除事件监听
- [ ] 所有方法有完整的 TypeScript 类型标注

### 5.3 组件集成验收

- [ ] TCanvas 正确 provide InteractionContext
- [ ] TMesh 支持 onClick prop
- [ ] TMesh 支持 onPointerEnter prop
- [ ] TMesh 支持 onPointerLeave prop
- [ ] TMesh 支持 Vue 事件语法 @click / @pointer-enter
- [ ] TMesh 在 setup 阶段自动注册交互对象
- [ ] TMesh 在 onBeforeUnmount 时注销交互对象
- [ ] 事件处理器变更时自动更新注册
- [ ] TGroup 支持交互事件
- [ ] TLine 支持交互事件
- [ ] TGLTFModel 支持交互事件

### 5.4 功能特性验收

- [ ] 点击网格触发 onClick 回调
- [ ] 鼠标进入触发 onPointerEnter 回调
- [ ] 鼠标离开触发 onPointerLeave 回调
- [ ] 事件包含正确的 point 相交点坐标
- [ ] 事件包含正确的 distance 距离值
- [ ] 事件包含正确的 face 面信息
- [ ] 事件包含正确的 uv 坐标
- [ ] 事件包含原始 MouseEvent 对象
- [ ] 多层嵌套对象只触发最上层事件
- [ ] stopPropagation 生效
- [ ] 控制台无内存泄漏警告

### 5.5 Playground 演示验收

- [ ] 交互事件演示页面可访问
- [ ] 点击网格有视觉反馈（变色、缩放）
- [ ] 鼠标悬停有高亮效果
- [ ] 事件日志实时展示
- [ ] 包含完整的代码示例
- [ ] GUI 可调试交互参数

---

## 第六阶段：优化与完善验收

### 6.1 性能验收

- [ ] ✅ 按需渲染：无变更时降低帧率
- [ ] ✅ 配置变更防抖合并
- [ ] ✅ 100 个 Mesh 渲染 FPS > 55
- [ ] ✅ 组件卸载后无内存泄漏
- [ ] ✅ 几何体/材质复用优化

### 5.2 类型系统验收

- [ ] ✅ 完整泛型支持
- [ ] ✅ 根据配置 type 自动推导对应属性
- [ ] ✅ IDE 中自动补全正常工作
- [ ] ✅ 错误配置编译时报错
- [ ] ✅ 所有导出 API 有 JSDoc 注释

### 5.3 测试验收

- [ ] ✅ 单元测试覆盖率 > 80%
- [ ] ✅ npm run test 所有测试通过
- [ ] ✅ Composables 逻辑测试覆盖
- [ ] ✅ 工厂函数测试覆盖
- [ ] ✅ 配置解析测试覆盖

### 5.4 构建产物验收

- [ ] ✅ ESM 产物正常工作
- [ ] ✅ UMD 产物正常工作
- [ ] ✅ 类型声明文件完整
- [ ] ✅ 产物大小符合预期
- [ ] ✅ Tree Shaking 生效验证

---

## 第六阶段：曲线与高级几何体验收

### 6.1 核心类型与工厂验收

- [ ] CurveConfig 类型定义完整（所有曲线类型）
- [ ] ShapeConfig 类型定义完整（支持孔洞）
- [ ] GeometryConfig 包含所有高级几何体类型
- [ ] createCurve 工厂方法正确创建所有曲线类型
- [ ] createShape 工厂方法正确创建带孔洞的形状
- [ ] 所有高级几何体工厂方法正确实现
- [ ] 配置变更响应式更新生效

### 6.2 Composables 验收

- [ ] useCurve 正确创建曲线并加入场景
- [ ] useCurve 配置变更实时更新
- [ ] useCurve 正确清理资源
- [ ] useLine 正确创建线条对象
- [ ] useLine 支持所有线条类型（Line/LineLoop/LineDashed）

### 6.3 曲线组件验收

- [ ] TArcCurve radius/startAngle/endAngle 参数生效
- [ ] TEllipseCurve xRadius/yRadius 参数生效
- [ ] TBezierCurve 控制点参数正确渲染曲线
- [ ] TQuadraticBezierCurve 二次贝塞尔正确
- [ ] TCatmullRomCurve 多点插值正确
- [ ] TLine color/linewidth 样式生效
- [ ] TLineLoop 闭环线条正确
- [ ] TLineDashed 虚线样式正确
- [ ] 所有曲线组件完整类型标注

### 6.4 高级几何体验收

- [ ] TTubeGeometry 沿曲线创建管道
- [ ] TTubeGeometry radius/tubularSegments 参数生效
- [ ] TLatheGeometry 绕轴旋转成型正确
- [ ] TLatheGeometry points/segments 参数生效
- [ ] TShapeGeometry 2D轮廓填充正确
- [ ] TShapeGeometry 支持孔洞
- [ ] TExtrudeGeometry 拉伸深度正确
- [ ] TExtrudeGeometry bevel 倒角效果正确
- [ ] TEdgesGeometry 边界线提取正确
- [ ] TWireframeGeometry 线框渲染正确
- [ ] 所有高级几何体资源正确清理

### 6.5 Playground 演示验收

- [ ] 曲线组件独立演示页面
- [ ] 高级几何体独立演示页面
- [ ] 曲线点可视化编辑
- [ ] 形状轮廓点可视化编辑
- [ ] 所有参数GUI实时调试
- [ ] 代码示例完整展示

---

## 第七阶段：CSS2D 标签渲染系统验收

### 7.1 核心类型与上下文验收

- [ ] CSS2DContext 类型定义完整（renderer/labelContainer/addLabel/removeLabel）
- [ ] CSS2DLabelConfig 类型定义完整（所有配置项）
- [ ] CSS2DContextKey InjectionKey 正确导出
- [ ] 所有类型有完整 JSDoc 注释

### 7.2 useCSS2DRenderer 验收

- [ ] onMounted 时正确创建 CSS2DRenderer 实例
- [ ] 正确创建 label 容器 div
- [ ] 容器使用 absolute 定位，与 canvas 完全重叠
- [ ] 容器 z-index 高于 canvas（z-index: 2）
- [ ] 容器 pointer-events: none（不阻挡 3D 场景事件）
- [ ] addLabel 正确将 CSS2DObject 添加到场景
- [ ] removeLabel 正确将 CSS2DObject 从场景移除
- [ ] 正确计算标签到相机的距离
- [ ] minDistance 距离过近时隐藏标签
- [ ] maxDistance 距离过远时隐藏标签
- [ ] 距离在范围内时显示标签
- [ ] scaleByDistance 启用时标签随距离缩放
- [ ] scaleFactor 缩放因子正确应用
- [ ] 距离透明度衰减正确应用
- [ ] 渲染循环中正确调用 CSS2DRenderer.render()
- [ ] 组件卸载时正确清理 CSS2DRenderer
- [ ] 组件卸载时正确移除容器 DOM 元素
- [ ] 所有方法有完整 TypeScript 类型标注

### 7.3 组件实现验收

- [ ] TCSS2DRenderer 正确 provide CSS2DContext
- [ ] TCSS2DLabel 正确创建 CSS2DObject 实例
- [ ] TCSS2DLabel position 配置正确应用 3D 坐标
- [ ] TCSS2DLabel offset 配置正确应用像素偏移
- [ ] TCSS2DLabel minDistance/maxDistance 配置生效
- [ ] TCSS2DLabel scaleByDistance 配置生效
- [ ] TCSS2DLabel className 正确应用到标签元素
- [ ] TCSS2DLabel style 样式对象正确应用
- [ ] TCSS2DLabel 支持默认插槽（自定义 HTML 内容）
- [ ] TCSS2DLabel 支持 @click 原生事件
- [ ] TCSS2DLabel 支持 @mouseenter / @mouseleave 事件
- [ ] TCSS2DLabel 元素 pointer-events: auto（可接收事件）
- [ ] TCSS2DLabel 元素 user-select: none
- [ ] TCSS2DObject 支持更复杂的自定义场景
- [ ] 配置变更实时响应更新
- [ ] 组件卸载时自动注销标签
- [ ] 组件卸载时正确清理资源

### 7.4 功能特性验收

- [ ] 标签始终面向相机（Billboard 效果）
- [ ] 3D 坐标与屏幕像素完美对齐
- [ ] 标签中心正确（center: 0.5, 0.5）
- [ ] 偏移量通过 margin 正确实现
- [ ] 多个标签层级通过 z-index 正确控制
- [ ] 标签不阻挡 3D 场景交互（除自身区域外）
- [ ] 标签上的点击事件不穿透到 3D 场景
- [ ] 支持完整 CSS 样式（背景、边框、阴影等）
- [ ] 支持 CSS 过渡动画效果
- [ ] 控制台无内存泄漏警告

### 7.5 Playground 演示验收

- [ ] CSS2D 标签系统独立演示页面
- [ ] 演示多个标签在 3D 场景中的定位
- [ ] 演示距离可见性效果（拉远标签消失）
- [ ] 演示距离缩放效果（近大远小）
- [ ] 演示自定义 HTML 内容和样式
- [ ] 演示标签点击交互（弹窗、跳转等）
- [ ] 标签位置/偏移 GUI 实时调试
- [ ] 标签距离参数 GUI 实时调试
- [ ] 标签样式参数 GUI 实时调试
- [ ] 包含完整的代码示例展示

---

## 最终验收总览

| 模块             | 验收项     | 通过数 | 总数 | 通过率 |
| ---------------- | ---------- | ------ | ---- | ------ |
| 项目基础框架     | 26 项      |        |      |        |
| MVP 核心组件     | 55 项      |        |      |        |
| Playground 平台  | 30 项      |        |      |        |
| 迭代版本功能     | 12 项      |        |      |        |
| 交互事件系统     | 45 项      |        |      |        |
| 优化与完善       | 19 项      |        |      |        |
| 曲线与高级几何体 | 35 项      |        |      |        |
| CSS2D 标签系统   | 59 项      |        |      |        |
| **总计**         | **281 项** |        |      |        |

---

## 验收签字

项目设计负责人：\***\*\_\_\_\*\*** 日期：\***\*\_\_\_\*\***

开发负责人：\***\*\_\_\_\*\*** 日期：\***\*\_\_\_\*\***

测试负责人：\***\*\_\_\_\*\*** 日期：\***\*\_\_\_\*\***
