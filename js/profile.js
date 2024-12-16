// side-bar 이력서 강조
if (location == 'http://127.0.0.1:5500/profile.html') {
  const profile = document.querySelector('.category').children[0].children[0];
  profile.style.fontWeight = '900';
  profile.style.color = '#000000';
}
// 공통 요소 생성 함수
const createElement = (tagName, attributes = {}, text = '') => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });
  if (text) element.textContent = text;
  return element;
};
// 로그아웃
const logoutContainer = document.querySelector('.profile');
const logout = createElement('div', { id: 'logout' }, '로그아웃');
logoutContainer.appendChild(logout);
logout.addEventListener('click', () => {
  sessionStorage.clear();
  window.location.replace('index.html');
});

const content = document.getElementById('projects');
const addButton = document.querySelector('.add-button');

const isLogin = sessionStorage.getItem('login');
const local = JSON.parse(localStorage.getItem('project'));
let projectArr = [];
local.forEach((pro) => {
  if (pro.nickName === isLogin) projectArr.push(pro);
});

let stack = JSON.parse(localStorage.getItem('stack'));
console.log(stack);

// 이름 보여주기
document.getElementById('nickname').innerText = isLogin;
document.getElementById('name').innerText = isLogin;

// 렌더링
document.addEventListener('DOMContentLoaded', () => {
  if (isLogin) {
    fetch('../dev.json')
      .then((res) => res.json())
      .then((result) => {
        localStorage.setItem('stack', JSON.stringify(result.profile.stackIcon));
      });

    const projectExist = content.children;
    if (projectExist.length == 0) {
      const isEmpty = createElement(
        'div',
        { className: 'isEmpty' },
        '이력서를 작성해보세요 👩‍💻'
      );
      content.appendChild(isEmpty);
    }
  } else {
    window.location.replace('index.html');
  }
});

// 페이지 렌더링 함수
const renderProject = (project) => {
  project['nickName'] = isLogin;
  const newProject = createElement('div', {
    className: 'new-project',
    id: project.id,
  });

  // 프로젝트명
  const nameInput = createElement('input', {
    type: 'text',
    className: 'project-name',
    placeholder: '프로젝트 명',
    value: project.name || '',
  });
  nameInput.addEventListener('change', (e) => {
    const name = JSON.parse(localStorage.getItem('project'));
    project.name = e.target.value || undefined;
    if (name.find((p) => p.name == e.target.value)) {
      alert('이미 존재하는 프로젝트입니다. 다른 프로젝트명을 입력해주세요 ‼️');
      nameInput.value = '';
      nameInput.focus();
    }
  });
  newProject.appendChild(nameInput);

  // 단답 내용
  const contents = [
    { label: '참여 기간', key: 'duration' },
    { label: '참여 인원', key: 'member' },
    { label: '책임 업무', key: 'duty' },
    { label: '기술 스택', key: 'stack' },
  ];
  contents.forEach(({ label, key }) => {
    const detail = createElement('div', { className: 'content' });
    detail.appendChild(createElement('span', {}, `${label} : `));
    const input = createElement('input', {
      type: 'text',
      placeholder: `${label} 을/를 입력해주세요`,
      value: key == 'stack' ? '' : project[key] || '',
      className: `${key}-${project.id}`,
    });

    input.addEventListener('change', (e) => {
      project[key] = e.target.value;
    });

    detail.appendChild(input);
    newProject.appendChild(detail);

    // datalist 추가
    let stackArr = project.stack || [];

    if (label == '기술 스택') {
      input.setAttribute('list', key);
      const datalist = createElement('datalist', { id: key }, '');

      stack.map((stack) => {
        const option = createElement('option', {
          value: stack.name,
        });
        datalist.appendChild(option);
      });
      input.after(datalist);

      input.addEventListener('change', (e) => {
        const isExist = stack.find((item) => item.name === e.target.value);
        if (isExist) {
          updatedSelectedStack(key, e.target.value);
        }

        input.value = '';
      });
    }

    // 기술 스택 추가
    const newStackContainer = createElement(
      'div',
      { className: 'stack-container', id: `stack-${project.id}` },
      ''
    );

    const updatedSelectedStack = (key, value) => {
      const stackContainer = document.querySelector(`.${key}-${project.id}`);
      stack.map((stack) => {
        if (value == stack.name) {
          const deleteStack = createElement('img', {
            src: 'https://github.com/user-attachments/assets/b702dad0-19f8-498e-904b-949cf58e1220',
            alt: `${stack.name} 삭제 버튼`,
          });
          const newStack = createElement(
            'div',
            {
              key: key,
              className: 'stack-icon',
            },
            value
          );
          const stackImg = createElement('img', {
            src: stack.image,
            alt: `${stack.name} 아이콘`,
          });

          project[key] = stackArr;

          if (!stackArr.includes(value)) {
            stackArr.push(value);
          }

          newStack.prepend(stackImg);
          newStack.appendChild(deleteStack);
          newStackContainer.appendChild(newStack);

          // 스택 삭제 버튼 이벤트
          deleteStack.addEventListener('click', () => {
            newStack.remove();
            const updatedStackArr = stackArr.filter((stack) => stack != value);
            stackArr = [];
            stackArr.push(...updatedStackArr);
            project[key] = stackArr;
          });
        }
      });

      stackContainer?.after(newStackContainer);
    };

    const renderStack = (key) => {
      if (key == 'stack') {
        const stackPart = JSON.parse(localStorage.getItem('project'));
        stackPart?.forEach((item) => {
          if (item.id === project.id) {
            let stackContainer = document.querySelector(
              `.${key}-${project.id}`
            );
            if (!stackContainer) {
              const detail = createElement('div', { className: 'content' });

              stackContainer = createElement('div', {
                className: `stack-${project.id}`,
              });

              detail.appendChild(stackContainer);
              newProject.appendChild(detail);
            }
            stackContainer.after(newStackContainer);

            item?.stack?.forEach((item) => {
              updatedSelectedStack(key, item);
            });
          }
        });
      }
    };

    renderStack(key);
  });

  // 담당 개발 업무
  const resContainer = createElement('div', { className: 'content' });
  resContainer.appendChild(createElement('div', {}, '담당 개발 업무 : '));
  resContainer.appendChild(createElement('div', {}, ''));
  const devInput = createElement('textarea', {
    placeholder: '담당 개발 업무를 입력해주세요.',
    value: project['dev-work'] == undefined ? '' : project['dev-work'],
  });
  resContainer.appendChild(devInput);

  devInput.addEventListener('change', (e) => {
    project['dev-work'] = e.target.value;
  });

  newProject.appendChild(resContainer);

  // 편집 버튼
  const buttonContainer = createElement('div', {}, '');
  buttonContainer.className = 'btn-container';

  const saveButton = createElement('button', {}, '저장');
  saveButton.className = 'edit-btn';
  saveButton.addEventListener('click', () => {
    if (!project.name || project.name === undefined) {
      alert('🚨 프로젝트명은 필수값입니다.');
      nameInput.focus();
    } else {
      if (!projectArr.includes(project)) projectArr.push(project);

      localStorage.setItem('project', JSON.stringify(projectArr));
      alert('✅ 프로젝트가 저장되었습니다!');
    }
  });

  const deleteButton = createElement(
    'button',
    { className: 'edit-btn', name: project.name },
    '삭제'
  );

  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(saveButton);
  newProject.appendChild(buttonContainer);

  content.prepend(newProject);

  deleteButton.addEventListener('click', () => {
    const isDelete = confirm(
      `⚠️ 정말 삭제하시겠습니까? 프로젝트명 "${project.name}"의 전체 내용이 삭제됩니다. ⚠️`
    );
    if (isDelete) {
      document.getElementById(project.id)?.remove();
      location.reload();
      const updatedArr = projectArr.filter((p) => p.id !== project.id);
      localStorage.setItem('project', JSON.stringify(updatedArr));
      projectArr = [];
      projectArr.push(...updatedArr);
    }
  });
};

// 기존 데이터 보여주기
projectArr.forEach((project) => renderProject(project));

// 새 프로젝트
const createProject = () => {
  addButton.addEventListener('click', () => {
    const newId = { id: Date.now() };
    document.getElementsByClassName('isEmpty')[0]?.remove();
    renderProject(newId);
    projectArr.push(newId);
    localStorage.setItem('project', JSON.stringify(projectArr));
  });
};
createProject();
