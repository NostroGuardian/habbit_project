/* Dont remember push changes */
'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

/* page */

const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    h1: document.querySelector('.h1'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
  content: {
    daysContainer: document.querySelector('#days'),
    day: document.querySelector('.habbit__day'),
    dayComment: document.querySelector('.habbit__comment'),
    nextDay: document.querySelector('.habbit__day'),
  },
};

/* utils */

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitsArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitsArray)) {
    habbits = habbitsArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* rerender */

function rerenderMenu(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      // create
      const element = document.createElement('button');
      element.setAttribute('menu-habbit-id', habbit.id);
      element.classList.add('menu__item');
      element.addEventListener('click', () => rerender(habbit.id));
      element.innerHTML = `<img
                src="./images/${habbit.icon}.svg"
                alt="${habbit.name}"
              />`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add('menu__item_active');
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add('menu__item_active');
    } else {
      existed.classList.remove('menu__item_active');
    }
  }
}

function renderHead(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = progress.toFixed(0) + '%';
  page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`);
}

function renderContent(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  page.content.daysContainer.innerHTML = '';
  activeHabbit.days.forEach((day, i) => {
    const dayLayout = document.createElement('div');
    dayLayout.classList.add('habbit');
    dayLayout.innerHTML = `<div class="habbit__day">День ${i + 1}</div>
              <div class="habbit__comment">
                ${day.comment}
              </div>
              <button class="habbit__delete">
                <img src="./images/delete.svg" alt="Delete habbit" />
              </button>`;
    page.content.daysContainer.appendChild(dayLayout);
  });
  page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderContent(activeHabbit);
}

/* work with days */

function addDays(event) {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  const comment = data.get('comment');
  form['comment'].classList.remove('error');
  if (!comment) {
    form['comment'].classList.add('error');
  }
  form['comment'].value = '';
}

/* init */

(() => {
  loadData();
  rerender(habbits[0].id);
})();

/* Dont remember push changes */
