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
/* ===== Material You (MD3) Design System ===== */
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

:root {
  /* ===== Material You Light Theme ===== */
  /* 核心色调 - 基于紫色种子 #6750A4 */
  --md-primary: #6750a4;
  --md-on-primary: #ffffff;
  --md-primary-container: #eaddff;
  --md-on-primary-container: #21005d;

  --md-secondary: #625b71;
  --md-on-secondary: #ffffff;
  --md-secondary-container: #e8def8;
  --md-on-secondary-container: #1d192b;

  --md-tertiary: #7d5260;
  --md-on-tertiary: #ffffff;
  --md-tertiary-container: #ffd8e4;
  --md-on-tertiary-container: #31111d;

  /* 表面色调系统 - Material You 核心特性 */
  --md-background: #fffbfe;
  --md-on-background: #1c1b1f;
  --md-surface: #fffbfe;
  --md-on-surface: #1c1b1f;
  --md-surface-variant: #e7e0ec;
  --md-on-surface-variant: #49454f;
  --md-surface-container: #f3edf7;
  --md-surface-container-low: #f7f2fa;
  --md-surface-container-high: #ece6f0;
  --md-surface-container-highest: #e6e0e9;

  /* 边框和分隔线 */
  --md-outline: #79747e;
  --md-outline-variant: #cac4d0;

  /* 功能色 */
  --md-error: #b3261e;
  --md-on-error: #ffffff;
  --md-error-container: #f9dedc;
  --md-success: #386a20;
  --md-warning: #7d5700;

  /* 兼容旧变量 */
  --bg-color: var(--md-background);
  --sidebar-bg: var(--md-surface-container-low);
  --toolbar-bg: var(--md-surface);
  --card-bg: var(--md-surface-container);
  --input-bg: var(--md-surface-variant);
  --text-color: var(--md-on-surface);
  --text-secondary: var(--md-on-surface-variant);
  --text-tertiary: var(--md-outline);
  --border-color: var(--md-outline-variant);

  /* 主题色映射 */
  --primary-color: var(--md-primary);
  --primary-light: #9a82db;
  --primary-dark: #4f378b;
  --hover-bg: rgba(103, 80, 164, 0.08);
  --active-bg: rgba(103, 80, 164, 0.12);

  /* 功能色 */
  --success-color: var(--md-success);
  --warning-color: var(--md-warning);
  --danger-color: var(--md-error);

  /* Element Plus 主题覆盖 */
  --el-color-primary: var(--md-primary);
  --el-color-primary-light-3: #9a82db;
  --el-color-primary-light-5: rgba(103, 80, 164, 0.5);
  --el-color-primary-light-7: rgba(103, 80, 164, 0.3);
  --el-color-primary-light-8: rgba(103, 80, 164, 0.2);
  --el-color-primary-light-9: rgba(103, 80, 164, 0.1);
  --el-color-primary-dark-2: #4f378b;
  --el-color-success: var(--md-success);
  --el-color-warning: var(--md-warning);
  --el-color-danger: var(--md-error);
  --el-bg-color: var(--md-background);
  --el-bg-color-overlay: var(--md-surface-container);
  --el-bg-color-page: var(--md-background);
  --el-text-color-primary: var(--md-on-surface);
  --el-text-color-regular: var(--md-on-surface);
  --el-text-color-secondary: var(--md-on-surface-variant);
  --el-border-color: var(--md-outline-variant);
  --el-border-color-light: var(--md-outline-variant);
  --el-fill-color: var(--md-surface-variant);
  --el-fill-color-blank: var(--md-surface);

  /* Material You 圆角系统 */
  --md-radius-xs: 8px;
  --md-radius-sm: 12px;
  --md-radius-md: 16px;
  --md-radius-lg: 24px;
  --md-radius-xl: 28px;
  --md-radius-2xl: 32px;
  --md-radius-3xl: 48px;
  --md-radius-full: 9999px;

  /* Material You 动画曲线 */
  --md-easing: cubic-bezier(0.2, 0, 0, 1);
  --md-duration-short: 200ms;
  --md-duration-medium: 300ms;
  --md-duration-long: 400ms;
}

/* ===== Material You Dark Theme ===== */
.dark {
  --md-primary: #d0bcff;
  --md-on-primary: #381e72;
  --md-primary-container: #4f378b;
  --md-on-primary-container: #eaddff;

  --md-secondary: #ccc2dc;
  --md-on-secondary: #332d41;
  --md-secondary-container: #4a4458;
  --md-on-secondary-container: #e8def8;

  --md-tertiary: #efb8c8;
  --md-on-tertiary: #492532;
  --md-tertiary-container: #633b48;
  --md-on-tertiary-container: #ffd8e4;

  /* 暗色表面色调 */
  --md-background: #1c1b1f;
  --md-on-background: #e6e1e5;
  --md-surface: #1c1b1f;
  --md-on-surface: #e6e1e5;
  --md-surface-variant: #49454f;
  --md-on-surface-variant: #cac4d0;
  --md-surface-container: #211f26;
  --md-surface-container-low: #1d1b20;
  --md-surface-container-high: #2b2930;
  --md-surface-container-highest: #36343b;

  --md-outline: #938f99;
  --md-outline-variant: #49454f;

  --md-error: #f2b8b5;
  --md-on-error: #601410;
  --md-error-container: #8c1d18;
  --md-success: #a6d388;
  --md-warning: #ffb951;

  /* 兼容旧变量 */
  --bg-color: var(--md-background);
  --sidebar-bg: var(--md-surface-container-low);
  --toolbar-bg: var(--md-surface);
  --card-bg: var(--md-surface-container);
  --input-bg: var(--md-surface-variant);
  --text-color: var(--md-on-surface);
  --text-secondary: var(--md-on-surface-variant);
  --text-tertiary: var(--md-outline);
  --border-color: var(--md-outline-variant);

  --primary-color: var(--md-primary);
  --primary-light: #e8deff;
  --primary-dark: #9a82db;
  --hover-bg: rgba(208, 188, 255, 0.08);
  --active-bg: rgba(208, 188, 255, 0.12);

  /* Element Plus 暗色主题覆盖 */
  --el-color-primary: var(--md-primary);
  --el-color-primary-light-3: #e8deff;
  --el-color-primary-dark-2: #9a82db;
  --el-bg-color: var(--md-background);
  --el-bg-color-overlay: var(--md-surface-container);
  --el-bg-color-page: var(--md-background);
  --el-text-color-primary: var(--md-on-surface);
  --el-text-color-regular: var(--md-on-surface);
  --el-text-color-secondary: var(--md-on-surface-variant);
  --el-text-color-placeholder: var(--md-outline);
  --el-border-color: var(--md-outline-variant);
  --el-border-color-light: var(--md-outline-variant);
  --el-border-color-lighter: var(--md-outline-variant);
  --el-fill-color: var(--md-surface-variant);
  --el-fill-color-light: var(--md-surface-container);
  --el-fill-color-lighter: var(--md-surface-container);
  --el-fill-color-blank: var(--md-surface-container);
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
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Helvetica Neue", Arial, sans-serif;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color var(--md-duration-medium) var(--md-easing),
    color var(--md-duration-medium) var(--md-easing);
}

#app {
  height: 100%;
}

/* ===== Material You 按钮样式 ===== */
.el-button {
  transition: all var(--md-duration-medium) var(--md-easing);
  border-radius: var(--md-radius-full) !important;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.el-button:hover {
  transform: translateY(-1px);
}

.el-button:active {
  transform: translateY(0) scale(0.98);
}

/* 主要按钮 - 填充样式 */
.el-button--primary {
  background-color: var(--md-primary) !important;
  border-color: var(--md-primary) !important;
  color: var(--md-on-primary) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.el-button--primary:hover {
  background-color: var(--primary-light) !important;
  border-color: var(--primary-light) !important;
  box-shadow: 0 4px 12px rgba(103, 80, 164, 0.3);
}

.el-button--primary:active {
  background-color: var(--primary-dark) !important;
}

/* 默认按钮 - 轮廓样式 */
.el-button--default {
  background-color: transparent !important;
  border: 1px solid var(--md-outline) !important;
  color: var(--md-primary) !important;
}

.el-button--default:hover {
  background-color: var(--hover-bg) !important;
  border-color: var(--md-primary) !important;
}

/* 文字/链接按钮 */
.el-button.is-text,
.el-button--text,
.el-button.is-link,
.el-button--link {
  background-color: transparent !important;
  border: none !important;
  color: var(--md-primary) !important;
}

.el-button.is-text:hover,
.el-button--text:hover,
.el-button.is-link:hover,
.el-button--link:hover {
  background-color: var(--hover-bg) !important;
}

/* 圆形图标按钮 */
.el-button.is-circle {
  border-radius: 50% !important;
}

.el-button.is-circle:hover {
  background-color: var(--hover-bg) !important;
  color: var(--md-primary) !important;
}

/* 功能色按钮 */
.el-button--success:hover {
  box-shadow: 0 4px 12px rgba(56, 106, 32, 0.35);
}

.el-button--warning:hover {
  box-shadow: 0 4px 12px rgba(125, 87, 0, 0.35);
}

.el-button--danger:hover {
  box-shadow: 0 4px 12px rgba(179, 38, 30, 0.35);
}

/* ===== Material You 输入框样式 ===== */
.el-input__wrapper {
  border-radius: var(--md-radius-xs) var(--md-radius-xs) 0 0 !important;
  background-color: var(--md-surface-variant) !important;
  box-shadow: none !important;
  border-bottom: 2px solid var(--md-outline) !important;
  transition: all var(--md-duration-short) var(--md-easing);
}

.el-input__wrapper:hover {
  background-color: var(--md-surface-container-highest) !important;
}

.el-input__wrapper:focus-within,
.el-input__wrapper.is-focus {
  border-bottom-color: var(--md-primary) !important;
  background-color: var(--md-surface-container-highest) !important;
}

.el-textarea__inner {
  border-radius: var(--md-radius-sm) !important;
  background-color: var(--md-surface-variant) !important;
  border: 1px solid var(--md-outline-variant) !important;
  transition: all var(--md-duration-short) var(--md-easing);
}

.el-textarea__inner:focus {
  border-color: var(--md-primary) !important;
  box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.1) !important;
}

/* ===== Material You 卡片样式 ===== */
.el-card {
  border-radius: var(--md-radius-lg) !important;
  border: none !important;
  background-color: var(--md-surface-container) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
  transition: all var(--md-duration-medium) var(--md-easing);
}

.el-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

/* ===== Material You 对话框样式 ===== */
.el-dialog {
  border-radius: var(--md-radius-xl) !important;
  overflow: hidden;
  background-color: var(--md-surface-container-high) !important;
}

.el-dialog__header {
  padding: 24px 24px 16px !important;
}

.el-dialog__body {
  padding: 0 24px 24px !important;
}

.dark .el-dialog {
  background-color: var(--md-surface-container-high) !important;
}

/* ===== Material You 下拉菜单样式 ===== */
.el-dropdown-menu {
  border-radius: var(--md-radius-sm) !important;
  padding: 8px !important;
  background-color: var(--md-surface-container) !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
}

.el-dropdown-menu__item {
  border-radius: var(--md-radius-xs) !important;
  transition: all var(--md-duration-short) var(--md-easing);
}

.el-dropdown-menu__item:hover {
  background-color: var(--hover-bg) !important;
  color: var(--md-primary) !important;
}

/* ===== Material You 标签样式 ===== */
.el-tag {
  border-radius: var(--md-radius-full) !important;
  padding: 4px 12px !important;
  border: none !important;
  font-weight: 500;
}

/* ===== Material You 选项卡样式 ===== */
.el-tabs__item {
  transition: all var(--md-duration-short) var(--md-easing);
}

.el-tabs__item:hover {
  color: var(--md-primary) !important;
}

.el-tabs__item.is-active {
  color: var(--md-primary) !important;
}

/* ===== 滚动条样式 ===== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--md-outline-variant);
  border-radius: var(--md-radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--md-outline);
}

/* ===== 选中文本颜色 ===== */
::selection {
  background-color: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

/* ===== 链接样式 ===== */
a {
  color: var(--md-primary);
  text-decoration: none;
  transition: color var(--md-duration-short) var(--md-easing);
}

a:hover {
  color: var(--primary-light);
}

/* ===== Message Box 样式 ===== */
.el-message-box {
  border-radius: var(--md-radius-xl) !important;
  background-color: var(--md-surface-container-high) !important;
}

.el-message-box__btns .el-button {
  border-radius: var(--md-radius-full) !important;
}

/* ===== Tooltip 样式 ===== */
.el-tooltip__popper {
  border-radius: var(--md-radius-xs) !important;
}
</style>
