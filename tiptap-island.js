import TipTapWrapper from './tipTapWrapper'
import './styles.scss'

const TipTapIsland = {
  create: function(elementId, options) {
    const element = document.getElementById(elementId)
    if (!element) return null
    
    const wrapper = new TipTapWrapper(element, options)
    wrapper.mount()
    return wrapper
  }
}

window.TipTapIsland = TipTapIsland
export default TipTapIsland
