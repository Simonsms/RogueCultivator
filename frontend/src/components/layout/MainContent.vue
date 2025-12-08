<script setup lang="ts">
import { computed, ref } from "vue";
import { useNoteStore } from "@/stores/note";
import { useUIStore } from "@/stores/ui";
import { useThemeStore } from "@/stores/theme";
import NoteEditor from "@/components/note/NoteEditor.vue";
import NoteList from "@/components/note/NoteList.vue";
import LinkList from "@/components/link/LinkList.vue";
import GlobalSearch from "@/components/search/GlobalSearch.vue";
import ThemeSettings from "@/components/settings/ThemeSettings.vue";

defineProps<{
  sidebarCollapsed: boolean;
}>();

const emit = defineEmits<{
  toggleSidebar: [];
}>();

const noteStore = useNoteStore();
const uiStore = useUIStore();
const themeStore = useThemeStore();

// 当前选中的笔记
const currentNote = computed(() => noteStore.currentNote);

// 是否有选中的笔记
const hasActiveNote = computed(() => !!currentNote.value);

// 是否显示链接视图
const isLinksView = computed(() => uiStore.mainView === "links");

// 设置弹窗
const showSettings = ref(false);
</script>

<template>
  <main class="main-content">
    <!-- 顶部工具栏 -->
    <header class="toolbar">
      <div class="toolbar-left">
        <el-button text @click="emit('toggleSidebar')">
          <el-icon><Fold v-if="!sidebarCollapsed" /><Expand v-else /></el-icon>
        </el-button>

        <template v-if="currentNote">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-if="currentNote.folder">
              {{ currentNote.folder.name }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{
              currentNote.title || "无标题"
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </template>
      </div>

      <div class="toolbar-right">
        <!-- 视图切换 -->
        <el-button-group v-if="hasActiveNote">
          <el-button
            :type="uiStore.editorMode === 'edit' ? 'primary' : 'default'"
            size="small"
            @click="uiStore.setEditorMode('edit')"
          >
            编辑
          </el-button>
          <el-button
            :type="uiStore.editorMode === 'split' ? 'primary' : 'default'"
            size="small"
            @click="uiStore.setEditorMode('split')"
          >
            分屏
          </el-button>
        </el-button-group>

        <!-- 主题切换（快捷按钮） -->
        <el-tooltip content="切换深色/浅色模式" placement="bottom">
          <el-button text @click="themeStore.toggleTheme()">
            <el-icon>
              <Sunny v-if="themeStore.isDark" />
              <Moon v-else />
            </el-icon>
          </el-button>
        </el-tooltip>

        <!-- 设置按钮 -->
        <el-tooltip content="主题设置" placement="bottom">
          <el-button text @click="showSettings = true">
            <el-icon><Setting /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </header>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 链接列表视图 -->
      <template v-if="isLinksView">
        <LinkList />
      </template>
      <!-- 笔记视图 -->
      <template v-else-if="hasActiveNote">
        <NoteEditor :note="currentNote!" />
      </template>
      <template v-else>
        <NoteList />
      </template>
    </div>

    <!-- 全局搜索弹窗 -->
    <GlobalSearch />

    <!-- 设置弹窗 -->
    <el-dialog
      v-model="showSettings"
      title="主题设置"
      width="400px"
      :append-to-body="true"
    >
      <ThemeSettings />
    </el-dialog>
  </main>
</template>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-color);
}

.toolbar {
  height: 50px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--toolbar-bg);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-area {
  flex: 1;
  overflow: hidden;
  padding: 0;
}
</style>
