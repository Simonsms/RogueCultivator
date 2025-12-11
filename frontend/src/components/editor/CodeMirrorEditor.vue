<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from "vue";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
} from "@codemirror/language";

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
const view = shallowRef<EditorView | null>(null);

// 自定义主题 - 与项目风格匹配
const customTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "16px",
    backgroundColor: "var(--card-bg)",
  },
  ".cm-content": {
    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
    padding: "16px 0",
    caretColor: "var(--primary-color, #409eff)",
  },
  ".cm-line": {
    padding: "0 16px",
    lineHeight: "1.75",
  },
  ".cm-gutters": {
    backgroundColor: "var(--card-bg)",
    borderRight: "1px solid var(--border-color)",
    color: "var(--text-secondary)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--hover-bg)",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(64, 158, 255, 0.05)",
  },
  ".cm-selectionBackground": {
    backgroundColor: "rgba(64, 158, 255, 0.2) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(64, 158, 255, 0.3) !important",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--primary-color, #409eff)",
  },
  // Markdown 语法高亮
  ".cm-header-1": {
    fontSize: "1.6em",
    fontWeight: "bold",
    color: "var(--primary-color)",
  },
  ".cm-header-2": {
    fontSize: "1.4em",
    fontWeight: "bold",
    color: "var(--primary-color)",
  },
  ".cm-header-3": {
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "var(--primary-color)",
  },
  ".cm-header-4": { fontSize: "1.1em", fontWeight: "bold" },
  ".cm-strong": { fontWeight: "bold" },
  ".cm-emphasis": { fontStyle: "italic" },
  ".cm-strikethrough": { textDecoration: "line-through" },
  ".cm-link": { color: "#409eff", textDecoration: "underline" },
  ".cm-url": { color: "#67c23a" },
  ".cm-monospace": {
    fontFamily: "monospace",
    backgroundColor: "rgba(110, 118, 129, 0.2)",
    padding: "1px 4px",
    borderRadius: "3px",
  },
});

// 滚动事件处理
const handleScroll = () => {
  if (!view.value) return;

  const scrollInfo = view.value.scrollDOM;
  const { scrollTop, scrollHeight, clientHeight } = scrollInfo;
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) return;

  const ratio = scrollTop / maxScroll;
  emit("scroll", ratio);
};

// 滚动到指定比例位置
const scrollTo = (ratio: number) => {
  if (!view.value) return;

  const scrollInfo = view.value.scrollDOM;
  const { scrollHeight, clientHeight } = scrollInfo;
  const maxScroll = scrollHeight - clientHeight;
  scrollInfo.scrollTop = ratio * maxScroll;
};

// 暴露方法给父组件
defineExpose({ scrollTo });

// 初始化编辑器
const initEditor = () => {
  if (!editorRef.value) return;

  const extensions = [
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    history(),
    bracketMatching(),
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    customTheme,
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      // Ctrl+S 保存
      {
        key: "Ctrl-s",
        run: () => {
          emit("save");
          return true;
        },
      },
    ]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const content = update.state.doc.toString();
        emit("update:modelValue", content);
      }
    }),
    EditorView.lineWrapping, // 自动换行
  ];

  // 只读模式
  if (props.readonly) {
    extensions.push(EditorState.readOnly.of(true));
  }

  // 暗色主题
  if (document.documentElement.classList.contains("dark")) {
    extensions.push(oneDark);
  }

  const state = EditorState.create({
    doc: props.modelValue || "",
    extensions,
  });

  view.value = new EditorView({
    state,
    parent: editorRef.value,
  });

  // 监听滚动事件
  view.value.scrollDOM.addEventListener("scroll", handleScroll);
};

// 重建编辑器（主题变化时使用）
const rebuildEditor = () => {
  if (!view.value) return;

  const savedContent = view.value.state.doc.toString();
  view.value.scrollDOM.removeEventListener("scroll", handleScroll);
  view.value.destroy();
  view.value = null;
  initEditor();

  // 恢复内容（如果不同）
  if (view.value && savedContent !== props.modelValue) {
    (view.value as EditorView).dispatch({
      changes: {
        from: 0,
        to: (view.value as EditorView).state.doc.length,
        insert: savedContent,
      },
    });
  }
};

// 监听主题变化重建编辑器
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName === "class") {
      rebuildEditor();
    }
  }
});

onMounted(() => {
  initEditor();
  // 监听主题变化
  observer.observe(document.documentElement, { attributes: true });
});

onUnmounted(() => {
  observer.disconnect();
  if (view.value) {
    view.value.scrollDOM.removeEventListener("scroll", handleScroll);
    view.value.destroy();
    view.value = null;
  }
});

// 监听外部内容变化（切换笔记时）
watch(
  () => props.modelValue,
  (newValue) => {
    if (view.value && newValue !== view.value.state.doc.toString()) {
      view.value.dispatch({
        changes: {
          from: 0,
          to: view.value.state.doc.length,
          insert: newValue || "",
        },
      });
    }
  }
);
</script>

<template>
  <div class="codemirror-wrapper">
    <div ref="editorRef" class="codemirror-editor"></div>
  </div>
</template>

<style>
.codemirror-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.codemirror-editor {
  height: 100%;
  width: 100%;
}

.codemirror-editor .cm-editor {
  height: 100%;
}

.codemirror-editor .cm-scroller {
  overflow: auto;
}
</style>
