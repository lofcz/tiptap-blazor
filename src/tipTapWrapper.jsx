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

    setEditable(value) {
        if (this.editorRef.current?.editor) {
            this.editorRef.current.editor.setEditable(value)
        }
    }

    get isEditable() {
        return this.editorRef.current?.editor?.isEditable ?? false
    }

    getContent() {
        if (this.editorRef.current) {
            return this.editorRef.current.getContent();
        }
    }

    setContent(content) {
        if (this.editorRef.current?.editor) {

            const convertNewlinesToBr = (text) => {
                if (typeof text !== 'string') {
                    return text;
                }
                return text.replace(/\n/g, '<br>');
            };

            this.editorRef.current.editor.commands.setContent(convertNewlinesToBr(content), false, {preserveWhitespace: "full"});
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
