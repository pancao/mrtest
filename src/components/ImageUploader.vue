<template>
  <div class="uploader-container">
    <!-- 头部区域 -->
    <div class="section-header">
      <div class="section-content header-content">
        <h4>{{ resourceType.name }} 配置</h4>
        <button 
          class="export-button"
          @click="exportConfig"
          v-if="hasConfigurableItems"
        >
          导出配置
        </button>
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
      class="section"
    >
      <div class="section-content">
        <!-- 渐变颜色配置 -->
        <template v-if="resourceType.previewConfig.middleLayer?.gradients">
          <div class="section-title">{{ getConfigLabel('section', 'gradients') }}</div>
          
          <!-- 遮罩渐变配置（仅限3号资源位） -->
          <template v-if="resourceType.id === 3">
            <div class="editor-item">
              <label>{{ getConfigLabel('gradient', 'mask').color }}</label>
              <div class="color-preview">
                <input 
                  :value="resourceType.previewConfig.middleLayer.gradients.mask.color"
                  type="color"
                  class="color-input"
                  @input="handleMaskColorChange"
                >
              </div>
            </div>
            
            <div class="editor-item">
              <label>
                <span>{{ getConfigLabel('gradient', 'mask').opacity }}</span>
              </label>
              <input 
                :value="resourceType.previewConfig.middleLayer.style.opacity"
                type="range"
                min="0"
                max="1"
                step="0.01"
                @input="handleMaskOpacityChange"
              >
            </div>
          </template>
          
          <!-- 其他资源位的渐变配置 -->
          <template v-if="resourceType.id === 5 || resourceType.id === 6">
            <div class="editor-item">
              <label>{{ getConfigLabel('gradient', 'top').color }}</label>
              <div class="color-preview">
                <input 
                  :value="resourceType.previewConfig.middleLayer.gradients.top.color"
                  type="color"
                  class="color-input"
                  @input="handleGradientColorChange"
                >
              </div>
            </div>
          </template>
        </template>

        <!-- 自定义元素配置 -->
        <template 
          v-if="resourceType.previewConfig.customElements && 
                 Object.keys(resourceType.previewConfig.customElements).length > 0"
        >
          <div class="section-title">{{ getConfigLabel('section', 'elements') }}</div>
        
          <div 
            v-for="(element, key) in resourceType.previewConfig.customElements" 
            :key="key"
            class="element-editor"
          >
            <div class="element-header" v-if="element.editable !== false">
              <span class="element-title">{{ getConfigLabel('element', key) }}</span>
              <label class="toggle-switch" v-if="element.editable !== 'text-only'">
                <input
                  type="checkbox"
                  v-model="element.visible"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <template v-if="element.visible && element.editable !== false">
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
                  :placeholder="`输入${getConfigLabel('element', key)}文本`"
                  :class="{ 'input-exceeded': isTextExceeded(element) }"
                >
              </div>

              <!-- 背景色和透明度配置 -->
              <div class="editor-item" v-if="element.style.backgroundColor && element.editable !== 'text-only'">
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
                    :value="backgroundOpacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    @input="(e) => backgroundOpacity = parseFloat(e.target.value)"
                  >
                </div>
              </div>

              <!-- 文字颜色配置 -->
              <div class="editor-item" v-if="element.editable !== 'text-only'">
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
              <div class="editor-item" v-if="key === 'button' && element.editable !== 'text-only'">
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
        </template>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  resourceType: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['image-uploaded'])
const fileInput = ref(null)

const backgroundOpacity = computed({
  get: () => {
    const element = Object.values(props.resourceType.previewConfig.customElements)
      .find(el => el.style.backgroundColor)
    
    if (element?.style.backgroundColor) {
      const match = element.style.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
      const opacity = match ? parseFloat(match[4] || '1') : 0.9
      
      // 更新滑块进度
      nextTick(() => {
        const range = document.querySelector('.color-picker input[type="range"]')
        if (range) {
          range.value = opacity
          updateRangeProgress({ target: range })
        }
      })
      
      return opacity
    }
    return 0.9
  },
  set: (value) => {
    const element = Object.values(props.resourceType.previewConfig.customElements)
      .find(el => el.style.backgroundColor)
    
    if (element?.style.backgroundColor) {
      const hex = rgbaToHex(element.style.backgroundColor)
      element.style.backgroundColor = hexToRgba(hex, value)
    }
  }
})

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
    event.target.value = ''
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

// 监听资源类型变化，重新初始化滑块状态
watch(
  () => props.resourceType,
  (newResource) => {
    // 等待 DOM 更新后初始化滑块
    nextTick(() => {
      // 更新背景色透明度滑块
      const opacityRange = document.querySelector('.color-picker input[type="range"]')
      if (opacityRange) {
        updateRangeProgress({ target: opacityRange })
      }

      // 更新圆角滑块
      const radiusRange = document.querySelector('.editor-item input[type="range"]')
      if (radiusRange) {
        updateRangeProgress({ target: radiusRange })
      }
    })
  },
  { immediate: true }
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
  // 添加文件大小检查
  const maxSize = parseInt(props.resourceType.specs.maxSize)
  if (file.size > maxSize * 1024 * 1024) {
    throw `文件大小不能超过 ${props.resourceType.specs.maxSize}`
  }

  // 检查文件类型
  const acceptedFormats = props.resourceType.specs.format.map(format => format.toLowerCase())
  const fileType = file.type.split('/')[1]?.toLowerCase()
  
  if (!acceptedFormats.some(format => 
    fileType?.includes(format.toLowerCase()) || 
    file.name.toLowerCase().endsWith(`.${format.toLowerCase()}`)
  )) {
    throw `只支持 ${props.resourceType.specs.format.join('/')} 格式`
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

    // 添加超时处理
    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url)
      reject('图片加载超时，请重试')
    }, 10000)

    img.src = url
    
    // 清理超时
    img.onload = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(url)
      const [expectedWidth, expectedHeight] = props.resourceType.size.split('x').map(Number)
      
      if (img.width !== expectedWidth || img.height !== expectedHeight) {
        reject(`图片尺寸必须为 ${expectedWidth}x${expectedHeight}`)
        return
      }
      resolve(true)
    }
  })
}

const processFile = async (file) => {
  try {
    await checkFile(file)
    const reader = new FileReader()
    // 添加错误处理
    reader.onerror = () => {
      showToast('文件读取失败，请重试')
    }
    reader.onload = (e) => {
      currentFileType.value = file.type
      emit('image-uploaded', e.target.result)
    }
    reader.readAsDataURL(file)
  } catch (error) {
    showToast(error)
    // 清理文件输入框的值，确保可以重新选择同一个文件
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// 获取元素标题
const getConfigLabel = (type, key) => {
  const labels = props.resourceType.previewConfig.configLabels
  if (!labels) return key

  switch (type) {
    case 'element':
      return labels.elements?.[key] || key
    case 'gradient':
      return labels.gradients?.[key] || key
    case 'section':
      return labels[key]?.title || key
    default:
      return key
  }
}

const updateRangeProgress = (event) => {
  const range = event.target
  if (!range) return

  const value = parseFloat(range.value)
  const min = parseFloat(range.min)
  const max = parseFloat(range.max)
  const progress = ((value - min) / (max - min)) * 100
  range.style.setProperty('--range-progress', `${progress}%`)
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
    // 更新滑块进度
    const range = document.querySelector('.color-picker input[type="range"]')
    if (range) {
      updateRangeProgress({ target: range })
    }
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

// 添加单位转换函数
const convertToPx = (value, baseSize) => {
  if (typeof value !== 'string') return value
  
  // 处理 em
  if (value.endsWith('em')) {
    const emValue = parseFloat(value)
    return `${Math.round(emValue * baseSize)}px`
  }
  
  // 处理百分比
  if (value.endsWith('%')) {
    const percent = parseFloat(value)
    return `${Math.round(baseSize * percent / 100)}px`
  }
  
  return value
}

// 添加默认值配置
const defaultValues = {
  button: {
    text: '立即体验',
    style: {
      color: '#ffffff',
      backgroundColor: 'rgba(37, 180, 225, 0.6)',
      borderRadius: '8px',
      fontSize: '2.43em',
      padding: '0.9em 1.2em'
    }
  },
  title: {
    text: '广告标题',
    style: {
      color: '#333333',
      fontSize: '1.2em'
    }
  },
  description: {
    text: '广告描述文案',
    style: {
      color: '#666666',
      fontSize: '1em'
    }
  }
}

const exportConfig = () => {
  let configText = `${props.resourceType.name} 配置：\n\n`

  // 如果有渐变配置，先导出渐变配置
  if (props.resourceType.previewConfig.middleLayer?.gradients) {
    if (props.resourceType.id === 3) {
      // 滑动开屏的遮罩渐变
      configText += `${getConfigLabel('section', 'gradients')}：\n`
      configText += `- ${getConfigLabel('gradient', 'mask').color}：${props.resourceType.previewConfig.middleLayer.gradients.mask.color}\n`
      configText += `- ${getConfigLabel('gradient', 'mask').opacity}：${Math.round(props.resourceType.previewConfig.middleLayer.style.opacity * 100)}%\n\n`
    } else if (props.resourceType.id === 5 || props.resourceType.id === 6) {
      // 播客画布的渐变
      configText += `${getConfigLabel('section', 'gradients')}：\n`
      configText += `- ${getConfigLabel('gradient', 'top').color}：${props.resourceType.previewConfig.middleLayer.gradients.top.color}\n\n`
    }
  }

  // 只有当存在 customElements 时才处理
  if (props.resourceType.previewConfig.customElements) {
    configText += `元素设置：\n`
    Object.entries(props.resourceType.previewConfig.customElements).forEach(([key, element]) => {
      // 确保元素存在且有 text 属性
      if (element && element.text !== undefined) {
        const elementTitle = getConfigLabel('element', key)
        configText += `${elementTitle}：\n`
        configText += `- 文本内容：${element.text}\n`

        // 如果是按钮，还需要导出颜色配置
        if (key === 'button' && element.editable !== 'text-only') {
          configText += `- 背景颜色：${element.style.backgroundColor}\n`
          configText += `- 文字颜色：${element.style.color}\n`
          configText += `- 圆角大小：${element.style.borderRadius}\n`
        }
        configText += '\n'
      }
    })
  }

  // 复制到剪贴板
  navigator.clipboard.writeText(configText).then(() => {
    showToast('配置已复制到剪贴板', 'success')
  }).catch(() => {
    showToast('复制失败，请手动复制', 'error')
  })
}

// 监听资源类型变化，重新初始化滑块状态
watch(
  () => props.resourceType,
  (newResource) => {
    // 从当前按钮样式中提取圆角值
    const button = newResource.previewConfig.customElements?.button
    if (button?.style.borderRadius) {
      const radius = parseInt(button.style.borderRadius) || 8
      buttonRadius.value = radius
      
      // 更新滑块进度
      nextTick(() => {
        const range = document.querySelector('.editor-item input[type="range"]')
        if (range) {
          range.value = radius
          updateRangeProgress({ target: range })
        }
      })
    }
  },
  { immediate: true }
)

const handleGradientColorChange = (event) => {
  props.resourceType.previewConfig.middleLayer.gradients.top.color = event.target.value
}

const handleMaskColorChange = (event) => {
  props.resourceType.previewConfig.middleLayer.gradients.mask.color = event.target.value
}

const handleMaskOpacityChange = (event) => {
  props.resourceType.previewConfig.middleLayer.style.opacity = parseFloat(event.target.value)
  updateRangeProgress(event)
}

// 判断是否有可配置项
const hasConfigurableItems = computed(() => {
  const { previewConfig } = props.resourceType
  return (
    previewConfig.customElements && Object.keys(previewConfig.customElements).length > 0 ||
    previewConfig.middleLayer?.gradients
  )
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.export-button {
  padding: 6px 12px;
  font-size: 12px;
  color: #25b4e1;
  background: rgba(37, 180, 225, 0.1);
  border: 1px solid rgba(37, 180, 225, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.export-button:hover {
  background: rgba(37, 180, 225, 0.15);
  border-color: rgba(37, 180, 225, 0.3);
}

.export-button:active {
  background: rgba(37, 180, 225, 0.2);
  border-color: rgba(37, 180, 225, 0.4);
}

.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.bottom-gradient {
  z-index: 1;
}

.top-gradient {
  z-index: 2;
}
</style> 