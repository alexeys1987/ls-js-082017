let wrapperFilterFrends = document.getElementById('wrapper-filter-frends');
let scrollArrayElements = document.querySelectorAll('.filter-frends__scroll');
let listFrendsWrapperArrayElements = document.querySelectorAll('.filter-frends__main-wrapper-list-frends');
let listFrendsArrayElements = document.querySelectorAll('.filter-frends__list');
let vkFrendsListElement = document.getElementById('vk-frends-list');
let myFrendsListElement = document.getElementById('my-frends-list');
let vkFrendsSearchElement = document.getElementById('vk-frends-search');
let myFrendsSearchElement = document.getElementById('my-frends-search');
let filterFrendsSaveButton = document.getElementById('filter-frends-save-button');
let itemArray = [];

let vkFrendsListRegion = {},
    myFrendsListRegion = {};

vkFrendsListRegion.minX = listFrendsWrapperArrayElements[0].getBoundingClientRect().x;
vkFrendsListRegion.maxX = listFrendsWrapperArrayElements[0].getBoundingClientRect().x + listFrendsWrapperArrayElements[0].getBoundingClientRect().width;
vkFrendsListRegion.minY = listFrendsWrapperArrayElements[0].getBoundingClientRect().y;
vkFrendsListRegion.maxY = listFrendsWrapperArrayElements[0].getBoundingClientRect().y + listFrendsWrapperArrayElements[0].getBoundingClientRect().height;
myFrendsListRegion.minX = listFrendsWrapperArrayElements[1].getBoundingClientRect().x;
myFrendsListRegion.maxX = listFrendsWrapperArrayElements[1].getBoundingClientRect().x + listFrendsWrapperArrayElements[1].getBoundingClientRect().width;
myFrendsListRegion.minY = listFrendsWrapperArrayElements[1].getBoundingClientRect().y;
myFrendsListRegion.maxY = listFrendsWrapperArrayElements[1].getBoundingClientRect().y + listFrendsWrapperArrayElements[1].getBoundingClientRect().height;

let heightListWrapperArray = [],
    heightListItemArray = [],
    heightScrollArray = [],
    positionList = [],
    listArray = [],
    initScrollSet = 0;

let dragDropElement,
    copyDragDropElement;

let coordinateXMoveElement,
    coordinateYMoveElement;

let storage = localStorage;

// ===================================================

if (loadList()) {
    clearElementsInContainer(vkFrendsListElement);
    createFilterListInContainer(vkFrendsListElement, listArray, vkFrendsSearchElement.value, 'vk')
    clearElementsInContainer(myFrendsListElement);
    createFilterListInContainer(myFrendsListElement, listArray, myFrendsSearchElement.value, 'my')
    initScroll();
} else {
    function apiVK(method, params) {
        return new Promise((resolve, reject) => {
            VK.api(method, params, data => {
                if (data.error) {
                    reject(new Error(data.error.error_msg));
                } else {
                    resolve(data.response);
                }
            });
        });
    }

    const promiseVK = new Promise((resolve, reject) => {
        VK.init({
            apiId: 6197038
        });

        VK.Auth.login(data => {
            if (data.session) {
                resolve(data);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 16);
    });

    promiseVK
        .then(() => {
            return apiVK('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100', order: 'name' })
        })
        .then(data => {
            for (let i = 0; i < data.items.length; i++) {
                showElement(vkFrendsListElement, data.items[i].first_name, data.items[i].last_name, data.items[i].photo_100);
                listArray[i] = {};
                listArray[i].first_name = data.items[i].first_name;
                listArray[i].last_name = data.items[i].last_name;
                listArray[i].photo_100 = data.items[i].photo_100;
                listArray[i].list = 'vk';
            }
            initScroll();
        })
        .catch(function(e) {
            alert('Ошибка: ' + e.message);
        });
}
// ===================================================

function showElement(container, firstName, lastName, sourceImg) {
    let liElement = document.createElement('li');

    liElement.classList.add('filter-frends__item');
    liElement.innerHTML = '<img src="' +
        sourceImg +
        '" alt="foto" class="filter-frends__img"><div class="filter-frends__item-name">' +
        firstName + ' ' + lastName +
        '</div><div class="filter-frends__button"></div>';
    container.appendChild(liElement);
}

// ===================================================

function showMoveElement(container) {
    copyDragDropElement = document.createElement('li');
    copyDragDropElement.innerHTML = container.innerHTML;
    copyDragDropElement.classList.add('filter-frends__item_move');
    copyDragDropElement.style.width = getComputedStyle(container).width;
    copyDragDropElement.style.height = getComputedStyle(container).height;
    copyDragDropElement.style.left = container.getBoundingClientRect().x + 'px';
    copyDragDropElement.style.top = container.getBoundingClientRect().y + 'px';
    wrapperFilterFrends.appendChild(copyDragDropElement);

    document.addEventListener('mousemove', moveElementHandler);

    return 1;
}

function hideMoveElement() {
    wrapperFilterFrends.removeChild(copyDragDropElement);
    document.removeEventListener('mousemove', moveElementHandler);

    return 1;
}

function moveElement(element, targetElement, nameElement, classElement) {
    let currentLi = element.parentNode,
        newLiElement = document.createElement(nameElement);

    currentLi.parentNode.removeChild(currentLi);
    newLiElement.classList.add(classElement);
    newLiElement.innerHTML = currentLi.innerHTML;
    targetElement.appendChild(newLiElement);

    for (let i = 0; i < listArray.length; i++) {
        if (currentLi.querySelector('.filter-frends__item-name').textContent == listArray[i].first_name + ' ' + listArray[i].last_name) {
            listArray[i].list = (targetElement.id == 'vk-frends-list') ? 'vk' : 'my';

            break;
        }
    }
    initScroll();

    return 1;
}

function moveElementHandler(e) {
    copyDragDropElement.style.transform = 'translate3d(' +
        (e.clientX - coordinateXMoveElement) + 'px,' +
        (e.clientY - coordinateYMoveElement) + 'px, 0px)';

    return true;
}

function initDragDrop() {
    for (let i = 0; i < listFrendsWrapperArrayElements.length; i++) {
        listFrendsWrapperArrayElements[i].addEventListener('mousedown', function(e) {
            e.preventDefault();
            coordinateXMoveElement = e.clientX;
            coordinateYMoveElement = e.clientY;
            if (e.target.classList.value.split(' ')[0] == 'filter-frends__item') {
                dragDropElement = e.target;
                showMoveElement(dragDropElement);

                return true;
            }
            if (e.target.classList.value.split(' ')[0] == 'filter-frends__img' ||
                e.target.classList.value.split(' ')[0] == 'filter-frends__item-name') {
                dragDropElement = e.target.parentElement;
                showMoveElement(dragDropElement);

                return true;
            }
            dragDropElement = undefined;

            return false;
        });
    }

    return -1;
}

document.addEventListener('mouseup', function(e) {
    if (dragDropElement == undefined) {
        document.removeEventListener('mousemove', moveElementHandler);

        return 2;
    }
    if (e.clientX > vkFrendsListRegion.minX &&
        e.clientX < vkFrendsListRegion.maxX &&
        e.clientY > vkFrendsListRegion.minY &&
        e.clientY < vkFrendsListRegion.maxY) {
        moveElement(dragDropElement.lastChild, vkFrendsListElement, 'li', 'filter-frends__item');
    }
    if (e.clientX > myFrendsListRegion.minX &&
        e.clientX < myFrendsListRegion.maxX &&
        e.clientY > myFrendsListRegion.minY &&
        e.clientY < myFrendsListRegion.maxY) {
        moveElement(dragDropElement.lastChild, myFrendsListElement, 'li', 'filter-frends__item');
    }

    hideMoveElement();
    dragDropElement = undefined;

    return 1;
});

function initButton() {
    for (let i = 0; i < listFrendsWrapperArrayElements.length; i++) {
        listFrendsWrapperArrayElements[i].addEventListener('click', function(e) {
            e.preventDefault();
            if (e.target.classList.value.split(' ')[0] == 'filter-frends__button') {
                if (e.target.parentElement.parentElement.id == 'vk-frends-list') {
                    moveElement(e.target, myFrendsListElement, 'li', 'filter-frends__item');

                    return 1;
                }
                if (e.target.parentElement.parentElement.id == 'my-frends-list') {
                    moveElement(e.target, vkFrendsListElement, 'li', 'filter-frends__item');

                    return 2;
                }
            }
        });
    }

    return -1;
}

function initScroll() {
    for (let i = 0; i < listFrendsWrapperArrayElements.length; i++) {
        heightListWrapperArray[i] = listFrendsWrapperArrayElements[i].clientHeight;

        itemArray[i] = listFrendsWrapperArrayElements[i].querySelectorAll('.filter-frends__item');
        heightListItemArray[i] = 0;
        for (let k = 0; k < itemArray[i].length; k++) {
            heightListItemArray[i] += itemArray[i][k].clientHeight;
        }


        if (heightListItemArray[i] > heightListWrapperArray[i]) {
            heightScrollArray[i] = heightListWrapperArray[i] * heightListWrapperArray[i] / heightListItemArray[i]
            scrollArrayElements[i].style.height = heightScrollArray[i] - 2 + 'px';
            scrollArrayElements[i].style.display = 'block';
        } else {
            heightScrollArray[i] = heightListWrapperArray[i];
            scrollArrayElements[i].style.display = 'none';
        }

        if (initScrollSet == 0) {
            listFrendsWrapperArrayElements[i].addEventListener('mouseenter', function() {
                scrollArrayElements[i].classList.remove('filter-frends__scroll--hidden');
            });
            listFrendsWrapperArrayElements[i].addEventListener('mouseleave', function() {
                scrollArrayElements[i].classList.add('filter-frends__scroll--hidden');
            });
            listFrendsWrapperArrayElements[i].addEventListener('mousewheel', function(e) {
                e.preventDefault();
                if (positionList[i] == undefined) {
                    positionList[i] = 0
                }
                if (e.deltaY > 10) {
                    positionList[i] -= 10;
                    if (positionList[i] < heightScrollArray[i] - heightListWrapperArray[i]) {
                        positionList[i] = heightScrollArray[i] - heightListWrapperArray[i];
                    }
                    listFrendsArrayElements[i].style.transform = 'translateY(' + (positionList[i] * heightListItemArray[i] / heightListWrapperArray[i]) + 'px)';
                    scrollArrayElements[i].style.transform = 'translateY(' + -positionList[i] + 'px)';
                }
                if (e.deltaY < 10) {
                    positionList[i] += 10;
                    if (positionList[i] > 0) {
                        positionList[i] = 0;
                    }
                    listFrendsArrayElements[i].style.transform = 'translateY(' + (positionList[i] * heightListItemArray[i] / heightListWrapperArray[i]) + 'px)';
                    scrollArrayElements[i].style.transform = 'translateY(' + -positionList[i] + 'px)';
                }
            });
        }
    }
    initScrollSet = 1;

    return 1;
}

// =======================================================

function clearElementsInContainer(container) {
    return container.innerHTML = '';
}

function createFilterListInContainer(container, innerArray = [], filterText = '', filterList) {
    if (filterText == '') {
        for (let i = 0; i < innerArray.length; i++) {
            if (innerArray[i].list == filterList) {
                showElement(container, innerArray[i].first_name, innerArray[i].last_name, innerArray[i].photo_100);
            }
        }

        return 1;
    }
    for (let i = 0; i < innerArray.length; i++) {
        if (innerArray[i].list == filterList &&
            (new RegExp(filterText, 'i')).test(innerArray[i].first_name + ' ' + innerArray[i].last_name)) {
            showElement(container, innerArray[i].first_name, innerArray[i].last_name, innerArray[i].photo_100);
        }
    }

    return 2;
}

vkFrendsSearchElement.addEventListener('keyup', function(e) {
    clearElementsInContainer(vkFrendsListElement);
    createFilterListInContainer(vkFrendsListElement, listArray, vkFrendsSearchElement.value, 'vk')
    let i = 0;

    positionList[i] = 0;
    listFrendsArrayElements[i].style.transform = 'translateY(' + (positionList[i] * heightListItemArray[i] / heightListWrapperArray[i]) + 'px)';
    scrollArrayElements[i].style.transform = 'translateY(' + -positionList[i] + 'px)';
    initScroll();

    return 1;
});

myFrendsSearchElement.addEventListener('keyup', function(e) {
    clearElementsInContainer(myFrendsListElement);
    createFilterListInContainer(myFrendsListElement, listArray, myFrendsSearchElement.value, 'my')
    let i = 1;

    positionList[i] = 0;
    listFrendsArrayElements[i].style.transform = 'translateY(' + (positionList[i] * heightListItemArray[i] / heightListWrapperArray[i]) + 'px)';
    scrollArrayElements[i].style.transform = 'translateY(' + -positionList[i] + 'px)';
    initScroll();

    return 1;
});

// =======================================================

function saveList() {
    for (let i = 0; i < listArray.length; i++) {
        listArray[i] = JSON.stringify(listArray[i]);
    }
    storage.saveList = listArray.join(';');
}

filterFrendsSaveButton.addEventListener('click', function() {
    saveList();

    return 1;
});

function loadList() {
    try {
        listArray = storage.saveList.split(';');
        for (let i = 0; i < listArray.length; i++) {
            listArray[i] = JSON.parse(listArray[i]);
        }

        return true;
    } catch (e) {

        return false;
    }
}

initButton();
initDragDrop();