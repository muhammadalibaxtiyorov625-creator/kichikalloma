const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Bazaga ulanishda xatolik:', err.message);
  } else {
    console.log('SQLite ma\'lumotlar bazasiga muvaffaqiyatli ulandi.');
  }
});

// Jadvallarni yaratish va boshlang'ich ma'lumotlarni kiritish
db.serialize(() => {
  // 1. Qulayliklar jadvali (Amenities)
  db.run(`
    CREATE TABLE IF NOT EXISTS amenities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT DEFAULT '',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Sayyoralar jadvali (Planets - Rasmli)
  db.run(`
    CREATE TABLE IF NOT EXISTS planets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT DEFAULT '/images/planets/earth.svg',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Xabarlar jadvali (Messages)
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Boshlang'ich qulayliklar
  db.get("SELECT COUNT(*) as count FROM amenities", (err, row) => {
    if (!err && row.count === 0) {
      const initialAmenities = [
        ['Ota-ona nazorati', 'Farzandingizning kunlik va haftalik faolligi, o\'rganishga sarflayotgan vaqti hamda umumiy rivojlanish darajasini aniq statistika va qulay hisobotlar orqali real vaqt rejimida kuzatib boring.', '', 'active'],
        ['Kichik odatlar, katta natijalar', 'Kundalik darslarni to\'g\'ri rejalashtirish, diqqat-e\'tiborni bir joyga jamlash va samarali tanaffuslarni tizimlashtirish orqali bolada barqaror o\'rganish ko\'nikmalarini shakllantiradi.', '', 'active'],
        ['Dars tayyorlashga yordam', 'Farzandingizga mantiqiy savollar va bosqichma-bosqich ko\'rsatmalar orqali masalaning tub mohiyatini tushunishga hamda mustaqil yechim topishga yo\'naltiradi.', '', 'active'],
        ['Xavfsiz raqamli muhit', 'Nomaqbul kontent va keraksiz chalg\'ituvchi omillardan to\'liq himoyalangan hudud: bola platformada erkin bilim kashf etadi va yangi narsalarni o\'rganadi, ota-ona esa uning xavfsizligidan ko\'ngli to\'q bo\'ladi.', '', 'active'],
        ['O\'z rivojlanish yo\'li', 'Har bir bolaning individual bilim darajasi va qobiliyatini hisobga olgan holda ortiqcha bosimsiz, o\'zining qulay tezligida va ishonch bilan o\'sadi.', '', 'active']
      ];

      const stmt = db.prepare("INSERT INTO amenities (title, description, icon, status) VALUES (?, ?, ?, ?)");
      initialAmenities.forEach(amenity => stmt.run(amenity));
      stmt.finalize();
    }
  });

  // Boshlang'ich Sayyoralar (8 ta sayyora rasmlari bilan)
  db.get("SELECT COUNT(*) as count FROM planets", (err, row) => {
    if (!err && row.count === 0) {
      const initialPlanets = [
        ['FIKRLASH VA BILIM', 'Masalani tushunish, yechimni topish.', '/images/planets/earth.svg', 'active'],
        ['NUTQ VA TIL', 'Fikrni aniq ifodalashni o\'rganish.', '/images/planets/mars.svg', 'active'],
        ['O\'ZINI BOSHQARISH', 'Kichik odatlar katta natijalarga olib boradi.', '/images/planets/cyan-rings.svg', 'active'],
        ['HISSIYOTLARNI ANGLASH', 'O\'zini his qilishni tushunish, anglash.', '/images/planets/coral.svg', 'active'],
        ['IJODKORLIK VA TASAVVUR', 'Yangi g\'oyalar yaratish uchun makon.', '/images/planets/deep-blue.svg', 'active'],
        ['IJTIMOIY KO\'NIKMALAR', 'Birgalikda o\'rganish va muloqot qilish.', '/images/planets/saturn.svg', 'active'],
        ['HARAKAT VA SOG\'LIK', 'O\'rganish orasida harakat ham kerak.', '/images/planets/purple.svg', 'active'],
        ['QADRIYAT VA MAS\'ULIYAT', 'Har bir tanlovning oqibati bor.', '/images/planets/teal-moon.svg', 'active']
      ];

      const stmt = db.prepare("INSERT INTO planets (title, description, image, status) VALUES (?, ?, ?, ?)");
      initialPlanets.forEach(p => stmt.run(p));
      stmt.finalize();
      console.log("Boshlang'ich 8 ta rasmli sayyora bazaga kiritildi.");
    }
  });
});

module.exports = db;
