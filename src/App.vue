<script setup>
import { ref } from 'vue'
import { resourceTypes as resourceConfig } from './config/resourceConfig'
import Sidebar from './components/Sidebar.vue'
import Canvas from './components/Canvas.vue'
import ImageUploader from './components/ImageUploader.vue'

const resourceTypes = ref(resourceConfig)
const selectedResource = ref(resourceTypes.value[0])

const handleResourceSelect = (resource) => {
  selectedResource.value = resource
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
</script>

<template>
  <div class="app-container">
    <!-- 左侧资源位选择栏 -->
    <div class="left-sidebar">
      <div class="sidebar-header">
        <h2>资源位</h2>
      </div>
      <Sidebar 
        :resourceTypes="resourceTypes" 
        @select-resource="handleResourceSelect" 
      />
    </div>

    <!-- 中间预览区域 -->
    <div class="main-content">
      <Canvas 
        :selected-resource="selectedResource"
        @click-upload="triggerUpload"
      />
    </div>

    <!-- 右侧编辑栏 -->
    <div class="right-sidebar">
      <ImageUploader 
        :resourceType="selectedResource"
        @image-uploaded="handleImageUpload" 
      />
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
  background-color: #ffffff;
}

.left-sidebar {
  width: 240px;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.sidebar-header h2 {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.main-content {
  flex: 1;
  position: relative;
  background-color: #f5f5f5;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.right-sidebar {
  width: 300px;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e6e6e6;
  overflow-y: auto;
  flex-shrink: 0;
}
</style>
