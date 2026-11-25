import { finishes } from './finishes.js';

const studio = document.querySelector('#finish-studio');
const controls = [...studio.querySelectorAll('[name="finish"]')];
const comparison = studio.querySelector('#compare-finish');
const reference = studio.querySelector('#reference-board');
const quote = studio.querySelector('#studio-quote');
const share = studio.querySelector('#share-board');
const status = studio.querySelector('#studio-status');
const sharedUrl = studio.querySelector('#shared-url');
const comparisonPlaceholder = comparison.options[0];
const params = new URLSearchParams(location.search);
const defaultFinish = controls[0].value;
const initial = params.get('finish');
const design = params.get('design');

function paint(board, key) {
  const finish = finishes[key];
  const image = board.querySelector('img');
  image.src = 'assets/finish-board-' + key + '.webp';
  image.alt = 'تصوّر مطبخ بتشطيب ' + finish.title;
  for (const name of ['title', 'front', 'surface', 'detail']) {
    board.querySelector('[data-' + name + ']').textContent = finish[name];
  }
}

function update(selected, other, announce = true) {
  for (const option of comparison.options) {
    option.disabled = option.value === selected;
  }
  comparison.value = Object.hasOwn(finishes, other) && other !== selected ? other : '';
  comparisonPlaceholder.disabled = false;
  paint(studio.querySelector('#selected-board'), selected);
  reference.hidden = !comparison.value;
  studio.classList.toggle('is-comparing', !reference.hidden);
  if (!reference.hidden) paint(reference, comparison.value);
  const quoteParams = new URLSearchParams({ finish: selected });
  if (design && /^[a-z-]{1,40}$/.test(design)) quoteParams.set('design', design);
  quote.href = 'request.html?' + quoteParams;
  const url = new URL(location.href);
  url.searchParams.set('finish', selected);
  if (comparison.value) url.searchParams.set('compare', comparison.value);
  else url.searchParams.delete('compare');
  history.replaceState(null, '', url);
  sharedUrl.value = url.href;
  sharedUrl.hidden = true;
  if (announce) {
    status.textContent = 'اختيارك ' + finishes[selected].title +
      (comparison.value ? '، وتقارنه مع ' + finishes[comparison.value].title + '.' : '.');
  }
}

const selectedControl = () => controls.find(control => control.checked).value;
for (const control of controls) {
  control.disabled = false;
  control.checked = control.value === (Object.hasOwn(finishes, initial) ? initial : defaultFinish);
  control.addEventListener('change', () => update(control.value, comparison.value));
}
comparison.disabled = false;
comparison.addEventListener('change', () => update(selectedControl(), comparison.value));
share.disabled = false;
share.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(sharedUrl.value);
    status.textContent = 'نسخنا رابط الألوان.';
  } catch {
    sharedUrl.hidden = false;
    sharedUrl.focus();
    sharedUrl.select();
    status.textContent = 'حدّدنا الرابط لك. تقدر تنسخه الآن.';
  }
});
update(selectedControl(), params.get('compare'), false);
