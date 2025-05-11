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
      dataTitle: 'Some Facts about Stress',
      squareTitle: 'Square',
      whatIsStress: 'What is Stress',
      typesOfStress: 'Types of Stress',
      impactsOfStress: 'Impacts of Stress on the Body',
      symptoms: 'Symptoms',
      howToDealWithStress: 'How to Deal with Stress',
      acuteStress: 'Acute Stress',
      episodicAcuteStress: 'Episodic Acute Stress',
      chronicStress: 'Chronic Stress',
      physicalSymptoms: 'Physical Symptoms',
      psychologicalSymptoms: 'Psychological/Mental Symptoms',
      behaviorSymptoms: 'Behavior Symptoms',
      placeholder: 'Enter your content here...',
      save: 'Save',
      expand: 'Expand',
      collapse: 'Collapse',
      contentRequired: 'Please enter content!',
      publishConfirm: 'Cannot edit or delete after publishing.\nProceed to publish?'
    },
    zh: {
      siteName: '心灵树洞',
      private: '私密',
      public: '公开',
      addEntry: '添加项目',
      langBtn: '语言',
      welcome: '欢迎！请随意表达您的想法和感受 ~~~ ♪───Ｏ（≧∇≦）Ｏ────♪',
      dataTitle: '关于压力的几个事实',
      squareTitle: '广场',
      whatIsStress: '什么是压力',
      typesOfStress: '压力的类型',
      impactsOfStress: '压力对身体的影响',
      symptoms: '症状',
      howToDealWithStress: '如何应对压力',
      acuteStress: '急性压力',
      episodicAcuteStress: '阶段性急性压力',
      chronicStress: '慢性压力',
      physicalSymptoms: '身体症状',
      psychologicalSymptoms: '心理/精神症状',
      behaviorSymptoms: '行为症状',
      placeholder: '在此输入内容...',
      save: '保存',
      expand: '展开',
      collapse: '收起',
      contentRequired: '请输入内容！',
      publishConfirm: '发布后不可修改或删除。\n是否继续发布？'
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
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', translations[currentLang][key]);
    });
  }
  updateText();

  // Entry 操作
  const entryNew = document.querySelector('.entry-new');
  const privateEntries = document.getElementById('private-entries');
  const publicEntries = document.getElementById('public-entries');
  const modal = document.getElementById('entry-modal');
  const closeBtn = document.querySelector('.close-btn');
  const saveBtn = document.getElementById('save-btn');
  const textarea = document.getElementById('entry-text');
  let currentEditingEntry = null;

  entryNew.addEventListener('click', () => {
    currentEditingEntry = null;
    textarea.value = '';
    modal.classList.add('show');
  });
  closeBtn.addEventListener('click', () => modal.classList.remove('show'));

  function createEntry(text, isPrivate = true) {
    const entry = document.createElement('div');
    entry.className = 'entry';
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
    if (isPrivate) {
      const edit = document.createElement('span');
      edit.textContent = '✎';
      edit.addEventListener('click', () => {
        currentEditingEntry = entry;
        textarea.value = pre.textContent;
        modal.classList.add('show');
      });
      actions.appendChild(edit);
      const del = document.createElement('span');
      del.textContent = '🗑';
      del.addEventListener('click', () => {
        if (confirm('Are you sure to delete this entry?')) {
          entry.remove();
        }
      });
      actions.appendChild(del);
    }
    entry.appendChild(actions);

    if (isPrivate) {
      const pubBtn = document.createElement('button');
      pubBtn.textContent = translations[currentLang].public;
      pubBtn.addEventListener('click', () => {
        if (confirm(translations[currentLang].publishConfirm)) {
          publishEntry(text);
          pubBtn.disabled = true;
        }
      });
      entry.appendChild(pubBtn);
    }

    if (text.split('\n').length > 1) {
      const toggle = document.createElement('span');
      toggle.className = 'toggle';
      toggle.textContent = translations[currentLang].expand;
      toggle.addEventListener('click', () => {
        if (entry.classList.contains('expanded')) {
          entry.classList.remove('expanded');
          toggle.textContent = translations[currentLang].expand;
        } else {
          entry.classList.add('expanded');
          toggle.textContent = translations[currentLang].collapse;
        }
      });
      entry.appendChild(toggle);
    }

    return entry;
  }

  function publishEntry(text) {
    const pubEntry = createEntry(text, false);
    publicEntries.appendChild(pubEntry);
  }

  saveBtn.addEventListener('click', () => {
    const txt = textarea.value.trim();
    if (!txt) return alert(translations[currentLang].contentRequired);
    if (currentEditingEntry) {
      currentEditingEntry.querySelector('pre').textContent = txt;
    } else {
      privateEntries.appendChild(createEntry(txt, true));
    }
    modal.classList.remove('show');
  });

  // Data Section 交互
  const dataBlocks = document.querySelectorAll('.data-block');
  dataBlocks.forEach(block => {
    block.addEventListener('click', (e) => {
      const details = block.querySelector('.data-details');
      const currentBlock = e.currentTarget;

      // 关闭其他区块
      dataBlocks.forEach(otherBlock => {
        if (otherBlock !== currentBlock) {
          const otherDetails = otherBlock.querySelector('.data-details');
          otherDetails.classList.remove('active');
          // 重置子项内容
          const otherTitle = otherBlock.querySelector('h4').getAttribute('data-i18n-key');
          if (otherTitle === 'typesOfStress' || otherTitle === 'symptoms') {
            otherDetails.innerHTML = otherTitle === 'typesOfStress' ? `
              <div class="sub-block" data-i18n-key="acuteStress">${translations[currentLang].acuteStress}</div>
              <div class="sub-block" data-i18n-key="episodicAcuteStress">${translations[currentLang].episodicAcuteStress}</div>
              <div class="sub-block" data-i18n-key="chronicStress">${translations[currentLang].chronicStress}</div>
            ` : `
              <div class="sub-block" data-i18n-key="physicalSymptoms">${translations[currentLang].physicalSymptoms}</div>
              <div class="sub-block" data-i18n-key="psychologicalSymptoms">${translations[currentLang].psychologicalSymptoms}</div>
              <div class="sub-block" data-i18n-key="behaviorSymptoms">${translations[currentLang].behaviorSymptoms}</div>
            `;
          }
        }
      });

      // 处理子项点击
      if (e.target.classList.contains('sub-block')) {
        const subBlock = e.target;
        const subTitle = subBlock.getAttribute('data-i18n-key');
        let content = '';
        if (currentLang === 'zh') {
          if (subTitle === 'acuteStress') {
            content = `
              <ul>
                <li>短期压力（来去很快）</li>
                <li>可能是积极的，也可能是消极的</li>
                <li>每个人都会在某些时候经历急性压力</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'episodicAcuteStress') {
            content = `
              <ul>
                <li>这是指你经常/每天经历急性压力</li>
                <li>在阶段性急性压力中无法达到平静/放松状态</li>
                <li>影响某些职业的人群，例如医疗服务提供者</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'chronicStress') {
            content = `
              <ul>
                <li>长期压力（可持续数周或数月）</li>
                <li>可能导致严重的健康问题</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'physicalSymptoms') {
            content = `
              <ul>
                <li>疼痛</li>
                <li>高血压</li>
                <li>胸痛（心跳加速）</li>
                <li>疲惫</li>
                <li>睡眠困难</li>
                <li>头痛（感到头晕）</li>
                <li>肌肉紧张</li>
                <li>胃部/消化问题</li>
                <li>免疫系统减弱</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'psychologicalSymptoms') {
            content = `
              <ul>
                <li>焦虑</li>
                <li>恐慌发作</li>
                <li>易怒</li>
                <li>抑郁</li>
                <li>悲伤</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'behaviorSymptoms') {
            content = `
              <ul>
                <li>饮食失调</li>
                <li>睡眠障碍</li>
                <li>其他</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          }
        } else {
          if (subTitle === 'acuteStress') {
            content = `
              <ul>
                <li>Short-term stress (comes & goes quickly)</li>
                <li>May be positive or negative</li>
                <li>Everyone experiences acute stress at some time</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'episodicAcuteStress') {
            content = `
              <ul>
                <li>This is when you experience acute stress frequently/daily</li>
                <li>Cannot get to calm/relaxed state in episodic acute stress</li>
                <li>Affects people with certain professions, e.g., healthcare providers</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'chronicStress') {
            content = `
              <ul>
                <li>Long-term stress (can last weeks or months)</li>
                <li>Can lead to severe health issues</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'physicalSymptoms') {
            content = `
              <ul>
                <li>Aches & pains</li>
                <li>High blood pressure</li>
                <li>Chest pain (fast heartbeat)</li>
                <li>Exhaustion</li>
                <li>Trouble sleeping</li>
                <li>Headaches (feel dizzy)</li>
                <li>Tension in the muscle</li>
                <li>Stomach/digestive problems</li>
                <li>Immune system weakened</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'psychologicalSymptoms') {
            content = `
              <ul>
                <li>Anxiety</li>
                <li>Panic attacks</li>
                <li>Irritability</li>
                <li>Depression</li>
                <li>Sadness</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (subTitle === 'behaviorSymptoms') {
            content = `
              <ul>
                <li>Eating disorders</li>
                <li>Sleeping disorders</li>
                <li>Etc.</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          }
        }
        subBlock.innerHTML = content;
      } else {
        const title = block.querySelector('h4').getAttribute('data-i18n-key');
        if (currentLang === 'zh') {
          if (title === 'whatIsStress') {
            details.innerHTML = `
              <ul>
                <li>压力是你的身体在面对变化或挑战时产生的自然反应</li>
                <li>当你面对压力源时，身体会产生心理和生理反应来帮助你应对</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (title === 'typesOfStress') {
            details.innerHTML = `
              <div class="sub-block" data-i18n-key="acuteStress">${translations[currentLang].acuteStress}</div>
              <div class="sub-block" data-i18n-key="episodicAcuteStress">${translations[currentLang].episodicAcuteStress}</div>
              <div class="sub-block" data-i18n-key="chronicStress">${translations[currentLang].chronicStress}</div>
            `;
          } else if (title === 'impactsOfStress') {
            details.innerHTML = `
              <ul>
                <li>神经系统控制心率、呼吸、视力变化等</li>
                <li>它具有压力反应：“战斗或逃跑反应”，帮助身体应对压力</li>
                <li>然而，持续的压力反应会导致身体疲惫</li>
                <li>可能引发压力发展：身体、心理或行为症状</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (title === 'symptoms') {
            details.innerHTML = `
              <div class="sub-block" data-i18n-key="physicalSymptoms">${translations[currentLang].physicalSymptoms}</div>
              <div class="sub-block" data-i18n-key="psychologicalSymptoms">${translations[currentLang].psychologicalSymptoms}</div>
              <div class="sub-block" data-i18n-key="behaviorSymptoms">${translations[currentLang].behaviorSymptoms}</div>
            `;
          } else if (title === 'howToDealWithStress') {
            details.innerHTML = `
              <ol>
                <li>保持活跃：感到压力时，稍作休息（到户外散步或进行体育活动）</li>
                <li>掌控情绪：尝试控制情绪，制定计划完成让你感到压力的任务</li>
                <li>与人交流：与朋友联系</li>
                <li>享受“自我时间”：独自放松</li>
                <li>多笑一笑！</li>
                <li>聪明工作，而不是拼命工作</li>
              </ol>
            `;
          }
        } else {
          if (title === 'whatIsStress') {
            details.innerHTML = `
              <ul>
                <li>Stress is the natural reaction your body has when changes or challenges occur</li>
                <li>When you express stressors, your body produces mental & physical responses that help you deal with it</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (title === 'typesOfStress') {
            details.innerHTML = `
              <div class="sub-block" data-i18n-key="acuteStress">${translations[currentLang].acuteStress}</div>
              <div class="sub-block" data-i18n-key="episodicAcuteStress">${translations[currentLang].episodicAcuteStress}</div>
              <div class="sub-block" data-i18n-key="chronicStress">${translations[currentLang].chronicStress}</div>
            `;
          } else if (title === 'impactsOfStress') {
            details.innerHTML = `
              <ul>
                <li>Nervous system controls heart rate, breathing, vision changes, and more</li>
                <li>It has stress response: “fight-or-flight response” that helps the body deal with stress</li>
                <li>However, continuous stress response causes your body to be weary</li>
                <li>May lead to stress development: physical, psychological, or behavioral symptoms</li>
              </ul>
              <div class="reference">(Cleveland Clinic, n.d.)</div>
            `;
          } else if (title === 'symptoms') {
            details.innerHTML = `
              <div class="sub-block" data-i18n-key="physicalSymptoms">${translations[currentLang].physicalSymptoms}</div>
              <div class="sub-block" data-i18n-key="psychologicalSymptoms">${translations[currentLang].psychologicalSymptoms}</div>
              <div class="sub-block" data-i18n-key="behaviorSymptoms">${translations[currentLang].behaviorSymptoms}</div>
            `;
          } else if (title === 'howToDealWithStress') {
            details.innerHTML = `
              <ol>
                <li>Be active: when feeling stressful, take a small break (a walk outside or physical activities)</li>
                <li>Take control: Try to control your emotions and make a plan to finish what makes you stressful</li>
                <li>Connect with people: Connect with your friends</li>
                <li>Have "me time": Relax alone</li>
                <li>Laugh more!</li>
                <li>Work smarter, not harder</li>
              </ol>
            `;
          }
        }
        details.classList.toggle('active');
      }
    });
  });
});