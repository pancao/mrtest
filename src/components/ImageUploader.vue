<template>
  <div class="uploader-container">
    <!-- 头部区域 -->
    <div class="section-header">
      <div class="section-content">
        <h4>{{ resourceType.name }} 配置</h4>
      </div>
    </div>

    <!-- 上传区域 -->
    <div class="section">
      <div class="section-content">
        <!-- 说明区域 -->
        <div class="description-box">
          <p class="description-text">{{ resourceType.description }}</p>
        </div>

        <!-- 规范信息 -->
        <div class="specs-box">
          <div class="specs-row">
            <span class="specs-label">尺寸</span>
            <span class="specs-value">{{ resourceType.size }}</span>
          </div>
          <div class="specs-row">
            <span class="specs-label">格式</span>
            <span class="specs-value">{{ resourceType.specs.format.join('/') }}</span>
          </div>
          <div class="specs-row">
            <span class="specs-label">大小</span>
            <span class="specs-value">≤ {{ resourceType.specs.maxSize }}</span>
          </div>
          <div class="specs-requirements">
            <div class="requirements-title">设计建议</div>
            <ul class="requirements-list">
              <li v-for="(req, index) in resourceType.specs.requirements" 
                  :key="index">{{ req }}</li>
            </ul>
          </div>
        </div>

        <div class="section-title">素材选择</div>

        <div 
          class="upload-area"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <input 
            type="file" 
            ref="fileInput"
            style="display: none"
            :accept="getAcceptTypes"
            @change="handleFileChange"
          >
          <div class="upload-content">
            <template v-if="resourceType.image">
              <template v-if="!isVideo">
                <img 
                  :src="resourceType.image" 
                  class="preview-image"
                >
              </template>
              <template v-else>
                <video
                  :src="resourceType.image"
                  class="preview-video"
                  loop
                  muted
                  autoplay
                  playsinline
                ></video>
              </template>
              <span class="upload-text">点击更换{{ mediaTypeText }}</span>
            </template>
            <template v-else>
              <div class="upload-icon">+</div>
              <span class="upload-text">点击或拖拽上传{{ mediaTypeText }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义元素编辑区域 -->
    <div 
      v-if="resourceType.previewConfig.customElements"
      class="section"
    >
      <div class="section-content">
        <div class="section-title">元素设置</div>
        <div 
          v-for="(element, key) in resourceType.previewConfig.customElements" 
          :key="key"
          class="element-editor"
        >
          <div class="element-header">
            <span class="element-title">{{ getElementTitle(key) }}</span>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="element.visible"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <template v-if="element.visible">
            <!-- 文本编辑 -->
            <div class="editor-item">
              <label>
                <span>文本内容</span>
                <span 
                  class="text-count" 
                  :class="{ 'text-count-exceeded': isTextExceeded(element) }"
                >
                  {{ element.text.length }}/{{ element.maxLength }}
                </span>
              </label>
              <input 
                v-model="element.text"
                type="text"
                :placeholder="`输入${getElementTitle(key)}文本`"
                :class="{ 'input-exceeded': isTextExceeded(element) }"
              >
            </div>

            <!-- 背景色和透明度配置 -->
            <div class="editor-item" v-if="element.style.backgroundColor">
              <label>
                <span>背景颜色</span>
                <span class="value">{{ Math.round(backgroundOpacity * 100) }}%</span>
              </label>
              <div class="color-picker">
                <div class="color-preview">
                  <input 
                    :value="getColorValue(element, 'background')"
                    type="color"
                    class="color-input"
                    @input="(e) => handleColorChange(element, e, 'background')"
                  >
                </div>
                <input 
                  v-model="backgroundOpacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  @input="updateBackgroundOpacity(element)"
                >
              </div>
            </div>

            <!-- 文字颜色配置 -->
            <div class="editor-item">
              <label>文字颜色</label>
              <div class="color-preview">
                <input 
                  :value="getColorValue(element, 'text')"
                  type="color"
                  class="color-input"
                  @input="(e) => handleColorChange(element, e, 'text')"
                >
              </div>
            </div>

            <!-- 圆角大小滑块 -->
            <div class="editor-item" v-if="key === 'button'">
              <label>
                <span>圆角大小</span>
                <span class="value">{{ buttonRadius }}px</span>
              </label>
              <input 
                v-model.number="buttonRadius"
                type="range"
                min="0"
                max="20"
                step="1"
                @input="updateButtonRadius(element)"
              >
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <div 
      v-if="toast.visible" 
      class="toast"
      :class="toast.type"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  resourceType: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['image-uploaded'])
const fileInput = ref(null)

const backgroundOpacity = ref(0.9)
const buttonRadius = ref(8)

// 添加 toast 提示状态
const toast = ref({
  visible: false,
  message: '',
  type: 'error'
})

const currentFileType = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/')
  if (file && isValidType) {
    processFile(file)
  }
}

// 显示 toast 提示
const showToast = (message, type = 'error') => {
  toast.value = {
    visible: true,
    message,
    type
  }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

// 监听 resourceType 的变化
watch(
  () => props.resourceType,
  () => {
    // 重置当前文件类型
    currentFileType.value = null
  }
)

// 修改 isVideo 计算属性
const isVideo = computed(() => {
  console.log('Current file type:', currentFileType.value)
  console.log('Resource image:', props.resourceType.image)

  // 如果已经上传了文件，根据当前文件类型判断
  if (currentFileType.value) {
    const isVideoType = currentFileType.value.startsWith('video/')
    console.log('Is video by current file type:', isVideoType)
    return isVideoType
  }

  // 如果已经有上传的资源但没有 currentFileType，根据资源 URL 判断
  if (props.resourceType.image) {
    try {
      const [, mediaType] = props.resourceType.image.match(/^data:([^;]+);/)
      const isVideoType = mediaType.startsWith('video/')
      console.log('Media type from data URL:', mediaType)
      console.log('Is video by media type:', isVideoType)
      return isVideoType
    } catch (e) {
      console.error('Error parsing data URL:', e)
      return false
    }
  }

  // 否则根据资源配置判断默认类型
  const isVideoByFormat = props.resourceType.specs.format.some(format => 
    ['MP4', 'MOV'].includes(format.toUpperCase())
  )
  console.log('Is video by format:', isVideoByFormat)
  return isVideoByFormat
})

const getAcceptTypes = computed(() => {
  return props.resourceType.specs.format.map(format => {
    const type = format.toLowerCase()
    if (['mp4', 'mov'].includes(type)) {
      return `video/${type}`
    }
    return `.${type}`
  }).join(',')
})

// 检查文件
const checkFile = async (file) => {
  // 检查文件格式
  const allowedFormats = props.resourceType.specs.format.map(format => {
    const type = format.toLowerCase()
    return ['mp4', 'mov'].includes(type) ? `video/${type}` : `image/${type}`
  })
  
  if (!allowedFormats.includes(file.type)) {
    throw `只支持 ${props.resourceType.specs.format.join('/')} 格式`
  }

  // 检查文件大小
  const maxSize = parseInt(props.resourceType.specs.maxSize) * 1024 * 1024
  if (file.size > maxSize) {
    throw `文件大小不能超过 ${props.resourceType.specs.maxSize}`
  }

  if (file.type.startsWith('video/')) {
    await checkVideo(file)
  } else {
    await checkImage(file)
  }
}

const checkVideo = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      const { video: videoSpecs } = props.resourceType.specs

      // 只在设置了 duration 时才检查视频时长
      if (videoSpecs.duration !== null && video.duration !== videoSpecs.duration) {
        reject(`视频时长必须为 ${videoSpecs.duration} 秒`)
        return
      }

      // 检查视频尺寸
      const [expectedWidth, expectedHeight] = props.resourceType.size.split('x').map(Number)
      if (video.videoWidth !== expectedWidth || video.videoHeight !== expectedHeight) {
        reject(`视频尺寸必须为 ${expectedWidth}x${expectedHeight}`)
        return
      }

      resolve(true)
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject('视频加载失败，请重试')
    }

    video.src = url
  })
}

// 检查图片
const checkImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const [expectedWidth, expectedHeight] = props.resourceType.size.split('x').map(Number)
      
      // 检查图片尺寸
      if (img.width !== expectedWidth || img.height !== expectedHeight) {
        reject(`图片尺寸必须为 ${expectedWidth}x${expectedHeight}`)
        return
      }

      resolve(true)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject('图片加载失败，请重试')
    }

    img.src = url
  })
}

const processFile = async (file) => {
  try {
    await checkFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log('File type before upload:', file.type)
      currentFileType.value = file.type
      emit('image-uploaded', e.target.result)
    }
    reader.readAsDataURL(file)
  } catch (error) {
    showToast(error)
  }
}

const getElementTitle = (key) => {
  const titles = {
    button: '按钮',
    title: '标题',
    description: '描述'
  }
  return titles[key] || key
}

const updateRangeProgress = (event) => {
  const range = event.target
  const progress = (range.value - range.min) / (range.max - range.min) * 100
  range.style.setProperty('--range-progress', `${progress}%`)
}

const updateBackgroundOpacity = (element) => {
  const color = element.style.backgroundColor
  const rgba = color.match(/[\d.]+/g)
  if (rgba) {
    element.style.backgroundColor = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${backgroundOpacity.value})`
  }
  updateRangeProgress(event)
}

const updateButtonRadius = (element) => {
  element.style.borderRadius = `${buttonRadius.value}px`
  updateRangeProgress(event)
}

const isTextExceeded = (element) => {
  return element.text.length > element.maxLength
}

// 获取显示文本（带省略号）
const getDisplayText = computed(() => (element) => {
  if (element.text.length > element.maxLength) {
    return element.text.slice(0, element.maxLength) + '...'
  }
  return element.text
})

// 在组件挂载时初始化进度条
onMounted(() => {
  // 初始化背景透明度滑块
  const opacityRange = document.querySelector('input[type="range"]')
  if (opacityRange) {
    updateRangeProgress({ target: opacityRange })
  }
  
  // 初始化圆角大小滑块
  const radiusRange = document.querySelector('input[type="range"][max="20"]')
  if (radiusRange) {
    updateRangeProgress({ target: radiusRange })
  }
})

// 添加颜色转换工具函数
const rgbaToHex = (rgba) => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return '#000000'
  
  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])
  
  const toHex = (n) => {
    const hex = n.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 修改颜色处理函数
const handleColorChange = (element, event, type) => {
  const hex = event.target.value
  if (type === 'background') {
    const currentAlpha = backgroundOpacity.value
    element.style.backgroundColor = hexToRgba(hex, currentAlpha)
  } else if (type === 'text') {
    element.style.color = hex
  }
}

// 修改获取颜色值函数
const getColorValue = (element, type) => {
  if (type === 'background') {
    return rgbaToHex(element.style.backgroundColor)
  } else if (type === 'text') {
    return element.style.color || '#000000'
  }
}

// 添加计算属性来获取支持的媒体类型提示
const mediaTypeText = computed(() => {
  const formats = props.resourceType.specs.format
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
</script>

<style scoped>
.uploader-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section {
  border-bottom: 1px solid #e6e6e6;
}

.section-header {
  border-bottom: 1px solid #e6e6e6;
}

.section-content {
  padding: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
}

.description-box {
  margin-bottom: 16px;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 16px;
}

.element-editor {
  padding: 16px 0;
  border-bottom: 1px solid #e6e6e6;
}

.element-editor:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-label {
  width: 48px;
  color: #666666;
}

.info-value {
  color: #333333;
  font-family: monospace;
}

.upload-area {
  margin: 16px 0;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #25b4e1;
  background: #f0f9fc;
}

.upload-content {
  padding: 24px;
  text-align: center;
}

.upload-icon {
  font-size: 24px;
  color: #999999;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 13px;
  color: #666666;
}

.preview-image {
  width: 100%;
  max-height: 160px;
  object-fit: contain;
  margin-bottom: 8px;
  border-radius: 4px;
}

.preview-video {
  width: 100%;
  max-height: 160px;
  object-fit: contain;
  margin-bottom: 8px;
  border-radius: 4px;
}

.element-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.element-title {
  font-size: 13px;
  font-weight: 500;
  color: #333333;
}

.editor-item {
  margin-bottom: 12px;
  padding: 0 2px;
}

.editor-item label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666666;
  margin-bottom: 8px;
}

.editor-item label .value {
  color: #25b4e1;
  font-family: monospace;
}

.editor-item input[type="text"] {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  transition: all 0.2s;
}

.editor-item input[type="text"]:hover {
  border-color: #4cc3e9;
}

.editor-item input[type="text"]:focus {
  border-color: #25b4e1;
  outline: none;
  box-shadow: 0 0 0 2px rgba(37, 180, 225, 0.1);
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  flex-shrink: 0;
}

.color-preview:hover {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
}

.color-input {
  position: absolute;
  inset: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-input::-moz-color-swatch {
  border: none;
  border-radius: 4px;
}

/* 基础滑块样式 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  outline: none;
  margin: 8px 0;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(0, 0, 0, 0.1); /* 默认背景色 */
}

/* 隐藏默认滑块手柄 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
}

input[type="range"]::-moz-range-thumb {
  width: 0;
  height: 0;
  border: 0;
}

/* 进度条效果 */
.editor-item input[type="range"] {
  background: linear-gradient(
    to right,
    #25b4e1 var(--range-progress, 0%),
    rgba(0, 0, 0, 0.1) var(--range-progress, 0%)
  );
}

/* 悬停和激活状态 */
.editor-item input[type="range"]:hover {
  background: linear-gradient(
    to right,
    #4cc3e9 var(--range-progress, 0%),
    rgba(0, 0, 0, 0.15) var(--range-progress, 0%)
  );
  transform: scaleY(1.1);
}

.editor-item input[type="range"]:active {
  background: linear-gradient(
    to right,
    #1a9bc4 var(--range-progress, 0%),
    rgba(0, 0, 0, 0.1) var(--range-progress, 0%)
  );
  transform: scaleY(1.2);
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast.error {
  background-color: #ff4d4f;
}

.toast.success {
  background-color: #25b4e1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.description-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #666666;
}

.section-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.specs-box {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.specs-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
}

.specs-label {
  width: 48px;
  color: #666666;
}

.specs-value {
  color: #333333;
  font-family: monospace;
}

.specs-requirements {
  margin-top: 12px;
}

.requirements-title {
  font-size: 13px;
  color: #666666;
  margin-bottom: 8px;
}

.requirements-list {
  margin: 0;
  padding-left: 16px;
}

.requirements-list li {
  font-size: 12px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 4px;
}

.requirements-list li:last-child {
  margin-bottom: 0;
}

.text-count {
  font-size: 12px;
  color: #999999;
}

.text-count-exceeded {
  color: #ff4d4f;
}

.input-exceeded {
  border-color: #ff4d4f !important;
}

.input-exceeded:hover,
.input-exceeded:focus {
  border-color: #ff7875 !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1) !important;
}

/* iOS 风格开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e4e4e4;
  transition: .4s;
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

input:checked + .toggle-slider {
  background-color: #25b4e1;
}

input:checked + .toggle-slider:before {
  transform: translateX(16px);
}

/* 悬停效果 */
.toggle-switch:hover .toggle-slider {
  background-color: #d4d4d4;
}

.toggle-switch:hover input:checked + .toggle-slider {
  background-color: #4cc3e9;
}
</style> 