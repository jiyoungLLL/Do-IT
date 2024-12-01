// side-bar 이력서 강조
if (location == 'http://127.0.0.1:5500/profile.html') {
  const profile = document.querySelector('.category').children[0].children[0];
  profile.style.fontWeight = '900';
  profile.style.color = '#000000';
}

const content = document.getElementById('projects');
const addButton = document.getElementById('add-project');

// 공통 요소 생성
const createElement = (tagName, attributes = {}, text = '') => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });
  if (text) element.textContent = text;
  return element;
};

// 데이터 없을 때 프로젝트가 없습니다
document.addEventListener('DOMContentLoaded', () => {
  const projectExist = content.children;
  if (projectExist.length == 0) {
    const isEmpty = createElement(
      'div',
      { className: 'isEmpty' },
      '프로젝트가 없습니다. 새 프로젝트를 작성해보세요!'
    );
    content.appendChild(isEmpty);
  }
});

// 기존 데이터 가져오기
let projectArr = JSON.parse(localStorage.getItem('project')) || [];

// 페이지 렌더링 함수
const renderProject = (project) => {
  const newProject = createElement('div', {
    className: 'new-project',
    id: project.name,
  });

  // 프로젝트명
  const nameInput = createElement('input', {
    type: 'text',
    className: 'project-name',
    placeholder: '프로젝트 명',
    value: project.name || '',
  });
  nameInput.addEventListener('change', (e) => (project.name = e.target.value));
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
      value: project[key] || '',
    });
    input.addEventListener('change', (e) => (project[key] = e.target.value));
    detail.appendChild(input);
    newProject.appendChild(detail);
  });

  // 담당 개발 업무
  const resContainer = createElement('div', { className: 'content' });
  resContainer.appendChild(createElement('div', {}, '담당 개발 업무 : '));
  const inputField = createElement('input', {
    type: 'text',
    placeholder: '담당 개발 업무를 입력하고 Enter를 누르세요',
  });
  const textList = createElement('ul');
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && inputField.value.trim()) {
      e.preventDefault();
      const listItem = createElement('li', {}, inputField.value.trim());
      textList.appendChild(listItem);
      inputField.value = '';
    }
  });
  resContainer.appendChild(inputField);
  resContainer.appendChild(textList);
  newProject.appendChild(resContainer);

  // 편집 버튼
  const buttonContainer = createElement('div', {}, '');
  buttonContainer.className = 'btn-container';

  const saveButton = createElement('button', {}, '저장');
  saveButton.className = 'edit-btn';
  saveButton.addEventListener('click', () => {
    if (!projectArr.includes(project)) projectArr.push(project);
    localStorage.setItem('project', JSON.stringify(projectArr));
    alert('✅ 프로젝트가 저장되었습니다!');
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
      '⚠️ 정말 삭제하시겠습니까? 프로젝트 전체 내용이 삭제됩니다. ⚠️'
    );
    if (isDelete) {
      document.getElementById(project.name)?.remove();
      location.reload(); // 화면에서 지우고 보여줌
      const updatedArr = projectArr.filter((p) => p.name !== project.name);
      localStorage.setItem('project', JSON.stringify(updatedArr));
      projectArr = [];
      projectArr.push(...updatedArr);
    }
  });
};

// 기존 데이터 보여주기
projectArr.forEach((project) => renderProject(project));

// 새 프로젝트
addButton.addEventListener('click', () => renderProject({}));
