<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useLinkStore } from "@/stores/link";
import LinkCard from "./LinkCard.vue";
import AddLinkDialog from "./AddLinkDialog.vue";

const linkStore = useLinkStore();
const showAddDialog = ref(false);

// 初始化加载
onMounted(() => {
  linkStore.fetchLinks();
});

// 打开添加弹窗
const handleAddLink = () => {
  showAddDialog.value = true;
};
</script>

<template>
  <div class="link-list">
    <!-- 标题栏 -->
    <div class="link-list-header">
      <h3 class="title">链接收藏</h3>
      <el-button type="primary" size="small" @click="handleAddLink">
        <el-icon><Plus /></el-icon>
        添加链接
      </el-button>
    </div>

    <!-- 内容区域 -->
    <div class="link-list-content">
      <!-- 加载中 -->
      <div v-if="linkStore.loading" class="loading-state">
        <el-icon class="is-loading"><Loading /></el-icon>
        加载中...
      </div>

      <!-- 空状态 -->
      <div v-else-if="linkStore.links.length === 0" class="empty-state">
        <el-icon><Link /></el-icon>
        <p>暂无收藏链接</p>
        <el-button type="primary" size="small" @click="handleAddLink">
          添加第一个链接
        </el-button>
      </div>

      <!-- 链接列表 -->
      <div v-else class="links-container">
        <!-- 未读链接 -->
        <div v-if="linkStore.unreadLinks.length > 0" class="link-section">
          <div class="section-title">
            未读 ({{ linkStore.unreadLinks.length }})
          </div>
          <div class="link-grid">
            <LinkCard
              v-for="link in linkStore.unreadLinks"
              :key="link.id"
              :link="link"
            />
          </div>
        </div>

        <!-- 已读链接 -->
        <div v-if="linkStore.readLinks.length > 0" class="link-section">
          <div class="section-title">
            已读 ({{ linkStore.readLinks.length }})
          </div>
          <div class="link-grid">
            <LinkCard
              v-for="link in linkStore.readLinks"
              :key="link.id"
              :link="link"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 添加链接弹窗 -->
    <AddLinkDialog v-model="showAddDialog" />
  </div>
</template>

<style scoped>
.link-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
}

.link-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
}

.link-list-header .title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.link-list-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-secondary);
  gap: 16px;
}

.loading-state .el-icon,
.empty-state .el-icon {
  font-size: 64px;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
}

.link-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}
</style>
