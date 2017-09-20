/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя 
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function(event) {
    if (!filterNameInput.value) {
        listTable.innerHTML = '';
        for (let i = 0; i < document.cookie.split('; ').length; i++) {
            let newRow = document.createElement('tr');

            newRow.innerHTML = '<td>' +
                document.cookie.split('; ')[i].split('=')[0] +
                '</td><td>' +
                document.cookie.split('; ')[i].split('=')[1] +
                '</td><td><input type="button" class="remove-button" value="Удалить"></td>';
            listTable.appendChild(newRow);
        }
    } else if (event.key == 'Backspace' || event.key == 'Delete') {
        for (let i = 0; i < document.cookie.split('; ').length; i++) {
            let showCurrentCookie = false;

            if (document.cookie.split('; ')[i].split('=')[0].indexOf(filterNameInput.value) >= 0) {
                for (let j = 0; j < listTable.children.length; j++) {
                    if (document.cookie.split('; ')[i].split('=')[0] == listTable.children[j].children[0].textContent) {
                        showCurrentCookie = true;
                        break;
                    }
                }
                if (!showCurrentCookie) {
                    let newRow = document.createElement('tr');

                    newRow.innerHTML = '<td>' +
                        document.cookie.split('; ')[i].split('=')[0] +
                        '</td><td>' +
                        document.cookie.split('; ')[i].split('=')[1] +
                        '</td><td><input type="button" class="remove-button" value="Удалить"></td>';
                    listTable.appendChild(newRow);
                }

            }
        }
    } else {
        for (let i = 0; i < listTable.children.length; i++) {
            if (listTable.children[i].children[0].textContent.indexOf(filterNameInput.value) == '-1') {
                listTable.removeChild(listTable.children[i]);
                i--;
            }
        }
    }
});

addButton.addEventListener('click', () => {
    let showCurrentCookie = false;

    for (let i = 0; i < listTable.children.length; i++) {
        if (listTable.children[i].children[0].textContent == addNameInput.value) {
            listTable.children[i].children[1].textContent = addValueInput.value;
            showCurrentCookie = true;
            break;
        }
    }
    if (!showCurrentCookie && addNameInput.value.indexOf(filterNameInput.value) >= 0) {
        let newRow = document.createElement('tr');

        newRow.innerHTML = '<td>' +
            addNameInput.value +
            '</td><td>' +
            addValueInput.value +
            '</td><td><input type="button" class="remove-button" value="Удалить"></td>';
        listTable.appendChild(newRow);
    }
    document.cookie = addNameInput.value + '=' + addValueInput.value;
    addNameInput.value = '';
    addValueInput.value = '';
});

listTable.addEventListener('click', (event) => {
    let currentEventTarget = event.target.parentNode;

    if (event.target.tagName == 'INPUT') {
        currentEventTarget.parentNode.classList.add('removeElem');
        document.cookie = currentEventTarget.previousElementSibling.previousElementSibling.textContent +
            '=; expires=' + new Date(-1).toUTCString();
        currentEventTarget = listTable.getElementsByClassName('removeElem')[0];
        listTable.removeChild(currentEventTarget);
    }
});