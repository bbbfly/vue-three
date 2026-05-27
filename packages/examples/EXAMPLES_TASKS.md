# Three.js 官方示例验证平台 - 开发任务清单

## 任务规则

- 根据任务列表中示例ID 从 lib/[示例ID].html 官方示例内容
- 使用工作区中 @vue-three/vue-three 组件库 完成对应示例3d场景功能
- 所有任务颗粒度控制在 5-15 分钟完成
- 完成一个任务后 记录完成时间、内容到EXAMPLES_PROGRESS.md 并等待用户确认
- 任务状态：pending → in_progress → completed

---

## 第一阶段：基础框架搭建

| 任务ID | 任务名称                                | 预计耗时 | 优先级 | 状态      |
| ------ | --------------------------------------- | -------- | ------ | --------- |
| EX-001 | 初始化 Examples Vite 项目（Vue 3 + TS） | 10min    | 高     | completed |
| EX-002 | 配置 publicDir 静态资源路径（lib 目录） | 5min     | 高     | completed |
| EX-003 | 集成 @vue-three/core 组件库依赖         | 5min     | 高     | completed |
| EX-004 | 配置 jsm 路径别名（three/addons/）      | 5min     | 高     | completed |
| EX-005 | 集成 Vue Router 4                       | 10min    | 高     | completed |

---

## 第二阶段：核心功能组件

| 任务ID | 任务名称                                    | 预计耗时 | 优先级 | 状态      |
| ------ | ------------------------------------------- | -------- | ------ | --------- |
| EX-006 | 实现首页示例分类列表页面                    | 15min    | 高     | completed |
| EX-007 | 实现示例分类导航栏组件                      | 10min    | 高     | completed |
| EX-008 | 实现代码高亮 CodeBlock 组件                 | 15min    | 中     | completed |
| EX-009 | 实现 CodeCompare 双栏代码对比组件           | 20min    | 中     | pending   |
| EX-010 | 实现官方源码提取功能（从 HTML 提取 script） | 10min    | 中     | completed |
| EX-011 | 实现 ExampleView 示例查看页面布局           | 15min    | 高     | completed |
| EX-012 | 实现示例搜索与筛选功能                      | 10min    | 中     | pending   |
| EX-013 | 实现功能覆盖度统计面板                      | 15min    | 低     | pending   |
| EX-014 | 实现一键复制代码功能                        | 5min     | 中     | pending   |

---

## 第三阶段：核心示例实现 - WebGL 基础（第一阶段）

| 任务ID | 任务名称           | 示例ID                  | 预计耗时 | 优先级 | 状态      |
| ------ | ------------------ | ----------------------- | -------- | ------ | --------- |
| EX-101 | 立方体旋转示例     | webgl_geometry_cube     | 10min    | 高     | completed |
| EX-102 | 轨道控制器示例     | misc_controls_orbit     | 10min    | 高     | completed |
| EX-103 | 基础几何体集合示例 | webgl_geometries        | 15min    | 高     | completed |
| EX-104 | 半球光示例         | webgl_lights_hemisphere | 10min    | 高     | completed |
| EX-105 | Spotlight          | webgl_lights_spotlight  | 10min    | 高     | completed |
| EX-106 | 物理材质示例       | webgl_lights_physical   | 10min    | 高     | completed |
| EX-107 | 材质对比示例       | webgl_materials         | 15min    | 高     | completed |
| EX-108 | Envmaps            | webgl_materials_envmaps | 15min    | 高     | completed |
| EX-109 | 颜色线条示例       | webgl_lines_colors      | 10min    | 高     | completed |
| EX-110 | 辅助对象示例       | webgl_helpers           | 15min    | 高     | completed |
| EX-111 | Label              | css2d_label             | 10min    | 高     | completed |

---

## 第四阶段：CSS2D 示例

| 任务ID | 任务名称 | 示例ID | 预计耗时 | 优先级 | 状态 |
| ------ | -------- | ------ | -------- | ------ | ---- |

---

## 第五阶段：CSS3D 示例

| 任务ID | 任务名称      | 示例ID              | 预计耗时 | 优先级 | 状态      |
| ------ | ------------- | ------------------- | -------- | ------ | --------- |
| EX-501 | 混合          | css3d_mixed         | 15min    | 中     | completed |
| EX-502 | Molecules     | css3d_molecules     | 15min    | 中     | completed |
| EX-503 | 正交          | css3d_orthographic  | 10min    | 中     | completed |
| EX-504 | Periodictable | css3d_periodictable | 15min    | 中     | pending   |
| EX-505 | 沙盒          | css3d_sandbox       | 15min    | 中     | completed |
| EX-506 | Sprites       | css3d_sprites       | 10min    | 中     | completed |
| EX-507 | Youtube       | css3d_youtube       | 15min    | 中     | pending   |

---

## 第六阶段：游戏示例

| 任务ID | 任务名称 | 示例ID    | 预计耗时 | 优先级 | 状态    |
| ------ | -------- | --------- | -------- | ------ | ------- |
| EX-601 | Fps      | games_fps | 20min    | 中     | pending |

---

## 第七阶段：杂项示例

| 任务ID | 任务名称       | 示例ID                    | 预计耗时 | 优先级 | 状态      |
| ------ | -------------- | ------------------------- | -------- | ------ | --------- |
| EX-801 | 动画组         | misc_animation_groups     | 15min    | 中     | pending   |
| EX-802 | 动画keys       | misc_animation_keys       | 15min    | 中     | pending   |
| EX-803 | Boxselection   | misc_boxselection         | 15min    | 中     | pending   |
| EX-804 | 控制器轨迹球   | misc_controls_arcball     | 15min    | 中     | pending   |
| EX-805 | 控制器拖拽     | misc_controls_drag        | 15min    | 中     | pending   |
| EX-806 | 控制器飞行     | misc_controls_fly         | 15min    | 中     | pending   |
| EX-807 | 控制器贴图     | misc_controls_map         | 15min    | 中     | pending   |
| EX-808 | 控制器指针锁定 | misc_controls_pointerlock | 15min    | 中     | pending   |
| EX-809 | 控制器追踪球   | misc_controls_trackball   | 15min    | 中     | completed |
| EX-810 | 控制器变换     | misc_controls_transform   | 20min    | 中     | pending   |
| EX-811 | 导出器draco    | misc_exporter_draco       | 15min    | 低     | pending   |
| EX-812 | 导出器exr      | misc_exporter_exr         | 15min    | 低     | pending   |
| EX-813 | 导出器gcode    | misc_exporter_gcode       | 15min    | 低     | pending   |
| EX-814 | 导出器gltf     | misc_exporter_gltf        | 15min    | 低     | pending   |
| EX-815 | 导出器ktx2     | misc_exporter_ktx2        | 15min    | 低     | pending   |
| EX-816 | 导出器obj      | misc_exporter_obj         | 15min    | 低     | pending   |
| EX-817 | 导出器ply      | misc_exporter_ply         | 15min    | 低     | pending   |
| EX-818 | 导出器stl      | misc_exporter_stl         | 15min    | 低     | pending   |
| EX-819 | 导出器usdz     | misc_exporter_usdz        | 15min    | 低     | pending   |
| EX-820 | Raycaster辅助  | misc_raycaster_helper     | 10min    | 低     | pending   |
| EX-821 | Uvtests        | misc_uv_tests             | 10min    | 低     | pending   |

---

## 第九阶段：物理引擎示例

| 任务ID | 任务名称         | 示例ID                              | 预计耗时 | 优先级 | 状态    |
| ------ | ---------------- | ----------------------------------- | -------- | ------ | ------- |
| EX-901 | Ammo破碎         | physics_ammo_break                  | 20min    | 中     | pending |
| EX-902 | Ammo布料         | physics_ammo_cloth                  | 20min    | 中     | pending |
| EX-903 | Ammo实例化       | physics_ammo_instancing             | 20min    | 中     | pending |
| EX-904 | Ammo绳索         | physics_ammo_rope                   | 15min    | 中     | pending |
| EX-905 | Ammo地形         | physics_ammo_terrain                | 20min    | 中     | pending |
| EX-906 | Ammo体积         | physics_ammo_volume                 | 20min    | 中     | pending |
| EX-907 | Jolt实例化       | physics_jolt_instancing             | 20min    | 中     | pending |
| EX-908 | Rapier基础材质   | physics_rapier_basic                | 15min    | 中     | pending |
| EX-909 | Rapier角色控制器 | physics_rapier_character_controller | 20min    | 中     | pending |
| EX-910 | Rapier实例化     | physics_rapier_instancing           | 20min    | 中     | pending |
| EX-911 | Rapier关节       | physics_rapier_joints               | 15min    | 中     | pending |
| EX-912 | Rapier地形       | physics_rapier_terrain              | 20min    | 中     | pending |
| EX-913 | Rapier车辆控制器 | physics_rapier_vehicle_controller   | 20min    | 中     | pending |

---

## 第十阶段：SVG 示例

| 任务ID  | 任务名称 | 示例ID      | 预计耗时 | 优先级 | 状态    |
| ------- | -------- | ----------- | -------- | ------ | ------- |
| EX-1001 | 线       | svg_lines   | 10min    | 中     | pending |
| EX-1002 | 沙盒     | svg_sandbox | 15min    | 中     | pending |

---

## 第十一阶段：Web Audio 示例

| 任务ID  | 任务名称 | 示例ID               | 预计耗时 | 优先级 | 状态      |
| ------- | -------- | -------------------- | -------- | ------ | --------- |
| EX-1101 | 方向     | webaudio_orientation | 15min    | 低     | pending   |
| EX-1102 | 沙盒     | webaudio_sandbox     | 20min    | 低     | pending   |
| EX-1103 | Timing   | webaudio_timing      | 15min    | 低     | pending   |
| EX-1104 | 可视化   | webaudio_visualizer  | 15min    | 低     | completed |

---

## 第十二阶段：WebGL 基础示例

| 任务ID  | 任务名称                   | 示例ID                            | 预计耗时 | 优先级 | 状态    |
| ------- | -------------------------- | --------------------------------- | -------- | ------ | ------- |
| EX-1201 | 批lodbvh                   | webgl_batch_lod_bvh               | 20min    | 中     | pending |
| EX-1202 | Clipculldistance           | webgl_clipculldistance            | 15min    | 中     | pending |
| EX-1203 | 网格批                     | webgl_mesh_batch                  | 15min    | 中     | pending |
| EX-1204 | 镜像                       | webgl_mirror                      | 15min    | 中     | pending |
| EX-1205 | 变形目标                   | webgl_morphtargets                | 20min    | 中     | pending |
| EX-1206 | 变形目标face               | webgl_morphtargets_face           | 20min    | 中     | pending |
| EX-1207 | 变形目标horse              | webgl_morphtargets_horse          | 20min    | 中     | pending |
| EX-1208 | 变形目标球                 | webgl_morphtargets_sphere         | 20min    | 中     | pending |
| EX-1209 | 变形目标webcam             | webgl_morphtargets_webcam         | 20min    | 中     | pending |
| EX-1210 | Multisampledrenderbuffers  | webgl_multisampled_renderbuffers  | 15min    | 中     | pending |
| EX-1211 | Pmremcubemap               | webgl_pmrem_cubemap               | 15min    | 中     | pending |
| EX-1212 | Pmremequirectangular       | webgl_pmrem_equirectangular       | 15min    | 中     | pending |
| EX-1213 | Pmrem测试                  | webgl_pmrem_test                  | 10min    | 中     | pending |
| EX-1214 | Randomuv                   | webgl_random_uv                   | 10min    | 中     | pending |
| EX-1215 | 折射                       | webgl_refraction                  | 15min    | 中     | pending |
| EX-1216 | Rendertargettexture2darray | webgl_rendertarget_texture2darray | 15min    | 中     | pending |
| EX-1217 | Reversed深度缓冲           | webgl_reversed_depth_buffer       | 15min    | 中     | pending |
| EX-1218 | 着色器                     | webgl_shader                      | 20min    | 中     | pending |
| EX-1219 | Shaders海洋                | webgl_shaders_ocean               | 20min    | 中     | pending |
| EX-1220 | Shaders天空                | webgl_shaders_sky                 | 20min    | 中     | pending |
| EX-1221 | 着色器lava                 | webgl_shader_lava                 | 20min    | 中     | pending |
| EX-1222 | Shadowmesh                 | webgl_shadowmesh                  | 15min    | 中     | pending |
| EX-1223 | 阴影contact                | webgl_shadow_contact              | 15min    | 中     | pending |
| EX-1224 | 简单gi                     | webgl_simple_gi                   | 20min    | 中     | pending |
| EX-1225 | 测试内存                   | webgl_test_memory                 | 10min    | 低     | pending |
| EX-1226 | 测试memory2                | webgl_test_memory2                | 10min    | 低     | pending |
| EX-1227 | 测试widegamut              | webgl_test_wide_gamut             | 10min    | 低     | pending |
| EX-1228 | Texture2darray             | webgl_texture2darray              | 15min    | 中     | pending |
| EX-1229 | Texture2darray压缩         | webgl_texture2darray_compressed   | 15min    | 中     | pending |
| EX-1230 | Texture2darraylayerupdate  | webgl_texture2darray_layerupdate  | 15min    | 中     | pending |
| EX-1231 | Texture3d                  | webgl_texture3d                   | 15min    | 中     | pending |
| EX-1232 | Texture3dpartialupdate     | webgl_texture3d_partialupdate     | 15min    | 中     | pending |
| EX-1233 | Tslclearcoat               | webgl_tsl_clearcoat               | 15min    | 中     | pending |
| EX-1234 | Tsl实例化                  | webgl_tsl_instancing              | 15min    | 中     | pending |
| EX-1235 | Tslshadowmap               | webgl_tsl_shadowmap               | 15min    | 中     | pending |
| EX-1236 | Tsl蒙皮                    | webgl_tsl_skinning                | 20min    | 中     | pending |
| EX-1237 | Ubo                        | webgl_ubo                         | 15min    | 中     | pending |
| EX-1238 | Uboarrays                  | webgl_ubo_arrays                  | 15min    | 中     | pending |
| EX-1239 | Watch                      | webgl_watch                       | 10min    | 低     | pending |

---

## 第十三阶段：WebGL 动画示例

| 任务ID  | 任务名称       | 示例ID                                     | 预计耗时 | 优先级 | 状态    |
| ------- | -------------- | ------------------------------------------ | -------- | ------ | ------- |
| EX-1301 | 关键帧         | webgl_animation_keyframes                  | 15min    | 中     | pending |
| EX-1302 | 多重           | webgl_animation_multiple                   | 15min    | 中     | pending |
| EX-1303 | 蒙皮叠加混合   | webgl_animation_skinning_additive_blending | 20min    | 中     | pending |
| EX-1304 | 蒙皮混合       | webgl_animation_skinning_blending          | 20min    | 中     | pending |
| EX-1305 | 蒙皮反向运动学 | webgl_animation_skinning_ik                | 20min    | 中     | pending |
| EX-1306 | 蒙皮变形       | webgl_animation_skinning_morph             | 20min    | 中     | pending |
| EX-1307 | 行走           | webgl_animation_walk                       | 20min    | 中     | pending |

---

## 第十四阶段：WebGL BufferGeometry 示例

| 任务ID  | 任务名称             | 示例ID                                           | 预计耗时 | 优先级 | 状态      |
| ------- | -------------------- | ------------------------------------------------ | -------- | ------ | --------- |
| EX-1401 | Webglbuffergeometry  | webgl_buffergeometry                             | 15min    | 中     | completed |
| EX-1402 | Attributesinteger    | webgl_buffergeometry_attributes_integer          | 10min    | 中     | completed |
| EX-1403 | Attributesnone       | webgl_buffergeometry_attributes_none             | 10min    | 中     | completed |
| EX-1404 | 自定义attributes粒子 | webgl_buffergeometry_custom_attributes_particles | 20min    | 中     | pending   |
| EX-1405 | Drawrange            | webgl_buffergeometry_drawrange                   | 10min    | 中     | completed |
| EX-1406 | Glbufferattribute    | webgl_buffergeometry_glbufferattribute           | 10min    | 中     | completed |
| EX-1407 | Indexed              | webgl_buffergeometry_indexed                     | 10min    | 中     | completed |
| EX-1408 | 实例化               | webgl_buffergeometry_instancing                  | 15min    | 中     | completed |
| EX-1409 | 实例化billboards     | webgl_buffergeometry_instancing_billboards       | 15min    | 中     | completed |
| EX-1410 | 实例化interleaved    | webgl_buffergeometry_instancing_interleaved      | 15min    | 中     | completed |
| EX-1411 | 线                   | webgl_buffergeometry_lines                       | 10min    | 中     | completed |
| EX-1412 | 线indexed            | webgl_buffergeometry_lines_indexed               | 10min    | 中     | completed |
| EX-1413 | 点                   | webgl_buffergeometry_points                      | 10min    | 中     | completed |
| EX-1414 | 点interleaved        | webgl_buffergeometry_points_interleaved          | 10min    | 中     | completed |
| EX-1415 | 原始着色器           | webgl_buffergeometry_rawshader                   | 20min    | 中     | completed |
| EX-1416 | Selective绘制        | webgl_buffergeometry_selective_draw              | 15min    | 中     | completed |
| EX-1417 | Uint                 | webgl_buffergeometry_uint                        | 10min    | 中     | completed |

---

## 第十五阶段：WebGL 相机示例

| 任务ID  | 任务名称               | 示例ID                              | 预计耗时 | 优先级 | 状态      |
| ------- | ---------------------- | ----------------------------------- | -------- | ------ | --------- |
| EX-1501 | Webgl相机              | webgl_camera                        | 10min    | 中     | completed |
| EX-1502 | Array                  | webgl_camera_array                  | 15min    | 中     | completed |
| EX-1503 | Logarithmicdepthbuffer | webgl_camera_logarithmicdepthbuffer | 15min    | 中     | pending   |

---

## 第十六阶段：WebGL 裁剪示例

| 任务ID  | 任务名称      | 示例ID                      | 预计耗时 | 优先级 | 状态      |
| ------- | ------------- | --------------------------- | -------- | ------ | --------- |
| EX-1601 | Webglclipping | webgl_clipping              | 15min    | 中     | completed |
| EX-1602 | Advanced      | webgl_clipping_advanced     | 20min    | 中     | completed |
| EX-1603 | 相交          | webgl_clipping_intersection | 15min    | 中     | completed |
| EX-1604 | 模板          | webgl_clipping_stencil      | 15min    | 中     | completed |

---

## 第十七阶段：WebGL 自定义属性示例

| 任务ID  | 任务名称              | 示例ID                          | 预计耗时 | 优先级 | 状态    |
| ------- | --------------------- | ------------------------------- | -------- | ------ | ------- |
| EX-1701 | Webgl自定义attributes | webgl_custom_attributes         | 15min    | 中     | pending |
| EX-1702 | 线                    | webgl_custom_attributes_lines   | 10min    | 中     | pending |
| EX-1703 | 点                    | webgl_custom_attributes_points  | 10min    | 中     | pending |
| EX-1704 | Points2               | webgl_custom_attributes_points2 | 15min    | 中     | pending |
| EX-1705 | Points3               | webgl_custom_attributes_points3 | 15min    | 中     | pending |

---

## 第十八阶段：WebGL 贴花示例

| 任务ID  | 任务名称  | 示例ID       | 预计耗时 | 优先级 | 状态    |
| ------- | --------- | ------------ | -------- | ------ | ------- |
| EX-1801 | Webgl贴花 | webgl_decals | 15min    | 中     | pending |

---

## 第十九阶段：WebGL 深度纹理示例

| 任务ID  | 任务名称      | 示例ID              | 预计耗时 | 优先级 | 状态    |
| ------- | ------------- | ------------------- | -------- | ------ | ------- |
| EX-1901 | Webgl深度纹理 | webgl_depth_texture | 15min    | 中     | pending |

---

## 第二十阶段：WebGL 特效示例

| 任务ID  | 任务名称        | 示例ID                        | 预计耗时 | 优先级 | 状态    |
| ------- | --------------- | ----------------------------- | -------- | ------ | ------- |
| EX-2001 | 立体红青        | webgl_effects_anaglyph        | 15min    | 中     | pending |
| EX-2002 | ASCII           | webgl_effects_ascii           | 15min    | 中     | pending |
| EX-2003 | Parallaxbarrier | webgl_effects_parallaxbarrier | 15min    | 中     | pending |
| EX-2004 | 立体声          | webgl_effects_stereo          | 15min    | 中     | pending |

---

## 第二十一阶段：WebGL 帧缓冲纹理示例

| 任务ID  | 任务名称        | 示例ID                    | 预计耗时 | 优先级 | 状态    |
| ------- | --------------- | ------------------------- | -------- | ------ | ------- |
| EX-2101 | Webgl帧缓冲纹理 | webgl_framebuffer_texture | 15min    | 中     | pending |

---

## 第二十二阶段：WebGL 熔炉测试示例

| 任务ID  | 任务名称      | 示例ID             | 预计耗时 | 优先级 | 状态    |
| ------- | ------------- | ------------------ | -------- | ------ | ------- |
| EX-2201 | Webgl熔炉测试 | webgl_furnace_test | 10min    | 低     | pending |

---

## 第二十三阶段：WebGL 几何体示例

| 任务ID  | 任务名称     | 示例ID                            | 预计耗时 | 优先级 | 状态      |
| ------- | ------------ | --------------------------------- | -------- | ------ | --------- |
| EX-2301 | 颜色         | webgl_geometry_colors             | 10min    | 中     | completed |
| EX-2302 | 颜色查找表   | webgl_geometry_colors_lookuptable | 15min    | 中     | pending   |
| EX-2303 | 凸           | webgl_geometry_convex             | 15min    | 中     | completed |
| EX-2304 | CSG          | webgl_geometry_csg                | 20min    | 中     | pending   |
| EX-2305 | 拉伸形状     | webgl_geometry_extrude_shapes     | 15min    | 中     | completed |
| EX-2306 | 拉伸splines  | webgl_geometry_extrude_splines    | 15min    | 中     | pending   |
| EX-2307 | 我的世界     | webgl_geometry_minecraft          | 20min    | 中     | completed |
| EX-2308 | NURBS        | webgl_geometry_nurbs              | 20min    | 中     | pending   |
| EX-2309 | 形状         | webgl_geometry_shapes             | 10min    | 中     | completed |
| EX-2310 | 样条编辑器   | webgl_geometry_spline_editor      | 20min    | 中     | pending   |
| EX-2311 | 茶壶         | webgl_geometry_teapot             | 15min    | 中     | completed |
| EX-2312 | 地形         | webgl_geometry_terrain            | 20min    | 中     | completed |
| EX-2313 | 地形射线检测 | webgl_geometry_terrain_raycast    | 20min    | 中     | completed |
| EX-2314 | 文字         | webgl_geometry_text               | 15min    | 中     | completed |
| EX-2315 | 文字形状     | webgl_geometry_text_shapes        | 15min    | 中     | pending   |
| EX-2316 | 文字描边     | webgl_geometry_text_stroke        | 15min    | 中     | pending   |

---

## 第二十四阶段：WebGL GPGPU 示例

| 任务ID  | 任务名称 | 示例ID                  | 预计耗时 | 优先级 | 状态    |
| ------- | -------- | ----------------------- | -------- | ------ | ------- |
| EX-2401 | 鸟群     | webgl_gpgpu_birds       | 20min    | 中     | pending |
| EX-2402 | 鸟群gltf | webgl_gpgpu_birds_gltf  | 25min    | 中     | pending |
| EX-2403 | 原行星   | webgl_gpgpu_protoplanet | 20min    | 中     | pending |
| EX-2404 | 水       | webgl_gpgpu_water       | 20min    | 中     | pending |

---

## 第二十五阶段：WebGL 实例化示例

| 任务ID  | 任务名称 | 示例ID                       | 预计耗时 | 优先级 | 状态    |
| ------- | -------- | ---------------------------- | -------- | ------ | ------- |
| EX-2501 | Dynamic  | webgl_instancing_dynamic     | 15min    | 中     | pending |
| EX-2502 | 变形     | webgl_instancing_morph       | 20min    | 中     | pending |
| EX-2503 | 性能     | webgl_instancing_performance | 15min    | 中     | pending |
| EX-2504 | 射线检测 | webgl_instancing_raycast     | 15min    | 中     | pending |
| EX-2505 | Scatter  | webgl_instancing_scatter     | 15min    | 中     | pending |

---

## 第二十六阶段：WebGL 交互示例

| 任务ID  | 任务名称       | 示例ID                              | 预计耗时 | 优先级 | 状态      |
| ------- | -------------- | ----------------------------------- | -------- | ------ | --------- |
| EX-2601 | Buffergeometry | webgl_interactive_buffergeometry    | 15min    | 中     | completed |
| EX-2602 | Cubes          | webgl_interactive_cubes             | 15min    | 中     | pending   |
| EX-2603 | Cubesgpu       | webgl_interactive_cubes_gpu         | 20min    | 中     | pending   |
| EX-2604 | Cubesortho     | webgl_interactive_cubes_ortho       | 15min    | 中     | pending   |
| EX-2605 | 线             | webgl_interactive_lines             | 10min    | 中     | pending   |
| EX-2606 | 点             | webgl_interactive_points            | 10min    | 中     | pending   |
| EX-2607 | 射线检测点     | webgl_interactive_raycasting_points | 15min    | 中     | pending   |
| EX-2608 | Voxelpainter   | webgl_interactive_voxelpainter      | 20min    | 中     | pending   |

---

## 第二十七阶段：WebGL 镜头光晕示例

| 任务ID  | 任务名称        | 示例ID           | 预计耗时 | 优先级 | 状态    |
| ------- | --------------- | ---------------- | -------- | ------ | ------- |
| EX-2701 | Webgllensflares | webgl_lensflares | 15min    | 中     | pending |

---

## 第二十八阶段：WebGL 光照探针示例

| 任务ID  | 任务名称         | 示例ID                      | 预计耗时 | 优先级 | 状态    |
| ------- | ---------------- | --------------------------- | -------- | ------ | ------- |
| EX-2801 | Webgl光照探针    | webgl_lightprobe            | 15min    | 中     | pending |
| EX-2802 | 立方体相机       | webgl_lightprobe_cubecamera | 15min    | 中     | pending |
| EX-2803 | Webgllightprobes | webgl_lightprobes           | 15min    | 中     | pending |
| EX-2804 | 复杂             | webgl_lightprobes_complex   | 20min    | 中     | pending |
| EX-2805 | Sponza           | webgl_lightprobes_sponza    | 20min    | 中     | pending |

---

## 第二十九阶段：WebGL 灯光示例

| 任务ID  | 任务名称      | 示例ID                     | 预计耗时 | 优先级 | 状态    |
| ------- | ------------- | -------------------------- | -------- | ------ | ------- |
| EX-2901 | Rectarealight | webgl_lights_rectarealight | 15min    | 中     | pending |
| EX-2902 | Spotlights    | webgl_lights_spotlights    | 15min    | 中     | pending |

---

## 第三十阶段：WebGL 线条示例

| 任务ID  | 任务名称     | 示例ID                     | 预计耗时 | 优先级 | 状态    |
| ------- | ------------ | -------------------------- | -------- | ------ | ------- |
| EX-3001 | Dashed       | webgl_lines_dashed         | 10min    | 中     | pending |
| EX-3002 | 脂肪         | webgl_lines_fat            | 15min    | 中     | pending |
| EX-3003 | 脂肪射线检测 | webgl_lines_fat_raycasting | 15min    | 中     | pending |
| EX-3004 | 脂肪线框     | webgl_lines_fat_wireframe  | 15min    | 中     | pending |

---

## 第三十一阶段：WebGL 模型加载示例

| 任务ID  | 任务名称      | 示例ID                              | 预计耗时 | 优先级 | 状态    |
| ------- | ------------- | ----------------------------------- | -------- | ------ | ------- |
| EX-3101 | 3DM           | webgl_loader_3dm                    | 15min    | 中     | pending |
| EX-3102 | 3DS           | webgl_loader_3ds                    | 15min    | 中     | pending |
| EX-3103 | 3dtiles       | webgl_loader_3dtiles                | 25min    | 中     | pending |
| EX-3104 | 3MF           | webgl_loader_3mf                    | 15min    | 中     | pending |
| EX-3105 | 3mf材质       | webgl_loader_3mf_materials          | 15min    | 中     | pending |
| EX-3106 | AMF           | webgl_loader_amf                    | 15min    | 中     | pending |
| EX-3107 | BVH           | webgl_loader_bvh                    | 15min    | 中     | pending |
| EX-3108 | Collada       | webgl_loader_collada                | 15min    | 中     | pending |
| EX-3109 | Collada运动学 | webgl_loader_collada_kinematics     | 20min    | 中     | pending |
| EX-3110 | Collada蒙皮   | webgl_loader_collada_skinning       | 20min    | 中     | pending |
| EX-3111 | Draco         | webgl_loader_draco                  | 15min    | 中     | pending |
| EX-3112 | FBX           | webgl_loader_fbx                    | 15min    | 中     | pending |
| EX-3113 | Fbxnurbs      | webgl_loader_fbx_nurbs              | 20min    | 中     | pending |
| EX-3114 | GCode         | webgl_loader_gcode                  | 15min    | 中     | pending |
| EX-3115 | Gltf动画指针  | webgl_loader_gltf_animation_pointer | 20min    | 中     | pending |
| EX-3116 | Gltf各向异性  | webgl_loader_gltf_anisotropy        | 15min    | 中     | pending |
| EX-3117 | Gltfavif      | webgl_loader_gltf_avif              | 15min    | 中     | pending |
| EX-3118 | Gltf压缩      | webgl_loader_gltf_compressed        | 15min    | 中     | pending |
| EX-3119 | Gltf色散      | webgl_loader_gltf_dispersion        | 15min    | 中     | pending |
| EX-3120 | Gltf实例化    | webgl_loader_gltf_instancing        | 15min    | 中     | pending |
| EX-3121 | Gltf彩虹效果  | webgl_loader_gltf_iridescence       | 15min    | 中     | pending |
| EX-3122 | Gltf渐进lod   | webgl_loader_gltf_progressive_lod   | 20min    | 中     | pending |
| EX-3123 | Gltf光泽      | webgl_loader_gltf_sheen             | 15min    | 中     | pending |
| EX-3124 | Gltf透射      | webgl_loader_gltf_transmission      | 15min    | 中     | pending |
| EX-3125 | Gltf变体      | webgl_loader_gltf_variants          | 15min    | 中     | pending |
| EX-3126 | IFC           | webgl_loader_ifc                    | 20min    | 中     | pending |
| EX-3127 | Imagebitmap   | webgl_loader_imagebitmap            | 10min    | 中     | pending |
| EX-3128 | Kmz           | webgl_loader_kmz                    | 15min    | 中     | pending |
| EX-3129 | Ldraw         | webgl_loader_ldraw                  | 15min    | 中     | pending |
| EX-3130 | LWO           | webgl_loader_lwo                    | 15min    | 中     | pending |
| EX-3131 | MD2           | webgl_loader_md2                    | 15min    | 中     | pending |
| EX-3132 | Md2控制       | webgl_loader_md2_control            | 20min    | 中     | pending |
| EX-3133 | MDD           | webgl_loader_mdd                    | 15min    | 中     | pending |
| EX-3134 | Nrrd          | webgl_loader_nrrd                   | 15min    | 中     | pending |
| EX-3135 | OBJ           | webgl_loader_obj                    | 15min    | 中     | pending |
| EX-3136 | Pcd           | webgl_loader_pcd                    | 15min    | 中     | pending |
| EX-3137 | Pdb           | webgl_loader_pdb                    | 15min    | 中     | pending |
| EX-3138 | PLY           | webgl_loader_ply                    | 15min    | 中     | pending |
| EX-3139 | STL           | webgl_loader_stl                    | 15min    | 中     | pending |
| EX-3140 | SVG           | webgl_loader_svg                    | 15min    | 中     | pending |
| EX-3141 | 纹理dds       | webgl_loader_texture_dds            | 15min    | 中     | pending |
| EX-3142 | 纹理exr       | webgl_loader_texture_exr            | 15min    | 中     | pending |
| EX-3143 | 纹理hdr       | webgl_loader_texture_hdr            | 15min    | 中     | pending |
| EX-3144 | 纹理ktx       | webgl_loader_texture_ktx            | 15min    | 中     | pending |
| EX-3145 | 纹理ktx2      | webgl_loader_texture_ktx2           | 15min    | 中     | pending |
| EX-3146 | 纹理lottie    | webgl_loader_texture_lottie         | 15min    | 中     | pending |
| EX-3147 | 纹理pvrtc     | webgl_loader_texture_pvrtc          | 15min    | 中     | pending |
| EX-3148 | 纹理tga       | webgl_loader_texture_tga            | 15min    | 中     | pending |
| EX-3149 | 纹理tiff      | webgl_loader_texture_tiff           | 15min    | 中     | pending |
| EX-3150 | 纹理ultrahdr  | webgl_loader_texture_ultrahdr       | 15min    | 中     | pending |
| EX-3151 | TTF           | webgl_loader_ttf                    | 15min    | 中     | pending |
| EX-3152 | USDZ          | webgl_loader_usdz                   | 15min    | 中     | pending |
| EX-3153 | VOX           | webgl_loader_vox                    | 15min    | 中     | pending |
| EX-3154 | VRML          | webgl_loader_vrml                   | 15min    | 中     | pending |
| EX-3155 | XYZ           | webgl_loader_xyz                    | 10min    | 中     | pending |

---

## 第三十二阶段：WebGL LOD 示例

| 任务ID  | 任务名称 | 示例ID    | 预计耗时 | 优先级 | 状态    |
| ------- | -------- | --------- | -------- | ------ | ------- |
| EX-3201 | Webgllod | webgl_lod | 15min    | 中     | pending |

---

## 第三十三阶段：WebGL Marching Cubes 示例

| 任务ID  | 任务名称           | 示例ID              | 预计耗时 | 优先级 | 状态    |
| ------- | ------------------ | ------------------- | -------- | ------ | ------- |
| EX-3301 | WebglmarchingCubes | webgl_marchingcubes | 20min    | 中     | pending |

---

## 第三十四阶段：WebGL 材质示例

| 任务ID  | 任务名称               | 示例ID                                      | 预计耗时 | 优先级 | 状态      |
| ------- | ---------------------- | ------------------------------------------- | -------- | ------ | --------- |
| EX-3401 | Alpha哈希              | webgl_materials_alphahash                   | 15min    | 中     | completed |
| EX-3402 | 混合                   | webgl_materials_blending                    | 15min    | 中     | completed |
| EX-3403 | 混合自定义             | webgl_materials_blending_custom             | 20min    | 中     | completed |
| EX-3404 | 凹凸贴图               | webgl_materials_bumpmap                     | 15min    | 中     | completed |
| EX-3405 | Car                    | webgl_materials_car                         | 20min    | 中     | completed |
| EX-3406 | Channels               | webgl_materials_channels                    | 15min    | 中     | completed |
| EX-3407 | Cubemap                | webgl_materials_cubemap                     | 15min    | 中     | completed |
| EX-3408 | Cubemapdynamic         | webgl_materials_cubemap_dynamic             | 20min    | 中     | completed |
| EX-3409 | Cubemapmipmaps         | webgl_materials_cubemap_mipmaps             | 15min    | 中     | completed |
| EX-3410 | Cubemap折射            | webgl_materials_cubemap_refraction          | 15min    | 中     | completed |
| EX-3411 | Cubemap渲染tomipmaps   | webgl_materials_cubemap_render_to_mipmaps   | 20min    | 中     | completed |
| EX-3412 | Displacementmap        | webgl_materials_displacementmap             | 15min    | 中     | pending   |
| EX-3413 | Envmapsexr             | webgl_materials_envmaps_exr                 | 15min    | 中     | completed |
| EX-3414 | Envmapsfasthdr         | webgl_materials_envmaps_fasthdr             | 15min    | 中     | completed |
| EX-3415 | Envmapsgroundprojected | webgl_materials_envmaps_groundprojected     | 15min    | 中     | completed |
| EX-3416 | Envmapshdr             | webgl_materials_envmaps_hdr                 | 15min    | 中     | completed |
| EX-3417 | 材质捕获               | webgl_materials_matcap                      | 15min    | 中     | completed |
| EX-3418 | Modified               | webgl_materials_modified                    | 15min    | 中     | completed |
| EX-3419 | Normalmap              | webgl_materials_normalmap                   | 15min    | 中     | pending   |
| EX-3420 | Normalmap对象space     | webgl_materials_normalmap_object_space      | 15min    | 中     | pending   |
| EX-3421 | 物理材质clearcoat      | webgl_materials_physical_clearcoat          | 15min    | 中     | pending   |
| EX-3422 | 物理材质透射           | webgl_materials_physical_transmission       | 15min    | 中     | pending   |
| EX-3423 | 物理材质透射alpha      | webgl_materials_physical_transmission_alpha | 15min    | 中     | pending   |
| EX-3424 | Subsurfacescattering   | webgl_materials_subsurface_scattering       | 20min    | 中     | pending   |
| EX-3425 | 纹理各向异性           | webgl_materials_texture_anisotropy          | 15min    | 中     | pending   |
| EX-3426 | 纹理画布               | webgl_materials_texture_canvas              | 15min    | 中     | pending   |
| EX-3427 | 纹理filters            | webgl_materials_texture_filters             | 10min    | 中     | pending   |
| EX-3428 | 纹理html               | webgl_materials_texture_html                | 15min    | 中     | pending   |
| EX-3429 | 纹理manualmipmap       | webgl_materials_texture_manualmipmap        | 15min    | 中     | pending   |
| EX-3430 | 纹理partialupdate      | webgl_materials_texture_partialupdate       | 15min    | 中     | pending   |
| EX-3431 | 纹理rotation           | webgl_materials_texture_rotation            | 10min    | 中     | pending   |
| EX-3432 | Toon                   | webgl_materials_toon                        | 15min    | 中     | pending   |
| EX-3433 | 视频                   | webgl_materials_video                       | 15min    | 中     | pending   |
| EX-3434 | 视频webcam             | webgl_materials_video_webcam                | 15min    | 中     | pending   |
| EX-3435 | 线框                   | webgl_materials_wireframe                   | 10min    | 中     | pending   |

---

## 第三十五阶段：WebGL 数学示例

| 任务ID  | 任务名称 | 示例ID                           | 预计耗时 | 优先级 | 状态      |
| ------- | -------- | -------------------------------- | -------- | ------ | --------- |
| EX-3501 | OBB      | webgl_math_obb                   | 15min    | 中     | completed |
| EX-3502 | 方向变换 | webgl_math_orientation_transform | 15min    | 中     | pending   |

---

## 第三十六阶段：WebGL 修改器示例

| 任务ID  | 任务名称     | 示例ID                         | 预计耗时 | 优先级 | 状态    |
| ------- | ------------ | ------------------------------ | -------- | ------ | ------- |
| EX-3601 | 曲线         | webgl_modifier_curve           | 15min    | 中     | pending |
| EX-3602 | 曲线实例化   | webgl_modifier_curve_instanced | 20min    | 中     | pending |
| EX-3603 | Edgesplit    | webgl_modifier_edgesplit       | 15min    | 中     | pending |
| EX-3604 | Simplifier   | webgl_modifier_simplifier      | 15min    | 中     | pending |
| EX-3605 | 细分         | webgl_modifier_subdivision     | 15min    | 中     | pending |
| EX-3606 | Tessellation | webgl_modifier_tessellation    | 20min    | 中     | pending |

---

## 第三十七阶段：WebGL 多渲染器示例

| 任务ID  | 任务名称         | 示例ID                           | 预计耗时 | 优先级 | 状态    |
| ------- | ---------------- | -------------------------------- | -------- | ------ | ------- |
| EX-3701 | Elements         | webgl_multiple_elements          | 15min    | 中     | pending |
| EX-3702 | Elements文字     | webgl_multiple_elements_text     | 15min    | 中     | pending |
| EX-3703 | Rendertargets    | webgl_multiple_rendertargets     | 20min    | 中     | pending |
| EX-3704 | Scenescomparison | webgl_multiple_scenes_comparison | 15min    | 中     | pending |
| EX-3705 | Views            | webgl_multiple_views             | 15min    | 中     | pending |

---

## 第三十八阶段：WebGL 全景示例

| 任务ID  | 任务名称        | 示例ID                         | 预计耗时 | 优先级 | 状态    |
| ------- | --------------- | ------------------------------ | -------- | ------ | ------- |
| EX-3801 | 立方体          | webgl_panorama_cube            | 15min    | 中     | pending |
| EX-3802 | Equirectangular | webgl_panorama_equirectangular | 15min    | 中     | pending |

---

## 第三十九阶段：WebGL 性能示例

| 任务ID  | 任务名称  | 示例ID            | 预计耗时 | 优先级 | 状态    |
| ------- | --------- | ----------------- | -------- | ------ | ------- |
| EX-3901 | Webgl性能 | webgl_performance | 10min    | 低     | pending |

---

## 第四十阶段：WebGL 点云示例

| 任务ID | 任务名称 | 示例ID | 预计耗时 | 优先级 | 状态 |
| ------ | -------- | ------ | -------- | ------ | ---- |
