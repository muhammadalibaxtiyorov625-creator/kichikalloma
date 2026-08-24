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
            ("Kichik Alloma nima?", "Kichik Alloma — bu bolalar uchun 9 ta rivojlanish sayyoralari va sun'iy intellekt orqali mantiqiy, nutqiy va ijodiy fikrlashni rivojlantiruvchi interaktiv ta'lim platformasi.", "active", 1),
            ("AI yordamchi ovozi qanday ishlaydi?", "Farzandingiz yoshiga qarab (3-7 yosh va 7-11 yosh) Alloma AI quvnoq va muloyim HD ovozda savollarga do'stona va tushunarli tarzda javob beradi.", "active", 2),
            ("Ota-onalar nazorati qanday ishlaydi?", "Ota-onalar profilida farzandning kunlik, haftalik va oylik AI dan foydalanish statistikasi hamda barcha savol-javoblar tarixi to'liq ko'rsatiladi.", "active", 3),
            ("4 xonali kirish kodi nima uchun kerak?", "Ilovaga xavfsiz va tez kirish hamda ota-ona profilidagi shaxsiy sozlamalarni himoyalash uchun ishlatiladi.", "active", 4)
        ]
        cursor.executemany(
            "INSERT INTO faqs (name, description, status, order_num) VALUES (?, ?, ?, ?)",
            initial_faqs
        )
        print("Boshlang'ich FAQ savollari bazaga muvaffaqiyatli kiritildi.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
