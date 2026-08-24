#!/bin/bash
set -e

DIR="/var/www/kichik-alloma"
cd "$DIR"

echo "=========================================="
echo "🛑 1. Eski jarayonlar to'xtatilmoqda..."
echo "=========================================="
sudo systemctl stop kichik-alloma 2>/dev/null || true
sudo fuser -k 3000/tcp 8000/tcp 2>/dev/null || true
sudo pkill -9 -f "uvicorn" 2>/dev/null || true

echo "=========================================="
echo "🚀 2. Tizim paketlari o'rnatilmoqda..."
echo "=========================================="
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git psmisc

echo "=========================================="
echo "🐍 3. Python kutubxonalari o'rnatilmoqda..."
echo "=========================================="
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

echo "=========================================="
echo "⚙️ 4. Systemd xizmati sozlanmoqda (Port: 3000)..."
echo "=========================================="
sudo cp kichik-alloma.service /etc/systemd/system/kichik-alloma.service
sudo systemctl daemon-reload
sudo systemctl enable kichik-alloma
sudo systemctl start kichik-alloma

sleep 2

echo "=========================================="
echo "🔍 5. Tizim holati tekshirilmoqda..."
echo "=========================================="
sudo systemctl status kichik-alloma --no-pager

echo ""
echo "=========================================="
echo "✅ Barcha xizmatlar 100% muvaffaqiyatli ishga tushdi!"
echo "Web sayt & API: http://189.74.97.98:3000/"
echo "Admin Panel:    http://189.74.97.98:3000/admin"
echo "API Docs:       http://189.74.97.98:3000/docs"
echo "=========================================="
