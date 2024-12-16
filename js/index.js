const createElement = (tagName, attributes = {}, text = '') => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });
  if (text) element.textContent = text;
  return element;
};

// 로컬 저장소에서 회원가입된 회원 가져오기
const localInfo = JSON.parse(localStorage.getItem('info'));

const loginContainer = document.querySelector('.login');
const loginButton = document.getElementById('login');

const inputIndex = ['이메일', '비밀번호'];
const info = {};

// input field 생성
inputIndex.forEach((input) => {
  const container = createElement('form', { className: 'input' }, '');

  let imgSrc = '';
  let inputType;
  let inputPlaceholder = '';
  let inputClass = '';
  switch (input) {
    case '이메일':
      imgSrc =
        'https://cdn.iconscout.com/icon/free/png-256/free-email-2026367-1713640.png?f=webp';
      inputPlaceholder = '이메일을 입력해주세요';
      inputType = 'email';
      inputClass = 'email';
      break;

    case '비밀번호':
      imgSrc = 'https://cdn-icons-png.flaticon.com/512/7854/7854946.png';
      inputPlaceholder = '비밀번호를 입력해주세요';
      inputType = 'password';
      inputClass = 'password';
      break;
  }

  const img = createElement('img', { src: imgSrc, alt: `${input} 아이콘` }, '');
  const inputField = createElement('input', {
    type: inputType,
    placeholder: inputPlaceholder,
    className: inputClass,
  });
  const deleteButton = createElement('img', {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaZwcN-dr_sB2IoWUcYpg7VHt6XiCX0UPF4w&s',
    alt: '지우기 아이콘',
  });

  const newArr = [img, inputField, deleteButton];
  newArr.forEach((arr) => container.appendChild(arr));

  loginContainer.appendChild(container);

  inputField.addEventListener('change', (e) => {
    info[input] = e.target.value;
  });

  deleteButton.addEventListener('click', () => {
    inputField.value = '';
  });
});

let login = false;
let email = false;
let pwd = false;
let loginName = '';

const confirmLogin = () => {
  localInfo.forEach((local) => {
    if (local !== null) {
      if (local['이메일'] === info['이메일']) {
        if (local['비밀번호'] === info['비밀번호']) {
          login = true;
          email = true;
          pwd = true;
          loginName = local['닉네임'];
        }
        email = true;
      }
    }
  });
};

loginButton.addEventListener('click', () => {
  confirmLogin();
  if (!email) {
    alert('이메일을 확인해주세요');
  } else if (!pwd) alert('비밀번호를 확인해주세요.');

  if (login) {
    sessionStorage.setItem('login', `${loginName}`);
    window.location.replace('profile.html');
  }
});
