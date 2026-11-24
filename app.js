'use strict';

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

const designCopy = {
  island: {
    layout: 'مطبخ بجزيرة',
    title: 'جزيرة من الترافرتين',
    description: 'تضيف الجزيرة مساحة للتحضير ومقاعد باتجاه الجلسة. يُحدد حجمها بعد حساب الممرات ومدى فتح الأدراج والأجهزة.',
  },
  ivory: {
    layout: 'مطبخ زاوية',
    title: 'واجهات رملية مطفية',
    description: 'توزيع على جدارين متجاورين يترك وسط المطبخ مفتوحًا للحركة. تساعد الواجهات الفاتحة على إظهار تفاصيل الأبواب في المساحات محدودة الإضاءة.',
  },
  walnut: {
    layout: 'مطبخ على ثلاثة جدران',
    title: 'واجهات بلون الجوز',
    description: 'يجمع التوزيع الحوض والموقد وسطح التحضير على ثلاثة جدران. تُراجع المسافة بين الوحدات المتقابلة حتى يسهل فتحها والعمل بينها.',
  },
  linear: {
    layout: 'مطبخ مستقيم',
    title: 'بلوط فاتح على جدار واحد',
    description: 'ترتيب الخزائن والأجهزة على جدار واحد يترك الفراغ المقابل مفتوحًا. يُراجع طول السطح المتاح بعد تحديد مقاسي الحوض والموقد.',
  },
  galley: {
    layout: 'مطبخ متوازٍ',
    title: 'خشب داكن على جدارين متقابلين',
    description: 'يتيح المطبخ المتوازي سطحَي عمل على جانبي الممر. عند القياس، نراجع المساحة بعد فتح الأدراج وباب غسالة الأطباق، ومكان الوقوف أمامها.',
  },
};

const designDialog = document.querySelector('#design-dialog');
for (const button of document.querySelectorAll('[data-design]')) {
  button.addEventListener('click', () => {
    const key = button.dataset.design;
    const design = designCopy[key];
    const source = button.closest('article').querySelector('img');
    const image = document.querySelector('#design-image');
    image.src = source.src;
    image.alt = source.alt;
    document.querySelector('#design-title').textContent = design.title;
    document.querySelector('#design-description').textContent = design.description;
    document.querySelector('#pick-design').href = 'request.html?design=' + encodeURIComponent(key);
    designDialog.showModal();
  });
}

const priorityOptions = {
  storage: {
    label: 'زيادة مساحة التخزين',
    tip: 'راجع إمكانية إضافة خزائن طويلة، وحدّد ما تحتاج إليه يوميًا حتى يبقى قريبًا من سطح العمل.',
  },
  prep: {
    label: 'توسيع مساحة التحضير',
    tip: 'اترك جزءًا متصلًا من سطح العمل بالقرب من الحوض، وحدّد أماكن الأجهزة الصغيرة قبل اعتماد الخزائن.',
  },
  seating: {
    label: 'تخصيص مكان للجلوس',
    tip: 'حدّد مكان المقاعد بعد قياس الممر. في المساحات الضيقة، قد يكون الجلوس عند طرف المطبخ أو خارجه أنسب.',
  },
};
const projectOptions = { new: 'مطبخ جديد', renew: 'تجديد مطبخ' };

const planner = document.querySelector('#layout-planner');
if (planner) {
  const resultImage = document.querySelector('#planner-image');
  const title = document.querySelector('#planner-title');
  const copy = document.querySelector('#planner-copy');
  const tip = document.querySelector('#planner-tip');
  const quoteLink = document.querySelector('#planner-quote');
  planner.querySelector('[type=submit]').disabled = false;
  planner.addEventListener('submit', event => {
    event.preventDefault();
    const key = planner.elements.shape.value;
    const priority = planner.elements.priority.value;
    if (!Object.hasOwn(designCopy, key) || !Object.hasOwn(priorityOptions, priority)) return;
    const design = designCopy[key];
    title.textContent = design.layout;
    copy.textContent = design.description;
    tip.textContent = priorityOptions[priority].tip;
    tip.hidden = false;
    resultImage.src = 'assets/collection-' + key + '.webp';
    resultImage.alt = 'تصوّر تصميمي: ' + design.title;
    const params = new URLSearchParams({ design: key, priority });
    quoteLink.href = 'request.html?' + params;
    quoteLink.hidden = false;
  });
  planner.addEventListener('change', () => {
    if (quoteLink.hidden) return;
    title.textContent = 'تحديث التوزيع المقترح';
    copy.textContent = 'اعرض التوزيع مرة أخرى لتحديث النموذج وفق اختياراتك.';
    tip.hidden = true;
    quoteLink.hidden = true;
  });
}

function initializeQuote(form) {
  const config = window.futureKitConfig;
  const whatsapp = /^9665\d{8}$/.test(config.whatsapp) ? 'https://wa.me/' + config.whatsapp : '';
  const storeWhatsapp = document.querySelector('#store-whatsapp');
  const storeMap = document.querySelector('#store-map');
  if (whatsapp) {
    storeWhatsapp.href = whatsapp;
    storeWhatsapp.hidden = false;
    document.querySelector('#quote-method').textContent = 'يمكن إرسال الطلب عبر واتساب بعد مراجعته.';
  }
  if (/^https:\/\/(maps\.app\.goo\.gl\/|www\.google\.com\/maps\/)/.test(config.mapUrl)) {
    storeMap.href = config.mapUrl;
    storeMap.hidden = false;
  }

  const selection = document.querySelector('#selection');
  const pageUrl = new URL(location.href);
  const key = pageUrl.searchParams.get('design');
  const project = pageUrl.searchParams.get('project');
  const priority = pageUrl.searchParams.get('priority');
  if (Object.hasOwn(projectOptions, project)) form.elements.project.value = projectOptions[project];
  if (Object.hasOwn(priorityOptions, priority)) form.elements.priority.value = priority;
  let selectedDesign = Object.hasOwn(designCopy, key) ? designCopy[key].title : '';
  if (selectedDesign) {
    document.querySelector('#selected-design').textContent = 'التصميم المرجعي: ' + selectedDesign;
    selection.hidden = false;
  }
  document.querySelector('#clear-design').addEventListener('click', () => {
    selectedDesign = '';
    selection.hidden = true;
    pageUrl.searchParams.delete('design');
    history.replaceState(null, '', pageUrl.href);
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
        fields[name].setCustomValidity('يرجى تعبئة هذا الحقل.');
        fields[name].reportValidity();
        return;
      }
    }
    const phone = phoneField.value
      .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
      .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
      .replace(/[\s()-]/g, '');
    if (!/^(?:\+966|00966|966|0)?5\d{8}$/.test(phone)) {
      phoneField.setCustomValidity('أدخل رقم جوال سعوديًا صحيحًا يبدأ بـ 05 ويتكون من عشرة أرقام.');
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
    if (fields.stage.value) message.push('مرحلة المشروع: ' + fields.stage.value);
    if (Object.hasOwn(priorityOptions, fields.priority.value)) {
      message.push('أولوية الاستخدام: ' + priorityOptions[fields.priority.value].label);
    }
    if (fields.notes.value.trim()) message.push('الملاحظات: ' + fields.notes.value.trim());

    requestText.textContent = message.join('\n');
    requestStatus.textContent = '';
    if (whatsapp) {
      sendWhatsapp.href = whatsapp + '?text=' + encodeURIComponent(requestText.textContent);
      sendWhatsapp.hidden = false;
    }
    document.querySelector('#request-note').textContent = whatsapp
      ? 'راجع البيانات، ثم افتح واتساب لإرسال الطلب.'
      : 'يمكن نسخ الطلب أو تنزيله. الإرسال عبر الموقع غير متاح حاليًا.';
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
    requestStatus.textContent = 'ملف الطلب جاهز للتنزيل.';
  });

}

const quoteForm = document.querySelector('#quote-form');
if (quoteForm) initializeQuote(quoteForm);

const privacyDialog = document.querySelector('#privacy-dialog');
document.querySelector('#open-privacy').addEventListener('click', () => privacyDialog.showModal());
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}
