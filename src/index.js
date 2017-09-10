/* ДЗ 2 - работа с исключениями и отладчиком */

/*
 Задача 1:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true только если fn вернула true для всех элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isAllTrue(array, fn) {
    try {
        let funcValue;

        if (!Array.isArray(array) || array.length === 0) {
            throw new SyntaxError('empty array');
        }
        if (typeof(fn) != 'function') {
            throw new SyntaxError('fn is not a function');
        }

        for (let i = 0; i < array.length; i++) {
            funcValue = fn(array[i]); // тест проходит но условие не верно
        }

        return funcValue ? true : false;
    } catch (error) {
        throw error;
    }
}

/*
 Задача 2:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true если fn вернула true хотя бы для одного из элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isSomeTrue(array, fn) {
    try {
        let funcValue = false;

        if (!Array.isArray(array) || array.length === 0) {
            throw new SyntaxError('empty array');
        }
        if (typeof(fn) != 'function') {
            throw new SyntaxError('fn is not a function');
        }

        for (let i = 0; i < array.length; i++) {
            funcValue = fn(array[i]);
            if (funcValue) {
                return true;
            }
        }

        return false;
    } catch (error) {
        throw error;
    }
}

/*
 Задача 3:
 Функция принимает заранее неизветсное количество аргументов, первым из которых является функция fn
 Функция должна поочередно запусти fn для каждого переданного аргумента (кроме самой fn)
 Функция должна вернуть массив аргументов, для которых fn выбросила исключение
 Необходимо выбрасывать исключение в случаях:
 - fn не является функцией (с текстом "fn is not a function")
 */
function returnBadArguments(fn) {
    try {
        let array = [];
        let arrayIndex = 0;

        if (typeof(fn) != 'function') {
            throw new SyntaxError('fn is not a function');
        }

        for (let i = 1; i < arguments.length; i++) {
            try {
                fn(arguments[i]);
            } catch (error) {
                array[arrayIndex] = arguments[i];
                arrayIndex++;
            }
        }

        return array;
    } catch (error) {
        throw error;
    }
}

/*
 Задача 4:
 Функция имеет параметр number (по умолчанию - 0)
 Функция должна вернуть объект, у которого должно быть несколько методов:
 - sum - складывает number с переданными аргументами
 - dif - вычитает из number переданные аргументы
 - div - делит number на первый аргумент. Результат делится на следующий аргумент (если передан) и так далее
 - mul - умножает number на первый аргумент. Результат умножается на следующий аргумент (если передан) и так далее

 Количество передаваемых в методы аргументов заранее неизвестно
 Необходимо выбрасывать исключение в случаях:
 - number не является числом (с текстом "number is not a number")
 - какой-либо из аргументов div является нулем (с текстом "division by 0")
 */
function calculator(number = 0) {
    try {
        if (typeof(number) != 'number') {
            throw new SyntaxError('number is not a number');
        }
        let calc = {
            sum: function() {
                for (let i = 0; i < arguments.length; i++) {
                    number = number + arguments[i];
                }

                return number;
            },
            dif: function() {
                for (let i = 0; i < arguments.length; i++) {
                    number = number - arguments[i];
                }

                return number;
            },
            div: function() {
                try {
                    for (let i = 0; i < arguments.length; i++) {
                        if (arguments[i] === 0) {
                            throw new SyntaxError('division by 0');
                        }
                        number = number / arguments[i];
                    }

                    return number;
                } catch (error) {
                    throw error;
                }
            },
            mul: function() {
                for (let i = 0; i < arguments.length; i++) {
                    number = number * arguments[i];
                }

                return number;
            },
        };

        return calc;

    } catch (error) {
        throw error;
    }
}

export {
    isAllTrue,
    isSomeTrue,
    returnBadArguments,
    calculator
};