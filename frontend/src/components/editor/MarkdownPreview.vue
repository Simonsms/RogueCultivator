<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const props = defineProps<{
  content: string;
}>();

const emit = defineEmits<{
  scroll: [ratio: number];
}>();

const previewRef = ref<HTMLDivElement | null>(null);

// 配置 marked 使用 highlight.js
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch {
          // 忽略高亮错误
        }
      }
      return hljs.highlightAuto(code).value;
    },
  })
);

// 配置 GFM 和换行
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 渲染 Markdown
const renderedContent = computed(() => {
  if (!props.content) return "";
  try {
    return marked(props.content);
  } catch (e) {
    console.error("Markdown render error:", e);
    return props.content;
  }
});

// 滚动事件处理
const handleScroll = () => {
  if (!previewRef.value) return;

  const { scrollTop, scrollHeight, clientHeight } = previewRef.value;
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) return;

  const ratio = scrollTop / maxScroll;
  emit("scroll", ratio);
};

// 滚动到指定比例位置
const scrollTo = (ratio: number) => {
  if (!previewRef.value) return;

  const { scrollHeight, clientHeight } = previewRef.value;
  const maxScroll = scrollHeight - clientHeight;
  previewRef.value.scrollTop = ratio * maxScroll;
};

// 暴露方法给父组件
defineExpose({ scrollTo });

onMounted(() => {
  previewRef.value?.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  previewRef.value?.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div ref="previewRef" class="markdown-preview">
    <div class="markdown-body" v-html="renderedContent"></div>
  </div>
</template>

<style>
.markdown-preview {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 24px;
  box-sizing: border-box;
  background-color: var(--card-bg);
}

.markdown-body {
  font-size: 18px;
  line-height: 1.85;
  color: var(--text-color);
}

/* 标题样式 */
.markdown-body h1 {
  font-size: 2em;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 0.75em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--border-color);
}

.markdown-body h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--border-color);
}

.markdown-body h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}

.markdown-body h4 {
  font-size: 1em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

/* 段落 */
.markdown-body p {
  margin: 0.75em 0;
}

/* 链接 */
.markdown-body a {
  color: var(--primary-color, #409eff);
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

/* 代码块 */
.markdown-body pre {
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown-body pre code {
  background: transparent;
  padding: 0;
  font-size: 14px;
  line-height: 1.6;
}

/* 行内代码 */
.markdown-body code {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace;
  background-color: rgba(110, 118, 129, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

/* 引用 */
.markdown-body blockquote {
  border-left: 4px solid var(--primary-color, #409eff);
  padding: 0.5em 1em;
  margin: 1em 0;
  color: var(--text-secondary);
  background-color: rgba(64, 158, 255, 0.05);
  border-radius: 0 4px 4px 0;
}

.markdown-body blockquote p {
  margin: 0;
}

/* 列表 */
.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin: 0.75em 0;
}

.markdown-body li {
  margin: 0.25em 0;
}

/* 任务列表 */
.markdown-body li input[type="checkbox"] {
  margin-right: 0.5em;
}

/* 表格 */
.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  overflow-x: auto;
  display: block;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid var(--border-color);
  padding: 10px 16px;
  text-align: left;
}

.markdown-body th {
  background-color: rgba(255, 255, 255, 0.05);
  font-weight: 600;
}

.markdown-body tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.02);
}

/* 分割线 */
.markdown-body hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2em 0;
}

/* 图片 */
.markdown-body img {
  max-width: 100%;
  border-radius: 4px;
  margin: 1em 0;
}

/* 强调 */
.markdown-body strong {
  font-weight: 600;
}

.markdown-body em {
  font-style: italic;
}

/* 删除线 */
.markdown-body del {
  text-decoration: line-through;
  opacity: 0.7;
}
</style>
