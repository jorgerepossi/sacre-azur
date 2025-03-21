import React from 'react';

import { Editor } from '@tiptap/react'



import {Bold, Heading1, Heading2, Heading3, Heading4, Heading5,  Italic, Strikethrough, AlignLeft, AlignRight, AlignCenter} from 'lucide-react';

import Flex from '../flex';
import {Toggle} from "@/components/ui/toggle"

const  MenuBar = ({editor}: {editor:  Editor | null} ) => {
    if (!editor) {
        return null
    }
    const OPTIONS = [{

        id: '1',
        icon: <Heading1 className="size-4"/>,
        onClick: () => editor.chain().focus().toggleHeading({level: 1}).run(),
        pressed: editor.isActive("heading", {level: 1}),
    },
        {
            id: '2',
            icon: <Heading2 className="size-4"/>,
            onClick: () => editor.chain().focus().toggleHeading({level: 2}).run(),
            pressed: editor.isActive("heading", {level: 2}),
        },
        {
            id: '3',
            icon: <Heading3 className="size-4"/>,
            onClick: () => editor.chain().focus().toggleHeading({level: 3}).run(),
            pressed: editor.isActive("heading", {level: 3}),
        }, {
            id: '4',
            icon: <Heading4 className="size-4"/>,
            onClick: () => editor.chain().focus().toggleHeading({level: 4}).run(),
            pressed: editor.isActive("heading", {level: 4}),
        },
        {
            id: '5',
            icon: <Heading5 className="size-4"/>,
            onClick: () => editor.chain().focus().toggleHeading({level: 5}).run(),
            pressed: editor.isActive("heading", {level: 5}),
        },
        {
            id: '6',
            icon: <Bold className="size-4"/>,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive("bold"),
        },
        {
            id: '7',
            icon: <Italic className="size-4"/>,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed:editor.isActive('italic')  ,
        },
        {
            id: '8',
            icon: <Strikethrough className="size-4"/>,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed:editor.isActive('strike'),
        },
        {
            id: '9',
            icon: <AlignLeft className="size-4"/>,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            pressed:editor.isActive({ textAlign: 'left' }),
        },
        {
            id: '10',
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            pressed: editor.isActive({ textAlign: "center" }),
        },
        {
            id: '11',
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            pressed: editor.isActive({ textAlign: "right" }),
        },

    ]
    return (
        <Flex className="control-group">
            {OPTIONS.map((option, index) => (
                <Toggle key={option.id} pressed={option.pressed} onPressedChange={option.onClick}>
                    {option.icon}
                </Toggle>
            ))}
        </Flex>
    )
}

export default MenuBar;


/*
* <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>

                <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
                    Paragraph
                </button>


                <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                    Highlight
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
                    Left
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
                    Center
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
                    Right
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
                    Justify
                </button>
                *
                * */