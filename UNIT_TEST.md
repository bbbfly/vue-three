# Vue-Three 组件库 测试用例

## 测试策略

- 单元测试：Vitest + @vue/test-utils
- 测试目标：核心逻辑覆盖率 80%+
- 每个任务完成后编写对应测试

---

## 一、核心引擎测试

### 1.1 对象工厂测试

| 测试ID     | 测试名称                          | 测试类型 | 预期结果                             |
| ---------- | --------------------------------- | -------- | ------------------------------------ |
| TEST-F-001 | createGeometry - Box              | 单元测试 | 返回 BoxGeometry 实例                |
| TEST-F-002 | createGeometry - Sphere           | 单元测试 | 返回 SphereGeometry 实例             |
| TEST-F-003 | createGeometry - Plane            | 单元测试 | 返回 PlaneGeometry 实例              |
| TEST-F-004 | createGeometry - Cylinder         | 单元测试 | 返回 CylinderGeometry 实例           |
| TEST-F-005 | createGeometry - 未知类型抛出错误 | 单元测试 | 抛出 TypeError                       |
| TEST-F-006 | createMaterial - basic            | 单元测试 | 返回 MeshBasicMaterial 实例          |
| TEST-F-007 | createMaterial - standard         | 单元测试 | 返回 MeshStandardMaterial 实例       |
| TEST-F-011 | createMaterial - physical         | 单元测试 | 返回 MeshPhysicalMaterial 实例       |
| TEST-F-008 | createMaterial - lambert          | 单元测试 | 返回 MeshLambertMaterial 实例        |
| TEST-F-009 | createMaterial - phong            | 单元测试 | 返回 MeshPhongMaterial 实例          |
| TEST-F-010 | createMesh - 正确创建网格         | 单元测试 | Mesh 包含正确的 geometry 和 material |

### 1.2 资源清理测试

| 测试ID     | 测试名称                         | 测试类型 | 预期结果                      |
| ---------- | -------------------------------- | -------- | ----------------------------- |
| TEST-C-001 | disposeObject3D - 销毁单个 Mesh  | 单元测试 | geometry.disposed = true      |
| TEST-C-002 | disposeObject3D - 销毁材质数组   | 单元测试 | 所有 material.disposed = true |
| TEST-C-003 | disposeObject3D - 递归销毁子对象 | 单元测试 | 所有子对象都被销毁            |
| TEST-C-004 | disposeObject3D - 空对象不报错   | 单元测试 | 不抛出异常                    |

### 1.3 配置解析测试

| 测试ID     | 测试名称                | 测试类型 | 预期结果                      |
| ---------- | ----------------------- | -------- | ----------------------------- |
| TEST-P-001 | 解析 position 配置      | 单元测试 | object.position 正确设置      |
| TEST-P-002 | 解析 rotation 配置      | 单元测试 | object.rotation 正确设置      |
| TEST-P-003 | 解析 scale 配置         | 单元测试 | object.scale 正确设置         |
| TEST-P-004 | 解析 visible 配置       | 单元测试 | object.visible 正确设置       |
| TEST-P-005 | 解析 castShadow 配置    | 单元测试 | object.castShadow 正确设置    |
| TEST-P-006 | 解析 receiveShadow 配置 | 单元测试 | object.receiveShadow 正确设置 |
| TEST-P-007 | 解析 userData 配置      | 单元测试 | object.userData 正确设置      |
| TEST-P-008 | 缺少配置使用默认值      | 单元测试 | 使用合理的默认值              |

---

## 二、Composables 测试

### 2.1 useCanvas 测试

| 测试ID      | 测试名称                       | 测试类型 | 预期结果                        |
| ----------- | ------------------------------ | -------- | ------------------------------- |
| TEST-CO-001 | onMounted 后创建 renderer 实例 | 单元测试 | renderer 是 WebGLRenderer       |
| TEST-CO-002 | onMounted 后创建 scene 实例    | 单元测试 | scene 是 Scene 实例             |
| TEST-CO-003 | onMounted 后创建 camera 实例   | 单元测试 | camera 是 PerspectiveCamera     |
| TEST-CO-004 | onMounted 后创建 controls 实例 | 单元测试 | controls 是 OrbitControls       |
| TEST-CO-005 | canvas 尺寸正确设置            | 单元测试 | 与配置的宽高一致                |
| TEST-CO-006 | antialias 配置生效             | 单元测试 | renderer antialias 属性正确     |
| TEST-CO-007 | alpha 配置生效                 | 单元测试 | renderer alpha 属性正确         |
| TEST-CO-008 | shadowMap 配置生效             | 单元测试 | renderer shadowMap.enabled 正确 |
| TEST-CO-009 | 组件卸载时正确销毁 renderer    | 单元测试 | renderer 被 dispose             |
| TEST-CO-010 | 渲染循环正常启动               | 集成测试 | 正常调用 requestAnimationFrame  |

### 2.2 useMesh 测试

| 测试ID      | 测试名称                   | 测试类型 | 预期结果                 |
| ----------- | -------------------------- | -------- | ------------------------ |
| TEST-CO-011 | onMounted 后创建 Mesh 实例 | 单元测试 | mesh 是 Mesh 实例        |
| TEST-CO-012 | Mesh 被添加到 scene        | 单元测试 | scene.children 包含 mesh |
| TEST-CO-013 | 配置变更触发 mesh 更新     | 单元测试 | mesh 属性响应更新        |
| TEST-CO-014 | position 变更触发更新      | 单元测试 | position 正确更新        |
| TEST-CO-015 | scale 变更触发更新         | 单元测试 | scale 正确更新           |
| TEST-CO-016 | rotation 变更触发更新      | 单元测试 | rotation 正确更新        |
| TEST-CO-017 | material 颜色变更触发更新  | 单元测试 | material.color 正确更新  |
| TEST-CO-018 | 组件卸载时移除 mesh        | 单元测试 | scene 不再包含 mesh      |
| TEST-CO-019 | 组件卸载时销毁 mesh        | 单元测试 | mesh 资源被释放          |

### 2.3 useLight 测试

| 测试ID      | 测试名称         | 测试类型 | 预期结果              |
| ----------- | ---------------- | -------- | --------------------- |
| TEST-CO-020 | 创建环境光实例   | 单元测试 | AmbientLight 实例     |
| TEST-CO-021 | 创建方向光实例   | 单元测试 | DirectionalLight 实例 |
| TEST-CO-022 | 创建点光源实例   | 单元测试 | PointLight 实例       |
| TEST-CO-023 | 灯光颜色配置生效 | 单元测试 | light.color 正确      |
| TEST-CO-024 | 灯光强度配置生效 | 单元测试 | light.intensity 正确  |
| TEST-CO-025 | 灯光位置配置生效 | 单元测试 | light.position 正确   |

---

## 三、组件测试

### 3.1 TCanvas 组件测试

| 测试ID        | 测试名称                         | 测试类型 | 预期结果                |
| ------------- | -------------------------------- | -------- | ----------------------- |
| TEST-COMP-001 | 组件正常渲染 canvas 元素         | 组件测试 | DOM 中存在 canvas       |
| TEST-COMP-002 | canvas style 正确应用            | 组件测试 | style 包含正确的宽高    |
| TEST-COMP-003 | provide ThreeContext             | 组件测试 | 子组件可 inject 上下文  |
| TEST-COMP-004 | 窗口 resize 触发 canvas 尺寸更新 | 组件测试 | renderer.setSize 被调用 |

### 3.2 TMesh 组件测试

| 测试ID        | 测试名称               | 测试类型 | 预期结果             |
| ------------- | ---------------------- | -------- | -------------------- |
| TEST-COMP-005 | TMesh 正常挂载到 scene | 组件测试 | scene 包含 mesh      |
| TEST-COMP-006 | config prop 类型校验   | 组件测试 | 错误类型抛出警告     |
| TEST-COMP-007 | expose mesh 实例       | 组件测试 | 通过 ref 可访问 mesh |
| TEST-COMP-008 | deep watch config 变更 | 组件测试 | 深度更新触发重新渲染 |

### 3.3 几何体组件测试

| 测试ID       | 测试名称                   | 测试类型 | 预期结果                  |
| ------------ | -------------------------- | -------- | ------------------------- |
| TEST-GEO-001 | TBox 创建正确的几何体      | 组件测试 | BoxGeometry 参数正确      |
| TEST-GEO-002 | TSphere 创建正确的几何体   | 组件测试 | SphereGeometry 参数正确   |
| TEST-GEO-003 | TPlane 创建正确的几何体    | 组件测试 | PlaneGeometry 参数正确    |
| TEST-GEO-004 | TCylinder 创建正确的几何体 | 组件测试 | CylinderGeometry 参数正确 |
| TEST-GEO-005 | 几何体 args 参数正确传递   | 组件测试 | 构造参数正确              |

### 3.4 材质组件测试

| 测试ID       | 测试名称                                      | 测试类型 | 预期结果                    |
| ------------ | --------------------------------------------- | -------- | --------------------------- |
| TEST-MAT-001 | TMeshBasicMaterial 颜色正确                   | 组件测试 | color 正确设置              |
| TEST-MAT-002 | TMeshStandardMaterial metalness 正确          | 组件测试 | metalness 正确              |
| TEST-MAT-003 | TMeshStandardMaterial roughness 正确          | 组件测试 | roughness 正确              |
| TEST-MAT-006 | TMeshPhysicalMaterial clearcoat 正确          | 组件测试 | clearcoat 属性正确          |
| TEST-MAT-007 | TMeshPhysicalMaterial clearcoatRoughness 正确 | 组件测试 | clearcoatRoughness 属性正确 |
| TEST-MAT-008 | TMeshPhysicalMaterial transmission 正确       | 组件测试 | transmission 属性正确       |
| TEST-MAT-009 | TMeshPhysicalMaterial thickness 正确          | 组件测试 | thickness 属性正确          |
| TEST-MAT-010 | TMeshPhysicalMaterial ior 正确                | 组件测试 | ior 属性正确                |
| TEST-MAT-011 | TMeshPhysicalMaterial iridescence 正确        | 组件测试 | iridescence 属性正确        |
| TEST-MAT-012 | TMeshPhysicalMaterial sheen 正确              | 组件测试 | sheen 属性正确              |
| TEST-MAT-004 | transparent 配置生效                          | 组件测试 | material.transparent 正确   |
| TEST-MAT-005 | opacity 配置生效                              | 组件测试 | material.opacity 正确       |

### 3.5 光源组件测试

| 测试ID         | 测试名称                     | 测试类型 | 预期结果         |
| -------------- | ---------------------------- | -------- | ---------------- |
| TEST-LIGHT-001 | TAmbientLight 添加到场景     | 组件测试 | scene 包含环境光 |
| TEST-LIGHT-002 | TDirectionalLight 添加到场景 | 组件测试 | scene 包含方向光 |
| TEST-LIGHT-003 | TPointLight 添加到场景       | 组件测试 | scene 包含点光源 |
| TEST-LIGHT-004 | 灯光 intensity 属性响应式    | 组件测试 | 变更后实时更新   |

### 3.6 相机控制器测试

| 测试ID       | 测试名称                          | 测试类型 | 预期结果            |
| ------------ | --------------------------------- | -------- | ------------------- |
| TEST-CAM-001 | TPerspectiveCamera fov 正确       | 组件测试 | camera.fov 正确设置 |
| TEST-CAM-002 | TPerspectiveCamera near/far 正确  | 组件测试 | near/far 正确       |
| TEST-CAM-003 | TOrbitControls enableDamping 正确 | 组件测试 | controls 配置正确   |
| TEST-CAM-004 | TOrbitControls autoRotate 正确    | 组件测试 | autoRotate 正确设置 |

### 3.7 模型加载测试

| 测试ID        | 测试名称                 | 测试类型 | 预期结果          |
| ------------- | ------------------------ | -------- | ----------------- |
| TEST-LOAD-001 | TGLTFLoader 加载成功回调 | 组件测试 | onLoad 被调用     |
| TEST-LOAD-002 | TGLTFLoader 加载失败回调 | 组件测试 | onError 被调用    |
| TEST-LOAD-003 | TGLTFLoader 加载进度回调 | 组件测试 | onProgress 被调用 |
| TEST-LOAD-004 | 模型添加到场景           | 组件测试 | scene 包含模型    |
| TEST-LOAD-005 | 模型 scale 正确应用      | 组件测试 | model.scale 正确  |
| TEST-LOAD-006 | 组件卸载时清理模型       | 组件测试 | 模型资源被释放    |

### 3.8 后期处理组件测试

| 测试ID      | 测试名称                             | 测试类型 | 预期结果                            |
| ----------- | ------------------------------------ | -------- | ----------------------------------- |
| TEST-PP-001 | TEffectComposer 正确创建             | 组件测试 | EffectComposer 实例存在             |
| TEST-PP-002 | TBloomPass 添加到 Composer           | 组件测试 | composer.passes 包含 BloomPass      |
| TEST-PP-003 | TSSAAPass 添加到 Composer            | 组件测试 | composer.passes 包含 SSAARenderPass |
| TEST-PP-004 | TOutlinePass 正确创建                | 组件测试 | OutlinePass 实例存在                |
| TEST-PP-005 | OutlinePass edgeStrength 配置生效    | 组件测试 | edgeStrength 属性正确设置           |
| TEST-PP-006 | OutlinePass edgeGlow 配置生效        | 组件测试 | edgeGlow 属性正确设置               |
| TEST-PP-007 | OutlinePass edgeThickness 配置生效   | 组件测试 | edgeThickness 属性正确设置          |
| TEST-PP-008 | OutlinePass 描边颜色配置生效         | 组件测试 | visibleEdgeColor 正确设置           |
| TEST-PP-009 | OutlinePass hiddenEdgeColor 配置生效 | 组件测试 | hiddenEdgeColor 正确设置            |
| TEST-PP-010 | OutlinePass pulsePeriod 闪烁效果     | 组件测试 | pulsePeriod 动画周期正确            |
| TEST-PP-011 | selectedObjects 选中对象描边         | 组件测试 | 选中对象显示描边效果                |
| TEST-PP-012 | 动态添加/移除选中对象                | 组件测试 | 描边效果实时更新                    |
| TEST-PP-013 | 多个对象同时描边                     | 组件测试 | 所有选中对象都显示描边              |
| TEST-PP-014 | 组件卸载时清理 Pass 资源             | 组件测试 | pass 资源被 dispose                 |

---

## 四、Playground 测试

### 4.1 GUI 调试测试

| 测试ID       | 测试名称                      | 测试类型 | 预期结果         |
| ------------ | ----------------------------- | -------- | ---------------- |
| TEST-GUI-001 | GUI 面板正常创建              | E2E 测试 | GUI 容器存在     |
| TEST-GUI-002 | 选择对象显示对应属性          | E2E 测试 | 控制面板更新     |
| TEST-GUI-003 | Position X slider 变更位置    | E2E 测试 | 对象位置实时更新 |
| TEST-GUI-004 | Position Y slider 变更位置    | E2E 测试 | 对象位置实时更新 |
| TEST-GUI-005 | Position Z slider 变更位置    | E2E 测试 | 对象位置实时更新 |
| TEST-GUI-006 | Rotation slider 变更旋转      | E2E 测试 | 对象旋转实时更新 |
| TEST-GUI-007 | Scale slider 变更缩放         | E2E 测试 | 对象缩放实时更新 |
| TEST-GUI-008 | Color picker 变更颜色         | E2E 测试 | 材质颜色实时更新 |
| TEST-GUI-009 | Intensity slider 变更灯光强度 | E2E 测试 | 灯光强度实时更新 |
| TEST-GUI-010 | 双向绑定：代码变更同步 GUI    | E2E 测试 | GUI 值同步更新   |

### 4.2 导航测试

| 测试ID      | 测试名称           | 测试类型 | 预期结果           |
| ----------- | ------------------ | -------- | ------------------ |
| TEST-PG-001 | 组件列表正常渲染   | E2E 测试 | 所有组件分类可见   |
| TEST-PG-002 | 点击组件切换演示   | E2E 测试 | 路由切换，场景更新 |
| TEST-PG-003 | 几何体演示页面加载 | E2E 测试 | 3D 对象可见        |
| TEST-PG-004 | 材质演示页面加载   | E2E 测试 | 材质示例可见       |
| TEST-PG-005 | 灯光演示页面加载   | E2E 测试 | 灯光效果可见       |
| TEST-PG-006 | 模型演示页面加载   | E2E 测试 | 模型加载可见       |

### 4.3 配置导出测试

| 测试ID      | 测试名称          | 测试类型 | 预期结果         |
| ----------- | ----------------- | -------- | ---------------- |
| TEST-PG-007 | 导出 JSON 配置    | E2E 测试 | 包含当前场景配置 |
| TEST-PG-008 | 导出 Vue 代码片段 | E2E 测试 | 语法正确可运行   |
| TEST-PG-009 | 复制到剪贴板功能  | E2E 测试 | 剪贴板包含代码   |

---

## 五、交互事件系统测试

### 5.1 核心类型测试

| 测试ID       | 测试名称                     | 测试类型 | 预期结果            |
| ------------ | ---------------------------- | -------- | ------------------- |
| TEST-EVT-001 | InteractionEvent 类型完整    | 类型测试 | 包含所有必填字段    |
| TEST-EVT-002 | InteractionHandlers 类型完整 | 类型测试 | 包含所有事件处理器  |
| TEST-EVT-003 | InteractionContext 可注入    | 单元测试 | 子组件可成功 inject |

### 5.2 useInteraction 测试

| 测试ID       | 测试名称                      | 测试类型 | 预期结果                   |
| ------------ | ----------------------------- | -------- | -------------------------- |
| TEST-EVT-004 | Raycaster 实例正确创建        | 单元测试 | Raycaster 实例存在         |
| TEST-EVT-005 | 屏幕坐标转 NDC 坐标正确       | 单元测试 | 转换结果在 [-1, 1] 范围    |
| TEST-EVT-006 | registerObject 正确注册对象   | 单元测试 | 对象加入 interactionMap    |
| TEST-EVT-007 | unregisterObject 正确注销对象 | 单元测试 | 对象从 interactionMap 移除 |
| TEST-EVT-008 | 重复注册同一对象不报错        | 单元测试 | 不抛出异常                 |
| TEST-EVT-009 | 射线检测命中已注册对象        | 单元测试 | 触发 onClick 回调          |
| TEST-EVT-010 | 射线检测未命中不触发回调      | 单元测试 | 不触发任何回调             |
| TEST-EVT-011 | 多个对象只触发最前面的        | 单元测试 | 只有距离最近的对象触发     |
| TEST-EVT-012 | 鼠标进入触发 pointerenter     | 单元测试 | onPointerEnter 被调用      |
| TEST-EVT-013 | 鼠标离开触发 pointerleave     | 单元测试 | onPointerLeave 被调用      |
| TEST-EVT-014 | pointerenter 只触发一次       | 单元测试 | 悬停期间不重复触发         |
| TEST-EVT-015 | stopPropagation 阻止冒泡      | 单元测试 | 父对象不触发回调           |
| TEST-EVT-016 | 组件卸载时清理事件监听        | 单元测试 | 事件监听器被移除           |

### 5.3 组件集成测试

| 测试ID       | 测试名称                           | 测试类型 | 预期结果                    |
| ------------ | ---------------------------------- | -------- | --------------------------- |
| TEST-EVT-017 | TCanvas provide InteractionContext | 组件测试 | 子组件可获取上下文          |
| TEST-EVT-018 | TMesh 自动注册到交互系统           | 组件测试 | mesh 在 interactionMap 中   |
| TEST-EVT-019 | TMesh @click 事件触发              | 组件测试 | 点击 mesh 触发回调          |
| TEST-EVT-020 | TMesh @pointer-enter 事件触发      | 组件测试 | 鼠标进入触发回调            |
| TEST-EVT-021 | TMesh @pointer-leave 事件触发      | 组件测试 | 鼠标离开触发回调            |
| TEST-EVT-022 | 事件包含正确的 point               | 组件测试 | Vector3 坐标正确            |
| TEST-EVT-023 | 事件包含正确的 distance            | 组件测试 | 距离数值正确                |
| TEST-EVT-024 | 事件包含正确的 face                | 组件测试 | Face 对象正确               |
| TEST-EVT-025 | 事件包含正确的 uv                  | 组件测试 | Vector2 坐标正确            |
| TEST-EVT-026 | 事件包含原始 MouseEvent            | 组件测试 | event 对象正确              |
| TEST-EVT-027 | TMesh 卸载时自动注销               | 组件测试 | mesh 从 interactionMap 移除 |
| TEST-EVT-028 | 事件处理器变更自动更新             | 组件测试 | 使用新的处理器函数          |
| TEST-EVT-029 | TGroup 子对象支持交互              | 组件测试 | Group 内 mesh 可点击        |
| TEST-EVT-030 | 嵌套对象事件正确触发               | 组件测试 | 按层级正确触发              |

### 5.4 性能测试

| 测试ID       | 测试名称                  | 测试类型 | 预期结果        |
| ------------ | ------------------------- | -------- | --------------- |
| TEST-EVT-031 | 100 个对象点击检测无延迟  | 性能测试 | 响应时间 < 16ms |
| TEST-EVT-032 | 频繁 mousemove 无性能问题 | 性能测试 | FPS 保持 60     |

---

## 六、CSS2D 标签渲染系统测试

### 6.1 核心类型测试

| 测试ID       | 测试名称                      | 测试类型 | 预期结果                      |
| ------------ | ----------------------------- | -------- | ----------------------------- |
| TEST-CSS-001 | CSS2DContext 类型定义完整     | 类型测试 | 包含所有必填字段              |
| TEST-CSS-002 | CSS2DLabelConfig 类型定义完整 | 类型测试 | 包含所有配置项                |
| TEST-CSS-003 | CSS2DContextKey 可注入        | 单元测试 | 子组件可成功 inject 上下文    |

### 6.2 useCSS2DRenderer 测试

| 测试ID       | 测试名称                              | 测试类型 | 预期结果                            |
| ------------ | ------------------------------------- | -------- | ----------------------------------- |
| TEST-CSS-004 | onMounted 后创建 CSS2DRenderer 实例   | 单元测试 | CSS2DRenderer 实例存在              |
| TEST-CSS-005 | 正确创建 label 容器 DOM 元素          | 单元测试 | 容器 div 存在于 DOM 中              |
| TEST-CSS-006 | 容器使用 absolute 定位                | 单元测试 | position: absolute                 |
| TEST-CSS-007 | 容器 z-index 正确（高于 canvas）      | 单元测试 | z-index: 2                          |
| TEST-CSS-008 | 容器 pointer-events: none             | 单元测试 | 容器本身不阻挡事件                  |
| TEST-CSS-009 | addLabel 正确添加标签到场景           | 单元测试 | scene.children 包含 CSS2DObject     |
| TEST-CSS-010 | removeLabel 正确从场景移除标签        | 单元测试 | scene.children 不再包含标签         |
| TEST-CSS-011 | 正确计算标签到相机的距离              | 单元测试 | distance 值计算准确                 |
| TEST-CSS-012 | 距离 < minDistance 时隐藏标签         | 单元测试 | display: none                      |
| TEST-CSS-013 | 距离 > maxDistance 时隐藏标签         | 单元测试 | display: none                      |
| TEST-CSS-014 | 距离在范围内时显示标签                | 单元测试 | display: ''                         |
| TEST-CSS-015 | scaleByDistance 启用时标签正确缩放    | 单元测试 | transform 包含 scale 值             |
| TEST-CSS-016 | scaleFactor 缩放因子正确应用          | 单元测试 | 缩放值与 factor 成正比              |
| TEST-CSS-017 | 距离透明度衰减正确应用                | 单元测试 | opacity 值随距离变化                |
| TEST-CSS-018 | 渲染循环中执行 CSS2DRenderer.render() | 集成测试 | render 方法被调用                   |
| TEST-CSS-019 | 组件卸载时清理 CSS2DRenderer          | 单元测试 | 渲染器资源被释放                    |
| TEST-CSS-020 | 组件卸载时移除容器 DOM 元素            | 单元测试 | 容器从 DOM 中移除                   |

### 6.3 组件集成测试

| 测试ID       | 测试名称                              | 测试类型 | 预期结果                            |
| ------------ | ------------------------------------- | -------- | ----------------------------------- |
| TEST-CSS-021 | TCSS2DRenderer provide CSS2DContext   | 组件测试 | 子组件可获取上下文                  |
| TEST-CSS-022 | TCSS2DLabel 创建 CSS2DObject 实例      | 组件测试 | CSS2DObject 实例存在                |
| TEST-CSS-023 | TCSS2DLabel position 正确应用         | 组件测试 | 3D 坐标正确设置                     |
| TEST-CSS-024 | TCSS2DLabel offset 正确应用           | 组件测试 | margin 偏移值正确设置               |
| TEST-CSS-025 | TCSS2DLabel minDistance 配置生效      | 组件测试 | 近距自动隐藏                        |
| TEST-CSS-026 | TCSS2DLabel maxDistance 配置生效      | 组件测试 | 远距自动隐藏                        |
| TEST-CSS-027 | TCSS2DLabel scaleByDistance 配置生效  | 组件测试 | 缩放随距离变化                      |
| TEST-CSS-028 | TCSS2DLabel className 正确应用        | 组件测试 | class 属性包含指定类名              |
| TEST-CSS-029 | TCSS2DLabel style 样式正确应用        | 组件测试 | 内联样式正确设置                    |
| TEST-CSS-030 | TCSS2DLabel 支持默认插槽              | 组件测试 | 插槽内容渲染到标签内                |
| TEST-CSS-031 | TCSS2DLabel @click 事件触发           | 组件测试 | 点击标签触发回调                    |
| TEST-CSS-032 | TCSS2DLabel @mouseenter 事件触发      | 组件测试 | 鼠标进入触发回调                    |
| TEST-CSS-033 | TCSS2DLabel @mouseleave 事件触发      | 组件测试 | 鼠标离开触发回调                    |
| TEST-CSS-034 | 标签元素 pointer-events: auto         | 组件测试 | 标签可接收点击事件                  |
| TEST-CSS-035 | 标签元素 user-select: none            | 组件测试 | 文本不可选中                        |
| TEST-CSS-036 | 配置变更实时更新标签                  | 组件测试 | 变更后立即生效                      |
| TEST-CSS-037 | 组件卸载时自动注销标签                | 组件测试 | 标签从场景和注册表中移除            |

### 6.4 功能特性测试

| 测试ID       | 测试名称                              | 测试类型 | 预期结果                            |
| ------------ | ------------------------------------- | -------- | ----------------------------------- |
| TEST-CSS-038 | 标签始终面向相机（Billboard）         | 集成测试 | 旋转相机标签始终正面朝向屏幕        |
| TEST-CSS-039 | 3D 坐标与屏幕像素对齐                 | 集成测试 | 标签位置与 3D 点投影位置一致        |
| TEST-CSS-040 | 标签中心正确（0.5, 0.5）              | 单元测试 | center 属性正确设置                 |
| TEST-CSS-041 | 多个标签 z-index 层级正确             | 集成测试 | 层级渲染顺序正确                    |
| TEST-CSS-042 | 标签不阻挡 3D 场景交互                | 集成测试 | 点击空白区域可触发 3D 对象事件      |
| TEST-CSS-043 | 标签点击事件不穿透                    | 集成测试 | 点击标签不触发背后 3D 对象事件      |
| TEST-CSS-044 | 支持完整 CSS 样式                     | 集成测试 | background/border/shadow 等样式生效 |
| TEST-CSS-045 | 支持 CSS transition 过渡动画          | 集成测试 | 样式变更有平滑过渡                  |

### 6.5 性能测试

| 测试ID       | 测试名称                      | 测试类型 | 预期结果          |
| ------------ | ----------------------------- | -------- | ----------------- |
| TEST-CSS-046 | 50 个标签渲染无性能损耗       | 性能测试 | FPS 保持 60       |
| TEST-CSS-047 | 频繁更新标签位置无性能问题    | 性能测试 | 无明显卡顿        |
| TEST-CSS-048 | 组件卸载后无内存泄漏          | 性能测试 | DOM 节点数不增长  |
| TEST-EVT-033 | 大量注册注销无内存泄漏    | 性能测试 | GC 后内存正常   |

---

## 七、Sprite 精灵模型系统测试

### 7.1 核心类型测试

| 测试ID       | 测试名称                          | 测试类型 | 预期结果                      |
| ------------ | --------------------------------- | -------- | ----------------------------- |
| TEST-SPR-001 | SpriteConfig 类型定义完整         | 类型测试 | 包含所有必填字段              |
| TEST-SPR-002 | SpriteMaterialConfig 类型定义完整 | 类型测试 | 包含所有配置项                |
| TEST-SPR-003 | BlendingMode 枚举类型完整         | 类型测试 | 包含所有混合模式              |
| TEST-SPR-004 | SpriteContext 类型定义完整        | 类型测试 | 包含 sprite 和 setMaterial    |
| TEST-SPR-005 | SpriteContextKey 可注入           | 单元测试 | 子组件可成功 inject 上下文    |

### 7.2 工厂方法测试

| 测试ID       | 测试名称                              | 测试类型 | 预期结果                            |
| ------------ | ------------------------------------- | -------- | ----------------------------------- |
| TEST-SPR-006 | createSprite 创建 Sprite 实例         | 单元测试 | 返回 Sprite 实例                    |
| TEST-SPR-007 | createSpriteMaterial 创建材质实例     | 单元测试 | 返回 SpriteMaterial 实例            |
| TEST-SPR-008 | createSprite 正确应用 position        | 单元测试 | sprite.position 正确设置            |
| TEST-SPR-009 | createSprite 正确应用 scale           | 单元测试 | sprite.scale 正确设置               |
| TEST-SPR-010 | createSprite 正确应用 center          | 单元测试 | sprite.center 正确设置              |
| TEST-SPR-011 | createSprite 正确应用 renderOrder     | 单元测试 | sprite.renderOrder 正确设置         |
| TEST-SPR-012 | createSpriteMaterial color 正确       | 单元测试 | material.color 正确设置             |
| TEST-SPR-013 | createSpriteMaterial opacity 正确     | 单元测试 | material.opacity 正确设置           |
| TEST-SPR-014 | createSpriteMaterial transparent 正确 | 单元测试 | material.transparent 正确设置       |
| TEST-SPR-015 | createSpriteMaterial sizeAttenuation  | 单元测试 | material.sizeAttenuation 正确设置   |
| TEST-SPR-016 | createSpriteMaterial depthTest        | 单元测试 | material.depthTest 正确设置         |
| TEST-SPR-017 | createSpriteMaterial depthWrite       | 单元测试 | material.depthWrite 正确设置        |
| TEST-SPR-018 | createSpriteMaterial rotation         | 单元测试 | material.rotation 正确设置          |
| TEST-SPR-019 | resolveBlendingMode normal 模式正确   | 单元测试 | 返回 NormalBlending                 |
| TEST-SPR-020 | resolveBlendingMode additive 正确     | 单元测试 | 返回 AdditiveBlending               |
| TEST-SPR-021 | resolveBlendingMode subtractive 正确  | 单元测试 | 返回 SubtractiveBlending            |
| TEST-SPR-022 | resolveBlendingMode multiply 正确     | 单元测试 | 返回 MultiplyBlending               |
| TEST-SPR-023 | resolveBlendingMode screen 正确       | 单元测试 | 返回 ScreenBlending                 |
| TEST-SPR-024 | 未知 blending 模式使用默认值          | 单元测试 | 默认使用 NormalBlending             |

### 7.3 useSprite Composable 测试

| 测试ID       | 测试名称                              | 测试类型 | 预期结果                            |
| ------------ | ------------------------------------- | -------- | ----------------------------------- |
| TEST-SPR-025 | onBeforeMount 创建 Sprite 实例        | 单元测试 | sprite 是 Sprite 实例               |
| TEST-SPR-026 | Sprite 被添加到 scene                 | 单元测试 | scene.children 包含 sprite          |
| TEST-SPR-027 | provide SpriteContext                 | 单元测试 | 子组件可 inject 获取上下文          |
| TEST-SPR-028 | setMaterial 正确替换材质              | 单元测试 | sprite.material 指向新材质          |
| TEST-SPR-029 | setMaterial 销毁旧材质                | 单元测试 | 旧材质 disposed = true              |
| TEST-SPR-030 | 距离 < minDistance 时隐藏 Sprite      | 单元测试 | sprite.visible = false              |
| TEST-SPR-031 | 距离 > maxDistance 时隐藏 Sprite      | 单元测试 | sprite.visible = false              |
| TEST-SPR-032 | 距离在范围内时显示 Sprite             | 单元测试 | sprite.visible = true               |
| TEST-SPR-033 | center 中心点配置正确应用             | 单元测试 | sprite.center.x/y 正确设置          |
| TEST-SPR-034 | sizeAttenuation = false 时大小不变    | 单元测试 | 透视不影响精灵大小                  |
| TEST-SPR-035 | sizeAttenuation = true 时透视缩放     | 单元测试 | 远距精灵变小                        |
| TEST-SPR-036 | 配置变更触发 sprite 更新              | 单元测试 | sprite 属性响应更新                 |
| TEST-SPR-037 | 组件卸载时移除 sprite                 | 单元测试 | scene 不再包含 sprite               |
| TEST-SPR-038 | 组件卸载时销毁 sprite 资源            | 单元测试 | material.disposed = true            |

### 7.4 着色器特效测试

| 测试ID       | 测试名称                              | 测试类型 | 预期结果                            |
| ------------ | ------------------------------------- | -------- | ----------------------------------- |
| TEST-SPR-039 | clip = circle 圆形裁剪生效            | 集成测试 | 着色器代码包含 circle clip 逻辑     |
| TEST-SPR-040 | clip = rounded 圆角裁剪生效           | 集成测试 | 着色器代码包含 rounded clip 逻辑    |
| TEST-SPR-041 | clip = none 不修改着色器              | 单元测试 | onBeforeCompile 未设置              |
| TEST-SPR-042 | borderRadius 圆角半径正确应用         | 单元测试 | 着色器 uniform 值正确               |
| TEST-SPR-043 | color tint 颜色叠加效果正确           | 集成测试 | 最终颜色 = 纹理颜色 * tint 颜色     |
| TEST-SPR-044 | onBeforeCompile 正确注入着色器        | 单元测试 | shader 代码被正确修改               |
| TEST-SPR-045 | 着色器编译无错误                      | 集成测试 | 控制台无 WebGL 编译错误             |

### 7.5 组件集成测试

| 测试ID       | 测试名称                              | 测试类型 | 预期结果                            |
| ------------ | ------------------------------------- | -------- | ----------------------------------- |
| TEST-SPR-046 | TSprite 正常挂载到 scene              | 组件测试 | scene 包含 sprite                   |
| TEST-SPR-047 | TSprite config prop 类型校验          | 组件测试 | 错误类型抛出警告                    |
| TEST-SPR-048 | TSprite expose sprite 实例            | 组件测试 | 通过 ref 可访问 sprite              |
| TEST-SPR-049 | TSprite @click 事件触发               | 组件测试 | 点击 sprite 触发回调                |
| TEST-SPR-050 | TSprite @pointer-enter 事件触发       | 组件测试 | 鼠标进入触发回调                    |
| TEST-SPR-051 | TSprite @pointer-leave 事件触发       | 组件测试 | 鼠标离开触发回调                    |
| TEST-SPR-052 | TSprite 支持 TSpriteMaterial 插槽     | 组件测试 | 子材质正确应用到 sprite             |
| TEST-SPR-053 | TSpriteMaterial 被正确注入            | 组件测试 | 通过 SpriteContext 设置材质         |
| TEST-SPR-054 | TSpriteMaterial map 纹理正确加载      | 组件测试 | material.map 是 Texture 实例        |
| TEST-SPR-055 | TSpriteMaterial alphaMap 正确加载     | 组件测试 | material.alphaMap 是 Texture 实例   |
| TEST-SPR-056 | TSpriteMaterial blending 正确应用     | 组件测试 | material.blending 正确设置          |
| TEST-SPR-057 | TSpriteMaterial fog 正确应用          | 组件测试 | material.fog 正确设置               |
| TEST-SPR-058 | TSpriteMaterial clip 正确应用         | 组件测试 | 裁剪模式正确应用到着色器            |
| TEST-SPR-059 | TSpriteMaterial 配置变更响应式        | 组件测试 | 属性变更立即更新到材质              |
| TEST-SPR-060 | 精灵始终面向相机（Billboard）         | 集成测试 | 旋转相机精灵始终正面朝向屏幕        |
| TEST-SPR-061 | 精灵深度测试正确                      | 集成测试 | 被 3D 物体遮挡时正确隐藏            |
| TEST-SPR-062 | 精灵正确写入深度缓冲                  | 集成测试 | depthWrite = true 时阻挡后面物体    |

### 7.6 性能测试

| 测试ID       | 测试名称                      | 测试类型 | 预期结果          |
| ------------ | ----------------------------- | -------- | ----------------- |
| TEST-SPR-063 | 100 个精灵渲染 FPS            | 性能测试 | FPS > 55          |
| TEST-SPR-064 | 500 个精灵批量渲染 FPS        | 性能测试 | FPS > 45          |
| TEST-SPR-065 | 大量精灵无内存泄漏            | 性能测试 | 内存稳定          |
| TEST-SPR-066 | 频繁创建销毁精灵无内存泄漏    | 性能测试 | GC 后内存正常     |
| TEST-SPR-067 | 相同纹理精灵共享材质实例      | 性能测试 | 材质复用率 > 90%  |

---

## 八、性能测试

| 测试ID        | 测试名称             | 测试类型 | 预期结果                  |
| ------------- | -------------------- | -------- | ------------------------- |
| TEST-PERF-001 | 100 个 Mesh 渲染 FPS | 性能测试 | FPS > 55                  |
| TEST-PERF-002 | 配置变更防抖生效     | 性能测试 | 100ms 内多次变更只渲染1次 |
| TEST-PERF-003 | Tree Shaking 后体积  | 构建测试 | 只引入 TBox < 50KB        |
| TEST-PERF-004 | 组件无内存泄漏       | 性能测试 | 卸载后内存正常释放        |
| TEST-PERF-005 | 类型构建速度         | 构建测试 | 完整类型构建 < 30s        |

---

## 六、类型测试

| 测试ID        | 测试名称                | 测试类型 | 预期结果               |
| ------------- | ----------------------- | -------- | ---------------------- |
| TEST-TYPE-001 | GeometryConfig 类型检查 | 类型测试 | 错误类型编译报错       |
| TEST-TYPE-002 | MaterialConfig 类型检查 | 类型测试 | 错误属性编译报错       |
| TEST-TYPE-003 | MeshConfig 完整类型推导 | 类型测试 | 属性自动补全           |
| TEST-TYPE-004 | 泛型参数类型推断        | 类型测试 | 根据 type 推断对应配置 |
| TEST-TYPE-005 | 导出类型完整可用        | 类型测试 | tsc --noEmit 无错误    |
