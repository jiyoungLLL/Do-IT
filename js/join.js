const createElement = (tagName, attributes = {}, text = '') => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });
  if (text) element.textContent = text;
  return element;
};

const joinContainer = document.querySelector('.join-input');
const joinButton = document.getElementById('join');

const inputIndex = ['이메일', '비밀번호', '비밀번호 확인', '닉네임'];
let joinOK = true;
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
    case '비밀번호 확인':
      imgSrc = 'https://cdn-icons-png.flaticon.com/512/7854/7854946.png';
      inputPlaceholder = '비밀번호를 입력해주세요';
      inputType = 'password';
      inputClass = 'password';
      break;

    case '닉네임':
      imgSrc =
        'https://i.pinimg.com/474x/3e/c0/d4/3ec0d48e3332288604e8d48096296f3e.jpg';
      inputPlaceholder = '닉네임을 입력해주세요';
      inputType = 'text';
      inputClass = 'name';
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

  joinContainer.appendChild(container);

  inputField.addEventListener('change', (e) => {
    info[input] = e.target.value;
  });

  deleteButton.addEventListener('click', () => {
    inputField.value = '';
  });
});

const confirmPassword = () => {
  const passwordArr = document.getElementsByClassName('password');
  const [pwd, pwdconfirm] = ['비밀번호', '비밀번호 확인'];
  if (info[pwd] !== info[pwdconfirm]) {
    joinOK = false;
    alert('입력하신 비밀번호가 일치하지 않습니다.');
    [...passwordArr].forEach((pwd) => (pwd.value = ''));
  } else {
    joinOK = true;
  }
};

const isEmpty = () => {
  for (let i = 0; i < 4; i++) {
    info[inputIndex[i]] == null ? (joinOK = false) : (joinOK = true);
  }
};

joinButton.addEventListener('click', () => {
  isEmpty();
  if (joinOK) {
    confirmPassword();
  } else {
    alert('모든 정보를 입력해주세요');
  }
  if (joinOK) {
    const infoArr = [];
    const pre = JSON.parse(localStorage.getItem('info'));
    infoArr.push(pre);
    infoArr.push(info);
    localStorage.setItem('info', JSON.stringify(infoArr));
    alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다');
    window.location.replace('index.html');
  }
});
