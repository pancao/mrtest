<script setup>
import { ref, watch, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resourceTypes as resourceConfig } from './config/resourceConfig'
import Sidebar from './components/Sidebar.vue'
import Canvas from './components/Canvas.vue'
import ImageUploader from './components/ImageUploader.vue'

const route = useRoute()
const router = useRouter()

const resourceTypes = ref(resourceConfig)
const selectedResource = ref(resourceTypes.value[0])
const sidebarsHidden = ref(false)

// Toast 状态
const toast = ref({
  visible: false,
  message: '',
  type: 'error'
})

// 根据路由参数更新选中的资源
watch(
  () => route.params.id,
  (newId) => {
    const id = parseInt(newId)
    const resource = resourceTypes.value.find(r => r.id === id)
    if (resource) {
      selectedResource.value = resource
    }
  },
  { immediate: true }
)

// 监听选中资源的变化来更新标题
watch(selectedResource, (newResource) => {
  if (newResource) {
    document.title = `${newResource.name}配置`
  }
})

const handleResourceSelect = (resource) => {
  router.push(`/resource/${resource.id}`)
}

const handleImageUpload = (imageData) => {
  selectedResource.value.image = imageData
}

const triggerUpload = () => {
  // 触发 ImageUploader 组件中的上传按钮点击
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.click()
  }
}

const toggleSidebars = () => {
  sidebarsHidden.value = !sidebarsHidden.value
}

// 显示 toast 的方法
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

// 将 showToast 方法提供给子组件
provide('showToast', showToast)
</script>

<template>
  <div class="app-container">
    <div 
      class="left-sidebar"
      :class="{ 'sidebar-hidden': sidebarsHidden }"
    >
      <div class="sidebar-header">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>资源位预览</h2>
          <span style="font-size: 10px; color: #999; background: #f5f5f5; border-radius: 3px; padding: 3px 6px;">BETA</span>
        </div>
      </div>
      <Sidebar 
        :resourceTypes="resourceTypes" 
        @select-resource="handleResourceSelect" 
      />
    </div>

    <div 
      class="main-content"
      @click="toggleSidebars"
    >
      <Canvas 
        :selected-resource="selectedResource"
        @click-upload="triggerUpload"
        :sidebars-hidden="sidebarsHidden"
      />
    </div>

    <div 
      class="right-sidebar"
      :class="{ 'sidebar-hidden': sidebarsHidden }"
    >
      <ImageUploader 
        :resourceType="selectedResource"
        @image-uploaded="handleImageUpload" 
      />
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

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f5f5f5;
  padding: 16px;
  gap: 16px;
  /* 添加点状纹理效果 */
  background-image: radial-gradient(
    circle at 10px 10px,
    #e0e0e0 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}

.left-sidebar {
  width: 240px;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: none;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: transform 0.6s cubic-bezier(.46, 0.25, 0.16, 0.97);
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 16px 16px 0 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.sidebar-header h2 {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}

.main-content {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 16px;
}

.right-sidebar {
  width: 300px;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  overflow-y: auto;
  flex-shrink: 0;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: none;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: transform 0.6s cubic-bezier(.46, 0.25, 0.16, 0.97);
}

.left-sidebar.sidebar-hidden {
  transform: translateX(-120%);
}

.right-sidebar.sidebar-hidden {
  transform: translateX(120%);
}

.toast {
  position: fixed;
  top: 70px;
  right: 33px;
  padding: 10px 18px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  z-index: 1000;
  animation: slideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast.error {
  color: #ff4343;
  background-color: #511010c6;
  backdrop-filter: blur(15px);
}

.toast.success {
  color: #ffffff;
  background-color: #000000bc;
  backdrop-filter: blur(15px);
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
</style>
