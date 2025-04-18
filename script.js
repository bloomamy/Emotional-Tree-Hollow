document.addEventListener('DOMContentLoaded', () => {
  // 语言切换
  const translations = {
    en: {
      siteName: 'Emotional Tree Hollow',
      private: 'Private',
      public: 'Public',
      addEntry: '+ Add Entry',
      langBtn: 'Language'
    },
    zh: {
      siteName: '心灵树洞',
      private: '私密',
      public: '公开',
      addEntry: '添加项目',
      langBtn: '语言'
    }
  };
  let currentLang = 'en';
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');

  // 切换菜单显示
  langBtn.addEventListener('click', () => langMenu.classList.toggle('hidden'));
  // 选择语言
  langMenu.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      currentLang = li.dataset.lang;
      updateText();
      langMenu.classList.add('hidden');
    });
  });
  function updateText() {
    // 按 data-i18n-key 更新所有静态文本
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
      const key = el.getAttribute('data-i18n-key');
      el.textContent = translations[currentLang][key];
    });
    langBtn.textContent = translations[currentLang].langBtn;
  }
  updateText();

  // Entry 操作
  const entryNew = document.querySelector('.entry-new');
  const privateEntries = document.getElementById('private-entries');
  const publicEntries = document.getElementById('public-entries');
  const modal = document.getElementById('entry-modal');
  const closeBtn = document.querySelector('.close-btn');
  const saveDraftBtn = document.getElementById('save-draft-btn');
  const saveFinalBtn = document.getElementById('save-final-btn');
  const textarea = document.getElementById('entry-text');

  // 打开弹窗
  entryNew.addEventListener('click', () => {
    textarea.value = '';
    modal.classList.add('show');
  });
  closeBtn.addEventListener('click', () => modal.classList.remove('show'));

  // 创建条目
  function createEntry(text, isDraft = true, isFinal = false) {
    const entry = document.createElement('div');
    entry.className = 'entry';
    // 左上标记
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = isFinal ? 'Final' : 'Draft';
    entry.appendChild(label);
    // 内容
    const p = document.createElement('p');
    p.textContent = text;
    entry.appendChild(p);
    // 右上操作
    const actions = document.createElement('div');
    actions.className = 'actions';
    // Star
    const star = document.createElement('span');
    star.textContent = '☆';
    star.addEventListener('click', () => {
      star.textContent = star.textContent === '☆' ? '★' : '☆';
    });
    actions.appendChild(star);
    // Edit（仅 Draft 显示）
    if (isDraft) {
      const edit = document.createElement('span');
      edit.textContent = '✎';
      edit.addEventListener('click', () => {
        textarea.value = text;
        modal.classList.add('show');
      });
      actions.appendChild(edit);
    }
    // Delete
    const del = document.createElement('span');
    del.textContent = '🗑';
    del.addEventListener('click', () => {
      if (confirm('Are you sure to delete this entry?')) {
        // 同时从 public 区移除
        if (!isDraft && !isFinal) removePublic(text);
        entry.remove();
      }
    });
    actions.appendChild(del);
    entry.appendChild(actions);

    // 公布按钮（仅 Draft 显示）
    if (isDraft) {
      const pubBtn = document.createElement('button');
      pubBtn.textContent = translations[currentLang].public;
      pubBtn.addEventListener('click', () => {
        publishEntry(text);
        pubBtn.disabled = true;
      });
      entry.appendChild(pubBtn);
    }

    return entry;
  }

  // 发布到 Public
  function publishEntry(text) {
    const pubEntry = createEntry(text, false, false);
    publicEntries.appendChild(pubEntry);
  }

  // 保存草稿
  saveDraftBtn.addEventListener('click', () => {
    const txt = textarea.value.trim();
    if (!txt) return alert('请输入内容！');
    privateEntries.appendChild(createEntry(txt, true, false));
    modal.classList.remove('show');
  });

  // 定稿
  saveFinalBtn.addEventListener('click', () => {
    const txt = textarea.value.trim();
    if (!txt) return alert('请输入内容！');
    privateEntries.appendChild(createEntry(txt, false, true));
    modal.classList.remove('show');
  });
});
