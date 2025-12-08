<script setup lang="ts">
import { ref, watch } from "vue";
import { useLinkStore } from "@/stores/link";
import { useTagStore } from "@/stores/tag";
import { useDebounceFn } from "@vueuse/core";
import type { FormInstance } from "element-plus";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const linkStore = useLinkStore();
const tagStore = useTagStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const fetchingMeta = ref(false);

const form = ref({
  url: "",
  title: "",
  summary: "",
  tagIds: [] as string[],
});

// 规则
const rules = {
  url: [
    { required: true, message: "请输入链接地址", trigger: "blur" },
    { type: "url" as const, message: "请输入有效的 URL", trigger: "blur" },
  ],
};

// 监听弹窗关闭，重置表单
watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      form.value = {
        url: "",
        title: "",
        summary: "",
        tagIds: [],
      };
      formRef.value?.resetFields();
    } else {
      // 打开时加载标签
      tagStore.fetchTags();
    }
  }
);

// 防抖抓取元信息
const debouncedFetchMeta = useDebounceFn(async (url: string) => {
  if (!url || !isValidUrl(url)) return;

  fetchingMeta.value = true;
  try {
    const meta = await linkStore.fetchMeta(url);
    if (meta) {
      form.value.title = meta.title || "";
      form.value.summary = meta.summary || "";
    }
  } finally {
    fetchingMeta.value = false;
  }
}, 500);

// 监听 URL 变化自动抓取
watch(
  () => form.value.url,
  (url) => {
    if (url && !form.value.title) {
      debouncedFetchMeta(url);
    }
  }
);

// 验证 URL
const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

// 关闭弹窗
const handleClose = () => {
  emit("update:modelValue", false);
};

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  try {
    await linkStore.createLink({
      url: form.value.url,
      title: form.value.title || undefined,
      summary: form.value.summary || undefined,
      tagIds: form.value.tagIds.length > 0 ? form.value.tagIds : undefined,
    });
    handleClose();
  } finally {
    loading.value = false;
  }
};

// 手动抓取元信息
const handleFetchMeta = () => {
  if (form.value.url) {
    debouncedFetchMeta(form.value.url);
  }
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="添加链接"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <!-- URL -->
      <el-form-item label="链接地址" prop="url">
        <el-input
          v-model="form.url"
          placeholder="https://example.com/article"
          clearable
        >
          <template #append>
            <el-button
              :loading="fetchingMeta"
              @click="handleFetchMeta"
              :disabled="!form.url"
            >
              抓取
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item label="标题">
        <el-input
          v-model="form.title"
          placeholder="自动抓取或手动输入"
          :loading="fetchingMeta"
          clearable
        />
      </el-form-item>

      <!-- 摘要 -->
      <el-form-item label="摘要">
        <el-input
          v-model="form.summary"
          type="textarea"
          :rows="3"
          placeholder="自动抓取或手动输入"
        />
      </el-form-item>

      <!-- 标签 -->
      <el-form-item label="标签">
        <el-select
          v-model="form.tagIds"
          multiple
          filterable
          placeholder="选择标签"
          style="width: 100%"
        >
          <el-option
            v-for="tag in tagStore.tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          >
            <div class="tag-option">
              <span
                class="tag-color"
                :style="{ backgroundColor: tag.color || '#909399' }"
              ></span>
              <span>{{ tag.name }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        添加
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tag-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
