/* ============ Yordamchi ============ */
var kaAll = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
var kaOne = function (sel, ctx) { return (ctx || document).querySelector(sel); };

/* ============ MULTI-LANGUAGE TRANSLATIONS (UZ, RU, EN) ============ */
var TRANSLATIONS = {
    UZ: {
        nav_sayyoralar: "Sayyoralar",
        nav_qanday: "Qanday ishlaydi",
        nav_afzalliklar: "Afzalliklar",
        nav_panel: "Ota-onalar paneli",
        nav_sertifikat: "Sertifikat",
        nav_cta: "",

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
        how_step4_desc: 'Har bir to\'g\'ri qadam uchun "Gold Coin" yig\'iladi. Bu bolada o\'z mehnati samarasini ko\'rish hissini uyg\'otadi.',

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
        form_submitting: "Yuborilmoqda…",
        form_success: "Rahmat! Tez orada siz bilan bog'lanamiz.",
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
        cert_desc: '8 ta olam missiyalarini muvaffaqiyatli yakunlagan mitti kashfiyotchilar o\'zlarining birinchi "Kosmik Sertifikati"ni qo\'lga kiritadilar. Bu ularning kelajakdagi katta zafarlari sari ishonchli qadamdir.',

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
        hero_sub: "Kichik Alloma — единственная космическая образовательная экосистема на базе искусственного интеллекта, которая учит детей самостоятельно мыслить, дисциплине и управлению эмоциями.",
        hero_cta_primary: "Начать путешествие",
        hero_cta_ghost: "Как это работает?",

        planets_badge: "Космическая экосистема",
        planets_title: "8 важнейших жизненных навыков.",
        planets_sub: "Каждая планета помогает раскрыть скрытый потенциал ребенка",

        mercury_title: "Меркурий",
        mercury_skill: "Профессии",
        mercury_desc: "Открытие профессий будущего и постановка целей.",

        venus_title: "Венера",
        venus_skill: "Виртуальный магазин",
        venus_desc: "Правильное расходование заработанных собственным трудом монет.",

        earth_title: "Земля",
        earth_skill: "Когнитивное обучение",
        earth_desc: "Развитие самостоятельного мышления с Сократовским AI-наставником.",

        mars_title: "Марс",
        mars_skill: "Физическая активность",
        mars_desc: "Отвлечение от экрана и выполнение реальных физических упражнений.",

        jupiter_title: "Юпитер",
        jupiter_skill: "Самодисциплина",
        jupiter_desc: "Составление распорядка дня и грамотное распределение времени.",

        saturn_title: "Сатурн",
        saturn_skill: "Математика",
        saturn_desc: "Пошаговые задачи для развития логического мышления.",

        uranus_title: "Уран",
        uranus_skill: "Английский язык",
        uranus_desc: "Активный словарный запас и практика правильного произношения.",

        neptune_title: "Нептун",
        neptune_skill: "Эмоциональный интеллект",
        neptune_desc: "Понимание и осознанное управление своими эмоциями.",

        how_badge: "Педагогический подход",
        how_title: "4 шага от интереса к практическому результату.",
        how_step1_title: "Целенаправленное путешествие",
        how_step1_desc: "Ребенок выбирает планету способностей в Солнечной системе, которую хочет исследовать.",
        how_step2_title: "Осмысленное обучение",
        how_step2_desc: "Искусственный интеллект не решает за ребенка, а наводящими вопросами направляет к правильному ответу.",
        how_step3_title: "Практическое действие",
        how_step3_desc: "Миссия завершается чтением, упражнениями или выражением своих чувств.",
        how_step4_title: "Заслуженная награда",
        how_step4_desc: 'За каждый верный шаг начисляются "Gold Coins", формируя чувство ценности своего труда.',

        benefits_badge: "Отличия",
        benefits_title: "Чем отличается от традиционного образования?",
        benefits_card1_title: "Нет готовых ответов",
        benefits_card1_desc: "AI-наставник не подсказывает решение, а учит находить его. Ребенок учится мыслить самостоятельно.",
        benefits_card2_title: "Здоровые границы",
        benefits_card2_desc: "Ребенок не станет зависимым от гаджетов. Лимит в 20 минут в день учит ценить время и планировать.",
        benefits_card3_title: "Не просто уроки, а жизненные навыки",
        benefits_card3_desc: "Приложение охватывает не только математику, но и физическую активность и психологическую устойчивость (Нептун).",
        benefits_card4_title: "Экономика через игру",
        benefits_card4_desc: "Через виртуальный магазин Венеры ребенок на практике осваивает заработок, накопление и трату денег.",

        parents_badge: "Панель родителей",
        parents_title: "Ваше спокойствие и детальная аналитика.",
        form_title: "Начните ради будущего вашего ребенка прямо сейчас.",
        form_sub: "Зарегистрируйтесь — присоединяйтесь к нам в космическом путешествии.",
        form_label_name: "Имя",
        form_placeholder_name: "Например: Дильноза",
        form_label_phone: "Номер телефона",
        form_placeholder_phone: "+998 __ ___ __ __",
        form_label_message: "Сообщение",
        form_placeholder_message: "Напишите сообщение...",
        form_submit: "Отправить",
        form_submitting: "Отправка…",
        form_success: "Спасибо! Мы скоро свяжемся с вами.",
        form_note: "Ваши данные в полной безопасности.",

        team_badge: "Команда",
        team_title: "Наша команда",
        role_ceo: "Основатель & CEO",
        role_mobile: "Мобильный разработчик",
        role_phd: "Доктор филологических наук DSc",
        role_uiux: "UX/UI дизайнер",
        role_graphic: "Графический дизайнер",
        role_dev: "Разработчик",

        cert_badge: "Признание",
        cert_title: "Каждое достижение по праву признается.",
        cert_desc: 'Юные исследователи, успешно завершившие миссии 8 миров, получают свой первый "Космический сертификат". Это уверенный шаг к их будущим большим победам.',

        cta_title: 'Присоединяйтесь к тысячам современных родителей и начните реальное развитие с <span class="hl">Kichik Alloma</span> уже сегодня.',
        cta_btn: "Начать сейчас",

        footer_contact: "Контакты:",
        footer_rights: "Kichik Alloma. Все права защищены."
    },
    EN: {
        nav_sayyoralar: "Planets",
        nav_qanday: "How it works",
        nav_afzalliklar: "Benefits",
        nav_panel: "Parents Panel",
        nav_sertifikat: "Certificate",
        nav_cta: "Start Journey",

        hero_badge: "Space Education Ecosystem",
        hero_title: 'Turn your child\'s screen time into an <span class="hl">investment in their future</span>.',
        hero_sub: "Kichik Alloma is the only AI-powered space education ecosystem that teaches children independent thinking, discipline, and emotional regulation.",
        hero_cta_primary: "Start Journey",
        hero_cta_ghost: "How it works?",

        planets_badge: "Cosmic Ecosystem",
        planets_title: "8 Essential Life Skills for the Future.",
        planets_sub: "Each planet helps unlock their hidden potential",

        mercury_title: "Mercury",
        mercury_skill: "Careers",
        mercury_desc: "Discovering future careers and goal setting.",

        venus_title: "Venus",
        venus_skill: "Virtual Store",
        venus_desc: "Managing and spending hard-earned coins wisely.",

        earth_title: "Earth",
        earth_skill: "Cognitive Learning",
        earth_desc: "Learning independent thinking with a Socratic AI mentor.",

        mars_title: "Mars",
        mars_skill: "Physical Activity",
        mars_desc: "Unplugging from screens and performing real physical exercises.",

        jupiter_title: "Jupiter",
        jupiter_skill: "Self-Management",
        jupiter_desc: "Daily planning and effective time management.",

        saturn_title: "Saturn",
        saturn_skill: "Mathematics",
        saturn_desc: "Step-by-step puzzles to boost logical thinking.",

        uranus_title: "Uranus",
        uranus_skill: "English",
        uranus_desc: "Active vocabulary and correct pronunciation practice.",

        neptune_title: "Neptune",
        neptune_skill: "Emotional Literacy",
        neptune_desc: "Understanding and managing one's own emotions.",

        how_badge: "Pedagogical Approach",
        how_title: "4 Steps from Curiosity to Real Results.",
        how_step1_title: "Purposeful Journey",
        how_step1_desc: "The child chooses a skill planet in the Solar System they wish to discover.",
        how_step2_title: "Thoughtful Learning",
        how_step2_desc: "The AI doesn't solve tasks for the child; guiding questions prompt them to find the answer.",
        how_step3_title: "Practical Action",
        how_step3_desc: "The mission is completed through reading, exercising, or reflecting on emotions.",
        how_step4_title: "Deserved Reward",
        how_step4_desc: 'Every correct step earns "Gold Coins", instilling a sense of achievement and value for effort.',

        benefits_badge: "Differences",
        benefits_title: "How does it differ from traditional education?",
        benefits_card1_title: "No Ready Answers",
        benefits_card1_desc: "The AI mentor doesn't hand out answers, it teaches how to solve problems independently.",
        benefits_card2_title: "Healthy Boundaries",
        benefits_card2_desc: "Children won't become screen-dependent. A 20-minute daily limit teaches planning and value.",
        benefits_card3_title: "Life Skills, Not Just Lessons",
        benefits_card3_desc: "Covers not only math, but also physical activity and psychological resilience (Neptune).",
        benefits_card4_title: "Economy Through Play",
        benefits_card4_desc: "Through Venus virtual store, children learn earning, saving, and spending in practice.",

        parents_badge: "Parents Panel",
        parents_title: "Your peace of mind with complete analytics.",
        form_title: "Start building your child's future right now.",
        form_sub: "Sign up today — join us on cosmic learning journeys.",
        form_label_name: "Name",
        form_placeholder_name: "E.g., Dilnoza",
        form_label_phone: "Phone Number",
        form_placeholder_phone: "+998 __ ___ __ __",
        form_label_message: "Message",
        form_placeholder_message: "Write your message...",
        form_submit: "Send",
        form_submitting: "Sending…",
        form_success: "Thank you! We will contact you soon.",
        form_note: "Your information is kept completely secure.",

        team_badge: "Team",
        team_title: "Our Team",
        role_ceo: "Founder & CEO",
        role_mobile: "Mobile Developer",
        role_phd: "Doctor of Philological Sciences DSc",
        role_uiux: "UX/UI Designer",
        role_graphic: "Graphic Designer",
        role_dev: "Developer",

        cert_badge: "Recognition",
        cert_title: "Every achievement is duly celebrated.",
        cert_desc: 'Young explorers who successfully complete the missions across 8 worlds receive their very first "Cosmic Certificate". A confident step towards future triumphs.',

        cta_title: 'Join thousands of modern parents and start real development with <span class="hl">Kichik Alloma</span> today.',
        cta_btn: "Start Now",

        footer_contact: "Contacts:",
        footer_rights: "Kichik Alloma. All rights reserved."
    }
};

var currentSelectedLang = 'UZ';

function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'UZ';
    currentSelectedLang = lang;

    // HTML lang attributini yangilash
    document.documentElement.lang = (lang === 'UZ' ? 'uz' : (lang === 'RU' ? 'ru' : 'en'));

    // Dropdown knopkasidagi matn
    kaAll('.currentLang').forEach(function (el) {
        el.textContent = lang;
    });

    // Dropdowndagi tanlangan variant klassi
    kaAll('.lang-option').forEach(function (opt) {
        if (opt.getAttribute('data-lang') === lang) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });

    var dict = TRANSLATIONS[lang];

    // Matnli elementlarni tarjima qilish
    kaAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            el.textContent = dict[key];
        }
    });

    // HTML teglariga ega matnlarni tarjima qilish
    kaAll('[data-i18n-html]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) {
            el.innerHTML = dict[key];
        }
    });

    // Placeholderlarni tarjima qilish
    kaAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) {
            el.placeholder = dict[key];
        }
    });

    // Qanday ishlaydi bo'limini yangilash
    if (typeof window.updatePedagogyLang === 'function') {
        window.updatePedagogyLang(lang);
    }

    try {
        localStorage.setItem('ka_site_lang', lang);
    } catch (e) { }
}

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

/* ============ Lang Dropdown (Desktop & Mobil sinxron) ============ */
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

    // Variant tanlanganda har ikkala dropdownni sinxronlash va tilni o'zgartirish
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

/* ============ Forma ============ */
var kaForm = kaOne('#waitlistForm');
var kaSubmit = kaOne('#submitBtn');
if (kaForm && kaSubmit) {
    kaForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!kaForm.reportValidity()) return;
        var t = TRANSLATIONS[currentSelectedLang] || TRANSLATIONS.UZ;
        kaSubmit.disabled = true;
        kaSubmit.innerHTML = '<span>' + t.form_submitting + '</span>';
        setTimeout(function () {
            kaForm.reset();
            kaSubmit.disabled = false;
            kaSubmit.innerHTML = '<span>' + t.form_submit + '</span>';
            kaShowToast(t.form_success);
        }, 900);
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
    if (!section || !stack) return;

    var cards = kaAll('.planet-card-item', stack);
    if (cards.length === 0) return;

    var COLS = 4;
    var ROWS = 2;
    var CARD_W = 300;
    var CARD_H = 170;
    var GAP_X = 24;
    var GAP_Y = 24;

    function getFinalPositions() {
        var positions = [];
        var totalW = COLS * CARD_W + (COLS - 1) * GAP_X;
        var totalH = ROWS * CARD_H + (ROWS - 1) * GAP_Y;
        var startX = -totalW / 2 + CARD_W / 2;
        var startY = -totalH / 2 + CARD_H / 2;
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                positions.push({ x: startX + c * (CARD_W + GAP_X), y: startY + r * (CARD_H + GAP_Y) });
            }
        }
        return positions;
    }
    var finals = getFinalPositions();

    var initials = cards.map(function (_, i) {
        var offset = i - 3.5;
        return {
            x: offset * 6,
            y: offset * 4,
            r: offset * 1.2,
            s: 1 - Math.abs(offset) * 0.015
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

        cards.forEach(function (card, i) {
            var ini = initials[i];
            var fin = finals[i];
            if (!ini || !fin) return;

            var x = ini.x + (fin.x - ini.x) * ep;
            var y = ini.y + (fin.y - ini.y) * ep;
            var r = ini.r * (1 - ep);
            var s = ini.s + (1 - ini.s) * ep;

            card.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg) scale(' + s + ')';
            card.style.opacity = 1;
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

        var gridW = COLS * CARD_W + (COLS - 1) * GAP_X; // 1272
        var gridH = ROWS * CARD_H + (ROWS - 1) * GAP_Y; // 364

        var parentW = stack.parentElement.clientWidth;
        var parentH = window.innerHeight - 160;

        var scaleW = parentW / gridW;
        var scaleH = parentH / gridH;

        var scale = Math.min(1, scaleW, scaleH);
        stack.style.transform = 'scale(' + scale + ')';
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

    window.updatePedagogyLang = function (lang) {
        var t = TRANSLATIONS[lang] || TRANSLATIONS.UZ;
        STEPS[0].title = t.how_step1_title;
        STEPS[0].subtitle = t.how_step1_desc;
        STEPS[0].alt = t.how_step1_title;

        STEPS[1].title = t.how_step2_title;
        STEPS[1].subtitle = t.how_step2_desc;
        STEPS[1].alt = t.how_step2_title;

        STEPS[2].title = t.how_step3_title;
        STEPS[2].subtitle = t.how_step3_desc;
        STEPS[2].alt = t.how_step3_title;

        STEPS[3].title = t.how_step4_title;
        STEPS[3].subtitle = t.how_step4_desc;
        STEPS[3].alt = t.how_step4_title;

        if (mobileInitialized && mobileCard) {
            var currentIdx = mobileCurrentStep >= 0 ? mobileCurrentStep : 0;
            if (mobileTitle) mobileTitle.textContent = STEPS[currentIdx].title;
            if (mobileSubtitle) mobileSubtitle.textContent = STEPS[currentIdx].subtitle;
        }
    };

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

/* ============ Dastlabki tilni o'rnatish ============ */
(function initLanguage() {
    var savedLang = 'UZ';
    try {
        savedLang = localStorage.getItem('ka_site_lang') || 'UZ';
    } catch (e) { }
    setLanguage(savedLang);
})();


/* ============ Cosmic 3D Universe Integration ============ */
function openCosmicUniverse(planetKey) {
    if (window.Cosmic3D && typeof window.Cosmic3D.open === 'function') {
        window.Cosmic3D.open(planetKey);
    } else {
        // Fallback: try openUniverse
        if (typeof openUniverse === 'function') {
            openUniverse(planetKey);
        }
    }
}







/* ==========================================================================
   PLANET MODAL CONTROLLER (100% RELIABLE & INSTANT OPENING)
   ========================================================================== */
var PLANET_DETAIL_DATA = {
    mercury: {
        title: "Merkuriy",
        category: "Sayyora: <strong>Kelajak kasblari va Ijodkorlik</strong>",
        badge: "Kasblar Olamiga Sayohat",
        img: "img/planet_professions.png",
        modalClass: "modal-mercury",
        description: "Merkuriy — bolalarga 100 dan ortiq zamonaviy va kelajak kasblarini interaktiv o'yinlar orqali tanishtiruvchi ijodiy sayyora. Kichkintoy o'z qiziqishlarini kashf etadi, dizayner, muhandis, dasturchi va olim rollarida o'zini sinab ko'radi.",
        clipsHeading: "KASBLAR BO'YICHA IMKONIYATLAR",
        clips: [
            { icon: "🎨", title: "Rassom & Dizayner", sub: "Ranglar, shakllar va kompozitsiya" },
            { icon: "🚀", title: "Kosmik Muhandis", sub: "Raketa va robotlarni loyihalash" },
            { icon: "🔬", title: "Kichik Tadqiqotchi", sub: "Tabiat va fizika qonuniyatlari" }
        ]
    },
    venera: {
        title: "Venera",
        category: "Sayyora: <strong>Virtual do'kon va Moliyaviy savodxonlik</strong>",
        badge: "Gold Coin Do'koni",
        img: "img/venera.png",
        modalClass: "modal-venus",
        description: "Venera — barcha sayyoralarda bilim olib, mashq bajarib ishlab topilgan Gold Coin'lar sarflanadigan xavfsiz virtual do'kon. Bola o'z mehnati bilan topgan tangalarini to'g'ri rejalashtirishni va virtual avatarni bezashni o'rganadi.",
        clipsHeading: "DO'KON IMKONIYATLARI",
        clips: [
            { icon: "👨‍🚀", title: "Avatar kiyimlari", sub: "Skafandr, sehrgar va olim liboslari" },
            { icon: "🛋️", title: "Kosmik xona dizayni", sub: "Mebel, chiroqlar va shaxsiy burchak" },
            { icon: "🛡️", title: "100% Xavfsiz tizim", sub: "Real pul yo'q, faqat bilim evaziga" }
        ]
    },
    earth: {
        title: "Yer",
        category: "Sayyora: <strong>Kognitiv ta'lim va Sokratik AI</strong>",
        badge: "AI-Ustoz va Fikr Mashqlari",
        img: "img/earth.png",
        modalClass: "modal-earth",
        description: "Yer sayyorasida sun'iy intellekt bolaga tayyor javobni aytib bermaydi, balki savollar berish orqali uni mustaqil xulosa chiqarishga yo'naltiradi. Bu kognitiv moslashuvchanlik va tanqidiy fikrlashni rivojlantiradi.",
        clipsHeading: "KOGNITIV IMKONIYATLAR",
        clips: [
            { icon: "🧠", title: "Sokratik AI Suhbat", sub: "Savollar orqali mustaqil yechim topish" },
            { icon: "📚", title: "Interaktiv Kitoblar", sub: "Audio-vizual hikoyalar va ertaklar" },
            { icon: "🧩", title: "Mantiqiy Sinovlar", sub: "Bosqichma-bosqich chuqurlashuvchi testlar" }
        ]
    },
    mars: {
        title: "Mars",
        category: "Sayyora: <strong>Jismoniy faollik va Salomatlik</strong>",
        badge: "Harakat va Sport Olam",
        img: "img/mars.png",
        modalClass: "modal-mars",
        description: "Mars — ekrandan uzilib, real hayotda harakat qilishga undovchi dinamik sayyora. Kamera orqali mashqlar to'g'riligi tekshiriladi, bola sakraydi, yuguradi va kunlik jismoniy normani o'yin tarzida bajaradi.",
        clipsHeading: "HARAKATLI MASHQLAR",
        clips: [
            { icon: "🤸", title: "Ertalabki Gimnastika", sub: "Qiziqarli qahramonlar bilan badantarbiya" },
            { icon: "⚽", title: "Kosmik Chaqqonlik", sub: "Reaksiya va koordinatsiyani oshirish" },
            { icon: "⏱️", title: "Ko'z va Qomat Mashqi", sub: "Ekran charchog'ini yenguvchi tanaffuslar" }
        ]
    },
    jupiter: {
        title: "Yupiter",
        category: "Sayyora: <strong>O'z-o'zini boshqarish va Rejalashtirish</strong>",
        badge: "Kunlik Reja & Intizom",
        img: "img/planet_schedule.png",
        modalClass: "modal-jupiter",
        description: "Yupiter sayyorasi orqali bolalar vaqtni to'g'ri boshqarishni, kunlik vazifalarni ketma-ketlikda bajarishni va o'z maqsadlariga yetishish intizomini shakllantiradilar.",
        clipsHeading: "VAQT BOSHQARUVI",
        clips: [
            { icon: "📅", title: "Kunlik Jadval", sub: "Tongdan kechgacha tartibli reja tuzish" },
            { icon: "⏳", title: "Pomodoro Taymer", sub: "25 daqiqa dars va 5 daqiqa tanaffus" },
            { icon: "🏆", title: "Yutuqlar Doskasi", sub: "Har bir bajarilgan vazifa uchun rag'bat" }
        ]
    },
    saturn: {
        title: "Saturn",
        category: "Sayyora: <strong>Matematika va Mantiqiy fikrlash</strong>",
        badge: "Raqamlar & Mantiq",
        img: "img/saturn.png",
        modalClass: "modal-saturn",
        description: "Saturn — raqamlar, fazoviy tasavvur va mantiqiy jumboqlar sayyorasi. Qiziqarli vizual matematik o'yinlar orqali bolalar hisoblashni zavq bilan o'rganadilar.",
        clipsHeading: "MATEMATIK SINOVLAR",
        clips: [
            { icon: "🔢", title: "Vizual Arifmetika", sub: "Qo'shish, ayirish va ko'paytirish o'yinlari" },
            { icon: "📐", title: "Fazoviy Geometriya", sub: "3D shakllar va fazoviy tasavvur" },
            { icon: "🧩", title: "Rubik va Jumboqlar", sub: "Algoritmik va mantiqiy masalalar" }
        ]
    },
    uran: {
        title: "Uran",
        category: "Sayyora: <strong>Ingliz tili va Chet tillari</strong>",
        badge: "Speaking & Leksika",
        img: "img/uran.png",
        modalClass: "modal-uranus",
        description: "Uran sayyorasida bola ingliz tilini quruq yodlash emas, balki qahramonlar bilan jonli ovozli suhbat qurish orqali to'g'ri talaffuz va boy so'z boyligi bilan o'rganadi.",
        clipsHeading: "TIL O'RGANISH",
        clips: [
            { icon: "🎙️", title: "AI Speaking Coach", sub: "Jonli ovozli muloqot va talaffuz tahlili" },
            { icon: "🔤", title: "Vizual Lug'at", sub: "1500+ rasmli va ovozli yangi so'zlar" },
            { icon: "🎧", title: "Native Storytelling", sub: "Xorijiy qahramonlar hikoyalari" }
        ]
    },
    neptun: {
        title: "Neptun",
        category: "Sayyora: <strong>Emotsional savodxonlik va Psixologiya</strong>",
        badge: "Hissiyotlar & Hamdardlik",
        img: "img/neptun.png",
        modalClass: "modal-neptune",
        description: "Neptun — bolaning ichki dunyosi, hissiyotlari va empatiyasini rivojlantiruvchi sayyora. Qahramonlar yordamida g'azab, qo'rquv va quvonchni to'g'ri ifodalash o'rgatiladi.",
        clipsHeading: "EMOTSIONAL RIVOJLANISH",
        clips: [
            { icon: "❤️", title: "Hissiyotlar Kundaligi", sub: "Bugun o'zingni qanday his qilyapsan?" },
            { icon: "🧘", title: "Tinchlanish Nafas Mashqi", sub: "Stress va charchoqni ketkazuvchi nafas" },
            { icon: "🤝", title: "Empatiya Hikoyalari", sub: "Do'stlik, mehr va hamjihatlik saboqlari" }
        ]
    }
};

function openPlanetDetail(planetKey) {
    var data = PLANET_DETAIL_DATA[planetKey];
    if (!data) return;

    var backdrop = document.getElementById('planet-detail-modal');
    var dialog = document.getElementById('planet-modal-dialog');
    if (!backdrop || !dialog) return;

    // Reset classes
    dialog.className = 'planet-modal-dialog ' + (data.modalClass || '');

    var imgEl = document.getElementById('planetModalImg');
    var titleEl = document.getElementById('planetModalTitle');
    var catEl = document.getElementById('planetModalCategory');
    var badgeEl = document.getElementById('planetModalBadge');
    var descEl = document.getElementById('planetModalDesc');
    var clipsHeadingEl = document.getElementById('planetClipsHeading');
    var clipsContainer = document.getElementById('planetModalClips');

    if (imgEl) {
        imgEl.src = data.img;
        imgEl.alt = data.title;
    }
    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.innerHTML = data.category;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (descEl) descEl.textContent = data.description;
    if (clipsHeadingEl) clipsHeadingEl.textContent = data.clipsHeading;

    if (clipsContainer && data.clips) {
        clipsContainer.innerHTML = data.clips.map(function(clip) {
            return '<div class="planet-clip-card">' +
                '<span class="planet-clip-icon">' + clip.icon + '</span>' +
                '<h5 class="planet-clip-title">' + clip.title + '</h5>' +
                '<p class="planet-clip-sub">' + clip.sub + '</p>' +
            '</div>';
        }).join('');
    }

    backdrop.style.display = 'flex';
    requestAnimationFrame(function() {
        backdrop.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
}

function closePlanetDetail() {
    var backdrop = document.getElementById('planet-detail-modal');
    if (backdrop) {
        backdrop.classList.remove('active');
        setTimeout(function() {
            backdrop.style.display = 'none';
        }, 300);
    }
    document.body.style.overflow = '';
}

function handlePlanetModalBackdrop(e) {
    if (e.target && (e.target.id === 'planet-detail-modal' || e.target.classList.contains('planet-modal-backdrop'))) {
        closePlanetDetail();
    }
}

// Global window assignments
window.openPlanetDetail = openPlanetDetail;
window.closePlanetDetail = closePlanetDetail;
window.handlePlanetModalBackdrop = handlePlanetModalBackdrop;

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePlanetDetail();
});










/* ==========================================================================
   PERFECTLY CENTERED 3D FAN STACK CONTROLLER (INSTANT CLICK & ZERO GAP)
   - O'rtada markazlashgan holda turadi
   - Kartaning ustiga bossangiz 100% ishonchli Disney modal ochiladi
   - Oldingi / Keyingi tugmalari va nuqtalar orqali silliq aylanadi
   ========================================================================== */
(function initCenteredFanStack() {
    var stage = document.getElementById('planetCardsStage');
    var track = document.getElementById('planetCarouselTrack');
    var prevBtn = document.getElementById('planetPrevBtn');
    var nextBtn = document.getElementById('planetNextBtn');
    var dotsContainer = document.getElementById('planetIndicatorDots');
    var counterNum = document.querySelector('.planet-counter-num');
    var counterName = document.getElementById('planetActiveName');

    if (!track) return;

    var cards = Array.from(track.querySelectorAll('.planet-3d-card'));
    var totalCards = cards.length;
    var activeIndex = 0; // 0..7
    var isDragging = false;
    var startX = 0;
    var dragMoved = 0;

    var PLANET_NAMES = [
        "Merkuriy", "Venera", "Yer", "Mars", 
        "Yupiter", "Saturn", "Uran", "Neptun"
    ];

    // Indikator nuqtalar
    if (dotsContainer) {
        dotsContainer.innerHTML = cards.map(function(_, i) {
            return '<div class="planet-dot ' + (i === 0 ? 'active' : '') + '" data-index="' + i + '"></div>';
        }).join('');

        dotsContainer.querySelectorAll('.planet-dot').forEach(function(dot) {
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                var idx = parseInt(this.getAttribute('data-index'), 10);
                setActivePlanet(idx);
            });
        });
    }

    // Direct card click — Bosganda to'g'ridan-to'g'ri aktiv qiladi va modalni ochadi!
    cards.forEach(function(card, i) {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            if (dragMoved > 15) return;
            var planet = this.getAttribute('data-planet');
            setActivePlanet(i);
            if (planet && typeof openPlanetDetail === 'function') {
                openPlanetDetail(planet);
            }
        });
    });

    function setActivePlanet(newIndex) {
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= totalCards) newIndex = totalCards - 1;
        activeIndex = newIndex;
        updateDeck();
    }

    function updateDeck() {
        // O'rtaga o'tish uchun mukammal markaziy hisob-kitob
        // Butun dasta kengligi ~175px bo'lgani uchun uni to'g'ri o'rtaga joylashtirish
        var centerOffset = 50;

        cards.forEach(function(card, i) {
            var rel = (i - activeIndex + totalCards) % totalCards;

            if (rel === 0) {
                // ACTIVE FRONT CARD: Markazda, to'g'ri, eng katta va yorqin
                card.style.transform = 'translate3d(' + centerOffset + 'px, 0, 0) rotate(0deg) scale(1)';
                card.style.zIndex = '20';
                card.style.opacity = '1';
                card.classList.add('is-active');
            } else {
                // CARDS BEHIND: Chapga qarab qiya dasta (media_1788290592952.png kabi)
                var shiftX = centerOffset - (rel * 26); // -26px chapga
                var shiftY = rel * 4.5;                 // ozgina pastga
                var rot = -rel * 2.8;                   // -2.8deg chapga qiya
                var sc = 1 - rel * 0.018;               // biroz kichrayish

                card.style.transform = 'translate3d(' + shiftX + 'px, ' + shiftY + 'px, 0) rotate(' + rot + 'deg) scale(' + sc + ')';
                card.style.zIndex = '' + (20 - rel);
                card.style.opacity = '1';
                card.classList.remove('is-active');
            }
        });

        // Update Dots & Counter Badge
        if (dotsContainer) {
            var dots = dotsContainer.querySelectorAll('.planet-dot');
            dots.forEach(function(dot, idx) {
                dot.classList.toggle('active', idx === activeIndex);
            });
        }

        if (counterNum) counterNum.textContent = (activeIndex + 1) + ' / ' + totalCards;
        if (counterName) counterName.textContent = PLANET_NAMES[activeIndex] || '';

        if (prevBtn) prevBtn.classList.toggle('disabled', activeIndex === 0);
        if (nextBtn) nextBtn.classList.toggle('disabled', activeIndex >= totalCards - 1);
    }

    // Oldingi / Keyingi tugmalari
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (activeIndex > 0) setActivePlanet(activeIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (activeIndex < totalCards - 1) setActivePlanet(activeIndex + 1);
        });
    }

    // Touch & Mouse Drag
    if (stage) {
        stage.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            dragMoved = 0;
        });

        window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            dragMoved = Math.abs(e.clientX - startX);
        });

        window.addEventListener('mouseup', function(e) {
            if (!isDragging) return;
            isDragging = false;
            var diff = e.clientX - startX;
            if (diff < -40 && activeIndex < totalCards - 1) {
                setActivePlanet(activeIndex + 1);
            } else if (diff > 40 && activeIndex > 0) {
                setActivePlanet(activeIndex - 1);
            }
        });

        stage.addEventListener('touchstart', function(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            dragMoved = 0;
        }, { passive: true });

        stage.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            dragMoved = Math.abs(e.touches[0].clientX - startX);
        }, { passive: true });

        stage.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            var diff = e.changedTouches[0].clientX - startX;
            if (diff < -35 && activeIndex < totalCards - 1) {
                setActivePlanet(activeIndex + 1);
            } else if (diff > 35 && activeIndex > 0) {
                setActivePlanet(activeIndex - 1);
            }
        }, { passive: true });
    }

    updateDeck();
})();
