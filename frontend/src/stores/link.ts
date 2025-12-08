import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { linkApi, type Link, type CreateLinkDto, type UpdateLinkDto } from "@/api/link";
import { ElMessage } from "element-plus";

export const useLinkStore = defineStore("link", () => {
  // 状态
  const links = ref<Link[]>([]);
  const loading = ref(false);
  const currentLinkId = ref<string | null>(null);

  // 计算属性
  const currentLink = computed(() =>
    links.value.find((l) => l.id === currentLinkId.value)
  );

  const unreadLinks = computed(() =>
    links.value.filter((l) => !l.isRead)
  );

  const readLinks = computed(() =>
    links.value.filter((l) => l.isRead)
  );

  // 获取链接列表
  const fetchLinks = async (params?: { folderId?: string; tagId?: string }) => {
    loading.value = true;
    try {
      links.value = await linkApi.getLinks(params);
    } catch (error) {
      console.error("获取链接列表失败:", error);
      ElMessage.error("获取链接列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 创建链接
  const createLink = async (data: CreateLinkDto) => {
    try {
      const newLink = await linkApi.createLink(data);
      links.value.unshift(newLink);
      ElMessage.success("链接添加成功");
      return newLink;
    } catch (error) {
      console.error("创建链接失败:", error);
      ElMessage.error("创建链接失败");
      return null;
    }
  };

  // 更新链接
  const updateLink = async (id: string, data: UpdateLinkDto) => {
    try {
      const updatedLink = await linkApi.updateLink(id, data);
      const index = links.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        links.value[index] = updatedLink;
      }
      return updatedLink;
    } catch (error) {
      console.error("更新链接失败:", error);
      ElMessage.error("更新链接失败");
      return null;
    }
  };

  // 删除链接
  const deleteLink = async (id: string) => {
    try {
      await linkApi.deleteLink(id);
      links.value = links.value.filter((l) => l.id !== id);
      if (currentLinkId.value === id) {
        currentLinkId.value = null;
      }
      ElMessage.success("链接已删除");
      return true;
    } catch (error) {
      console.error("删除链接失败:", error);
      ElMessage.error("删除链接失败");
      return false;
    }
  };

  // 标记为已读/未读
  const toggleRead = async (id: string) => {
    const link = links.value.find((l) => l.id === id);
    if (!link) return;
    
    return updateLink(id, { isRead: !link.isRead });
  };

  // 选择链接
  const selectLink = (id: string | null) => {
    currentLinkId.value = id;
  };

  // 抓取链接元信息
  const fetchMeta = async (url: string) => {
    try {
      return await linkApi.fetchMeta(url);
    } catch (error) {
      console.error("抓取链接信息失败:", error);
      return null;
    }
  };

  return {
    // 状态
    links,
    loading,
    currentLinkId,
    
    // 计算属性
    currentLink,
    unreadLinks,
    readLinks,
    
    // 方法
    fetchLinks,
    createLink,
    updateLink,
    deleteLink,
    toggleRead,
    selectLink,
    fetchMeta,
  };
});
