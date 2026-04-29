import type { App, Plugin } from 'vue'

export * from './types'
export * from './core/context'
export * from './core/factory'
export * from './core/cleanup'
export * from './core/config'

export * from './composables/useCanvas'
export * from './composables/useScene'
export * from './composables/useRenderer'
export * from './composables/useCamera'
export * from './composables/useControls'
export * from './composables/useLight'
export * from './composables/useMesh'
export * from './composables/useGeometry'
export * from './composables/useMaterial'
export * from './composables/useGLTFLoader'
export * from './composables/useOBJLoader'
export * from './composables/useFBXLoader'
export * from './composables/useDRACOLoader'
export * from './composables/useFlyControls'
export * from './composables/useFirstPersonControls'
export * from './composables/useAnimationMixer'
export * from './composables/useKeyframeAnimation'
export * from './composables/useRenderPipeline'
export * from './composables/useBloomPass'
export * from './composables/useSSAAPass'
export * from './composables/useOutlinePass'
export * from './composables/useTexture'
export * from './composables/useCurve'
export * from './composables/useLine'
export * from './composables/useInteraction'
export * from './composables/useCSS2DRenderer'
export { useGui, type UseGuiOptions } from './composables/useGui'

import TCanvas from './components/TCanvas.vue'
import TScene from './components/TScene.vue'
import TPerspectiveCamera from './components/TPerspectiveCamera.vue'
import TOrbitControls from './components/TOrbitControls.vue'
import TAmbientLight from './components/TAmbientLight.vue'
import TDirectionalLight from './components/TDirectionalLight.vue'
import TPointLight from './components/TPointLight.vue'
import TMesh from './components/TMesh.vue'
import TBox from './components/TBox.vue'
import TSphere from './components/TSphere.vue'
import TPlane from './components/TPlane.vue'
import TCylinder from './components/TCylinder.vue'
import TTorus from './components/TTorus.vue'
import TMeshBasicMaterial from './components/TMeshBasicMaterial.vue'
import TMeshStandardMaterial from './components/TMeshStandardMaterial.vue'
import TMeshPhysicalMaterial from './components/TMeshPhysicalMaterial.vue'
import TMeshLambertMaterial from './components/TMeshLambertMaterial.vue'
import TMeshPhongMaterial from './components/TMeshPhongMaterial.vue'
import TGLTFLoader from './components/TGLTFLoader.vue'
import TAnimationMixer from './components/TAnimationMixer.vue'
import TKeyframeAnimation from './components/TKeyframeAnimation.vue'
import TEffectComposer from './components/TEffectComposer.vue'
import TBloomPass from './components/TBloomPass.vue'
import TSSAAPass from './components/TSSAAPass.vue'
import TOutlinePass from './components/TOutlinePass.vue'
import TOrthographicCamera from './components/TOrthographicCamera.vue'
import TSpotLight from './components/TSpotLight.vue'
import THemisphereLight from './components/THemisphereLight.vue'
import TRectAreaLight from './components/TRectAreaLight.vue'
import TCone from './components/TCone.vue'
import TTexture from './components/TTexture.vue'
import TOBJLoader from './components/TOBJLoader.vue'
import TFBXLoader from './components/TFBXLoader.vue'
import TDRACOLoader from './components/TDRACOLoader.vue'
import TFlyControls from './components/TFlyControls.vue'
import TFirstPersonControls from './components/TFirstPersonControls.vue'
import TArcCurve from './components/TArcCurve.vue'
import TEllipseCurve from './components/TEllipseCurve.vue'
import TBezierCurve from './components/TBezierCurve.vue'
import TQuadraticBezierCurve from './components/TQuadraticBezierCurve.vue'
import TCatmullRomCurve from './components/TCatmullRomCurve.vue'
import TSplineCurve from './components/TSplineCurve.vue'
import TLine from './components/TLine.vue'
import TLineLoop from './components/TLineLoop.vue'
import TLineDashed from './components/TLineDashed.vue'
import TTubeGeometry from './components/TTubeGeometry.vue'
import TLatheGeometry from './components/TLatheGeometry.vue'
import TShapeGeometry from './components/TShapeGeometry.vue'
import TExtrudeGeometry from './components/TExtrudeGeometry.vue'
import TSweepGeometry from './components/TSweepGeometry.vue'
import TEdgesGeometry from './components/TEdgesGeometry.vue'
import TWireframeGeometry from './components/TWireframeGeometry.vue'
import TCSS2DRenderer from './components/TCSS2DRenderer.vue'
import TCSS2DLabel from './components/TCSS2DLabel.vue'
import TCSS2DObject from './components/TCSS2DObject.vue'

export {
  TCSS2DRenderer,
  TCSS2DLabel,
  TCSS2DObject,
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrthographicCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TPointLight,
  TSpotLight,
  THemisphereLight,
  TRectAreaLight,
  TMesh,
  TBox,
  TSphere,
  TPlane,
  TCylinder,
  TCone,
  TTorus,
  TMeshBasicMaterial,
  TMeshStandardMaterial,
  TMeshPhysicalMaterial,
  TMeshLambertMaterial,
  TMeshPhongMaterial,
  TTexture,
  TGLTFLoader,
  TOBJLoader,
  TFBXLoader,
  TDRACOLoader,
  TFlyControls,
  TFirstPersonControls,
  TAnimationMixer,
  TKeyframeAnimation,
  TEffectComposer,
  TBloomPass,
  TSSAAPass,
  TOutlinePass,
  TArcCurve,
  TEllipseCurve,
  TBezierCurve,
  TQuadraticBezierCurve,
  TCatmullRomCurve,
  TSplineCurve,
  TLine,
  TLineLoop,
  TLineDashed,
  TTubeGeometry,
  TLatheGeometry,
  TShapeGeometry,
  TExtrudeGeometry,
  TSweepGeometry,
  TEdgesGeometry,
  TWireframeGeometry
}

const components = [
  TCanvas,
  TScene,
  TPerspectiveCamera,
  TOrthographicCamera,
  TOrbitControls,
  TAmbientLight,
  TDirectionalLight,
  TPointLight,
  TSpotLight,
  THemisphereLight,
  TRectAreaLight,
  TMesh,
  TBox,
  TSphere,
  TPlane,
  TCylinder,
  TCone,
  TTorus,
  TMeshBasicMaterial,
  TMeshStandardMaterial,
  TMeshPhysicalMaterial,
  TMeshLambertMaterial,
  TMeshPhongMaterial,
  TTexture,
  TGLTFLoader,
  TOBJLoader,
  TFBXLoader,
  TDRACOLoader,
  TFlyControls,
  TFirstPersonControls,
  TAnimationMixer,
  TKeyframeAnimation,
  TEffectComposer,
  TBloomPass,
  TSSAAPass,
  TOutlinePass,
  TArcCurve,
  TEllipseCurve,
  TBezierCurve,
  TQuadraticBezierCurve,
  TCatmullRomCurve,
  TSplineCurve,
  TLine,
  TLineLoop,
  TLineDashed,
  TTubeGeometry,
  TLatheGeometry,
  TShapeGeometry,
  TExtrudeGeometry,
  TSweepGeometry,
  TEdgesGeometry,
  TWireframeGeometry
]

export const VueThree: Plugin = {
  install(app: App) {
    components.forEach(component => {
      if (component.name) {
        app.component(component.name, component)
      }
    })
  }
}

export function createVueThree() {
  return {
    install(app: App) {
      app.use(VueThree)
    },
    VueThree
  }
}

export default VueThree
