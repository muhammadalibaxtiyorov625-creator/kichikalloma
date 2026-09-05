/* ============ Yordamchi ============ */
var kaAll = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
var kaOne = function (sel, ctx) { return (ctx || document).querySelector(sel); };
var kaFixImgUrl = function (url, fallback) {
    if (!url) return fallback || '';
    try {
        var u = new URL(url, window.location.origin);
        return u.pathname;
    } catch (e) {
        return url;
    }
};

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
        stat_visitors: "Umumiy tashriflar",
        stat_planets: "Sayyoralar soni",
        stat_team: "Jamoadoshlar soni",
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
        how_swipe_hint: "Yuqoriga suring",
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
        stat_visitors: "Всего визитов",
        stat_planets: "Количество планет",
        stat_team: "Наша команда",
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
        how_swipe_hint: "Смахните вверх",
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
        stat_visitors: "Total Visitors",
        stat_planets: "Skill Planets",
        stat_team: "Team Members",
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
        how_swipe_hint: "Swipe up",
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

/* ============ COSMOS STATS ANIMATED COUNTER & BACKEND ============ */
function animateCounter(el, target, duration, hasPlus) {
    if (!el) return;
    var startTime = null;
    duration = duration || 1800;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        var current = Math.floor(ease * target);
        el.textContent = current.toLocaleString('en-US') + (hasPlus && progress === 1 ? '+' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            el.textContent = target.toLocaleString('en-US') + (hasPlus ? '+' : '');
        }
    }
    window.requestAnimationFrame(step);
}

function initCosmosStats() {
    var statsBanner = kaOne('#cosmosStats');
    if (!statsBanner) return;

    var animated = false;
    var statsData = {
        visitors: 1,
        planets: 8,
        teams: 6
    };

    function runCounters() {
        if (animated) return;
        animated = true;

        var visEl = kaOne('#statVisitors');
        var plEl = kaOne('#statPlanets');
        var tmEl = kaOne('#statTeam');

        if (visEl) animateCounter(visEl, statsData.visitors, 1800, false);
        if (plEl) animateCounter(plEl, statsData.planets, 1200, false);
        if (tmEl) animateCounter(tmEl, statsData.teams, 1400, false);
    }

    // Backend statistikasini olish va real API ma'lumotlari bilan yangilash
    fetch('/api/website/stats')
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
            if (!data) return;

            if (typeof data.totalVisitors === 'number') {
                statsData.visitors = data.totalVisitors;
            }
            if (typeof data.totalPlanets === 'number') {
                statsData.planets = data.totalPlanets;
            }
            if (typeof data.totalTeams === 'number') {
                statsData.teams = data.totalTeams;
            }

            var visEl = kaOne('#statVisitors');
            var plEl = kaOne('#statPlanets');
            var tmEl = kaOne('#statTeam');

            if (animated) {
                if (visEl) animateCounter(visEl, statsData.visitors, 1000, false);
                if (plEl) animateCounter(plEl, statsData.planets, 800, false);
                if (tmEl) animateCounter(tmEl, statsData.teams, 800, false);
            }
        })
        .catch(function () {});

    // Saytga tashrifni serverda real hisoblab borish
    try {
        fetch('/api/website/track-visit', { method: 'POST' })
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (res) {
                if (res && typeof res.totalVisitors === 'number') {
                    statsData.visitors = res.totalVisitors;
                    var visEl = kaOne('#statVisitors');
                    if (visEl && animated) {
                        animateCounter(visEl, statsData.visitors, 800, false);
                    }
                }
            })
            .catch(function () {});
    } catch (e) {}

    // Scroll qilib kelganda animatsiyani ishga tushirish
    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCounters();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        obs.observe(statsBanner);
    } else {
        runCounters();
    }
}

initCosmosStats();

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

    function togglePlayPause() {
        if (heroVideo.paused) {
            heroVideo.muted = false;
            heroVideo.volume = 1.0;
            var p = heroVideo.play();
            if (p !== undefined) {
                p.then(function () {
                    videoBtn.classList.add('playing');
                }).catch(function (err) {
                    console.log("Play unmuted blocked, falling back to muted:", err);
                    heroVideo.muted = true;
                    heroVideo.play().then(function () {
                        videoBtn.classList.add('playing');
                    });
                });
            }
        } else {
            heroVideo.pause();
            videoBtn.classList.remove('playing');
        }
    }

    /* Video yoki tugma bosilganda o'ynash/to'xtatish */
    videoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePlayPause();
    });

    heroVideo.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePlayPause();
    });

    heroVideo.addEventListener('play', function () {
        heroVideo.muted = false;
        videoBtn.classList.add('playing');
    });

    heroVideo.addEventListener('pause', function () {
        videoBtn.classList.remove('playing');
    });

    var autoPlayTriggered = false;
    function updateVideoScaleAndPlay() {
        var rect = heroFig.getBoundingClientRect();
        var vh = window.innerHeight;
        var rawProgress = 1 - (rect.top / vh);
        var progress = Math.max(0, Math.min(1, rawProgress / 0.45));
        var scale = 0.90 + progress * 0.10;

        heroFig.style.transform = 'scale(' + scale.toFixed(4) + ')';

        if (scale >= 0.999 && !autoPlayTriggered) {
            autoPlayTriggered = true;
            heroVideo.muted = false;
            heroVideo.volume = 1.0;
            heroVideo.play().then(function () {
                videoBtn.classList.add('playing');
            }).catch(function () {
                heroVideo.muted = true;
                heroVideo.play().then(function () {
                    videoBtn.classList.add('playing');
                }).catch(function () {});
            });
        }
    }

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

        fetch('/api/website/messages', {
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

/* ============ BACKEND: Jamoa a'zolarini yuklash (/api/website/teams) ============
   HTML ni o'zgartirmasdan, mavjud #teamMarquee ni dinamik to'ldiradi.
   Agar API javob bermasa, HTML dagi statik kontent o'z holatida qoladi.
============================================================================ */
(function loadTeamsFromApi() {
    var marquee = kaOne('#teamMarquee');
    if (!marquee) return;

    fetch('/api/website/teams')
        .then(function (res) {
            if (!res.ok) throw new Error('teams api error');
            return res.json();
        })
        .then(function (teams) {
            if (!Array.isArray(teams) || teams.length === 0) return;

            // Cheksiz silliq marquee uchun ikki marta takrorlaymiz
            var list = teams.concat(teams);
            var html = list.map(function (m) {
                var name = ((m.first_name || '') + ' ' + (m.last_name || '')).trim();
                var role = m.role || '';
                var img  = kaFixImgUrl(m.image, 'img/team1.jpg');
                return '<div class="team-card">' +
                    '<div class="team-img-wrap">' +
                        '<img src="' + img + '" alt="' + name + '" class="team-img" ' +
                            'onerror="this.src=\'img/team1.jpg\'">' +
                    '</div>' +
                    '<div class="team-info">' +
                        '<div class="team-name">' + name + '</div>' +
                        '<div class="team-role">' + role + '</div>' +
                    '</div>' +
                '</div>';
            }).join('');

            marquee.innerHTML = html;
        })
        .catch(function () {
            /* API javob bermasa, HTML dagi statik kontent qoladi */
        });
})();

/* ============ BACKEND: Sayyoralar ma'lumotlarini yuklash (/api/website/planets) ============
   Mavjud sayyora kartalari va modalini API dan olingan haqiqiy 3D rasm va tavsiflar bilan yangilaydi.
============================================================================ */
(function loadPlanetsFromApi() {
    fetch('/api/website/planets')
        .then(function (res) {
            if (!res.ok) throw new Error('planets api error');
            return res.json();
        })
        .then(function (planets) {
            if (!Array.isArray(planets) || planets.length === 0) return;

            // Sayyora kaliti (data-planet) bilan API nomlari o'rtasidagi lug'at
            var planetKeyMap = {
                merkuriy: ['kasb', 'ijod', 'merkur'],
                venera: ['virtual', "do'kon", 'dokon', 'magazin', 'vener'],
                yer: ['kognitiv', 'tutor', 'yer', 'earth'],
                mars: ['jismoniy', 'faollik', 'sport', 'harakat', 'mars'],
                yupiter: ['boshqarish', 'intizom', 'reja', 'vaqt', 'yupiter', 'jupiter'],
                saturn: ['matematika', 'mantiq', 'saturn'],
                uran: ['ingliz', "lug'at", 'lugat', 'til', 'uran'],
                neptun: ['emotsional', 'hissiyot', 'savodxonlik', 'neptun']
            };

            var cards = kaAll('.planet-card-item[data-planet]');
            cards.forEach(function (card) {
                var key = (card.getAttribute('data-planet') || '').toLowerCase();
                var keywords = planetKeyMap[key] || [key];

                var match = planets.find(function (p) {
                    var title = (p.title || '').toLowerCase();
                    return keywords.some(function (kw) { return title.indexOf(kw) !== -1; });
                });
                if (!match) return;

                // 1. Rasmni backend 3D rasmiga yangilash
                var imgEl = kaOne('.planet-card-img', card);
                if (imgEl && match.image) {
                    imgEl.src = kaFixImgUrl(match.image, imgEl.src);
                }

                // 2. Yo'nalish / Sarlavha (Skill) matnini yangilash
                var skillEl = kaOne('.planet-card-skill', card);
                if (skillEl && match.title) {
                    skillEl.textContent = match.title;
                }

                // 3. Tavsifni yangilash
                var descEl = kaOne('.planet-card-desc', card);
                if (descEl && match.description) {
                    descEl.textContent = match.description;
                }

                // 4. Admin paneldan belgilangan gradient fonini yangilash
                var cardFront = kaOne('.planet-card-front', card);
                if (cardFront && match.gradient) {
                    cardFront.style.background = match.gradient;
                }

                // 5. Modal ma'lumotini yangilash
                if (window.planetData && window.planetData[key]) {
                    if (match.image) {
                        window.planetData[key].img = kaFixImgUrl(match.image, window.planetData[key].img);
                    }
                    if (match.title) {
                        window.planetData[key].subtitle = match.title;
                    }
                    if (match.description) {
                        window.planetData[key].desc = match.description;
                    }
                    if (match.video) {
                        window.planetData[key].video = kaFixImgUrl(match.video, window.planetData[key].video);
                    }
                    if (match.gradient) {
                        window.planetData[key].bg = match.gradient;
                    }
                }
            });
        })
        .catch(function () {
            /* API javob bermasa, HTML dagi statik matnlar qoladi */
        });
})();

/* ============ Sayyora Kartalari Yonga Scroll & Navigation ============ */
(function initPlanetCardsAnimation() {
    var stack = kaOne('#planetCardStack');
    var prevBtn = kaOne('#planetPrevBtn');
    var nextBtn = kaOne('#planetNextBtn');

    if (!stack) return;

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            stack.scrollBy({ left: -294, behavior: 'smooth' });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            stack.scrollBy({ left: 294, behavior: 'smooth' });
        });
    }
})();

/* ============ SAYYORA MA'LUMOT MODAL OYNASI ============ */
(function initPlanetModal() {
    var overlay = kaOne('#planetModalOverlay');
    var modalCard = kaOne('#planetModalCard');
    var closeBtn = kaOne('#modalCloseBtn');
    var modalImg = kaOne('#modalPlanetImg');
    var modalTitle = kaOne('#modalPlanetTitle');
    var modalSub = kaOne('#modalPlanetSub');
    var modalDesc = kaOne('#modalPlanetDesc');
    var modalFeatureHead = kaOne('#modalFeatureHead');
    var modalFeatureGrid = kaOne('#modalFeatureGrid');

    if (!overlay || !modalCard || !closeBtn) return;

    window.planetData = window.planetData || {
        merkuriy: {
            title: "Merkuriy",
            subtitle: "Sayyora: Kelajak kasblari va Qiziqishlar",
            desc: "Merkuriy — bolaning ijodiy qiziqishlari va kelajak kasblari haqidagi tasavvurini kengaytiruvchi kashfiyotlar makoni. Bu yerda bola IT dasturchi, shifokor, muhandis, rassom va fazogir kasblari bilan qiziqarli video darslar orqali tanishadi.",
            featureHead: "KASBIY YO'NALISHLAR",
            img: "img/merkuriy.png",
            bg: "linear-gradient(145deg, #ea8e00 0%, #d87d00 100%)",
            features: [
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>', title: "8 ta Kasb toifasi", sub: "IT, Tibbiyot, San'at va Muhandislik" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>', title: "Interaktiv videolar", sub: "Kasb egalari real hayoti va bilimlari" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>', title: "Mini-quiz & Gold Coin", sub: "Qiziqishlarni sinash va mukofotlar" }
            ]
        },
        venera: {
            title: "Venera",
            subtitle: "Sayyora: Virtual do'kon va Moliyaviy savodxonlik",
            desc: "Venera — bolaga o'z mehnati bilan topgan \"Gold Coin\" tangalarini to'g'ri boshqarish, jamg'arish va maqsadli sarflashni o'rgatuvchi moliyaviy ekotizim.",
            featureHead: "MOLIYAVIY KO'NIKMALAR",
            img: "img/venera.png",
            bg: "linear-gradient(145deg, #e91e63 0%, #d81b60 100%)",
            features: [
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1-1.8-1"></path><path d="M12 6v12"></path></svg>', title: "Gold Coin Jamg'armasi", sub: "O'z tangalarini hisoblash va rejalashtirish" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>', title: "Virtual Magazin", sub: "Qiziqarli buyumlarni xarid qilish" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>', title: "Daromad & Xarajat", sub: "Moliyaviy qarorlarni mustaqil qabul qilish" }
            ]
        },
        yer: {
            title: "Yer",
            subtitle: "Sayyora: Kognitiv ta'lim va AI-ustoz",
            desc: "Yer — Sokratik metod asosida ishlaydigan AI-ustoz bilan muloqot maydoni. AI bolaga tayyor javob bermaydi, balki savollar berish orqali uni mantiqiy fikrlashga undaydi.",
            featureHead: "INTELLEKTUAL RIVOJLANISH",
            img: "img/earth.png",
            bg: "linear-gradient(150deg, #037bff 20%, #00ae3f 100%)",
            features: [
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="15" x2="8" y2="17"></line><line x1="16" y1="15" x2="16" y2="17"></line></svg>', title: "Sokratik AI-Ustoz", sub: "Fikrlash va savol-javob muloqoti" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.64 2.94 1.68 3.93.77.77 1.25 1.52 1.41 2.5"></path></svg>', title: "Mantiqiy Yechimlar", sub: "Muammolarga mustaqil yechim topish" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>', title: "Chuqur Bilimlar", sub: "Keng dunyoqarash shakllantirish" }
            ]
        },
        mars: {
            title: "Mars",
            subtitle: "Sayyora: Jismoniy faollik va Salomatlik",
            desc: "Mars — bolani ekrandan uzib, harakatga keltiruvchi sport va harakatli topshiriqlar olami. Kompyuter ko'rishi texnologiyasi bolaning tana harakatlarini aniqlab baholaydi.",
            featureHead: "JISMONIY CHINIQISH",
            img: "img/mars.png",
            bg: "linear-gradient(145deg, #e53935 0%, #c62828 100%)",
            features: [
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>', title: "Interaktiv Mashqlar", sub: "Real vaqtda tana harakatlarini bajarish" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>', title: "AI-Kamera Nazorati", sub: "Harakatlarni avtomatik aniqlash va baholash" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', title: "Energiya & Intizom", sub: "Sog'lom turmush tarzini shakllantirish" }
            ]
        },
        yupiter: {
            title: "Yupiter",
            subtitle: "Sayyora: O'z-o'zini boshqarish va Taym-menejment",
            desc: "Yupiter — kunlik kun tartibini tuzish va vaqtni unumli taqsimlashni o'rgatadi. Bola kunlik 20-daqiqalik cheklov ichida rejalarini to'g'ri belgilashga ko'nikadi.",
            featureHead: "VAQTNI BOSHQARISH",
            img: "img/jupiter.png",
            bg: "linear-gradient(150deg, #004aff 0%, #00838f 100%)",
            features: [
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>', title: "20-Daqiqa Cheklovi", sub: "Sog'lom ekran vaqti va intizom" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', title: "Kunlik Rejalashtirish", sub: "Vazifalarni tartibga solish" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>', title: "Maqsadga Erishish", sub: "Kunlik natijalarni kuzatib borish" }
            ]
        },
        saturn: {
            title: "Saturn",
            subtitle: "Sayyora: Matematika va Mantiq",
            desc: "Saturn — qiziqarli bosqichli masalalar va vizual jumboqlar orqali mantiqiy hamda analitik fikrlashni rivojlantiruvchi matematik olam.",
            featureHead: "MANTIQIY TA'LIM",
            img: "img/saturn.png",
            bg: "linear-gradient(145deg, #f57c00 0%, #e65100 100%)",
            features: [
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>', title: "Bosqichli Jumboqlar", sub: "Oson va murakkab matematik masalalar" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>', title: "Mantiqiy O'yinlar", sub: "Fazo va shakllar bilan ishlash" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>', title: "Analitik Fikrlash", sub: "Tezkor va aniq hisoblash amaliyoti" }
            ]
        },
        uran: {
            title: "Uran",
            subtitle: "Sayyora: Ingliz tili va Xalqaro muloqot",
            desc: "Uran — bolaning faol so'z boyligini oshiruvchi va to'g'ri talaffuzni shakllantiruvchi zamonaviy interaktiv ingliz tili darslari.",
            featureHead: "TILLARNI O'RGANISH",
            img: "img/uran.png",
            bg: "linear-gradient(150deg, #ff688f 0%, #6a1b9a 100%)",
            features: [
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>', title: "Talaffuz Amaliyoti", sub: "Ovozni tahlil qilish va to'g'irlash" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>', title: "Interaktiv Kartochkalar", sub: "Yangi so'zlarni tez va yodda saqlash" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>', title: "Jonli Muloqot", sub: "Oddiy iboralar va muloqot ssenariylari" }
            ]
        },
        neptun: {
            title: "Neptun",
            subtitle: "Sayyora: Emotsional savodxonlik va Psixologik rivoj",
            desc: "Neptun — bolaning o'z hissiyotlarini tushunishi, kayfiyatini boshqarishi va ruhiy barqarorlikka erishishiga yordam beruvchi psixologik olam.",
            featureHead: "HISSIYOTLAR BOSHQARUVI",
            img: "img/neptun.png",
            bg: "linear-gradient(150deg, #0062f3 0%, #310089 100%)",
            features: [
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', title: "His-tuyg'ular Kundaligi", sub: "Kayfiyat va emotsiyalarni tushunish" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>', title: "Psixologik Mashqlar", sub: "Stress va xavotirni yengish" },
                { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>', title: "O'ziga Ishonch", sub: "Ijobiy fikrlash va ruhiy salomatlik" }
            ]
        }
    };

    function openPlanetModal(key) {
        var data = (window.planetData || planetData)[key];
        if (!data) return;

        if (modalImg) modalImg.src = data.img;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalSub) modalSub.textContent = data.subtitle;
        if (modalDesc) modalDesc.textContent = data.desc;
        if (modalFeatureHead) modalFeatureHead.textContent = data.featureHead;
        if (modalCard) modalCard.style.background = data.bg;

        if (modalFeatureGrid) {
            modalFeatureGrid.innerHTML = '';
            (data.features || []).forEach(function (feat) {
                var item = document.createElement('div');
                item.className = 'modal-feature-item';
                item.innerHTML = '<span class="modal-feature-icon">' + feat.icon + '</span>' +
                                 '<div class="modal-feature-title">' + feat.title + '</div>' +
                                 '<div class="modal-feature-sub">' + feat.sub + '</div>';
                modalFeatureGrid.appendChild(item);
            });

            // 4-chi Card: Sinab ko'rish (Uran uchun so'zlar & test, boshqalar uchun video dars)
            var videoSrc = data.video || '/video/video_2026-08-20_10-54-38.mp4';
            var videoItem = document.createElement('div');
            videoItem.className = 'modal-feature-item modal-feature-video-item';
            videoItem.setAttribute('role', 'button');

            if (key === 'uran') {
                videoItem.setAttribute('title', "Uran: So'z kartochkalari va Test o'yini");
                videoItem.innerHTML = '<span class="modal-feature-icon video-play-icon" style="background: linear-gradient(135deg, #ec4899, #8b5cf6) !important;">' +
                                      '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>' +
                                      '</span>' +
                                      '<div class="modal-feature-title">Sinab ko\'rish</div>' +
                                      '<div class="modal-feature-sub">So\'zlar & Test o\'yini 🎮</div>';
                videoItem.onclick = function () {
                    window.openUranPractice();
                };
            } else if (key === 'venera') {
                videoItem.setAttribute('title', "Venera: Virtual do'kon va Bolani kiyintirish");
                videoItem.innerHTML = '<span class="modal-feature-icon video-play-icon" style="background: linear-gradient(135deg, #ec4899, #f43f5e) !important;">' +
                                      '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/></svg>' +
                                      '</span>' +
                                      '<div class="modal-feature-title">Sinab ko\'rish</div>' +
                                      '<div class="modal-feature-sub">Kiyintirish & Do\'kon 🛍️</div>';
                videoItem.onclick = function () {
                    window.openVeneraShop();
                };
            } else if (key === 'neptun') {
                videoItem.setAttribute('title', "Neptun: Sehrli Hissiyotlar Daraxti");
                videoItem.innerHTML = '<span class="modal-feature-icon video-play-icon" style="background: linear-gradient(135deg, #10b981, #06b6d4) !important;">' +
                                      '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zm-1 18h2v2h-2z"/></svg>' +
                                      '</span>' +
                                      '<div class="modal-feature-title">Sinab ko\'rish</div>' +
                                      '<div class="modal-feature-sub">Hissiyotlar Daraxti 🌳</div>';
                videoItem.onclick = function () {
                    window.openNeptunTree();
                };
            } else if (key === 'saturn') {
                videoItem.setAttribute('title', "Saturn: Matematika mashqlari va Test");
                videoItem.innerHTML = '<span class="modal-feature-icon video-play-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444) !important;">' +
                                      '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 3h2v4h4v2h-4v4h-2v-4H9v-2h4V6zm-6 10h4v2H7v-2z"/></svg>' +
                                      '</span>' +
                                      '<div class="modal-feature-title">Sinab ko\'rish</div>' +
                                      '<div class="modal-feature-sub">Matematika & Test 🧮</div>';
                videoItem.onclick = function () {
                    window.openSaturnPractice();
                };
            } else if (key === 'yupiter') {
                videoItem.setAttribute('title', "Yupiter: Kunlik reja jadvali va Note eslatmalar");
                videoItem.innerHTML = '<span class="modal-feature-icon video-play-icon" style="background: linear-gradient(135deg, #0ea5e9, #2563eb) !important;">' +
                                      '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 4h-2v-2h2v2zm4 4h-2v-2h2v2z"/></svg>' +
                                      '</span>' +
                                      '<div class="modal-feature-title">Sinab ko\'rish</div>' +
                                      '<div class="modal-feature-sub">Reja Jadvali & Note 📅</div>';
                videoItem.onclick = function () {
                    window.openYupiterSchedule();
                };
            } else {
                videoItem.setAttribute('title', "Sayyora darsini videoda sinab ko'rish");
                videoItem.innerHTML = '<span class="modal-feature-icon video-play-icon">' +
                                      '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
                                      '</span>' +
                                      '<div class="modal-feature-title">Sinab ko\'rish</div>' +
                                      '<div class="modal-feature-sub">Videoni tomosha qilish</div>';
                videoItem.onclick = function () {
                    window.playPlanetModalVideo(videoSrc, data.title);
                };
            }
            modalFeatureGrid.appendChild(videoItem);
        }

        // Yangi sayyora ochilganda barcha interaktiv o'yinlarni yopiq holatda saqlash
        window.closePlanetModalVideo();
        window.closeUranPractice();
        window.closeVeneraShop();
        window.closeNeptunTree();
        window.closeSaturnPractice();
        window.closeYupiterSchedule();

        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    window.playPlanetModalVideo = function (videoUrl, planetTitle) {
        window.closeUranPractice();
        var box = kaOne('#modalVideoPlayerBox');
        var videoEl = kaOne('#modalPlanetVideoEl');
        var titleEl = kaOne('#modalVideoTitleText');
        if (!box || !videoEl) return;

        if (titleEl) titleEl.textContent = (planetTitle || 'Sayyora') + " — Sinab ko'rish darsi";
        if (videoUrl) {
            videoEl.src = videoUrl;
        }
        box.style.display = 'block';
        videoEl.muted = false;
        videoEl.volume = 1.0;

        setTimeout(function () {
            var playPromise = videoEl.play();
            if (playPromise !== undefined) {
                playPromise.catch(function () {
                    videoEl.muted = true;
                    videoEl.play();
                });
            }
            box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
    };

    window.closePlanetModalVideo = function () {
        var box = kaOne('#modalVideoPlayerBox');
        var videoEl = kaOne('#modalPlanetVideoEl');
        if (videoEl) {
            try { videoEl.pause(); } catch (e) {}
            videoEl.currentTime = 0;
        }
        if (box) box.style.display = 'none';
    };

    /* ==========================================================================
       URAN SAYYORASI: SO'Z KARTOCHKALARI VA TEST (RANDOM CARDS + AUDIO + QUIZ)
       ========================================================================== */
    var uranPracticeData = {
        cards: [],
        currentIndex: 0,
        quiz: null
    };

    // Web Speech Audio Synthesizer for English
    function speakEnglishWord(word) {
        if (!word) return;
        try {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                var u = new SpeechSynthesisUtterance(word);
                u.lang = 'en-US';
                u.rate = 0.82;
                u.pitch = 1.05;
                window.speechSynthesis.speak(u);
            }
        } catch (e) {
            console.warn('Speech synthesis error:', e);
        }
    }

    // Web Audio API sound effect (Chime for correct answer)
    function playChimeEffect(isSuccess) {
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            var ctx = new AudioCtx();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (isSuccess) {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12);
                osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
            } else {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.25);
            }
        } catch (e) {}
    }

    window.openUranPractice = function () {
        window.closePlanetModalVideo();
        window.closeVeneraShop();
        window.closeNeptunTree();
        window.closeSaturnPractice();
        window.closeYupiterSchedule();
        var box = kaOne('#modalUranPracticeBox');
        if (!box) return;
        box.style.display = 'block';
        window.refreshUranPractice();
        setTimeout(function () {
            box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    window.closeUranPractice = function () {
        var box = kaOne('#modalUranPracticeBox');
        if (box) box.style.display = 'none';
        if ('speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch(e) {}
        }
    };

    window.flipUranCard = function () {
        var card = kaOne('#uranFlashcard');
        if (card) {
            card.classList.toggle('flipped');
        }
    };

    function renderUranCurrentCard() {
        var cards = uranPracticeData.cards;
        if (!cards || cards.length === 0) return;
        var idx = uranPracticeData.currentIndex;
        var c = cards[idx];
        if (!c) return;

        var cardEl = kaOne('#uranFlashcard');
        if (cardEl) cardEl.classList.remove('flipped');

        var stepIndicator = kaOne('#uranStepIndicator');
        if (stepIndicator) stepIndicator.textContent = (idx + 1) + ' / ' + cards.length + '-so\'z';

        var wordEn = kaOne('#uranWordEn');
        if (wordEn) wordEn.textContent = c.word_en || '';

        var transcription = kaOne('#uranTranscription');
        if (transcription) transcription.textContent = c.transcription ? c.transcription : '';

        var wordUz = kaOne('#uranWordUz');
        if (wordUz) wordUz.textContent = c.word_uz || '';

        var example = kaOne('#uranWordExample');
        if (example) example.textContent = c.example_sentence ? c.example_sentence : (c.word_uz + ' — ingliz tilida ' + c.word_en);

        var imgWrap = kaOne('#uranCardImgWrap');
        var imgEl = kaOne('#uranCardImg');
        if (imgEl && imgWrap) {
            if (c.image) {
                imgEl.src = c.image;
                imgEl.style.display = 'block';
                imgWrap.style.display = 'flex';
            } else {
                imgWrap.style.display = 'none';
            }
        }

        // Dots update
        var dotsWrap = kaOne('#uranDotsWrap');
        if (dotsWrap) {
            dotsWrap.innerHTML = '';
            for (var i = 0; i < cards.length; i++) {
                var dot = document.createElement('span');
                dot.className = 'uran-dot' + (i === idx ? ' active' : '');
                dotsWrap.appendChild(dot);
            }
        }

        // Prev button
        var prevBtn = kaOne('#uranPrevCardBtn');
        if (prevBtn) {
            prevBtn.style.opacity = idx === 0 ? '0.4' : '1';
            prevBtn.style.pointerEvents = idx === 0 ? 'none' : 'auto';
        }

        // Next button
        var nextBtn = kaOne('#uranNextCardBtn');
        if (nextBtn) {
            if (idx === cards.length - 1) {
                nextBtn.innerHTML = 'Testni boshlash 🧠';
            } else {
                nextBtn.innerHTML = 'Keyingi ▶';
            }
        }

        // Auto speak current word
        speakEnglishWord(c.word_en);
    }

    window.playCurrentUranWordAudio = function () {
        var cards = uranPracticeData.cards;
        if (!cards || cards.length === 0) return;
        var c = cards[uranPracticeData.currentIndex];
        if (c && c.word_en) {
            speakEnglishWord(c.word_en);
        }
    };

    window.prevUranCard = function () {
        if (uranPracticeData.currentIndex > 0) {
            uranPracticeData.currentIndex--;
            renderUranCurrentCard();
        }
    };

    window.nextUranCard = function () {
        var cards = uranPracticeData.cards;
        if (!cards || cards.length === 0) return;

        if (uranPracticeData.currentIndex < cards.length - 1) {
            uranPracticeData.currentIndex++;
            renderUranCurrentCard();
        } else {
            // 3-4 ta kartochkadan keyin Test bosqichini boshlaymiz!
            startUranQuizStage();
        }
    };

    function startUranQuizStage() {
        var cardsStage = kaOne('#uranCardsStage');
        var quizStage = kaOne('#uranQuizStage');
        var stepIndicator = kaOne('#uranStepIndicator');

        if (cardsStage) cardsStage.style.display = 'none';
        if (quizStage) quizStage.style.display = 'block';
        if (stepIndicator) stepIndicator.textContent = '🧠 Test bosqichi';

        var quiz = uranPracticeData.quiz;
        if (!quiz) return;

        var qTitle = kaOne('#uranQuizQuestion');
        if (qTitle) qTitle.textContent = quiz.question || '«' + quiz.word_en + '» so\'zining o\'zbekcha tarjimasi qaysi?';

        var qWord = kaOne('#uranQuizWordEn');
        if (qWord) qWord.textContent = quiz.word_en;

        var feedback = kaOne('#uranQuizFeedback');
        if (feedback) feedback.style.display = 'none';

        var optionsContainer = kaOne('#uranQuizOptions');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            (quiz.options || []).forEach(function (opt) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'uran-quiz-opt-btn';
                btn.textContent = opt;
                btn.onclick = function () {
                    handleUranAnswer(opt, btn, quiz.correct);
                };
                optionsContainer.appendChild(btn);
            });
        }

        // Auto speak quiz word
        speakEnglishWord(quiz.word_en);
    }

    window.playQuizWordAudio = function () {
        var quiz = uranPracticeData.quiz;
        if (quiz && quiz.word_en) {
            speakEnglishWord(quiz.word_en);
        }
    };

    function handleUranAnswer(selected, clickedBtn, correct) {
        var allBtns = kaAll('.uran-quiz-opt-btn');
        allBtns.forEach(function (b) { b.disabled = true; });

        var feedback = kaOne('#uranQuizFeedback');
        var fbIcon = kaOne('#uranFeedbackIcon');
        var fbText = kaOne('#uranFeedbackText');

        if (selected === correct) {
            clickedBtn.classList.add('correct');
            playChimeEffect(true);
            if (fbIcon) fbIcon.textContent = '🎉';
            if (fbText) fbText.innerHTML = 'To\'g\'ri topdingiz! <strong>«' + correct + '»</strong> barakalla! 🏆';
        } else {
            clickedBtn.classList.add('wrong');
            playChimeEffect(false);
            allBtns.forEach(function (b) {
                if (b.textContent === correct) {
                    b.classList.add('correct');
                }
            });
            if (fbIcon) fbIcon.textContent = '💡';
            if (fbText) fbText.innerHTML = 'To\'g\'ri javob: <strong>«' + correct + '»</strong> edi. Harakatni davom eting!';
        }

        if (feedback) feedback.style.display = 'block';
    }

    window.refreshUranPractice = function () {
        var cardsStage = kaOne('#uranCardsStage');
        var quizStage = kaOne('#uranQuizStage');
        if (cardsStage) cardsStage.style.display = 'block';
        if (quizStage) quizStage.style.display = 'none';

        var stepIndicator = kaOne('#uranStepIndicator');
        if (stepIndicator) stepIndicator.textContent = 'Yuklanmoqda...';

        fetch('/api/website/uran/practice?count=3')
            .then(function (res) {
                if (!res.ok) throw new Error('Api error');
                return res.json();
            })
            .then(function (data) {
                if (!data || !data.cards || data.cards.length === 0) throw new Error('No cards');
                uranPracticeData.cards = data.cards;
                uranPracticeData.currentIndex = 0;
                uranPracticeData.quiz = data.quiz;
                renderUranCurrentCard();
            })
            .catch(function () {
                // Fallback default sample cards if offline
                uranPracticeData.cards = [
                    { word_en: 'Apple', word_uz: 'Olma', transcription: '[ˈæp.əl]', example_sentence: 'I like red sweet apple.' },
                    { word_en: 'Book', word_uz: 'Kitob', transcription: '[bʊk]', example_sentence: 'Open your English book.' },
                    { word_en: 'Star', word_uz: 'Yulduz', transcription: '[stɑːr]', example_sentence: 'Look at the bright star in the sky.' }
                ];
                uranPracticeData.currentIndex = 0;
                uranPracticeData.quiz = {
                    word_en: 'Apple',
                    correct: 'Olma',
                    question: '«Apple» so\'zining o\'zbekcha tarjimasi qaysi?',
                    options: ['Olma', 'Kitob', 'Yulduz', 'Qalam']
                };
                renderUranCurrentCard();
            });
    };

    /* ==========================================================================
       SATURN SAYYORASI: MATEMATIKA MAShQLARI VA TEST (MATH CARDS + QUIZ)
       ========================================================================== */
    var saturnPracticeData = {
        cards: [],
        currentIndex: 0,
        quiz: null
    };

    function speakMathText(text) {
        if (!text) return;
        try {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                var u = new SpeechSynthesisUtterance(text);
                u.lang = 'uz-UZ';
                u.rate = 0.9;
                u.pitch = 1.05;
                window.speechSynthesis.speak(u);
            }
        } catch (e) {}
    }

    window.openSaturnPractice = function () {
        window.closePlanetModalVideo();
        window.closeUranPractice();
        window.closeVeneraShop();
        window.closeNeptunTree();
        window.closeYupiterSchedule();

        var box = kaOne('#modalSaturnPracticeBox');
        if (!box) return;
        box.style.display = 'block';
        window.refreshSaturnPractice();
        setTimeout(function () {
            box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    window.closeSaturnPractice = function () {
        var box = kaOne('#modalSaturnPracticeBox');
        if (box) box.style.display = 'none';
        if ('speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch(e) {}
        }
    };

    window.flipSaturnCard = function () {
        var card = kaOne('#saturnFlashcard');
        if (card) {
            card.classList.toggle('flipped');
        }
    };

    function renderSaturnCurrentCard() {
        var cards = saturnPracticeData.cards;
        if (!cards || cards.length === 0) return;
        var idx = saturnPracticeData.currentIndex;
        var c = cards[idx];
        if (!c) return;

        var cardEl = kaOne('#saturnFlashcard');
        if (cardEl) cardEl.classList.remove('flipped');

        var stepIndicator = kaOne('#saturnStepIndicator');
        if (stepIndicator) stepIndicator.textContent = (idx + 1) + ' / ' + cards.length + '-mashq';

        var badgeEl = kaOne('#saturnCardTag');
        if (badgeEl) badgeEl.textContent = c.badge || "Matematika amali 🧮";

        var visualEl = kaOne('#saturnCardVisual');
        if (visualEl) visualEl.textContent = c.visual || '';

        var problemEl = kaOne('#saturnCardProblem');
        if (problemEl) problemEl.textContent = c.problem || '';

        var answerEl = kaOne('#saturnCardAnswer');
        if (answerEl) answerEl.textContent = "Javob: " + c.answer;

        var explanationEl = kaOne('#saturnCardExplanation');
        if (explanationEl) explanationEl.textContent = c.explanation || '';

        // Dots
        var dotsWrap = kaOne('#saturnDotsWrap');
        if (dotsWrap) {
            dotsWrap.innerHTML = '';
            for (var i = 0; i < cards.length; i++) {
                var dot = document.createElement('span');
                dot.className = 'saturn-dot' + (i === idx ? ' active' : '');
                dotsWrap.appendChild(dot);
            }
        }

        // Prev button
        var prevBtn = kaOne('#saturnPrevCardBtn');
        if (prevBtn) {
            prevBtn.style.opacity = idx === 0 ? '0.4' : '1';
            prevBtn.style.pointerEvents = idx === 0 ? 'none' : 'auto';
        }

        // Next button
        var nextBtn = kaOne('#saturnNextCardBtn');
        if (nextBtn) {
            if (idx === cards.length - 1) {
                nextBtn.innerHTML = 'Testni boshlash 🧠 ▶';
            } else {
                nextBtn.innerHTML = 'Keyingi ▶';
            }
        }
    }

    window.playCurrentSaturnAudio = function () {
        // Saturn ovozi o'chirildi (user request)
    };

    window.prevSaturnCard = function () {
        if (saturnPracticeData.currentIndex > 0) {
            saturnPracticeData.currentIndex--;
            renderSaturnCurrentCard();
        }
    };

    window.nextSaturnCard = function () {
        var cards = saturnPracticeData.cards;
        if (!cards || cards.length === 0) return;

        if (saturnPracticeData.currentIndex < cards.length - 1) {
            saturnPracticeData.currentIndex++;
            renderSaturnCurrentCard();
        } else {
            startSaturnQuizStage();
        }
    };

    function startSaturnQuizStage() {
        var cardsStage = kaOne('#saturnCardsStage');
        var quizStage = kaOne('#saturnQuizStage');
        var stepIndicator = kaOne('#saturnStepIndicator');

        if (cardsStage) cardsStage.style.display = 'none';
        if (quizStage) quizStage.style.display = 'block';
        if (stepIndicator) stepIndicator.textContent = '🧠 Test bosqichi';

        var quiz = saturnPracticeData.quiz;
        if (!quiz) return;

        var qTitle = kaOne('#saturnQuizQuestion');
        if (qTitle) qTitle.textContent = quiz.question || 'Misolni hisoblang:';

        var qVisual = kaOne('#saturnQuizVisual');
        if (qVisual) qVisual.textContent = quiz.visual || '';

        var feedback = kaOne('#saturnQuizFeedback');
        if (feedback) feedback.style.display = 'none';

        var optionsContainer = kaOne('#saturnQuizOptions');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            (quiz.options || []).forEach(function (opt) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'saturn-quiz-opt-btn';
                btn.textContent = opt;
                btn.onclick = function () {
                    handleSaturnAnswer(opt, btn, quiz.correct, quiz.explanation);
                };
                optionsContainer.appendChild(btn);
            });
        }
    }

    window.playSaturnQuizAudio = function () {
        // Saturn ovozi o'chirildi (user request)
    };

    function handleSaturnAnswer(selected, clickedBtn, correct, explanation) {
        var allBtns = kaAll('.saturn-quiz-opt-btn');
        allBtns.forEach(function (b) { b.disabled = true; });

        var feedback = kaOne('#saturnQuizFeedback');
        var fbIcon = kaOne('#saturnFeedbackIcon');
        var fbText = kaOne('#saturnFeedbackText');

        if (selected === correct) {
            clickedBtn.classList.add('correct');
            playChimeEffect(true);
            if (fbIcon) fbIcon.textContent = '🎉';
            if (fbText) fbText.innerHTML = 'To\'g\'ri topdingiz! <strong>«' + correct + '»</strong> barakalla! 🏆<br><small>' + (explanation || '') + '</small>';
        } else {
            clickedBtn.classList.add('wrong');
            playChimeEffect(false);
            allBtns.forEach(function (b) {
                if (b.textContent === correct) {
                    b.classList.add('correct');
                }
            });
            if (fbIcon) fbIcon.textContent = '💡';
            if (fbText) fbText.innerHTML = 'To\'g\'ri javob: <strong>«' + correct + '»</strong> edi.<br><small>' + (explanation || '') + '</small>';
        }

        if (feedback) feedback.style.display = 'block';
    }

    window.refreshSaturnPractice = function () {
        var cardsStage = kaOne('#saturnCardsStage');
        var quizStage = kaOne('#saturnQuizStage');
        if (cardsStage) cardsStage.style.display = 'block';
        if (quizStage) quizStage.style.display = 'none';

        var stepIndicator = kaOne('#saturnStepIndicator');
        if (stepIndicator) stepIndicator.textContent = 'Yuklanmoqda...';

        fetch('/api/website/saturn/practice?count=3')
            .then(function (res) {
                if (!res.ok) throw new Error('API');
                return res.json();
            })
            .then(function (data) {
                if (!data || !data.cards || data.cards.length === 0) throw new Error('No cards');
                saturnPracticeData.cards = data.cards;
                saturnPracticeData.currentIndex = 0;
                saturnPracticeData.quiz = data.quiz;
                renderSaturnCurrentCard();
            })
            .catch(function () {
                saturnPracticeData.cards = [
                    {
                        badge: "Qo'shish amali ➕",
                        problem: "3 + 4 = ?",
                        visual: "🍎 🍎 🍎  +  🍎 🍎 🍎 🍎",
                        answer: "7",
                        explanation: "3 ta olmaga 4 ta olma qo'shilsa, jami 7 ta olma bo'ladi: 3 + 4 = 7",
                        audio_text: "Uchga to'rtni qo'shganda yetti bo'ladi."
                    },
                    {
                        badge: "Ayirish amali ➖",
                        problem: "8 - 3 = ?",
                        visual: "⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐  ➖  ⭐ ⭐ ⭐",
                        answer: "5",
                        explanation: "8 ta yulduzdan 3 tasi olinsa, 5 ta yulduz qoladi: 8 - 3 = 5",
                        audio_text: "Sakkizdan uchni ayirsak besh qoladi."
                    },
                    {
                        badge: "Mantiqiy jumboq 🧩",
                        problem: "Daraxtda 5 ta qushcha bor edi. Yana 3 tasi keldi. Jami nechta?",
                        visual: "🦜 🦜 🦜 🦜 🦜  ➕  🦜 🦜 🦜",
                        answer: "8",
                        explanation: "5 ga 3 ni qo'shganda 8 ta qushcha bo'ladi!",
                        audio_text: "Beshga uchni qo'shsak sakkiz ta bo'ladi."
                    }
                ];
                saturnPracticeData.currentIndex = 0;
                saturnPracticeData.quiz = {
                    question: "6 + 3 yig'indisi nechiga teng?",
                    visual: "🍇🍇🍇🍇🍇🍇  +  🍇🍇🍇",
                    correct: "9",
                    options: ["7", "8", "9", "10"],
                    explanation: "6 ga 3 ni qo'shganda 9 bo'ladi!",
                    audio_text: "Oltiga uchni qo'shsak necha bo'ladi? To'qqiz!"
                };
                renderSaturnCurrentCard();
            });
    };

    /* ==========================================================================
       VENERA SAYYORASI: VIRTUAL DO'KON VA KIYINTIRISH (WARDROBE & DRESS UP)
       ========================================================================== */
    var veneraWardrobeData = {
        coins: 200,
        currentTab: 'outfits',
        inventory: {
            outfits: ['default', 'doppi'],
            backdrops: ['space', 'registan']
        },
        equipped: {
            outfit: 'default',
            backdrop: 'space'
        },
        categories: [
            {
                id: 'outfits',
                name: 'Haqiqiy 3D Liboslar',
                icon: '🥋',
                items: [
                    {
                        id: 'default',
                        name: 'Asl Milliy Libos',
                        icon: '👘',
                        image: 'img/venera_boy.png?v=3',
                        price: 0,
                        desc: 'O\'zining qulay milliy yaktagi'
                    },
                    {
                        id: 'doppi',
                        name: 'Milliy Do\'ppi & Zar Chopon',
                        icon: '🇺🇿',
                        image: 'img/wardrobe_doppi.jpg',
                        price: 30,
                        desc: 'Zardo\'zi saroy choponi va O\'zbek milliy do\'ppisi'
                    },
                    {
                        id: 'crown',
                        name: 'Qirollik Toji & Shohona Libos',
                        icon: '👑',
                        image: 'img/wardrobe_crown.jpg',
                        price: 45,
                        desc: 'Oltin toj, qimmatbaho javohirlar va qizil plash'
                    },
                    {
                        id: 'astronaut',
                        name: 'Fazogir & Kosmik Shlem',
                        icon: '🚀',
                        image: 'img/wardrobe_astronaut.jpg',
                        price: 50,
                        desc: 'Haqiqiy kosmonavt skafandri va koinot dubulg\'asi'
                    },
                    {
                        id: 'scientist',
                        name: 'Bilimdon Alloma & Professor',
                        icon: '🎓',
                        image: 'img/wardrobe_scientist.jpg',
                        price: 35,
                        desc: 'Akademik shlyapa, ko\'zoynak va oq xalat'
                    },
                    {
                        id: 'superhero',
                        name: 'Super Alloma Qahramon',
                        icon: '🦸',
                        image: 'img/wardrobe_superhero.jpg',
                        price: 40,
                        desc: 'Yulduzli qahramonlik zirhi va qudratli qizil plash'
                    },
                    {
                        id: 'sport',
                        name: 'Zamonaviy Sportchi & Gamer',
                        icon: '🧢',
                        image: 'img/wardrobe_sport.jpg',
                        price: 25,
                        desc: 'Sport kastyumi, kepka, quyosh ko\'zoynagi va naushnik'
                    }
                ]
            },
            {
                id: 'backdrops',
                name: 'Sehrli Fonlar',
                icon: '🌌',
                items: [
                    { id: 'space', name: 'Koinot & Venera', icon: '🪐', price: 0, desc: 'Yulduzli koinot va sayyoralar bag\'rida' },
                    { id: 'registan', name: 'Registon Saroyi', icon: '🏛️', price: 20, desc: 'Samarqand va Buxoro qadimiy madaniyati' },
                    { id: 'future_lab', name: 'Kelajak Markazi', icon: '🧪', price: 25, desc: 'Yuqori texnologiyalar laboratoriyasi' },
                    { id: 'cozy_room', name: 'Kutubxona Xonasi', icon: '📚', price: 15, desc: 'Shinamgina allomalar kutubxonasi' }
                ]
            }
        ]
    };

    var veneraOutfitDetails = {
        default: {
            src: 'img/venera_boy.png?v=3',
            title: 'Asl Milliy Libos',
            desc: 'O\'zining qulay milliy yaktagi'
        },
        doppi: {
            src: 'img/wardrobe_doppi.jpg',
            title: 'Milliy Do\'ppi & Zar Chopon',
            desc: 'Zardo\'zi saroy choponi va O\'zbek milliy do\'ppisi'
        },
        crown: {
            src: 'img/wardrobe_crown.jpg',
            title: 'Qirollik Toji & Shohona Libos',
            desc: 'Oltin toj, qimmatbaho javohirlar va qizil plash'
        },
        astronaut: {
            src: 'img/wardrobe_astronaut.jpg',
            title: 'Fazogir & Kosmik Shlem',
            desc: 'Haqiqiy kosmonavt skafandri va koinot dubulg\'asi'
        },
        scientist: {
            src: 'img/wardrobe_scientist.jpg',
            title: 'Bilimdon Alloma & Professor',
            desc: 'Akademik shlyapa, ko\'zoynak va oq xalat'
        },
        superhero: {
            src: 'img/wardrobe_superhero.jpg',
            title: 'Super Alloma Qahramon',
            desc: 'Yulduzli qahramonlik zirhi va qudratli qizil plash'
        },
        sport: {
            src: 'img/wardrobe_sport.jpg',
            title: 'Zamonaviy Sportchi & Gamer',
            desc: 'Sport kastyumi, kepka, quyosh ko\'zoynagi va naushnik'
        }
    };

    window.openVeneraShop = function () {
        window.closePlanetModalVideo();
        window.closeUranPractice();
        window.closeNeptunTree();
        window.closeSaturnPractice();
        window.closeYupiterSchedule();
        var box = kaOne('#modalVeneraShopBox');
        if (!box) return;
        box.style.display = 'block';

        fetch('/api/website/venera/wardrobe')
            .then(function (res) {
                if (!res.ok) throw new Error('API');
                return res.json();
            })
            .then(function (data) {
                if (data && data.categories) {
                    veneraWardrobeData.categories = data.categories;
                    if (data.character && typeof data.character.coins === 'number') {
                        veneraWardrobeData.coins = data.character.coins;
                    }
                }
                renderVeneraShopUI();
            })
            .catch(function () {
                renderVeneraShopUI();
            });

        setTimeout(function () {
            box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    window.closeVeneraShop = function () {
        var box = kaOne('#modalVeneraShopBox');
        if (box) box.style.display = 'none';
    };

    window.switchVeneraTab = function (catId) {
        veneraWardrobeData.currentTab = catId;
        var tabs = kaAll('.venera-tab-btn');
        tabs.forEach(function (btn) {
            if (btn.getAttribute('data-cat') === catId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        renderVeneraItemsGrid();
    };

    function renderVeneraShopUI() {
        var coinEl = kaOne('#veneraCoinBalance');
        if (coinEl) coinEl.textContent = veneraWardrobeData.coins;
        renderVeneraAvatar();
        renderVeneraItemsGrid();
    }

    function renderVeneraAvatar() {
        var baseImg = kaOne('#veneraBoyBaseImg');
        var backdropEl = kaOne('#veneraBackdrop');
        var eq = veneraWardrobeData.equipped;

        var outfit = veneraOutfitDetails[eq.outfit] || veneraOutfitDetails['default'];

        if (baseImg) {
            baseImg.style.opacity = '0.4';
            baseImg.style.transform = 'scale(0.96)';
            setTimeout(function () {
                baseImg.src = outfit.src;
                baseImg.style.opacity = '1';
                baseImg.style.transform = 'scale(1)';
            }, 120);
        }

        if (backdropEl) {
            backdropEl.className = 'venera-avatar-backdrop bg-' + (eq.backdrop || 'space');
        }

        var titleEl = kaOne('#veneraStyleTitle');
        var descEl = kaOne('#veneraStyleDesc');
        if (titleEl) titleEl.textContent = outfit.title;
        if (descEl) descEl.textContent = outfit.desc;
    }

    function renderVeneraItemsGrid() {
        var grid = kaOne('#veneraItemsGrid');
        if (!grid) return;
        grid.innerHTML = '';

        var currentCatId = veneraWardrobeData.currentTab;
        var cat = (veneraWardrobeData.categories || []).find(function (c) { return c.id === currentCatId; });
        if (!cat || !cat.items) return;

        var inventoryList = veneraWardrobeData.inventory[currentCatId] || [];
        var eq = veneraWardrobeData.equipped;

        cat.items.forEach(function (item) {
            var isOwned = inventoryList.indexOf(item.id) !== -1 || item.price === 0;
            var isWorn = false;

            if (currentCatId === 'outfits') isWorn = (eq.outfit === item.id);
            else if (currentCatId === 'backdrops') isWorn = (eq.backdrop === item.id);

            var card = document.createElement('div');
            card.className = 'venera-item-card' + (isWorn ? ' active' : '');

            var badgeClass = isWorn ? 'badge-worn' : (isOwned ? 'badge-owned' : 'badge-buy');
            var badgeText = isWorn ? '✓ Kiyilgan' : (isOwned ? 'Kiyish' : item.price + ' 🪙');

            var thumbHtml = item.image ? 
                '<img src="' + item.image + '" alt="' + item.name + '" class="venera-item-thumb">' : 
                '<div class="venera-item-icon">' + item.icon + '</div>';

            card.innerHTML = thumbHtml +
                             '<div class="venera-item-name">' + item.name + '</div>' +
                             '<div class="venera-item-desc">' + item.desc + '</div>' +
                             '<div class="venera-item-action-row">' +
                             '<span class="venera-item-badge ' + badgeClass + '">' + badgeText + '</span>' +
                             '</div>';

            card.onclick = function () {
                handleVeneraItemClick(currentCatId, item, isOwned, isWorn);
            };

            grid.appendChild(card);
        });
    }

    function handleVeneraItemClick(catId, item, isOwned, isWorn) {
        if (!isOwned) {
            // Sotib olish
            if (veneraWardrobeData.coins >= item.price) {
                veneraWardrobeData.coins -= item.price;
                if (!veneraWardrobeData.inventory[catId]) veneraWardrobeData.inventory[catId] = [];
                veneraWardrobeData.inventory[catId].push(item.id);
                playChimeEffect(true);
                equipVeneraItem(catId, item.id);
                renderVeneraShopUI();
                showVeneraTip('Tabriklaymiz! «' + item.name + '» xarid qilindi va kiyildi! 🎉');
            } else {
                playChimeEffect(false);
                showVeneraTip('Tangalar yetarli emas! Yana Gold Coin to\'plang! 🪙');
            }
            return;
        }

        // Agar egalik qilsa: kiyish
        playChimeEffect(true);
        equipVeneraItem(catId, item.id);
        renderVeneraShopUI();
    }

    function equipVeneraItem(catId, itemId) {
        var eq = veneraWardrobeData.equipped;
        if (catId === 'outfits') eq.outfit = itemId;
        else if (catId === 'backdrops') eq.backdrop = itemId;
    }

    function showVeneraTip(text) {
        var tipEl = kaOne('#veneraTipText');
        if (tipEl) tipEl.textContent = text;
    }

    window.randomVeneraOutfit = function () {
        var outfits = ['default', 'doppi', 'crown', 'astronaut', 'scientist', 'superhero', 'sport'];
        var backdrops = ['space', 'registan', 'future_lab', 'cozy_room'];

        var eq = veneraWardrobeData.equipped;
        eq.outfit = outfits[Math.floor(Math.random() * outfits.length)];
        eq.backdrop = backdrops[Math.floor(Math.random() * backdrops.length)];

        playChimeEffect(true);
        renderVeneraShopUI();
        showVeneraTip('Tasodifiy ajoyib 3D uslub yaratildi! 🎲✨');
    };

    window.resetVeneraOutfit = function () {
        veneraWardrobeData.equipped = {
            outfit: 'default',
            backdrop: 'space'
        };
        playChimeEffect(true);
        renderVeneraShopUI();
        showVeneraTip('Kiyimlar tozalab, asl holatiga qaytarildi 🔄');
    };

    window.takeVeneraSnapshot = function () {
        var flash = kaOne('#veneraFlashOverlay');
        if (flash) {
            flash.classList.remove('flash');
            void flash.offsetWidth;
            flash.classList.add('flash');
        }
        playChimeEffect(true);
        showVeneraTip('Qoyilmaqom ko\'rinish! Kichik Alloma rasmga tushdi 📸🌟');
    };

    /* ==========================================================================
       NEPTUN SAYYORASI: BUGUNGI HISSIYOT DARAXTI (EXACT MATCH TO REFERENCE)
       ========================================================================== */
    var neptunMoodState = {
        selectedMood: null,
        isDockOpen: false,
        presetMoods: [
            { emoji: '😠', title: 'Jahldor', desc: 'Biroz jahlim chiqdi yoki xafaman' },
            { emoji: '😄', title: 'Xursand', desc: 'Kayfiyatim a\'lo, juda quvnoqman!' },
            { emoji: '🤔', title: 'Fikrchan', desc: 'Yangi narsalar haqida o\'ylayapman' },
            { emoji: '🥺', title: 'G\'amgin', desc: 'Biroz g\'amginman, mehr kerak' },
            { emoji: '🤕', title: 'Charchagan', desc: 'Tanam biroz toliqdi yoki dam olyapman' }
        ]
    };

    function playPopStickSound() {
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            var ctx = new AudioCtx();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(420, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
            osc.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.16);
            gain.gain.setValueAtTime(0.35, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.22);
        } catch (e) {}
    }

    window.openNeptunTree = function () {
        window.closePlanetModalVideo();
        window.closeUranPractice();
        window.closeVeneraShop();
        window.closeSaturnPractice();
        window.closeYupiterSchedule();

        var box = kaOne('#modalNeptunTreeBox');
        if (!box) return;
        box.style.display = 'block';

        renderNeptunMoodBadge();

        setTimeout(function () {
            box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    window.closeNeptunTree = function () {
        var box = kaOne('#modalNeptunTreeBox');
        if (box) box.style.display = 'none';
        window.closeNeptunMoodDock();
    };

    window.toggleNeptunMoodDock = function (e) {
        if (e) e.stopPropagation();
        if (neptunMoodState.isDockOpen) {
            window.closeNeptunMoodDock();
        } else {
            window.openNeptunMoodDock();
        }
    };

    window.openNeptunMoodDock = function () {
        neptunMoodState.isDockOpen = true;
        var dock = kaOne('#neptunMoodDock');
        var backdrop = kaOne('#neptunMoodBackdrop');
        if (dock) dock.style.display = 'block';
        if (backdrop) backdrop.style.display = 'block';
        playPopStickSound();
        showNeptunMoodFeedback('Bugungi kayfiyatingizga mos emojini tanlang: 😠 😄 🤔 🥺 🤕');
    };

    window.closeNeptunMoodDock = function () {
        neptunMoodState.isDockOpen = false;
        var dock = kaOne('#neptunMoodDock');
        var backdrop = kaOne('#neptunMoodBackdrop');
        if (dock) dock.style.display = 'none';
        if (backdrop) backdrop.style.display = 'none';
    };

    window.selectNeptunMood = function (emoji, title, desc) {
        neptunMoodState.selectedMood = { emoji: emoji, title: title, desc: desc };
        window.closeNeptunMoodDock();
        renderNeptunMoodBadge();
        playPopStickSound();

        var badge = kaOne('#neptunMoodCircleBadge');
        if (badge) {
            badge.style.transform = 'translate(-50%, -50%) scale(1.18)';
            setTimeout(function () {
                badge.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 260);
        }

        showNeptunMoodFeedback('Bugun: «' + title + '» ' + emoji + ' — Daraxtga mahkam yopishtirildi!');
    };

    function renderNeptunMoodBadge() {
        var orb = kaOne('#moodGlowingOrb');
        var emojiEl = kaOne('#moodSelectedEmoji');
        var ring = kaOne('#moodDashedRing');

        if (neptunMoodState.selectedMood) {
            if (orb) orb.style.display = 'none';
            if (emojiEl) {
                emojiEl.textContent = neptunMoodState.selectedMood.emoji;
                emojiEl.style.display = 'inline-block';
            }
            if (ring) ring.classList.add('has-mood');
        } else {
            if (orb) orb.style.display = 'block';
            if (emojiEl) emojiEl.style.display = 'none';
            if (ring) ring.classList.remove('has-mood');
        }
    }

    window.randomNeptunMood = function () {
        var list = neptunMoodState.presetMoods;
        var rand = list[Math.floor(Math.random() * list.length)];
        window.selectNeptunMood(rand.emoji, rand.title, rand.desc);
        playChimeEffect(true);
    };

    window.resetNeptunMood = function () {
        neptunMoodState.selectedMood = null;
        window.closeNeptunMoodDock();
        renderNeptunMoodBadge();
        playChimeEffect(false);
        showNeptunMoodFeedback('Daraxt tozalandi. Bugungi kayfiyatingizni qaytadan tanlashingiz mumkin!');
    };

    window.takeNeptunSnapshot = function () {
        var flash = kaOne('#neptunFlashOverlay');
        if (flash) {
            flash.classList.remove('flash');
            void flash.offsetWidth;
            flash.classList.add('flash');
        }
        playChimeEffect(true);
        showNeptunMoodFeedback('Qoyilmaqom! Bugungi hissiyot daraxtingiz suratga olindi 📸🌳');
    };

    function showNeptunMoodFeedback(text) {
        var el = kaOne('#neptunMoodFeedbackText');
        if (el) {
            el.textContent = text;
            el.style.opacity = '0.7';
            setTimeout(function () { el.style.opacity = '1'; }, 150);
        }
    }

    /* ==========================================================================
       YUPITER SAYYORASI: TAYM-MENEJMENT VA KUNLIK REJA JADVALI (SCHEDULE & NOTES)
       ========================================================================== */
    function padZero(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function formatDateYMD(d) {
        if (!d) d = new Date();
        var year = d.getFullYear();
        var month = padZero(d.getMonth() + 1);
        var day = padZero(d.getDate());
        return year + '-' + month + '-' + day;
    }

    var UZ_MONTH_NAMES = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];

    var UZ_WEEKDAY_NAMES = [
        "Yakshanba", "Dushanba", "Seshanba", "Chorshanba",
        "Payshanba", "Juma", "Shanba"
    ];

    var yupiterState = {
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        selectedDate: formatDateYMD(new Date()),
        notes: {},
        presets: [],
        mottoes: []
    };

    function initYupiterDefaultNotes() {
        try {
            var raw = localStorage.getItem('yupiter_schedule_notes');
            if (raw) {
                yupiterState.notes = JSON.parse(raw) || {};
            } else {
                var today = new Date();
                var todayKey = formatDateYMD(today);
                
                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);
                var tomorrowKey = formatDateYMD(tomorrow);

                yupiterState.notes = {};
                yupiterState.notes[todayKey] = [
                    { id: '1', text: "Kitob mutolaasi 📖 (20 daqiqa)", time: "20 daqiqa", done: true },
                    { id: '2', text: "Matematika mashqi va jumboqlar 🧮", time: "16:00", done: false }
                ];
                yupiterState.notes[tomorrowKey] = [
                    { id: '3', text: "Ingliz tili lug'atlaridan 5 ta so'z yodlash 🇬🇧", time: "10:00", done: false },
                    { id: '4', text: "Badantarbiya va jismoniy mashqlar 🏃", time: "18:00", done: false }
                ];
                localStorage.setItem('yupiter_schedule_notes', JSON.stringify(yupiterState.notes));
            }
        } catch (e) {
            yupiterState.notes = {};
        }
    }

    function saveYupiterNotesToStorage() {
        try {
            localStorage.setItem('yupiter_schedule_notes', JSON.stringify(yupiterState.notes));
        } catch (e) {}
    }

    window.openYupiterSchedule = function () {
        window.closePlanetModalVideo();
        window.closeUranPractice();
        window.closeVeneraShop();
        window.closeNeptunTree();
        window.closeSaturnPractice();

        var box = kaOne('#modalYupiterScheduleBox');
        if (!box) return;
        box.style.display = 'block';

        initYupiterDefaultNotes();

        var now = new Date();
        yupiterState.currentYear = now.getFullYear();
        yupiterState.currentMonth = now.getMonth();
        if (!yupiterState.selectedDate) {
            yupiterState.selectedDate = formatDateYMD(now);
        }

        renderYupiterCalendar();
        renderYupiterNotesPanel();

        fetch('/api/website/yupiter/calendar-presets')
            .then(function (res) {
                if (!res.ok) throw new Error('API error');
                return res.json();
            })
            .then(function (data) {
                if (data && Array.isArray(data.presets)) {
                    yupiterState.presets = data.presets;
                    renderYupiterPresets();
                }
                if (data && Array.isArray(data.mottoes) && data.mottoes.length > 0) {
                    yupiterState.mottoes = data.mottoes;
                    var banner = kaOne('#yupiterMottoBanner');
                    if (banner) {
                        var randMotto = data.mottoes[Math.floor(Math.random() * data.mottoes.length)];
                        banner.textContent = randMotto;
                    }
                }
            })
            .catch(function () {
                renderYupiterPresets();
            });

        setTimeout(function () {
            box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    window.closeYupiterSchedule = function () {
        var box = kaOne('#modalYupiterScheduleBox');
        if (box) box.style.display = 'none';
    };

    window.goToTodayYupiter = function () {
        var now = new Date();
        yupiterState.currentYear = now.getFullYear();
        yupiterState.currentMonth = now.getMonth();
        yupiterState.selectedDate = formatDateYMD(now);
        renderYupiterCalendar();
        renderYupiterNotesPanel();
    };

    window.changeYupiterMonth = function (delta) {
        yupiterState.currentMonth += delta;
        if (yupiterState.currentMonth < 0) {
            yupiterState.currentMonth = 11;
            yupiterState.currentYear--;
        } else if (yupiterState.currentMonth > 11) {
            yupiterState.currentMonth = 0;
            yupiterState.currentYear++;
        }
        renderYupiterCalendar();
    };

    function renderYupiterCalendar() {
        var titleEl = kaOne('#yupiterMonthYearTitle');
        if (titleEl) {
            titleEl.textContent = UZ_MONTH_NAMES[yupiterState.currentMonth] + ' ' + yupiterState.currentYear;
        }

        var gridEl = kaOne('#yupiterDaysGrid');
        if (!gridEl) return;
        gridEl.innerHTML = '';

        var year = yupiterState.currentYear;
        var month = yupiterState.currentMonth;

        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

        for (var i = 0; i < firstDayIndex; i++) {
            var emptyCell = document.createElement('div');
            emptyCell.className = 'yupiter-day-cell is-empty';
            gridEl.appendChild(emptyCell);
        }

        var todayKey = formatDateYMD(new Date());

        for (var d = 1; d <= daysInMonth; d++) {
            var mStr = String(month + 1).padStart(2, '0');
            var dStr = String(d).padStart(2, '0');
            var dateKey = year + '-' + mStr + '-' + dStr;

            var cell = document.createElement('div');
            cell.className = 'yupiter-day-cell';
            cell.setAttribute('data-date', dateKey);

            if (dateKey === todayKey) {
                cell.classList.add('is-today');
            }
            if (dateKey === yupiterState.selectedDate) {
                cell.classList.add('is-selected');
            }

            var dayNum = document.createElement('span');
            dayNum.className = 'yupiter-day-num';
            dayNum.textContent = d;
            cell.appendChild(dayNum);

            var dayNotes = yupiterState.notes[dateKey] || [];
            if (dayNotes.length > 0) {
                var dot = document.createElement('span');
                dot.className = 'yupiter-day-dot';
                dot.title = dayNotes.length + " ta reja";
                cell.appendChild(dot);
            }

            (function (k) {
                cell.onclick = function () {
                    selectYupiterDate(k);
                };
            })(dateKey);

            gridEl.appendChild(cell);
        }
    }

    function selectYupiterDate(dateKey) {
        yupiterState.selectedDate = dateKey;

        var allCells = kaAll('.yupiter-day-cell[data-date]');
        allCells.forEach(function (c) {
            if (c.getAttribute('data-date') === dateKey) {
                c.classList.add('is-selected');
            } else {
                c.classList.remove('is-selected');
            }
        });

        renderYupiterNotesPanel();

        var input = kaOne('#yupiterNoteInput');
        if (input) input.focus();
    }

    function formatUzbekDateFull(dateKey) {
        if (!dateKey) return '';
        var parts = dateKey.split('-');
        if (parts.length !== 3) return dateKey;
        var y = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10) - 1;
        var d = parseInt(parts[2], 10);

        var dateObj = new Date(y, m, d);
        var weekday = UZ_WEEKDAY_NAMES[dateObj.getDay()] || '';
        var monthName = UZ_MONTH_NAMES[m] || '';

        return d + '-' + monthName + ', ' + y + ' (' + weekday + ')';
    }

    function renderYupiterNotesPanel() {
        var labelEl = kaOne('#yupiterSelectedDateLabel');
        if (labelEl) {
            labelEl.innerHTML = '📌 Tanlangan sana: <strong>' + formatUzbekDateFull(yupiterState.selectedDate) + '</strong>';
        }

        var notes = yupiterState.notes[yupiterState.selectedDate] || [];
        var countBadge = kaOne('#yupiterNotesCountBadge');
        if (countBadge) {
            countBadge.textContent = notes.length > 0 ? (notes.length + ' ta reja') : "Reja yo'q";
        }

        var listEl = kaOne('#yupiterNotesList');
        if (!listEl) return;
        listEl.innerHTML = '';

        if (notes.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'yupiter-empty-notes';
            empty.innerHTML = '✨ Ushbu sanaga hali reja belgilanmagan.<br>Yuqoridagi maydonga yozing yoki namunalardan birini tanlang!';
            listEl.appendChild(empty);
            return;
        }

        notes.forEach(function (item) {
            var row = document.createElement('div');
            row.className = 'yupiter-note-item';

            var left = document.createElement('div');
            left.className = 'yupiter-note-left';

            var check = document.createElement('div');
            check.className = 'yupiter-checkbox' + (item.done ? ' checked' : '');
            check.setAttribute('role', 'checkbox');
            check.setAttribute('aria-checked', item.done ? 'true' : 'false');
            check.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            check.onclick = function () {
                toggleYupiterNoteDone(item.id);
            };

            var timeBadge = document.createElement('span');
            timeBadge.className = 'yupiter-note-time';
            timeBadge.textContent = item.time || '20 daq';

            var text = document.createElement('span');
            text.className = 'yupiter-note-text' + (item.done ? ' done' : '');
            text.textContent = item.text;

            left.appendChild(check);
            left.appendChild(timeBadge);
            left.appendChild(text);

            var delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'yupiter-delete-btn';
            delBtn.title = "O'chirish";
            delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
            delBtn.onclick = function () {
                deleteYupiterNote(item.id);
            };

            row.appendChild(left);
            row.appendChild(delBtn);

            listEl.appendChild(row);
        });
    }

    function renderYupiterPresets() {
        var container = kaOne('#yupiterPresetsList');
        if (!container) return;
        container.innerHTML = '';

        var defaultPresets = [
            { text: "Kitob mutolaasi 📖" },
            { text: "Matematika mashqi 🧮" },
            { text: "Badantarbiya & sport 🏃" },
            { text: "Ingliz tili so'zlari 🇬🇧" },
            { text: "Uy vazifasi ✍️" },
            { text: "Rasm chizish 🎨" },
            { text: "Xonani yig'ish 🧹" }
        ];

        var list = (yupiterState.presets && yupiterState.presets.length > 0)
            ? yupiterState.presets
            : defaultPresets;

        list.forEach(function (p) {
            var tag = document.createElement('span');
            tag.className = 'yupiter-preset-tag';
            tag.textContent = p.text || p;
            tag.onclick = function () {
                var input = kaOne('#yupiterNoteInput');
                if (input) {
                    input.value = p.text || p;
                    input.focus();
                }
            };
            container.appendChild(tag);
        });
    }

    window.saveYupiterNote = function () {
        var input = kaOne('#yupiterNoteInput');
        var timeSelect = kaOne('#yupiterTimeSelect');
        if (!input) return;

        var val = (input.value || '').trim();
        if (!val) {
            input.focus();
            input.style.borderColor = '#ef4444';
            setTimeout(function () { input.style.borderColor = ''; }, 1200);
            return;
        }

        var timeVal = timeSelect ? timeSelect.value : '20 daqiqa';
        var dateKey = yupiterState.selectedDate;

        if (!yupiterState.notes[dateKey]) {
            yupiterState.notes[dateKey] = [];
        }

        var newNote = {
            id: 'note_' + Date.now(),
            text: val,
            time: timeVal,
            done: false
        };

        yupiterState.notes[dateKey].push(newNote);
        saveYupiterNotesToStorage();

        input.value = '';
        renderYupiterNotesPanel();
        renderYupiterCalendar();

        if (typeof showToast === 'function') {
            showToast("Reja muvaffaqiyatli saqlandi! 🎯");
        } else if (typeof playChimeEffect === 'function') {
            playChimeEffect(true);
        }
    };

    function toggleYupiterNoteDone(id) {
        var notes = yupiterState.notes[yupiterState.selectedDate] || [];
        var found = notes.find(function (n) { return n.id === id; });
        if (found) {
            found.done = !found.done;
            saveYupiterNotesToStorage();
            renderYupiterNotesPanel();
            if (found.done && typeof playChimeEffect === 'function') {
                playChimeEffect(true);
            }
        }
    }

    function deleteYupiterNote(id) {
        var notes = yupiterState.notes[yupiterState.selectedDate] || [];
        yupiterState.notes[yupiterState.selectedDate] = notes.filter(function (n) { return n.id !== id; });
        saveYupiterNotesToStorage();
        renderYupiterNotesPanel();
        renderYupiterCalendar();
    }

    function closePlanetModal() {
        window.closePlanetModalVideo();
        window.closeUranPractice();
        window.closeVeneraShop();
        window.closeNeptunTree();
        window.closeSaturnPractice();
        window.closeYupiterSchedule();
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    kaAll('.planet-card-item').forEach(function (card) {
        card.addEventListener('click', function (e) {
            var planetKey = card.getAttribute('data-planet');
            if (planetKey) {
                openPlanetModal(planetKey);
            }
        });
    });

    closeBtn.addEventListener('click', closePlanetModal);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closePlanetModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closePlanetModal();
        }
    });
})();

/* ============ Pedagogik Yondashuv — Smooth Scroll + Swipe Animatsiya ============ */
(function () {
    var stickySection = document.getElementById('qanday');
    if (!stickySection) return;

    var stickyContainer = stickySection.querySelector('.sticky-container');
    var cardsInner = document.getElementById('cardsInner');
    var desktopCards = cardsInner ? Array.prototype.slice.call(cardsInner.querySelectorAll('.card')) : [];
    var imgWrapper = document.getElementById('pedagogyImageWrapper');
    var desktopSlides = imgWrapper ? Array.prototype.slice.call(imgWrapper.querySelectorAll('.image-slide')) : [];

    var mobileContainer = document.getElementById('mobileStepContainer');
    var mobileCardsWrapper = document.getElementById('mobileCardsWrapper');
    var mobileCards = mobileCardsWrapper ? Array.prototype.slice.call(mobileCardsWrapper.querySelectorAll('.mobile-step-card')) : [];
    var mobileDots = mobileContainer ? Array.prototype.slice.call(mobileContainer.querySelectorAll('.mobile-progress-dot')) : [];
    var mobileSwipeStepNum = document.getElementById('mobileSwipeStepNum');

    var totalSteps = 4;
    var currentStep = 0;
    var swipeCooldown = false;
    var isProgrammaticScroll = false;
    var scrollTimeout = null;

    function setStep(index, options) {
        options = options || {};
        index = Math.max(0, Math.min(totalSteps - 1, index));

        if (options.scroll) {
            isProgrammaticScroll = true;
            clearTimeout(scrollTimeout);

            var rect = stickySection.getBoundingClientRect();
            var sectionTop = window.pageYOffset + rect.top;
            var totalScrollable = stickySection.offsetHeight - window.innerHeight;
            if (totalScrollable > 0) {
                var targetY = sectionTop + (index / (totalSteps - 1)) * totalScrollable;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            }

            scrollTimeout = setTimeout(function () {
                isProgrammaticScroll = false;
            }, 600);
        }

        if (currentStep === index && !options.force) return;
        currentStep = index;

        // Desktop Kartalar va Rasmlarni yangilash
        if (desktopCards.length > 0) {
            desktopCards.forEach(function (card, i) {
                card.classList.toggle('active', i === index);
            });

            if (cardsInner && cardsInner.parentElement) {
                var wrapperH = cardsInner.parentElement.offsetHeight || 470;
                var activeCard = desktopCards[index];
                var cardH = activeCard ? activeCard.offsetHeight : 110;
                var computedGap = parseInt(window.getComputedStyle(cardsInner).gap, 10) || 16;
                var centerPos = wrapperH / 2 - cardH / 2;
                var cardPos = index * (cardH + computedGap);
                var targetTranslate = -(cardPos - centerPos);
                cardsInner.style.transform = 'translateY(' + targetTranslate + 'px)';
            }
        }

        if (desktopSlides.length > 0) {
            desktopSlides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
        }

        // Mobil Kartalar va Progress Nuqtalarni yangilash
        if (mobileCards.length > 0) {
            mobileCards.forEach(function (mc, i) {
                if (i === index) {
                    mc.className = 'mobile-step-card active';
                } else if (i < index) {
                    mc.className = 'mobile-step-card is-prev';
                } else {
                    mc.className = 'mobile-step-card is-next';
                }
            });
        }

        if (mobileDots.length > 0) {
            mobileDots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        if (mobileSwipeStepNum) {
            mobileSwipeStepNum.textContent = (index + 1) + ' / ' + totalSteps;
        }
    }

    // Desktop kartalarni bosish orqali qadamga o'tish
    desktopCards.forEach(function (card, i) {
        card.addEventListener('click', function () {
            setStep(i, { scroll: true });
        });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setStep(i, { scroll: true });
            }
        });
    });

    // Mobil progress nuqtalarini bosish orqali o'tish
    mobileDots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            setStep(i, { scroll: true });
        });
    });

    // Skroll bo'yicha qadamni sinxronlashtirish
    function onScroll() {
        if (isProgrammaticScroll) return;

        var rect = stickySection.getBoundingClientRect();
        var sectionH = stickySection.offsetHeight;
        var viewportH = window.innerHeight;
        var scrolled = -rect.top;
        var scrollable = sectionH - viewportH;
        if (scrollable <= 0) return;

        var progress = Math.max(0, Math.min(1, scrolled / scrollable));

        var stepIndex = 0;
        if (progress >= 0.80) {
            stepIndex = 3;
        } else if (progress >= 0.50) {
            stepIndex = 2;
        } else if (progress >= 0.18) {
            stepIndex = 1;
        } else {
            stepIndex = 0;
        }

        setStep(stepIndex, { scroll: false });
    }

    // Touch Swipe (Yuqoriga / Pastga surish) hodisalari
    var touchStartY = 0;
    var touchStartX = 0;
    var touchStartTime = 0;
    var touchActive = false;

    var targetElement = stickyContainer || stickySection;

    targetElement.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        touchActive = true;
    }, { passive: true });

    targetElement.addEventListener('touchend', function (e) {
        if (!touchActive || swipeCooldown || e.changedTouches.length !== 1) return;
        touchActive = false;

        var deltaY = e.changedTouches[0].clientY - touchStartY;
        var deltaX = e.changedTouches[0].clientX - touchStartX;
        var deltaTime = Date.now() - touchStartTime;

        // Vertikal swipe ekanligini tekshirish (kamida 32px va burchagi vertikal)
        if (Math.abs(deltaY) > 32 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2 && deltaTime < 550) {
            var rect = stickySection.getBoundingClientRect();
            var isInView = (rect.top <= 80 && rect.bottom >= window.innerHeight - 80);

            if (isInView) {
                if (deltaY < 0) {
                    // YUQORIGA SWIPE -> KEYINGI QADAM
                    if (currentStep < totalSteps - 1) {
                        swipeCooldown = true;
                        setStep(currentStep + 1, { scroll: true });
                        setTimeout(function () { swipeCooldown = false; }, 450);
                    } else {
                        // Oxirgi qadamda bo'lsa, keyingi bo'limga silliq o'tish
                        var nextSection = document.getElementById('afzalliklar');
                        if (nextSection) {
                            nextSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                } else {
                    // PASTGA SWIPE -> OLDINGI QADAM
                    if (currentStep > 0) {
                        swipeCooldown = true;
                        setStep(currentStep - 1, { scroll: true });
                        setTimeout(function () { swipeCooldown = false; }, 450);
                    } else {
                        // Birinchi qadamda bo'lsa, bo'lim boshiga skroll qilish
                        window.scrollTo({
                            top: window.pageYOffset + rect.top,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }
    }, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
        setStep(currentStep, { force: true, scroll: false });
    });

    // Ko'p tillilik uchun yordamchi funksiya
    window.updateMobileStepLanguage = function (dict) {
        if (!dict) return;
        setStep(currentStep, { force: true, scroll: false });
    };

    // Dastlabki ishga tushirish
    requestAnimationFrame(function () {
        setStep(0, { force: true, scroll: false });
        onScroll();
    });
})();
