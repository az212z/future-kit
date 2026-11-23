'use strict';

const config = window.futureKitConfig;
const whatsapp = /^9665\d{8}$/.test(config.whatsapp) ? 'https://wa.me/' + config.whatsapp : '';
const storeWhatsapp = document.querySelector('#store-whatsapp');
const storeMap = document.querySelector('#store-map');
if (whatsapp) {
  storeWhatsapp.href = whatsapp;
  storeWhatsapp.hidden = false;
}
if (/^https:\/\/(maps\.app\.goo\.gl\/|www\.google\.com\/maps\/)/.test(config.mapUrl)) {
  storeMap.href = config.mapUrl;
  storeMap.hidden = false;
}

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

const filters = [...document.querySelectorAll('[data-filter]')];
const designs = [...document.querySelectorAll('[data-category]')];
for (const button of filters) {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    for (const item of filters) item.setAttribute('aria-pressed', String(item === button));
    for (const design of designs) design.hidden = filter !== 'all' && design.dataset.category !== filter;
  });
}

const materialCopy = {
  fronts: ['مطفي أو بنقشة خشب؟', 'المطفي يعطي الواجهة لونًا هادئًا، وضوء النهار يبرز نقشة الخشب. جرّب تفتح وتقفل عيّنة الباب عشان تشوف الحواف وتحس بمسكته.'],
  tops: ['سطح العمل', 'الكوارتز والبورسلان والحجر خيارات تختلف في العناية اليومية. حدّد أماكن الحوض والموقد وشكل الحافة قبل قص السطح.'],
  fittings: ['التجهيزات الداخلية', 'درج عميق للقدور، وفواصل لأدوات الطبخ، وسلة سحب للتخزين. جرّب حركة الدرج والمفصلة واختر ما يناسب الأشياء اللي تستخدمها كل يوم.'],
};
const materialTabs = [...document.querySelectorAll('[data-material]')];
for (const button of materialTabs) {
  button.addEventListener('click', () => {
    const [title, description] = materialCopy[button.dataset.material];
    for (const tab of materialTabs) tab.setAttribute('aria-pressed', String(tab === button));
    document.querySelector('#material-name').textContent = title;
    document.querySelector('#material-description').textContent = description;
  });
}

const designCopy = {
  ivory: 'الخزائن على جدارين والوسط مفتوح للحركة. الواجهات العاجية والسطح الفاتح خيار مناسب إذا كان ضوء النهار محدود.',
  walnut: 'واجهات بلون الجوز مع سطح فاتح للتحضير. إذا تطبخ يوميًا، خلّ أدراج القدور قريبة من الموقد.',
  island: 'تكسب سطح تحضير إضافي، وتقدر تضيف كراسي على جهة الجلسة. احسب الممر حول الجزيرة حتى تفتح الأدراج والأجهزة براحة.',
};
const form = document.querySelector('#quote-form');
const selection = document.querySelector('#selection');
const designDialog = document.querySelector('#design-dialog');
const designTitle = document.querySelector('#design-title');
const designImage = document.querySelector('#design-image');
let selectedDesign = '';

for (const button of document.querySelectorAll('[data-design]')) {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    designTitle.textContent = button.querySelector('strong').textContent;
    designImage.src = image.src;
    designImage.alt = image.alt;
    document.querySelector('#design-description').textContent = designCopy[button.dataset.design];
    designDialog.showModal();
  });
}
document.querySelector('#pick-design').addEventListener('click', () => {
  selectedDesign = designTitle.textContent;
  document.querySelector('#selected-design').textContent = 'التصميم المختار: ' + selectedDesign;
  selection.hidden = false;
  designDialog.close();
  document.querySelector('#quote').scrollIntoView();
  form.elements.name.focus({ preventScroll: true });
});
document.querySelector('#clear-design').addEventListener('click', () => {
  selectedDesign = '';
  selection.hidden = true;
  form.elements.notes.focus();
});

const requestDialog = document.querySelector('#request-dialog');
const requestText = document.querySelector('#request-text');
const requestStatus = document.querySelector('#request-status');
const sendWhatsapp = document.querySelector('#send-whatsapp');
const phoneField = form.elements.phone;
form.querySelector('[type=submit]').disabled = false;
form.addEventListener('input', event => event.target.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = form.elements;
  for (const name of ['name', 'district']) {
    if (!fields[name].value.trim()) {
      fields[name].setCustomValidity('أكمل هذا الحقل.');
      fields[name].reportValidity();
      return;
    }
  }
  const phone = phoneField.value
    .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
    .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
    .replace(/[\s()-]/g, '');
  if (!/^(?:\+966|00966|966|0)?5\d{8}$/.test(phone)) {
    phoneField.setCustomValidity('أدخل رقم جوال سعودي صحيح، مثل 05 متبوعًا بثمانية أرقام.');
    phoneField.reportValidity();
    return;
  }
  const number = '05' + phone.slice(-8);
  const message = [
    'طلب عرض سعر لمطبخ | فيوتشر كيت',
    'الاسم: ' + fields.name.value.trim(),
    'الجوال: ' + number,
    'الحي: ' + fields.district.value.trim(),
    'نوع المشروع: ' + fields.project.value,
  ];
  if (selectedDesign) message.push('التصميم: ' + selectedDesign);
  if (fields.notes.value.trim()) message.push('الملاحظات: ' + fields.notes.value.trim());

  requestText.textContent = message.join('\n');
  requestStatus.textContent = '';
  if (whatsapp) {
    sendWhatsapp.href = whatsapp + '?text=' + encodeURIComponent(requestText.textContent);
    sendWhatsapp.hidden = false;
  }
  document.querySelector('#request-note').textContent = whatsapp
    ? 'إذا كانت التفاصيل صحيحة، افتح واتساب وأرسلها للمحل.'
    : 'تقدر تنسخ الطلب أو تنزّله. الإرسال للمحل غير متاح من هذه الصفحة حاليًا.';
  requestDialog.showModal();
});

document.querySelector('#copy-request').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(requestText.textContent);
    requestStatus.textContent = 'تم نسخ الطلب.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(requestText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    requestStatus.textContent = 'تم تحديد النص. استخدم أمر النسخ في جهازك.';
  }
});
document.querySelector('#download-request').addEventListener('click', () => {
  const file = new Blob(['\uFEFF', requestText.textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'future-kit-request.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  requestStatus.textContent = 'جهّزنا ملف الطلب للتنزيل.';
});

const privacyDialog = document.querySelector('#privacy-dialog');
document.querySelector('#open-privacy').addEventListener('click', () => privacyDialog.showModal());
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}
