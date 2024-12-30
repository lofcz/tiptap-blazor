import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import './styles.scss'

const ReactInstance = window.React || React
const ReactDOMInstance = window.ReactDOM || ReactDOM

ReactDOMInstance.createRoot(document.getElementById('root')).render(
    <ReactInstance.StrictMode>
        <App
            editorId="custom-editor"
        />
    </ReactInstance.StrictMode>
)
