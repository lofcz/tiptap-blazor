import {
    BubbleMenu, EditorContent, useEditor,
  } from '@tiptap/react'
  import StarterKit from '@tiptap/starter-kit'
  import React, { useEffect, useState } from 'react'
  import { Color } from '@tiptap/extension-color'
  import TextStyle from '@tiptap/extension-text-style'
  import Highlight from '@tiptap/extension-highlight'
  import ColorPicker from './ColorPicker'
  
  const TipTapEditor = ({ content, onUpdate }) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Color,
        TextStyle,
        Highlight.configure({ multicolor: true })
      ],
      content: content,
      onUpdate: ({ editor }) => {
        if (onUpdate) {
          onUpdate(editor.getHTML())
        }
      },
    })
  
    const [isEditable, setIsEditable] = React.useState(true)
    const [activeColorPicker, setActiveColorPicker] = useState(null)
    const [isToolbarVisible, setIsToolbarVisible] = useState(false)
  
    useEffect(() => {
        if (!isToolbarVisible) {
          setActiveColorPicker(null)
        }
      }, [isToolbarVisible])

    useEffect(() => {
      if (editor) {
        editor.setEditable(isEditable)
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
        editor.chain().focus().setHighlight({ color }).run()
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
  
    return (
      <>
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={isEditable} 
              onChange={() => setIsEditable(!isEditable)} 
            />
            Editable
          </label>
        </div>
  
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
          <button
            onClick={() => handleToolbarAction(() => 
              editor.chain().focus().toggleBold().run()
            )}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            Bold
          </button>
          <button
            onClick={() => handleToolbarAction(() => 
              editor.chain().focus().toggleItalic().run()
            )}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            Italic
          </button>
          <button
            onClick={() => handleToolbarAction(() => 
              editor.chain().focus().toggleStrike().run()
            )}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            Strike
          </button>
            <ColorPicker
            editor={editor}
            type="text"
            label="Text Color"
            currentColor={editor.getAttributes('textStyle').color}
            onColorChange={handleTextColorChange}
            isOpen={activeColorPicker === 'text'}
            onOpenChange={() => handleColorPickerOpen('text')}
          />
          <ColorPicker
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
  
        <EditorContent editor={editor} />
      </>
    )
  }
  
  export default TipTapEditor
  