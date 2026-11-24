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
    description: "تصلح الجزيرة للتحضير والجلوس. راجع عرض الممر ومساحة فتح الأدراج قبل تحديد حجمها.",
  },
  "island-ivory": {
    layout: "مطبخ بجزيرة",
    title: "جزيرة عاجية بسطح ممتد",
    description: "يمتد السطح فوق جهة الجلوس. حدّد عدد المقاعد ومكانها قبل اعتماد طول الجزيرة.",
  },
  "island-graphite": {
    layout: "مطبخ بجزيرة",
    title: "جزيرة حجرية وواجهات فحمية",
    description: "تضم الوحدات الطويلة الأجهزة ومساحات التخزين، ويظل سطح الجزيرة متاحًا للتحضير.",
  },
  "island-walnut": {
    layout: "مطبخ بجزيرة",
    title: "جزيرة عريضة مع خزائن الجوز",
    description: "تستوعب الجزيرة مساحة عمل مشتركة. حدّد موقع المقابس مع مسار التوصيلات قبل اعتماد التركيب.",
  },
  "ivory": {
    layout: "مطبخ زاوية",
    title: "واجهات رملية مطفية",
    description: "توزيع على جدارين مع مساحة مفتوحة في الوسط. افحص طريقة فتح خزانة الزاوية قبل اختيار التجهيز الداخلي.",
  },
  "corner-oak": {
    layout: "مطبخ زاوية",
    title: "زاوية من البلوط الفاتح",
    description: "الركن يربط منطقتي التحضير والغسيل. راجع موضع الحوض بحيث يبقى سطح العمل متصلًا وقريبًا من الموقد.",
  },
  "corner-espresso": {
    layout: "مطبخ زاوية",
    title: "زاوية بواجهات جوز داكنة",
    description: "يمكن توزيع الأدراج العميقة على الجانب الأقرب إلى الموقد. تساعد الإضاءة تحت الخزائن في توضيح سطح العمل الداكن.",
  },
  "corner-taupe": {
    layout: "مطبخ زاوية",
    title: "زاوية بخزائن رمادية دافئة",
    description: "تركز الوحدات الطويلة التخزين في طرف المطبخ، وتترك الجزء الأقرب إلى الزاوية لسطح التحضير.",
  },
  "linear": {
    layout: "مطبخ مستقيم",
    title: "بلوط فاتح على جدار واحد",
    description: "بعد وضع الحوض والموقد، تحقّق من طول سطح التحضير المتاح بينهما.",
  },
  "linear-shaker": {
    layout: "مطبخ مستقيم",
    title: "مطبخ مستقيم بواجهات مؤطّرة",
    description: "يفيد توحيد مواقع الأجهزة على الجدار في إبقاء الفراغ المقابل متاحًا للحركة. راجع أماكن المقابس والشفاط مبكرًا.",
  },
  "linear-ash": {
    layout: "مطبخ مستقيم",
    title: "خشب فاتح وأجهزة مدمجة",
    description: "استفد من ارتفاع الجدار للتخزين، وضع الأدوات اليومية في الوحدات الأسهل وصولًا.",
  },
  "galley": {
    layout: "مطبخ متوازٍ",
    title: "خشب داكن على جدارين متقابلين",
    description: "عند القياس، راجع عرض الممر بعد فتح الأدراج وباب غسالة الأطباق.",
  },
  "galley-sage": {
    layout: "مطبخ متوازٍ",
    title: "مطبخ متوازٍ بواجهات مريمية",
    description: "يمكن تخصيص جانب للغسيل والتحضير والآخر للطهي. تأكد من بقاء الممر مريحًا لمن يستخدم الجانبين.",
  },
  "galley-warmwood": {
    layout: "مطبخ متوازٍ",
    title: "مطبخ متوازٍ بخشب دافئ",
    description: "راجِع فتح الأجهزة في الجهتين، خصوصًا إذا كانت الأبواب المتقابلة تُفتح في الوقت نفسه.",
  },
  "walnut": {
    layout: "مطبخ على ثلاثة جدران",
    title: "واجهات بلون الجوز",
    description: "يجمع التوزيع الحوض والموقد وسطح التحضير حول مساحة عمل واحدة. اختر تجهيز الزوايا بحسب ما تخزّنه فيها.",
  },
  "u-sand": {
    layout: "مطبخ على ثلاثة جدران",
    title: "خزائن رملية على ثلاثة جدران",
    description: "تساعد المساحة المتصلة على توزيع التحضير والغسيل. راجع مواضع المقابض والأدراج قرب الركنين.",
  },
  "u-forest": {
    layout: "مطبخ على ثلاثة جدران",
    title: "أخضر داكن مع سطح حجري",
    description: "يمكن أن تستفيد الوحدات من الركنين معًا. حدد مواقع أدوات الطبخ اليومية قبل اختيار آليات السحب.",
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
    document.querySelector('#design-layout').textContent = design.layout;
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
