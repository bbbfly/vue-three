import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/demo/canvas'
  },
  {
    path: '/validate',
    name: 'Validate',
    component: () => import('../views/ValidationView.vue')
  },
  {
    path: '/demo/canvas',
    name: 'CanvasDemo',
    component: () => import('../views/CanvasDemoView.vue')
  },
  {
    path: '/demo/geometry',
    name: 'GeometryDemo',
    component: () => import('../views/GeometryDemoView.vue')
  },
  {
    path: '/demo/materials',
    name: 'MaterialsDemo',
    component: () => import('../views/MaterialsDemoView.vue')
  },
  {
    path: '/demo/lights',
    name: 'LightsDemo',
    component: () => import('../views/LightsDemoView.vue')
  },
  {
    path: '/demo/camera',
    name: 'CameraDemo',
    component: () => import('../views/CameraDemoView.vue')
  },
  {
    path: '/demo/gltf',
    name: 'GLTFDemo',
    component: () => import('../views/GLTFLoadDemoView.vue')
  },
  {
    path: '/demo/postprocessing',
    name: 'PostProcessingDemo',
    component: () => import('../views/PostProcessingDemoView.vue')
  },
  {
    path: '/demo/animation',
    name: 'AnimationDemo',
    component: () => import('../views/AnimationDemoView.vue')
  },
  {
    path: '/demo/curves',
    name: 'CurvesDemo',
    component: () => import('../views/CurvesDemoView.vue')
  },
  {
    path: '/demo/advanced-geometry',
    name: 'AdvancedGeoDemo',
    component: () => import('../views/AdvancedGeoDemoView.vue')
  },
  {
    path: '/demo/curve-editor',
    name: 'CurveEditorDemo',
    component: () => import('../views/CurveEditorDemoView.vue')
  },
  {
    path: '/demo/interaction',
    name: 'InteractionDemo',
    component: () => import('../views/InteractionDemoView.vue')
  },
  {
    path: '/demo/texture',
    name: 'TextureDemo',
    component: () => import('../views/TextureDemoView.vue')
  },
  {
    path: '/demo/css2d',
    name: 'CSS2DDemo',
    component: () => import('../views/CSS2DDemoView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
