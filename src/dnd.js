/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрощено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container'),
    addDivButton = homeworkContainer.querySelector('#addDiv');

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    let newElement = document.createElement('div'),
        newElementPosLeft = 0,
        newElementPosTop = 0;

    newElement.classList.add('draggable-div');
    newElementPosLeft = randomInteger(1, window.innerWidth);
    newElement.style.left = newElementPosLeft + 'px';
    newElementPosTop = randomInteger(1, window.innerHeight);
    newElement.style.top = newElementPosTop + 'px';
    newElement.style.width = randomInteger(1, window.innerWidth - newElementPosLeft) + 'px';
    newElement.style.height = randomInteger(1, window.innerHeight - newElementPosTop) + 'px';
    newElement.style.backgroundColor = 'rgb(' +
        randomInteger(0, 255) + ', ' +
        randomInteger(0, 255) + ', ' +
        randomInteger(0, 255) + ')';

    return newElement;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);

    rand = Math.round(rand);

    return rand;
}

function addListeners(target) {
    let currentX,
        currentY,
        zIndex;

    function moveElementHandler(e) {
        target.style.left = (e.clientX - currentX) + 'px';
        target.style.top = (e.clientY - currentY) + 'px';
    }

    target.addEventListener('mousedown', function(e) {
        zIndex = getComputedStyle(target).zIndex;
        target.style.zIndex = '1000';
        currentX = e.clientX - parseInt(getComputedStyle(target).left);
        currentY = e.clientY - parseInt(getComputedStyle(target).top);
        document.addEventListener('mousemove', moveElementHandler);
    });
    target.addEventListener('mouseup', function() {
        target.style.zIndex = zIndex;
        document.removeEventListener('mousemove', moveElementHandler);
    });
}

addDivButton.addEventListener('click', function() {
    let div = createDiv();

    homeworkContainer.appendChild(div);
    addListeners(div);
});

export {
    createDiv
};