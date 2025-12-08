<script setup lang="ts">
import { onMounted } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useThemeStore } from "@/stores/theme";

const locale = zhCn;
const themeStore = useThemeStore();

// 初始化主题
onMounted(() => {
  // 默认使用暗色主题
  if (!localStorage.getItem("theme")) {
    themeStore.isDark = true;
  }
});
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<style>
:root {
  /* 亮色主题基础色 */
  --bg-color: #ffffff;
  --sidebar-bg: #f8f9fa;
  --toolbar-bg: #ffffff;
  --card-bg: #ffffff;
  --input-bg: #f5f5f5;
  --text-color: #1f2937;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --border-color: #e5e7eb;

  /* 主题色 - 默认蓝色，由 JS 动态覆盖 */
  --primary-color: #3b82f6;
  --primary-light: #60a5fa;
  --primary-dark: #2563eb;
  --hover-bg: rgba(59, 130, 246, 0.08);
  --active-bg: rgba(59, 130, 246, 0.15);

  /* 功能色 */
  --success-color: #22c55e;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;

  /* Element Plus 亮色主题覆盖 */
  --el-color-primary: var(--primary-color);
  --el-color-primary-light-3: var(--primary-light);
  --el-color-primary-light-5: rgba(59, 130, 246, 0.5);
  --el-color-primary-light-7: rgba(59, 130, 246, 0.3);
  --el-color-primary-light-8: rgba(59, 130, 246, 0.2);
  --el-color-primary-light-9: rgba(59, 130, 246, 0.1);
  --el-color-primary-dark-2: var(--primary-dark);
  --el-color-success: var(--success-color);
  --el-color-warning: var(--warning-color);
  --el-color-danger: var(--danger-color);
  --el-bg-color: var(--bg-color);
  --el-bg-color-overlay: var(--card-bg);
  --el-bg-color-page: var(--bg-color);
  --el-text-color-primary: var(--text-color);
  --el-text-color-regular: var(--text-color);
  --el-text-color-secondary: var(--text-secondary);
  --el-border-color: var(--border-color);
  --el-border-color-light: var(--border-color);
  --el-fill-color: var(--input-bg);
  --el-fill-color-blank: #ffffff;
}

.dark {
  /* 暗色主题基础色 */
  --bg-color: #18181b;
  --sidebar-bg: #111113;
  --toolbar-bg: #18181b;
  --card-bg: #27272a;
  --input-bg: #3f3f46;
  --text-color: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
  --border-color: #3f3f46;

  /* Element Plus 暗色主题覆盖 */
  --el-bg-color: var(--bg-color);
  --el-bg-color-overlay: var(--card-bg);
  --el-bg-color-page: var(--bg-color);
  --el-text-color-primary: var(--text-color);
  --el-text-color-regular: var(--text-color);
  --el-text-color-secondary: var(--text-secondary);
  --el-text-color-placeholder: var(--text-tertiary);
  --el-border-color: var(--border-color);
  --el-border-color-light: var(--border-color);
  --el-border-color-lighter: var(--border-color);
  --el-fill-color: var(--input-bg);
  --el-fill-color-light: var(--card-bg);
  --el-fill-color-lighter: var(--card-bg);
  --el-fill-color-blank: var(--input-bg);
  --el-mask-color: rgba(0, 0, 0, 0.7);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  height: 100%;
}

/* 全局按钮样式优化 */
.el-button {
  transition: all 0.25s ease;
  border-radius: 6px;
}

.el-button:hover {
  transform: translateY(-1px);
}

.el-button:active {
  transform: translateY(0);
}

/* 主要按钮基础样式 - 确保背景色和文字正确 */
.el-button--primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: #ffffff !important;
}

/* 主要按钮悬浮 */
.el-button--primary:hover {
  background-color: var(--primary-light) !important;
  border-color: var(--primary-light) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px var(--hover-bg);
}

/* 默认按钮基础样式 */
.el-button--default {
  background-color: var(--card-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}

/* 默认按钮悬浮 */
.el-button--default:hover {
  background-color: var(--hover-bg) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
}

/* 文字按钮悬浮 */
.el-button.is-text:hover,
.el-button--text:hover {
  background-color: var(--hover-bg) !important;
  color: var(--primary-color) !important;
}

/* 链接按钮悬浮 */
.el-button.is-link:hover,
.el-button--link:hover {
  color: var(--primary-light) !important;
}

/* 圆形图标按钮悬浮 */
.el-button.is-circle:hover {
  background-color: var(--hover-bg) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
}

/* 成功按钮悬浮 */
.el-button--success:hover {
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);
}

/* 警告按钮悬浮 */
.el-button--warning:hover {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

/* 危险按钮悬浮 */
.el-button--danger:hover {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}

/* 输入框聚焦效果 */
.el-input__wrapper:focus-within,
.el-textarea__inner:focus {
  box-shadow: 0 0 0 1px var(--primary-color) !important;
}

/* 卡片悬浮效果 */
.el-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* 对话框样式优化 */
.el-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.dark .el-dialog {
  background-color: var(--card-bg);
}

/* 下拉菜单样式 */
.el-dropdown-menu {
  border-radius: 8px;
  overflow: hidden;
}

.el-dropdown-menu__item:hover {
  background-color: var(--hover-bg) !important;
  color: var(--primary-color) !important;
}

/* 标签样式 */
.el-tag {
  border-radius: 4px;
}

/* 选项卡样式 */
.el-tabs__item:hover {
  color: var(--primary-color) !important;
}

.el-tabs__item.is-active {
  color: var(--primary-color) !important;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* 选中文本颜色 */
::selection {
  background-color: var(--hover-bg);
  color: var(--text-color);
}

/* 链接样式 */
a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary-light);
}
</style>
