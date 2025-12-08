import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);

  // 从 localStorage 恢复主题设置
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDark.value = true;
  }

  // 监听主题变化并保存
  watch(
    isDark,
    (val) => {
      localStorage.setItem("theme", val ? "dark" : "light");

      // 切换 HTML class
      if (val) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    { immediate: true }
  );

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return {
    isDark,
    toggleTheme,
  };
});
