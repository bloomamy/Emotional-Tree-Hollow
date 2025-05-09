document.addEventListener('DOMContentLoaded', () => {
  // 语言切换
  const translations = {
    en: {
      siteName: 'Emotional Tree Hollow',
      private: 'Private',
      public: 'Public',
      addEntry: '+ Add Entry',
      langBtn: 'Language',
      welcome: 'Welcome! Feel free to express your thoughts & feelings here ~~~ ♪───Ｏ（≧∇≦）Ｏ────♪',
      dataTitle: 'Data Section',
      dataContent: 'Here you can place some information or resources.'
    },
    zh: {
      siteName: '心灵树洞',
      private: '私密',
      public: '公开',
      addEntry: '添加项目',
      langBtn: '语言',
      welcome: '欢迎！请随意表达您的想法和感受 ~~~ ♪───Ｏ（≧∇≦）Ｏ────♪',
      dataTitle: '资料区',
      dataContent: '这里可以放置一些信息或资源。'
    }
  };
  let currentLang = 'en';
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');

  langBtn.addEventListener('click', () => langMenu.classList.toggle('hidden'));
  langMenu.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      currentLang = li.dataset.lang;
      updateText();
      langMenu.classList.add('hidden');
    });
  });
  function updateText() {
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
  let currentEditingEntry = null;

  entryNew.addEventListener('click', () => {
    currentEditingEntry = null;
    textarea.value = '';
    modal.classList.add('show');
  });
  closeBtn.addEventListener('click', () => modal.classList.remove('show'));

  function createEntry(text, isDraft = true, isFinal = false) {
    const entry = document.createElement('div');
    entry.className = 'entry';
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = isFinal ? 'Final' : 'Draft';
    entry.appendChild(label);
    const pre = document.createElement('pre');
    pre.textContent = text;
    entry.appendChild(pre);
    const actions = document.createElement('div');
    actions.className = 'actions';
    const star = document.createElement('span');
    star.textContent = '☆';
    star.addEventListener('click', () => {
      star.textContent = star.textContent === '☆' ? '★' : '☆';
    });
    actions.appendChild(star);
    if (isDraft) {
      const edit = document.createElement('span');
      edit.textContent = '✎';
      edit.addEventListener('click', () => {
        currentEditingEntry = entry;
        textarea.value = pre.textContent;
        modal.classList.add('show');
      });
      actions.appendChild(edit);
    }
    const del = document.createElement('span');
    del.textContent = '🗑';
    del.addEventListener('click', () => {
      if (confirm('Are you sure to delete this entry?')) {
        entry.remove();
      }
    });
    actions.appendChild(del);
    entry.appendChild(actions);

    const pubBtn = document.createElement('button');
    pubBtn.textContent = translations[currentLang].public;
    pubBtn.addEventListener('click', () => {
      publishEntry(text);
      pubBtn.disabled = true;
    });
    entry.appendChild(pubBtn);

    if (text.split('\n').length > 1) {
      const toggle = document.createElement('span');
      toggle.className = 'toggle';
      toggle.textContent = '展开';
      toggle.addEventListener('click', () => {
        if (entry.classList.contains('expanded')) {
          entry.classList.remove('expanded');
          toggle.textContent = '展开';
        } else {
          entry.classList.add('expanded');
          toggle.textContent = '收起';
        }
      });
      entry.appendChild(toggle);
    }

    return entry;
  }

  function publishEntry(text) {
    const pubEntry = createEntry(text, false, false);
    publicEntries.appendChild(pubEntry);
  }

  saveDraftBtn.addEventListener('click', () => {
    const txt = textarea.value.trim();
    if (!txt) return alert('请输入内容！');
    if (currentEditingEntry) {
      currentEditingEntry.querySelector('pre').textContent = txt;
    } else {
      privateEntries.appendChild(createEntry(txt, true, false));
    }
    modal.classList.remove('show');
  });

  saveFinalBtn.addEventListener('click', () => {
    if (confirm('Save as Final? You won\'t be able to edit this entry after saving.')) {
      const txt = textarea.value.trim();
      if (!txt) return alert('请输入内容！');
      if (currentEditingEntry) {
        currentEditingEntry.querySelector('pre').textContent = txt;
        currentEditingEntry.querySelector('.label').textContent = 'Final';
        const editBtn = currentEditingEntry.querySelector('.actions span[textContent="✎"]');
        if (editBtn) editBtn.remove();
      } else {
        privateEntries.appendChild(createEntry(txt, false, true));
      }
      modal.classList.remove('show');
    }
  });
});