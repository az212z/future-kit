import { finishes } from './finishes.js';
import { initializeSavedDesigns } from './saved-designs.js';

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
if (filters.length) {
  const designs = [...document.querySelectorAll('[data-category]')];
  const groups = [...document.querySelectorAll('[data-design-group]')];
  const palette = document.querySelector('#palette-filter');
  const count = document.querySelector('#design-count');
  const empty = document.querySelector('#catalog-empty');
  const numbers = new Intl.NumberFormat('ar-SA');
  const search = new URLSearchParams(location.search);
  const savedLayout = search.get('layout');
  const savedPalette = search.get('tone');
  let layout = filters.some(button => button.dataset.filter === savedLayout) ? savedLayout : 'all';
  if ([...palette.options].some(option => option.value === savedPalette)) palette.value = savedPalette;

  function filterCatalog(updateAddress) {
    const tone = palette.value;
    let visible = 0;
    for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === layout));
    for (const design of designs) {
      const matchesLayout = layout === 'all' || design.dataset.category === layout;
      const matchesPalette = tone === 'all' || design.dataset.palette === tone;
      design.hidden = !(matchesLayout && matchesPalette);
      if (!design.hidden) visible += 1;
    }
    for (const group of groups) group.hidden = !group.querySelector('.design:not([hidden])');
    count.textContent = visible === designs.length
      ? numbers.format(visible) + ' تصميمًا في ' + numbers.format(groups.length) + ' توزيعات'
      : 'عرض ' + numbers.format(visible) + ' من أصل ' + numbers.format(designs.length) + ' تصميمًا';
    empty.hidden = visible > 0;
    if (updateAddress) {
      const url = new URL(location.href);
      for (const [parameter, value] of [['layout', layout], ['tone', tone]]) {
        if (value === 'all') url.searchParams.delete(parameter);
        else url.searchParams.set(parameter, value);
      }
      history.replaceState(null, '', url);
    }
  }

  for (const button of filters) {
    button.addEventListener('click', () => {
      layout = button.dataset.filter;
      filterCatalog(true);
    });
  }
  palette.addEventListener('change', () => filterCatalog(true));
  document.querySelector('#reset-filters').addEventListener('click', () => {
    layout = 'all';
    palette.value = 'all';
    filterCatalog(true);
    filters[0].focus();
  });
  filterCatalog(false);
}

const designCopy = {
  "island": {
    layout: "مطبخ بجزيرة",
    title: "جزيرة من الترافرتين",
    description: "إذا بتجلس على الجزيرة، احسب مكان الكراسي مع مساحة المرور. وجرّب في المخطط فتح الأدراج اللي تقابلها.",
  },
  "island-ivory": {
    layout: "مطبخ بجزيرة",
    title: "جزيرة عاجية بسطح ممتد",
    description: "السطح ممتد من جهة المقاعد عشان يترك مجالًا للركب. حدّد كم كرسي تحتاج قبل اختيار الطول.",
  },
  "island-graphite": {
    layout: "مطبخ بجزيرة",
    title: "جزيرة حجرية وواجهات فحمية",
    description: "الأجهزة والتخزين على الجدار. تقدر تستخدم الجزيرة للتحضير وتخلي السطح أمامك فاضي.",
  },
  "island-walnut": {
    layout: "مطبخ بجزيرة",
    title: "جزيرة عريضة مع خزائن الجوز",
    description: "إذا بتستخدم أجهزة صغيرة على الجزيرة، حدّد مكان المقابس من البداية عشان تنحسب التوصيلات.",
  },
  "ivory": {
    layout: "مطبخ زاوية",
    title: "واجهات رملية مطفية",
    description: "الجداران يتركان وسط المطبخ مفتوحًا. جرّب طريقة فتح خزانة الزاوية قبل اختيار السلة أو الرف اللي داخلها.",
  },
  "corner-oak": {
    layout: "مطبخ زاوية",
    title: "زاوية من البلوط الفاتح",
    description: "مكان الحوض قريب من الركن. قبل اعتماد التوزيع، تأكد أن بينه وبين الموقد سطحًا كافيًا للتحضير.",
  },
  "corner-espresso": {
    layout: "مطبخ زاوية",
    title: "زاوية بواجهات جوز داكنة",
    description: "خلّ أدراج القدور بجانب الموقد. إضاءة تحت الخزائن العلوية تساعدك تشوف سطح العمل ليلًا.",
  },
  "corner-taupe": {
    layout: "مطبخ زاوية",
    title: "زاوية بخزائن رمادية دافئة",
    description: "تجتمع الخزائن الطويلة في طرف واحد. كذا يبقى السطح القريب من الزاوية متصلًا للتحضير.",
  },
  "linear": {
    layout: "مطبخ مستقيم",
    title: "بلوط فاتح على جدار واحد",
    description: "بعد ما تحدد مكان الحوض والموقد، شوف كم يبقى من السطح بينهما للتحضير.",
  },
  "linear-shaker": {
    layout: "مطبخ مستقيم",
    title: "مطبخ مستقيم بواجهات مؤطّرة",
    description: "ترتيب كل شيء على جدار واحد يترك الجهة المقابلة مفتوحة. حدّد مكان المقابس والشفاط قبل التفصيل.",
  },
  "linear-ash": {
    layout: "مطبخ مستقيم",
    title: "خشب فاتح وأجهزة مدمجة",
    description: "خزّن الأغراض قليلة الاستخدام في الرفوف العالية، وخَلّ الأدوات اليومية في مكان سهل الوصول.",
  },
  "galley": {
    layout: "مطبخ متوازٍ",
    title: "خشب داكن على جدارين متقابلين",
    description: "قِس عرض الممر وباب غسالة الصحون مفتوح. خذ مساحة فتح الأدراج في الحسبان كذلك.",
  },
  "galley-sage": {
    layout: "مطبخ متوازٍ",
    title: "مطبخ متوازٍ بواجهات مريمية",
    description: "تقدر تخصّص جانبًا للغسيل والتحضير والثاني للطبخ. تأكد إن الممر يسمح باستخدام الجهتين.",
  },
  "galley-warmwood": {
    layout: "مطبخ متوازٍ",
    title: "مطبخ متوازٍ بخشب دافئ",
    description: "إذا كان الفرن قدّام غسالة الصحون، احسب مساحة البابين وقت الفتح.",
  },
  "walnut": {
    layout: "مطبخ على ثلاثة جدران",
    title: "واجهات بلون الجوز",
    description: "الحوض والموقد قريبان من سطح التحضير. اختر لزوايا التخزين رفوفًا أو سلالًا حسب الأغراض اللي بتحطّها فيها.",
  },
  "u-sand": {
    layout: "مطبخ على ثلاثة جدران",
    title: "خزائن رملية على ثلاثة جدران",
    description: "السطح متصل على ثلاث جهات. انتبه إلى المقابض والأدراج قرب الركنين حتى تفتح من غير ما تتقابل.",
  },
  "u-forest": {
    layout: "مطبخ على ثلاثة جدران",
    title: "أخضر داكن مع سطح حجري",
    description: "يعطيك التوزيع ركنين للتخزين. حط أدوات الطبخ اليومية في الأدراج القريبة من الموقد، والأغراض اللي تستخدمها أقل في الزوايا.",
  },
};

initializeSavedDesigns(designCopy);

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
    document.querySelector('#design-layout').textContent = design.layout;
    document.querySelector('#design-description').textContent = design.description;
    document.querySelector('#design-sheet').href = 'design-' + key + '.html';
    document.querySelector('#pick-design').href = 'request.html?design=' + encodeURIComponent(key);
    designDialog.showModal();
  });
}

const priorityOptions = {
  storage: {
    label: 'زيادة مساحة التخزين',
    tip: 'إذا عندك جدار فاضي، شوف هل يناسبه دولاب طويل. وخَلّ الأغراض اليومية قريبة من سطح العمل.',
  },
  prep: {
    label: 'توسيع مساحة التحضير',
    tip: 'اترك مساحة بجانب الحوض للتقطيع والتحضير. حدّد مكان الأجهزة الصغيرة عشان يبقى السطح فاضي.',
  },
  seating: {
    label: 'تخصيص مكان للجلوس',
    tip: 'احسب مكان الكراسي وهي مسحوبة. إذا ضاق الممر، جرّب الجلوس عند طرف المطبخ.',
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
    title.textContent = 'تغيّرت اختياراتك';
    copy.textContent = 'اضغط على «شاهد التوزيع المناسب» لعرض النتيجة الجديدة.';
    tip.hidden = true;
    quoteLink.hidden = true;
  });
}

function initializeQuote(form) {
  const config = window.futureKitConfig ?? {};
  const whatsapp = /^9665\d{8}$/.test(config.whatsapp) ? 'https://wa.me/' + config.whatsapp : '';
  const storeWhatsapp = document.querySelector('#store-whatsapp');
  const storeMap = document.querySelector('#store-map');
  if (whatsapp) {
    storeWhatsapp.href = whatsapp;
    storeWhatsapp.hidden = false;
    document.querySelector('#quote-method').textContent = 'تقدر ترسل الطلب على واتساب بعد ما تراجعه.';
  }
  if (/^https:\/\/(maps\.app\.goo\.gl\/|www\.google\.com\/maps\/)/.test(config.mapUrl)) {
    storeMap.href = config.mapUrl;
    storeMap.hidden = false;
  }

  const selection = document.querySelector('#selection');
  const pageUrl = new URL(location.href);
  const key = pageUrl.searchParams.get('design');
  const project = pageUrl.searchParams.get('project');
  const finishKey = pageUrl.searchParams.get('finish');
  const finishSelection = document.querySelector('#finish-selection');
  let selectedFinish = Object.hasOwn(finishes, finishKey) ? finishes[finishKey].title : '';
  if (selectedFinish) {
    document.querySelector('#selected-finish').textContent = 'الخامات المختارة: ' + selectedFinish;
    finishSelection.hidden = false;
  }
  document.querySelector('#clear-finish').addEventListener('click', () => {
    selectedFinish = '';
    finishSelection.hidden = true;
    pageUrl.searchParams.delete('finish');
    history.replaceState(null, '', pageUrl.href);
    form.elements.notes.focus();
  });
  const priority = pageUrl.searchParams.get('priority');
  if (Object.hasOwn(projectOptions, project)) form.elements.project.value = projectOptions[project];
  if (Object.hasOwn(priorityOptions, priority)) form.elements.priority.value = priority;
  let selectedDesign = Object.hasOwn(designCopy, key) ? designCopy[key].title : '';
  if (selectedDesign) {
    document.querySelector('#selected-design').textContent = 'التصميم المختار: ' + selectedDesign;
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
        fields[name].setCustomValidity('عبّئ هذا الحقل.');
        fields[name].reportValidity();
        return;
      }
    }
    const phone = phoneField.value
      .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
      .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
      .replace(/[\s()-]/g, '');
    if (!/^(?:\+966|00966|966|0)?5\d{8}$/.test(phone)) {
      phoneField.setCustomValidity('أدخل رقم جوال سعودي. مثال 0501234567.');
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
    if (selectedFinish) message.push('الخامات المختارة: ' + selectedFinish);
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
      ? 'تأكد من البيانات، ثم افتح واتساب وأرسل طلبك.'
      : 'تقدر تنسخ الطلب أو تحمّله. زر الإرسال غير متاح حاليًا.';
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
      requestStatus.textContent = 'حدّدنا النص لك. انسخه من قائمة جهازك.';
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
