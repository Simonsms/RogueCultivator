<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const props = defineProps<{
  content: string;
}>();

const emit = defineEmits<{
  scroll: [ratio: number];
}>();

const previewRef = ref<HTMLDivElement | null>(null);
const renderedHtml = ref<string>("");

// 配置 marked - 使用全局配置
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 自定义渲染器 - 代码块高亮
const renderer = new marked.Renderer();

// 重写 code 方法 - marked v17 的 code token 结构
renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  const language = lang || "";
  const code = text || "";

  if (language && hljs.getLanguage(language)) {
    try {
      const highlighted = hljs.highlight(code, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    } catch {
      // 高亮失败，使用原始代码
    }
  }
  // 无语言或不支持的语言
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<pre><code>${escaped}</code></pre>`;
};

marked.use({ renderer });

// 渲染 Markdown
const renderMarkdown = (content: string) => {
  if (!content) {
    renderedHtml.value = "";
    return;
  }
  try {
    const result = marked.parse(content);
    if (result instanceof Promise) {
      result.then((html) => {
        renderedHtml.value = html;
        console.log(
          "[MarkdownPreview] Rendered HTML (first 300 chars):",
          html.substring(0, 300)
        );
      });
    } else {
      renderedHtml.value = result;
      console.log(
        "[MarkdownPreview] Rendered HTML (first 300 chars):",
        result.substring(0, 300)
      );
    }
  } catch (e) {
    console.error("[MarkdownPreview] Render error:", e);
    renderedHtml.value = `<pre style="color: red;">渲染错误: ${e}</pre>`;
  }
};

// 监听 content 变化进行渲染
watch(
  () => props.content,
  (newContent) => {
    renderMarkdown(newContent);
  },
  { immediate: true }
);

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
    <div class="markdown-body" v-html="renderedHtml"></div>
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
  color: #e0e0e0;
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
  width: auto;
  max-width: 100%;
  margin: 1em 0;
  display: table;
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
