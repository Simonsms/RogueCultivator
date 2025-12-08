<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from "vue";
import {
  Editor,
  rootCtx,
  defaultValueCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/preset-gfm";
import { history } from "@milkdown/plugin-history";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { clipboard } from "@milkdown/plugin-clipboard";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  save: [];
  scroll: [ratio: number];
}>();

const editorRef = ref<HTMLDivElement | null>(null);
const editor = shallowRef<Editor | null>(null);

// 滚动事件处理 - 滚动容器就是 editorRef
const handleScroll = () => {
  if (!editorRef.value) return;

  const { scrollTop, scrollHeight, clientHeight } = editorRef.value;
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) return;

  const ratio = scrollTop / maxScroll;
  emit("scroll", ratio);
};

// 滚动到指定比例位置
const scrollTo = (ratio: number) => {
  if (!editorRef.value) return;

  const { scrollHeight, clientHeight } = editorRef.value;
  const maxScroll = scrollHeight - clientHeight;
  editorRef.value.scrollTop = ratio * maxScroll;
};

// 暴露方法给父组件
defineExpose({ scrollTo });

// 初始化编辑器
const initEditor = async () => {
  if (!editorRef.value) return;

  try {
    const editorInstance = await Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, editorRef.value!);
        ctx.set(defaultValueCtx, props.modelValue || "");

        // 设置只读模式
        if (props.readonly) {
          ctx.set(editorViewOptionsCtx, { editable: () => false });
        }

        // 监听内容变化（只在非只读模式下）
        if (!props.readonly) {
          ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
            emit("update:modelValue", markdown);
          });
        }
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener)
      .use(clipboard)
      .create();

    editor.value = editorInstance;
  } catch (e) {
    console.error("Failed to init Milkdown editor:", e);
  }
};

// 注意：不再在组件内部监听 modelValue 变化来重建编辑器
// 如果需要完全重置编辑器内容（如切换笔记），应该在父组件中使用 :key 来强制重新挂载此组件
// 这样可以避免用户打字时触发不必要的编辑器重建

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    emit("save");
  }
};

onMounted(async () => {
  // 绑定滚动事件到 editorRef
  editorRef.value?.addEventListener("scroll", handleScroll);

  await initEditor();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  // 移除滚动事件
  editorRef.value?.removeEventListener("scroll", handleScroll);

  if (editor.value) {
    try {
      editor.value.destroy();
    } catch (e) {
      // 忽略销毁时的错误
      console.warn("Editor destroy warning:", e);
    }
    editor.value = null;
  }
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="milkdown-wrapper">
    <div ref="editorRef" class="milkdown-editor" :class="{ readonly }"></div>
  </div>
</template>

<style>
/* Milkdown 编辑器样式覆盖 */
.milkdown-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.milkdown-editor {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
}

/* 暗色主题适配 */
html.dark .milkdown-editor {
  --milkdown-background: var(--card-bg, #1e1e1e);
  --milkdown-text: var(--text-color, #e0e0e0);
}

.milkdown-editor .milkdown {
  min-height: 100%;
  background: transparent;
}

.milkdown-editor .editor {
  padding: 0;
  min-height: 100%;
}

/* 文字样式 */
.milkdown-editor .ProseMirror {
  min-height: 100%;
  font-size: 18px;
  line-height: 1.85;
  color: var(--text-color);
}

.milkdown-editor .ProseMirror:focus {
  outline: none;
}

/* 标题样式 */
.milkdown-editor h1 {
  font-size: 2em;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

.milkdown-editor h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.milkdown-editor h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

/* 代码块样式 */
.milkdown-editor pre {
  background-color: var(--code-bg, #2d2d2d);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 1em 0;
}

.milkdown-editor code {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.9em;
}

.milkdown-editor :not(pre) > code {
  background-color: var(--code-bg, #2d2d2d);
  padding: 2px 6px;
  border-radius: 4px;
}

/* 链接样式 */
.milkdown-editor a {
  color: var(--primary-color, #409eff);
  text-decoration: none;
}

.milkdown-editor a:hover {
  text-decoration: underline;
}

/* 列表样式 */
.milkdown-editor ul,
.milkdown-editor ol {
  padding-left: 2em;
  margin: 0.5em 0;
}

.milkdown-editor li {
  margin: 0.25em 0;
}

/* 任务列表 */
.milkdown-editor .task-list-item {
  list-style: none;
  margin-left: -1.5em;
}

.milkdown-editor .task-list-item input[type="checkbox"] {
  margin-right: 0.5em;
}

/* 引用样式 */
.milkdown-editor blockquote {
  border-left: 4px solid var(--primary-color, #409eff);
  padding-left: 16px;
  margin: 1em 0;
  color: var(--text-secondary);
}

/* 表格样式 */
.milkdown-editor table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.milkdown-editor th,
.milkdown-editor td {
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  text-align: left;
}

.milkdown-editor th {
  background-color: var(--hover-bg, #f5f5f5);
  font-weight: 600;
}

/* 图片样式 */
.milkdown-editor img {
  max-width: 100%;
  border-radius: 4px;
}

/* 分割线 */
.milkdown-editor hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2em 0;
}

/* 只读模式 */
.milkdown-editor.readonly .ProseMirror {
  cursor: default;
}

/* 占位符 */
.milkdown-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--text-secondary);
  pointer-events: none;
  float: left;
  height: 0;
}
</style>
