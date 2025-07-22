import TipTapWrapper from './tipTapWrapper.jsx'
import './styles.scss'
import i18n from './i18n.js';

const TipTapIsland = {
    _instances: new Map(),

    create: function (elementId, options) {

        const element = document.getElementById(elementId)
        if (!element) return null

        this.destroy(elementId)

        const wrapper = new TipTapWrapper(element, options)
        wrapper.mount()

        this._instances.set(elementId, wrapper)

        return wrapper
    },
    destroy: function (elementId) {
        const wrapper = this.getInstance()
        if (wrapper) {
            try {
                wrapper.destroy()
            } catch (e) {
                console.warn(`Error destroying editor ${elementId}:`, e)
            }
            this._instances.delete(elementId)
            return true
        }
        return false
    },
    getInstance: function (elementId) {
        return this._instances.get(elementId)
    },
    setTheme: function (elementId, theme) {
        const wrapper = this.getInstance(elementId);
        if (wrapper) {
            wrapper.setTheme(theme);
            return true;
        }
        return false;
    },
    i18n: {
        init: i18n.init,
        setLocale: i18n.setLocale,
        t: i18n.t,
    },
}

window.TipTapIsland = TipTapIsland
export default TipTapIsland
