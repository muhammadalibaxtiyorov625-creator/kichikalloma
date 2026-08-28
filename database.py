import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database.sqlite")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Meta jadvali (Birinchi marta ochilganini tekshirish)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_meta (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)

    # 1. Sayyoralar jadvali (Planets - Rasmli)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS planets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            image TEXT DEFAULT '/images/planets/earth.svg',
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 2. Qulayliklar jadvali (Amenities)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS amenities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            icon TEXT DEFAULT '',
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 3. Xabarlar jadvali (Messages)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 4. Jamoa jadvali (Teams)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            role TEXT NOT NULL,
            description TEXT DEFAULT '',
            image TEXT DEFAULT '/images/team/member1.svg',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Agar teams jadvalida description bo'lmasa qo'shish
    cursor.execute("PRAGMA table_info(teams)")
    team_cols = [c["name"] for c in cursor.fetchall()]
    if "description" not in team_cols:
        cursor.execute("ALTER TABLE teams ADD COLUMN description TEXT DEFAULT ''")

    # 5. Galereya jadvali (Gallery - Rasmlar to'plami)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT DEFAULT '',
            image TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 6. Mobil Foydalanuvchilar (Mobile Users)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE,
            passcode TEXT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Agar users jadvali avval boshqa ustunlar bilan yaratilgan bo'lsa, xavfsiz ustun qo'shish
    cursor.execute("PRAGMA table_info(users)")
    existing_cols = [c["name"] for c in cursor.fetchall()]
    if "phone" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN phone TEXT")
    if "passcode" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN passcode TEXT")
    if "last_login" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN last_login DATETIME")

    # 7. OTP Kodlar jadvali (Mobile OTP Codes)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS otp_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT NOT NULL,
            code TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_used INTEGER DEFAULT 0
        )
    """)

    # 8. Bolalar jadvali (Children Linked to Mobile User)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS children (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            year TEXT NOT NULL,
            gender TEXT NOT NULL,
            language TEXT DEFAULT 'uzb',
            avatar TEXT DEFAULT '/images/avatars/boy1.png',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    # Agar children jadvalida language va avatar ustunlari bo'lmasa xavfsiz qo'shish
    cursor.execute("PRAGMA table_info(children)")
    child_cols = [c["name"] for c in cursor.fetchall()]
    if "language" not in child_cols:
        cursor.execute("ALTER TABLE children ADD COLUMN language TEXT DEFAULT 'uzb'")
    if "avatar" not in child_cols:
        cursor.execute("ALTER TABLE children ADD COLUMN avatar TEXT DEFAULT '/images/avatars/boy1.png'")

    # 9. Farzand Faolligi va Vaqt Statistikasi (Child Activity & Screen Time)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS child_activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            child_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            minutes_spent INTEGER DEFAULT 0,
            messages_count INTEGER DEFAULT 0,
            planet_id INTEGER DEFAULT 42,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE CASCADE
        )
    """)

    # 10. AI Suhbat Tarixi (AI Chat History)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ai_chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            child_id INTEGER,
            role TEXT NOT NULL,
            message TEXT NOT NULL,
            audio_url TEXT DEFAULT NULL,
            planet_id INTEGER DEFAULT NULL,
            planet_name TEXT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    # 11. Farzand Emotsiyalari va Kayfiyat Kundaligi (Neptune / Emotsiyalar Sayyorasi)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS child_emotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            child_id INTEGER NOT NULL,
            emotion_key TEXT NOT NULL,
            emotion_name TEXT NOT NULL,
            emoji TEXT NOT NULL DEFAULT '😊',
            color TEXT DEFAULT '#4FACFE',
            intensity INTEGER DEFAULT 3,
            note TEXT DEFAULT '',
            planet_id INTEGER DEFAULT 46,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    # Tekshirish: Baza birinchi marta yaratildimi?
    cursor.execute("SELECT value FROM system_meta WHERE key = 'seeded'")
    seeded_row = cursor.fetchone()

    if not seeded_row:
        # 1. Boshlang'ich 8 ta rasmli sayyoralar
        initial_planets = [
            ('FIKRLASH VA BILIM', 'Masalani tushunish, yechimni topish.', '/images/planets/earth.svg', 'active'),
            ('NUTQ VA TIL', 'Fikrni aniq ifodalashni o\'rganish.', '/images/planets/mars.svg', 'active'),
            ('O\'ZINI BOSHQARISH', 'Kichik odatlar katta natijalarga olib boradi.', '/images/planets/cyan-rings.svg', 'active'),
            ('HISSIYOTLARNI ANGLASH', 'O\'zini his qilishni tushunish, anglash.', '/images/planets/coral.svg', 'active'),
            ('IJODKORLIK VA TASAVVUR', 'Yangi g\'oyalar yaratish uchun makon.', '/images/planets/deep-blue.svg', 'active'),
            ('IJTIMOIY KO\'NIKMALAR', 'Birgalikda o\'rganish va muloqot qilish.', '/images/planets/saturn.svg', 'active'),
            ('HARAKAT VA SOG\'LIK', 'O\'rganish orasida harakat ham kerak.', '/images/planets/purple.svg', 'active'),
            ('QADRIYAT VA MAS\'ULIYAT', 'Har bir tanlovning oqibati bor.', '/images/planets/teal-moon.svg', 'active')
        ]
        cursor.executemany(
            "INSERT INTO planets (title, description, image, status) VALUES (?, ?, ?, ?)",
            initial_planets
        )

        # 2. Boshlang'ich qulayliklar
        initial_amenities = [
            ('Ota-ona nazorati', 'Farzandingizning kunlik va haftalik faolligi, o\'rganishga sarflayotgan vaqti hamda umumiy rivojlanish darajasini aniq statistika va qulay hisobotlar orqali real vaqt rejimida kuzatib boring.', '', 'active'),
            ('Kichik odatlar, katta natijalar', 'Kundalik darslarni to\'g\'ri rejalashtirish, diqqat-e\'tiborni bir joyga jamlash va samarali tanaffuslarni tizimlashtirish orqali bolada barqaror o\'rganish ko\'nikmalarini shakllantiradi.', '', 'active'),
            ('Dars tayyorlashga yordam', 'Farzandingizga mantiqiy savollar va bosqichma-bosqich ko\'rsatmalar orqali masalaning tub mohiyatini tushunishga hamda mustaqil yechim topishga yo\'naltiradi.', '', 'active'),
            ('Xavfsiz raqamli muhit', 'Nomaqbul kontent va keraksiz chalg\'ituvchi omillardan to\'liq himoyalangan hudud: bola platformada erkin bilim kashf etadi va yangi narsalarni o\'rganadi, ota-ona esa uning xavfsizligidan ko\'ngli to\'q bo\'ladi.', '', 'active'),
            ('O\'z rivojlanish yo\'li', 'Har bir bolaning individual bilim darajasi va qobiliyatini hisobga olgan holda ortiqcha bosimsiz, o\'zining qulay tezligida va ishonch bilan o\'sadi.', '', 'active')
        ]
        cursor.executemany(
            "INSERT INTO amenities (title, description, icon, status) VALUES (?, ?, ?, ?)",
            initial_amenities
        )

        # 3. Boshlang'ich xabarlar
        initial_messages = [
            ('Ali Valiyev', '+998 90 123 45 67', 'Assalomu alaykum, sayyoralar dasturi bo\'yicha batafsil ma\'lumot olmoqchi edim.', 0),
            ('Dilnoza Karimova', '+998 93 987 65 43', 'Salom! Ota-ona nazorati qulayligi qanday ishlaydi?', 1),
            ('Javohir Toshmatov', '+998 99 555 12 34', 'Ta\'lim platformangiz juda zo\'r ishlangan ekan!', 0)
        ]
        cursor.executemany(
            "INSERT INTO messages (name, phone, message, is_read) VALUES (?, ?, ?, ?)",
            initial_messages
        )

        # 4. Boshlang'ich Jamoa a'zolari (Teams)
        initial_teams = [
            ('Aziz', 'Rahimov', 'Bosh Ta\'lim Metodisti', '/images/team/member1.svg'),
            ('Madina', 'Karimova', 'Bolalar Psixologi', '/images/team/member3.svg'),
            ('Jasur', 'Aliyev', 'Mantiq va Dasturlash Murabbiyi', '/images/team/member2.svg'),
            ('Nigora', 'Usmonova', 'Nutq va Til Rivojlantirish Mutaxassisi', '/images/team/member4.svg')
        ]
        cursor.executemany(
            "INSERT INTO teams (first_name, last_name, role, image) VALUES (?, ?, ?, ?)",
            initial_teams
        )

        # 5. Boshlang'ich Galereya rasmlari (Gallery)
        initial_gallery = [
            ('Interaktiv Dars Jarayoni', '/images/gallery/photo1.svg'),
            ('Mantiqiy O\'yinlar Mashg\'uloti', '/images/gallery/photo2.svg'),
            ('Ijodkorlik & San\'at To\'garagi', '/images/gallery/photo3.svg'),
            ('Rivojlanish Sayyoralari Ko\'rgazmasi', '/images/gallery/photo4.svg')
        ]
        cursor.executemany(
            "INSERT INTO gallery (title, image) VALUES (?, ?)",
            initial_gallery
        )

    # 11. FAQ (Ko'p so'raladigan savollar) jadvali
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            order_num INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tekshirish: FAQ jadvali bo'shmi? Bo'lsa boshlang'ich savollarni kiritamiz
    cursor.execute("SELECT COUNT(*) as cnt FROM faqs")
    faq_cnt = cursor.fetchone()["cnt"]
    if faq_cnt == 0:
        initial_faqs = [
            ("Kichik Alloma platformasi nima va u kimlar uchun mo'ljallangan?", "Kichik Alloma — 3 yoshdan 11 yoshgacha bo'lgan bolalarning aqliy, mantiqiy, nutqiy va ijodiy salohiyatini rivojlantiruvchi interaktiv ta'lim platformasidir. Platforma bolalarga sayyoralar bo'ylab qiziqarli o'yinlar, ertaklar, so'z boyligi va sun'iy intellekt orqali ta'lim beradi.", "active", 1),
            ("Alloma AI yordamchisi qanday ishlaydi va uning ovozli muloqot xususiyati bormi?", "Alloma AI — Google Gemini ilg'or sun'iy intellekt texnologiyasi asosida yaratilgan pedagogik yordamchidir. Bola unga mikrofon orqali ovozli savollar berishi, darslar haqida so'rashi, ertaklar eshitishi yoki yangi bilimlarni xavfsiz va tushunarli tilda o'rganishi mumkin.", "active", 2),
            ("Uran sayyorasida ingliz tilini qanday o'rganish mumkin (So'zlar, talaffuz va testlar)?", "Uran sayyorasi bolalarning chet tilini o'rganishi uchun mo'ljallangan bo'lib, 10 ta asosiy mavzu (Mevalar, Hayvonlar, Ranglar, Maktab, Oila va h.k.), har bir so'zning sof audio talaffuzi, rasmlar, transkripsiya va 4 ta variantli interaktiv test savollarini o'z ichiga oladi.", "active", 3),
            ("Ota-onalar farzandining ta'lim jarayonini qanday nazorat qiladi (Ota-onalar burchagi)?", "Maxsus himoyalangan 'Ota-onalar burchagi' orqali bolaning qaysi sayyoralarni o'rganganligi, kunlik sarflagan vaqti, test natijalari, so'z boyligi o'sishi va muvaffaqiyat hisobotlarini real vaqtda kuzatib borish mumkin.", "active", 4),
            ("Mobil ilovadan internet bo'lmaganda ham foydalanish mumkinmi (Offline rejim)?", "Ha! Yuklab olingan barcha sayyora darslari, audio ertaklar va ingliz tili so'zlari offline rejimda, internetsiz ham to'liq va uzluksiz ishlaydi. Sayr yoki safarda internet talab etilmaydi.", "active", 5)
        ]
        cursor.executemany(
            "INSERT INTO faqs (name, description, status, order_num) VALUES (?, ?, ?, ?)",
            initial_faqs
        )
        print("Boshlang'ich 5 ta FAQ savollari bazaga muvaffaqiyatli kiritildi.")

    # 12. Uran / Nutq va Til Sayyorasi — Kategoriyalar jadvali (Uran Categories)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS uran_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_en TEXT DEFAULT '',
            name_ru TEXT DEFAULT '',
            image TEXT DEFAULT '/images/categories/fruits.svg',
            description TEXT DEFAULT '',
            status TEXT DEFAULT 'active',
            order_num INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 13. Uran / Nutq va Til Sayyorasi — So'zlar jadvali (Uran Words)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS uran_words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            word_uz TEXT NOT NULL,
            word_en TEXT NOT NULL,
            word_ru TEXT DEFAULT '',
            transcription TEXT DEFAULT '',
            image TEXT DEFAULT '',
            audio_url TEXT DEFAULT '',
            example_sentence TEXT DEFAULT '',
            example_translation TEXT DEFAULT '',
            order_num INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES uran_categories (id) ON DELETE CASCADE
        )
    """)

    # 14. Uran / Test Natijalari (Child Quiz Results)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS child_uran_quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            child_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            score INTEGER DEFAULT 0,
            total_questions INTEGER DEFAULT 0,
            percentage REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    # Uran kategoriyalari bo'shmi? Bo'lsa boyitilgan boshlang'ich ma'lumotlar bilan to'ldiramiz
    cursor.execute("SELECT COUNT(*) as cnt FROM uran_categories")
    uran_cat_cnt = cursor.fetchone()["cnt"]
    if uran_cat_cnt == 0:
        initial_uran_data = [
            {
                "category": ("Meva va Sabzavotlar", "Fruits & Vegetables", "Фрукты и Овощи", "/images/categories/fruits.svg", "Meva va sabzavotlarning inglizcha va o'zbekcha nomlarini o'rganamiz", "active", 1),
                "words": [
                    ("Olma", "Apple", "Яблоко", "[ˈæp.əl]", "An apple a day keeps the doctor away.", "Kuniga bitta olma shifokordan asraydi.", 1),
                    ("Banan", "Banana", "Банан", "[bəˈnæn.ə]", "Monkeys love sweet yellow bananas.", "Maymunlar shirin sariq bananlarni yaxshi ko'radi.", 2),
                    ("Apelsin", "Orange", "Апельсин", "[ˈɒr.ɪndʒ]", "Orange is full of healthy vitamin C.", "Apelsin foydali vitamin C ga boy.", 3),
                    ("Qulupnay", "Strawberry", "Клубника", "[ˈstrɔː.bər.i]", "Strawberries are red and very sweet.", "Qulupnaylar qizil va juda shirin.", 4),
                    ("Tarvuz", "Watermelon", "Арбуз", "[ˈwɔː.təˌmel.ən]", "Watermelon is a juicy summer fruit.", "Tarvuz sersuv yozgi mevadir.", 5),
                    ("Uzum", "Grape", "Виноград", "[ɡreɪp]", "Sweet grapes grow in big bunches.", "Shirin uzumlar katta shingil bo'lib o'sadi.", 6),
                    ("Limon", "Lemon", "Лимон", "[ˈlem.ən]", "Lemon has a fresh sour taste.", "Limon yangi nordon ta'mga ega.", 7),
                    ("Shaftoli", "Peach", "Персик", "[piːtʃ]", "Fresh peaches are soft and delicious.", "Yangi shaftolilar yumshoq va mazali.", 8),
                    ("Sabzi", "Carrot", "Морковь", "[ˈkær.ət]", "Rabbits like eating crunchy carrots.", "Quyonlar qarsildoq sabzini yeyishni yoqtiradi.", 9),
                    ("Pomidor", "Tomato", "Помидор", "[təˈmɑː.təʊ]", "Red tomatoes are used in fresh salad.", "Qizil pomidorlar yangi salatda ishlatiladi.", 10),
                    ("Bodring", "Cucumber", "Огурец", "[ˈkjuː.kʌm.bər]", "Cucumber is crispy, cool and green.", "Bodring qarsildoq, salqin va yashil.", 11),
                    ("Kartoshka", "Potato", "Картофель", "[pəˈteɪ.təʊ]", "Potatoes can be boiled or baked.", "Kartoshkani qaynatish yoki pishirish mumkin.", 12)
                ]
            },
            {
                "category": ("Hayvonlar olami", "Animals", "Животные", "/images/categories/animals.svg", "Yovvoyi va uy hayvonlarining nomlarini o'rganamiz", "active", 2),
                "words": [
                    ("Sher", "Lion", "Лев", "[ˈlaɪ.ən]", "The lion is the king of the savanna.", "Sher savanna podshohidir.", 1),
                    ("Fil", "Elephant", "Слон", "[ˈel.ɪ.fənt]", "The elephant is the largest land animal.", "Fil quruqlikdagi eng katta hayvondir.", 2),
                    ("Yo'lbars", "Tiger", "Тигр", "[ˈtaɪ.ɡər]", "The tiger has beautiful striped fur.", "Yo'lbarsning go'zal chiziqli terisi bor.", 3),
                    ("Maymun", "Monkey", "Обезьяна", "[ˈmʌŋ.ki]", "The monkey swings cheerfully on branches.", "Maymun daraxt shoxlarida quvnoq uchadi.", 4),
                    ("Kuchuk", "Dog", "Собака", "[dɒɡ]", "The dog is a faithful friend to people.", "Kuchuk odamlarga sadoqatli do'stdir.", 5),
                    ("Mushuk", "Cat", "Кошка", "[kæt]", "The cat purrs softly when stroked.", "Mushuk silaganda ohista xurillaydi.", 6),
                    ("Ot", "Horse", "Лошадь", "[hɔːs]", "The horse gallops swiftly across the field.", "Ot dala bo'ylab chaqqon yuguradi.", 7),
                    ("Quyon", "Rabbit", "Кролик", "[ˈræb.ɪt]", "The rabbit has soft fur and long ears.", "Quyonning yumshoq yungi va uzun quloqlari bor.", 8),
                    ("Ayiq", "Bear", "Медведь", "[beər]", "The bear loves eating fresh forest berries.", "Ayiq yangi o'rmon mevalarini yeyishni yoqtiradi.", 9),
                    ("Jirafa", "Giraffe", "Жираф", "[dʒɪˈrɑːf]", "The giraffe reaches the highest green leaves.", "Jirafa eng baland yashil barglarga yetadi.", 10),
                    ("Bo'ri", "Wolf", "Волк", "[wʊlf]", "The grey wolf lives together in a pack.", "Kulrang bo'ri to'dada birga yashaydi.", 11),
                    ("Tulki", "Fox", "Лиса", "[fɒks]", "The cunning fox has a fluffy tail.", "Ayyor tulkining momiq dumi bor.", 12)
                ]
            },
            {
                "category": ("Ranglar va Shakllar", "Colors & Shapes", "Цвета и Формы", "/images/categories/colors.svg", "Asosiy ranglar va geometrik shakllar", "active", 3),
                "words": [
                    ("Qizil", "Red", "Красный", "[red]", "The red apple is ripe and sweet.", "Qizil olma pishgan va shirin.", 1),
                    ("Ko'k", "Blue", "Синий", "[bluː]", "The clear summer sky is bright blue.", "Musaffo yozgi osmon yorqin ko'k rangda.", 2),
                    ("Yashil", "Green", "Зеленый", "[ɡriːn]", "Fresh green leaves grow on trees.", "Daraxtlarda yangi yashil barglar o'smoqda.", 3),
                    ("Sariq", "Yellow", "Желтый", "[ˈjel.əʊ]", "The morning sun shines bright yellow.", "Ertalabki quyosh yorqin sariq porlaydi.", 4),
                    ("Oq", "White", "Белый", "[waɪt]", "Soft white snow covers the garden.", "Yumshoq oq qor bog'ni qoplab olgan.", 5),
                    ("Qora", "Black", "Черный", "[blæk]", "The midnight sky is completely black.", "Yarim tunda osmon butunlay qora.", 6),
                    ("To'q sariq", "Orange", "Оранжевый", "[ˈɒr.ɪndʒ]", "Ripe oranges are bright orange.", "Pishgan apelsinlar yorqin to'q sariq.", 7),
                    ("Doira", "Circle", "Круг", "[ˈsɜː.kəl]", "The round wheel has a circle shape.", "Dumaloq g'ildirak doira shakliga ega.", 8),
                    ("Kvadrat", "Square", "Квадрат", "[skweər]", "A square box has four equal sides.", "Kvadrat qutining to'rtta teng tomoni bor.", 9),
                    ("Uchburchak", "Triangle", "Треугольник", "[ˈtraɪ.æŋ.ɡəl]", "A slice of yummy pizza is a triangle.", "Mazali pitssa bo'lagi uchburchakdir.", 10)
                ]
            },
            {
                "category": ("Oila va Inson", "Family & People", "Семья и Люди", "/images/categories/family.svg", "Oila a'zolari va odamlar", "active", 4),
                "words": [
                    ("Ota", "Father", "Отец", "[ˈfɑː.ðər]", "My father helps me with my studies.", "Otam menga darslarimda yordam beradi.", 1),
                    ("Ona", "Mother", "Мать", "[ˈmʌð.ər]", "My mother gives the warmest hugs.", "Onam eng samimiy quchoq ochadi.", 2),
                    ("Aka / Uka", "Brother", "Брат", "[ˈbrʌð.ər]", "I love playing games with my brother.", "Men ukam bilan o'yin o'ynashni yaxshi ko'raman.", 3),
                    ("Opa / Singil", "Sister", "Сестра", "[ˈsɪs.tər]", "My sister shares her favorite toys.", "Singlim sevimli o'yinchoqlarini baham ko'radi.", 4),
                    ("Bobo", "Grandfather", "Дедушка", "[ˈɡræn.fɑː.ðər]", "Grandfather tells magical fairy tales.", "Bobom sehrli ertaklar aytib beradi.", 5),
                    ("Buvi", "Grandmother", "Бабушка", "[ˈɡræn.mʌð.ər]", "Grandmother bakes delicious honey cake.", "Buvim mazali asalli tort pishiradi.", 6),
                    ("O'g'il bola", "Boy", "Мальчик", "[bɔɪ]", "The brave boy solved the puzzle.", "Jasur o'g'il bola jumboqni yechdi.", 7),
                    ("Qiz bola", "Girl", "Девочка", "[ɡɜːl]", "The smart girl reads many books.", "Aqlli qiz bola ko'p kitob o'qiydi.", 8),
                    ("Chaqaloq", "Baby", "Малыш", "[ˈbeɪ.bi]", "The cute baby giggles cheerfully.", "Yoqimtoy chaqaloq quvnoq kuladi.", 9),
                    ("Do'st", "Friend", "Друг", "[frend]", "A true friend is always by your side.", "Haqiqiy do'st doimo yoningizda bo'ladi.", 10)
                ]
            },
            {
                "category": ("Maktab va O'qish", "School & Learning", "Школа и Учеба", "/images/categories/school.svg", "Maktab anjomlari va ta'lim so'zlari", "active", 5),
                "words": [
                    ("Kitob", "Book", "Книга", "[bʊk]", "Reading books gives great wisdom.", "Kitob o'qish katta donolik beradi.", 1),
                    ("Ruchka", "Pen", "Ручка", "[pen]", "I write my exercises with a blue pen.", "Men mashqlarimni ko'k ruchkada yozaman.", 2),
                    ("Qalam", "Pencil", "Карандаш", "[ˈpen.səl]", "Draw a picture with this sharp pencil.", "Bu o'tkir qalam bilan rasm chizing.", 3),
                    ("Maktab", "School", "Школа", "[skuːl]", "We learn exciting knowledge at school.", "Biz maktabda ajoyib bilimlarni o'rganamiz.", 4),
                    ("O'qituvchi", "Teacher", "Учитель", "[ˈtiː.tʃər]", "Our teacher explains everything kindly.", "O'qituvchimiz hamma narsani mehribonlik bilan tushuntiradi.", 5),
                    ("O'quvchi", "Student", "Ученик", "[ˈstjuː.dənt]", "Every student listens carefully in class.", "Har bir o'quvchi darsda diqqat bilan tinglaydi.", 6),
                    ("Sumka", "Bag", "Сумка", "[bæɡ]", "Put your notebooks into your school bag.", "Daftarlaringizni maktab sumkangizga soling.", 7),
                    ("Parta", "Desk", "Парта", "[desk]", "Sit straight at your classroom desk.", "Sinf partangizda to'g'ri o'tiring.", 8),
                    ("Chizg'ich", "Ruler", "Линейка", "[ˈruː.lər]", "Use a ruler to draw a straight line.", "To'g'ri chiziq chizish uchun chizg'ichdan foydalaning.", 9),
                    ("O'chirg'ich", "Eraser", "Ластик", "[ɪˈreɪ.zər]", "An eraser cleans pencil marks neatly.", "O'chirg'ich qalam izlarini toza o'chiradi.", 10)
                ]
            },
            {
                "category": ("Kiyim-kechak", "Clothes", "Одежда", "/images/categories/clothes.svg", "Kiyimlar va poyabzallar", "active", 6),
                "words": [
                    ("Ko'ylak", "Shirt", "Рубашка", "[ʃɜːt]", "I iron my clean white shirt.", "Men toza oq ko'ylagimni dazmollayman.", 1),
                    ("Futbolka", "T-shirt", "Футболка", "[ˈtiː.ʃɜːt]", "I wear a bright yellow T-shirt in summer.", "Yozda men yorqin sariq futbolka kiyaman.", 2),
                    ("Shim", "Pants", "Брюки", "[pænts]", "These warm pants are great for cold days.", "Bu issiq shim sovuq kunlar uchun ajoyib.", 3),
                    ("Poyabzal", "Shoes", "Обувь", "[ʃuːz]", "Tie your running shoes tightly.", "Yugurish poyabzalingizni mahkam bog'lang.", 4),
                    ("Bosh kiyim", "Hat", "Шляпа", "[hæt]", "Put on your hat on sunny days.", "Quyoshli kunlarda bosh kiyimingizni kiying.", 5),
                    ("Kurtka", "Jacket", "Куртка", "[ˈdʒæk.ɪt]", "Wear a thick jacket when going outside.", "Tashqariga chiqqanda qalin kurtka kiying.", 6),
                    ("Paypoq", "Socks", "Носки", "[sɒks]", "Soft cotton socks keep feet comfortable.", "Yumshoq paxta paypoqlar oyoqlarga qulaylik beradi.", 7),
                    ("Ko'ylak (ayollar)", "Dress", "Платье", "[dres]", "She wore a lovely pink dress.", "U chiroyli pushti ko'ylak kiyib oldi.", 8),
                    ("Etik", "Boots", "Сапоги", "[buːts]", "Rubber boots are perfect for rain.", "Rezina etiklar yomg'ir uchun juda mos.", 9),
                    ("Qo'lqop", "Gloves", "Перчатки", "[ɡlʌvz]", "Warm gloves protect hands from frost.", "Issiq qo'lqoplar qo'llarni sovuqdan asraydi.", 10)
                ]
            },
            {
                "category": ("Tabiat va Ob-havo", "Nature & Weather", "Природа и Погода", "/images/categories/nature.svg", "Tabiat hodisalari va koinot", "active", 7),
                "words": [
                    ("Quyosh", "Sun", "Солнце", "[sʌn]", "The bright sun warms the Earth.", "Yorqin quyosh Yerni isitadi.", 1),
                    ("Oy", "Moon", "Луна", "[muːn]", "The silver moon shines at night.", "Kumushrang oy kechasi nur sochadi.", 2),
                    ("Yulduz", "Star", "Звезда", "[stɑːr]", "Stars twinkle brightly in the night sky.", "Yulduzlar tungi osmonda yorqin miltillaydi.", 3),
                    ("Daraxt", "Tree", "Дерево", "[triː]", "The green tree gives fresh oxygen.", "Yashil daraxt toza kislorod beradi.", 4),
                    ("Gul", "Flower", "Цветок", "[ˈflaʊ.ər]", "The red flower blooms in the garden.", "Qizil gul bog'da unib chiqadi.", 5),
                    ("Bulut", "Cloud", "Облако", "[klaʊd]", "Fluffy white clouds float in the sky.", "Momiq oq bulutlar osmonda suzadi.", 6),
                    ("Yomg'ir", "Rain", "Дождь", "[reɪn]", "Raindrops fall gently on the ground.", "Yomg'ir tomchilari yerga mayin yog'adi.", 7),
                    ("Qor", "Snow", "Снег", "[snəʊ]", "Children love playing in fresh snow.", "Bolalar yangi qorda o'ynashni yaxshi ko'radi.", 8),
                    ("Tog'", "Mountain", "Гора", "[ˈmaʊn.tɪn]", "The high mountain touches the blue sky.", "Baland tog' ko'k osmonga tegib turadi.", 9),
                    ("Dengiz", "Sea", "Море", "[siː]", "The blue sea is full of fascinating fish.", "Moviy dengiz ajoyib baliqlarga to'la.", 10)
                ]
            },
            {
                "category": ("Transport va Sayohat", "Transport & Travel", "Транспорт и Путешествия", "/images/categories/transport.svg", "Transport vositalari va sayohat", "active", 8),
                "words": [
                    ("Mashina", "Car", "Машина", "[kɑːr]", "The fast electric car drives smoothly.", "Tezkor elektromobil ravon harakatlanadi.", 1),
                    ("Avtobus", "Bus", "Автобус", "[bʌs]", "The yellow bus carries passengers safely.", "Sariq avtobus yo'lovchilarni xavfsiz tashiydi.", 2),
                    ("Samolyot", "Airplane", "Самолет", "[ˈeə.pleɪn]", "The airplane flies high above the clouds.", "Samolyot bulutlardan balandda uchadi.", 3),
                    ("Poezd", "Train", "Поезд", "[treɪn]", "The fast train moves on strong steel rails.", "Tezkor poezd mustahkam po'lat relslarda yuradi.", 4),
                    ("Velosiped", "Bicycle", "Велосипед", "[ˈbaɪ.sɪ.kəl]", "Riding a bicycle is very good for health.", "Velosiped minish salomatlik uchun juda foydali.", 5),
                    ("Kema", "Ship", "Корабль", "[ʃɪp]", "The large ship crosses the deep ocean.", "Katta kema chuqur okeanni kesib o'tadi.", 6),
                    ("Vertolyot", "Helicopter", "Вертолет", "[ˈhel.ɪˌkɒp.tər]", "The rescue helicopter lands quickly.", "Qutqaruv vertolyoti tezda qo'nadi.", 7),
                    ("Raketa", "Rocket", "Ракета", "[ˈrɒk.ɪt]", "The space rocket journeys to distant planets.", "Koinot raketasi olis sayyoralarga yo'l oladi.", 8),
                    ("Qayiq", "Boat", "Лодка", "[bəʊt]", "We paddle a small boat on the quiet lake.", "Biz sokin ko'lda kichik qayiqda suzamiz.", 9),
                    ("Taksi", "Taxi", "Такси", "[ˈtæk.si]", "The yellow taxi arrived on time.", "Sariq taksi o'z vaqtida yetib keldi.", 10)
                ]
            },
            {
                "category": ("Uy va Buyumlar", "Home & Objects", "Дом и Вещи", "/images/categories/home.svg", "Uy-ro'zg'or buyumlari va jihozlar", "active", 9),
                "words": [
                    ("Uy", "House", "Дом", "[haʊs]", "Our warm house is very welcoming.", "Bizning issiq uyimiz juda mehmondo'st.", 1),
                    ("Xona", "Room", "Комната", "[ruːm]", "My bright room is tidy and organized.", "Mening yorug' xonam ozoda va tartibli.", 2),
                    ("Eshik", "Door", "Дверь", "[dɔːr]", "Please close the room door quietly.", "Iltimos, xona eshigini ohista yoping.", 3),
                    ("Deraza", "Window", "Окно", "[ˈwɪn.dəʊ]", "Fresh breeze comes through the open window.", "Ochiq derazadan toza shabada keladi.", 4),
                    ("Stol", "Table", "Стол", "[ˈteɪ.bəl]", "We enjoy dinner together at the big table.", "Biz katta stolda birga kechki ovqat qilamiz.", 5),
                    ("Stul", "Chair", "Стул", "[tʃeər]", "Sit down on this comfortable chair.", "Bu qulay stulga o'tiring.", 6),
                    ("Karavot", "Bed", "Кровать", "[bed]", "Sleep peacefully in your cozy bed.", "Shinam karavotingizda tinch uxlang.", 7),
                    ("Soat", "Clock", "Часы", "[klɒk]", "The clock on the wall shows the exact time.", "Devordagi soat aniq vaqtni ko'rsatadi.", 8),
                    ("Chiroq", "Lamp", "Лампа", "[læmp]", "Turn on the reading lamp for your homework.", "Uy vazifangiz uchun dars chirog'ini yoqing.", 9),
                    ("Finjon", "Cup", "Чашка", "[kʌp]", "Drink sweet warm cocoa from your mug.", "Finjoningizdan shirin iliq kakao iching.", 10)
                ]
            },
            {
                "category": ("Kasblar", "Professions", "Профессии", "/images/categories/professions.svg", "Kasblar va mutaxassisliklar", "active", 10),
                "words": [
                    ("Shifokor", "Doctor", "Врач", "[ˈdɒk.tər]", "The doctor helps people stay healthy.", "Shifokor odamlarga sog'lom bo'lishga yordam beradi.", 1),
                    ("O'qituvchi", "Teacher", "Учитель", "[ˈtiː.tʃər]", "The teacher inspires students to learn.", "O'qituvchi o'quvchilarni o'rganishga ilhomlantiradi.", 2),
                    ("Uchuvchi", "Pilot", "Пилот", "[ˈpaɪ.lət]", "The pilot flies airplanes to other countries.", "Uchuvchi samolyotlarni boshqa davlatlarga boshqaradi.", 3),
                    ("Kosmonavt", "Astronaut", "Космонавт", "[ˈæs.trə.nɔːt]", "The astronaut explores the universe in space.", "Kosmonavt koinotda borliqni tadqiq qiladi.", 4),
                    ("Politsiya", "Police", "Полицейский", "[pəˈliːs]", "Police officers protect our safety every day.", "Politsiya xodimlari har kuni xavfsizligimizni himoya qiladi.", 5),
                    ("O't o'chiruvchi", "Firefighter", "Пожарный", "[ˈfaɪəˌfaɪ.tər]", "The brave firefighter puts out fires.", "Jasur o't o'chiruvchi olovni o'chiradi.", 6),
                    ("Oshpaz", "Chef", "Повар", "[ʃef]", "The master chef cooks delicious food.", "Usta oshpaz mazali taomlar tayyorlaydi.", 7),
                    ("Rassom", "Artist", "Художник", "[ˈɑː.tɪst]", "The talented artist paints lively portraits.", "Iqtidorli rassom jonli portretlar chizadi.", 8),
                    ("Quruvchi", "Builder", "Строитель", "[ˈbɪl.dər]", "Builders construct sturdy new houses.", "Quruvchilar mustahkam yangi uylar qurishadi.", 9),
                    ("Haydovchi", "Driver", "Водитель", "[ˈdraɪ.vər]", "The driver drives passenger buses safely.", "Haydovchi yo'lovchi avtobuslarini xavfsiz boshqaradi.", 10)
                ]
            }
        ]

        for item in initial_uran_data:
            cat_tuple = item["category"]
            cursor.execute(
                "INSERT INTO uran_categories (name, name_en, name_ru, image, description, status, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)",
                cat_tuple
            )
            cat_id = cursor.lastrowid
            cat_image = cat_tuple[3]
            words_to_insert = [
                (cat_id, w[0], w[1], w[2], w[3], cat_image, "", w[4], w[5], w[6])
                for w in item["words"]
            ]
            cursor.executemany(
                "INSERT INTO uran_words (category_id, word_uz, word_en, word_ru, transcription, image, audio_url, example_sentence, example_translation, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                words_to_insert
            )
        print("Boshlang'ich Uran (Nutq va Til) kategoriyalari va so'zlari muvaffaqiyatli kiritildi.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()

