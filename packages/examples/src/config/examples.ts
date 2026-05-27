export interface ExampleInfo {
  id: string
  title: string
  category: string
  completed: boolean
}

export interface ExampleCategory {
  id: string
  name: string
  icon: string
  examples: ExampleInfo[]
}

export const exampleCategories: ExampleCategory[] = [
  {
    id: 'css2d',
    name: 'CSS2D',
    icon: '🏷️',
    examples: [{ id: 'css2d_label', title: 'Label', category: 'css2d', completed: true }]
  },
  {
    id: 'css3d',
    name: 'CSS3D',
    icon: '🗺️',
    examples: [
      { id: 'css3d_mixed', title: '混合', category: 'css3d', completed: true },
      { id: 'css3d_molecules', title: 'Molecules', category: 'css3d', completed: true },
      { id: 'css3d_orthographic', title: '正交', category: 'css3d', completed: true },
      { id: 'css3d_periodictable', title: 'Periodictable', category: 'css3d', completed: true },
      { id: 'css3d_sandbox', title: '沙盒', category: 'css3d', completed: true },
      { id: 'css3d_sprites', title: 'Sprites', category: 'css3d', completed: true },
      { id: 'css3d_youtube', title: 'Youtube', category: 'css3d', completed: false }
    ]
  },
  {
    id: 'games',
    name: '游戏',
    icon: '🎮',
    examples: [{ id: 'games_fps', title: 'Fps', category: 'games', completed: false }]
  },
  {
    id: 'misc',
    name: '杂项',
    icon: '📚',
    examples: [
      { id: 'misc_animation_groups', title: '动画组', category: 'misc', completed: false },
      { id: 'misc_animation_keys', title: '动画keys', category: 'misc', completed: false },
      { id: 'misc_boxselection', title: 'Boxselection', category: 'misc', completed: false },
      { id: 'misc_controls_arcball', title: '控制器轨迹球', category: 'misc', completed: false },
      { id: 'misc_controls_drag', title: '控制器拖拽', category: 'misc', completed: false },
      { id: 'misc_controls_fly', title: '控制器飞行', category: 'misc', completed: false },
      { id: 'misc_controls_map', title: '控制器贴图', category: 'misc', completed: false },
      { id: 'misc_controls_orbit', title: '控制器轨道', category: 'misc', completed: true },
      {
        id: 'misc_controls_pointerlock',
        title: '控制器指针锁定',
        category: 'misc',
        completed: false
      },
      { id: 'misc_controls_trackball', title: '控制器追踪球', category: 'misc', completed: true },
      { id: 'misc_controls_transform', title: '控制器变换', category: 'misc', completed: false },
      { id: 'misc_exporter_draco', title: '导出器draco', category: 'misc', completed: false },
      { id: 'misc_exporter_exr', title: '导出器exr', category: 'misc', completed: false },
      { id: 'misc_exporter_gcode', title: '导出器gcode', category: 'misc', completed: false },
      { id: 'misc_exporter_gltf', title: '导出器gltf', category: 'misc', completed: false },
      { id: 'misc_exporter_ktx2', title: '导出器ktx2', category: 'misc', completed: false },
      { id: 'misc_exporter_obj', title: '导出器obj', category: 'misc', completed: false },
      { id: 'misc_exporter_ply', title: '导出器ply', category: 'misc', completed: false },
      { id: 'misc_exporter_stl', title: '导出器stl', category: 'misc', completed: false },
      { id: 'misc_exporter_usdz', title: '导出器usdz', category: 'misc', completed: false },
      { id: 'misc_raycaster_helper', title: 'Raycaster辅助', category: 'misc', completed: false },
      { id: 'misc_uv_tests', title: 'Uvtests', category: 'misc', completed: false }
    ]
  },
  {
    id: 'physics',
    name: '物理引擎',
    icon: '⚡',
    examples: [
      { id: 'physics_ammo_break', title: 'Ammo破碎', category: 'physics', completed: false },
      { id: 'physics_ammo_cloth', title: 'Ammo布料', category: 'physics', completed: false },
      { id: 'physics_ammo_instancing', title: 'Ammo实例化', category: 'physics', completed: false },
      { id: 'physics_ammo_rope', title: 'Ammo绳索', category: 'physics', completed: false },
      { id: 'physics_ammo_terrain', title: 'Ammo地形', category: 'physics', completed: false },
      { id: 'physics_ammo_volume', title: 'Ammo体积', category: 'physics', completed: false },
      { id: 'physics_jolt_instancing', title: 'Jolt实例化', category: 'physics', completed: false },
      {
        id: 'physics_rapier_basic',
        title: 'Rapier基础材质',
        category: 'physics',
        completed: false
      },
      {
        id: 'physics_rapier_character_controller',
        title: 'Rapier角色控制器',
        category: 'physics',
        completed: false
      },
      {
        id: 'physics_rapier_instancing',
        title: 'Rapier实例化',
        category: 'physics',
        completed: false
      },
      { id: 'physics_rapier_joints', title: 'Rapier关节', category: 'physics', completed: false },
      { id: 'physics_rapier_terrain', title: 'Rapier地形', category: 'physics', completed: false },
      {
        id: 'physics_rapier_vehicle_controller',
        title: 'Rapier车辆控制器',
        category: 'physics',
        completed: false
      }
    ]
  },
  {
    id: 'svg',
    name: 'SVG',
    icon: '📐',
    examples: [
      { id: 'svg_lines', title: '线', category: 'svg', completed: false },
      { id: 'svg_sandbox', title: '沙盒', category: 'svg', completed: false }
    ]
  },
  {
    id: 'webaudio',
    name: 'Web Audio',
    icon: '🎵',
    examples: [
      { id: 'webaudio_orientation', title: '方向', category: 'webaudio', completed: false },
      { id: 'webaudio_sandbox', title: '沙盒', category: 'webaudio', completed: false },
      { id: 'webaudio_timing', title: 'Timing', category: 'webaudio', completed: false },
      { id: 'webaudio_visualizer', title: '可视化', category: 'webaudio', completed: true }
    ]
  },
  {
    id: 'webgl',
    name: 'webgl',
    icon: '📁',
    examples: [
      { id: 'webgl_batch_lod_bvh', title: '批lodbvh', category: 'webgl', completed: false },
      {
        id: 'webgl_clipculldistance',
        title: 'Clipculldistance',
        category: 'webgl',
        completed: false
      },
      { id: 'webgl_geometries', title: '几何体', category: 'webgl', completed: true },
      { id: 'webgl_mesh_batch', title: '网格批', category: 'webgl', completed: false },
      { id: 'webgl_mirror', title: '镜像', category: 'webgl', completed: false },
      { id: 'webgl_morphtargets', title: '变形目标', category: 'webgl', completed: false },
      { id: 'webgl_morphtargets_face', title: '变形目标face', category: 'webgl', completed: false },
      {
        id: 'webgl_morphtargets_horse',
        title: '变形目标horse',
        category: 'webgl',
        completed: false
      },
      { id: 'webgl_morphtargets_sphere', title: '变形目标球', category: 'webgl', completed: false },
      {
        id: 'webgl_morphtargets_webcam',
        title: '变形目标webcam',
        category: 'webgl',
        completed: false
      },
      {
        id: 'webgl_multisampled_renderbuffers',
        title: 'Multisampledrenderbuffers',
        category: 'webgl',
        completed: false
      },
      { id: 'webgl_pmrem_cubemap', title: 'Pmremcubemap', category: 'webgl', completed: false },
      {
        id: 'webgl_pmrem_equirectangular',
        title: 'Pmremequirectangular',
        category: 'webgl',
        completed: false
      },
      { id: 'webgl_pmrem_test', title: 'Pmrem测试', category: 'webgl', completed: false },
      { id: 'webgl_random_uv', title: 'Randomuv', category: 'webgl', completed: false },
      { id: 'webgl_refraction', title: '折射', category: 'webgl', completed: false },
      {
        id: 'webgl_rendertarget_texture2darray',
        title: 'Rendertargettexture2darray',
        category: 'webgl',
        completed: false
      },
      {
        id: 'webgl_reversed_depth_buffer',
        title: 'Reversed深度缓冲',
        category: 'webgl',
        completed: false
      },
      { id: 'webgl_shader', title: '着色器', category: 'webgl', completed: false },
      { id: 'webgl_shaders_ocean', title: 'Shaders海洋', category: 'webgl', completed: false },
      { id: 'webgl_shaders_sky', title: 'Shaders天空', category: 'webgl', completed: false },
      { id: 'webgl_shader_lava', title: '着色器lava', category: 'webgl', completed: false },
      { id: 'webgl_shadowmesh', title: 'Shadowmesh', category: 'webgl', completed: false },
      { id: 'webgl_shadow_contact', title: '阴影contact', category: 'webgl', completed: false },
      { id: 'webgl_simple_gi', title: '简单gi', category: 'webgl', completed: false },
      { id: 'webgl_test_memory', title: '测试内存', category: 'webgl', completed: false },
      { id: 'webgl_test_memory2', title: '测试memory2', category: 'webgl', completed: false },
      { id: 'webgl_test_wide_gamut', title: '测试widegamut', category: 'webgl', completed: false },
      { id: 'webgl_texture2darray', title: 'Texture2darray', category: 'webgl', completed: false },
      {
        id: 'webgl_texture2darray_compressed',
        title: 'Texture2darray压缩',
        category: 'webgl',
        completed: false
      },
      {
        id: 'webgl_texture2darray_layerupdate',
        title: 'Texture2darraylayerupdate',
        category: 'webgl',
        completed: false
      },
      { id: 'webgl_texture3d', title: 'Texture3d', category: 'webgl', completed: false },
      {
        id: 'webgl_texture3d_partialupdate',
        title: 'Texture3dpartialupdate',
        category: 'webgl',
        completed: false
      },
      { id: 'webgl_tsl_clearcoat', title: 'Tslclearcoat', category: 'webgl', completed: false },
      { id: 'webgl_tsl_instancing', title: 'Tsl实例化', category: 'webgl', completed: false },
      { id: 'webgl_tsl_shadowmap', title: 'Tslshadowmap', category: 'webgl', completed: false },
      { id: 'webgl_tsl_skinning', title: 'Tsl蒙皮', category: 'webgl', completed: false },
      { id: 'webgl_ubo', title: 'Ubo', category: 'webgl', completed: false },
      { id: 'webgl_ubo_arrays', title: 'Uboarrays', category: 'webgl', completed: false },
      { id: 'webgl_watch', title: 'Watch', category: 'webgl', completed: false }
    ]
  },
  {
    id: 'animation',
    name: 'WebGL - 动画',
    icon: '🎬',
    examples: [
      { id: 'webgl_animation_keyframes', title: '关键帧', category: 'animation', completed: false },
      { id: 'webgl_animation_multiple', title: '多重', category: 'animation', completed: false },
      {
        id: 'webgl_animation_skinning_additive_blending',
        title: '蒙皮叠加混合',
        category: 'animation',
        completed: false
      },
      {
        id: 'webgl_animation_skinning_blending',
        title: '蒙皮混合',
        category: 'animation',
        completed: false
      },
      {
        id: 'webgl_animation_skinning_ik',
        title: '蒙皮反向运动学',
        category: 'animation',
        completed: false
      },
      {
        id: 'webgl_animation_skinning_morph',
        title: '蒙皮变形',
        category: 'animation',
        completed: false
      },
      { id: 'webgl_animation_walk', title: '行走', category: 'animation', completed: false }
    ]
  },
  {
    id: 'buffergeometry',
    name: 'WebGL - BufferGeometry',
    icon: '📊',
    examples: [
      {
        id: 'webgl_buffergeometry',
        title: 'Webglbuffergeometry',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_attributes_integer',
        title: 'Attributesinteger',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_attributes_none',
        title: 'Attributesnone',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_custom_attributes_particles',
        title: '自定义attributes粒子',
        category: 'buffergeometry',
        completed: false
      },
      {
        id: 'webgl_buffergeometry_drawrange',
        title: 'Drawrange',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_glbufferattribute',
        title: 'Glbufferattribute',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_indexed',
        title: 'Indexed',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_instancing',
        title: '实例化',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_instancing_billboards',
        title: '实例化billboards',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_instancing_interleaved',
        title: '实例化interleaved',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_lines',
        title: '线',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_lines_indexed',
        title: '线indexed',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_points',
        title: '点',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_points_interleaved',
        title: '点interleaved',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_rawshader',
        title: '原始着色器',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_selective_draw',
        title: 'Selective绘制',
        category: 'buffergeometry',
        completed: true
      },
      {
        id: 'webgl_buffergeometry_uint',
        title: 'Uint',
        category: 'buffergeometry',
        completed: true
      }
    ]
  },
  {
    id: 'camera',
    name: 'WebGL - 相机',
    icon: '📷',
    examples: [
      { id: 'webgl_camera', title: 'Webgl相机', category: 'camera', completed: true },
      { id: 'webgl_camera_array', title: 'Array', category: 'camera', completed: true },
      {
        id: 'webgl_camera_logarithmicdepthbuffer',
        title: 'Logarithmicdepthbuffer',
        category: 'camera',
        completed: false
      }
    ]
  },
  {
    id: 'clipping',
    name: 'WebGL - 裁剪',
    icon: '✂️',
    examples: [
      { id: 'webgl_clipping', title: 'Webglclipping', category: 'clipping', completed: true },
      { id: 'webgl_clipping_advanced', title: 'Advanced', category: 'clipping', completed: true },
      { id: 'webgl_clipping_intersection', title: '相交', category: 'clipping', completed: true },
      { id: 'webgl_clipping_stencil', title: '模板', category: 'clipping', completed: true }
    ]
  },
  {
    id: 'custom_attributes',
    name: 'WebGL - 自定义属性',
    icon: '⚙️',
    examples: [
      {
        id: 'webgl_custom_attributes',
        title: 'Webgl自定义attributes',
        category: 'custom_attributes',
        completed: false
      },
      {
        id: 'webgl_custom_attributes_lines',
        title: '线',
        category: 'custom_attributes',
        completed: false
      },
      {
        id: 'webgl_custom_attributes_points',
        title: '点',
        category: 'custom_attributes',
        completed: false
      },
      {
        id: 'webgl_custom_attributes_points2',
        title: 'Points2',
        category: 'custom_attributes',
        completed: false
      },
      {
        id: 'webgl_custom_attributes_points3',
        title: 'Points3',
        category: 'custom_attributes',
        completed: false
      }
    ]
  },
  {
    id: 'decals',
    name: 'WebGL - 贴花',
    icon: '🎭',
    examples: [{ id: 'webgl_decals', title: 'Webgl贴花', category: 'decals', completed: false }]
  },
  {
    id: 'depth_texture',
    name: 'WebGL - 深度纹理',
    icon: '🖼️',
    examples: [
      {
        id: 'webgl_depth_texture',
        title: 'Webgl深度纹理',
        category: 'depth_texture',
        completed: false
      }
    ]
  },
  {
    id: 'effects',
    name: 'WebGL - 特效',
    icon: '✨',
    examples: [
      { id: 'webgl_effects_anaglyph', title: '立体红青', category: 'effects', completed: false },
      { id: 'webgl_effects_ascii', title: 'ASCII', category: 'effects', completed: false },
      {
        id: 'webgl_effects_parallaxbarrier',
        title: 'Parallaxbarrier',
        category: 'effects',
        completed: false
      },
      { id: 'webgl_effects_stereo', title: '立体声', category: 'effects', completed: false }
    ]
  },
  {
    id: 'framebuffer_texture',
    name: 'WebGL - 帧缓冲纹理',
    icon: '🔲',
    examples: [
      {
        id: 'webgl_framebuffer_texture',
        title: 'Webgl帧缓冲纹理',
        category: 'framebuffer_texture',
        completed: false
      }
    ]
  },
  {
    id: 'furnace_test',
    name: 'WebGL - 熔炉测试',
    icon: '🔥',
    examples: [
      {
        id: 'webgl_furnace_test',
        title: 'Webgl熔炉测试',
        category: 'furnace_test',
        completed: false
      }
    ]
  },
  {
    id: 'geometry',
    name: 'WebGL - 几何体',
    icon: '📦',
    examples: [
      { id: 'webgl_geometry_colors', title: '颜色', category: 'geometry', completed: true },
      {
        id: 'webgl_geometry_colors_lookuptable',
        title: '颜色查找表',
        category: 'geometry',
        completed: false
      },
      { id: 'webgl_geometry_convex', title: '凸', category: 'geometry', completed: true },
      { id: 'webgl_geometry_csg', title: 'CSG', category: 'geometry', completed: false },
      { id: 'webgl_geometry_cube', title: '立方体', category: 'geometry', completed: true },
      {
        id: 'webgl_geometry_extrude_shapes',
        title: '拉伸形状',
        category: 'geometry',
        completed: true
      },
      {
        id: 'webgl_geometry_extrude_splines',
        title: '拉伸splines',
        category: 'geometry',
        completed: false
      },
      { id: 'webgl_geometry_minecraft', title: '我的世界', category: 'geometry', completed: true },
      { id: 'webgl_geometry_nurbs', title: 'NURBS', category: 'geometry', completed: false },
      { id: 'webgl_geometry_shapes', title: '形状', category: 'geometry', completed: true },
      {
        id: 'webgl_geometry_spline_editor',
        title: '样条编辑器',
        category: 'geometry',
        completed: false
      },
      { id: 'webgl_geometry_teapot', title: '茶壶', category: 'geometry', completed: true },
      { id: 'webgl_geometry_terrain', title: '地形', category: 'geometry', completed: true },
      {
        id: 'webgl_geometry_terrain_raycast',
        title: '地形射线检测',
        category: 'geometry',
        completed: true
      },
      { id: 'webgl_geometry_text', title: '文字', category: 'geometry', completed: false },
      {
        id: 'webgl_geometry_text_shapes',
        title: '文字形状',
        category: 'geometry',
        completed: false
      },
      {
        id: 'webgl_geometry_text_stroke',
        title: '文字描边',
        category: 'geometry',
        completed: false
      }
    ]
  },
  {
    id: 'gpgpu',
    name: 'WebGL - GPGPU',
    icon: '💻',
    examples: [
      { id: 'webgl_gpgpu_birds', title: '鸟群', category: 'gpgpu', completed: false },
      { id: 'webgl_gpgpu_birds_gltf', title: '鸟群gltf', category: 'gpgpu', completed: false },
      { id: 'webgl_gpgpu_protoplanet', title: '原行星', category: 'gpgpu', completed: false },
      { id: 'webgl_gpgpu_water', title: '水', category: 'gpgpu', completed: false }
    ]
  },
  {
    id: 'helpers',
    name: 'WebGL - 辅助对象',
    icon: '🔧',
    examples: [
      { id: 'webgl_helpers', title: 'Webgl辅助对象', category: 'helpers', completed: true }
    ]
  },
  {
    id: 'instancing',
    name: 'WebGL - 实例化',
    icon: '🔄',
    examples: [
      {
        id: 'webgl_instancing_dynamic',
        title: 'Dynamic',
        category: 'instancing',
        completed: false
      },
      { id: 'webgl_instancing_morph', title: '变形', category: 'instancing', completed: false },
      {
        id: 'webgl_instancing_performance',
        title: '性能',
        category: 'instancing',
        completed: false
      },
      {
        id: 'webgl_instancing_raycast',
        title: '射线检测',
        category: 'instancing',
        completed: false
      },
      { id: 'webgl_instancing_scatter', title: 'Scatter', category: 'instancing', completed: false }
    ]
  },
  {
    id: 'interactive',
    name: 'WebGL - 交互',
    icon: '👆',
    examples: [
      {
        id: 'webgl_interactive_buffergeometry',
        title: 'Buffergeometry',
        category: 'interactive',
        completed: true
      },
      { id: 'webgl_interactive_cubes', title: 'Cubes', category: 'interactive', completed: true },
      {
        id: 'webgl_interactive_cubes_gpu',
        title: 'Cubesgpu',
        category: 'interactive',
        completed: false
      },
      {
        id: 'webgl_interactive_cubes_ortho',
        title: 'Cubesortho',
        category: 'interactive',
        completed: false
      },
      { id: 'webgl_interactive_lines', title: '线', category: 'interactive', completed: false },
      { id: 'webgl_interactive_points', title: '点', category: 'interactive', completed: false },
      {
        id: 'webgl_interactive_raycasting_points',
        title: '射线检测点',
        category: 'interactive',
        completed: false
      },
      {
        id: 'webgl_interactive_voxelpainter',
        title: 'Voxelpainter',
        category: 'interactive',
        completed: false
      }
    ]
  },
  {
    id: 'lensflares',
    name: 'WebGL - 镜头光晕',
    icon: '🌟',
    examples: [
      { id: 'webgl_lensflares', title: 'Webgllensflares', category: 'lensflares', completed: false }
    ]
  },
  {
    id: 'lightprobe',
    name: 'WebGL - 光照探针',
    icon: '💡',
    examples: [
      { id: 'webgl_lightprobe', title: 'Webgl光照探针', category: 'lightprobe', completed: false },
      {
        id: 'webgl_lightprobe_cubecamera',
        title: '立方体相机',
        category: 'lightprobe',
        completed: false
      }
    ]
  },
  {
    id: 'lightprobes',
    name: 'WebGL - 光照探针',
    icon: '💡',
    examples: [
      {
        id: 'webgl_lightprobes',
        title: 'Webgllightprobes',
        category: 'lightprobes',
        completed: false
      },
      { id: 'webgl_lightprobes_complex', title: '复杂', category: 'lightprobes', completed: false },
      { id: 'webgl_lightprobes_sponza', title: 'Sponza', category: 'lightprobes', completed: false }
    ]
  },
  {
    id: 'lights',
    name: 'WebGL - 灯光',
    icon: '💡',
    examples: [
      { id: 'webgl_lights_hemisphere', title: '半球光', category: 'lights', completed: true },
      { id: 'webgl_lights_physical', title: '物理材质', category: 'lights', completed: true },
      {
        id: 'webgl_lights_rectarealight',
        title: 'Rectarealight',
        category: 'lights',
        completed: false
      },
      { id: 'webgl_lights_spotlight', title: 'Spotlight', category: 'lights', completed: true },
      { id: 'webgl_lights_spotlights', title: 'Spotlights', category: 'lights', completed: false }
    ]
  },
  {
    id: 'lines',
    name: 'WebGL - 线条',
    icon: '📏',
    examples: [
      { id: 'webgl_lines_colors', title: '颜色', category: 'lines', completed: true },
      { id: 'webgl_lines_dashed', title: 'Dashed', category: 'lines', completed: false },
      { id: 'webgl_lines_fat', title: '脂肪', category: 'lines', completed: false },
      {
        id: 'webgl_lines_fat_raycasting',
        title: '脂肪射线检测',
        category: 'lines',
        completed: false
      },
      { id: 'webgl_lines_fat_wireframe', title: '脂肪线框', category: 'lines', completed: false }
    ]
  },
  {
    id: 'loader',
    name: 'WebGL - 模型加载',
    icon: '📥',
    examples: [
      { id: 'webgl_loader_3dm', title: '3DM', category: 'loader', completed: false },
      { id: 'webgl_loader_3ds', title: '3DS', category: 'loader', completed: false },
      { id: 'webgl_loader_3dtiles', title: '3dtiles', category: 'loader', completed: false },
      { id: 'webgl_loader_3mf', title: '3MF', category: 'loader', completed: false },
      { id: 'webgl_loader_3mf_materials', title: '3mf材质', category: 'loader', completed: false },
      { id: 'webgl_loader_amf', title: 'AMF', category: 'loader', completed: false },
      { id: 'webgl_loader_bvh', title: 'BVH', category: 'loader', completed: false },
      { id: 'webgl_loader_collada', title: 'Collada', category: 'loader', completed: false },
      {
        id: 'webgl_loader_collada_kinematics',
        title: 'Collada运动学',
        category: 'loader',
        completed: false
      },
      {
        id: 'webgl_loader_collada_skinning',
        title: 'Collada蒙皮',
        category: 'loader',
        completed: false
      },
      { id: 'webgl_loader_draco', title: 'Draco', category: 'loader', completed: false },
      { id: 'webgl_loader_fbx', title: 'FBX', category: 'loader', completed: false },
      { id: 'webgl_loader_fbx_nurbs', title: 'Fbxnurbs', category: 'loader', completed: false },
      { id: 'webgl_loader_gcode', title: 'GCode', category: 'loader', completed: false },
      { id: 'webgl_loader_gltf', title: 'GLTF', category: 'loader', completed: true },
      {
        id: 'webgl_loader_gltf_animation_pointer',
        title: 'Gltf动画指针',
        category: 'loader',
        completed: false
      },
      {
        id: 'webgl_loader_gltf_anisotropy',
        title: 'Gltf各向异性',
        category: 'loader',
        completed: false
      },
      { id: 'webgl_loader_gltf_avif', title: 'Gltfavif', category: 'loader', completed: false },
      {
        id: 'webgl_loader_gltf_compressed',
        title: 'Gltf压缩',
        category: 'loader',
        completed: false
      },
      {
        id: 'webgl_loader_gltf_dispersion',
        title: 'Gltf色散',
        category: 'loader',
        completed: false
      },
      {
        id: 'webgl_loader_gltf_instancing',
        title: 'Gltf实例化',
        category: 'loader',
        completed: false
      },
      {
        id: 'webgl_loader_gltf_iridescence',
        title: 'Gltf彩虹效果',
        category: 'loader',
        completed: false
      },
      {
        id: 'webgl_loader_gltf_progressive_lod',
        title: 'Gltf渐进lod',
        category: 'loader',
        completed: false
      },
      { id: 'webgl_loader_gltf_sheen', title: 'Gltf光泽', category: 'loader', completed: false },
      {
        id: 'webgl_loader_gltf_transmission',
        title: 'Gltf透射',
        category: 'loader',
        completed: false
      },
      { id: 'webgl_loader_gltf_variants', title: 'Gltf变体', category: 'loader', completed: false },
      { id: 'webgl_loader_ifc', title: 'IFC', category: 'loader', completed: false },
      {
        id: 'webgl_loader_imagebitmap',
        title: 'Imagebitmap',
        category: 'loader',
        completed: false
      },
      { id: 'webgl_loader_kmz', title: 'Kmz', category: 'loader', completed: false },
      { id: 'webgl_loader_ldraw', title: 'Ldraw', category: 'loader', completed: false },
      { id: 'webgl_loader_lwo', title: 'LWO', category: 'loader', completed: false },
      { id: 'webgl_loader_md2', title: 'MD2', category: 'loader', completed: false },
      { id: 'webgl_loader_md2_control', title: 'Md2控制', category: 'loader', completed: false },
      { id: 'webgl_loader_mdd', title: 'MDD', category: 'loader', completed: false },
      { id: 'webgl_loader_nrrd', title: 'Nrrd', category: 'loader', completed: false },
      { id: 'webgl_loader_obj', title: 'OBJ', category: 'loader', completed: false },
      { id: 'webgl_loader_pcd', title: 'Pcd', category: 'loader', completed: false },
      { id: 'webgl_loader_pdb', title: 'Pdb', category: 'loader', completed: false },
      { id: 'webgl_loader_ply', title: 'PLY', category: 'loader', completed: false },
      { id: 'webgl_loader_stl', title: 'STL', category: 'loader', completed: false },
      { id: 'webgl_loader_svg', title: 'SVG', category: 'loader', completed: false },
      { id: 'webgl_loader_texture_dds', title: '纹理dds', category: 'loader', completed: false },
      { id: 'webgl_loader_texture_exr', title: '纹理exr', category: 'loader', completed: false },
      { id: 'webgl_loader_texture_hdr', title: '纹理hdr', category: 'loader', completed: false },
      { id: 'webgl_loader_texture_ktx', title: '纹理ktx', category: 'loader', completed: false },
      { id: 'webgl_loader_texture_ktx2', title: '纹理ktx2', category: 'loader', completed: false },
      {
        id: 'webgl_loader_texture_lottie',
        title: '纹理lottie',
        category: 'loader',
        completed: false
      },
      {
        id: 'webgl_loader_texture_pvrtc',
        title: '纹理pvrtc',
        category: 'loader',
        completed: false
      },
      { id: 'webgl_loader_texture_tga', title: '纹理tga', category: 'loader', completed: false },
      { id: 'webgl_loader_texture_tiff', title: '纹理tiff', category: 'loader', completed: false },
      {
        id: 'webgl_loader_texture_ultrahdr',
        title: '纹理ultrahdr',
        category: 'loader',
        completed: false
      },
      { id: 'webgl_loader_ttf', title: 'TTF', category: 'loader', completed: false },
      { id: 'webgl_loader_usdz', title: 'USDZ', category: 'loader', completed: false },
      { id: 'webgl_loader_vox', title: 'VOX', category: 'loader', completed: false },
      { id: 'webgl_loader_vrml', title: 'VRML', category: 'loader', completed: false },
      { id: 'webgl_loader_xyz', title: 'XYZ', category: 'loader', completed: false }
    ]
  },
  {
    id: 'lod',
    name: 'WebGL - LOD',
    icon: '📐',
    examples: [{ id: 'webgl_lod', title: 'Webgllod', category: 'lod', completed: false }]
  },
  {
    id: 'marchingcubes',
    name: 'WebGL - Marching Cubes',
    icon: '🧊',
    examples: [
      {
        id: 'webgl_marchingcubes',
        title: 'WebglmarchingCubes',
        category: 'marchingcubes',
        completed: false
      }
    ]
  },
  {
    id: 'materials',
    name: 'WebGL - 材质',
    icon: '🎨',
    examples: [
      {
        id: 'webgl_materials_alphahash',
        title: 'Alpha哈希',
        category: 'materials',
        completed: true
      },
      { id: 'webgl_materials_blending', title: '混合', category: 'materials', completed: true },
      {
        id: 'webgl_materials_blending_custom',
        title: '混合自定义',
        category: 'materials',
        completed: true
      },
      { id: 'webgl_materials_bumpmap', title: '凹凸贴图', category: 'materials', completed: true },
      { id: 'webgl_materials_car', title: 'Car', category: 'materials', completed: true },
      {
        id: 'webgl_materials_channels',
        title: 'Channels',
        category: 'materials',
        completed: true
      },
      { id: 'webgl_materials_cubemap', title: 'Cubemap', category: 'materials', completed: true },
      {
        id: 'webgl_materials_cubemap_dynamic',
        title: 'Cubemapdynamic',
        category: 'materials',
        completed: true
      },
      {
        id: 'webgl_materials_cubemap_mipmaps',
        title: 'Cubemapmipmaps',
        category: 'materials',
        completed: true
      },
      {
        id: 'webgl_materials_cubemap_refraction',
        title: 'Cubemap折射',
        category: 'materials',
        completed: true
      },
      {
        id: 'webgl_materials_cubemap_render_to_mipmaps',
        title: 'Cubemap渲染tomipmaps',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_displacementmap',
        title: 'Displacementmap',
        category: 'materials',
        completed: true
      },
      { id: 'webgl_materials_envmaps', title: 'Envmaps', category: 'materials', completed: true },
      {
        id: 'webgl_materials_envmaps_exr',
        title: 'Envmapsexr',
        category: 'materials',
        completed: true
      },
      {
        id: 'webgl_materials_envmaps_fasthdr',
        title: 'Envmapsfasthdr',
        category: 'materials',
        completed: true
      },
      {
        id: 'webgl_materials_envmaps_groundprojected',
        title: 'Envmapsgroundprojected',
        category: 'materials',
        completed: true
      },
      {
        id: 'webgl_materials_envmaps_hdr',
        title: 'Envmapshdr',
        category: 'materials',
        completed: true
      },
      { id: 'webgl_materials_matcap', title: '材质捕获', category: 'materials', completed: true },
      {
        id: 'webgl_materials_modified',
        title: 'Modified',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_normalmap',
        title: 'Normalmap',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_normalmap_object_space',
        title: 'Normalmap对象space',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_physical_clearcoat',
        title: '物理材质clearcoat',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_physical_transmission',
        title: '物理材质透射',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_physical_transmission_alpha',
        title: '物理材质透射alpha',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_subsurface_scattering',
        title: 'Subsurfacescattering',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_texture_anisotropy',
        title: '纹理各向异性',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_texture_canvas',
        title: '纹理画布',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_texture_filters',
        title: '纹理filters',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_texture_html',
        title: '纹理html',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_texture_manualmipmap',
        title: '纹理manualmipmap',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_texture_partialupdate',
        title: '纹理partialupdate',
        category: 'materials',
        completed: false
      },
      {
        id: 'webgl_materials_texture_rotation',
        title: '纹理rotation',
        category: 'materials',
        completed: false
      },
      { id: 'webgl_materials_toon', title: 'Toon', category: 'materials', completed: false },
      { id: 'webgl_materials_video', title: '视频', category: 'materials', completed: false },
      {
        id: 'webgl_materials_video_webcam',
        title: '视频webcam',
        category: 'materials',
        completed: false
      },
      { id: 'webgl_materials_wireframe', title: '线框', category: 'materials', completed: false }
    ]
  },
  {
    id: 'math',
    name: 'WebGL - 数学',
    icon: '📐',
    examples: [
      { id: 'webgl_math_obb', title: 'OBB', category: 'math', completed: true },
      {
        id: 'webgl_math_orientation_transform',
        title: '方向变换',
        category: 'math',
        completed: false
      }
    ]
  },
  {
    id: 'modifier',
    name: 'WebGL - 修改器',
    icon: '🔨',
    examples: [
      { id: 'webgl_modifier_curve', title: '曲线', category: 'modifier', completed: false },
      {
        id: 'webgl_modifier_curve_instanced',
        title: '曲线实例化',
        category: 'modifier',
        completed: false
      },
      {
        id: 'webgl_modifier_edgesplit',
        title: 'Edgesplit',
        category: 'modifier',
        completed: false
      },
      {
        id: 'webgl_modifier_simplifier',
        title: 'Simplifier',
        category: 'modifier',
        completed: false
      },
      { id: 'webgl_modifier_subdivision', title: '细分', category: 'modifier', completed: false },
      {
        id: 'webgl_modifier_tessellation',
        title: 'Tessellation',
        category: 'modifier',
        completed: false
      }
    ]
  },
  {
    id: 'multiple',
    name: 'WebGL - 多渲染器',
    icon: '🖥️',
    examples: [
      { id: 'webgl_multiple_elements', title: 'Elements', category: 'multiple', completed: false },
      {
        id: 'webgl_multiple_elements_text',
        title: 'Elements文字',
        category: 'multiple',
        completed: false
      },
      {
        id: 'webgl_multiple_rendertargets',
        title: 'Rendertargets',
        category: 'multiple',
        completed: false
      },
      {
        id: 'webgl_multiple_scenes_comparison',
        title: 'Scenescomparison',
        category: 'multiple',
        completed: false
      },
      { id: 'webgl_multiple_views', title: 'Views', category: 'multiple', completed: false }
    ]
  },
  {
    id: 'panorama',
    name: 'WebGL - 全景',
    icon: '🌄',
    examples: [
      { id: 'webgl_panorama_cube', title: '立方体', category: 'panorama', completed: false },
      {
        id: 'webgl_panorama_equirectangular',
        title: 'Equirectangular',
        category: 'panorama',
        completed: false
      }
    ]
  },
  {
    id: 'performance',
    name: 'WebGL - 性能',
    icon: '⚡',
    examples: [
      { id: 'webgl_performance', title: 'Webgl性能', category: 'performance', completed: false }
    ]
  },
  {
    id: 'points',
    name: 'WebGL - 点云',
    icon: '📍',
    examples: [
      { id: 'webgl_points_billboards', title: 'Billboards', category: 'points', completed: false },
      { id: 'webgl_points_dynamic', title: 'Dynamic', category: 'points', completed: false },
      { id: 'webgl_points_sprites', title: 'Sprites', category: 'points', completed: false },
      { id: 'webgl_points_waves', title: '波浪', category: 'points', completed: false }
    ]
  },
  {
    id: 'portal',
    name: 'WebGL - 传送门',
    icon: '🚪',
    examples: [{ id: 'webgl_portal', title: 'Webgl传送门', category: 'portal', completed: false }]
  },
  {
    id: 'postprocessing',
    name: 'WebGL - 后处理',
    icon: '🎞️',
    examples: [
      {
        id: 'webgl_postprocessing',
        title: 'Webgl后处理',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_3dlut',
        title: '3DLut',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_advanced',
        title: 'Advanced',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_afterimage',
        title: '残像',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_backgrounds',
        title: 'Backgrounds',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_dof',
        title: '景深',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_dof2',
        title: 'Dof2',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_fxaa',
        title: '快速抗锯齿',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_glitch',
        title: 'Glitch',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_godrays',
        title: '上帝光线',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_gtao',
        title: 'Gtao',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_masking',
        title: 'Masking',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_outline',
        title: '轮廓',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_pixel',
        title: '像素',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_procedural',
        title: 'Procedural',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_rgb_halftone',
        title: 'Rgb半色调',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_sao',
        title: 'Sao',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_smaa',
        title: '亚像素抗锯齿',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_sobel',
        title: '边缘检测',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_ssaa',
        title: '超级采样',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_ssao',
        title: '环境光遮蔽',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_ssr',
        title: '屏幕空间反射',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_taa',
        title: 'Taa',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_transition',
        title: '过渡',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_unreal_bloom',
        title: 'Unreal bloom',
        category: 'postprocessing',
        completed: false
      },
      {
        id: 'webgl_postprocessing_unreal_bloom_selective',
        title: 'UnrealBloomselective',
        category: 'postprocessing',
        completed: false
      }
    ]
  },
  {
    id: 'raycaster',
    name: 'WebGL - 射线检测',
    icon: '🔦',
    examples: [
      { id: 'webgl_raycaster_bvh', title: 'BVH', category: 'raycaster', completed: false },
      { id: 'webgl_raycaster_sprite', title: 'Sprite', category: 'raycaster', completed: true },
      { id: 'webgl_raycaster_texture', title: '纹理', category: 'raycaster', completed: false }
    ]
  },
  {
    id: 'read',
    name: 'WebGL - 像素读取',
    icon: '📖',
    examples: [
      { id: 'webgl_read_float_buffer', title: 'Float缓冲', category: 'read', completed: false }
    ]
  },
  {
    id: 'renderer',
    name: 'WebGL - 渲染器',
    icon: '🎛️',
    examples: [
      {
        id: 'webgl_renderer_pathtracer',
        title: 'Pathtracer',
        category: 'renderer',
        completed: false
      }
    ]
  },
  {
    id: 'rtt',
    name: 'WebGL - 渲染到纹理',
    icon: '🖼️',
    examples: [{ id: 'webgl_rtt', title: 'Webglrtt', category: 'rtt', completed: true }]
  },
  {
    id: 'shadowmap',
    name: 'WebGL - 阴影',
    icon: '🌑',
    examples: [
      { id: 'webgl_shadowmap', title: 'Webglshadowmap', category: 'shadowmap', completed: false },
      { id: 'webgl_shadowmap_csm', title: 'Csm', category: 'shadowmap', completed: false },
      { id: 'webgl_shadowmap_pcss', title: 'Pcss', category: 'shadowmap', completed: false },
      { id: 'webgl_shadowmap_performance', title: '性能', category: 'shadowmap', completed: false },
      {
        id: 'webgl_shadowmap_pointlight',
        title: 'Pointlight',
        category: 'shadowmap',
        completed: false
      },
      { id: 'webgl_shadowmap_progressive', title: '渐进', category: 'shadowmap', completed: false },
      { id: 'webgl_shadowmap_viewer', title: 'Viewer', category: 'shadowmap', completed: false },
      { id: 'webgl_shadowmap_vsm', title: 'Vsm', category: 'shadowmap', completed: false }
    ]
  },
  {
    id: 'sprites',
    name: 'WebGL - 精灵',
    icon: '👻',
    examples: [
      { id: 'webgl_sprites', title: 'Webglsprites', category: 'sprites', completed: false }
    ]
  },
  {
    id: 'tonemapping',
    name: 'WebGL - 色调映射',
    icon: '🌗',
    examples: [
      {
        id: 'webgl_tonemapping',
        title: 'Webgltonemapping',
        category: 'tonemapping',
        completed: false
      }
    ]
  },
  {
    id: 'video',
    name: 'WebGL - 视频',
    icon: '📹',
    examples: [
      { id: 'webgl_video_kinect', title: 'Kinect', category: 'video', completed: false },
      {
        id: 'webgl_video_panorama_equirectangular',
        title: 'Panoramaequirectangular',
        category: 'video',
        completed: false
      }
    ]
  },
  {
    id: 'volume',
    name: 'WebGL - 体积',
    icon: '📦',
    examples: [
      { id: 'webgl_volume_cloud', title: '云', category: 'volume', completed: false },
      { id: 'webgl_volume_instancing', title: '实例化', category: 'volume', completed: false },
      { id: 'webgl_volume_perlin', title: 'Perlin', category: 'volume', completed: false }
    ]
  },
  {
    id: 'worker',
    name: 'WebGL - Worker',
    icon: '⚙️',
    examples: [
      {
        id: 'webgl_worker_offscreencanvas',
        title: 'Offscreencanvas',
        category: 'worker',
        completed: false
      }
    ]
  },
  {
    id: 'webgpu',
    name: 'WebGPU',
    icon: '🔮',
    examples: [
      {
        id: 'webgpu_animation_retargeting',
        title: '动画retargeting',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_animation_retargeting_readyplayer',
        title: '动画retargetingreadyplayer',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_backdrop', title: 'Backdrop', category: 'webgpu', completed: false },
      { id: 'webgpu_backdrop_area', title: 'Backdroparea', category: 'webgpu', completed: false },
      { id: 'webgpu_backdrop_water', title: 'Backdrop水', category: 'webgpu', completed: false },
      { id: 'webgpu_camera', title: '相机', category: 'webgpu', completed: false },
      { id: 'webgpu_camera_array', title: '相机array', category: 'webgpu', completed: false },
      {
        id: 'webgpu_camera_logarithmicdepthbuffer',
        title: '相机logarithmicdepthbuffer',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_caustics', title: '焦散', category: 'webgpu', completed: false },
      {
        id: 'webgpu_centroid_sampling',
        title: '质心sampling',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_clearcoat', title: 'Clearcoat', category: 'webgpu', completed: false },
      { id: 'webgpu_clipping', title: 'Clipping', category: 'webgpu', completed: false },
      { id: 'webgpu_compile_async', title: 'Compileasync', category: 'webgpu', completed: false },
      { id: 'webgpu_compute_audio', title: '计算音频', category: 'webgpu', completed: false },
      { id: 'webgpu_compute_birds', title: '计算鸟群', category: 'webgpu', completed: false },
      { id: 'webgpu_compute_cloth', title: '计算布料', category: 'webgpu', completed: false },
      { id: 'webgpu_compute_geometry', title: '计算几何体', category: 'webgpu', completed: false },
      { id: 'webgpu_compute_particles', title: '计算粒子', category: 'webgpu', completed: false },
      {
        id: 'webgpu_compute_particles_fluid',
        title: '计算粒子流体',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_compute_particles_rain',
        title: '计算粒子雨',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_compute_particles_snow',
        title: '计算粒子雪',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_compute_points', title: '计算点', category: 'webgpu', completed: false },
      { id: 'webgpu_compute_reduce', title: '计算reduce', category: 'webgpu', completed: false },
      {
        id: 'webgpu_compute_sort_bitonic',
        title: '计算sortbitonic',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_compute_texture', title: '计算纹理', category: 'webgpu', completed: false },
      {
        id: 'webgpu_compute_texture_3d',
        title: '计算纹理3d',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_compute_texture_pingpong',
        title: '计算纹理pingpong',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_compute_water', title: '计算水', category: 'webgpu', completed: false },
      {
        id: 'webgpu_cubemap_adjustments',
        title: 'Cubemapadjustments',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_cubemap_dynamic',
        title: 'Cubemapdynamic',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_cubemap_mix', title: 'Cubemap混合', category: 'webgpu', completed: false },
      { id: 'webgpu_custom_fog', title: '自定义雾', category: 'webgpu', completed: false },
      {
        id: 'webgpu_custom_fog_background',
        title: '自定义雾background',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_custom_fog_scattering',
        title: '自定义雾scattering',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_depth_texture', title: '深度纹理', category: 'webgpu', completed: false },
      { id: 'webgpu_display_stereo', title: '显示立体声', category: 'webgpu', completed: false },
      {
        id: 'webgpu_equirectangular',
        title: 'Equirectangular',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_fog_height', title: '雾height', category: 'webgpu', completed: false },
      { id: 'webgpu_hdr', title: 'HDR', category: 'webgpu', completed: false },
      { id: 'webgpu_instance_mesh', title: '实例网格', category: 'webgpu', completed: false },
      { id: 'webgpu_instance_path', title: '实例路径', category: 'webgpu', completed: false },
      { id: 'webgpu_instance_points', title: '实例点', category: 'webgpu', completed: false },
      { id: 'webgpu_instance_sprites', title: '实例sprites', category: 'webgpu', completed: false },
      {
        id: 'webgpu_instance_uniform',
        title: '实例 uniform',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_instancing_morph', title: '实例化变形', category: 'webgpu', completed: false },
      { id: 'webgpu_layers', title: 'Layers', category: 'webgpu', completed: false },
      { id: 'webgpu_lensflares', title: 'Lensflares', category: 'webgpu', completed: false },
      { id: 'webgpu_lightprobe', title: '光照探针', category: 'webgpu', completed: false },
      {
        id: 'webgpu_lightprobe_cubecamera',
        title: '光照探针立方体相机',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_lights_clustered',
        title: '灯光clustered',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_lights_custom', title: '灯光自定义', category: 'webgpu', completed: false },
      { id: 'webgpu_lights_dynamic', title: '灯光dynamic', category: 'webgpu', completed: false },
      {
        id: 'webgpu_lights_ies_spotlight',
        title: '灯光iesspotlight',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_lights_phong', title: '灯光冯氏材质', category: 'webgpu', completed: false },
      { id: 'webgpu_lights_physical', title: '灯光物理材质', category: 'webgpu', completed: false },
      {
        id: 'webgpu_lights_pointlights',
        title: '灯光pointlights',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_lights_projector',
        title: '灯光projector',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_lights_rectarealight',
        title: '灯光rectarealight',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_lights_selective',
        title: '灯光selective',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_lights_spotlight',
        title: '灯光spotlight',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_lights_tiled', title: '灯光tiled', category: 'webgpu', completed: false },
      { id: 'webgpu_lines_fat', title: '线脂肪', category: 'webgpu', completed: false },
      {
        id: 'webgpu_lines_fat_raycasting',
        title: '线脂肪射线检测',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_lines_fat_wireframe',
        title: '线脂肪线框',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_loader_gltf', title: '加载器gltf', category: 'webgpu', completed: false },
      {
        id: 'webgpu_loader_gltf_anisotropy',
        title: '加载器gltf各向异性',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_loader_gltf_compressed',
        title: '加载器gltf压缩',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_loader_gltf_dispersion',
        title: '加载器gltf色散',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_loader_gltf_iridescence',
        title: '加载器gltf彩虹效果',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_loader_gltf_sheen',
        title: '加载器gltf光泽',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_loader_gltf_transmission',
        title: '加载器gltf透射',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_loader_materialx',
        title: '加载器materialx',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_loader_texture_ktx2',
        title: '加载器纹理ktx2',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_materials', title: '材质', category: 'webgpu', completed: false },
      {
        id: 'webgpu_materials_alphahash',
        title: '材质alpha哈希',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_materials_arrays', title: '材质arrays', category: 'webgpu', completed: false },
      { id: 'webgpu_materials_basic', title: '材质基础材质', category: 'webgpu', completed: false },
      {
        id: 'webgpu_materials_cubemap_mipmaps',
        title: '材质cubemapmipmaps',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_materials_displacementmap',
        title: '材质displacementmap',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_materials_envmaps',
        title: '材质envmaps',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_materials_envmaps_bpcem',
        title: '材质envmapsbpcem',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_materials_lightmap',
        title: '材质光照贴图',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_materials_matcap',
        title: '材质材质捕获',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_materials_sss', title: '材质sss', category: 'webgpu', completed: false },
      {
        id: 'webgpu_materials_texture_html',
        title: '材质纹理html',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_materials_texture_manualmipmap',
        title: '材质纹理manualmipmap',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_materials_toon', title: '材质toon', category: 'webgpu', completed: false },
      {
        id: 'webgpu_materials_transmission',
        title: '材质透射',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_materials_video', title: '材质视频', category: 'webgpu', completed: false },
      {
        id: 'webgpu_materialx_noise',
        title: 'Materialx噪点',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_mesh_batch', title: '网格批', category: 'webgpu', completed: false },
      { id: 'webgpu_mirror', title: '镜像', category: 'webgpu', completed: false },
      { id: 'webgpu_modifier_curve', title: '修改器曲线', category: 'webgpu', completed: false },
      { id: 'webgpu_morphtargets', title: '变形目标', category: 'webgpu', completed: false },
      {
        id: 'webgpu_morphtargets_face',
        title: '变形目标face',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_mrt', title: 'Mrt', category: 'webgpu', completed: false },
      { id: 'webgpu_mrt_mask', title: 'Mrt遮罩', category: 'webgpu', completed: false },
      { id: 'webgpu_multiple_canvas', title: '多重画布', category: 'webgpu', completed: false },
      {
        id: 'webgpu_multiple_elements',
        title: '多重elements',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_multiple_rendertargets',
        title: '多重rendertargets',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_multiple_rendertargets_readback',
        title: '多重rendertargetsreadback',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_multisampled_renderbuffers',
        title: 'Multisampledrenderbuffers',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_occlusion', title: 'Occlusion', category: 'webgpu', completed: false },
      { id: 'webgpu_ocean', title: '海洋', category: 'webgpu', completed: false },
      { id: 'webgpu_parallax_uv', title: '视差uv', category: 'webgpu', completed: false },
      { id: 'webgpu_particles', title: '粒子', category: 'webgpu', completed: false },
      { id: 'webgpu_performance', title: '性能', category: 'webgpu', completed: false },
      {
        id: 'webgpu_performance_renderbundle',
        title: '性能renderbundle',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_pmrem_cubemap', title: 'Pmremcubemap', category: 'webgpu', completed: false },
      {
        id: 'webgpu_pmrem_equirectangular',
        title: 'Pmremequirectangular',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_pmrem_scene', title: 'Pmrem场景', category: 'webgpu', completed: false },
      { id: 'webgpu_pmrem_test', title: 'Pmrem测试', category: 'webgpu', completed: false },
      { id: 'webgpu_portal', title: '传送门', category: 'webgpu', completed: false },
      { id: 'webgpu_postprocessing', title: '后处理', category: 'webgpu', completed: false },
      {
        id: 'webgpu_postprocessing_3dlut',
        title: '后处理3dLut',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_afterimage',
        title: '后处理残像',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_anamorphic',
        title: '后处理变形',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_postprocessing_ao', title: '后处理ao', category: 'webgpu', completed: false },
      {
        id: 'webgpu_postprocessing_bloom',
        title: '后处理 bloom',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_bloom_emissive',
        title: '后处理Bloom自发光',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_bloom_selective',
        title: '后处理Bloomselective',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_postprocessing_ca', title: '后处理ca', category: 'webgpu', completed: false },
      {
        id: 'webgpu_postprocessing_difference',
        title: '后处理差集',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_dof',
        title: '后处理景深',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_dof_basic',
        title: '后处理景深基础材质',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_fxaa',
        title: '后处理快速抗锯齿',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_godrays',
        title: '后处理上帝光线',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_lensflare',
        title: '后处理镜头光晕',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_masking',
        title: '后处理masking',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_motion_blur',
        title: '后处理运动模糊',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_outline',
        title: '后处理轮廓',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_pixel',
        title: '后处理像素',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_radial_blur',
        title: '后处理径向模糊',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_retro',
        title: '后处理复古',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_smaa',
        title: '后处理亚像素抗锯齿',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_sobel',
        title: '后处理边缘检测',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_ssaa',
        title: '后处理超级采样',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_ssgi',
        title: '后处理屏幕空间全局光照',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_ssgi_ballpool',
        title: '后处理屏幕空间全局光照ballpool',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_ssr',
        title: '后处理屏幕空间反射',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_postprocessing_sss', title: '后处理sss', category: 'webgpu', completed: false },
      {
        id: 'webgpu_postprocessing_traa',
        title: '后处理时序抗锯齿',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_postprocessing_transition',
        title: '后处理过渡',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_procedural_texture',
        title: 'Procedural纹理',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_reflection', title: '反射', category: 'webgpu', completed: false },
      {
        id: 'webgpu_reflection_blurred',
        title: '反射blurred',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_reflection_roughness',
        title: '反射粗糙度',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_refraction', title: '折射', category: 'webgpu', completed: false },
      {
        id: 'webgpu_rendertarget_2d-array_3d',
        title: 'Rendertarget2darray3d',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_reversed_depth_buffer',
        title: 'Reversed深度缓冲',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_rtt', title: 'Rtt', category: 'webgpu', completed: false },
      { id: 'webgpu_sandbox', title: '沙盒', category: 'webgpu', completed: false },
      { id: 'webgpu_shadertoy', title: 'Shadertoy', category: 'webgpu', completed: false },
      { id: 'webgpu_shadowmap', title: 'Shadowmap', category: 'webgpu', completed: false },
      {
        id: 'webgpu_shadowmap_array',
        title: 'Shadowmaparray',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_shadowmap_csm', title: 'Shadowmapcsm', category: 'webgpu', completed: false },
      {
        id: 'webgpu_shadowmap_opacity',
        title: 'Shadowmap透明度',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_shadowmap_pointlight',
        title: 'Shadowmappointlight',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_shadowmap_progressive',
        title: 'Shadowmap渐进',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_shadowmap_vsm', title: 'Shadowmapvsm', category: 'webgpu', completed: false },
      { id: 'webgpu_shadow_contact', title: '阴影contact', category: 'webgpu', completed: false },
      { id: 'webgpu_skinning', title: '蒙皮', category: 'webgpu', completed: false },
      {
        id: 'webgpu_skinning_instancing',
        title: '蒙皮实例化',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_skinning_points', title: '蒙皮点', category: 'webgpu', completed: false },
      { id: 'webgpu_sky', title: '天空', category: 'webgpu', completed: false },
      { id: 'webgpu_sprites', title: 'Sprites', category: 'webgpu', completed: false },
      { id: 'webgpu_storage_buffer', title: 'Storage缓冲', category: 'webgpu', completed: false },
      {
        id: 'webgpu_struct_drawindirect',
        title: 'Structdrawindirect',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_test_memory', title: '测试内存', category: 'webgpu', completed: false },
      { id: 'webgpu_texturegrad', title: 'Texturegrad', category: 'webgpu', completed: false },
      {
        id: 'webgpu_textures_2d-array',
        title: '纹理2darray',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_textures_2d-array_compressed',
        title: '纹理2darray压缩',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_textures_anisotropy',
        title: '纹理各向异性',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_textures_partialupdate',
        title: '纹理partialupdate',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_tonemapping', title: 'Tonemapping', category: 'webgpu', completed: false },
      {
        id: 'webgpu_tsl_angular_slicing',
        title: 'Tslangularslicing',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_tsl_compute_attractors_particles',
        title: 'Tsl计算attractors粒子',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_tsl_earth', title: 'Tsl地球', category: 'webgpu', completed: false },
      { id: 'webgpu_tsl_editor', title: 'Tsl编辑器', category: 'webgpu', completed: false },
      { id: 'webgpu_tsl_galaxy', title: 'Tsl星系', category: 'webgpu', completed: false },
      { id: 'webgpu_tsl_graph', title: 'Tsl图', category: 'webgpu', completed: false },
      { id: 'webgpu_tsl_halftone', title: 'Tsl半色调', category: 'webgpu', completed: false },
      {
        id: 'webgpu_tsl_interoperability',
        title: 'Tslinteroperability',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_tsl_procedural_terrain',
        title: 'Tslprocedural地形',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_tsl_raging_sea', title: 'Tslragingsea', category: 'webgpu', completed: false },
      { id: 'webgpu_tsl_transpiler', title: 'Tsltranspiler', category: 'webgpu', completed: false },
      { id: 'webgpu_tsl_vfx_flames', title: 'Tslvfxflames', category: 'webgpu', completed: false },
      {
        id: 'webgpu_tsl_vfx_linkedparticles',
        title: 'Tslvfxlinkedparticles',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_tsl_vfx_tornado',
        title: 'Tslvfxtornado',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_tsl_wood', title: 'Tsl木材', category: 'webgpu', completed: false },
      { id: 'webgpu_upscaling_fsr1', title: 'Upscalingfsr1', category: 'webgpu', completed: false },
      { id: 'webgpu_upscaling_taau', title: 'Upscalingtaau', category: 'webgpu', completed: false },
      { id: 'webgpu_video_frame', title: '视频帧', category: 'webgpu', completed: false },
      { id: 'webgpu_video_panorama', title: '视频panorama', category: 'webgpu', completed: false },
      { id: 'webgpu_volume_caustics', title: '体积焦散', category: 'webgpu', completed: false },
      { id: 'webgpu_volume_cloud', title: '体积云', category: 'webgpu', completed: false },
      { id: 'webgpu_volume_lighting', title: '体积lighting', category: 'webgpu', completed: false },
      {
        id: 'webgpu_volume_lighting_rectarea',
        title: '体积lighting矩形区域光',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_volume_lighting_traa',
        title: '体积lighting时序抗锯齿',
        category: 'webgpu',
        completed: false
      },
      { id: 'webgpu_volume_perlin', title: '体积perlin', category: 'webgpu', completed: false },
      { id: 'webgpu_water', title: '水', category: 'webgpu', completed: false },
      { id: 'webgpu_xr_cubes', title: 'Xrcubes', category: 'webgpu', completed: false },
      {
        id: 'webgpu_xr_native_layers',
        title: 'Xrnativelayers',
        category: 'webgpu',
        completed: false
      },
      {
        id: 'webgpu_xr_rollercoaster',
        title: 'Xrrollercoaster',
        category: 'webgpu',
        completed: false
      }
    ]
  },
  {
    id: 'webxr',
    name: 'WebXR',
    icon: '🥽',
    examples: [
      { id: 'webxr_ar_camera_access', title: 'Ar相机access', category: 'webxr', completed: false },
      { id: 'webxr_ar_cones', title: 'Arcones', category: 'webxr', completed: false },
      { id: 'webxr_ar_hittest', title: 'Arhittest', category: 'webxr', completed: false },
      { id: 'webxr_ar_lighting', title: 'Arlighting', category: 'webxr', completed: false },
      {
        id: 'webxr_ar_plane_detection',
        title: 'Ar平面detection',
        category: 'webxr',
        completed: false
      },
      { id: 'webxr_vr_handinput', title: 'Vrhandinput', category: 'webxr', completed: false },
      {
        id: 'webxr_vr_handinput_cubes',
        title: 'Vrhandinputcubes',
        category: 'webxr',
        completed: false
      },
      {
        id: 'webxr_vr_handinput_pointerclick',
        title: 'Vrhandinputpointerclick',
        category: 'webxr',
        completed: false
      },
      {
        id: 'webxr_vr_handinput_pointerdrag',
        title: 'Vrhandinputpointerdrag',
        category: 'webxr',
        completed: false
      },
      {
        id: 'webxr_vr_handinput_pressbutton',
        title: 'Vrhandinputpressbutton',
        category: 'webxr',
        completed: false
      },
      {
        id: 'webxr_vr_handinput_profiles',
        title: 'Vrhandinputprofiles',
        category: 'webxr',
        completed: false
      },
      { id: 'webxr_vr_layers', title: 'Vrlayers', category: 'webxr', completed: false },
      { id: 'webxr_vr_panorama', title: 'Vrpanorama', category: 'webxr', completed: false },
      {
        id: 'webxr_vr_panorama_depth',
        title: 'Vrpanorama深度',
        category: 'webxr',
        completed: false
      },
      {
        id: 'webxr_vr_rollercoaster',
        title: 'Vrrollercoaster',
        category: 'webxr',
        completed: false
      },
      { id: 'webxr_vr_sandbox', title: 'Vr沙盒', category: 'webxr', completed: false },
      { id: 'webxr_vr_teleport', title: 'Vrteleport', category: 'webxr', completed: false },
      { id: 'webxr_vr_video', title: 'Vr视频', category: 'webxr', completed: false },
      { id: 'webxr_xr_ballshooter', title: 'Xrballshooter', category: 'webxr', completed: false },
      {
        id: 'webxr_xr_controls_transform',
        title: 'Xr控制器变换',
        category: 'webxr',
        completed: false
      },
      { id: 'webxr_xr_cubes', title: 'Xrcubes', category: 'webxr', completed: false },
      { id: 'webxr_xr_dragging', title: 'Xrdragging', category: 'webxr', completed: false },
      {
        id: 'webxr_xr_dragging_custom_depth',
        title: 'Xrdragging自定义深度',
        category: 'webxr',
        completed: false
      },
      { id: 'webxr_xr_haptics', title: 'Xrhaptics', category: 'webxr', completed: false },
      {
        id: 'webxr_xr_marchingcubes',
        title: 'XrmarchingCubes',
        category: 'webxr',
        completed: false
      },
      { id: 'webxr_xr_paint', title: 'Xrpaint', category: 'webxr', completed: false }
    ]
  }
]

export function getAllExamples(): ExampleInfo[] {
  return exampleCategories.flatMap(cat => cat.examples)
}

export function getCompletedCount(): number {
  return getAllExamples().filter(e => e.completed).length
}

export function getTotalCount(): number {
  return getAllExamples().length
}

export function getScreenshotUrl(exampleId: string): string {
  return `/lib/screenshots/${exampleId}.jpg`
}
