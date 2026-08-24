# 🚀 Serverga Joylashtirish (Deployment) va CI/CD To'liq Qo'llanmasi

Ushbu qo'llanma orqali siz **Kichik Alloma** loyihasini istalgan Linux (Ubuntu / Debian) VPS serveriga 5 daqiqada Docker orqali o'rnatishingiz va GitHub Actions yordamida har safar kod o'zgarganda avtomatik serverda yangilanadigan (CI/CD) tizimini yo'lga qo'yishingiz mumkin.

---

## 📑 Mundarija
1. [1-Qadam: Serverni tayyorlash (VPS)](#1-qadam-serverni-tayyorlash-vps)
2. [2-Qadam: Loyihani serverga yuklash va ishga tushirish](#2-qadam-loyihani-serverga-yuklash-va-ishga-tushirish)
3. [3-Qadam: Domen va SSL (HTTPS) ulash](#3-qadam-domen-va-ssl-https-ulash)
4. [4-Qadam: GitHub Actions CI/CD ni yoqish (Avtomatik Deploy)](#4-qadam-github-actions-cicd-ni-yoqish-avtomatik-deploy)
5. [Foydali buyruqlar va boshqaruv](#foydali-buyruqlar-va-boshqaruv)

---

## 1-Qadam: Serverni tayyorlash (VPS)

Serveringizga SSH orqali kiring:
```bash
ssh root@SIZNING_SERVER_IP
```

Serverda Docker, xavfsizlik (Fayrvoll) va kerakli paketlarni 1 ta buyruq bilan o'rnatish uchun:
```bash
curl -fsSL https://raw.githubusercontent.com/SIZNING_PROFILINGIZ/REPO_NOMI/main/setup_server.sh | bash
```
*Yoki qo'lda quyidagilarni bajaring:*
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw
curl -fsSL https://get.docker.com | sh
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable
```

---

## 2-Qadam: Loyihani serverga yuklash va ishga tushirish

1. Loyihani `/var/www/kichik-alloma` papkasiga klon qiling:
```bash
git clone https://github.com/SIZNING_PROFILINGIZ/REPO_NOMI.git /var/www/kichik-alloma
cd /var/www/kichik-alloma
```

2. Muhit o'zgaruvchilari faylini (`.env`) yarating:
```bash
cp .env.example .env
nano .env
```
*(Kerakli `GEMINI_API_KEY`, `JWT_SECRET_KEY` va `BASE_URL` qiymatlarini kiriting va `Ctrl+O`, `Enter`, `Ctrl+X` bilan saqlang)*

3. Docker konteynerlarni quring va ishga tushiring:
```bash
docker compose up -d --build
```

Endi loyiha serveringizda ishlayapti:
- **Web sayt:** `http://SIZNING_SERVER_IP:3000` yoki `http://SIZNING_SERVER_IP`
- **Admin Panel:** `http://SIZNING_SERVER_IP:3000/admin`
- **Swagger Docs:** `http://SIZNING_SERVER_IP:3000/docs`

---

## 3-Qadam: Domen va SSL (HTTPS) ulash

Agar domeningiz bo'lsa (masalan: `alloma.uz` va `khv.alloma.uz`):

1. Domeningiz DNS sozlamalariga quyidagi **A-record**larni qo'shing:
   - `@` -> `SIZNING_SERVER_IP`
   - `khv` -> `SIZNING_SERVER_IP`
   - `admin` -> `SIZNING_SERVER_IP`

2. Bepul Let's Encrypt SSL sertifikatini olish:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d alloma.uz -d khv.alloma.uz -d admin.alloma.uz
```

---

## 4-Qadam: GitHub Actions CI/CD ni yoqish (Avtomatik Deploy)

Siz GitHub ga har safar yangi kod `push` qilganingizda, serveringizdagi loyiha hech qanday qo'l aralashuvisiz avtomatik yangilanadi!

### 1. SSH kalit yaratish (Serverda):
Serveringizda:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy
```
Ekranda chiqqan **Private Key** (`-----BEGIN OPENSSH PRIVATE KEY-----` dan `-----END OPENSSH PRIVATE KEY-----` gacha) ni nusxalab oling.

### 2. GitHub Secrets ga qo'shish:
GitHub repozitoriyangizga kiring:
👉 **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:

Quyidagi 4 ta sirli kalitni (Secrets) qo'shing:

| Secret Nomi | Qiymati | Izoh |
|---|---|---|
| `SERVER_HOST` | `194.163.xxx.xxx` | Serveringizning IP manzili |
| `SERVER_USER` | `root` yoki `ubuntu` | Server foydalanuvchi nomi |
| `SERVER_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY...` | Yuqorida nusxalangan SSH kalit |
| `SERVER_PORT` | `22` | SSH porti |
| `SERVER_PROJECT_PATH` | `/var/www/kichik-alloma` | Loyiha joylashgan papka yo'li |

Endi har safar:
```bash
git add .
git commit -m "Yangi imkoniyat qo'shildi"
git push origin main
```
qilganingizda, **GitHub Actions** avtomatik ishga tushadi va serveringizdagi loyihani 1 daqiqa ichida yangilab qo'yadi!

---

## 🛠️ Foydali buyruqlar va boshqaruv

- **Loglarni jonli ko'rish:**
  ```bash
  docker compose logs -f app
  ```
- **Konteynerlar holatini tekshirish:**
  ```bash
  docker compose ps
  ```
- **Qo'lda yangilash (agar CI/CD ishlatilmasa):**
  ```bash
  ./deploy.sh
  ```
- **Serverni qayta ishga tushirish:**
  ```bash
  docker compose restart
  ```
- **Ma'lumotlar bazasini zaxira qilish (Backup):**
  ```bash
  cp /var/www/kichik-alloma/database.sqlite /var/backups/database_backup_$(date +%F).sqlite
  ```
