import * as pages from './pages.js'

let routers = {
    '#base': pages.BasePage,
  //'#main': pages.Main,
}

window.addEventListener('hashchange', () => {
    let hash = document.location.hash
    let object = new routers[hash]()
    object.render()
    object.other_functions()
})


