let main_page = document.querySelector('.main_page');
let navbar = document.querySelector('.navbar');

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
    get_information() {} // функция для получения информации до отображения страницы
    render() {
        main_page.innerHTML = this.page;
    }
    other_functions() {} // другие функции
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
            request.open('GET', `/users/username-taken/${username.value}/`, true)
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
                let url = 'users/user/'
                let json_data = JSON.stringify({'username': username.value, 'password': psw_1.value})
                let request = new XMLHttpRequest
                request.open('POST', url, true)
                request.setRequestHeader('Content-type', 'application/json', 'charset=UTF-8')
                request.send(json_data)
                request.onreadystatechange = () => {
                    location.hash = '#profile'
                }
            }
        }
        hide_navbar()
    }
}

// страница профиля
class ProfilePage extends BasePage {
    
    render() {
        let url = 'users/profile/'
        let request = new XMLHttpRequest
        request.open('GET', url, true)
        request.send()
        request.onload = (event) => {
            let json_data = JSON.parse(request.responseText) // данные профиля
            console.log(json_data.friends[0].username)
            main_page.innerHTML = `username: ${json_data.username}
                                    <br>
                                   <img src="${json_data.photo}" alt="Italian Trulli">`      
        }
    }
    other_functions() {
        main_page.innerHTML = 'загрузка'
    }
}

export {BasePage, RegistrationPage, ProfilePage} //export {BasePage, Main}