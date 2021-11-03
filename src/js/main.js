import './../css/styles.css';
import data from '../../public/price-postprocessed.json';
import dataNextDay from '../../public/price-postprocessed-next-day.json';
import {
  nextCheapHour,
  reloadPage,
  tablePrice,
  tablePriceNextDay,
  getZoneColor,
  isNationalDay,
  removeTables,
  removeTableNextDay
} from './utils.js';

let userHour = new Date().getHours();
let userMinutes = new Date().getMinutes();
let userDay = new Date().getDay();

const [{ price }] = data.filter(({ hour }) => +hour == userHour);

userHour = userHour < 10 ? `0${userHour}` : userHour;
userMinutes = userMinutes < 10 ? `0${userMinutes}` : userMinutes;

const priceElement = document.getElementById('price');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const calendar = document.getElementById('calendar');

priceElement.textContent = `${price.toFixed(3)}`;
hoursElement.textContent = userHour;
minutesElement.textContent = userMinutes;

const mainElement = document.getElementsByTagName('main')[0];
const menuElement = document.getElementsByTagName('nav')[0];

reloadPage(userMinutes);

const filterDataByUserHour = data.map(({ hour, price, ...rest }) => {
  return {
    hourHasPassed: +hour < userHour ? true : false,
    price: price.toFixed(3),
    hour,
    ...rest
  };
});

let expensiveHours = filterDataByUserHour.sort((a, b) => b.price - a.price);
/*This code is temporary. Hours are reordered based on prices, not Government nomenclature.*/
for (let [index, element] of expensiveHours.entries()) {
  if (index < 8) {
    element.zone = 'punta';
  } else if (index >= 8 && index < 16) {
    element.zone = 'llano';
  } else {
    element.zone = 'valle';
  }
}

const [{ zone }] = expensiveHours.filter(({ hour }) => hour == userHour);

mainElement.style.backgroundColor = getZoneColor(zone);
menuElement.style.backgroundColor = getZoneColor(zone);

let reverseCheapHours = [...expensiveHours].reverse();

function orderByPrice() {
  expensiveHours = expensiveHours
    .slice(0, 12)
    .sort((a, b) => +a.hourHasPassed - +b.hourHasPassed || b.price - a.price);
  reverseCheapHours = reverseCheapHours
    .slice(0, 12)
    .sort((a, b) => +a.hourHasPassed - +b.hourHasPassed || a.price - b.price);

  tablePrice(reverseCheapHours, 'cheap-element');
  tablePrice(expensiveHours, 'expensive-element');
}

function orderByHour() {
  expensiveHours = expensiveHours
    .slice(0, 12)
    .sort(({ hour: a }, { hour: b }) => a - b);

  reverseCheapHours = reverseCheapHours
    .slice(0, 12)
    .sort(({ hour: a }, { hour: b }) => a - b);
  tablePrice(reverseCheapHours, 'cheap-element');
  tablePrice(expensiveHours, 'expensive-element');
}

orderByPrice();

document.getElementById('order-price').addEventListener('click', e => {
  removeTables();
  orderByPrice();
});

document.getElementById('order-hour').addEventListener('click', e => {
  removeTables();
  orderByHour();
});

/*
Prices are published at 20:30,
at 21:00 I publish the next day's data,
this table will only be available until 24:00.
*/

let filterDataNextDay = dataNextDay.sort(({ price: a }, { price: b }) => a - b);
const containerTableNextDay = document.querySelector('.table-next-day');
const halfPastEight = 20 * 60 + 30;
if (userHour * 60 >= halfPastEight && userHour < 24) {
  containerTableNextDay.style.display = 'grid';
  filterDataNextDay = filterDataNextDay.map(({ price, ...rest }) => {
    return {
      price: price.toFixed(3),
      ...rest
    };
  });

  orderTableNextDayByZone();
} else {
  containerTableNextDay.style.display = 'none';
}

function orderTableNextDayByZone() {
  let filterDataNextDay = dataNextDay.sort(
    ({ price: a }, { price: b }) => a - b
  );
  for (let [index, element] of filterDataNextDay.entries()) {
    if (index < 8) {
      element.zone = 'valle';
    } else if (index >= 8 && index < 16) {
      element.zone = 'llano';
    } else {
      element.zone = 'punta';
    }
  }

  tablePriceNextDay(filterDataNextDay);
}

function orderTableNextDayByHour() {
  filterDataNextDay = filterDataNextDay.sort(
    ({ hour: a }, { hour: b }) => a - b
  );

  tablePriceNextDay(filterDataNextDay);
}

document.getElementById('order-price-next').addEventListener('click', e => {
  removeTableNextDay();
  orderTableNextDayByZone();
});

document.getElementById('order-hour-next').addEventListener('click', e => {
  removeTableNextDay();
  orderTableNextDayByHour();
});

document
  .querySelector('.container-table-next-day-title')
  .addEventListener('click', e => {
    const { target } = e;
    const gridTableNextDay = document.querySelector(
      '.container-table-next-day-grid'
    );
    gridTableNextDay.classList.toggle('show');
    target.classList.toggle('rotate');
  });
