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
    render() {
        main_page.innerHTML = this.page;
    }
    other_functions() {} // другие функции
}

/**
class Main extends BasePage {
    page = 'hello'; // html код
    other_functions() {
        hide_navbar()
    }
}
 */

export {BasePage} //export {BasePage, Main}