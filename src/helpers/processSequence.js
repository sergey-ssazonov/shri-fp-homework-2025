import {
  allPass,
  andThen,
  length,
  pipe,
  prop,
  tap,
  test,
} from 'ramda';
import Api from '../tools/api';

const api = new Api();
const NUMBER_URL = 'https://api.tech/numbers/base';
const ANIMAL_URL = 'https://animals.tech';

// валидаторы
const isLengthBetween = str => str.length > 2 && str.length < 10;
const isPositive      = str => Number(str) > 0;
const isNumericDot    = test(/^[0-9]+(\.[0-9]+)?$/);
const isValidString   = allPass([isLengthBetween, isPositive, isNumericDot]);

// вспомогательные функции
const toRounded = pipe(parseFloat, Math.round);
const getBinary = num =>
  api.get(NUMBER_URL)({ from: 10, to: 2, number: String(num) })
     .then(prop('result'));
const getAnimalById = id =>
  api.get(`${ANIMAL_URL}/${id}`)({})
     .then(prop('result'));

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  if (!isValidString(value)) {
    return handleError('ValidationError');
  }

  return pipe(
    tap(writeLog),             // логируем исходную строку
    toRounded,                 // округляем
    tap(writeLog),             // логируем округлённое
    getBinary,                 // запрашиваем бинарную строку
    andThen(tap(writeLog)),    // логируем бинарную строку
    andThen(pipe(              // внутри andThen — вторая pipe-цепочка над уже полученным результатом
      length,                  // берём длину
      tap(writeLog),           // логируем длину
      x => Math.pow(x, 2),     // возводим в квадрат
      tap(writeLog),           // логируем квадрат
      x => x % 3,              // берём остаток от деления на 3
      tap(writeLog),           // логируем остаток
      getAnimalById            // запрашиваем животное
    )),
    andThen(handleSuccess)   
  )(value)
    .catch(handleError);       
};

export default processSequence;
