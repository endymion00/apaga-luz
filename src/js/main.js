import './../css/styles.css';
import data from '../../public/price-postprocessed.json';
import dataNextDay from '../../public/price-postprocessed-next-day.json';
import { week, weekEnd } from './templates.js';
import {
  nextCheapHour,
  reloadPage,
  tablePrice,
  tablePriceNextDay,
  getZoneColor,
  isNationalDay
} from './utils.js';

let userHour = new Date().getHours();
let userMinutes = new Date().getMinutes();
let userDay = new Date().getDay();

data.forEach(d => {
  d.hour = d.hour < 10 ? `0${d.hour}` : d.hour;
});
console.log('data', data);

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

const [{ zone }] = expensiveHours.filter(({ hour }) => +hour == userHour);

if (userDay === 6 || userDay === 0 || isNationalDay) {
  /*calendar.innerHTML = weekEnd;*/
  calendar.style.gridTemplateColumns = '1fr';
  mainElement.style.backgroundColor = '#a2fcc1';
} else {
  /*calendar.innerHTML = week;*/
  mainElement.style.backgroundColor = getZoneColor(zone);
}

let reverseCheapHours = [...expensiveHours].reverse();

expensiveHours = expensiveHours
  .slice(0, 12)
  .sort((a, b) => +a.hourHasPassed - +b.hourHasPassed || b.price - a.price);
reverseCheapHours = reverseCheapHours
  .slice(0, 12)
  .sort((a, b) => +a.hourHasPassed - +b.hourHasPassed || a.price - b.price);

tablePrice(reverseCheapHours, 'cheap-element');
tablePrice(expensiveHours, 'expensive-element');

/*
Prices are published at 20:30,
at 21:00 I publish the next day's data,
this table will only be available until 24:00.
*/

let filterDataNextDay = dataNextDay.sort((a, b) => a.price - b.price);
const containerTableNextDay = document.querySelector('.table-next-day');
if (userHour >= 21 && userHour < 24) {
  containerTableNextDay.style.display = 'grid';
  filterDataNextDay = filterDataNextDay.map(({ price, ...rest }) => {
    return {
      price: price.toFixed(3),
      ...rest
    };
  });

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
} else {
  containerTableNextDay.style.display = 'none';
}
