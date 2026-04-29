# Three.js 官方示例验证平台 - 验收清单

## 验收说明

- 每完成一个任务，对照此清单进行验收
- 所有项目标记 ✅ 后才算验收通过
- 未通过项需要返工并重新验收

---

## 一、基础框架验收

- [ ] Examples 项目成功初始化（Vite + Vue 3 + TypeScript）
- [ ] publicDir 配置正确，lib 目录作为静态资源根目录
- [ ] `textures/crate.gif` 等官方资源路径直接可用无需修改
- [ ] `@vue-three/core` 组件库依赖正确集成
- [ ] `three/addons/` 路径别名配置正确
- [ ] Vue Router 4 集成并配置基础路由
- [ ] `npm run dev` 可正常启动项目（端口 5174）
- [ ] 控制台无警告、无报错
- [ ] TypeScript 严格模式配置正确
- [ ] ESLint 与 Prettier 配置与项目统一

---

## 二、核心功能组件验收

- [ ] 首页示例分类列表正常渲染
- [ ] 示例分类导航栏组件正常工作
- [ ] 点击示例可正确跳转对应路由
- [ ] 路由跳转时 3D 场景正确切换
- [ ] CodeBlock 代码高亮显示正常
- [ ] CodeCompare 双栏布局：左 Vue 代码、右官方 JS 代码
- [ ] 从官方 HTML 正确提取 script 部分源码
- [ ] ExampleView 页面布局：预览区 + 代码对比区
- [ ] 示例搜索功能：按名称/分类筛选
- [ ] 功能覆盖度统计：显示已完成/总数百分比
- [ ] 一键复制代码到剪贴板功能正常
- [ ] 示例间切换无内存泄漏

---

## 三、WebGL 基础示例验收（第一阶段 11 个）

### webgl_geometry_cube
- [ ] 立方体正确渲染，带有 crate 纹理
- [ ] 立方体 X/Y 轴持续旋转（速度与官方一致）
- [ ] 相机位置正确（position.z = 2）
- [ ] 视觉效果与官方 HTML 示例一致
- [ ] 控制台无警告、无报错

### misc_controls_orbit
- [ ] 500 个 InstancedMesh 圆锥体正确渲染
- [ ] OrbitControls 阻尼效果正常
- [ ] 拖拽、缩放、旋转交互正常
- [ ] 按键监听事件正常
- [ ] 场景背景色与雾化效果正确

### webgl_geometries
- [ ] 所有基础几何体（Box/Sphere/Plane/Cylinder/Torus/Cone）全部展示
- [ ] 每个几何体位置分布正确
- [ ] 材质与光照正确
- [ ] 可交互旋转查看

### webgl_lights_hemisphere
- [ ] 半球光效果正确（天空/地面颜色渐变）
- [ ] 多个球体正确渲染
- [ ] 球体动画效果正确
- [ ] 光照方向与强度与官方一致

### webgl_lights_spotlight
- [ ] 聚光灯投影正确
- [ ] 阴影效果正确渲染
- [ ] 聚光灯位置动画正确
- [ ] 辅助线正确显示灯光范围

### webgl_lights_physical
- [ ] 物理灯光（RectAreaLight）正确渲染
- [ ] 灯光形状与尺寸正确
- [ ] 材质对物理灯光的响应正确
- [ ] 阴影质量正确

### webgl_materials
- [ ] 所有材质类型对比展示
- [ ] 材质属性正确应用
- [ ] 灯光对各材质影响正确

### webgl_materials_envmaps
- [ ] 环境贴图正确加载
- [ ] 材质反射效果正确
- [ ] 环境贴图影响所有材质

### webgl_lines_colors
- [ ] 彩色线条正确渲染
- [ ] 线条宽度与颜色正确
- [ ] 线条动画效果正确

### webgl_helpers
- [ ] AxesHelper / GridHelper 正确显示
- [ ] CameraHelper / DirectionalLightHelper 正确显示
- [ ] 所有辅助对象位置与颜色正确

### css2d_label
- [ ] Earth/Moon 星球正确渲染
- [ ] CSS2D 标签正确显示在星球旁边
- [ ] 标签距离可见性控制正确
- [ ] 图层切换功能正常

---

## 四、模型加载示例验收

### webgl_loader_gltf
- [ ] GLTF 模型正确加载和渲染
- [ ] 模型纹理和材质正确显示
- [ ] 模型缩放与位置正确
- [ ] 加载进度回调正确触发

### webgl_loader_gltf_animation
- [ ] 模型骨骼动画正常播放
- [ ] 动画混合平滑
- [ ] 动画时间控制正确

### webgl_loader_obj
- [ ] OBJ 模型正确加载
- [ ] 材质纹理正确映射
- [ ] 模型缩放正确

### webgl_loader_fbx
- [ ] FBX 模型正确加载
- [ ] 骨骼动画正常播放
- [ ] 材质属性正确

### webgl_loader_draco
- [ ] DRACO 压缩模型正确解码
- [ ] 模型几何数据完整
- [ ] 加载性能与官方一致

---

## 五、动画与后期示例验收

### webgl_animation_keyframes
- [ ] 关键帧动画正确播放
- [ ] 动画插值平滑
- [ ] 时间轴控制准确

### webgl_animation_skinning_blending
- [ ] 骨骼蒙皮动画正确
- [ ] 多个动画混合播放
- [ ] 动画过渡平滑

### webgl_postprocessing_bloom
- [ ] Bloom 发光效果正确
- [ ] 发光强度与阈值正确
- [ ] 性能开销在可接受范围

### webgl_postprocessing_ssaa
- [ ] 抗锯齿效果明显
- [ ] 采样率配置正确
- [ ] 边缘无明显锯齿

### webgl_postprocessing_outline
- [ ] 物体描边效果正确
- [ ] 描边颜色与粗细可配置
- [ ] 选中物体正确高亮

---

## 六、交互事件示例验收

### webgl_interactive_cubes
- [ ] 点击立方体触发事件回调
- [ ] 点击反馈（变色/缩放）正确
- [ ] 点击只触发最前面的物体
- [ ] 性能正常（100个对象无延迟）

### webgl_interactive_raycasting_points
- [ ] 点云对象正确响应点击
- [ ] 射线检测精度正确
- [ ] 点击反馈效果正确

### webgl_interactive_lines
- [ ] 线条对象响应点击
- [ ] 悬停高亮效果正确
- [ ] 事件触发准确

### misc_controls_drag
- [ ] 物体拖拽功能正常
- [ ] 拖拽精度准确
- [ ] 释放后位置正确

### misc_controls_transform
- [ ] 平移/旋转/缩放控制正确
- [ ] 变换 gizmo 正确显示
- [ ] 变换操作流畅

---

## 七、功能对等性验收标准

- [ ] **视觉 1:1**：所有示例视觉效果与官方像素级一致
- [ ] **交互 1:1**：所有鼠标/键盘行为与官方完全相同
- [ ] **性能 1:1**：FPS 差距 < 5%，内存占用相当
- [ ] **路径兼容**：100% 使用官方资源路径，无修改
- [ ] **代码质量**：Vue 版本代码行数 ≤ 官方版本 70%
- [ ] **类型完整**：无 any 类型，完整类型标注
- [ ] **无内存泄漏**：示例间切换 20 次，内存稳定
- [ ] **npm run lint**：无 ESLint 警告和错误
- [ ] **npm run type-check**：无类型错误
- [ ] **npm run build**：构建成功，产物无错误
