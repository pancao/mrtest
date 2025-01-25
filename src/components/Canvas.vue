<template>
  <div 
    class="canvas-container"
    :key="selectedResource.id"
  >
    <div class="preview-wrapper">
      <!-- 外层容器用于控制缩放 -->
      <div 
        class="preview-scaling-container"
        :style="{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }"
      >
        <!-- 内层容器固定尺寸，包含所有内容 -->
        <div class="preview-content">
          <!-- 添加内容容器 -->
          <div 
            class="resource-content"
            :style="getContentStyle"
          >
            <!-- 添加上传按钮 -->
            <div 
              v-if="!selectedResource.image"
              class="upload-placeholder"
              @click="$emit('click-upload')"
            >
              <div class="upload-icon">+</div>
              <div class="upload-text">点击上传{{ mediaTypeText }}</div>
            </div>

            <!-- 底层：用户上传的图片或视频 -->
            <div 
              v-else 
              class="image-container"
            >
              <template v-if="!isVideo">
                <img 
                  :src="selectedResource.image" 
                  class="uploaded-image"
                  :style="selectedResource.previewConfig.imageStyle"
                >
              </template>
              <template v-else>
                <video
                  :src="selectedResource.image"
                  class="uploaded-video"
                  :style="selectedResource.previewConfig.imageStyle"
                  loop
                  muted
                  autoplay
                  playsinline
                ></video>
              </template>
            </div>
            
            <!-- 中间层：渐变遮罩等效果 -->
            <div 
              v-if="selectedResource.previewConfig.middleLayer?.visible"
              class="middle-layer"
              :style="{
                ...selectedResource.previewConfig.middleLayer.style,
                zIndex: selectedResource.previewConfig.middleLayer.zIndex
              }"
            >
              <!-- 遮罩渐变 -->
              <div 
                v-if="selectedResource.previewConfig.middleLayer.gradients?.mask?.visible"
                class="gradient-layer mask-gradient"
                :style="getMaskGradientStyle(selectedResource.previewConfig.middleLayer.gradients.mask)"
              ></div>
              
              <!-- 底层渐变 -->
              <div 
                v-if="selectedResource.previewConfig.middleLayer.gradients?.bottom?.visible"
                class="gradient-layer bottom-gradient"
                :style="selectedResource.previewConfig.middleLayer.gradients.bottom.style"
              ></div>
              
              <!-- 上层渐变 -->
              <div 
                v-if="selectedResource.previewConfig.middleLayer.gradients?.top?.visible"
                class="gradient-layer top-gradient"
                :style="getTopGradientStyle(selectedResource.previewConfig.middleLayer.gradients.top)"
              ></div>
            </div>
            
            <!-- 中层：系统UI mockup -->
            <img 
              v-if="selectedResource.previewConfig.uiLayer.visible"
              :src="selectedResource.mockupLayer" 
              class="ui-mockup"
              :style="selectedResource.previewConfig.uiLayer.style"
            >

            <!-- 自定义元素容器 -->
            <div class="custom-elements-container">
              <template v-if="selectedResource.previewConfig.customElements">
                <!-- 发现页导航标签的特殊布局 -->
                <template v-if="selectedResource.id === 7">
                  <div class="bars-layout">
                    <div class="images-row">
                      <!-- 第一张静态图片 -->
                      <img 
                        :src="selectedResource.previewConfig.customElements.staticImage1.image"
                        :style="selectedResource.previewConfig.customElements.staticImage1.style"
                        class="static-image"
                      />

                      <!-- 可上传封面图区域 -->
                      <div class="upload-images">
                        <!-- coverImage1 作为背景 -->
                        <div class="upload-images-background">
                          <img 
                            v-if="selectedResource.previewConfig.customElements.coverImage1.showImage && 
                                 selectedResource.previewConfig.customElements.coverImage1.image"
                            :src="selectedResource.previewConfig.customElements.coverImage1.image"
                            class="background-image"
                          />
                          <div 
                            v-else
                            class="gradient-background"
                            :style="{
                              background: selectedResource.previewConfig.customElements.coverImage1.style.background
                            }"
                          ></div>
                        </div>

                        <!-- 只展示 coverImage2 和 coverImage3 -->
                        <template v-for="i in 3" :key="`cover-${i}`">
                          <template v-if="i > 1">
                            <!-- 特殊处理第三个位置 -->
                            <template v-if="i === 3">
                              <div 
                                class="cover-container"
                                :style="selectedResource.previewConfig.customElements[`coverImage${i}`].style"
                              >
                                <img 
                                  v-if="selectedResource.previewConfig.customElements[`coverImage${i}`].showImage && 
                                       selectedResource.previewConfig.customElements[`coverImage${i}`].image"
                                  :src="selectedResource.previewConfig.customElements[`coverImage${i}`].image"
                                  :style="{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }"
                                />
                                <div 
                                  v-else
                                  class="cover-text"
                                  :style="{
                                    ...selectedResource.previewConfig.customElements[`coverImage${i}`].style.textStyle,
                                    color: selectedResource.previewConfig.customElements.coverImage1.themeColor
                                  }"
                                >
                                  {{ selectedResource.previewConfig.customElements[`coverImage${i}`].text }}
                                </div>
                              </div>
                            </template>
                            <!-- 其他位置保持不变 -->
                            <template v-else>
                              <img 
                                v-if="selectedResource.previewConfig.customElements[`coverImage${i}`].image"
                                :src="selectedResource.previewConfig.customElements[`coverImage${i}`].image"
                                :style="selectedResource.previewConfig.customElements[`coverImage${i}`].style"
                              />
                              <div 
                                v-else
                                class="empty-cover"
                                :style="selectedResource.previewConfig.customElements[`coverImage${i}`].style"
                              ></div>
                            </template>
                          </template>
                        </template>
                      </div>

                      <!-- 剩余的静态图片 -->
                      <img 
                        v-for="i in [2,3,4]"
                        :key="`static-${i}`"
                        :src="selectedResource.previewConfig.customElements[`staticImage${i}`].image"
                        :style="selectedResource.previewConfig.customElements[`staticImage${i}`].style"
                        class="static-image"
                      />
                    </div>
                  </div>
                </template>
                <!-- 其他资源位保持原有布局 -->
                <template v-else>
                  <div 
                    v-for="(element, key) in selectedResource.previewConfig.customElements" 
                    :key="key"
                    v-show="element.visible"
                    class="custom-element"
                    :style="element.style"
                  >
                    <!-- 图片元素 -->
                    <template v-if="element.image !== undefined">
                      <img 
                        v-if="element.image"
                        :src="element.image"
                        :style="{
                          width: '100%',
                          height: '100%',
                          objectFit: element.style.objectFit || 'contain'
                        }"
                      />
                    </template>
                    <!-- 文本元素 -->
                    <template v-else>
                      {{ element.text }}
                    </template>
                  </div>
                </template>
              </template>
            </div>
          </div>
          
          <!-- 手机框根据配置显示 -->
          <img 
            v-if="selectedResource.previewConfig.bazelVisible !== false"
            src="../assets/bazel.png" 
            class="phone-bezel"
          >
        </div>
      </div>
    </div>

    <!-- 修改提示文字的位置 -->
    <div 
      class="preview-disclaimer"
      :class="{ 'disclaimer-hidden': sidebarsHidden }"
    >
      <span>在 iPhone 16 Pro 上的效果，不同机型和系统可能导致效果和位置有所变化，仅供参考</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, computed } from 'vue'

const props = defineProps({
  selectedResource: {
    type: Object,
    required: true
  },
  sidebarsHidden: {
    type: Boolean,
    default: false
  }
})

const scale = ref(1)

const BASE_WIDTH = 1152
const BASE_HEIGHT = 2048

const isVideo = computed(() => {
  // 如果有上传的资源，根据资源的 data URL 判断
  if (props.selectedResource.image) {
    // data URL 格式为: data:video/mp4;base64,... 或 data:image/jpeg;base64,...
    try {
      const mediaType = props.selectedResource.image.split(';')[0].split(':')[1]
      console.log('Canvas mediaType:', mediaType)
      return mediaType.startsWith('video/')
    } catch (e) {
      console.error('Error parsing media type:', e)
      return false
    }
  }
  return false
})

// 添加 mediaTypeText 计算属性
const mediaTypeText = computed(() => {
  const formats = props.selectedResource.specs.format
  const hasImage = formats.some(format => ['JPG', 'PNG'].includes(format.toUpperCase()))
  const hasVideo = formats.some(format => ['MP4', 'MOV'].includes(format.toUpperCase()))
  
  if (hasImage && hasVideo) {
    return '图片或视频'
  } else if (hasVideo) {
    return '视频'
  } else {
    return '图片'
  }
})

// 将相对单位转换为固定像素值
const getAbsoluteStyle = (style) => {
  const [width] = props.selectedResource.size.split('x').map(Number)
  const baseSize = width / 100 // 1em 的基准尺寸
  
  const newStyle = { ...style }
  
  // 转换 em 单位为 px
  if (newStyle.fontSize?.includes('em')) {
    const emValue = parseFloat(newStyle.fontSize)
    newStyle.fontSize = `${emValue * baseSize}px`
  }
  
  // 转换 padding
  if (newStyle.padding?.includes('em')) {
    const [vPad, hPad] = newStyle.padding.split(' ').map(v => parseFloat(v))
    newStyle.padding = `${vPad * baseSize}px ${hPad * baseSize}px`
  }
  
  // 转换百分比为像素
  if (newStyle.bottom?.includes('%')) {
    const percent = parseFloat(newStyle.bottom)
    newStyle.bottom = `${props.selectedResource.size.split('x')[1] * percent / 100}px`
  }
  
  if (newStyle.top?.includes('%')) {
    const percent = parseFloat(newStyle.top)
    newStyle.top = `${props.selectedResource.size.split('x')[1] * percent / 100}px`
  }
  
  if (newStyle.left?.includes('%')) {
    const percent = parseFloat(newStyle.left)
    newStyle.left = `${width * percent / 100}px`
  }
  
  if (newStyle.right?.includes('%')) {
    const percent = parseFloat(newStyle.right)
    newStyle.right = `${width * percent / 100}px`
  }

  return newStyle
}

const updateScale = () => {
  const container = document.querySelector('.preview-wrapper')
  if (!container) return

  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  // 始终使用基准尺寸计算缩放
  const scaleX = containerWidth / BASE_WIDTH
  const scaleY = containerHeight / BASE_HEIGHT
  
  scale.value = Math.min(scaleX, scaleY) * 0.8
}

// 计算资源内容的位置和尺寸
const getContentStyle = computed(() => {
  const [width, height] = props.selectedResource.size.split('x').map(Number)
  
  // 计算在基准容器中的居中位置
  const left = (BASE_WIDTH - width) / 2
  const top = (BASE_HEIGHT - height) / 2
  
  return {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`
  }
})

const getDisplayText = (element) => {
  if (element.text.length > element.maxLength) {
    return element.text.slice(0, element.maxLength) + '...'
  }
  return element.text
}

// 生成上层渐变样式
const getTopGradientStyle = (gradient) => {
  const color = gradient.color.replace('#', '')
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  return {
    ...gradient.style,
    background: `linear-gradient(
      to bottom,
      rgba(${r}, ${g}, ${b}, 0) 0%,
      rgba(${r}, ${g}, ${b}, 0.11) 11.46%,
      rgba(${r}, ${g}, ${b}, 0.31) 24.48%,
      rgba(${r}, ${g}, ${b}, 0.48) 36.46%,
      rgba(${r}, ${g}, ${b}, 0.63) 48.35%,
      rgba(${r}, ${g}, ${b}, 0.74) 58.55%,
      rgba(${r}, ${g}, ${b}, 0.85) 71.53%,
      rgba(${r}, ${g}, ${b}, 0.95) 100%
    )`
  }
}

// 生成遮罩渐变样式
const getMaskGradientStyle = (gradient) => {
  const color = gradient.color.replace('#', '')
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  return {
    ...gradient.style,
    background: `linear-gradient(0deg, rgb(${r}, ${g}, ${b}) 0%, rgba(${r}, ${g}, ${b}, 0) 100%)`
  }
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})

onUpdated(() => {
  updateScale()
})
</script>

<style scoped>
.main-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 1;
}

@keyframes containerFadeIn {
  from {
    opacity: 0;
    transform: translateY(90px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.canvas-container > * {

}

.preview-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}


.preview-scaling-container {
  position: relative;
  transform-origin: center center;
  flex-shrink: 0;
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  will-change: transform;
}

.preview-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 所有内容使用绝对定位和固定尺寸 */
.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.uploaded-image {
  position: absolute;
  top: 0;
  left: 0;
}

.uploaded-video {
  position: absolute;
  top: 0;
  left: 0;
}

.ui-mockup {
  position: absolute;
  top: 2.5%;
  left: 11.1%;
  width: 78%;
  height: 95%;
  object-fit: contain;
  z-index: 2;
}

.phone-bezel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 3;
  pointer-events: none;
}

.custom-elements-container {
  position: absolute;
  top: 2.5%;
  left: 11.1%;
  width: 78%;
  height: 95%;
  z-index: 4;
  pointer-events: auto;
}

.custom-element {
  position: absolute;
  white-space: pre-wrap;
  pointer-events: auto;
}

.preview-disclaimer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.preview-disclaimer.disclaimer-hidden {
  opacity: 0;
  transform: translateY(20px);
}

.preview-disclaimer span {
  font-size: 12px;
  color: #999999;
  line-height: 1.4;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.upload-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 48px;
  background: rgba(37, 180, 225, 0);
  transition: all 0.2s;
  z-index: 10;
  min-width: 200px;
  min-height: 160px;
  justify-content: center;
  opacity: 0;
}

.upload-placeholder:hover {
  opacity: 0.5;
  opacity: 0;
}

.upload-placeholder .upload-icon {
  font-size: 5em;
  color: #25b4e1;
  margin-bottom: 16px;
  line-height: 1;
}

.upload-placeholder .upload-text {
  font-size: 3em;
  color: #25b4e1;
  white-space: nowrap;
  font-weight: 500;
}

.middle-layer {
  position: absolute;
  pointer-events: none;
}

.resource-content {
  position: absolute;
}

.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 8%;
}

.bottom-gradient {
  z-index: 1;
}

.top-gradient {
  z-index: 2;
}

/* 发现页导航标签布局 */
.bars-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  padding-top: 578px;
  padding-left: 1px;
  padding-right: 4px;
}

.images-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 20px;
  position: relative;
  pointer-events: auto;
  padding-left: 54px;
  filter: drop-shadow(0px 4px 44px rgba(0, 0, 0, 0.08));
}

.images-row::-webkit-scrollbar {
  display: none;
}


.static-image {
  width: auto;
  height: 84px;
  object-fit: cover;
  flex-shrink: 0;
}

.upload-images {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-shrink: 0;
  height: 84px;
  position: relative;
  padding: 19px 26px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.upload-images-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.empty-background {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.gradient-background {
  width: 100%;
  height: 100%;
}

.empty-cover {
  flex-shrink: 0;
  background-color: #f5f5f5;
  border-radius: 23px;
  width: 80px;
  height: 80px;
  position: relative;
  z-index: 1;
}

.cover-container {
  flex-shrink: 0;
  /* background-color: #f5f5f5;
  border-radius: 23px; */
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.cover-text {
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 32px;
  font-weight: 700;
  transform: translateY(-2px);
  user-select: none;
}
</style> 