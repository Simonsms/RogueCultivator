<script setup lang="ts">
import { computed } from "vue";
import type { Link } from "@/api/link";
import { useLinkStore } from "@/stores/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const props = defineProps<{
  link: Link;
}>();

const linkStore = useLinkStore();

// 格式化时间
const timeAgo = computed(() => dayjs(props.link.createdAt).fromNow());

// 获取域名
const domain = computed(() => {
  try {
    const url = new URL(props.link.url);
    return url.hostname;
  } catch {
    return props.link.url;
  }
});

// 打开链接
const openLink = () => {
  window.open(props.link.url, "_blank");
  // 标记为已读
  if (!props.link.isRead) {
    linkStore.toggleRead(props.link.id);
  }
};

// 删除链接
const handleDelete = () => {
  linkStore.deleteLink(props.link.id);
};

// 切换已读状态
const handleToggleRead = () => {
  linkStore.toggleRead(props.link.id);
};
</script>

<template>
  <div class="link-card" :class="{ 'link-card--read': link.isRead }">
    <!-- 图标/缩略图 -->
    <div class="link-favicon">
      <img
        v-if="link.favicon"
        :src="link.favicon"
        :alt="link.title || ''"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
      <el-icon v-else><Link /></el-icon>
    </div>

    <!-- 内容区域 -->
    <div class="link-content" @click="openLink">
      <h4 class="link-title">{{ link.title || link.url }}</h4>
      <p v-if="link.summary" class="link-summary">{{ link.summary }}</p>
      <div class="link-meta">
        <span class="link-domain">{{ domain }}</span>
        <span class="link-time">{{ timeAgo }}</span>
      </div>
      <!-- 标签 -->
      <div v-if="link.tags.length > 0" class="link-tags">
        <el-tag
          v-for="tag in link.tags"
          :key="tag.id"
          size="small"
          :style="{ backgroundColor: tag.color || '#909399', borderColor: tag.color || '#909399' }"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="link-actions">
      <el-tooltip :content="link.isRead ? '标记为未读' : '标记为已读'" placement="top">
        <el-button
          :icon="link.isRead ? 'View' : 'Hide'"
          circle
          size="small"
          text
          @click.stop="handleToggleRead"
        />
      </el-tooltip>
      <el-popconfirm
        title="确定删除此链接?"
        confirm-button-text="删除"
        cancel-button-text="取消"
        @confirm="handleDelete"
      >
        <template #reference>
          <el-button icon="Delete" circle size="small" text @click.stop />
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<style scoped>
.link-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.link-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-card--read {
  opacity: 0.7;
}

.link-favicon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: var(--hover-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-favicon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.link-favicon .el-icon {
  font-size: 20px;
  color: var(--text-secondary);
}

.link-content {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.link-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-card:hover .link-title {
  color: var(--el-color-primary);
}

.link-summary {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.link-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.link-domain {
  display: flex;
  align-items: center;
  gap: 4px;
}

.link-tags {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.link-tags .el-tag {
  color: white;
}

.link-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.link-card:hover .link-actions {
  opacity: 1;
}
</style>
