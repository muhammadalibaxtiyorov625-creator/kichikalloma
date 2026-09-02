/* ============ Yordamchi ============ */
var kaAll = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
var kaOne = function (sel, ctx) { return (ctx || document).querySelector(sel); };

/* ============ Navbar scroll ============ */
var kaNavPill = kaOne('#navPill');
window.addEventListener('scroll', function () {
    if (kaNavPill) {
        kaNavPill.classList.toggle('scrolled', window.scrollY > 10);
    }
}, { passive: true });

/* ============ Mobil menyu ============ */
var kaMenuBtn = kaOne('#menuBtn');
var kaMobileMenu = kaOne('#mobileMenu');

if (kaMenuBtn && kaMobileMenu) {
    kaMenuBtn.addEventListener('click', function () {
        kaMobileMenu.classList.toggle('open');
        kaMenuBtn.classList.toggle('open');
    });

    kaAll('#mobileMenu a').forEach(function (link) {
        link.addEventListener('click', function () {
            kaMobileMenu.classList.remove('open');
            kaMenuBtn.classList.remove('open');
        });
    });
}

/* ============ Lang Dropdown & i18n Tarjima Tizimi ============ */
var i18nData = {
    UZ: {
        nav_sayyoralar: "Sayyoralar",
        nav_qanday: "Qanday ishlaydi",
        nav_afzalliklar: "Afzalliklar",
        nav_panel: "Ota-onalar paneli",
        nav_sertifikat: "Sertifikat",
        nav_cta: "Sayohatni boshlash",
        hero_badge: "Kosmik ta'lim ekotizimi",
        hero_title: 'Farzandingizning ekran vaqtini uning <span class="hl">kelajagi uchun sarmoyaga</span> aylantiring.',
        hero_sub: "Kichik Alloma — sun'iy intellekt yordamida bolalarni mustaqil fikrlashga, intizomga va o'z hissiyotlarini boshqarishga o'rgatuvchi yagona kosmik ta'lim ekotizimi.",
        hero_cta_primary: "Sayohatni boshlash",
        hero_cta_ghost: "Qanday ishlaydi?",
        planets_badge: "Kosmik ekotizim",
        planets_title: "Hayot uchun kerakli 8 ta eng muhim ko'nikma.",
        planets_sub: "Har bir sayyora ularning yashirin salohiyatini ochishga yordam beradi",
        mercury_title: "Merkuriy",
        mercury_skill: "Kasblar",
        mercury_desc: "Kelajak kasblarini kashf etish va maqsad qo'yish.",
        venus_title: "Venera",
        venus_skill: "Virtual do'kon",
        venus_desc: "O'z mehnati bilan topgan tangalarini to'g'ri sarflash.",
        earth_title: "Yer",
        earth_skill: "Kognitiv ta'lim",
        earth_desc: "Sokratik AI-ustoz bilan mustaqil fikrlashni o'rganish.",
        mars_title: "Mars",
        mars_skill: "Jismoniy faollik",
        mars_desc: "Ekrandan uzilib, real tana harakatlarini bajarish.",
        jupiter_title: "Yupiter",
        jupiter_skill: "O'z-o'zini boshqarish",
        jupiter_desc: "Kunlik reja tuzish va vaqtni to'g'ri taqsimlash.",
        saturn_title: "Saturn",
        saturn_skill: "Matematika",
        saturn_desc: "Mantiqiy fikrlashni kuchaytiruvchi bosqichli masalalar.",
        uranus_title: "Uran",
        uranus_skill: "Ingliz tili",
        uranus_desc: "Faol so'z boyligi va to'g'ri talaffuz amaliyoti.",
        neptune_title: "Neptun",
        neptune_skill: "Emotsional savodxonlik",
        neptune_desc: "Kichkintoyning o'z hissiyotlarini tushunishi va boshqarishi.",
        how_badge: "Pedagogik yondashuv",
        how_title: "Qiziqishdan amaliy natijagacha 4 qadam.",
        how_step1_title: "Maqsadli sayohat",
        how_step1_desc: "Bola Quyosh tizimidagi o'zi kashf etmoqchi bo'lgan qobiliyat sayyorasini tanlaydi.",
        how_step2_title: "Fikrlab o'rganish",
        how_step2_desc: "Sun'iy intellekt bolaning o'rniga vazifani bajarmaydi. U yo'naltiruvchi savollar orqali bolani to'g'ri javob topishga undaydi.",
        how_step3_title: "Amaliy harakat",
        how_step3_desc: "O'qish, mashq qilish yoki o'z hissiyotlarini yozish orqali missiya yakunlanadi.",
        how_step4_title: "Munosib mukofot",
        how_step4_desc: "Har bir to'g'ri qadam uchun 'Gold Coin' yig'iladi. Bu bolada o'z mehnati samarasini ko'rish hissini uyg'otadi.",
        benefits_badge: "Farqlar",
        benefits_title: "An'anaviy ta'limdan nimasi bilan farq qiladi?",
        benefits_card1_title: "Tayyor javoblar yo'q",
        benefits_card1_desc: "AI-ustoz muammoning yechimini aytmaydi, uni qanday yechishni o'rgatadi. Bola o'ylashga majbur bo'ladi.",
        benefits_card2_title: "Sog'lom chegaralar",
        benefits_card2_desc: "Bolangiz gadjetga qaram bo'lib qolmaydi. Kunlik 20-daqiqalik cheklov ularni rejalashtirishga va qadriga yetishga o'rgatadi.",
        benefits_card3_title: "Faqat dars emas, hayotiy ko'nikma",
        benefits_card3_desc: "Ilova nafaqat matematika, balki jismoniy faollik va psixologik barqarorlikni (Neptun) ham qamrab oladi.",
        benefits_card4_title: "O'yin orqali iqtisodiyot",
        benefits_card4_desc: "Virtual Venera do'koni orqali bola pul ishlash, yig'ish va sarflash tushunchalarini amalda o'rganadi.",
        parents_badge: "Ota-onalar paneli",
        parents_title: "Sizning xotirjamligingiz va to'liq tahlil.",
        form_title: "Farzandingiz kelajagi uchun hoziroq boshlang.",
        form_sub: "Ro'yxatdan o'ting — kosmik sayohatlarda biz bilan birga bo'ling.",
        form_label_name: "Ism",
        form_placeholder_name: "Masalan: Dilnoza",
        form_label_phone: "Telefon raqam",
        form_placeholder_phone: "+998 __ ___ __ __",
        form_label_message: "Xabar",
        form_placeholder_message: "Xabar yozing...",
        form_submit: "Yuborish",
        form_note: "Ma'lumotlaringiz xavfsiz saqlanadi.",
        team_badge: "Jamoa",
        team_title: "Jamoamiz",
        role_ceo: "Asoschi & CEO",
        role_mobile: "Mobil dasturchi",
        role_phd: "Filologiya fanlari doktori DSc",
        role_uiux: "UX/UI dizayner",
        role_graphic: "Grafik dizayner",
        role_dev: "Dasturchi",
        cert_badge: "E'tirof",
        cert_title: "Har bir yutuq munosib e'tirof etiladi.",
        cert_desc: "8 ta olam missiyalarini muvaffaqiyatli yakunlagan mitti kashfiyotchilar o'zlarining birinchi \"Kosmik Sertifikati\"ni qo'lga kiritadilar. Bu ularning kelajakdagi katta zafarlari sari ishonchli qadamdir.",
        cta_title: 'Minglab zamonaviy ota-onalar qatoriga qo\'shiling va <span class="hl">Kichik Alloma </span>bilan haqiqiy rivojlanishni bugun boshlang.',
        cta_btn: "Hozir boshlash",
        footer_contact: "Aloqa uchun:",
        footer_rights: "Kichik Alloma. Barcha huquqlar himoyalangan."
    },
    RU: {
        nav_sayyoralar: "Планеты",
        nav_qanday: "Как это работает",
        nav_afzalliklar: "Преимущества",
        nav_panel: "Панель родителей",
        nav_sertifikat: "Сертификат",
        nav_cta: "Начать путешествие",
        hero_badge: "Космическая экосистема образования",
        hero_title: 'Превратите экранное время вашего ребенка в <span class="hl">инвестицию в его будущее</span>.',
        hero_sub: "Kichik Alloma — единственная космическая образовательная экосистема с ИИ, обучающая детей самостоятельному мышлению, дисциплине и управлению эмоциями.",
        hero_cta_primary: "Начать путешествие",
        hero_cta_ghost: "Как это работает?",
        planets_badge: "Космическая экосистема",
        planets_title: "8 важнейших навыков для жизни.",
        planets_sub: "Каждая планета помогает раскрыть их скрытый потенциал",
        mercury_title: "Меркурий",
        mercury_skill: "Профессии",
        mercury_desc: "Открытие профессий будущего и постановка целей.",
        venus_title: "Венера",
        venus_skill: "Виртуальный магазин",
        venus_desc: "Разумное расходование монет, заработанных честным трудом.",
        earth_title: "Земля",
        earth_skill: "Когнитивное обучение",
        earth_desc: "Обучение самостоятельному мышлению с Сократическим ИИ-наставником.",
        mars_title: "Марс",
        mars_skill: "Физическая активность",
        mars_desc: "Отрыв от экрана и выполнение реальных физических упражнений.",
        jupiter_title: "Юпитер",
        jupiter_skill: "Самоуправление",
        jupiter_desc: "Составление дневного плана и правильное распределение времени.",
        saturn_title: "Сатурн",
        saturn_skill: "Математика",
        saturn_desc: "Пошаговые задачи, развивающие логическое мышление.",
        uranus_title: "Уран",
        uranus_skill: "Английский язык",
        uranus_desc: "Практика активного словарного запаса и правильного произношения.",
        neptune_title: "Нептун",
        neptune_skill: "Эмоциональный интеллект",
        neptune_desc: "Понимание и управление своими эмоциями для малышей.",
        how_badge: "Педагогический подход",
        how_title: "4 шага от интереса к практическому результату.",
        how_step1_title: "Целевое путешествие",
        how_step1_desc: "Ребенок выбирает планету навыков в Солнечной системе, которую хочет исследовать.",
        how_step2_title: "Обучение размышляя",
        how_step2_desc: "ИИ не делает работу за ребенка. Он наводящими вопросами побуждает ребенка найти правильный ответ.",
        how_step3_title: "Практическое действие",
        how_step3_desc: "Миссия завершается через чтение, физические упражнения или запись эмоций.",
        how_step4_title: "Заслуженная награда",
        how_step4_desc: "За каждый правильный шаг начисляется 'Gold Coin'. Это вызывает чувство гордости за свой труд.",
        benefits_badge: "Отличия",
        benefits_title: "Чем отличается от традиционного образования?",
        benefits_card1_title: "Нет готовых ответов",
        benefits_card1_desc: "ИИ-наставник не дает готовое решение, а учит, как его найти. Ребенок учится думать.",
        benefits_card2_title: "Здоровые границы",
        benefits_card2_desc: "Ваш ребенок не станет зависимым от гаджетов. Дневной лимит в 20 минут учит планированию.",
        benefits_card3_title: "Не просто уроки, а жизненные навыки",
        benefits_card3_desc: "Приложение охватывает не только математику, но и физическую активность и эмоциональную стабильность.",
        benefits_card4_title: "Экономика через игру",
        benefits_card4_desc: "Через магазин Венеры ребенок на практике изучает заработок, накопление и трату денег.",
        parents_badge: "Панель родителей",
        parents_title: "Ваше спокойствие и полный анализ.",
        form_title: "Начните ради будущего вашего ребенка прямо сейчас.",
        form_sub: "Зарегистрируйтесь — присоединяйтесь к нам в космических путешествиях.",
        form_label_name: "Имя",
        form_placeholder_name: "Например: Дильноза",
        form_label_phone: "Номер телефона",
        form_placeholder_phone: "+998 __ ___ __ __",
        form_label_message: "Сообщение",
        form_placeholder_message: "Напишите сообщение...",
        form_submit: "Отправить",
        form_note: "Ваши данные надежно защищены.",
        team_badge: "Команда",
        team_title: "Наша команда",
        role_ceo: "Основатель & CEO",
        role_mobile: "Мобильный разработчик",
        role_phd: "Доктор филологических наук DSc",
        role_uiux: "UX/UI дизайнер",
        role_graphic: "Графический дизайнер",
        role_dev: "Разработчик",
        cert_badge: "Признание",
        cert_title: "Каждое достижение по достоинству оценивается.",
        cert_desc: "Юные исследователи, успешно завершившие 8 космических миссий, получают свой первый «Космический сертификат». Это уверенный шаг к их будущим победам.",
        cta_title: 'Присоединяйтесь к тысячам современных родителей и начните настоящее развитие с <span class="hl">Kichik Alloma </span>уже сегодня.',
        cta_btn: "Начать сейчас",
        footer_contact: "Контакты:",
        footer_rights: "Kichik Alloma. Все права защищены."
    },
    EN: {
        nav_sayyoralar: "Planets",
        nav_qanday: "How it works",
        nav_afzalliklar: "Benefits",
        nav_panel: "Parents panel",
        nav_sertifikat: "Certificate",
        nav_cta: "Start journey",
        hero_badge: "Cosmic education ecosystem",
        hero_title: 'Turn your child\'s screen time into an <span class="hl">investment in their future</span>.',
        hero_sub: "Kichik Alloma is the only cosmic education ecosystem powered by AI that teaches children independent thinking, discipline, and emotional management.",
        hero_cta_primary: "Start journey",
        hero_cta_ghost: "How it works?",
        planets_badge: "Cosmic ecosystem",
        planets_title: "8 essential skills for life.",
        planets_sub: "Each planet helps unlock their hidden potential",
        mercury_title: "Mercury",
        mercury_skill: "Professions",
        mercury_desc: "Discovering future professions and setting goals.",
        venus_title: "Venus",
        venus_skill: "Virtual shop",
        venus_desc: "Spending coins earned by own hard work wisely.",
        earth_title: "Earth",
        earth_skill: "Cognitive learning",
        earth_desc: "Learning independent thinking with Socratic AI mentor.",
        mars_title: "Mars",
        mars_skill: "Physical activity",
        mars_desc: "Unplugging from screens and performing physical exercises.",
        jupiter_title: "Jupiter",
        jupiter_skill: "Self-management",
        jupiter_desc: "Creating a daily plan and managing time properly.",
        saturn_title: "Saturn",
        saturn_skill: "Mathematics",
        saturn_desc: "Step-by-step problems strengthening logical thinking.",
        uranus_title: "Uranus",
        uranus_skill: "English language",
        uranus_desc: "Active vocabulary practice and correct pronunciation.",
        neptune_title: "Neptune",
        neptune_skill: "Emotional literacy",
        neptune_desc: "Understanding and managing emotions for young learners.",
        how_badge: "Pedagogical approach",
        how_title: "4 steps from interest to practical results.",
        how_step1_title: "Targeted journey",
        how_step1_desc: "The child chooses the skill planet in the Solar System they want to discover.",
        how_step2_title: "Learning by thinking",
        how_step2_desc: "AI doesn't do the task for the child. It prompts them with guiding questions to find the correct answer.",
        how_step3_title: "Practical action",
        how_step3_desc: "The mission is completed through reading, exercise, or journaling emotions.",
        how_step4_title: "Deserved reward",
        how_step4_desc: "Gold Coins are collected for each correct step. This builds a sense of achievement.",
        benefits_badge: "Benefits",
        benefits_title: "How does it differ from traditional education?",
        benefits_card1_title: "No ready answers",
        benefits_card1_desc: "AI mentor doesn't give answers, it teaches how to solve them. The child learns to think.",
        benefits_card2_title: "Healthy boundaries",
        benefits_card2_desc: "Your child won't get addicted to gadgets. A 20-minute daily limit teaches planning and value.",
        benefits_card3_title: "Not just lessons, but life skills",
        benefits_card3_desc: "The app covers not only math, but also physical activity and psychological resilience.",
        benefits_card4_title: "Financial literacy through play",
        benefits_card4_desc: "Through the Venus virtual shop, kids learn earning, saving, and spending in practice.",
        parents_badge: "Parents panel",
        parents_title: "Your peace of mind and complete analytics.",
        form_title: "Start right now for your child's future.",
        form_sub: "Sign up — join us on space journeys.",
        form_label_name: "Name",
        form_placeholder_name: "Example: Dilnoza",
        form_label_phone: "Phone number",
        form_placeholder_phone: "+998 __ ___ __ __",
        form_label_message: "Message",
        form_placeholder_message: "Write a message...",
        form_submit: "Submit",
        form_note: "Your data is kept safe.",
        team_badge: "Team",
        team_title: "Our team",
        role_ceo: "Founder & CEO",
        role_mobile: "Mobile developer",
        role_phd: "Doctor of Philological Sciences DSc",
        role_uiux: "UX/UI designer",
        role_graphic: "Graphic designer",
        role_dev: "Developer",
        cert_badge: "Recognition",
        cert_title: "Every achievement is properly recognized.",
        cert_desc: "Little explorers who successfully complete all 8 space missions earn their first \"Cosmic Certificate\". This is a confident step toward their future triumphs.",
        cta_title: 'Join thousands of modern parents and start real growth with <span class="hl">Kichik Alloma </span>today.',
        cta_btn: "Start now",
        footer_contact: "Contact us:",
        footer_rights: "Kichik Alloma. All rights reserved."
    }
};

function setLanguage(lang) {
    if (!i18nData[lang]) lang = 'UZ';
    try { localStorage.setItem('ka_lang', lang); } catch (e) {}

    kaAll('.currentLang').forEach(function (el) {
        el.textContent = lang;
    });

    kaAll('.lang-option').forEach(function (opt) {
        if (opt.getAttribute('data-lang') === lang) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });

    var dict = i18nData[lang];

    // Oddiy matnlarni almashtirish
    kaAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    // HTML tegli matnlarni almashtirish
    kaAll('[data-i18n-html]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-html');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // Placeholderlarni almashtirish
    kaAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            el.setAttribute('placeholder', dict[key]);
        }
    });

    if (typeof window.updateMobileStepLanguage === 'function') {
        window.updateMobileStepLanguage(dict);
    }
}

function initDropdowns() {
    var dropdowns = kaAll('.lang-dropdown');

    dropdowns.forEach(function (dropdown) {
        var btn = kaOne('.lang-btn', dropdown);
        if (!btn) return;
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdowns.forEach(function (d) { if (d !== dropdown) d.classList.remove('open'); });
            dropdown.classList.toggle('open');
        });
    });

    var allOptions = kaAll('.lang-option');
    allOptions.forEach(function (option) {
        option.addEventListener('click', function () {
            var selectedLang = this.getAttribute('data-lang');
            setLanguage(selectedLang);
            dropdowns.forEach(function (d) { d.classList.remove('open'); });
        });
    });

    document.addEventListener('click', function (e) {
        dropdowns.forEach(function (d) {
            if (!d.contains(e.target)) {
                d.classList.remove('open');
            }
        });
    });

    var savedLang = 'UZ';
    try { savedLang = localStorage.getItem('ka_lang') || 'UZ'; } catch (e) {}
    setLanguage(savedLang);
}

initDropdowns();

/* ============ Reveal on scroll ============ */
var kaRevealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            kaRevealIO.unobserve(entry.target);
        }
    });
}, { threshold: .15 });
kaAll('.reveal').forEach(function (el) { kaRevealIO.observe(el); });

/* ============ Yulduzli osmon ============ */
kaAll('.starfield').forEach(function (field) {
    var kaN = parseInt(field.getAttribute('data-stars'), 10) || 60;
    for (var kaI = 0; kaI < kaN; kaI++) {
        var kaStar = document.createElement('i');
        var kaSize = (Math.random() * 2.2 + 1).toFixed(1);
        kaStar.style.left = (Math.random() * 100).toFixed(2) + '%';
        kaStar.style.top = (Math.random() * 100).toFixed(2) + '%';
        kaStar.style.width = kaSize + 'px';
        kaStar.style.height = kaSize + 'px';
        kaStar.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
        kaStar.style.animationDuration = (2.5 + Math.random() * 3).toFixed(2) + 's';
        field.appendChild(kaStar);
    }
});

/* ============ Marquee nusxalash (cheksiz lenta) ============ */
var kaTrack = kaOne('#marqueeTrack');
if (kaTrack) {
    kaTrack.innerHTML += kaTrack.innerHTML;
}

/* ============ Team Marquee — cheksiz loop uchun kartalar ikkilantiriladi ============ */
var kaTeamMarquee = kaOne('#teamMarquee');
if (kaTeamMarquee) {
    kaTeamMarquee.innerHTML += kaTeamMarquee.innerHTML;
}

/* Hero Video Control & Scale Animatsiyasi */
(function initHeroVideoPlayer() {
    var heroFig = kaOne('.hero-figure');
    var heroVideo = kaOne('#heroVideo');
    var videoBtn = kaOne('#videoBtn');

    if (!heroFig || !heroVideo || !videoBtn) return;

    heroFig.style.willChange = 'transform';
    heroFig.style.transformOrigin = 'center top';

    var autoPlayTriggered = false;

    function updateVideoScaleAndPlay() {
        var rect = heroFig.getBoundingClientRect();
        var vh = window.innerHeight;
        var rawProgress = 1 - (rect.top / vh);
        var progress = Math.max(0, Math.min(1, rawProgress / 0.45));
        var scale = 0.90 + progress * 0.10;

        heroFig.style.transform = 'scale(' + scale.toFixed(4) + ')';

        /* Video 100% scale holatiga yetganda bir marta avtomatik ijro bo'ladi */
        if (scale >= 0.999 && !autoPlayTriggered) {
            autoPlayTriggered = true;
            heroVideo.play().then(function () {
                videoBtn.classList.add('playing');
            }).catch(function (error) {
                console.log("Autoplay brauzer tomonidan bloklandi:", error);
            });
        }
    }

    /* Manual Play/Pause bosilganda */
    videoBtn.addEventListener('click', function () {
        if (heroVideo.paused) {
            heroVideo.play();
            videoBtn.classList.add('playing');
        } else {
            heroVideo.pause();
            videoBtn.classList.remove('playing');
        }
    });

    heroVideo.addEventListener('play', function () {
        videoBtn.classList.add('playing');
    });

    heroVideo.addEventListener('pause', function () {
        videoBtn.classList.remove('playing');
    });

    window.addEventListener('scroll', updateVideoScaleAndPlay, { passive: true });
    updateVideoScaleAndPlay();
})();

/* ============ Forma (Backend /api/messages API ulanishi) ============ */
var kaForm = kaOne('#waitlistForm');
var kaSubmit = kaOne('#submitBtn');
if (kaForm && kaSubmit) {
    kaForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!kaForm.reportValidity()) return;

        var nameInput = kaOne('#fname');
        var phoneInput = kaOne('#fphone');
        var messageInput = kaOne('#fmessage');

        var payload = {
            name: nameInput ? nameInput.value.trim() : '',
            phone: phoneInput ? phoneInput.value.trim() : '',
            message: messageInput ? messageInput.value.trim() : ''
        };

        var origBtnText = kaSubmit.innerHTML;
        kaSubmit.disabled = true;
        kaSubmit.innerHTML = 'Yuborilmoqda…';

        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            kaSubmit.disabled = false;
            kaSubmit.innerHTML = origBtnText;
            if (data.error) {
                kaShowToast("Xatolik: " + data.error);
            } else {
                kaForm.reset();
                kaShowToast("Rahmat! Xabaringiz muvaffaqiyatli yuborildi. Tez orada bog'lanamiz.");
            }
        })
        .catch(function (err) {
            kaSubmit.disabled = false;
            kaSubmit.innerHTML = origBtnText;
            kaShowToast("Tarmoqda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
        });
    });
}

function kaShowToast(msg) {
    var kaToast = kaOne('#toast');
    if (!kaToast) return;
    kaOne('#toastMsg').textContent = msg;
    kaToast.classList.add('show');
    clearTimeout(kaToast._kaTimer);
    kaToast._kaTimer = setTimeout(function () { kaToast.classList.remove('show'); }, 3600);
}

/* ============ Yil ============ */
var yearEl = kaOne('#year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

/* ============ Sayyora Kartalari Scroll Grid Animation ============ */
(function initPlanetCardsAnimation() {
    var section = kaOne('.cosmos');
    var stack = kaOne('#planetCardStack');
    var navControls = kaOne('#planetNavControls');
    var prevBtn = kaOne('#planetPrevBtn');
    var nextBtn = kaOne('#planetNextBtn');
    var pageIndicator = kaOne('#planetPageIndicator');

    if (!section || !stack) return;

    var cards = kaAll('.planet-card-item', stack);
    if (cards.length === 0) return;

    var currentPage = 0; // 0 = 1-sahifa (1-4 sayyora), 1 = 2-sahifa (5-8 sayyora)

    var COLS = 4;
    var CARD_W = 260;
    var CARD_H = 215;
    var GAP_X = 26;

    function getFinalPositions() {
        var positions = [];
        var totalW = COLS * CARD_W + (COLS - 1) * GAP_X;
        var startX = -totalW / 2 + CARD_W / 2;
        for (var c = 0; c < COLS; c++) {
            positions.push({ x: startX + c * (CARD_W + GAP_X), y: 0 });
        }
        return positions;
    }
    var finals = getFinalPositions();

    var initials = [0, 1, 2, 3].map(function (i) {
        var offset = i - 1.5;
        return {
            x: offset * 8,
            y: offset * 5,
            r: offset * 2.2,
            s: 1 - Math.abs(offset) * 0.02
        };
    });

    function getProgress() {
        var rect = section.getBoundingClientRect();
        var scrollHeight = section.offsetHeight - window.innerHeight;
        if (scrollHeight <= 0) return 0;
        var scrolled = -rect.top;
        return Math.max(0, Math.min(1, scrolled / scrollHeight));
    }

    var ease = function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; };

    function render() {
        if (window.innerWidth < 992) {
            cards.forEach(function (card) {
                card.style.display = 'block';
                card.style.transform = '';
                card.style.opacity = '';
                card.style.zIndex = '';
                card.classList.remove('opened');
            });
            stack.style.transform = '';
            return;
        }

        var p = getProgress();
        var ep = ease(p);
        var isFullyOpened = p >= 0.70;

        // Chevron knopkalari 0.8 scroll qismida paydo bo'ladi
        if (p >= 0.80) {
            if (navControls) navControls.classList.add('visible');
        } else {
            if (navControls) navControls.classList.remove('visible');
        }

        var startIdx = currentPage * 4;
        var endIdx = startIdx + 4;

        cards.forEach(function (card, index) {
            if (index < startIdx || index >= endIdx) {
                card.style.display = 'none';
                return;
            }

            card.style.display = 'block';
            var i = index - startIdx;
            var ini = initials[i];
            var fin = finals[i];

            var x = ini.x + (fin.x - ini.x) * ep;
            var y = ini.y + (fin.y - ini.y) * ep;
            var r = ini.r * (1 - ep);
            var s = ini.s + (1 - ini.s) * ep;

            var opacity = 0.95 + 0.05 * Math.min(1, p * 3);

            card.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg) scale(' + s + ')';
            card.style.opacity = opacity;
            card.style.zIndex = Math.round(ep * 10) + 1;

            if (isFullyOpened) {
                card.classList.add('opened');
            } else {
                card.classList.remove('opened');
            }
        });

        scaleStage();
    }

    function scaleStage() {
        if (window.innerWidth < 992) return;

        var gridW = COLS * CARD_W + (COLS - 1) * GAP_X; // 1118
        var gridH = CARD_H; // 215

        var parentW = stack.parentElement.clientWidth;
        var parentH = window.innerHeight - 200;

        var scaleW = parentW / gridW;
        var scaleH = parentH / gridH;

        var scale = Math.min(1, scaleW, scaleH);
        stack.style.transform = 'scale(' + scale + ')';
    }

    function switchPlanetPage(page) {
        currentPage = page;
        if (pageIndicator) pageIndicator.textContent = (currentPage + 1) + ' / 2';
        render();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            switchPlanetPage(currentPage === 0 ? 1 : 0);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            switchPlanetPage(currentPage === 0 ? 1 : 0);
        });
    }

    window.addEventListener('scroll', render, { passive: true });
    window.addEventListener('resize', render);
    render();
})();

/* ============ Pedagogik Yondashuv — Desktop + Mobil Sticky Animatsiya ============ */
(function () {
    /* ==================== DESKTOP ANIMATSIYA ==================== */
    function initDesktopAnimation() {
        var stickySection = document.querySelector('#qanday.section-sticky');
        var cardsInner = document.getElementById('cardsInner');
        if (!stickySection || !cardsInner) return;

        var cards = Array.prototype.slice.call(cardsInner.querySelectorAll('.card'));
        var imgWrapper = document.getElementById('pedagogyImageWrapper');
        if (!imgWrapper) return;
        var slides = Array.prototype.slice.call(imgWrapper.querySelectorAll('.image-slide'));
        var totalCards = cards.length;
        if (totalCards === 0) return;

        function getMetrics() {
            var wrapper = cardsInner.parentElement;
            var wrapperH = wrapper ? wrapper.offsetHeight : 520;
            var firstCard = cards[0];
            var cardH = firstCard ? firstCard.offsetHeight : 120;
            var computedGap = parseInt(window.getComputedStyle(cardsInner).gap) || 20;
            return { wrapperH: wrapperH, cardH: cardH, gap: computedGap };
        }

        var m = getMetrics();
        var WRAPPER_HEIGHT = m.wrapperH;
        var CARD_HEIGHT = m.cardH;
        var GAP = m.gap;
        var INITIAL_OFFSET = WRAPPER_HEIGHT - CARD_HEIGHT - 40;
        var currentTranslate = INITIAL_OFFSET;
        var targetTranslate = INITIAL_OFFSET;
        var isAnimating = false;

        function lerp(s, e, f) { return s + (e - s) * f; }

        var segmentBoundaries = [0, 0.22, 0.48, 0.74, 1.0];

        function updateOnScroll() {
            m = getMetrics();
            WRAPPER_HEIGHT = m.wrapperH;
            CARD_HEIGHT = m.cardH;
            GAP = m.gap;
            INITIAL_OFFSET = WRAPPER_HEIGHT - CARD_HEIGHT - 40;

            var rect = stickySection.getBoundingClientRect();
            var sectionH = stickySection.offsetHeight;
            var viewportH = window.innerHeight;
            var scrolled = -rect.top;
            var scrollable = sectionH - viewportH;
            if (scrollable <= 0) return;
            var progress = Math.max(0, Math.min(1, scrolled / scrollable));

            var activeIndex = totalCards - 1;
            for (var si = 0; si < totalCards; si++) {
                if (progress < segmentBoundaries[si + 1]) { activeIndex = si; break; }
            }

            var centerPos = WRAPPER_HEIGHT / 2 - CARD_HEIGHT / 2;
            var cardPos = activeIndex * (CARD_HEIGHT + GAP);
            targetTranslate = -(cardPos - centerPos);
            if (progress < 0.03) targetTranslate = INITIAL_OFFSET;

            if (Math.abs(currentTranslate - targetTranslate) > 0.5) {
                currentTranslate = lerp(currentTranslate, targetTranslate, 0.12);
                isAnimating = true;
            } else {
                currentTranslate = targetTranslate;
                isAnimating = false;
            }
            cardsInner.style.transform = 'translateY(' + currentTranslate + 'px)';

            cards.forEach(function (c, i) { c.classList.toggle('active', i === activeIndex); });
            slides.forEach(function (s, i) { s.classList.toggle('active', i === activeIndex); });
        }

        function animate() {
            if (isAnimating) updateOnScroll();
            requestAnimationFrame(animate);
        }

        window.addEventListener('scroll', updateOnScroll, { passive: true });
        window.addEventListener('resize', function () {
            m = getMetrics();
            WRAPPER_HEIGHT = m.wrapperH;
            CARD_HEIGHT = m.cardH;
            GAP = m.gap;
            INITIAL_OFFSET = WRAPPER_HEIGHT - CARD_HEIGHT - 40;
            updateOnScroll();
        });
        requestAnimationFrame(function () {
            m = getMetrics();
            WRAPPER_HEIGHT = m.wrapperH;
            CARD_HEIGHT = m.cardH;
            GAP = m.gap;
            INITIAL_OFFSET = WRAPPER_HEIGHT - CARD_HEIGHT - 40;
            currentTranslate = INITIAL_OFFSET;
            targetTranslate = INITIAL_OFFSET;
            updateOnScroll();
        });
        animate();
    }

    /* ==================== MOBIL ANIMATSIYA ==================== */
    var STEPS = [
        { number: "01", title: "Maqsadli sayohat", subtitle: "Bola Quyosh tizimidagi o'zi kashf etmoqchi bo'lgan qobiliyat sayyorasini tanlaydi.", image: "img/how1.jpg", alt: "Maqsadli sayohat" },
        { number: "02", title: "Fikrlab o'rganish", subtitle: "Sun'iy intellekt bolaning o'rniga vazifani bajarmaydi. U yo'naltiruvchi savollar orqali bolani to'g'ri javob topishga undaydi.", image: "img/how2.jpg", alt: "Fikrlab o'rganish" },
        { number: "03", title: "Amaliy harakat", subtitle: "O'qish, mashq qilish yoki o'z hissiyotlarini yozish orqali missiya yakunlanadi.", image: "img/how3.jpg", alt: "Amaliy harakat" },
        { number: "04", title: "Munosib mukofot", subtitle: "Har bir to'g'ri qadam uchun 'Gold Coin' yig'iladi. Bu bolada o'z mehnati samarasini ko'rish hissini uyg'otadi.", image: "img/how4.jpg", alt: "Munosib mukofot" }
    ];

    var mobileInitialized = false;
    var mobileCurrentStep = -1;
    var mobileContainer, mobileCard, mobileNumber, mobileTitle, mobileSubtitle, mobileSlides, mobileDots;

    function buildMobileLayout() {
        mobileContainer = document.getElementById('mobileStepContainer');
        if (!mobileContainer || mobileInitialized) return;
        mobileInitialized = true;

        mobileContainer.innerHTML = `
<div class="mobile-step-card active" id="mobileStepCard">
    <div class="mobile-step-image-wrap" id="mobileImageWrap">
        ${STEPS.map(function (s, i) {
            return `<img src="${s.image}" alt="${s.alt}" class="mob-slide-img ${i === 0 ? 'active' : ''}">`;
        }).join('')}
    </div>
    <div class="mobile-step-content">
        <div class="mobile-step-number" id="mobileStepNumber">${STEPS[0].number}</div>
        <div class="mobile-step-text">
            <div class="mobile-step-title" id="mobileStepTitle">${STEPS[0].title}</div>
            <div class="mobile-step-subtitle" id="mobileStepSubtitle">${STEPS[0].subtitle}</div>
        </div>
    </div>
</div>
<div class="mobile-progress" id="mobileProgress">
    ${STEPS.map(function (_, i) {
            return `<div class="mobile-progress-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></div>`;
        }).join('')}
</div>
`;

        mobileCard = document.getElementById('mobileStepCard');
        mobileNumber = document.getElementById('mobileStepNumber');
        mobileTitle = document.getElementById('mobileStepTitle');
        mobileSubtitle = document.getElementById('mobileStepSubtitle');
        mobileSlides = mobileContainer.querySelectorAll('.mob-slide-img');
        mobileDots = mobileContainer.querySelectorAll('.mobile-progress-dot');
    }

    function updateMobileStep() {
        if (window.innerWidth > 991) return;
        if (!mobileInitialized) buildMobileLayout();

        var section = document.querySelector('#qanday.section-sticky');
        if (!section || !mobileCard) return;

        var rect = section.getBoundingClientRect();
        var sectionH = section.offsetHeight;
        var viewportH = window.innerHeight;
        var scrolled = -rect.top;
        var scrollable = sectionH - viewportH;
        if (scrollable <= 0) return;

        var progress = Math.max(0, Math.min(1, scrolled / scrollable));
        var stepIndex = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));

        if (stepIndex === mobileCurrentStep) return;
        mobileCurrentStep = stepIndex;

        var step = STEPS[stepIndex];

        if (mobileNumber) mobileNumber.textContent = step.number;
        if (mobileTitle) mobileTitle.textContent = step.title;
        if (mobileSubtitle) mobileSubtitle.textContent = step.subtitle;

        if (mobileSlides) {
            mobileSlides.forEach(function (sl, i) {
                sl.classList.toggle('active', i === stepIndex);
            });
        }

        if (mobileDots) {
            mobileDots.forEach(function (d, i) {
                d.classList.toggle('active', i === stepIndex);
            });
        }

        mobileCard.classList.add('active');
    }

    window.updateMobileStepLanguage = function (dict) {
        if (!dict) return;
        if (dict.how_step1_title) STEPS[0].title = dict.how_step1_title;
        if (dict.how_step1_desc) STEPS[0].subtitle = dict.how_step1_desc;
        if (dict.how_step2_title) STEPS[1].title = dict.how_step2_title;
        if (dict.how_step2_desc) STEPS[1].subtitle = dict.how_step2_desc;
        if (dict.how_step3_title) STEPS[2].title = dict.how_step3_title;
        if (dict.how_step3_desc) STEPS[2].subtitle = dict.how_step3_desc;
        if (dict.how_step4_title) STEPS[3].title = dict.how_step4_title;
        if (dict.how_step4_desc) STEPS[3].subtitle = dict.how_step4_desc;

        mobileCurrentStep = -1;
        updateMobileStep();
    };

    function onScroll() {
        if (window.innerWidth < 992) {
            updateMobileStep();
        }
    }

    function onResize() {
        if (window.innerWidth < 992) {
            if (!mobileInitialized) buildMobileLayout();
            mobileCurrentStep = -1;
            updateMobileStep();
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', function () {
        setTimeout(onResize, 150);
    });

    if (window.innerWidth < 992) {
        buildMobileLayout();
        updateMobileStep();
    } else {
        initDesktopAnimation();
    }

    var lastMode = window.innerWidth < 992 ? 'mobile' : 'desktop';
    window.addEventListener('resize', function () {
        var newMode = window.innerWidth < 992 ? 'mobile' : 'desktop';
        if (newMode === 'desktop' && lastMode === 'mobile') {
            initDesktopAnimation();
        }
        lastMode = newMode;
    });
})();
