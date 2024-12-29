import React, {useState, useEffect, useRef} from 'react'
import TipTapIsland from './tiptap-island.js'
import './styles.scss'

function App({ initialContent = '<p>Hello TipTap!</p>', editorId = 'test-editor' }) {
    const [content, setContent] = useState(initialContent)
    const editorRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!editorRef.current && containerRef.current) {
                editorRef.current = TipTapIsland.create(editorId, {
                    content: content,
                    onUpdate: (newContent) => {
                        setContent(newContent)
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
    }, [editorId])

    return (
        <div className="app-container">
            <h1>TipTap Editor Test</h1>

            <div className="editor-container">
                <div id={editorId} ref={containerRef}></div>
            </div>

            <div className="content-preview">
                <h3>Current HTML Content:</h3>
                <pre>{content}</pre>
            </div>
        </div>
    )
}

export default App
