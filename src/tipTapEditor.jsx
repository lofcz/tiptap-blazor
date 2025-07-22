import {
    EditorContent, Extension, textInputRule, useEditor, wrappingInputRule,
} from '@tiptap/react'
import {BubbleMenu} from "@tiptap/react/menus";
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import {Color} from '@tiptap/extension-color'
import {TextStyle} from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import ColorPicker from './ColorPicker.jsx'
import ToolbarButton from "./ToolbarButton.jsx"
import {
    BulletList, ListItem, OrderedList,
} from '@tiptap/extension-list';
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
import {TaskList} from '@tiptap/extension-task-list'
import TaskItem from "@tiptap/extension-task-item";
import {Dropcursor} from '@tiptap/extensions';
import {History} from "@tiptap/extension-history";
import i18n from "./i18n.js";

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
         isEditable = true,
         theme = 'light'
    },
    ref) => {

    const [, forceUpdate] = useState({});
    const toolbarRef = useRef(null);
    const textColorPickerRef = useRef(null);
    const backgroundColorPickerRef = useRef(null);

    useEffect(() => {
        const unsubscribe = i18n.subscribe(() => {
            forceUpdate({});
        });
        return () => unsubscribe();
    }, []);
    
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
            CustomBulletList,
            ListItem,
            OrderedList,
            Dropcursor.configure(),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            History.configure(),
            CustomEnterBehavior
        ],
        content: initialContent,
        onUpdate: ({editor}) => {
            if (onUpdate) {
                const value = editor.isEmpty ? '' : editor.getHTML()
                onUpdate(cleanHtml(value))
            }
        },
        onSelectionUpdate: ({ editor }) => {
            if (editor.state.selection.empty) {
                setActiveColorPicker(null)
            }
        },
        onBlur: () => {
            setActiveColorPicker(null)
        },
        editable: isEditable,
        shouldRerenderOnTransaction: true,
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

    // Global outside-click handler: closes open colour pickers and blurs the editor
    useEffect(() => {
        if (!editor) return;

        function handleClick(e) {
            const toolbarNode = toolbarRef.current;
            const textPickerNode = textColorPickerRef.current;
            const bgPickerNode = backgroundColorPickerRef.current;
            const editorDom = editor.view.dom;
            const target = e.target;

            // Ignore clicks that occur inside the editor itself, the toolbar, or either picker
            if (
                (editorDom && editorDom.contains(target)) ||
                (toolbarNode && toolbarNode.contains(target)) ||
                (textPickerNode && textPickerNode.contains(target)) ||
                (bgPickerNode && bgPickerNode.contains(target))
            ) {
                return;
            }

            // Close any open picker
            if (activeColorPicker) {
                setActiveColorPicker(null);
            }

            // Collapse selection and blur editor so BubbleMenu hides
            const pos = editor.state.selection.to;
            editor.chain().setTextSelection(pos).run();
            editor.commands.blur();
        }

        // Capture phase ensures we see the click before any component inside may stop propagation
        document.addEventListener('mousedown', handleClick, true);
        return () => document.removeEventListener('mousedown', handleClick, true);
    }, [activeColorPicker, editor]);

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
        if (activeColorPicker === pickerType) {
            // We are closing the currently open picker – collapse the selection and blur the editor
            setActiveColorPicker(null)
            if (editor) {
                // Re-focus the editor so BubbleMenu stays visible and will later hide on an external blur
                editor.chain().focus().run()
            }
        } else {
            setActiveColorPicker(pickerType)
        }
    }

    const handleToolbarAction = (action) => {
        setActiveColorPicker(null)
        action()
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
        <div data-gramm={false} data-enable-grammarly={false} data-gramm_editor={false} className={`${theme}-theme`}>
            {editor && <BubbleMenu
                editor={editor}
                className="bubble-menu"
                updateDelay={120}
                pluginKey="bubbleMenu"
                ref={toolbarRef}
            >
                <ToolbarButton
                    icon="bold"
                    tooltip={i18n.t('bold')}
                    isActive={editor.isActive('bold')}
                    onClick={() => handleToolbarAction(() =>
                        editor.chain().focus().toggleBold().run()
                    )}
                />
                <ToolbarButton
                    icon="italic"
                    tooltip={i18n.t('italic')}
                    isActive={editor.isActive('italic')}
                    onClick={() => handleToolbarAction(() =>
                        editor.chain().focus().toggleItalic().run()
                    )}
                />
                <ToolbarButton
                    icon="strike"
                    tooltip={i18n.t('strike')}
                    isActive={editor.isActive('strike')}
                    onClick={() => handleToolbarAction(() =>
                        editor.chain().focus().toggleStrike().run()
                    )}
                />
                <ToolbarButton
                    icon="code"
                    tooltip={i18n.t('code')}
                    isActive={editor.isActive('code')}
                    onClick={() => handleToolbarAction(() =>
                        editor.chain().focus().toggleCode().run()
                    )}
                />
                <span ref={textColorPickerRef}>
                <ColorPicker
                    icon="color-front"
                    editor={editor}
                    type="text"
                    label={i18n.t('textColor')}
                    currentColor={editor.getAttributes('textStyle').color}
                    onColorChange={handleTextColorChange}
                    isOpen={activeColorPicker === 'text'}
                    onOpenChange={() => handleColorPickerOpen('text')}
                />
                </span>
                <span ref={backgroundColorPickerRef}>
                <ColorPicker
                    icon="color-back"
                    editor={editor}
                    type="background"
                    label={i18n.t('backgroundColor')}
                    currentColor={editor.getAttributes('highlight').color}
                    onColorChange={handleBackgroundColorChange}
                    isOpen={activeColorPicker === 'background'}
                    onOpenChange={() => handleColorPickerOpen('background')}
                />
                </span>
            </BubbleMenu>}

            <EditorContent editor={editor} className={editor && !editor.isEditable ? 'editorDisabled' : ''}/>
        </div>
    )
})

export default TipTapEditor
  