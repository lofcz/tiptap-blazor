import React, {useState, useEffect, useRef} from 'react'
import TipTapIsland from './tiptap-island'
import './styles.scss'

function App() {
    const [content, setContent] = useState('<p>Hello TipTap!</p>')
    const editorRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!editorRef.current && containerRef.current) {
                editorRef.current = TipTapIsland.create('test-editor', {
                    content: content,
                    onUpdate: (newContent) => {
                        setContent(newContent)
                        console.log('Content updated:', newContent)
                    }
                })
            }
        }, 0)

        return () => {
            clearTimeout(timeoutId)
            if (editorRef.current) {
                const editor = editorRef.current
                editor.destroy()
                editorRef.current = null
            }
        }
    }, [])

    return (
        <div className="app-container">
            <h1>TipTap Editor Test</h1>

            <div className="editor-container">
                <div id="test-editor" ref={containerRef}></div>
            </div>

            <div className="content-preview">
                <h3>Current HTML Content:</h3>
                <pre>{content}</pre>
            </div>
        </div>
    )
}

export default App
