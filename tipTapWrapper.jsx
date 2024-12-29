import React from 'react'
import ReactDOM from 'react-dom/client'
import TipTapEditor from './tipTapEditor'

const ROOT_SYMBOL = Symbol('TIPTAP_ROOT')

const ReactInstance = window.React || React
const ReactDOMInstance = window.ReactDOM || ReactDOM

class TipTapWrapper {
    constructor(element, options = {}) {
        this.element = element
        this.options = options
        this.isDestroying = false

        if (this.element[ROOT_SYMBOL]) {
            this.root = this.element[ROOT_SYMBOL]
        } else {
            if (!ReactDOMInstance || !ReactDOMInstance.createRoot) {
                throw new Error('ReactDOM.createRoot is not available')
            }
            this.root = ReactDOMInstance.createRoot(this.element)
            this.element[ROOT_SYMBOL] = this.root
        }
    }

    mount() {
        if (!this.isDestroying && this.root) {
            this.root.render(
                ReactInstance.createElement(TipTapEditor, {
                    content: this.options.content,
                    onUpdate: this.options.onUpdate
                })
            )
        }
    }

    destroy() {
        if (this.root && !this.isDestroying) {
            this.isDestroying = true

            const cleanup = () => {
                if (this.root) {
                    this.root.unmount()
                    delete this.element[ROOT_SYMBOL]
                    this.root = null
                    this.isDestroying = false
                }
            }

            this.root.render(null)
            requestAnimationFrame(cleanup)
        }
    }
}

export default TipTapWrapper
