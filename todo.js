if (location == 'http://127.0.0.1:5500/todo.html') {
  const todo =
    document.getElementsByClassName('category')[0].children[1].children[0];
  todo.style.fontWeight = '900';
  todo.style.color = '#000000';
}
// 기존 데이터
const todaylist = []; // 오늘
let todaySum = 0;
const prelist = []; // 이전
let preSum = 0;
fetch('dev.json')
  .then((res) => res.json())
  .then((result) => {
    Object.entries(result.todo).forEach(([key, value]) => {
      if (key == today) {
        todaylist.push(...value);
        todaySum++;
      } else {
        prelist.push({ key: value });
        preSum++;
      }
    });
    localStorage.setItem('todo', JSON.stringify(todaylist));
    renderTodo(todaylist);
  });

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

// 상단
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
// 오늘 몇 개
const todayTodoNum = createElement(
  'div',
  { className: 'todayTodoNum' },
  `${todaySum}개의 일정이 있습니다.`
);
const hamburger = createElement('img', {
  src: 'https://icon-library.com/images/menu-icon-mobile/menu-icon-mobile-22.jpg',
  alt: '햄버거 아이콘',
});
todayTodoNum.prepend(hamburger);
top.after(todayTodoNum);

// 하단
const renderTodo = (listArr) => {
  const newList = [...listArr];

  listArr.forEach((list, index) => {
    const todayTodo = createElement(
      'div',
      { className: `todolist ${list.checked ? 'checked' : ''}` },
      list.name
    );

    const isCheck = createElement('img', {
      src: list.checked ? './img/checked.png' : './img/checkbox.png',
      alt: '체크 이미지',
    });
    todayTodo.prepend(isCheck);
    container.appendChild(todayTodo);

    todayTodo.addEventListener('click', () => {
      newList[index].checked = !newList[index].checked;
      todayTodo.classList.toggle('checked', newList[index].checked);
      isCheck.src = newList[index].checked
        ? './img/checked.png'
        : './img/checkbox.png';

      localStorage.setItem('todo', JSON.stringify(newList));
      console.log(newList);
    });
  });
};
