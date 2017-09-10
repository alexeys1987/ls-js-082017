/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    let newArray = [];

    for (let i = 0; i < array.length; i++) {
        newArray[i] = fn(array[i], i, array);
    }

    return newArray;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    let previousResult,
        currentResult;

    if (initial === undefined) {
        previousResult = array[0];
    } else {
        previousResult = fn(initial, array[0], 0, array);
    }
    for (let i = 1; i < array.length; i++) {
        currentResult = fn(previousResult, array[i], i, array);
        previousResult = currentResult;
    }
    return currentResult;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    for (let propObj in obj) {
        if (propObj === prop) {
            delete obj[propObj];
        }
    }
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    return (obj.hasOwnProperty(prop)) ? true : false;
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */

function getEnumProps(obj) {
    let arrayProp = [],
        i = 0;

    for (let propObj in obj) {
        arrayProp[i] = propObj;
        i++;
    }

    return arrayProp;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    let arrayProp = [],
        i = 0;

    for (let propObj in obj) {
        arrayProp[i] = propObj.toUpperCase();
        i++;
    }

    return arrayProp;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from = 0, to = array.length) {
    let newArray = [],
        j = 0;

    if (from >= array.length ||
        -array.length > to) {
        return newArray;
    }

    from = from < -array.length ? -array.length : from;
    to = to > array.length ? array.length : to;

    for (let i = ((from >= 0) ? from : (array.length + from)); i < ((to >= 0) ? to : (array.length + to)); i++) {
        newArray[j] = array[i];
        j++
    }

    return newArray;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    let proxyObj = new Proxy(obj, {
        set(targetObj, propObj, valProp) {
            targetObj[propObj] = valProp * valProp;

            return true;
        }
    });

    return proxyObj;
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};