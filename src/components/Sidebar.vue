<template>
  <div class="sidebar-content">
    <div 
      v-for="resource in resourceTypes" 
      :key="resource.id"
      class="resource-item"
      :class="{ active: isSelected(resource) }"
      @click="handleSelect(resource)"
    >
      <div class="resource-icon">
        <div class="placeholder-icon">
          {{ resource.name[0] }}
        </div>
      </div>
      <div class="resource-info">
        <span class="resource-name">{{ resource.name }}</span>
        <span class="resource-size">{{ resource.size }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  resourceTypes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select-resource'])

const route = useRoute()

// 计算当前选中的资源位 ID
const currentResourceId = computed(() => {
  return parseInt(route.params.id)
})

// 判断资源位是否被选中
const isSelected = (resource) => {
  return resource.id === currentResourceId.value
}

const handleSelect = (resource) => {
  emit('select-resource', resource)
}
</script>

<style scoped>
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.resource-item {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333333;
}

.resource-item:hover {
  background: #f5f5f5;
}

.resource-item.active {
  background: #e6f7fa;
}

.resource-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-right: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.placeholder-icon {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

.resource-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.resource-name {
  font-size: 13px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-size {
  font-size: 11px;
  color: #999999;
}
</style> 