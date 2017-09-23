/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    filterBlock.style.display = 'none';
    errorBlock.style.display = 'none';
    loadingBlock.style.display = 'block';
    clearElementsInContainer(filterResult);

    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.responseType = 'json';
        xhr.addEventListener('load', function() {
            if (Array.isArray(xhr.response)) {
                resolve(xhr.response.sort(function(a, b) {
                    if (a.name > b.name) {
                        return 1
                    }
                    if (a.name < b.name) {
                        return -1
                    }
                }));
            } else {
                reject(xhr.status);
            }
        });
        xhr.addEventListener('error' || 'abort' || 'timeout', function() {
            reject();
        });
        xhr.send();
    });
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    return (new RegExp(chunk, 'i')).test(full) ? true : false;
}

function createElementTagInContainer(container, elementTag, innerText = '') {
    let element = document.createElement(elementTag);
    element.textContent = innerText;
    return container.appendChild(element);
}

function createFilterListInContainer(container, elementTag, innerArry = [], filterText = '') {
    if (filterText == '') {
        for (let i = 0; i < innerArry.length; i++) {
            createElementTagInContainer(container, 'li', innerArry[i]);
        }

        return 1;
    }
    for (let i = 0; i < innerArry.length; i++) {
        if ((new RegExp(filterText, 'i')).test(innerArry[i])) {
            createElementTagInContainer(container, 'li', innerArry[i]);
        }
    }

    return 2;
}

function clearElementsInContainer(container) {
    return container.innerHTML = '';
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let errorBlock = homeworkContainer.querySelector('#error-block');
let errorButton = homeworkContainer.querySelector('#error-block-button');
let townsPromise = [];

errorButton.addEventListener('click', function() {
    loadTowns()
        .then(
            resolve => {
                loadingBlock.style.display = 'none';
                filterBlock.style.display = 'block';

                for (let i = 0; i < resolve.length; i++) {
                    townsPromise[i] = resolve[i].name;
                }

                createFilterListInContainer(filterResult, 'li', townsPromise, filterInput.value);
            },
            reject => {
                loadingBlock.style.display = 'none';
                errorBlock.style.display = 'block';
                if (reject >= 404) {
                    alert('Файл не найден');
                } else {
                    alert('Не удалось загрузить города');
                }
            }
        );
});

filterInput.addEventListener('keyup', function() {
    clearElementsInContainer(filterResult);
    createFilterListInContainer(filterResult, 'li', townsPromise, filterInput.value);

    return 1;
});

loadTowns()
    .then(
        resolve => {
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';

            for (let i = 0; i < resolve.length; i++) {
                townsPromise[i] = resolve[i].name;
            }

            createFilterListInContainer(filterResult, 'li', townsPromise, filterInput.value);
        },
        reject => {
            loadingBlock.style.display = 'none';
            errorBlock.style.display = 'block';

            if (reject >= 404) {
                alert('Файл не найден');
            } else {
                alert('Не удалось загрузить города');
            }
        });

export {
    loadTowns,
    isMatching
};