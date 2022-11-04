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

// страница регистрации
class RegistrationPage extends BasePage {
    page = `<input name='username' type='text' id='username' maxlength="20">
            <h6 id='user_error'></h6>
            <input name='password' id='psw_1' type='text'>
            <h6 id='psw_error'></h6>
            <input type='text' id='psw_2'>
            <h6 id='error'></h6>
            <a href='#login'>уже есть аккаунт</a>
            <br>
            <button id='submit'>зарегестрироваться</button>`
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
                psw_error.textContent = 'пароль должен быть длиннее 5 символов'
                psw_1.style.borderColor = 'red'
                password_is_valid = false
            }
            else {
                psw_error.textContent = ''
                psw_1.style.borderColor = 'green'
                password_is_valid = true
            }
        }
        function password_matching_check() { // проверка на совпадение пароля
            if (psw_1.value != psw_2.value) {
                psw_2_error.textContent = 'пароли не совпадают';
                psw_2.style.borderColor = 'red'
                passwords_match = false
            }
            else {
                error.textContent = 'все хорошо'
                psw_2_error.style.borderColor = 'green'
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
                        username.style.borderColor = 'red'
                        username_error.textContent = 'имя занято'
                    }
                    else {
                        username_is_valid = true
                        username.style.borderColor = 'green'
                        username_error.textContent = 'все хорошо'
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

export { BasePage, RegistrationPage, ProfilePage, LoginPage }