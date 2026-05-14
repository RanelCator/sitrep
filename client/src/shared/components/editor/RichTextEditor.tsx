import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Table2,
  UnderlineIcon,
  Undo2,
} from "lucide-react"

import { EditorContent, useEditor } from "@tiptap/react"

import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import {TextStyle} from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import Highlight from "@tiptap/extension-highlight"
import HorizontalRule from "@tiptap/extension-horizontal-rule"

import {Table} from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Underline,
      TextStyle,
      Color,

      Highlight,

      HorizontalRule,

      Link.configure({
        openOnClick: false,
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,
    ],

    content: value,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] rounded-b-xl border border-t-0 p-4 outline-none prose prose-sm max-w-none",
      },
    },
  })

  if (!editor) return null

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href

    const url = window.prompt("Enter URL", previousUrl)

    if (url === null) return

    if (url === "") {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().setLink({ href: url }).run()
  }

  const buttonVariant = (active: boolean) =>
    active ? "default" : "outline"

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="flex flex-wrap gap-2 border-b p-3">
        {/* Undo / Redo */}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" />
        </Button>

        {/* Headings */}

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(
            editor.isActive("heading", { level: 1 }),
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(
            editor.isActive("heading", { level: 2 }),
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(
            editor.isActive("heading", { level: 3 }),
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="size-4" />
        </Button>

        {/* Formatting */}

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(editor.isActive("highlight"))}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="size-4" />
        </Button>

        {/* Lists */}

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </Button>

        {/* Alignment */}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="size-4" />
        </Button>

        {/* Color */}

        <Input
          type="color"
          className="h-9 w-12 p-1"
          onChange={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
        />

        {/* Font Size */}

        <select
          className="h-9 rounded-md border bg-background px-2 text-sm"
          onChange={(event) => {
            editor
              .chain()
              .focus()
              .setMark("textStyle", {
                style: `font-size:${event.target.value}`,
              })
              .run()
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Size
          </option>

          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>

        {/* Blockquote */}

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" />
        </Button>

        {/* Horizontal Rule */}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-4" />
        </Button>

        {/* Link */}

        <Button
          type="button"
          size="sm"
          variant={buttonVariant(editor.isActive("link"))}
          onClick={addLink}
        >
          <Link2 className="size-4" />
        </Button>

        {/* Table */}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()
          }
        >
          <Table2 className="size-4" />
        </Button>

        {/* Clear Formatting */}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <RemoveFormatting className="size-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}