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
  /* 亮色主题 */
  --bg-color: #ffffff;
  --sidebar-bg: #f5f5f5;
  --toolbar-bg: #ffffff;
  --card-bg: #ffffff;
  --input-bg: #f5f5f5;
  --text-color: #303133;
  --text-secondary: #909399;
  --border-color: #dcdfe6;
  --hover-bg: rgba(0, 0, 0, 0.04);
  --active-bg: rgba(64, 158, 255, 0.1);
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
}

.dark {
  /* 暗色主题 */
  --bg-color: #1a1a1a;
  --sidebar-bg: #141414;
  --toolbar-bg: #1a1a1a;
  --card-bg: #242424;
  --input-bg: #2a2a2a;
  --text-color: #e5e5e5;
  --text-secondary: #909399;
  --border-color: #333333;
  --hover-bg: rgba(255, 255, 255, 0.05);
  --active-bg: rgba(64, 158, 255, 0.15);
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
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
  transition: background-color 0.2s, color 0.2s;
}

#app {
  height: 100%;
}

/* Element Plus 暗色主题覆盖 */
.dark {
  --el-bg-color: var(--bg-color);
  --el-bg-color-overlay: var(--card-bg);
  --el-text-color-primary: var(--text-color);
  --el-text-color-regular: var(--text-color);
  --el-text-color-secondary: var(--text-secondary);
  --el-border-color: var(--border-color);
  --el-border-color-light: var(--border-color);
  --el-fill-color-blank: var(--input-bg);
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
</style>
