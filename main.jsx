import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.scss'

// Použijeme buď globální nebo importované verze
const ReactInstance = window.React || React
const ReactDOMInstance = window.ReactDOM || ReactDOM

ReactDOMInstance.createRoot(document.getElementById('root')).render(
  <ReactInstance.StrictMode>
    <App />
  </ReactInstance.StrictMode>
)