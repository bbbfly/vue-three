<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        代码示例
      </h3>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="codeExamples.length === 0" class="p-8 text-center text-gray-400">
        <svg
          class="w-12 h-12 mx-auto mb-3 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <p class="text-sm">当前页面暂无代码示例</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div v-for="(example, index) in codeExamples" :key="index" class="group">
          <button
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            @click="toggleExample(index)"
          >
            <span class="text-sm font-medium text-gray-700">{{ example.title }}</span>
            <svg
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': expandedIndexes.includes(index) }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <Transition name="code-expand">
            <div v-show="expandedIndexes.includes(index)" class="relative">
              <button
                class="absolute top-3 right-3 z-10 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors flex items-center gap-1"
                @click="copyCode(example.code)"
              >
                <svg
                  v-if="!copied"
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ copied ? '已复制' : '复制' }}
              </button>
              <pre
                class="p-4 bg-gray-900 text-gray-100 text-xs overflow-x-auto leading-relaxed"
              ><code>{{ example.code }}</code></pre>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

interface CodeExample {
  title: string
  code: string
}

const codeExamples = ref<CodeExample[]>([])
const expandedIndexes = ref<number[]>([0])
const copied = ref(false)

const router = useRouter()

function toggleExample(index: number) {
  const i = expandedIndexes.value.indexOf(index)
  if (i > -1) {
    expandedIndexes.value.splice(i, 1)
  } else {
    expandedIndexes.value.push(index)
  }
}

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function loadCodeExamples() {
  const route = router.currentRoute.value
  const path = route.path

  const examplesMap: Record<string, CodeExample[]> = {
    '/canvas': [
      {
        title: 'TCanvas 基础使用',
        code: `<TCanvas antialias :shadow-map="true">
  <TScene background="#1a1a2e">
    <TPerspectiveCamera :position="[8, 6, 8]" />
    <TOrbitControls />
    <TAmbientLight :intensity="0.4" />
    <TDirectionalLight :position="[5, 8, 5]" />
  </TScene>
</TCanvas>`
      },
      {
        title: '完整 Canvas 配置',
        code: `<TCanvas
  antialias
  alpha
  :shadow-map="true"
  :pixel-ratio="window.devicePixelRatio"
>
  <!-- 场景内容 -->
</TCanvas>`
      }
    ],
    '/geometry': [
      {
        title: '创建立方体',
        code: `<TMesh :position="[-3, 1, 0]">
  <TBox :args="[1.5, 1.5, 1.5]" />
  <TMeshStandardMaterial color="#e74c3c" />
</TMesh>`
      },
      {
        title: '创建球体',
        code: `<TMesh :position="[0, 1, 0]">
  <TSphere :args="[1, 32, 32]" />
  <TMeshStandardMaterial color="#3498db" />
</TMesh>`
      },
      {
        title: '创建圆柱体',
        code: `<TMesh :position="[3, 1, 0]">
  <TCylinder :args="[0.8, 0.8, 2, 32]" />
  <TMeshStandardMaterial color="#2ecc71" />
</TMesh>`
      },
      {
        title: '所有几何体一览',
        code: `<!-- 立方体 -->
<TBox :args="[width, height, depth]" />

<!-- 球体 -->
<TSphere :args="[radius, widthSeg, heightSeg]" />

<!-- 平面 -->
<TPlane :args="[width, height]" />

<!-- 圆柱体 -->
<TCylinder :args="[topRad, bottomRad, height, seg]" />`
      }
    ],
    '/materials': [
      {
        title: '基础材质 (MeshBasicMaterial)',
        code: `<TMeshStandardMaterial
  color="#3498db"
  :metalness="0.3"
  :roughness="0.7"
/>`
      },
      {
        title: '标准材质 (MeshStandardMaterial)',
        code: `<TMeshStandardMaterial
  color="#3498db"
  :metalness="0.3"
  :roughness="0.7"
/>`
      },
      {
        title: 'Lambert 材质',
        code: `<TMeshLambertMaterial color="#e74c3c" />`
      },
      {
        title: 'Phong 材质',
        code: `<TMeshPhongMaterial
  color="#f39c12"
  :shininess="100"
/>`
      }
    ],
    '/lights': [
      {
        title: '环境光 (AmbientLight)',
        code: `<TAmbientLight
  color="#ffffff"
  :intensity="0.4"
/>`
      },
      {
        title: '方向光 (DirectionalLight)',
        code: `<TDirectionalLight
  :position="[5, 8, 5]"
  :intensity="1"
  :cast-shadow="true"
/>`
      },
      {
        title: '点光源 (PointLight)',
        code: `<TPointLight
  :position="[0, 5, 0]"
  color="#f1c40f"
  :intensity="50"
  :distance="20"
  :cast-shadow="true"
/>`
      }
    ],
    '/camera': [
      {
        title: '透视相机',
        code: `<TPerspectiveCamera
  :position="[8, 6, 8]"
  :fov="60"
  :near="0.1"
  :far="1000"
/>`
      },
      {
        title: '轨道控制器',
        code: `<TOrbitControls
  :enable-damping="true"
  :enable-pan="true"
  :enable-zoom="true"
  :damping-factor="0.05"
  :min-distance="2"
  :max-distance="50"
/>`
      }
    ],
    '/gltf': [
      {
        title: 'GLTF 模型加载',
        code: `<TGLTFLoader
  url="/models/example.glb"
  :position="[0, 0, 0]"
  :scale="[1, 1, 1]"
  :cast-shadow="true"
  :receive-shadow="true"
/>`
      },
      {
        title: '监听加载事件',
        code: `<TGLTFLoader
  url="/models/example.glb"
  @load="onModelLoaded"
  @progress="onProgress"
  @error="onError"
/>

function onModelLoaded(gltf) {
  console.log('模型加载完成', gltf)
}
function onProgress(loaded, total) {
  console.log('加载进度:', loaded / total * 100, '%')
}
function onError(error) {
  console.error('加载失败:', error)
}`
      }
    ]
  }

  codeExamples.value = examplesMap[path] || []
}

const removeGuard = router.afterEach(() => {
  loadCodeExamples()
})

onMounted(() => {
  loadCodeExamples()
})

onUnmounted(() => {
  removeGuard()
})
</script>

<style>
.code-expand-enter-active,
.code-expand-leave-active {
  transition:
    max-height 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  max-height: 2000px;
  overflow: hidden;
}

.code-expand-enter-from,
.code-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
