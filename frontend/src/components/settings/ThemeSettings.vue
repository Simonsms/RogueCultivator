<script setup lang="ts">
import { useThemeStore, themeColors, type ThemeColor } from "@/stores/theme";

const themeStore = useThemeStore();

const colorList = Object.entries(themeColors) as [ThemeColor, typeof themeColors[ThemeColor]][];
</script>

<template>
  <div class="theme-settings">
    <!-- 深色/浅色模式 -->
    <div class="setting-section">
      <div class="section-title">外观模式</div>
      <div class="mode-switcher">
        <div
          class="mode-option"
          :class="{ active: !themeStore.isDark }"
          @click="themeStore.isDark = false"
        >
          <el-icon size="24"><Sunny /></el-icon>
          <span>浅色</span>
        </div>
        <div
          class="mode-option"
          :class="{ active: themeStore.isDark }"
          @click="themeStore.isDark = true"
        >
          <el-icon size="24"><Moon /></el-icon>
          <span>深色</span>
        </div>
      </div>
    </div>

    <!-- 主题色选择 -->
    <div class="setting-section">
      <div class="section-title">主题色</div>
      <div class="color-picker">
        <div
          v-for="[key, config] in colorList"
          :key="key"
          class="color-option"
          :class="{ active: themeStore.colorTheme === key }"
          :style="{ '--color': config.primary }"
          @click="themeStore.setColorTheme(key)"
        >
          <div class="color-dot"></div>
          <span class="color-name">{{ config.name }}</span>
          <el-icon v-if="themeStore.colorTheme === key" class="check-icon">
            <Check />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-settings {
  padding: 16px;
}

.setting-section {
  margin-bottom: 24px;
}

.setting-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

/* 模式切换器 */
.mode-switcher {
  display: flex;
  gap: 12px;
}

.mode-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.mode-option:hover {
  border-color: var(--primary-color);
  background-color: var(--hover-bg);
}

.mode-option.active {
  border-color: var(--primary-color);
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

.mode-option span {
  font-size: 13px;
  font-weight: 500;
}

/* 主题色选择器 */
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-option:hover {
  background-color: var(--hover-bg);
}

.color-option.active {
  border-color: var(--color);
  background-color: var(--hover-bg);
}

.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.color-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-color);
}

.check-icon {
  color: var(--color);
  font-size: 18px;
}
</style>
