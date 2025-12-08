import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";

// 主题配色方案
export type ThemeColor = "blue" | "purple" | "orange" | "green" | "pink";

export interface ThemeColorConfig {
  name: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
}

export const themeColors: Record<ThemeColor, ThemeColorConfig> = {
  blue: {
    name: "经典蓝",
    primary: "#3b82f6",
    primaryLight: "#60a5fa",
    primaryDark: "#2563eb",
  },
  purple: {
    name: "优雅紫",
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
  },
  orange: {
    name: "活力橙",
    primary: "#f97316",
    primaryLight: "#fb923c",
    primaryDark: "#ea580c",
  },
  green: {
    name: "清新绿",
    primary: "#22c55e",
    primaryLight: "#4ade80",
    primaryDark: "#16a34a",
  },
  pink: {
    name: "浪漫粉",
    primary: "#ec4899",
    primaryLight: "#f472b6",
    primaryDark: "#db2777",
  },
};

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);
  const colorTheme = ref<ThemeColor>("blue");

  // 从 localStorage 恢复设置
  const savedTheme = localStorage.getItem("theme");
  const savedColor = localStorage.getItem("themeColor") as ThemeColor;

  if (savedTheme === "dark") {
    isDark.value = true;
  }
  if (savedColor && themeColors[savedColor]) {
    colorTheme.value = savedColor;
  }

  // 当前主题配色
  const currentColor = computed(() => themeColors[colorTheme.value]);

  // 应用主题色到 CSS 变量
  const applyColorTheme = (color: ThemeColor) => {
    const config = themeColors[color];
    const root = document.documentElement;

    root.style.setProperty("--primary-color", config.primary);
    root.style.setProperty("--primary-light", config.primaryLight);
    root.style.setProperty("--primary-dark", config.primaryDark);

    // Element Plus 主题色
    root.style.setProperty("--el-color-primary", config.primary);
    root.style.setProperty("--el-color-primary-light-3", config.primaryLight);
    root.style.setProperty("--el-color-primary-dark-2", config.primaryDark);

    // 计算透明度变体
    const rgb = hexToRgb(config.primary);
    if (rgb) {
      root.style.setProperty("--el-color-primary-light-5", `rgba(${rgb}, 0.5)`);
      root.style.setProperty("--el-color-primary-light-7", `rgba(${rgb}, 0.3)`);
      root.style.setProperty("--el-color-primary-light-8", `rgba(${rgb}, 0.2)`);
      root.style.setProperty("--el-color-primary-light-9", `rgba(${rgb}, 0.1)`);
      root.style.setProperty(
        "--hover-bg",
        isDark.value ? `rgba(${rgb}, 0.15)` : `rgba(${rgb}, 0.08)`
      );
      root.style.setProperty(
        "--active-bg",
        isDark.value ? `rgba(${rgb}, 0.25)` : `rgba(${rgb}, 0.15)`
      );
    }
  };

  // hex 转 rgb
  const hexToRgb = (hex: string): string | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    const r = parseInt(result[1]!, 16);
    const g = parseInt(result[2]!, 16);
    const b = parseInt(result[3]!, 16);
    return `${r}, ${g}, ${b}`;
  };

  // 监听暗色模式变化
  watch(
    isDark,
    (val) => {
      localStorage.setItem("theme", val ? "dark" : "light");
      if (val) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      // 重新应用主题色（hover-bg 等需要根据暗色模式调整）
      applyColorTheme(colorTheme.value);
    },
    { immediate: true }
  );

  // 监听主题色变化
  watch(
    colorTheme,
    (val) => {
      localStorage.setItem("themeColor", val);
      applyColorTheme(val);
    },
    { immediate: true }
  );

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const setColorTheme = (color: ThemeColor) => {
    colorTheme.value = color;
  };

  return {
    isDark,
    colorTheme,
    currentColor,
    themeColors,
    toggleTheme,
    setColorTheme,
  };
});
