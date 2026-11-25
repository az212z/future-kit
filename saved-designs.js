const storageKey = 'future-kit-saved-designs';
const limit = 3;

export function initializeSavedDesigns(designs) {
  const cards = [...document.querySelectorAll('.design [data-design]')];
  const sheetLink = document.querySelector('.design-sheet a[href*="?design="]');
  if (!cards.length && !sheetLink) return;

  const numbers = new Intl.NumberFormat('ar-SA');
  const toolbar = document.createElement('div');
  toolbar.className = 'saved-toolbar';
  toolbar.hidden = true;
  toolbar.innerHTML = '<p class="saved-status" role="status"></p><button type="button" class="button button-light" aria-haspopup="dialog">مقارنة التصاميم <span class="saved-count"></span></button>';
  const status = toolbar.querySelector('.saved-status');
  const open = toolbar.querySelector('button');
  const count = toolbar.querySelector('.saved-count');
  const dialog = document.createElement('dialog');
  dialog.className = 'saved-dialog';
  dialog.setAttribute('aria-labelledby', 'saved-title');
  dialog.innerHTML = '<div class="saved-dialog-head"><h2 id="saved-title">التصاميم المحفوظة</h2><button type="button" class="button button-outline" data-close>إغلاق</button></div><p class="saved-dialog-note"></p><p class="saved-scroll-hint" hidden>مرّر المقارنة أفقيًا لرؤية التصميم الثالث.</p><div class="saved-grid" role="region" aria-label="مقارنة التصاميم"></div>';
  const grid = dialog.querySelector('.saved-grid');
  const help = dialog.querySelector('.saved-dialog-note');
  const scrollHint = dialog.querySelector('.saved-scroll-hint');
  document.body.append(toolbar, dialog);

  function readSaved() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(stored)) return [];
      return [...new Set(stored.filter(key => typeof key === 'string' && Object.hasOwn(designs, key)))].slice(0, limit);
    } catch {
      return [];
    }
  }

  let selected = readSaved();
  const toggles = new Map();

  function update(message = '') {
    for (const [key, button] of toggles) {
      const active = selected.includes(key);
      button.setAttribute('aria-pressed', String(active));
      button.querySelector('.save-label').textContent = active ? 'محفوظ' : 'احفظ التصميم';
      button.setAttribute('aria-label', (active ? 'إزالة ' : 'حفظ ') + designs[key].title);
    }
    toolbar.hidden = selected.length === 0;
    count.textContent = numbers.format(selected.length);
    status.textContent = message || 'احفظ حتى ثلاثة تصاميم للمقارنة.';
    if (dialog.open) renderComparison();
  }

  function setSelection(key) {
    if (selected.includes(key)) {
      selected = selected.filter(item => item !== key);
    } else {
      if (selected.length >= limit) {
        status.textContent = 'لديك ثلاثة تصاميم محفوظة. أزل أحدها لإضافة تصميم جديد.';
        return;
      }
      selected = [...selected, key];
    }
    let notice = '';
    try {
      localStorage.setItem(storageKey, JSON.stringify(selected));
    } catch {
      notice = 'تعذّر حفظ التصاميم في المتصفح. يمكنك مقارنتها أثناء بقائك في الصفحة.';
    }
    update(notice);
  }

  function makeToggle(key, container) {
    if (!Object.hasOwn(designs, key)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'save-design';
    button.innerHTML = '<span class="save-icon" aria-hidden="true"></span><span class="save-label"></span>';
    button.addEventListener('click', () => setSelection(key));
    toggles.set(key, button);
    container.append(button);
  }

  function renderComparison() {
    help.textContent = selected.length
      ? 'قارن التوزيع والصورة، ثم أضف التصميم الذي تفضّله إلى الطلب أو اختر له خامات.'
      : 'احفظ تصميمًا من المعرض لبدء المقارنة.';
    grid.tabIndex = selected.length > 1 ? 0 : -1;
    scrollHint.hidden = selected.length < limit;
    grid.replaceChildren();
    for (const key of selected) {
      const design = designs[key];
      const article = document.createElement('article');
      article.className = 'saved-card';
      const image = document.createElement('img');
      image.src = 'assets/collection-' + key + '.webp';
      image.width = 480;
      image.height = 400;
      image.alt = design.title;
      const heading = document.createElement('h3');
      heading.textContent = design.title;
      const layout = document.createElement('p');
      layout.className = 'saved-layout';
      layout.textContent = design.layout;
      const detail = document.createElement('p');
      detail.textContent = design.description;
      const actions = document.createElement('div');
      actions.className = 'saved-card-actions';
      const quote = document.createElement('a');
      quote.className = 'button button-dark';
      quote.href = 'request.html?' + new URLSearchParams({ design: key });
      quote.textContent = 'أضف إلى الطلب';
      const finish = document.createElement('a');
      finish.className = 'line-link';
      finish.href = 'studio.html?' + new URLSearchParams({ design: key });
      finish.textContent = 'اختيار الخامات';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'line-link';
      remove.textContent = 'إزالة';
      remove.setAttribute('aria-label', 'إزالة ' + design.title);
      remove.addEventListener('click', () => {
        setSelection(key);
        const next = grid.querySelector('button') || dialog.querySelector('[data-close]');
        next.focus();
      });
      actions.append(quote, finish, remove);
      article.append(image, heading, layout, detail, actions);
      grid.append(article);
    }
  }

  for (const card of cards) makeToggle(card.dataset.design, card.closest('article'));
  if (sheetLink) {
    const key = new URL(sheetLink.href).searchParams.get('design');
    sheetLink.parentElement.classList.add('sheet-actions');
    makeToggle(key, sheetLink.parentElement);
  }

  open.addEventListener('click', () => {
    renderComparison();
    dialog.showModal();
  });
  dialog.addEventListener('close', () => {
    if (!selected.length) toggles.values().next().value?.focus();
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      selected = readSaved();
      update();
    }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      selected = readSaved();
      update();
    }
  });
  update();
}
