if (location == 'http://127.0.0.1:5500/todo.html') {
  const todo =
    document.getElementsByClassName('category')[0].children[1].children[0];
  todo.style.fontWeight = '900';
  todo.style.color = '#000000';
}
// 기존 데이터
let todaySum = 0;

// 오늘 날짜
const time = new Date();
const year = time.getFullYear().toString().slice(-2);
const month = time.getMonth() + 1;
const date = time.getDate();
const dayNumber = time.getDay();
let day = '';
const dayArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
dayArr.map((item, index) => {
  if (index == dayNumber) {
    day = item;
  }
});
const today = `${year}.${month}.${date}`;

// 공통 요소 생성 함수
const createElement = (tagName, attributes = {}, text = '') => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });
  if (text) element.textContent = text;
  return element;
};

const container = document.querySelector('#todo-content');
const addContainer = document.querySelector('#add-todo');

// 상단
const renderTop = () => {
  const top = createElement('div', { className: 'todo-top' }, '');
  const todayStr = createElement('div', {}, '오늘');
  const todayNum = createElement(
    'div',
    { className: 'todayNum' },
    today + ` ${day}`
  );
  top.appendChild(todayStr);
  top.appendChild(todayNum);
  container.appendChild(top);
  // 일정 개수
  const todayTodoNum = createElement('div', { className: 'todayTodoNum' });
  const count = createElement(
    'span',
    { className: 'count' },
    `${todaySum}개의 일정이 있습니다.`
  );
  const hamburger = createElement('img', {
    src: 'https://icon-library.com/images/menu-icon-mobile/menu-icon-mobile-22.jpg',
    alt: '햄버거 아이콘',
  });
  todayTodoNum.appendChild(hamburger);
  todayTodoNum.appendChild(count);
  top.after(todayTodoNum);
};

// 하단
let todaylist = JSON.parse(localStorage.getItem('todo')) || [];

const renderTodo = () => {
  container.innerHTML = '';
  renderTop();

  todaylist.forEach((list) => {
    const todayTodo = createElement(
      'div',
      { className: `todolist ${list.checked ? 'checked' : ''}` },
      ''
    );
    const scheduleContainer = createElement('div', {}, '');
    const isCheck = createElement('img', {
      src: list.checked ? './img/checked.png' : './img/checkbox.png',
      alt: '체크 이미지',
    });
    const schedule = createElement(
      'input',
      { value: list.name, className: 'schedule' },
      ''
    );
    scheduleContainer.appendChild(isCheck);
    scheduleContainer.appendChild(schedule);

    const deleteContainer = createElement('div', {}, '');
    const isdelete = createElement('button', {}, '삭제');
    deleteContainer.appendChild(isdelete);

    todayTodo.appendChild(scheduleContainer);
    todayTodo.appendChild(deleteContainer);
    container.appendChild(todayTodo);

    isCheck.addEventListener('click', () => {
      const todo = todaylist.find((todo) => todo.id === list.id);
      todo.checked = !todo.checked;
      todayTodo.classList.toggle('checked', todo.checked);
      isCheck.src = todo.checked ? './img/checked.png' : './img/checkbox.png';

      localStorage.setItem('todo', JSON.stringify(todaylist));
    });

    schedule.addEventListener('change', (e) => {
      const todo = todaylist.find((todo) => todo.id === list.id);
      todo.name = e.target.value;
      localStorage.setItem('todo', JSON.stringify(todaylist));
    });

    isdelete.addEventListener('click', () => {
      const deletedList = todaylist.filter((todo) => todo.id !== list.id);
      localStorage.setItem('todo', JSON.stringify(deletedList));
      todaylist.splice(
        todaylist.findIndex((todo) => todo.id === list.id),
        1
      );
      todayTodo.remove();
      todaySum -= 1;
      updateTodoNum(todaySum);
      todoEmpty();
    });
  });
};

// 일정 개수 업뎃
const updateTodoNum = (num) => {
  const count = document.querySelector('.count');
  count.innerText = `${num}개의 일정이 있습니다.`;
};

// todo 추가
const addTodoList = () => {
  const addTodo = createElement('div', { className: 'add-todo' }, '추가하기');
  const addIcon = createElement('img', {
    src: 'https://cdn.icon-icons.com/icons2/834/PNG/512/plus_icon-icons.com_66718.png',
    alt: 'todo 추가 아이콘',
  });
  addTodo.prepend(addIcon);
  addContainer.appendChild(addTodo);

  addTodo.addEventListener('click', () => {
    const emptyTodo = document.querySelector('.emptyTodo');
    if (emptyTodo) {
      emptyTodo.remove();
    }

    const newTodo = { id: Date.now(), name: '', checked: false };
    todaylist.push(newTodo);
    todaySum += 1;
    localStorage.setItem('todo', JSON.stringify(todaylist));

    renderTodo([newTodo]);
    updateTodoNum(todaySum);
  });
};

// 일정 없을 떄
const todoEmpty = () => {
  const isEmpty = document.querySelector('.emptyTodo');
  const data = JSON.parse(localStorage.getItem('todo')) || [];
  if (data.length == 0 && !isEmpty) {
    const emptyTodo = createElement(
      'div',
      { className: 'emptyTodo' },
      '오늘의 일정이 비어있습니다 👀 일정을 추가해주세요! 📝'
    );
    container.appendChild(emptyTodo);
  } else {
    return;
  }
};

const data = JSON.parse(localStorage.getItem('todo'));
document.addEventListener('DOMContentLoaded', () => {
  if (data === null) {
    fetch('dev.json')
      .then((res) => res.json())
      .then((result) => {
        const isTodayResult = result.todo[today];
        if (!isTodayResult) {
          localStorage.removeItem('todo');
          renderTop();
          todoEmpty();
          addTodoList();
        } else {
          Object.entries(result.todo).forEach(([key, value]) => {
            if (key === today) {
              todaylist.push(...value);
              todaySum = value.length;
            }
          });

          localStorage.setItem('todo', JSON.stringify(todaylist));
          renderTodo(todaylist);
          addTodoList();
        }
      });
  } else if (data.length == 0) {
    renderTop();
    addTodoList();
    todoEmpty();
  } else {
    todaySum = data.length;
    renderTodo(data);
    addTodoList();
  }
});
