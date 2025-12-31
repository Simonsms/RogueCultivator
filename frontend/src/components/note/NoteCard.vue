<script setup lang="ts">
import { computed } from "vue";
import { useNoteStore } from "@/stores/note";
import type { Note } from "@/api/note";
import { ElMessageBox, ElMessage } from "element-plus";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const props = defineProps<{
  note: Note;
}>();

const noteStore = useNoteStore();

// 格式化时间
const formattedTime = computed(() => {
  return dayjs(props.note.updatedAt).fromNow();
});

// 内容摘要
const summary = computed(() => {
  const content = props.note.content || "";
  // 移除 Markdown 标记，取前 100 字符
  const plainText = content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
  return plainText.length > 100 ? plainText.slice(0, 100) + "..." : plainText;
});

// 打开笔记
const handleOpen = () => {
  noteStore.selectNote(props.note.id);
};

// 收藏/取消收藏
const handleToggleFavorite = (e: Event) => {
  e.stopPropagation();
  noteStore.toggleFavorite(props.note.id);
};

// 删除笔记
const handleDelete = (e: Event) => {
  e.stopPropagation();
  ElMessageBox.confirm(
    `确定要删除笔记「${props.note.title || "无标题"}」吗？`,
    "删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      noteStore.deleteNote(props.note.id);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      // 用户取消
    });
};
</script>

<template>
  <div class="note-card" @click="handleOpen">
    <!-- 标题 -->
    <h3 class="note-title">{{ note.title || "无标题" }}</h3>

    <!-- 摘要 -->
    <p class="note-summary" v-if="summary">{{ summary }}</p>

    <!-- 标签 -->
    <div class="note-tags" v-if="note.tags.length > 0">
      <span
        v-for="tag in note.tags.slice(0, 3)"
        :key="tag.id"
        class="tag"
        :style="{ backgroundColor: tag.color || '#909399' }"
      >
        {{ tag.name }}
      </span>
      <span v-if="note.tags.length > 3" class="tag-more">
        +{{ note.tags.length - 3 }}
      </span>
    </div>

    <!-- 底部信息 -->
    <div class="note-footer">
      <span class="note-time">{{ formattedTime }}</span>
      <div class="note-actions">
        <el-button
          text
          size="small"
          :class="{ 'is-favorite': note.isFavorite }"
          @click="handleToggleFavorite"
        >
          <el-icon>
            <StarFilled v-if="note.isFavorite" />
            <Star v-else />
          </el-icon>
        </el-button>
        <el-button text size="small" class="delete-btn" @click="handleDelete">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Material You 笔记卡片样式 ===== */
.note-card {
  position: relative;
  padding: 20px;
  padding-bottom: 48px;
  min-height: 160px;
  background-color: var(--md-surface-container);
  border: none;
  border-radius: var(--md-radius-lg);
  cursor: pointer;
  transition: all var(--md-duration-medium) var(--md-easing);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.note-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px) scale(1.01);
}

.note-card:active {
  transform: scale(0.98);
}

.note-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--md-on-surface);
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.note-summary {
  font-size: 14px;
  color: var(--md-on-surface-variant);
  margin: 0 0 12px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

/* Material You 标签 - 药片形状 */
.tag {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  border-radius: var(--md-radius-full);
}

.tag-more {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
  background-color: var(--md-surface-container-highest);
  border-radius: var(--md-radius-full);
}

.note-footer {
  position: absolute;
  bottom: 16px;
  left: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.note-time {
  font-size: 12px;
  color: var(--md-on-surface-variant);
}

/* Material You 收藏状态 - 使用 tertiary 颜色 */
.is-favorite {
  color: var(--md-tertiary) !important;
}

.note-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.delete-btn {
  color: var(--md-on-surface-variant);
  opacity: 0;
  transition: all var(--md-duration-medium) var(--md-easing);
}

.note-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: var(--md-error) !important;
}
</style>
