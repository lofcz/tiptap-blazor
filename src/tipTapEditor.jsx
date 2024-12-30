import {
    BubbleMenu, EditorContent, Extension, textInputRule, useEditor, wrappingInputRule,
} from '@tiptap/react'
import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import {Color} from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import ColorPicker from './ColorPicker.jsx'
import ToolbarButton from "./ToolbarButton.jsx"
// import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji'
import suggestion from './suggestion'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import HardBreak from '@tiptap/extension-hard-break'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Code from '@tiptap/extension-code'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Dropcursor from '@tiptap/extension-dropcursor'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import History from '@tiptap/extension-history'

const CustomBulletList = BulletList.configure({
    HTMLAttributes: {
        class: 'bullet-list',
    },
}).extend({
    addInputRules() {
        return [
            wrappingInputRule({
                find: /^-\s$/,
                type: this.type,
                keepMarks: true,
                keepAttributes: true,
                getAttributes: () => this.options.HTMLAttributes,
            }),
        ]
    },
})

const CustomEnterBehavior = Extension.create({
    name: 'customEnterBehavior',

    addKeyboardShortcuts() {
        return {
            Enter: () => {
                return this.editor.commands.setHardBreak()
            },
            'Shift-Enter': () => {
                return this.editor.commands.insertContent({
                    type: 'paragraph',
                    attrs: { explicit: true },
                })
            },
        }
    },
})

const CustomParagraph = Paragraph.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            explicit: {
                default: false,
                parseHTML: () => false,
                renderHTML: (attributes) => {
                    if (attributes.explicit) {
                        return {}
                    }
                    return null
                },
            },
        }
    },
    addInputRules() {
        return this.parent?.() || []
    },
    renderHTML({ node, HTMLAttributes }) {
        if (node.attrs.explicit) {
            return ['p', HTMLAttributes, 0]
        }
        return ['fragment', 0]
    },
})

const CustomText = Text.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            preserveWhitespace: "full",
        }
    }
})

const cleanHtml = (html) => {
    return html
        .replace(/<fragment>(.*?)<\/fragment>/gs, '$1')
        .replace(/<br\s*\/?>/g, '\n');
}

const convertNewlinesToBr = (text) => {
    if (typeof text !== 'string') {
        return text;
    }
    return text.replace(/\n/g, '<br>');
};

const TipTapEditor = forwardRef((
    {
         content,
         onUpdate,
         isEditable = true
    },
    ref) => {

    const [initialContent, setInitialContent] = useState(convertNewlinesToBr(content));

    const editor = useEditor({
        extensions: [
            Document,
            CustomText,
            CustomParagraph,
            HardBreak,
            Bold,
            Italic,
            Code,
            Strike,
            Underline,
            Link,
            Color,
            TextStyle,
            Highlight.configure({multicolor: true}),
            /*Emoji.configure({
                emojis: gitHubEmojis,
                enableEmoticons: true,
                suggestion,
            }),*/
            CustomBulletList,
            ListItem,
            OrderedList,
            Dropcursor,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            History,
            CustomEnterBehavior
        ],
        content: initialContent,
        onUpdate: ({editor}) => {
            if (onUpdate) {
                const value = editor.isEmpty ? '' : editor.getHTML()
                onUpdate(cleanHtml(value))
            }
        },
        editable: isEditable,
        onCreate: ({ editor }) => {
            editor.view.dom.setAttribute("data-gramm", "false");
            editor.view.dom.setAttribute("data-enable-grammarly", "false");
            editor.view.dom.setAttribute("data-gramm_editor", "false");
        },
        parseOptions: {
            preserveWhitespace: "full",
        },
    })

    const [activeColorPicker, setActiveColorPicker] = useState(null)
    const [isToolbarVisible, setIsToolbarVisible] = useState(false)

    useEffect(() => {
        if (!isToolbarVisible) {
            setActiveColorPicker(null)
        }
    }, [isToolbarVisible])

    useEffect(() => {
        if (editor) {
            editor.editable = isEditable
        }
    }, [isEditable, editor])

    const handleTextColorChange = (color) => {
        if (color === null) {
            editor.chain().focus().unsetColor().run()
        } else {
            editor.chain().focus().setColor(color).run()
        }
    }

    const handleBackgroundColorChange = (color) => {
        if (color === null) {
            editor.chain().focus().unsetHighlight().run()
        } else {
            editor.chain().focus().setHighlight({color}).run()
        }
    }

    const handleColorPickerOpen = (pickerType) => {
        setActiveColorPicker(activeColorPicker === pickerType ? null : pickerType)
    }

    const handleToolbarAction = (action) => {
        setActiveColorPicker(null)
        action()
    }

    const handleToolbarVisibilityChange = (visible) => {
        setIsToolbarVisible(visible)
    }

    useImperativeHandle(ref, () => ({
        destroy: () => {
            if (editor) {
                editor.destroy()
            }
        },
        editor: editor,
        setEditable: (value) => {
            if (editor) {
                editor.setEditable(value)
            }
        },
        getContent: () => {
            const value = editor.isEmpty ? '' : editor.getHTML()
            return cleanHtml(value)
        }
    }), [editor])

    return (
        <div data-gramm={false} data-enable-grammarly={false} data-gramm_editor={false}>
            {editor && <BubbleMenu

                editor={editor}
                tippyOptions={{
                    duration: 10,
                    allowHTML: true,
                    onShow: () => handleToolbarVisibilityChange(true),
                    onHide: () => handleToolbarVisibilityChange(false)
                }}
                updateDelay={120}
            >
                <div className="bubble-menu">
                    <ToolbarButton
                        icon="bold"
                        tooltip="Bold"
                        isActive={editor.isActive('bold')}
                        onClick={() => handleToolbarAction(() =>
                            editor.chain().focus().toggleBold().run()
                        )}
                    />
                    <ToolbarButton
                        icon="italic"
                        tooltip="Italic"
                        isActive={editor.isActive('italic')}
                        onClick={() => handleToolbarAction(() =>
                            editor.chain().focus().toggleItalic().run()
                        )}
                    />
                    <ToolbarButton
                        icon="strike"
                        tooltip="Strike"
                        isActive={editor.isActive('strike')}
                        onClick={() => handleToolbarAction(() =>
                            editor.chain().focus().toggleStrike().run()
                        )}
                    />
                    <ToolbarButton
                        icon="code"
                        tooltip="Code"
                        isActive={editor.isActive('code')}
                        onClick={() => handleToolbarAction(() =>
                            editor.chain().focus().toggleCode().run()
                        )}
                    />
                    <ColorPicker
                        icon="color-front"
                        editor={editor}
                        type="text"
                        label="Text Color"
                        currentColor={editor.getAttributes('textStyle').color}
                        onColorChange={handleTextColorChange}
                        isOpen={activeColorPicker === 'text'}
                        onOpenChange={() => handleColorPickerOpen('text')}
                    />
                    <ColorPicker
                        icon="color-back"
                        editor={editor}
                        type="background"
                        label="Background"
                        currentColor={editor.getAttributes('highlight').color}
                        onColorChange={handleBackgroundColorChange}
                        isOpen={activeColorPicker === 'background'}
                        onOpenChange={() => handleColorPickerOpen('background')}
                    />
                </div>
            </BubbleMenu>}

            <EditorContent editor={editor} className={editor && !editor.isEditable ? 'editorDisabled' : ''}/>
        </div>
    )
})

export default TipTapEditor
  