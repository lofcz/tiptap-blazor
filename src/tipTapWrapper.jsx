import React from 'react'
import ReactDOM from 'react-dom/client'
import TipTapEditor from './tipTapEditor.jsx'

const ReactInstance = window.React || React
const ReactDOMInstance = window.ReactDOM || ReactDOM

class TipTapWrapper {
    constructor(element, options = {}) {
        this.element = element
        this.options = options
        this.editorRef = React.createRef()

        if (!ReactDOMInstance || !ReactDOMInstance.createRoot) {
            throw new Error('ReactDOM.createRoot is not available')
        }

        this.root = ReactDOMInstance.createRoot(element)
    }

    setContent(content) {
        if (this.editorRef.current?.editor) {
            this.editorRef.current.editor.commands.setContent(content)
        }
    }

    mount() {
        if (this.root) {
            this.root.render(
                ReactInstance.createElement(TipTapEditor, {
                    ref: this.editorRef,
                    content: this.options.content,
                    onUpdate: this.options.onUpdate
                })
            )
        }
    }

    destroy() {
        if (this.editorRef.current) {
            this.editorRef.current.destroy()
            this.editorRef = null
        }
    }
}

export default TipTapWrapper
