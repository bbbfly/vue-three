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

| 测试ID       | 测试名称                             | 测试类型 | 预期结果                  |
| ------------ | ------------------------------------ | -------- | ------------------------- |
| TEST-MAT-001 | TMeshBasicMaterial 颜色正确          | 组件测试 | color 正确设置            |
| TEST-MAT-002 | TMeshStandardMaterial metalness 正确 | 组件测试 | metalness 正确            |
| TEST-MAT-003 | TMeshStandardMaterial roughness 正确 | 组件测试 | roughness 正确            |
| TEST-MAT-004 | transparent 配置生效                 | 组件测试 | material.transparent 正确 |
| TEST-MAT-005 | opacity 配置生效                     | 组件测试 | material.opacity 正确     |

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
| TEST-EVT-033 | 大量注册注销无内存泄漏    | 性能测试 | GC 后内存正常   |

---

## 六、性能测试

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
