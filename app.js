const API_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

const els = {
  input: null,
  addBtn: null,
  list: null,
  status: null,
  counter: null,
};

function setStatus(text){ els.status.textContent = text }

function encodeBody(params){
  return new URLSearchParams(params).toString();
}

async function listTasks(){
  setStatus('불러오는 중…');
  const res = await fetch(`${API_URL}?action=list`, { method: 'GET' });
  const data = await res.json();
  setStatus('준비됨');
  return data.tasks || [];
}

async function addTask(text){
  setStatus('추가 중…');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: encodeBody({ action: 'add', text })
  });
  const data = await res.json();
  setStatus('준비됨');
  return data.tasks || [];
}

async function toggleTask(id, done){
  setStatus('업데이트 중…');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: encodeBody({ action: 'toggle', id, done: done ? 'true' : 'false' })
  });
  const data = await res.json();
  setStatus('준비됨');
  return data.tasks || [];
}

async function deleteTask(id){
  setStatus('삭제 중…');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: encodeBody({ action: 'delete', id })
  });
  const data = await res.json();
  setStatus('준비됨');
  return data.tasks || [];
}

function render(tasks){
  els.list.innerHTML = '';
  for(const t of tasks){
    const li = document.createElement('li');
    li.className = `item${t.done ? ' item--done' : ''}`;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!t.done;
    cb.addEventListener('change', async () => {
      const updated = await toggleTask(String(t.id), cb.checked);
      render(updated);
    });

    const span = document.createElement('span');
    span.className = 'item__text';
    span.textContent = t.text;

    const del = document.createElement('button');
    del.className = 'item__delete';
    del.textContent = '삭제';
    del.addEventListener('click', async () => {
      const updated = await deleteTask(String(t.id));
      render(updated);
    });

    li.appendChild(cb);
    li.appendChild(span);
    li.appendChild(del);
    els.list.appendChild(li);
  }
  els.counter.textContent = `${tasks.length} items`;
}

async function bootstrap(){
  els.input = document.getElementById('new-task');
  els.addBtn = document.getElementById('add-btn');
  els.list = document.getElementById('list');
  els.status = document.getElementById('status');
  els.counter = document.getElementById('counter');

  els.addBtn.addEventListener('click', async () => {
    const text = els.input.value.trim();
    if(!text) return;
    const updated = await addTask(text);
    els.input.value = '';
    render(updated);
  });
  els.input.addEventListener('keydown', async (e) => {
    if(e.key === 'Enter'){
      const text = els.input.value.trim();
      if(!text) return;
      const updated = await addTask(text);
      els.input.value = '';
      render(updated);
    }
  });

  const tasks = await listTasks();
  render(tasks);
}

window.addEventListener('DOMContentLoaded', bootstrap);

