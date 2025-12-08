<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import MainContent from '@/components/layout/MainContent.vue'

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <Sidebar 
      :collapsed="sidebarCollapsed" 
      @toggle="toggleSidebar"
    />
    
    <!-- 主内容区 -->
    <MainContent 
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
    />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--bg-color);
}
</style>
