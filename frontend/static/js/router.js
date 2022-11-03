import * as pages from './pages.js'

let routers = {
  '#base': pages.BasePage,
  '#registration': pages.RegistrationPage,
  '#profile': pages.ProfilePage,
  '#login': pages.LoginPage,
}

function hash_change() {
    let hash = document.location.hash
    let object = new routers[hash]()
    object.get_information()
    object.render()
    object.other_functions()
}

hash_change() /* 
вызывается при первом заходе пользователя на страницу. 
требуется для перенаправления пользователей

**/

window.addEventListener('hashchange', hash_change)


