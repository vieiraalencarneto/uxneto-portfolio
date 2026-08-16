"use client";

import TipTapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useRef } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichEditor({
  content,
  onChange,
  placeholder = "Write your content here...",
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapImage.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose min-h-[300px] max-w-none outline-none px-4 py-4" },
    },
  });

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const form = new FormData();
      form.append("file", file);
      form.append("bucket", "portfolio");
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) {
        alert("Upload failed");
        return;
      }
      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url }).run();
    },
    [editor],
  );

  if (!editor) return null;

  const btn =
    "px-2 py-1 text-xs border border-[var(--border)] hover:bg-[var(--border)] transition-colors disabled:opacity-40";
  const active = "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]";

  return (
    <div className="border border-[var(--border)]">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--border)] bg-[var(--background)]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btn} ${editor.isActive("bold") ? active : ""}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btn} italic ${editor.isActive("italic") ? active : ""}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${btn} line-through ${editor.isActive("strike") ? active : ""}`}
        >
          S
        </button>
        <span className="w-px bg-[var(--border)] mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`}
        >
          H3
        </button>
        <span className="w-px bg-[var(--border)] mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btn} ${editor.isActive("orderedList") ? active : ""}`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${btn} ${editor.isActive("blockquote") ? active : ""}`}
        >
          " Quote
        </button>
        <span className="w-px bg-[var(--border)] mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL:");
            if (!url) return;
            editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`${btn} ${editor.isActive("link") ? active : ""}`}
        >
          Link
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className={btn}>
          Image
        </button>
        <span className="w-px bg-[var(--border)] mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={btn}
          disabled={!editor.can().undo()}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={btn}
          disabled={!editor.can().redo()}
        >
          Redo
        </button>
      </div>

      <EditorContent editor={editor} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
