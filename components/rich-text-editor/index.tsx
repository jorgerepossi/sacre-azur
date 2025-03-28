"use client";

import { useEffect, useState } from "react";

import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Flex from "@/components/flex";
import MenuBar from "@/components/rich-text-editor/menu-bar";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const RichTextEditor = ({ value, onChange }: Props) => {
  const [showHtml, setShowHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value);

  const formatHtml = (html: string) => {
    return html
      .replace(/></g, ">\n<")
      .replace(/<ul>/g, "<ul>\n")
      .replace(/<\/ul>/g, "\n</ul>")
      .replace(/<li>/g, "  <li>")
      .replace(/<\/li>/g, "</li>\n")
      .replace(/<p>/g, "    <p>")
      .replace(/<\/p>/g, "</p>\n");
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const formatted = formatHtml(html);
      setHtmlContent(formatted);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value]);

  const handleHtmlChange = (newHtml: string) => {
    setHtmlContent(newHtml);
    editor?.commands.setContent(newHtml);
    onChange(newHtml);
  };

  return (
    <Flex className="flex-col gap-[1rem]">
      <MenuBar
        editor={editor}
        onToggleHtmlView={() => setShowHtml((prev) => !prev)}
      />

      {showHtml ? (
        <textarea
          value={htmlContent}
          onChange={(e) => handleHtmlChange(e.target.value)}
          className="min-h-[200px] w-full rounded border p-2 font-mono text-xs text-muted-foreground"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </Flex>
  );
};

export default RichTextEditor;
