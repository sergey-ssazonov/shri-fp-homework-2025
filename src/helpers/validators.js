/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  all,
  allPass,
  anyPass,
  complement,
  converge,
  equals,
  filter,
  groupBy,
  gte,
  identity,
  length,
  map,
  max,
  pipe,
  prop,
  propEq,
  propSatisfies,
  reduce,
  reject,
  values,
} from 'ramda';

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  propEq('star', 'red'),
  propEq('square', 'green'),
  propEq('triangle', 'white'),
  propEq('circle', 'white'),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(
  values,
  filter(equals('green')),
  length,
  (count) => gte(count, 2)
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = pipe(
  values,
  converge(equals, [
    pipe(filter(equals('red')), length),
    pipe(filter(equals('blue')), length),
  ])
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  propEq('circle', 'blue'),
  propEq('star', 'red'),
  propEq('square', 'orange'),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
  values,
  reject(equals('white')),
  groupBy(identity),
  values,
  map(length),
  reduce(max, 0),
  (count) => gte(count, 3)
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  pipe(values, filter(equals('green')), length, equals(2)),
  pipe(values, filter(equals('red')), length, equals(1)),
  propEq('triangle', 'green'),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(
  values,
  filter(equals('orange')),
  length,
  equals(4)
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = propSatisfies(
  complement(anyPass([equals('white'), equals('red')])),
  'star'
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(values, all('green'));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  converge(equals, [prop('triangle'), prop('square')]),
  complement(propEq('circle', 'blue')),
]);
