import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import Flex from '@/components/flex';
import MenuBar from "@/components/rich-text-editor/menu-bar";
import TextAlign from '@tiptap/extension-text-align';


const RichTextEditor = () => {
    const editor = useEditor({
        extensions: [StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class:"min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
            }
        }
    })

    return (
        <Flex className={'flex-col gap-[1rem]'}>
            <MenuBar editor={editor}  />
            <EditorContent editor={editor} />
        </Flex>
    )
};

export default RichTextEditor;