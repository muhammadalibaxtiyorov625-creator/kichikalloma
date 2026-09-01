@echo off
title Ta'lim Platformasi - Web Sayt & Admin Portal (3000)
color 0B
echo ================================================================
echo   Kichik Alloma - Web Sayt, Admin Panel va REST API Tizimi
echo ================================================================
echo.
echo Kutubxonalar tekshirilmoqda...
pip install -r requirements.txt
echo.
echo ================================================================
echo  🌐 Asosiy Web Sayt:          http://localhost:3000
echo  🛡️ Sub-domen Admin Panel:    http://khv.localhost:3000
echo  🛡️ To'g'ridan-to'g'ri Admin: http://localhost:3000/admin
echo  📖 Swagger API Docs:         http://localhost:3000/docs
echo ================================================================
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 3000 --reload
pause

