#!/bin/bash
set -e

DIR="/var/www/kichik-alloma"
cd "$DIR"

echo "=========================================="
echo "🚀 1. Paketlar tekshirilmoqda..."
echo "=========================================="
sudo apt update
sudo apt install -y python3 python3-pip python3-venv nodejs npm git nginx certbot python3-certbot-nginx

echo "=========================================="
echo "🐍 2. Python Virtual Environment..."
echo "=========================================="
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

echo "=========================================="
echo "⚛️ 3. Frontend Build qilinmoqda..."
echo "=========================================="
cd website
npm install
npx vite build
cd ..

echo "=========================================="
echo "⚙️ 4. Systemd xizmati o'rnatilmoqda..."
echo "=========================================="
sudo cp kichik-alloma.service /etc/systemd/system/kichik-alloma.service
sudo systemctl daemon-reload
sudo systemctl enable kichik-alloma
sudo systemctl restart kichik-alloma

echo "=========================================="
echo "✅ Loyiha muvaffaqiyatli ishga tushdi!"
echo "Status: sudo systemctl status kichik-alloma"
echo "Loglar: sudo journalctl -u kichik-alloma -f"
echo "=========================================="
