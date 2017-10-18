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
    customItemContentLayout,
    currentAddress;

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
        '<div class="show-feeds__feeds-text"><div class="show-feeds__feeds-text-place">{{ properties.place }}</div>' +
        '<div class="show-feeds__feeds-text-address">{{ properties.address }}</div>' +
        '<div class="show-feeds__feeds-text-feed">{{ properties.feed }}</div></div>' +
        '<div class="show-feeds__feeds-text-date">{{ properties.date }}</div>', {

            build: function() {
                customItemContentLayout.superclass.build.call(this);
                currentAddress = document.getElementsByClassName('show-feeds__feeds-text-address')[0].textContent;
                document.getElementsByClassName('show-feeds__feeds-text-address')[0]
                    .addEventListener('click', this.onAddressClick);
            },

            clear: function() {
                document.getElementsByClassName('show-feeds__feeds-text-address')[0]
                    .removeEventListener('click', this.onAddressClick);
                customItemContentLayout.superclass.clear.call(this);
            },

            onAddressClick: function() {
                let dataPlacemark = myMap.balloon._balloon._data.cluster.properties._data.geoObjects;
                showWriteFeed(cX, cY, currentAddress);
                for (let i = 0; i < dataPlacemark.length; i++) {
                    if (currentAddress == dataPlacemark[i].properties._data.address) {
                        coords = dataPlacemark[i].properties._data.coords;
                        createFeedInWriteFeeds(dataPlacemark[i].properties._data.name, dataPlacemark[i].properties._data.place, dataPlacemark[i].properties._data.feed, dataPlacemark[i].properties._data.date);
                    }
                }
                myMap.balloon.close();
            }
        });

    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 200,
        clusterBalloonPagerSize: 10,
        clusterVisible: true
    });

    clusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: true
    });

    myMap.geoObjects.add(clusterer);
    clusterer.events.add('balloonopen', function(e) {
        hideWriteFeed();
    });

    clusterer.events.add('click', function(e) {
        cX = e.get('domEvent').get('pageX');
        cY = e.get('domEvent').get('pageY');
    });

    myMap.events.add('click', function(e) {
        if (myMap.balloon.isOpen()) {
            myMap.balloon.close();
        }
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
            feed: writeFeedsFeedText.value,
            date: createDate(),
            coords: coords
        });
        clusterer.add(myPlacemark);
        myPlacemark.events.add('click', function(e) {
            let dataPlacemark = e.originalEvent.target.properties._data;

            if (myMap.balloon.isOpen()) {
                myMap.balloon.close();
            }
            cX = e.get('domEvent').get('pageX');
            cY = e.get('domEvent').get('pageY');
            showWriteFeed(cX, cY, dataPlacemark.address);
            createFeedInWriteFeeds(dataPlacemark.name, dataPlacemark.place, dataPlacemark.feed, dataPlacemark.date);
        });
    }

    // =========== Form feed ==========
    function showWriteFeed(cX, cY, address) {
        writeFeed.getElementsByClassName('write-feeds__header-address')[0].textContent = address;
        writeFeedsList.innerHTML = '';
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

    function createFeedInWriteFeeds(name, place, feed, date) {
        if (name == '' ||
            place == '' ||
            feed == '') {

            return false;
        }

        let newLiElement = document.createElement('li');

        newLiElement.classList.add('write-feeds__main-feeds-item');
        newLiElement.innerHTML = '<div class="write-feeds__main-feeds-item-name-wrapper"><div class="write-feeds__main-feeds-item-name">' +
            name + '</div><div class="write-feeds__main-feeds-item-place">' +
            place + '   ' +
            date + '</div></div><div class="write-feeds__main-feeds-item-feed">' +
            feed + '</div>';

        writeFeedsNoFeed.style.display = 'none';
        writeFeedsList.appendChild(newLiElement);

        return true;
    }

    function createFeed() {
        if (createFeedInWriteFeeds(writeFeedsNameInput.value, writeFeedsPlaceInput.value, writeFeedsFeedText.value, createDate())) {
            showPlacemarkFeed(coords);
        }
        clearField(writeFeedsNameInput);
        clearField(writeFeedsPlaceInput);
        clearField(writeFeedsFeedText);
    }

    writeFeedsClosedButton.addEventListener('click', hideWriteFeed);

    writeFeedsSubmitButton.addEventListener('click', createFeed);

}