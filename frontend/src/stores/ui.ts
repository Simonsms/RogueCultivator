import { defineStore } from "pinia";
import { ref } from "vue";

export type EditorMode = "edit" | "preview" | "split";
export type MainView = "notes" | "links";

export const useUIStore = defineStore("ui", () => {
  // 编辑器模式
  const editorMode = ref<EditorMode>("edit");

  // 主视图状态（笔记列表 or 链接列表）
  const mainView = ref<MainView>("notes");

  // 搜索弹窗状态
  const searchVisible = ref(false);

  // 侧边栏状态
  const sidebarCollapsed = ref(false);

  // 链接收藏弹窗
  const linkCollectorVisible = ref(false);

  // 设置编辑器模式
  function setEditorMode(mode: EditorMode) {
    editorMode.value = mode;
  }

  // 切换编辑器模式
  function toggleEditorMode() {
    const modes: EditorMode[] = ["edit", "preview", "split"];
    const currentIndex = modes.indexOf(editorMode.value);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    editorMode.value = nextMode ?? "edit";
  }

  // 打开搜索
  function openSearch() {
    searchVisible.value = true;
  }

  // 关闭搜索
  function closeSearch() {
    searchVisible.value = false;
  }

  // 切换搜索
  function toggleSearch() {
    searchVisible.value = !searchVisible.value;
  }

  // 切换侧边栏
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  // 打开链接收藏
  function openLinkCollector() {
    linkCollectorVisible.value = true;
  }

  // 关闭链接收藏
  function closeLinkCollector() {
    linkCollectorVisible.value = false;
  }

  // 设置主视图
  function setMainView(view: MainView) {
    mainView.value = view;
  }

  // 显示链接列表
  function showLinks() {
    mainView.value = "links";
  }

  // 显示笔记列表
  function showNotes() {
    mainView.value = "notes";
  }

  return {
    // 状态
    editorMode,
    mainView,
    searchVisible,
    sidebarCollapsed,
    linkCollectorVisible,
    // 方法
    setEditorMode,
    toggleEditorMode,
    openSearch,
    closeSearch,
    toggleSearch,
    toggleSidebar,
    openLinkCollector,
    closeLinkCollector,
    setMainView,
    showLinks,
    showNotes,
  };
});
