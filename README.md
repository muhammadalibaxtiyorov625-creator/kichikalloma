# Bolalar Ta'lim Platformasi - Python FastAPI REST API & Admin Panel (Port 3009)

Bolalar ta'limi va rivojlanishi platformasi uchun Python FastAPI REST API va Zamonaviy Sariq-Qora Admin Panel tizimi.

---

## 📌 Barcha API Marshrutlari (`/api/website/`):

- 🪐 `/api/website/planets` — Rasmli 8 ta ta'limiy sayyoralarni boshqarish (CRUD).
- ⭐ `/api/website/amenities` — Ta'limiy qulayliklarni boshqarish (CRUD).
- 👥 `/api/website/teams` — Bizning Jamoa: Ismi, familiyasi, yo'nalishi/kasbi va rasmlarini boshqarish (CRUD).
- ✉️ `/api/website/messages` — Mijoz xabarlari (qabul qilish, o'qilgan qilish, o'chirish).
- 📊 `/api/website/stats` — Tizim hisobotlari va statistikasi.
- 🌐 `/api/website/landing` — Asosiy veb-sayt uchun to'liq ma'lumotlar to'plami (Sayyoralar, Qulayliklar, Jamoa).
- 🖼 `/api/website/upload` — Kompyuterdan rasm yuklash (to'liq URL qaytaradi).

---

## 👥 Bizning Jamoa (Teams) xususiyatlari:
Har bir a'zo quyidagi ma'lumotlarga ega:
- **Ismi** (`first_name`)
- **Familiyasi** (`last_name`)
- **To'liq ismi** (`full_name`)
- **Yo'nalishi / Mutaxassisligi / Kasbi** (`role`) — masalan: *Bolalar Psixologi*, *Bosh Metodist*, *Mental Arifmetika Murabbiyi*
- **Rasmi** (`image`) — 3D/SVG avatarlar yoki kompyuterdan yuklangan o'z rasmi (to'liq Base URL bilan)
- **Qisqacha ma'lumot** (`bio`)
- **Holati** (`status`: active/inactive)

---

## 🚀 Ishga tushirish (Port 3009):
1. **Lokal ishga tushirish**: `run.bat` faylini 2 marta bosing.
2. **Internet orqali ulash (Public Sharing)**: `share_online.bat` faylini bosing.

---

## 🌐 Havolalar:
- **👑 Admin Panel**: [http://localhost:3009](http://localhost:3009)
- **📖 Swagger Docs**: [http://localhost:3009/docs](http://localhost:3009/docs)
- **👥 Jamoa API**: [http://localhost:3009/api/website/teams](http://localhost:3009/api/website/teams)
