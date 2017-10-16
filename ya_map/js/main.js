// ==========
let feeds = document.getElementById('feeds');
let feedsClosedButton = document.getElementById('feeds-closed-button');
let feedsTextList = document.getElementById('show-feeds__feeds-text-list');
let feedsNumberList = document.getElementById('show-feeds__feeds-number-list');
let feedsArrowLeft = document.getElementById('feeds-arrow-left');
let feedsArrowRight = document.getElementById('feeds-arrow-right');

let sizeFeeds = {};

let currentPageFeeds,
    numberOfPageFeeds;

// ==========
let writeFeed = document.getElementById('write-feeds');
let writeFeedsClosedButton = document.getElementById('write-feeds__header-button');
let writeFeedsNoFeed = document.getElementById('write-feeds__main-feeds-no-feeds');
let writeFeedsList = document.getElementById('write-feeds__main-feeds-list');
let writeFeedsNameInput = document.getElementById('main-feed-form-name');
let writeFeedsPlaceInput = document.getElementById('main-feed-form-place');
let writeFeedsFeedText = document.getElementById('main-feed-form-textarea');
let writeFeedsSubmitButton = document.getElementById('main-feed-form-submit');

let sizeWriteFeed = {};

// ==========
let yaMap = document.getElementById('ya-map');
let cX,
    cY,
    coords,
    myPlacemark,
    customItemContentLayout;

let geoObject = {};

let sizeYaMap = {};
sizeYaMap.width = yaMap.getBoundingClientRect().width;
sizeYaMap.height = yaMap.getBoundingClientRect().height;

// =========== Yandex map ==========
ymaps.ready(init);
let myMap,
    clusterer;

function init() {
    myMap = new ymaps.Map("ya-map", {
        center: [59.936682, 30.311120],
        zoom: 11,
        controls: [],
    }, {
        searchControlProvider: 'yandex#search'
    });
    customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<div class="show-feeds__feeds-text"><div class="show-feeds__feeds-text-place">{{ properties.place }}</div>' +
        '<div class="show-feeds__feeds-text-address">{{ properties.address }}</div>' +
        '<div class="show-feeds__feeds-text-feed">{{ properties.feed }}</div></div>' +
        '<div class="show-feeds__feeds-text-date">' + createDate() + '</div>', {

            // build: function() {
            //     //     // Сначала вызываем метод build родительского класса.
            //     BalloonContentLayout.superclass.build.call(this);
            //     //     // А затем выполняем дополнительные действия.
            //     //     //$('#counter-button').bind('click', this.onCounterClick);
            // },

            // clear: function() {
            //     //     // Выполняем действия в обратном порядке - сначала снимаем слушателя,
            //     //     // а потом вызываем метод clear родительского класса.
            //     //     //$('#counter-button').unbind('click', this.onCounterClick);
            //     BalloonContentLayout.superclass.clear.call(this);
            // },

            // onCounterClick: function() {

            // }
        });
    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 200,
        clusterBalloonPagerSize: 10
    });
    clusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: true
    });
    myMap.geoObjects.add(clusterer);
    clusterer.events.add('balloonopen', function() {
        hideWriteFeed();
    });
    myMap.events.add('click', function(e) {
        coords = e.get('coords');
        cX = e.get('domEvent').get('pageX');
        cY = e.get('domEvent').get('pageY');
        getAndShowAddress(coords);
    });


    function getAndShowAddress(coords) {
        ymaps.geocode(coords).then(function(result) {
            geoObject = result.geoObjects.get(0);
            showWriteFeed(cX, cY, geoObject.getAddressLine());
        });
    }

    function showPlacemarkFeed(localCoords) {
        myPlacemark = new ymaps.Placemark(localCoords, {
            address: geoObject.getAddressLine(),
            name: writeFeedsNameInput.value,
            place: writeFeedsPlaceInput.value,
            feed: writeFeedsFeedText.value
        });
        clusterer.add(myPlacemark);
        myPlacemark.events.add('click', function(e) {
            cX = e.get('domEvent').get('pageX');
            cY = e.get('domEvent').get('pageY');
            let dataPlacemark = e.originalEvent.target.properties._data;
            showWriteFeed(cX, cY, dataPlacemark.address, dataPlacemark);
        });
    }

    // // =========== Feeds ==========
    // function showFeeds(elem) {
    //     createFeedsTextList();
    //     createFeedsNumberList();

    //     feeds.style.display = 'flex';
    //     sizeFeeds.width = parseInt(getComputedStyle(feeds).width);
    //     sizeFeeds.height = parseInt(getComputedStyle(feeds).height);
    //     feeds.style.left = (sizeYaMap.width > elem.clientX + sizeFeeds.width) ?
    //         elem.clientX + 'px' :
    //         elem.clientX - sizeFeeds.width + 'px';
    //     feeds.style.top = (sizeYaMap.height > elem.clientY + sizeFeeds.height) ?
    //         elem.clientY + 'px' :
    //         elem.clientY - sizeFeeds.height + 'px';

    //     currentPageFeeds = 0;
    //     numberOfPageFeeds = feedsTextList.children.length;
    // }

    // function hideFeeds() {
    //     feeds.style.display = 'none';
    //     currentPageFeeds = undefined;
    // }

    // function createFeedsTextList() {

    //     feedsTextList.firstElementChild.style.display = 'block';

    //     return true;
    // }

    // function createFeedsNumberList() {
    //     let newLiElement;

    //     feedsNumberList.innerHTML = '';
    //     for (let i = 0; i < feedsTextList.children.length; i++) {
    //         newLiElement = document.createElement('li');

    //         newLiElement.classList.add('show-feeds__feeds-number-item');
    //         newLiElement.textContent = i + 1;
    //         feedsNumberList.appendChild(newLiElement);
    //     }
    //     feedsNumberList.firstElementChild.classList.add('show-feeds__feeds-number-item--show');

    //     return true;
    // }

    // function showChooseFeed(numberPage) {
    //     feedsTextList.children[numberPage].style.display = 'block';
    //     feedsNumberList.children[numberPage].classList.add('show-feeds__feeds-number-item--show');
    // }

    // function hideCurrentFeed(numberPage) {
    //     feedsTextList.children[numberPage].style.display = 'none';
    //     feedsNumberList.children[numberPage].classList.remove('show-feeds__feeds-number-item--show');
    // }

    // function scrollFeedsLeft() {
    //     if (currentPageFeeds - 1 >= 0) {
    //         hideCurrentFeed(currentPageFeeds);
    //         currentPageFeeds -= 1;
    //         showChooseFeed(currentPageFeeds);
    //     }
    // }

    // function scrollFeedsRight() {
    //     if (currentPageFeeds + 1 < numberOfPageFeeds) {
    //         hideCurrentFeed(currentPageFeeds);
    //         currentPageFeeds += 1;
    //         showChooseFeed(currentPageFeeds);
    //     }
    // }

    // function scrollFeeds(showElem) {
    //     hideCurrentFeed(currentPageFeeds);
    //     currentPageFeeds = showElem;
    //     showChooseFeed(currentPageFeeds);
    // }

    // feedsClosedButton.addEventListener('click', hideFeeds);
    // feedsArrowLeft.addEventListener('click', scrollFeedsLeft);
    // feedsArrowRight.addEventListener('click', scrollFeedsRight);
    // feedsNumberList.addEventListener('click', function(elem) {
    //     let targetElement = elem.target;

    //     if (targetElement.classList == 'show-feeds__feeds-number-item') {
    //         for (let i = 0; i < feedsNumberList.children.length; i++) {
    //             targetElement = targetElement.previousElementSibling;
    //             if (targetElement == undefined) {
    //                 scrollFeeds(i);
    //                 break;
    //             }
    //         }
    //     }
    // });

    // =========== Write feed ==========
    function showWriteFeed(cX, cY, address, arryaFeeds = undefined) {
        writeFeed.getElementsByClassName('write-feeds__header-address')[0].textContent = address;
        writeFeedsList.innerHTML = '';
        if (arryaFeeds != undefined &&
            arryaFeeds.hasOwnProperty('name') &&
            arryaFeeds.hasOwnProperty('place') &&
            arryaFeeds.hasOwnProperty('feed')) {
            createFeedInWriteFeeds(arryaFeeds.name, arryaFeeds.place, arryaFeeds.feed);
        }
        writeFeed.style.display = 'flex';
        sizeWriteFeed.width = parseInt(getComputedStyle(writeFeed).width);
        sizeWriteFeed.height = parseInt(getComputedStyle(writeFeed).height);
        writeFeed.style.left = (sizeYaMap.width > cX + sizeWriteFeed.width) ?
            cX + 10 + 'px' :
            cX - 10 - sizeWriteFeed.width + 'px';
        writeFeed.style.top = (sizeYaMap.height > cY + sizeWriteFeed.height) ?
            cY + 'px' :
            sizeYaMap.height - sizeWriteFeed.height - 5 + 'px';
    }

    function hideWriteFeed() {
        writeFeed.style.display = 'none';

        return true;
    }

    function clearField(elem) {
        return elem.value = '';
    }

    function createDate() {
        let result = new Date,
            currentDay;


        return result.getFullYear() + '.' +
            ((result.getUTCMonth() < 10) ? '0' + result.getUTCMonth() : result.getUTCMonth()) + '.' +
            ((result.getUTCDate() < 10) ? '0' + result.getUTCDate() : result.getUTCDate()) + ' ' +
            ((result.getHours() < 10) ? '0' + result.getHours() : result.getHours()) + ':' +
            ((result.getMinutes() < 10) ? '0' + result.getMinutes() : result.getMinutes()) + ':' +
            ((result.getSeconds() < 10) ? '0' + result.getSeconds() : result.getSeconds());
    }

    function createFeedInWriteFeeds(name, place, feed) {
        if (name == '' ||
            place == '' ||
            feed == '') {
            alert('Заполните все поля ввода');

            return false;
        }

        let newLiElement = document.createElement('li');

        newLiElement.classList.add('write-feeds__main-feeds-item');
        newLiElement.innerHTML = '<div class="write-feeds__main-feeds-item-name-wrapper"><div class="write-feeds__main-feeds-item-name">' +
            name + '</div><div class="write-feeds__main-feeds-item-place">' +
            place + '   ' +
            createDate() + '</div></div><div class="write-feeds__main-feeds-item-feed">' +
            feed + '</div>';

        writeFeedsNoFeed.style.display = 'none';
        writeFeedsList.appendChild(newLiElement);

        return true;
    }

    function createFeed() {
        createFeedInWriteFeeds(writeFeedsNameInput.value, writeFeedsPlaceInput.value, writeFeedsFeedText.value);
        showPlacemarkFeed(coords);
        clearField(writeFeedsNameInput);
        clearField(writeFeedsPlaceInput);
        clearField(writeFeedsFeedText);
    }

    writeFeedsClosedButton.addEventListener('click', hideWriteFeed);

    writeFeedsSubmitButton.addEventListener('click', createFeed);

}