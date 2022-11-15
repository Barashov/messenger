let main_page = document.querySelector('.main_page');
let navbar = document.querySelector('.navbar');
let TOKEN = null;
function show_navbar() {
    // показ панели навигации
    navbar.style.visibility = 'visible';
}

function hide_navbar() {
    // спрятать панель навигации
    navbar.style.visibility = 'hidden';
}

class BasePage {
    page = `<h1>page render() function not found</h1>`;
    get_information() { } // функция для получения информации до отображения страницы
    render() {
        main_page.innerHTML = this.page;
    }
    other_functions() { } // другие функции
}

export class StartPage extends BasePage {
    page = `
    
    `
    other_functions() {
        hide_navbar()
    }
}

// страница регистрации
class RegistrationPage extends BasePage {
    page = `
    <div class="main-div">
        <div class="text-center">
            <img src="static/icons/logo.png" alt="" class="logo">
        </div>
        <h4 class="text-center">Регистрация</h4>
        <div class="input-div">
            <input type="text" id="username" class="text-input" placeholder="ваше имя">
            <h6 id="user_error" class="error"></h6>
        </div>
        <div class="input-div">
            <input type="password" id="psw_1" class="text-input" placeholder="пароль">
            <h6 id="psw_error" class="error"></h6>
        </div>
        <div class="input-div">
            <input type="password" id="psw_2" class="text-input" placeholder="повторите пароль">
            <h6 id="error" class="error"></h6>
        </div>
        <div class="text-center mt-2">
            <button id="submit" class="but">Зарегестрироваться</button>
        </div>
    </div>
    `
    other_functions() {
        let username = document.getElementById('username')
        let psw_1 = document.getElementById('psw_1')
        let psw_2 = document.getElementById('psw_2')

        let username_error = document.getElementById('user_error') // вывод ошибок имени пользователя
        let psw_2_error = document.getElementById('error') // ошибки схожести паролей
        let psw_error = document.getElementById('psw_error') // ошибки пароля

        let passwords_match = false // совпадение паролей. true если пароли совпадают
        let password_is_valid = false // пароль прошел валидацию
        let username_is_valid = false // имя пользователя прошло валидацию


        function password_validation() {  // валидация пароля
            if (psw_1.value.length < 6) {
                psw_error.textContent = 'пароль меньше 5 символов'
                psw_1.style.borderColor = '#FC72A4'
                password_is_valid = false
            }
            else {
                psw_error.textContent = ''
                psw_1.style.borderColor = '#2D2A38'
                password_is_valid = true
            }
        }
        function password_matching_check() { // проверка на совпадение пароля
            if (psw_1.value != psw_2.value) {
                psw_2_error.textContent = 'пароли не совпадают';
                psw_2.style.borderColor = '#FC72A4'
                passwords_match = false
            }
            else {
                error.textContent = ''
                psw_2.style.borderColor = '#2D2A38'
                passwords_match = true
            }
        }

        function username_validation() { // проверка имени пользователя
            let request = new XMLHttpRequest()
            request.open('GET', `api/v1/users/username-taken/${username.value}/`, true)
            request.send()
            console.log()
            request.onreadystatechange = () => {
                if (request.responseText) {
                    let json_data = JSON.parse(request.responseText)
                    if (json_data.is_username_taken == true) {
                        username_is_valid = false
                        username.style.borderColor = '#FC72A4'
                        username_error.textContent = 'имя занято'
                    }
                    else {
                        username_is_valid = true
                        username.style.borderColor = '#2D2A38'
                        username_error.textContent = ''
                    }
                }
            }
        }
        username.onchange = username_validation
        psw_1.addEventListener('input', () => {
            password_matching_check()
            password_validation()
        })
        psw_2.oninput = password_matching_check

        let button = document.getElementById('submit')
        button.onclick = () => {
            if (password_is_valid == true && passwords_match == true && username_is_valid == true) {
                let url = '/api/v1/auth/users/'
                let json_data = JSON.stringify({ 'username': username.value, 'password': psw_1.value })
                let request = new XMLHttpRequest
                request.open('POST', url, true)
                request.setRequestHeader('Content-type', 'application/json', 'charset=UTF-8')
                request.send(json_data)
                request.onload = () => {
                    let request = new XMLHttpRequest()
                    let json_data = JSON.stringify({
                        'username': username.value,
                        'password': psw_1.value
                    })
                    request.open('POST', 'auth/token/login', true)
                    request.setRequestHeader('Content-type', 'application/json', 'charset=UTF-8')
                    request.send(json_data)
                    request.onload = () => {
                        if (request.status == 400) {
                            console.log('неправильный логин или пароль')
                        }
                        else if (request.status == 200) {
                            let json_token = JSON.parse(request.responseText)
                            TOKEN = json_token.auth_token
                            location.hash = '#profile'
                            show_navbar()
                        }
                    }
                }
            }
        }
        hide_navbar()
    }
}

// страница профиля
class ProfilePage extends BasePage {

    render() {
        let url = 'api/v1/users/profile/'
        let request = new XMLHttpRequest
        request.open('GET', url, true)
        request.setRequestHeader('Authorization', `Token ${TOKEN}`)
        request.send()
        request.onload = (event) => {
            let json_data = JSON.parse(request.responseText) // данные профиля
            main_page.innerHTML = `username: ${json_data.username}
                                    <br>
                                   <img src="${json_data.photo}" alt="Italian Trulli">`
        }
    }
    other_functions() {
        main_page.innerHTML = 'загрузка'
    }
}

// страница входа 
class LoginPage extends BasePage {
    page = `<input type='text' id='username' maxlength="20">
            <br>
            <input type='password' id='psw'>
            <br>
            <button id='btn'>Войти</button>`
    other_functions() {
        hide_navbar()
        let username = document.getElementById('username')
        let password = document.getElementById('psw')
        let button = document.getElementById('btn')
        button.onclick = () => {
            let request = new XMLHttpRequest()
            let json_data = JSON.stringify({
                'username': username.value,
                'password': password.value
            })
            request.open('POST', 'auth/token/login', true)
            request.setRequestHeader('Content-type', 'application/json', 'charset=UTF-8')
            request.send(json_data)
            request.onload = () => {
                if (request.status == 400) {
                    console.log('неправильный логин или пароль')
                }
                else if (request.status == 200) {
                    let json_token = JSON.parse(request.responseText)
                    TOKEN = json_token.auth_token
                    location.hash = '#profile'
                    show_navbar()
                }
            }
        }
    }
}

// страница создания чата
export class ChatCreatePage extends BasePage {
    page = `<a href='#chats'>назад</a>
            <input type='text' id='name'>
            <br>
            <textarea id='description'></textarea>
            <br>
            <input type='file' id='photo'>
            <br>
            <button id='button'>создать</button>
            <h6 id='error'></h6>`
    other_functions() {
        hide_navbar()
        let name = document.getElementById('name')
        let description = document.getElementById('description')
        let photo = document.getElementById('photo')
        let button = document.getElementById('button')
        let error = document.getElementById('error')
        button.onclick = () => {
            if (name.value == '') {
                error.textContent = 'название - обязательно поле'
            }
            else {
                let data = new FormData()
                data.append('name', name.value)
                if (photo.files[0] != undefined) {
                    data.append('photo', photo.files[0])
                }
                if (description.value != '') {
                    data.append('description', description.value)
                }
                let request = new XMLHttpRequest()
                let url = '/api/v1/chats/chats/'
                request.open('POST', url, true)
                request.setRequestHeader('Authorization', `Token ${TOKEN}`)
                try {
                    request.send(data)
                    request.onload = () => {
                        console.log(request.status)
                    }
                }
                catch (error) {
                    request.onerror = (err) => {
                        console.log(err)
                    }
                }
            }
            main_page.innerHTML = 'загрузка'
        }
    }
}

// страница для посмотров чатов
export class ChatsPage extends BasePage {
    page = `<a href='#chat_create'>создать чат</a>
            <hr>
            <div id='chats'></div>`
    other_functions() {
        show_navbar()
        let chats = document.getElementById('chats')

        // request
        let request = new XMLHttpRequest()
        let url = '/api/v1/chats/chats/'
        request.open('GET', url, true)
        request.setRequestHeader('Authorization', `Token ${TOKEN}`)
        try {
            request.send()
            request.onload = () => {
                let chats_json = JSON.parse(request.responseText)
                for (let chat of chats_json) {
                    let chat_element = document.createElement('div')
                    chat_element.innerHTML = `<h4>${chat.name}</h4>`
                    chats.append(chat_element)
                    chat_element.addEventListener('click', () => {
                    
                        open_chat(chat.id)
                        
                    })

                }
            }
        }
        catch (err) {
            request.onerror = (error) => {
                console.log(error)
            }
        }
    }
}


function open_chat(chat_id) {  
    hide_navbar()
    main_page.innerHTML = `<div id='messages'>hello</div>
                           <div class='navbar'>
                           <input type='text' id='message'>
                           <button id='button'>отправить</button>
                           </div>`         
                           
    let message_text = document.getElementById('message')
    let button = document.getElementById('button')
    var socket
    try {
        socket = new WebSocket(`ws://${location.host}/chat/${chat.id}/`)
        socket.send(JSON.stringify({
            'token': TOKEN,
            'message': 'пользователь присоединился к чату'
        }))
        console.log('ok')
    }
    catch (error) {
        let request = new XMLHttpRequest()
        let data = JSON.stringify({
            'chat': chat_id,
            'token': TOKEN
        })
        request.open('POST', 'api/v1/chats/connect-to-chat/', true)
        request.setRequestHeader('Authorization', `Token ${TOKEN}`)
        request.setRequestHeader('Content-type', 'application/json', 'charset=UTF-8')
        request.send(data)
        request.onload = () => {
            console.log(request.status)
            if (request.status == 200) {
                socket = new WebSocket(`ws://${location.host}/chat/${chat_id}/`)
                socket.onmessage = (event) => {
                    console.log(event.data)
                }
            }
        }
    }
    button.onclick = () => {
        let json_data = JSON.stringify({
            'token': TOKEN,
            'message': message_text.value
        })
        socket.send(json_data)
    }
    

}

export { BasePage, RegistrationPage, ProfilePage, LoginPage }