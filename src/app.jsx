import React, {useState, useEffect, useRef} from 'react'
import TipTapIsland from './tiptap-island.js'
import './styles.scss'
import i18n from "./i18n.js";

function App({ initialContent = 'Hello\n\nTipTap!', editorId = 'test-editor' }) {
    const [content, setContent] = useState(initialContent)
    const [theme, setTheme] = useState('dark');
    const [locale, setLocale] = useState('en');
    const editorRef = useRef(null)
    const containerRef = useRef(null)

    const getDisplayContent = () => {
        return content
    }

    useEffect(() => {
        const initializeEditor = async () => {
            await TipTapIsland.i18n.init({
                locale: 'en',
                localeFiles: {
                    cs: '/locales/cs.json'
                }
            });
            
            if (containerRef.current && !editorRef.current) {
                editorRef.current = TipTapIsland.create(editorId, {
                    content: initialContent,
                    onUpdate: setContent,
                    theme: theme,
                });
            }
        };

        initializeEditor();

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, [editorId, initialContent]);

    useEffect(() => {
        if (editorRef.current) {
            TipTapIsland.i18n.setLocale(locale);
            TipTapIsland.setTheme(editorId, theme);
        }
    }, [locale, theme]);

    return (
        <div className="app-container">
            <h1>TipTap Editor Test</h1>
            
            <div className="controls">
                <div className="theme-switcher">
                    <label htmlFor="theme-select">Theme:</label>
                    <select id="theme-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>

                <div className="locale-switcher">
                    <label htmlFor="locale-select">Locale:</label>
                    <select id="locale-select" value={locale} onChange={(e) => setLocale(e.target.value)}>
                        <option value="en">English</option>
                        <option value="cs">Czech</option>
                    </select>
                </div>
            </div>

            <div className="editor-container">
                <div id={editorId} ref={containerRef}></div>
            </div>

            <div className="content-preview">
                <h3>Current HTML Content:</h3>
                <pre>{getDisplayContent()}</pre>
            </div>
        </div>
    )
}

export default App
