<script setup lang="ts">
import { ref, watch } from "vue";
import { useNoteStore } from "@/stores/note";
import { useUIStore } from "@/stores/ui";
import FolderTree from "@/components/folder/FolderTree.vue";
import TagList from "@/components/tag/TagList.vue";

defineProps<{
  collapsed: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const noteStore = useNoteStore();
const uiStore = useUIStore();

// 当前激活的 tab（只用于文件夹和标签）
const activeTab = ref<"folders" | "tags">("folders");

// 监听主视图变化，如果切换到 links 视图，取消侧边栏的 active 状态
watch(
  () => uiStore.mainView,
  (view) => {
    if (view === "links") {
      // 链接视图时，侧边栏 tab 保持原状但视觉上不高亮
    }
  }
);

// 创建新笔记
const handleNewNote = () => {
  uiStore.showNotes(); // 切换回笔记视图
  noteStore.createNote();
};

// 打开搜索
const handleOpenSearch = () => {
  uiStore.openSearch();
};

// 切换到链接视图
const handleShowLinks = () => {
  uiStore.showLinks();
};

// 切换侧边栏 Tab 时回到笔记视图
const handleTabChange = (tab: "folders" | "tags") => {
  activeTab.value = tab;
  uiStore.showNotes();
};
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <!-- 顶部 Logo 和操作 -->
    <div class="sidebar-header">
      <div class="logo" v-if="!collapsed">
        <span class="logo-icon">📚</span>
        <span class="logo-text">RogueCultivator</span>
      </div>
      <el-button
        v-if="collapsed"
        :icon="'Expand'"
        text
        @click="emit('toggle')"
        class="toggle-btn"
      />
    </div>

    <!-- 搜索入口 -->
    <div class="search-entry" v-if="!collapsed" @click="handleOpenSearch">
      <el-icon><Search /></el-icon>
      <span>搜索笔记...</span>
      <kbd>Ctrl+K</kbd>
    </div>

    <!-- Tab 切换 -->
    <div class="sidebar-tabs" v-if="!collapsed">
      <button
        :class="[
          'tab-btn',
          { active: activeTab === 'folders' && uiStore.mainView === 'notes' },
        ]"
        @click="handleTabChange('folders')"
      >
        <el-icon><Folder /></el-icon>
        文件夹
      </button>
      <button
        :class="[
          'tab-btn',
          { active: activeTab === 'tags' && uiStore.mainView === 'notes' },
        ]"
        @click="handleTabChange('tags')"
      >
        <el-icon><PriceTag /></el-icon>
        标签
      </button>
      <button
        :class="['tab-btn', { active: uiStore.mainView === 'links' }]"
        @click="handleShowLinks"
      >
        <el-icon><Link /></el-icon>
        链接
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="sidebar-content" v-if="!collapsed">
      <FolderTree v-if="activeTab === 'folders'" />
      <TagList v-else-if="activeTab === 'tags'" />
    </div>

    <!-- 底部操作 -->
    <div class="sidebar-footer" v-if="!collapsed">
      <el-button type="primary" class="new-note-btn" @click="handleNewNote">
        <el-icon><Plus /></el-icon>
        新建笔记
      </el-button>
    </div>

    <!-- 折叠时的迷你操作栏 -->
    <div class="sidebar-mini" v-if="collapsed">
      <el-tooltip content="搜索 (Ctrl+K)" placement="right">
        <el-button text @click="handleOpenSearch">
          <el-icon><Search /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="新建笔记" placement="right">
        <el-button text @click="handleNewNote">
          <el-icon><Plus /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="文件夹" placement="right">
        <el-button text @click="activeTab = 'folders'">
          <el-icon><Folder /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="标签" placement="right">
        <el-button text @click="activeTab = 'tags'">
          <el-icon><PriceTag /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="链接" placement="right">
        <el-button text @click="handleShowLinks">
          <el-icon><Link /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </aside>
</template>

<style scoped>
/* ===== Material You 侧边栏样式 ===== */
.sidebar {
  width: 280px;
  height: 100vh;
  background-color: var(--md-surface-container-low);
  display: flex;
  flex-direction: column;
  transition: width var(--md-duration-medium) var(--md-easing);
  position: relative;
  overflow: hidden;
}

/* 装饰性模糊形状 - Material You 特色 */
.sidebar::before {
  content: "";
  position: absolute;
  top: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  background: var(--md-primary);
  opacity: 0.05;
  border-radius: 100px;
  filter: blur(60px);
  pointer-events: none;
}

.sidebar--collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--md-on-surface);
  letter-spacing: -0.01em;
}

/* 搜索入口 - Material You 填充文本框风格 */
.search-entry {
  margin: 8px 16px 16px;
  padding: 12px 16px;
  background-color: var(--md-surface-container-highest);
  border: none;
  border-radius: var(--md-radius-full);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: var(--md-on-surface-variant);
  font-size: 14px;
  transition: all var(--md-duration-medium) var(--md-easing);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-entry:hover {
  background-color: var(--md-surface-variant);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.search-entry:active {
  transform: scale(0.98);
}

.search-entry kbd {
  margin-left: auto;
  padding: 4px 8px;
  background-color: var(--md-surface-container);
  border-radius: var(--md-radius-xs);
  font-size: 11px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

/* Tab 切换 - Material You 分段按钮风格 */
.sidebar-tabs {
  display: flex;
  padding: 0 16px;
  gap: 4px;
  margin-bottom: 12px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 6px;
  border: none;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  border-radius: var(--md-radius-full);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all var(--md-duration-medium) var(--md-easing);
}

.tab-btn:hover {
  background-color: var(--hover-bg);
}

.tab-btn:active {
  transform: scale(0.95);
}

.tab-btn.active {
  background-color: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

.sidebar-footer {
  padding: 16px;
}

/* 新建笔记按钮 - Material You FAB 风格 */
.new-note-btn {
  width: 100%;
  height: 48px !important;
  border-radius: var(--md-radius-full) !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  box-shadow: 0 2px 8px rgba(103, 80, 164, 0.2) !important;
}

.new-note-btn:hover {
  box-shadow: 0 4px 16px rgba(103, 80, 164, 0.3) !important;
}

.sidebar-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 8px;
}

.toggle-btn {
  margin: 0 auto;
}
</style>
