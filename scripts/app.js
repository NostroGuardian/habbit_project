/* Dont remember push changes */
'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;

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
  popup: {
    index: document.querySelector('#add-habbit-popup'),
    iconField: document.querySelector('.popup__form input[name="icon"]'),
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

function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = '';
  }
}

function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove('error');
    if (!fieldValue) {
      form[field].classList.add('error');
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
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
              <button class="habbit__delete" onclick="removeDay(${i})">
                <img src="./images/delete.svg" alt="Delete habbit" />
              </button>`;
    page.content.daysContainer.appendChild(dayLayout);
  });
  page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  document.location.replace(document.location.pathname + '#' + activeHabbitId);
  rerenderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderContent(activeHabbit);
}

/* work with days */

function addDays(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ['comment']);
  if (!data) {
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });
  resetForm(event.target, ['comment']);
  rerender(globalActiveHabbitId);
  saveData();
}

function removeDay(dayId) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(dayId, 1);
      return {
        ...habbit,
        days: habbit.days,
      };
    }
    return habbit;
  });
  rerender(globalActiveHabbitId);
  saveData();
}

/* work with popup */

function togglePopup() {
  const cover = page.popup.index;
  if (cover.classList.contains('cover_hidden')) {
    cover.classList.remove('cover_hidden');
  } else {
    cover.classList.add('cover_hidden');
  }
}

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector('.icon.icon_active');
  activeIcon.classList.remove('icon_active');
  context.classList.add('icon_active');
}

/* work with habbits */

function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce(
    (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
    0
  );
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
  });
  resetForm(event.target, ['name', 'target']);
  togglePopup();
  saveData();
  rerender(maxId + 1);
}

/* init */

(() => {
  loadData();
  const hashId = Number(document.location.hash.replace('#', ''));
  const urlHabbit = habbits.find((habbit) => habbit.id == hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();

/* Dont remember push changes */
