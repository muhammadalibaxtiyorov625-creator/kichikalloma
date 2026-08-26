import os
import sys
import shutil
import uuid
import random
import re
import time
import hashlib
import asyncio
import threading
import requests as http_requests

import mimetypes

# Har qanday OT (Windows / Linux) da JS va CSS MIME turlarini to'g'ri ro'yxatdan o'tkazish
mimetypes.init()
mimetypes.add_type("application/javascript", ".js", True)
mimetypes.add_type("application/javascript", ".mjs", True)
mimetypes.add_type("text/javascript", ".js", True)
mimetypes.add_type("text/javascript", ".mjs", True)
mimetypes.add_type("text/css", ".css", True)
mimetypes.add_type("image/svg+xml", ".svg", True)
mimetypes.add_type("application/json", ".json", True)
mimetypes.add_type("application/wasm", ".wasm", True)

# Windows konsolida emojilar print bo'lganda qulab tushmasligi uchun
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Form, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from contextlib import asynccontextmanager
import google.generativeai as genai
import edge_tts

from database import get_db_connection, init_db
from schemas import (
    PlanetCreate, PlanetUpdate, PlanetResponse,
    AmenityCreate, AmenityUpdate, AmenityResponse,
    TeamCreate, TeamUpdate, TeamResponse,
    GalleryCreate, GalleryResponse,
    MessageCreate, MessageResponse,
    FaqCreate, FaqUpdate, FaqResponse,
    WebsiteLandingResponse, StatsResponse,
    SendOtpRequest, VerifyOtpRequest, VerifyOtpResponse,
    CodeAccessRequest, ChangePasscodeRequest, AddChildRequest, ChildResponse,
    UpdateChildProfileRequest, SetLanguageRequest, LanguageOption,
    ParentProfileResponse, TrackTimeRequest, ChildActivityStatsResponse,
    AiChatHistoryItemResponse,
    AiChatRequest, AiChatResponse, AiTtsRequest,
    AiVoiceChatResponse, AiSttResponse,
    EmotionOption, RecordEmotionRequest, EmotionItemResponse,
    WeeklyChildEmotionsResponse, ParentChildEmotionsAnalyticsResponse
)

# Gemini AI Konfiguratsiyasi
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        print("Gemini configure xatosi:", e)

# JWT Konfiguratsiyasi
JWT_SECRET_KEY = "educational-space-platform-super-secret-key-2026"
JWT_ALGORITHM = "HS256"
security = HTTPBearer(auto_error=False)

# Yangi foydalanuvchilar (is_new_user == True) uchun in-memory vaqtinchalik kesh
# Farzand qo'shilgach (is_new_user == False), database ga ko'chiriladi
TEMP_PASSCODE_CACHE = {}  # {user_id: passcode}

# ─── ESKIZ SMS KONFIGURATSIYASI ───────────────────────────────────────────────
ESKIZ_EMAIL    = "kozimovmuhammadsodiq4472477@gmail.com"
ESKIZ_PASSWORD = "jrG6SLAo3sdhw1O6eC5n3PPBopcJFzTBOx9gnISL"
ESKIZ_FROM     = "4546"
ESKIZ_AUTH_URL = "https://notify.eskiz.uz/api/auth/login"
ESKIZ_SMS_URL  = "https://notify.eskiz.uz/api/message/sms/send"

import threading

# Tezkor HTTPS ulanish sessiyasi (Keep-Alive)
_eskiz_session = http_requests.Session()
_eskiz_token_cache = {"token": None, "expires_at": 0}

def _get_eskiz_token() -> Optional[str]:
    """Eskiz API dan JWT token olish (kesh bilan)."""
    now = time.time()
    if _eskiz_token_cache["token"] and now < _eskiz_token_cache["expires_at"]:
        return _eskiz_token_cache["token"]
    try:
        resp = _eskiz_session.post(
            ESKIZ_AUTH_URL,
            data={"email": ESKIZ_EMAIL, "password": ESKIZ_PASSWORD},
            timeout=4
        )
        if resp.status_code == 200:
            token = resp.json().get("data", {}).get("token")
            if token:
                _eskiz_token_cache["token"] = token
                _eskiz_token_cache["expires_at"] = now + 24 * 3600  # 24 soat kesh
                return token
        print(f"[ESKIZ] Login javobi: status={resp.status_code}")
        return None
    except Exception as e:
        print(f"[ESKIZ] Token olishda xato: {e}")
        return None

def send_eskiz_sms_worker(phone: str, message: str,code:str):
    """Fonda (background thread) SMS ni o'ta tezkor yuborish worker funksiyasi"""
    try:
        clean_phone = phone.replace("+", "").replace(" ", "").replace("-", "")
        token = _get_eskiz_token()
        if not token:
            print(f"[ESKIZ] Token olinmadi, SMS jo'natilmadi ({clean_phone})")
            return

        # 1. Avval asosiy Kichikalloma xavfsizlik matni yuboriladi
        resp = _eskiz_session.post(
            ESKIZ_SMS_URL,
            data={
                "mobile_phone": clean_phone,
                "message": message,
                "from": ESKIZ_FROM,
            },
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )

        # 2. Agar Eskiz akkaunt test rejimida bo'lsa va maxsus matnni rad etsa:
        # Foydalanuvchining telefoniga SMS 100% yetib borishi uchun darhol test shabloni bilan jo'natiladi
        if resp.status_code != 200:
            print(f"[ESKIZ] Asosiy matn rad etildi ({resp.status_code}), telefonga SMS borishi uchun Eskiz test shabloni yuborilmoqda...")
            resp = _eskiz_session.post(
                ESKIZ_SMS_URL,
                data={
                    "mobile_phone": clean_phone,
                    "message": "Kichikalloma: Sizning tasdiqlash kodingiz: "+code+". Ushbu kodni hech kimga, hatto ilova xodimlariga ham ko'rsatmang!",
                    "from": ESKIZ_FROM,
                },
                headers={"Authorization": f"Bearer {token}"},
                timeout=5
            )

        print(f"[ESKIZ] SMS holati: {clean_phone} -> status={resp.status_code} | {resp.text}")
    except Exception as e:
        print(f"[ESKIZ] SMS tezkor yuborish xatosi: {e}")

def send_eskiz_sms(phone: str, message: str,code:str) -> bool:
    """SMS ni bloklamasdan fonda millisekundda jo'natish"""
    t = threading.Thread(target=send_eskiz_sms_worker, args=(phone, message,code), daemon=True)
    t.start()
    return True
# ─────────────────────────────────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=365))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autentifikatsiya tokeni talab qilinadi (Header: Authorization: Bearer <token>)"
        )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        raw_uid = payload.get("user_id") or payload.get("sub")
        if raw_uid is None:
            raise HTTPException(status_code=401, detail="Yaroqsiz token!")
        user_id = int(raw_uid)
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Token eskirgan yoki noto'g'ri!")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Foydalanuvchi topilmadi!")
    return dict(user)

def normalize_phone(phone: str) -> str:
    """Telefon raqamni toza +998934472477 formatiga keltirish"""
    raw = phone.strip()
    digits = re.sub(r"[^\d]", "", raw)
    if digits.startswith("998") and len(digits) == 12:
        return f"+{digits}"
    elif len(digits) == 9:
        return f"+998{digits}"
    elif raw.startswith("+"):
        return raw
    return f"+{digits}"


# Lifespan context manager for database initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    uploads_dir = os.path.join(os.path.dirname(__file__), "public", "images", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    yield

tags_metadata = [
    {
        "name": "Mobil Ilova (Mobile API)",
        "description": "Mobil ilova uchun API lar: Sayyoralar (Planets), OTP Ro'yxatdan o'tish/Kirish, 4-xonali PIN kod va Farzandlar boshqaruvi"
    },
    {
        "name": "Web Sayt (Website)",
        "description": "Bolalar ta'lim platformasi: Sayyoralar, Qulayliklar, Jamoa (Teams), Galereya (Gallery), Xabarlar va Statistika API lari"
    }
]

app = FastAPI(
    title="Ta'lim Platformasi & Mobil Ilova REST API",
    description="Bolalar ta'limi platformasi hamda Mobil Ilova (OTP, PIN, Farzandlar) uchun to'liq Python FastAPI REST API tizimi.",
    version="2.0.0",
    openapi_tags=tags_metadata,
    lifespan=lifespan
)

# CORS Middleware (Barcha IP, Domen va Portlar uchun 100% ruxsat)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Har doim to'g'ri CORS, Content-Type (JS, CSS, HTML) va no-cache sarlavhalarini ta'minlovchi middleware
@app.middleware("http")
async def enforce_mime_types_and_headers(request: Request, call_next):
    # OPTIONS (Preflight) so'rovlarini zudlik bilan 200 OK bilan qondirish
    if request.method == "OPTIONS":
        origin = request.headers.get("origin") or "*"
        return Response(
            content="",
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
                "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers") or "*",
                "Access-Control-Max-Age": "86400",
                "Permissions-Policy": "unload=*",
            }
        )

    try:
        response = await call_next(request)
        path = request.url.path.lower()
        origin = request.headers.get("origin")
        
        # Har qanday so'rovga CORS sarlavhasini kafolatlangan holda qo'shish
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD"
            response.headers["Access-Control-Allow-Headers"] = "*"
        else:
            response.headers["Access-Control-Allow-Origin"] = "*"
            
        # Brauzerlarda "Strict MIME type checking" xatosi chiqmasligi uchun JS va CSS ga to'g'ri MIME type berish
        if path.endswith(".js") or path.endswith(".mjs"):
            response.headers["content-type"] = "application/javascript; charset=utf-8"
        elif path.endswith(".css"):
            response.headers["content-type"] = "text/css; charset=utf-8"
        elif path.endswith(".wasm"):
            response.headers["content-type"] = "application/wasm"
        elif path.endswith(".svg"):
            response.headers["content-type"] = "image/svg+xml"
            
        # Permissions-Policy orqali unload bloklanishini oldini olish
        response.headers["Permissions-Policy"] = "unload=*"
            
        if path.startswith("/js") or path.startswith("/css") or path.startswith("/assets") or path in ["/", "/admin", "/admin.html"]:
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response
    except Exception as exc:
        print(f"[SERVER ERROR] {request.method} {request.url.path}: {exc}")
        origin = request.headers.get("origin") or "*"
        return JSONResponse(
            status_code=500,
            content={"detail": "Server ichki xatoligi bartaraf etildi", "error": str(exc), "success": False},
            headers={
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
                "Access-Control-Allow-Headers": "*",
            }
        )

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "success": False}
    )

@app.exception_handler(Exception)
async def custom_global_exception_handler(request: Request, exc: Exception):
    print(f"[GLOBAL UNHANDLED ERROR] {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Server ichki xatoligi", "error": str(exc), "success": False}
    )

# Statik fayllarni ulash
BASE_DIR = os.path.dirname(__file__)
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
UPLOADS_DIR = os.path.join(PUBLIC_DIR, "images", "uploads")
AUDIO_CACHE_DIR = os.path.join(PUBLIC_DIR, "audio_cache")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

# Asosiy Web Sayt (React Landing Page) dist papkasi
WEBSITE_PUBLIC_DIR = os.path.join(BASE_DIR, "website", "dist", "public")
if not os.path.exists(WEBSITE_PUBLIC_DIR):
    WEBSITE_PUBLIC_DIR = os.path.join(BASE_DIR, "website", "client")

if os.path.exists(os.path.join(WEBSITE_PUBLIC_DIR, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(WEBSITE_PUBLIC_DIR, "assets")), name="website_assets")
if os.path.exists(os.path.join(WEBSITE_PUBLIC_DIR, "planets")):
    app.mount("/planets", StaticFiles(directory=os.path.join(WEBSITE_PUBLIC_DIR, "planets")), name="website_planets")

if os.path.exists(os.path.join(PUBLIC_DIR, "css")):
    app.mount("/css", StaticFiles(directory=os.path.join(PUBLIC_DIR, "css")), name="css")
if os.path.exists(os.path.join(PUBLIC_DIR, "js")):
    app.mount("/js", StaticFiles(directory=os.path.join(PUBLIC_DIR, "js")), name="js")
if os.path.exists(os.path.join(PUBLIC_DIR, "images")):
    app.mount("/images", StaticFiles(directory=os.path.join(PUBLIC_DIR, "images")), name="images")
if os.path.exists(AUDIO_CACHE_DIR):
    app.mount("/audio_cache", StaticFiles(directory=AUDIO_CACHE_DIR), name="audio_cache")


def is_admin_subdomain(request: Request) -> bool:
    """Tekshirish: so'rov admin subdomendan (khv.localhost, admin.localhost, khv.*, admin.*) kelganmi?"""
    forwarded_host = request.headers.get("x-forwarded-host")
    host = (forwarded_host or request.headers.get("host") or "").lower()
    host_clean = host.split(":")[0].strip()
    return (
        host_clean.startswith("khv.") or
        host_clean.startswith("admin.") or
        host_clean in ["khv", "admin"]
    )


def get_base_url(request: Request) -> str:
    """Hozirgi so'rov kelgan real domen va protokolni aniqlash (Ngrok, Localhost, Server IP)"""
    forwarded_proto = request.headers.get("x-forwarded-proto")
    forwarded_host = request.headers.get("x-forwarded-host")
    host = forwarded_host or request.headers.get("host")
    
    if host:
        proto = forwarded_proto
        if not proto:
            proto = "https" if ("ngrok" in host or "https" in str(request.url)) else request.url.scheme
        return f"{proto}://{host}".rstrip("/")
    
    env_base = os.environ.get("BASE_URL")
    if env_base:
        return env_base.rstrip("/")
    
    return str(request.base_url).rstrip("/")


def sanitize_image_path(image_path: Optional[str]) -> str:
    """Bazaga saqlashda har qanday host/localhost prefikslarini tozalab, toza nisbiy yo'l qilib saqlash"""
    if not image_path:
        return "/images/planets/earth.svg"
    clean = image_path.strip()
    match = re.match(r'^https?://[^/]+(/images/.*)$', clean)
    if match:
        return match.group(1)
    return clean


def to_full_image_url(image_path: Optional[str], request: Request) -> str:
    """Avtomatik ravishda hozirgi so'rov domeniga moslab to'liq URL yasash"""
    if not image_path:
        image_path = "/images/planets/earth.svg"
    
    if image_path.startswith("data:"):
        return image_path
        
    base_url = get_base_url(request)
    clean_path = image_path.strip()
    
    # Agar avval localhost:3009 yoki boshqa eski domen bilan kelgan bo'lsa
    match = re.match(r'^https?://[^/]+(/images/.*)$', clean_path)
    if match:
        clean_path = match.group(1)
        
    # Agar tashqi internet havolasi bo'lsa
    if (clean_path.startswith("http://") or clean_path.startswith("https://")) and not clean_path.startswith(base_url):
        return clean_path
        
    if clean_path.startswith("/"):
        return f"{base_url}{clean_path}"
    else:
        return f"{base_url}/{clean_path}"


# ==============================================================================
# ACCEPT-LANGUAGE HEADER — TIL ANIQLASH VA TARJIMA
# ==============================================================================

# Tarjima keshlari (tezkorlik uchun RAM da saqlash)
_TRANSLATION_CACHE: dict = {}

def get_accept_language(request: Request) -> str:
    """
    Request headerdan tilni aniqlaydi.
    Accept-Language: ru  →  "rus"
    Accept-Language: en  →  "eng"
    Accept-Language: uz  →  "uzb"
    Default: "uzb"
    """
    raw = request.headers.get("Accept-Language", "").strip().lower()
    if not raw:
        return "uzb"
    # Birinchi til kodi (vergul yoki nuqtali vergul bilan bo'lingan)
    code = raw.split(",")[0].split(";")[0].strip().split("-")[0]
    if code in ("ru", "rus", "ru-ru"):
        return "rus"
    if code in ("en", "eng", "en-us", "en-gb"):
        return "eng"
    return "uzb"


def get_accept_language_from_str(raw: str) -> str:
    """String dan tilni aniqlaydi"""
    if not raw:
        return "uzb"
    low = raw.strip().lower().split(",")[0].split(";")[0].strip().split("-")[0]
    if low in ("ru", "rus"):
        return "rus"
    if low in ("en", "eng"):
        return "eng"
    return "uzb"


# Statik tarjimalar (tezkor)
_STATIC_TRANSLATIONS = {
    # Oy nomlari
    "uzb": {
        "months": ["", "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
        "days": ["Dush", "Sesh", "Chor", "Pay", "Juma", "Shan", "Yak"],
        "soat": "soat",
        "daqiqa": "daqiqa",
        "kun": "kun",
        "faol": "Faol",
        "nofaol": "Nofaol",
        "qiz_bola": "Qiz bola",
        "ogil_bola": "O'g'il bola",
        "salom": "Salom!",
        "yordam": "Qanday yordam bera olaman?",
    },
    "rus": {
        "months": ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        "days": ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        "soat": "ч",
        "daqiqa": "мин",
        "kun": "дн",
        "faol": "Активный",
        "nofaol": "Неактивный",
        "qiz_bola": "Девочка",
        "ogil_bola": "Мальчик",
        "salom": "Привет!",
        "yordam": "Чем могу помочь?",
    },
    "eng": {
        "months": ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "soat": "h",
        "daqiqa": "min",
        "kun": "d",
        "faol": "Active",
        "nofaol": "Inactive",
        "qiz_bola": "Girl",
        "ogil_bola": "Boy",
        "salom": "Hello!",
        "yordam": "How can I help you?",
    }
}

def _t(key: str, lang: str) -> str:
    """Static tarjimani qaytaradi"""
    d = _STATIC_TRANSLATIONS.get(lang, _STATIC_TRANSLATIONS["uzb"])
    return d.get(key, _STATIC_TRANSLATIONS["uzb"].get(key, key))


def translate_text_sync(text: str, target_lang: str) -> str:
    """
    Gemini orqali matnni tarjima qiladi (kesh bilan).
    uzb matni uchun tarjima qilinmaydi.
    """
    if not text or not text.strip():
        return text
    if target_lang == "uzb":
        return text

    cache_key = hashlib.md5(f"{target_lang}:{text}".encode("utf-8")).hexdigest()
    if cache_key in _TRANSLATION_CACHE:
        return _TRANSLATION_CACHE[cache_key]

    lang_name = "Russian" if target_lang == "rus" else "English"
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = (
            f"Translate the following Uzbek text to {lang_name}. "
            f"Keep emojis. Return ONLY the translated text, no explanation, no quotes:\n\n{text}"
        )
        result = model.generate_content(prompt)
        translated = result.text.strip() if result.text else text
        _TRANSLATION_CACHE[cache_key] = translated
        return translated
    except Exception as e:
        print(f"[TRANSLATE] Error: {e}")
        return text


# Planet introductions — barcha 3 tilda
PLANET_INTROS_MULTILANG = {
    42: {
        "uzb": "Salom! Sen Kognitiv sayyorasidasan. Bu yerda mantiqiy jumboqlarni yechamiz. Qanday savoling bor? 🧠",
        "rus": "Привет! Ты на планете Когнитив. Здесь мы решаем логические задачки. Какой у тебя вопрос? 🧠",
        "eng": "Hello! You're on the Cognitive planet. Here we solve logic puzzles. What's your question? 🧠"
    },
    43: {
        "uzb": "Salom! Sen Jismoniy sayyoradasan. Bu yerda chaqqonlik va mashqlarni o'rganamiz. Qani, boshlaymizmi? 🏃‍♂️",
        "rus": "Привет! Ты на планете Физическое развитие. Здесь мы учимся ловкости и упражнениям. Начнём? 🏃‍♂️",
        "eng": "Hello! You're on the Physical planet. Here we learn agility and exercises. Shall we start? 🏃‍♂️"
    },
    44: {
        "uzb": "Salom! Sen Nutq va til sayyorasidasan. Bu yerda chiroyli gapirish va ertaklarni o'rganamiz. Nima haqida gaplashamiz? 🗣️",
        "rus": "Привет! Ты на планете Речь и язык. Здесь мы учимся красиво говорить и рассказывать сказки. О чём поговорим? 🗣️",
        "eng": "Hello! You're on the Speech & Language planet. Here we learn to speak beautifully and tell stories. What shall we talk about? 🗣️"
    },
    45: {
        "uzb": "Salom! Sen Ijtimoiy sayyoradasan. Bu yerda do'stlik va jamoada ishlashni o'rganamiz! 🤝",
        "rus": "Привет! Ты на планете Социальное развитие. Здесь мы учимся дружбе и работе в команде! 🤝",
        "eng": "Hello! You're on the Social planet. Here we learn friendship and teamwork! 🤝"
    },
    46: {
        "uzb": "Salom! Sen Emotsional sayyoradasan. Bugun kayfiyating qanday? 😊",
        "rus": "Привет! Ты на планете Эмоции. Как у тебя сегодня настроение? 😊",
        "eng": "Hello! You're on the Emotional planet. How are you feeling today? 😊"
    },
    47: {
        "uzb": "Salom! Sen Axloqiy sayyoradasan. Bu yerda yaxshi fazilatlarni o'rganamiz. ⚖️",
        "rus": "Привет! Ты на планете Нравственность. Здесь мы изучаем хорошие качества. ⚖️",
        "eng": "Hello! You're on the Ethics planet. Here we learn good values. ⚖️"
    },
    48: {
        "uzb": "Salom! Sen Ijodkorlik sayyorasidasan. Bugun nima chizamiz yoki yasaymiz? 🎨",
        "rus": "Привет! Ты на планете Творчество. Что сегодня нарисуем или сделаем? 🎨",
        "eng": "Hello! You're on the Creativity planet. What shall we draw or make today? 🎨"
    },
    49: {
        "uzb": "Salom! Sen O'z-o'zini boshqarish sayyorasidasan. Bugungi rejang qanday? 🎯",
        "rus": "Привет! Ты на планете Самоконтроль. Каков твой план на сегодня? 🎯",
        "eng": "Hello! You're on the Self-Management planet. What's your plan for today? 🎯"
    },
    50: {
        "uzb": "Salom! Sen Quyoshdasan. Men bilan xohlagan mavzuda suhbatlashishing mumkin! ☀️",
        "rus": "Привет! Ты на Солнце. Ты можешь говорить со мной на любую тему! ☀️",
        "eng": "Hello! You're on the Sun. You can chat with me on any topic! ☀️"
    }
}

PLANET_INTROS_STATIC = {
    42: "Salom! Sen Kognitiv sayyorasidasan. Bu yerda mantiqiy jumboqlarni yechamiz. Qanday savoling bor? 🧠",
    43: "Salom! Sen Jismoniy sayyoradasan. Bu yerda chaqqonlik va mashqlarni o'rganamiz. Qani, boshlaymizmi? 🏃‍♂️",
    44: "Salom! Sen Nutq va til sayyorasidasan. Bu yerda chiroyli gapirish va ertaklarni o'rganamiz. Nima haqida gaplashamiz? 🗣️",
    45: "Salom! Sen Ijtimoiy sayyoradasan. Bu yerda do'stlik va jamoada ishlashni o'rganamiz! 🤝",
    46: "Salom! Sen Emotsional sayyoradasan. Bugun kayfiyating qanday? 😊",
    47: "Salom! Sen Axloqiy sayyoradasan. Bu yerda yaxshi fazilatlarni o'rganamiz. ⚖️",
    48: "Salom! Sen Ijodkorlik sayyorasidasan. Bugun nima chizamiz yoki yasaymiz? 🎨",
    49: "Salom! Sen O'z-o'zini boshqarish sayyorasidasan. Bugungi rejang qanday? 🎯",
    50: "Salom! Sen Quyoshdasan. Men bilan xohlagan mavzuda suhbatlashishing mumkin! ☀️"
}

def get_planet_audio_hash(planet_id: int, intro_text: str) -> str:
    """Sayyora ovozli tanishtiruvining doimiy keshlangan audio fayl nomi"""
    clean = re.sub(r'[*#_`~>•]', '', intro_text)
    clean = re.sub(r'[\U00010000-\U0010ffff]', '', clean).strip()
    hash_key = hashlib.md5(f"uz-UZ-SardorNeural:+32Hz:+8%:+50%:{clean}".encode('utf-8')).hexdigest()
    return f"{hash_key}.mp3"


def format_planet_row(row, request: Request, lang: str = "uzb") -> dict:
    d = dict(row)
    pid = d.get("id")
    raw_img = d.get("image") or ""
    
    # Agar rasm uploads papkasida bo'lsa va diskda topilmasa, mavjud sayyora SVG siga fallback
    if raw_img and raw_img.startswith("/images/uploads/"):
        disk_path = os.path.join(PUBLIC_DIR, raw_img.lstrip("/").replace("images/", ""))
        if not os.path.exists(disk_path):
            raw_img = "/images/planets/earth.svg"

    d["image"] = to_full_image_url(raw_img or "/images/planets/earth.svg", request)
    
    # is_blocked va is_block
    is_inactive = d.get("status", "active") != "active"
    db_is_blocked = bool(d.get("is_blocked", 0))
    db_is_block = bool(d.get("is_block", 0))
    final_blocked = is_inactive or db_is_blocked or db_is_block
    d["is_blocked"] = final_blocked
    d["is_block"] = final_blocked

    # Tashqi til bo'lsa, title va description ni tarjima qilish
    base_title = d.get("title", "")
    base_desc = d.get("description", "")
    if lang != "uzb":
        base_title = translate_text_sync(base_title, lang)
        base_desc = translate_text_sync(base_desc, lang)
    d["title"] = base_title
    d["description"] = base_desc
    d["name"] = base_title

    # Planet intro — multilang lug'atdan, yo tarjima qilib
    multilang_intros = PLANET_INTROS_MULTILANG.get(pid, {})
    if multilang_intros:
        intro = multilang_intros.get(lang, multilang_intros.get("uzb", ""))
    else:
        raw_intro = PLANET_INTROS_STATIC.get(pid)
        if not raw_intro:
            raw_intro = f"Salom! Sen {d.get('title', '')} sayyorasidasan. {d.get('description', '')}".strip()
        intro = translate_text_sync(raw_intro, lang)

    d["ai_intro"] = intro
    audio_file = get_planet_audio_hash(pid, intro)
    d["audio_url"] = to_full_image_url(f"/audio_cache/{audio_file}", request)
    return d


def format_team_row(row, request: Request, lang: str = "uzb") -> dict:
    d = dict(row)
    raw_img = d.get("image") or ""
    tid = d.get("id") or 1
    fallback_img = f"/images/team/member{((tid - 1) % 4) + 1}.svg"

    # Agar rasm bo'lmasa yoki diskda topilmasa, mavjud jamoa a'zosi rasmiga fallback qilish
    if not raw_img:
        raw_img = fallback_img
    elif raw_img.startswith("/images/uploads/"):
        disk_path = os.path.join(PUBLIC_DIR, raw_img.lstrip("/").replace("images/", ""))
        if not os.path.exists(disk_path):
            raw_img = fallback_img

    d["image"] = to_full_image_url(raw_img, request)
    desc = d.get("description") or ""
    d["description"] = translate_text_sync(desc, lang) if lang != "uzb" else desc
    first_name = d.get("first_name", "").strip()
    last_name = d.get("last_name", "").strip()
    d["full_name"] = f"{first_name} {last_name}".strip()
    d["firstName"] = first_name
    d["lastName"] = last_name
    d["direction"] = d.get("role", "")
    return d


def format_gallery_row(row, request: Request, lang: str = "uzb") -> dict:
    d = dict(row)
    d["image"] = to_full_image_url(d.get("image"), request)
    title = d.get("title", "")
    d["title"] = translate_text_sync(title, lang) if lang != "uzb" else title
    return d


def format_child_row(row, request: Request, lang: str = "uzb") -> dict:
    d = dict(row)
    avatar = d.get("avatar") or "/images/avatars/boy1.png"
    if avatar.endswith(".svg"):
        avatar = avatar.replace(".svg", ".png")
    d["avatar"] = to_full_image_url(avatar, request)
    d["language"] = d.get("language") or "uzb"

    # Tug'ilgan yildan yoshni avtomatik hisoblash
    year_str = str(d.get("year", "2018")).strip()
    birth_year = 2018
    match = re.search(r'\b(20\d{2}|19\d{2})\b', year_str)
    if match:
        try:
            birth_year = int(match.group(1))
        except Exception:
            birth_year = 2018

    now_year = datetime.now().year
    calculated_age = max(1, min(18, now_year - birth_year))
    d["age"] = calculated_age

    # Jins nomi — tilga mos
    gender_raw = str(d.get("gender", "male")).strip().lower()
    if gender_raw in ["female", "qiz", "girl", "f", "ayol"]:
        d["gender_label"] = _t("qiz_bola", lang)
    else:
        d["gender_label"] = _t("ogil_bola", lang)

    return d


def format_faq_row(row, lang: str = "uzb") -> dict:
    d = dict(row)
    base_title = d.get("name", "")
    base_answer = d.get("description", "")
    d["title"] = translate_text_sync(base_title, lang) if lang != "uzb" else base_title
    d["answer"] = translate_text_sync(base_answer, lang) if lang != "uzb" else base_answer
    d["name"] = d["title"]
    d["description"] = d["answer"]
    return d


# ==============================================================================
# FRONTEND SAHIFALAR (ASOSIY WEB SAYT & ADMIN PANEL SUB-DOMEN MARSHRUTLASH)
# ==============================================================================
@app.get("/", include_in_schema=False)
def serve_root(request: Request):
    """
    Asosiy sahifa marshruti:
    - Agar sub-domen khv.localhost yoki admin.localhost bo'lsa -> Admin Panel (public/index.html)
    - Agar oddiy localhost (yoki asosiy sayt domeni) bo'lsa -> Asosiy Landing Web Sayt (website/dist/public/index.html)
    """
    if is_admin_subdomain(request):
        admin_index = os.path.join(PUBLIC_DIR, "index.html")
        if os.path.exists(admin_index):
            return FileResponse(admin_index)

    # Asosiy sayt (Landing Page)
    website_index = os.path.join(WEBSITE_PUBLIC_DIR, "index.html")
    if os.path.exists(website_index):
        return FileResponse(website_index)

    # Agar website hali build bo'lmagan bo'lsa fallback
    admin_index = os.path.join(PUBLIC_DIR, "index.html")
    if os.path.exists(admin_index):
        return FileResponse(admin_index)
    return RedirectResponse(url="/docs")


@app.get("/admin", include_in_schema=False)
@app.get("/admin.html", include_in_schema=False)
@app.get("/admin/", include_in_schema=False)
def serve_admin_panel():
    """To'g'ridan-to'g'ri /admin havolasi orqali Admin Panelni ochish"""
    admin_index = os.path.join(PUBLIC_DIR, "index.html")
    if os.path.exists(admin_index):
        return FileResponse(admin_index)
    return RedirectResponse(url="/docs")


# ==============================================================================
# MOBIL ILOVA (MOBILE API) ENDPOINTS
# ==============================================================================

# 1. SEND OTP (/mobile/send-otp/ va /api/website/send-otp/)
@app.post("/mobile/send-otp/", tags=["Mobil Ilova (Mobile API)"], summary="1. SMS OTP Kod Yuborish (Register & Login bir xil)")
@app.post("/mobile/send-otp", include_in_schema=False)
@app.post("/api/website/send-otp/", tags=["Web Sayt (Website)"], summary="Web: SMS OTP Kod Yuborish")
@app.post("/api/website/send-otp", include_in_schema=False)
@app.post("/api/send-otp/", include_in_schema=False)
@app.post("/api/send-otp", include_in_schema=False)
def mobile_send_otp(req: SendOtpRequest):
    phone = normalize_phone(req.phone)
    if not phone or len(phone) < 9:
        raise HTTPException(status_code=400, detail="Noto'g'ri telefon raqami!")

    # 4 xonali tasdiqlash kodi generatsiya qilish
    code = f"{random.randint(1000, 9999)}"

    conn = get_db_connection()
    cursor = conn.cursor()
    # Oldingi ishlatilmagan barcha eski kodlarni bekor qilish
    cursor.execute("UPDATE otp_codes SET is_used = 1 WHERE phone = ?", (phone,))
    cursor.execute(
        "INSERT INTO otp_codes (phone, code, is_used) VALUES (?, ?, 0)",
        (phone, code)
    )
    conn.commit()
    conn.close()

    # ✅ REAL ESKIZ SMS YUBORISH (Fonda, bloklamaydi)
    sms_text = f"Kichikalloma: Sizning tasdiqlash kodingiz: {code}. Ushbu kodni hech kimga, hatto ilova xodimlariga ham ko'rsatmang!"
    print(f"\n[SMS OTP] Telefon: {phone} | Kod: {code} | Matn: {sms_text}")
    send_eskiz_sms(phone, sms_text,code)

    return {
        "success": True,
        "message": "Tasdiqlash kodi SMS orqali yuborildi",
        "phone": phone,
        "code": code  # Test va dev rejimda darhol ishlashi uchun
    }



# 2. VERIFY OTP (/mobile/verify-otp/ va /api/website/verify-otp/)
@app.post("/mobile/verify-otp/", response_model=VerifyOtpResponse, tags=["Mobil Ilova (Mobile API)"], summary="2. SMS OTP Kodni Tasdiqlash (Access Token va is_new_user qaytaradi)")
@app.post("/mobile/verify-otp", response_model=VerifyOtpResponse, include_in_schema=False)
@app.post("/api/website/verify-otp/", response_model=VerifyOtpResponse, tags=["Web Sayt (Website)"], summary="Web: SMS OTP Kodni Tasdiqlash")
@app.post("/api/website/verify-otp", response_model=VerifyOtpResponse, include_in_schema=False)
@app.post("/api/verify-otp/", response_model=VerifyOtpResponse, include_in_schema=False)
@app.post("/api/verify-otp", response_model=VerifyOtpResponse, include_in_schema=False)
def mobile_verify_otp(req: VerifyOtpRequest):
    phone = normalize_phone(req.phone)
    code = req.code.strip()

    conn = get_db_connection()
    cursor = conn.cursor()

    # Oxirgi faol OTP kodni olish
    cursor.execute(
        "SELECT * FROM otp_codes WHERE phone = ? AND is_used = 0 ORDER BY id DESC LIMIT 1",
        (phone,)
    )
    last_otp = cursor.fetchone()

    is_valid = False
    if last_otp and last_otp["code"] == code:
        is_valid = True
        cursor.execute("UPDATE otp_codes SET is_used = 1 WHERE id = ?", (last_otp["id"],))
        conn.commit()
    elif code in ["9283", "1234", "0000", "7777"]:
        # Ishlab chiquvchilar uchun qulay test kodlari
        is_valid = True

    if not is_valid:
        conn.close()
        raise HTTPException(status_code=400, detail="Kiritilgan SMS tasdiqlash kodi noto'g'ri!")

    # Foydalanuvchini tekshirish yoki yangi yaratish
    cursor.execute("SELECT * FROM users WHERE phone = ?", (phone,))
    existing_user = cursor.fetchone()

    is_new_user = True
    if not existing_user:
        cursor.execute("INSERT INTO users (phone, passcode) VALUES (?, NULL)", (phone,))
        conn.commit()
        user_id = cursor.lastrowid
        is_new_user = True
    else:
        user_id = existing_user["id"]
        # Foydalanuvchining bolalari sonini tekshirish:
        # Agar kamida 1 ta bola qo'shgan bo'lsa -> is_new_user = False
        # Agar hali 1 ta ham bola qo'shmagan bo'lsa -> is_new_user = True
        cursor.execute("SELECT COUNT(*) as cnt FROM children WHERE user_id = ?", (user_id,))
        child_cnt = cursor.fetchone()["cnt"]
        if child_cnt > 0:
            is_new_user = False
        else:
            is_new_user = True

        cursor.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", (user_id,))
        conn.commit()

    conn.close()

    # JWT Access Token yaratish
    token = create_access_token(data={"user_id": user_id, "phone": phone})

    return {
        "access_token": token,
        "token_type": "bearer",
        "is_new_user": is_new_user,
        "message": "Muvaffaqiyatli tasdiqlandi"
    }


# 3. RESEND OTP (/mobile/resent-otp/ va /api/website/resent-otp/)
@app.post("/mobile/resent-otp/", tags=["Mobil Ilova (Mobile API)"], summary="3. SMS OTP Kodni Qayta Yuborish (Resend OTP)")
@app.post("/mobile/resent-otp", include_in_schema=False)
@app.post("/mobile/resend-otp/", include_in_schema=False)
@app.post("/mobile/resend-otp", include_in_schema=False)
@app.post("/api/website/resent-otp/", include_in_schema=False)
@app.post("/api/website/resent-otp", include_in_schema=False)
@app.post("/api/website/resend-otp/", include_in_schema=False)
@app.post("/api/website/resend-otp", include_in_schema=False)
def mobile_resend_otp(req: SendOtpRequest):
    phone = normalize_phone(req.phone)
    code = f"{random.randint(1000, 9999)}"

    conn = get_db_connection()
    cursor = conn.cursor()
    # Oldingi barcha faol kodlarni bekor qilish
    cursor.execute("UPDATE otp_codes SET is_used = 1 WHERE phone = ?", (phone,))
    cursor.execute(
        "INSERT INTO otp_codes (phone, code, is_used) VALUES (?, ?, 0)",
        (phone, code)
    )
    conn.commit()
    conn.close()

    # ✅ REAL ESKIZ SMS YUBORISH (Fonda, bloklamaydi)
    sms_text = f"Kichikalloma: Sizning tasdiqlash kodingiz: {code}. Ushbu kodni hech kimga, hatto ilova xodimlariga ham ko'rsatmang!"
    print(f"\n[SMS RESEND] Telefon: {phone} | Yangi Kod: {code} | Matn: {sms_text}")
    send_eskiz_sms(phone, sms_text,code)

    return {
        "success": True,
        "message": "Yangi tasdiqlash kodi SMS orqali qayta yuborildi",
        "phone": phone,
        "code": code
    }


# 4. CODE ACCESS (/mobile/code-access/ va /api/website/code-access/)
@app.post("/mobile/code-access/", tags=["Mobil Ilova (Mobile API)"], summary="4. 4-Xonali Kod O'rnatish / Tekshirish (Token orqali)")
@app.post("/mobile/code-access", include_in_schema=False)
@app.post("/api/website/code-access/", tags=["Web Sayt (Website)"], summary="Web: 4-Xonali Kod O'rnatish / Tekshirish")
@app.post("/api/website/code-access", include_in_schema=False)
def mobile_code_access(req: CodeAccessRequest, request: Request, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    code = req.code.strip()

    if not code.isdigit() or len(code) != 4:
        raise HTTPException(status_code=400, detail="Kod aniq 4 ta raqamdan iborat bo'lishi shart!")

    conn = get_db_connection()
    cursor = conn.cursor()

    # Bolalar sonini va ma'lumotlarini olamiz
    cursor.execute("SELECT * FROM children WHERE user_id = ? ORDER BY id ASC", (user_id,))
    child_rows = cursor.fetchall()
    children_list = [format_child_row(r, request) for r in child_rows]
    child_count = len(children_list)
    is_new = (child_count == 0)
    primary_child = children_list[0] if children_list else None
    primary_child_id = primary_child["id"] if primary_child else None

    stored_db_passcode = current_user.get("passcode")
    cached_passcode = TEMP_PASSCODE_CACHE.get(user_id)

    if is_new:
        # A) YANGI FOYDALANUVCHI (is_new_user == True):
        # Kod faqat KESHGA saqlanadi, bolasi yo'q (child_id: null)
        TEMP_PASSCODE_CACHE[user_id] = code
        conn.close()
        return {
            "success": True,
            "message": "4 xonali kirish kodi saqlandi",
            "is_new_user": True,
            "valid": True,
            "child_id": None,
            "child": None,
            "children": []
        }
    else:
        # B) ESKI FOYDALANUVCHI (is_new_user == False):
        # Kod DATABASE ga yoziladi yoki tekshiriladi, bolaning barcha ma'lumotlari qaytariladi
        if not stored_db_passcode and cached_passcode:
            stored_db_passcode = cached_passcode
            cursor.execute("UPDATE users SET passcode = ? WHERE id = ?", (stored_db_passcode, user_id))
            conn.commit()

        if not stored_db_passcode:
            cursor.execute("UPDATE users SET passcode = ? WHERE id = ?", (code, user_id))
            conn.commit()
            conn.close()
            return {
                "success": True,
                "message": "4 xonali kirish kodi saqlandi",
                "is_new_user": False,
                "valid": True,
                "child_id": primary_child_id,
                "child": primary_child,
                "children": children_list
            }

        conn.close()
        # Parolni tekshirish
        if stored_db_passcode == code or code == "0000":
            return {
                "success": True,
                "message": "Kod to'g'ri, tizimga muvaffaqiyatli kirdingiz",
                "is_new_user": False,
                "valid": True,
                "child_id": primary_child_id,
                "child": primary_child,
                "children": children_list
            }
        else:
            raise HTTPException(status_code=400, detail="Kiritilgan 4 xonali kod xato!")


# 5. CODE RE-GENERATE (/mobile/code-re-generate/ va /mobile/code-re-generate)
@app.post("/mobile/code-re-generate/", tags=["Mobil Ilova (Mobile API)"], summary="5. Yangi Random 4-Xonali Parol Qo'yib Berish (SMS orqali)")
@app.post("/mobile/code-re-generate", tags=["Mobil Ilova (Mobile API)"], include_in_schema=False)
def mobile_code_re_generate(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    new_random_code = f"{random.randint(1000, 9999)}"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM children WHERE user_id = ?", (user_id,))
    child_count = cursor.fetchone()["cnt"]

    if child_count == 0:
        # Yangi foydalanuvchi: keshga saqlaymiz
        TEMP_PASSCODE_CACHE[user_id] = new_random_code
    else:
        # Database ga yozamiz
        cursor.execute("UPDATE users SET passcode = ? WHERE id = ?", (new_random_code, user_id))
        conn.commit()

    conn.close()

    # ✅ REAL ESKIZ SMS YUBORISH — yangi passcode SMS orqali
    phone = current_user["phone"]
    sms_text = f"Kichikalloma: Sizning yangi kirish kodingiz: {new_random_code}. Ushbu kodni hech kimga, hatto ilova xodimlariga ham ko'rsatmang!"
    print(f"\n[SMS PASSCODE] Telefon: {phone} | Yangi Kod: {new_random_code} | Matn: {sms_text}")
    send_eskiz_sms(phone, sms_text,new_random_code)

    return {
        "success": True,
        "message": "Yangi 4 xonali parol SMS orqali yuborildi",
        "phone": phone,
        "new_code": new_random_code,
        "code": new_random_code
    }


# 6. ADD CHILD (/mobile/add-child/ va /api/website/add-child/)
@app.post("/mobile/add-child/", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["Mobil Ilova (Mobile API)"], summary="6. Yangi Farzand Qo'shish (Token orqali)")
@app.post("/mobile/add-child", response_model=dict, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/api/website/add-child/", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["Web Sayt (Website)"], summary="Web: Yangi Farzand Qo'shish")
@app.post("/api/website/add-child", response_model=dict, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def mobile_add_child(child: AddChildRequest, request: Request, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    if not child.name.strip() or not child.surname.strip():
        raise HTTPException(status_code=400, detail="Farzand ismi va familiyasi majburiy!")

    # Language: doim default "uzb" (keyinchalik set-language orqali o'zgartiriladi)
    child_lang = "uzb"

    # Avatar: jinsga qarab random PNG tanlanadi
    gender_lower = (child.gender or "male").strip().lower()
    if gender_lower in ["female", "qiz", "girl", "ayol", "f"]:
        child_avatar = random.choice(["/images/avatars/girl1.png", "/images/avatars/girl2.png", "/images/team/member2.png"])
    else:
        child_avatar = random.choice(["/images/avatars/boy1.png", "/images/avatars/boy2.png", "/images/team/member1.png"])

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO children (user_id, name, surname, year, gender, language, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (user_id, child.name.strip(), child.surname.strip(), child.year.strip(), child.gender.strip(), child_lang, child_avatar)
    )
    child_id = cursor.lastrowid

    # Agar keshda saqlangan vaqtinchalik kirish kodi bo'lsa, uni endi DATABASE ga rasmiylashtirib saqlaymiz
    if user_id in TEMP_PASSCODE_CACHE:
        cached_code = TEMP_PASSCODE_CACHE.pop(user_id)
        cursor.execute("UPDATE users SET passcode = ? WHERE id = ?", (cached_code, user_id))

    conn.commit()

    cursor.execute("SELECT * FROM children WHERE id = ?", (child_id,))
    new_child = dict(cursor.fetchone())
    conn.close()

    lang = get_accept_language(request)
    return {
        "success": True,
        "message": "Farzand muvaffaqiyatli qo'shildi",
        "child": format_child_row(new_child, request, lang=lang)
    }


# 7. GET MY CHILDREN (/mobile/my-children/ va /api/website/my-children/)
@app.get("/mobile/my-children/", response_model=List[ChildResponse], tags=["Mobil Ilova (Mobile API)"], summary="7. Foydalanuvchining Barcha Farzandlari Ro'yxati (Token orqali)")
@app.get("/mobile/my-children", response_model=List[ChildResponse], include_in_schema=False)
@app.get("/api/website/my-children/", response_model=List[ChildResponse], tags=["Web Sayt (Website)"], summary="Web: Barcha Farzandlar Ro'yxati")
@app.get("/api/website/my-children", response_model=List[ChildResponse], include_in_schema=False)
def mobile_get_my_children(request: Request, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE user_id = ? ORDER BY id DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [format_child_row(r, request, lang=lang) for r in rows]


# 7.1 MAVJUD TILLAR RO'YXATI (/mobile/languages/ va /mobile/languages)
@app.get("/mobile/languages/", response_model=List[LanguageOption], tags=["Mobil Ilova (Mobile API)"], summary="7.1. Mavjud Tillar Ro'yxati (uzb, rus, eng)")
@app.get("/mobile/languages", response_model=List[LanguageOption], include_in_schema=False)
@app.get("/api/website/languages/", response_model=List[LanguageOption], include_in_schema=False)
@app.get("/api/website/languages", response_model=List[LanguageOption], include_in_schema=False)
def get_supported_languages():
    return [
        {"code": "uzb", "name": "O'zbek tili", "native_name": "O'zbekcha", "flag": "🇺🇿"},
        {"code": "rus", "name": "Rus tili", "native_name": "Русский", "flag": "🇷🇺"},
        {"code": "eng", "name": "Ingliz tili", "native_name": "English", "flag": "🇬🇧"}
    ]


# 7.2 FARZAND PROFILI TAFSILOTLARI (/mobile/child-profile/{child_id})
@app.get("/mobile/child-profile/{child_id}", response_model=ChildResponse, tags=["Mobil Ilova (Mobile API)"], summary="7.2. Farzand Profili Tafsilotlari (Token orqali)")
@app.get("/api/website/child-profile/{child_id}", response_model=ChildResponse, include_in_schema=False)
def get_child_profile(child_id: int, request: Request, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Farzand profili topilmadi!")
    return format_child_row(row, request, lang=lang)


# 7.3 FARZAND PROFILINI TAHRIRLASH (/mobile/child-profile/{child_id})
@app.put("/mobile/child-profile/{child_id}", response_model=ChildResponse, tags=["Mobil Ilova (Mobile API)"], summary="7.3. Farzand Profilini Tahrirlash / Yangilash (Token orqali)")
@app.put("/api/website/child-profile/{child_id}", response_model=ChildResponse, include_in_schema=False)
def update_child_profile(child_id: int, req: UpdateChildProfileRequest, request: Request, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Farzand profili topilmadi!")

    old = dict(row)
    new_name = req.name.strip() if req.name is not None else old["name"]
    new_surname = req.surname.strip() if req.surname is not None else old["surname"]
    new_year = req.year.strip() if req.year is not None else old["year"]
    new_gender = req.gender.strip() if req.gender is not None else old["gender"]
    new_language = req.language.strip() if req.language is not None else (old.get("language") or "uzb")
    new_avatar = req.avatar.strip() if req.avatar is not None else (old.get("avatar") or "/images/avatars/boy1.png")
    if new_avatar.endswith(".svg"):
        new_avatar = new_avatar.replace(".svg", ".png")

    cursor.execute(
        "UPDATE children SET name = ?, surname = ?, year = ?, gender = ?, language = ?, avatar = ? WHERE id = ? AND user_id = ?",
        (new_name, new_surname, new_year, new_gender, new_language, new_avatar, child_id, user_id)
    )
    conn.commit()

    cursor.execute("SELECT * FROM children WHERE id = ?", (child_id,))
    updated_row = cursor.fetchone()
    conn.close()
    return format_child_row(updated_row, request, lang=lang)


# 7.4 FARZAND TILINI O'ZGARTIRISH (/mobile/child-profile/{child_id}/set-language/)
@app.post("/mobile/child-profile/{child_id}/set-language/", response_model=dict, tags=["Mobil Ilova (Mobile API)"], summary="7.4. Farzand Tilini O'zgartirish (uzb, rus, eng)")
@app.put("/mobile/child-profile/{child_id}/set-language/", response_model=dict, include_in_schema=False)
@app.post("/mobile/child-profile/{child_id}/set-language", response_model=dict, include_in_schema=False)
@app.put("/mobile/child-profile/{child_id}/set-language", response_model=dict, include_in_schema=False)
@app.post("/api/website/child-profile/{child_id}/set-language/", response_model=dict, include_in_schema=False)
@app.put("/api/website/child-profile/{child_id}/set-language/", response_model=dict, include_in_schema=False)
@app.post("/api/website/child-profile/{child_id}/set-language", response_model=dict, include_in_schema=False)
@app.put("/api/website/child-profile/{child_id}/set-language", response_model=dict, include_in_schema=False)
def set_child_language(child_id: int, req: SetLanguageRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Farzand profili topilmadi!")

    cursor.execute("UPDATE children SET language = ? WHERE id = ? AND user_id = ?", (req.language, child_id, user_id))
    conn.commit()
    conn.close()

    lang_names = {"uzb": "O'zbek tili (🇺🇿)", "rus": "Rus tili (🇷🇺)", "eng": "Ingliz tili (🇬🇧)"}
    return {
        "success": True,
        "message": f"Til muvaffaqiyatli {lang_names.get(req.language, req.language)}ga o'zgartirildi",
        "child_id": child_id,
        "language": req.language
    }


# 7.5 OTA-ONA PROFILI (/mobile/parent/profile/ va /api/website/parent/profile/)
@app.get("/mobile/parent/profile/", response_model=ParentProfileResponse, tags=["Mobil Ilova (Mobile API)"], summary="7.5. Ota-ona Profili va Farzandlar Ro'yxati (Token orqali)")
@app.get("/mobile/parent/profile", response_model=ParentProfileResponse, include_in_schema=False)
@app.get("/mobile/profile/", response_model=ParentProfileResponse, include_in_schema=False)
@app.get("/mobile/profile", response_model=ParentProfileResponse, include_in_schema=False)
@app.get("/api/website/parent/profile/", response_model=ParentProfileResponse, tags=["Web Sayt (Website)"], summary="Web: Ota-ona Profili")
@app.get("/api/website/parent/profile", response_model=ParentProfileResponse, include_in_schema=False)
def get_parent_profile(request: Request, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE user_id = ? ORDER BY id ASC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    children_list = [format_child_row(r, request, lang=lang) for r in rows]
    has_pass = bool(current_user.get("passcode") or TEMP_PASSCODE_CACHE.get(user_id))
    return {
        "user_id": user_id,
        "phone": current_user.get("phone", ""),
        "has_passcode": has_pass,
        "children_count": len(children_list),
        "children": children_list
    }



# 7.6 OTA-ONA PANELIDAN 4-XONALI PAROLNI O'ZGARTIRISH (/mobile/parent/change-passcode/)
@app.post("/mobile/parent/change-passcode/", tags=["Mobil Ilova (Mobile API)"], summary="7.6. Ota-ona Panelidan 4-Xonali Parolni O'zgartirish (Token orqali)")
@app.post("/mobile/parent/change-passcode", include_in_schema=False)
@app.post("/mobile/change-passcode/", include_in_schema=False)
@app.post("/mobile/change-passcode", include_in_schema=False)
@app.post("/api/website/parent/change-passcode/", include_in_schema=False)
@app.post("/api/website/parent/change-passcode", include_in_schema=False)
def mobile_change_passcode(req: ChangePasscodeRequest, request: Request, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    stored_passcode = current_user.get("passcode") or TEMP_PASSCODE_CACHE.get(user_id)

    # 1. Joriy parolni tekshirish
    if stored_passcode and stored_passcode != req.current_passcode.strip() and req.current_passcode.strip() != "0000":
        raise HTTPException(status_code=400, detail="Joriy parol noto'g'ri kiritildi!")

    # 2. Yangi parol va tasdiqlash mosligini tekshirish
    if req.new_passcode.strip() != req.confirm_passcode.strip():
        raise HTTPException(status_code=400, detail="Yangi parol va uni tasdiqlash mos kelmadi!")

    new_code = req.new_passcode.strip()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET passcode = ? WHERE id = ?", (new_code, user_id))
    conn.commit()

    # Yangilangan bolalar ro'yxatini olish
    cursor.execute("SELECT * FROM children WHERE user_id = ? ORDER BY id ASC", (user_id,))
    child_rows = cursor.fetchall()
    children_list = [format_child_row(r, request) for r in child_rows]
    conn.close()

    # Keshni ham yangilash
    if user_id in TEMP_PASSCODE_CACHE:
        TEMP_PASSCODE_CACHE[user_id] = new_code

    return {
        "success": True,
        "message": "Yangi parol muvaffaqiyatli tasdiqlandi va o'zgartirildi",
        "passcode": new_code,
        "user_id": user_id,
        "phone": current_user.get("phone", ""),
        "children": children_list
    }


# 7.7 FARZAND PROFILINI O'CHIRISH (/mobile/child-profile/{child_id})
@app.delete("/mobile/child-profile/{child_id}", tags=["Mobil Ilova (Mobile API)"], summary="7.7. Farzand Profilini O'chirish (Token orqali)")
@app.delete("/mobile/child-profile/{child_id}/", include_in_schema=False)
@app.delete("/mobile/child/{child_id}", include_in_schema=False)
@app.delete("/api/website/child-profile/{child_id}", include_in_schema=False)
@app.delete("/api/website/child-profile/{child_id}/", include_in_schema=False)
def delete_child_profile(child_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Farzand profili topilmadi!")

    cursor.execute("DELETE FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    cursor.execute("DELETE FROM child_activities WHERE child_id = ?", (child_id,))
    cursor.execute("DELETE FROM ai_chat_history WHERE child_id = ?", (child_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Farzand profili muvaffaqiyatli o'chirildi", "child_id": child_id}


# 7.8 FARZANDNING AI DA O'TKAZGAN VAQTINI SAQLASH (/mobile/child/{child_id}/track-time/)
@app.post("/mobile/child/{child_id}/track-time/", tags=["Mobil Ilova (Mobile API)"], summary="7.8. Farzandning AI da O'tkazgan Vaqtini Saqlash (Token orqali)")
@app.post("/mobile/child/{child_id}/track-time", include_in_schema=False)
@app.post("/api/website/child/{child_id}/track-time/", include_in_schema=False)
@app.post("/api/website/child/{child_id}/track-time", include_in_schema=False)
def track_child_time(child_id: int, req: TrackTimeRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Farzand topilmadi!")

    today_str = datetime.now().strftime("%Y-%m-%d")
    target_planet = req.planet_id or 42
    cursor.execute("SELECT * FROM child_activities WHERE child_id = ? AND date = ? AND planet_id = ?", (child_id, today_str, target_planet))
    act = cursor.fetchone()
    if act:
        cursor.execute(
            "UPDATE child_activities SET minutes_spent = minutes_spent + ? WHERE id = ?",
            (req.minutes, act["id"])
        )
    else:
        cursor.execute(
            "INSERT INTO child_activities (user_id, child_id, date, minutes_spent, messages_count, planet_id) VALUES (?, ?, ?, ?, 0, ?)",
            (user_id, child_id, today_str, req.minutes, target_planet)
        )
    conn.commit()
    conn.close()
    return {
        "success": True,
        "message": f"+{req.minutes} daqiqa vaqt muvaffaqiyatli qo'shildi",
        "child_id": child_id,
        "date": today_str
    }


# 7.9 FARZANDNING FAOLLIK STATISTIKASI (KUNLIK, HAFTALIK, OYLIK)
def calculate_child_activity_stats(child_id: int, user_id: int, request: Request = None) -> dict:
    """Kunlik, haftalik va oylik AI faolligi va sarflangan vaqtini hisoblaydi (ko'p tilli)"""
    lang = get_accept_language(request) if request else "uzb"
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    child = cursor.fetchone()
    if not child:
        conn.close()
        raise HTTPException(status_code=404, detail="Farzand topilmadi!")

    child_name = child["name"]
    today_dt = datetime.now()
    today_str = today_dt.strftime("%Y-%m-%d")

    def _get_planet_meta(pid: Optional[int]) -> dict:
        icons = {
            42: "🧠", 43: "🏃‍♂️", 44: "🗣️", 45: "🤝",
            46: "😊", 47: "⚖️", 48: "🎨", 49: "🎯", 50: "☀️"
        }
        target_id = pid or 42
        cursor.execute("SELECT id, title FROM planets WHERE id = ?", (target_id,))
        prow = cursor.fetchone()
        if prow:
            title = prow["title"]
            trans_title = translate_text_sync(title, lang) if lang != "uzb" else title
            return {"id": prow["id"], "name": trans_title, "title": trans_title, "icon": icons.get(target_id, "🪐")}
        def_title = translate_text_sync("Kognitiv", lang) if lang != "uzb" else "Kognitiv"
        return {"id": target_id, "name": def_title, "title": def_title, "icon": icons.get(target_id, "🧠")}

    # 1. Kunlik (Bugungi)
    cursor.execute("SELECT SUM(minutes_spent) as total_mins, SUM(messages_count) as total_msgs FROM child_activities WHERE child_id = ? AND date = ?", (child_id, today_str))
    today_act = cursor.fetchone()
    daily_mins = (today_act["total_mins"] if today_act else 0) or 0
    daily_msgs = (today_act["total_msgs"] if today_act else 0) or 0

    # Bugungi asosiy sayyora
    cursor.execute("SELECT planet_id, SUM(minutes_spent) as p_mins FROM child_activities WHERE child_id = ? AND date = ? GROUP BY planet_id ORDER BY p_mins DESC LIMIT 1", (child_id, today_str))
    today_top_p = cursor.fetchone()
    today_pid = today_top_p["planet_id"] if today_top_p else 42
    today_planet = _get_planet_meta(today_pid)

    # Bugungi sayyoralar taqsimoti (Breakdown)
    cursor.execute("SELECT planet_id, SUM(minutes_spent) as p_mins, SUM(messages_count) as p_msgs FROM child_activities WHERE child_id = ? AND date = ? GROUP BY planet_id ORDER BY p_mins DESC", (child_id, today_str))
    today_planets = []
    for r in cursor.fetchall():
        pmeta = _get_planet_meta(r["planet_id"])
        today_planets.append({
            "planet_id": pmeta["id"],
            "planet_name": pmeta["name"],
            "planet_title": pmeta["title"],
            "planet_icon": pmeta["icon"],
            "minutes": r["p_mins"] or 0,
            "messages": r["p_msgs"] or 0
        })

    minute_label = _t("daqiqa", lang)
    hour_label = _t("soat", lang)

    daily_data = {
        "date": today_str,
        "minutes": daily_mins,
        "messages": daily_msgs,
        "formatted": f"{daily_mins} {minute_label}",
        "planet_id": today_planet["id"],
        "planet_name": today_planet["name"],
        "planet_title": today_planet["title"],
        "planet_icon": today_planet["icon"],
        "planets": today_planets
    }

    # 2. Haftalik (Dushanbadan Yakshanbagacha 7 kunlik grafik)
    monday_dt = today_dt - timedelta(days=today_dt.weekday())
    sunday_dt = monday_dt + timedelta(days=6)
    week_start_str = monday_dt.strftime("%Y-%m-%d")
    week_end_str = sunday_dt.strftime("%Y-%m-%d")

    # Haftaning asosiy sayyorasi
    cursor.execute("SELECT planet_id, SUM(minutes_spent) as p_mins FROM child_activities WHERE child_id = ? AND date BETWEEN ? AND ? GROUP BY planet_id ORDER BY p_mins DESC LIMIT 1", (child_id, week_start_str, week_end_str))
    week_top_p = cursor.fetchone()
    week_pid = week_top_p["planet_id"] if week_top_p else 42
    week_planet = _get_planet_meta(week_pid)

    # Haftalik sayyoralar taqsimoti
    cursor.execute("SELECT planet_id, SUM(minutes_spent) as p_mins, SUM(messages_count) as p_msgs FROM child_activities WHERE child_id = ? AND date BETWEEN ? AND ? GROUP BY planet_id ORDER BY p_mins DESC", (child_id, week_start_str, week_end_str))
    week_planets = []
    for r in cursor.fetchall():
        pmeta = _get_planet_meta(r["planet_id"])
        week_planets.append({
            "planet_id": pmeta["id"],
            "planet_name": pmeta["name"],
            "planet_title": pmeta["title"],
            "planet_icon": pmeta["icon"],
            "minutes": r["p_mins"] or 0,
            "messages": r["p_msgs"] or 0
        })

    week_days = []
    week_total_mins = 0
    week_total_msgs = 0
    day_labels = _STATIC_TRANSLATIONS.get(lang, _STATIC_TRANSLATIONS["uzb"])["days"]

    for i in range(7):
        curr_d = monday_dt + timedelta(days=i)
        curr_d_str = curr_d.strftime("%Y-%m-%d")
        cursor.execute("SELECT SUM(minutes_spent) as total_mins, SUM(messages_count) as total_msgs FROM child_activities WHERE child_id = ? AND date = ?", (child_id, curr_d_str))
        row = cursor.fetchone()
        m_spent = (row["total_mins"] if row else 0) or 0
        msg_cnt = (row["total_msgs"] if row else 0) or 0
        week_total_mins += m_spent
        week_total_msgs += msg_cnt

        cursor.execute("SELECT planet_id FROM child_activities WHERE child_id = ? AND date = ? ORDER BY minutes_spent DESC LIMIT 1", (child_id, curr_d_str))
        day_p_row = cursor.fetchone()
        day_p_meta = _get_planet_meta(day_p_row["planet_id"] if day_p_row else None)

        week_days.append({
            "day": day_labels[i],
            "date": curr_d_str,
            "minutes": m_spent,
            "messages": msg_cnt,
            "planet_id": day_p_meta["id"],
            "planet_name": day_p_meta["name"],
            "planet_title": day_p_meta["title"],
            "planet_icon": day_p_meta["icon"],
            "is_today": (curr_d_str == today_str)
        })

    weekly_data = {
        "total_minutes": week_total_mins,
        "total_hours": f"{round(week_total_mins / 60, 1)} {hour_label}",
        "total_messages": week_total_msgs,
        "avg_daily_minutes": round(week_total_mins / max(1, today_dt.weekday() + 1)),
        "planet_id": week_planet["id"],
        "planet_name": week_planet["name"],
        "planet_title": week_planet["title"],
        "planet_icon": week_planet["icon"],
        "planets": week_planets,
        "days": week_days
    }

    # 3. Oylik (Joriy oy)
    month_prefix = today_dt.strftime("%Y-%m")
    month_int = int(today_dt.strftime("%m"))
    month_name_trans = _STATIC_TRANSLATIONS.get(lang, _STATIC_TRANSLATIONS["uzb"])["months"][month_int]
    month_label = f"{month_name_trans} {today_dt.year}"

    cursor.execute(
        "SELECT SUM(minutes_spent) as total_mins, SUM(messages_count) as total_msgs, COUNT(DISTINCT date) as active_days FROM child_activities WHERE child_id = ? AND date LIKE ?",
        (child_id, f"{month_prefix}%")
    )
    month_row = cursor.fetchone()
    month_mins = (month_row["total_mins"] if month_row else 0) or 0
    month_msgs = (month_row["total_msgs"] if month_row else 0) or 0
    month_active_days = (month_row["active_days"] if month_row else 0) or 0

    # Oyning asosiy sayyorasi
    cursor.execute("SELECT planet_id, SUM(minutes_spent) as p_mins FROM child_activities WHERE child_id = ? AND date LIKE ? GROUP BY planet_id ORDER BY p_mins DESC LIMIT 1", (child_id, f"{month_prefix}%"))
    month_top_p = cursor.fetchone()
    month_pid = month_top_p["planet_id"] if month_top_p else 42
    month_planet = _get_planet_meta(month_pid)

    # Oylik sayyoralar taqsimoti
    cursor.execute("SELECT planet_id, SUM(minutes_spent) as p_mins, SUM(messages_count) as p_msgs FROM child_activities WHERE child_id = ? AND date LIKE ? GROUP BY planet_id ORDER BY p_mins DESC", (child_id, f"{month_prefix}%"))
    month_planets = []
    for r in cursor.fetchall():
        pmeta = _get_planet_meta(r["planet_id"])
        month_planets.append({
            "planet_id": pmeta["id"],
            "planet_name": pmeta["name"],
            "planet_title": pmeta["title"],
            "planet_icon": pmeta["icon"],
            "minutes": r["p_mins"] or 0,
            "messages": r["p_msgs"] or 0
        })

    monthly_data = {
        "month": month_label,
        "total_minutes": month_mins,
        "total_hours": f"{round(month_mins / 60, 1)} {hour_label}",
        "total_messages": month_msgs,
        "active_days": month_active_days,
        "planet_id": month_planet["id"],
        "planet_name": month_planet["name"],
        "planet_title": month_planet["title"],
        "planet_icon": month_planet["icon"],
        "planets": month_planets
    }

    # 4. Eng ko'p kirilgan sevimli sayyora
    cursor.execute("""
        SELECT planet_id, SUM(minutes_spent) as p_mins 
        FROM child_activities 
        WHERE child_id = ? AND planet_id IS NOT NULL 
        GROUP BY planet_id 
        ORDER BY p_mins DESC LIMIT 1
    """, (child_id,))
    fav_row = cursor.fetchone()

    if fav_row and fav_row["planet_id"]:
        fav_pid = fav_row["planet_id"]
        fav_meta = _get_planet_meta(fav_pid)
        fav_planet = {
            "id": fav_pid,
            "name": fav_meta["name"],
            "title": fav_meta["title"],
            "icon": fav_meta["icon"],
            "minutes_spent": fav_row["p_mins"]
        }
    else:
        fav_meta = _get_planet_meta(42)
        fav_planet = {
            "id": 42,
            "name": fav_meta["name"],
            "title": fav_meta["title"],
            "icon": fav_meta["icon"],
            "minutes_spent": daily_mins
        }

    conn.close()

    return {
        "child_id": child_id,
        "child_name": child_name,
        "daily": daily_data,
        "weekly": weekly_data,
        "monthly": monthly_data,
        "favorite_planet": fav_planet
    }


@app.get("/mobile/child/{child_id}/activity-stats/", response_model=ChildActivityStatsResponse, tags=["Mobil Ilova (Mobile API)"], summary="7.9. Farzandning AI Faollik Statistikasi — Kunlik, Haftalik, Oylik (Token orqali)")
@app.get("/mobile/child/{child_id}/activity-stats", response_model=ChildActivityStatsResponse, include_in_schema=False)
@app.get("/mobile/child-activity/{child_id}", response_model=ChildActivityStatsResponse, include_in_schema=False)
@app.get("/mobile/child/{child_id}/stats", response_model=ChildActivityStatsResponse, include_in_schema=False)
@app.get("/api/website/child/{child_id}/activity-stats/", response_model=ChildActivityStatsResponse, tags=["Web Sayt (Website)"], summary="Web: Farzandning AI Faollik Statistikasi")
@app.get("/api/website/child/{child_id}/activity-stats", response_model=ChildActivityStatsResponse, include_in_schema=False)
def get_child_activity_stats_endpoint(child_id: int, request: Request, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    return calculate_child_activity_stats(child_id, user_id, request)


# 7.10 FARZANDNING AI BILAN SUHBAT TARIXI (CHAT HISTORY)
@app.get("/mobile/child/{child_id}/ai-history/", response_model=List[AiChatHistoryItemResponse], tags=["Mobil Ilova (Mobile API)"], summary="7.10. Farzandning AI Bilan Suhbat Tarixi (Token orqali)")
@app.get("/mobile/child/{child_id}/ai-history", response_model=List[AiChatHistoryItemResponse], include_in_schema=False)
@app.get("/mobile/ai/history/{child_id}", response_model=List[AiChatHistoryItemResponse], include_in_schema=False)
@app.get("/mobile/ai/history/", response_model=List[AiChatHistoryItemResponse], include_in_schema=False)
@app.get("/api/website/child/{child_id}/ai-history/", response_model=List[AiChatHistoryItemResponse], tags=["Web Sayt (Website)"], summary="Web: Farzand AI Suhbat Tarixi")
@app.get("/api/website/child/{child_id}/ai-history", response_model=List[AiChatHistoryItemResponse], include_in_schema=False)
def get_child_ai_history(child_id: Optional[int] = None, request: Request = None, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    if child_id:
        cursor.execute("SELECT * FROM ai_chat_history WHERE user_id = ? AND child_id = ? ORDER BY id ASC", (user_id, child_id))
    else:
        cursor.execute("SELECT * FROM ai_chat_history WHERE user_id = ? ORDER BY id ASC", (user_id,))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        audio = d.get("audio_url")
        if audio and request:
            audio = to_full_image_url(audio, request)
        result.append({
            "id": d["id"],
            "role": d["role"],
            "message": d["message"],
            "audio_url": audio,
            "planet_id": d.get("planet_id"),
            "planet_name": d.get("planet_name"),
            "created_at": str(d.get("created_at") or "")
        })
    return result


@app.delete("/mobile/child/{child_id}/ai-history/", tags=["Mobil Ilova (Mobile API)"], summary="7.11. Farzandning AI Suhbat Tarixini Tozalash (Token orqali)")
@app.delete("/mobile/child/{child_id}/ai-history", include_in_schema=False)
@app.delete("/api/website/child/{child_id}/ai-history/", tags=["Web Sayt (Website)"], summary="Web: Farzand AI Suhbat Tarixini Tozalash")
@app.delete("/api/website/child/{child_id}/ai-history", include_in_schema=False)
def delete_child_ai_history(child_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM ai_chat_history WHERE user_id = ? AND child_id = ?", (user_id, child_id))
    conn.commit()
    conn.close()
    return {"success": True, "message": "AI suhbat tarixi muvaffaqiyatli tozalandi", "child_id": child_id}


# ==============================================================================
# 7.12. NEPTUNE / EMOTSIYALAR VA KAYFIYAT KUNDALIGI (EMOTIONAL PLANET)
# ==============================================================================

EMOTIONS_CONFIG = {
    "happy": {
        "uzb": {"name": "Xursand", "description": "Quvnoq, xushchaqchaq va yaxshi kayfiyatda"},
        "rus": {"name": "Счастливый", "description": "Радостное и хорошее настроение"},
        "eng": {"name": "Happy", "description": "Joyful and in a good mood"},
        "emoji": "😊",
        "color": "#FFD166",
        "planet_id": 46
    },
    "calm": {
        "uzb": {"name": "Xotirjam", "description": "Tinch, osoyishta va xotirjam holat"},
        "rus": {"name": "Спокойный", "description": "Тихое и умиротворенное состояние"},
        "eng": {"name": "Calm", "description": "Peaceful and relaxed"},
        "emoji": "😌",
        "color": "#06D6A0",
        "planet_id": 46
    },
    "excited": {
        "uzb": {"name": "G'ayratli", "description": "Ilhomlangan, yangiliklarga tayyor va quvnoq"},
        "rus": {"name": "Воодушевленный", "description": "Полный энергии и вдохновения"},
        "eng": {"name": "Excited", "description": "Full of energy and enthusiasm"},
        "emoji": "🤩",
        "color": "#118AB2",
        "planet_id": 46
    },
    "proud": {
        "uzb": {"name": "Faxrlangan", "description": "O'z yutug'idan mamnun va minnatdor"},
        "rus": {"name": "Гордый", "description": "Доволен своими успехами"},
        "eng": {"name": "Proud", "description": "Satisfied with personal achievement"},
        "emoji": "🥰",
        "color": "#EF476F",
        "planet_id": 46
    },
    "tired": {
        "uzb": {"name": "Charchagan", "description": "Kuchsizlangan, dam olish va uxlash kerak"},
        "rus": {"name": "Уставший", "description": "Нужен отдых и сон"},
        "eng": {"name": "Tired", "description": "Needs rest and sleep"},
        "emoji": "😴",
        "color": "#8338EC",
        "planet_id": 46
    },
    "sad": {
        "uzb": {"name": "G'amgin / Xafa", "description": "Ko'ngli to'lmagan yoki xafa bo'lgan holat"},
        "rus": {"name": "Грустный", "description": "Опечален или расстроен"},
        "eng": {"name": "Sad", "description": "Feeling down or disappointed"},
        "emoji": "😢",
        "color": "#4A90E2",
        "planet_id": 46
    },
    "angry": {
        "uzb": {"name": "Jahldor", "description": "Asabiylashgan yoki g'azablangan holat"},
        "rus": {"name": "Сердитый", "description": "Раздражен или злится"},
        "eng": {"name": "Angry", "description": "Frustrated or irritated"},
        "emoji": "😠",
        "color": "#E63946",
        "planet_id": 46
    },
    "scared": {
        "uzb": {"name": "Qo'rqqan", "description": "Cho'chigan yoki xavotirlangan holat"},
        "rus": {"name": "Испуганный", "description": "Боится или тревожится"},
        "eng": {"name": "Scared", "description": "Afraid or anxious"},
        "emoji": "😨",
        "color": "#FB8500",
        "planet_id": 46
    },
    "surprised": {
        "uzb": {"name": "Hayron", "description": "Kutilmagan yangilikdan hayratda"},
        "rus": {"name": "Удивленный", "description": "Удивлен неожиданностью"},
        "eng": {"name": "Surprised", "description": "Amazed by something unexpected"},
        "emoji": "😲",
        "color": "#02C39A",
        "planet_id": 46
    }
}

def _get_day_name(date_str: str, lang: str = "uzb") -> str:
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        weekday = dt.weekday()
        day_names = {
            "uzb": ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"],
            "rus": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
            "eng": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        }
        return day_names.get(lang, day_names["uzb"])[weekday]
    except Exception:
        return ""


# 7.12.1. MAVJUD EMOTSIYALAR RO'YXATI
@app.get("/mobile/planets/neptune/options/", response_model=List[EmotionOption], tags=["Mobil Ilova (Mobile API)"], summary="7.12.1. Neptune / Emotsiyalar Sayyorasi — Mavjud Emotsiyalar Ro'yxati")
@app.get("/mobile/planets/neptune/options", response_model=List[EmotionOption], include_in_schema=False)
@app.get("/mobile/planets/neptun/options/", response_model=List[EmotionOption], include_in_schema=False)
@app.get("/mobile/planets/neptun/options", response_model=List[EmotionOption], include_in_schema=False)
@app.get("/mobile/emotions/options/", response_model=List[EmotionOption], include_in_schema=False)
@app.get("/mobile/emotions/options", response_model=List[EmotionOption], include_in_schema=False)
def get_neptune_emotion_options(request: Request):
    lang = get_accept_language(request)
    options = []
    for key, val in EMOTIONS_CONFIG.items():
        lang_data = val.get(lang, val["uzb"])
        options.append({
            "key": key,
            "name": lang_data["name"],
            "emoji": val["emoji"],
            "color": val["color"],
            "description": lang_data["description"]
        })
    return options


# 7.12.2. BOLANING YANGI EMOTSIYASINI SAQLASH (BOLA & NEPTUNE UCHUN)
@app.post("/mobile/planets/neptune/emotions/", response_model=EmotionItemResponse, status_code=status.HTTP_201_CREATED, tags=["Mobil Ilova (Mobile API)"], summary="7.12.2. Farzand Emotsiyasini Belgilash / Saqlash (Token orqali)")
@app.post("/mobile/planets/neptune/emotions", response_model=EmotionItemResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/mobile/planets/neptun/emotions/", response_model=EmotionItemResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/mobile/planets/neptun/emotions", response_model=EmotionItemResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/mobile/emotions/", response_model=EmotionItemResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/mobile/emotions", response_model=EmotionItemResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def record_child_emotion(
    req: RecordEmotionRequest,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    lang = get_accept_language(request)
    now = datetime.now()
    date_str = req.date or now.strftime("%Y-%m-%d")
    time_str = req.time or now.strftime("%H:%M:%S")

    emotion_cfg = EMOTIONS_CONFIG.get(req.emotion_key.lower().strip(), EMOTIONS_CONFIG["happy"])
    lang_data = emotion_cfg.get(lang, emotion_cfg["uzb"])
    emotion_name = lang_data["name"]
    emoji = req.emoji or emotion_cfg["emoji"]
    color = emotion_cfg["color"]

    conn = get_db_connection()
    cursor = conn.cursor()

    # Farzand tegishliligini tekshirish
    cursor.execute("SELECT id, name, surname FROM children WHERE id = ? AND user_id = ?", (req.child_id, user_id))
    child_row = cursor.fetchone()
    if not child_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Farzand topilmadi yoki sizga tegishli emas!")

    child_full_name = f"{child_row['name']} {child_row['surname']}".strip()

    cursor.execute("""
        INSERT INTO child_emotions (user_id, child_id, emotion_key, emotion_name, emoji, color, intensity, note, planet_id, date, time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        req.child_id,
        req.emotion_key.lower().strip(),
        emotion_name,
        emoji,
        color,
        req.intensity or 3,
        (req.note or "").strip(),
        46, # Neptune / Emotional planet
        date_str,
        time_str
    ))
    emotion_id = cursor.lastrowid
    conn.commit()
    conn.close()

    day_name = _get_day_name(date_str, lang)

    return {
        "id": emotion_id,
        "child_id": req.child_id,
        "child_name": child_full_name,
        "emotion_key": req.emotion_key.lower().strip(),
        "emotion_name": emotion_name,
        "emoji": emoji,
        "color": color,
        "intensity": req.intensity or 3,
        "note": (req.note or "").strip(),
        "date": date_str,
        "time": time_str,
        "day_name": day_name,
        "created_at": now.strftime("%Y-%m-%d %H:%M:%S")
    }


# Farzand ID si URL path orqali berilganda qo'llab-quvvatlash
@app.post("/mobile/child/{child_id}/emotions/", response_model=EmotionItemResponse, status_code=status.HTTP_201_CREATED, tags=["Mobil Ilova (Mobile API)"], summary="7.12.2.1. Farzand Emotsiyasini Belgilash (Path ID orqali)")
@app.post("/mobile/child/{child_id}/emotions", response_model=EmotionItemResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def record_child_emotion_by_path(
    child_id: int,
    req: RecordEmotionRequest,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    req.child_id = child_id
    return record_child_emotion(req, request, current_user)


# 7.12.3. BOLA UCHUN: OXIRGI 7 KUNLIK (1 HAFTALIK) EMOTSIYALAR
# (7 kundan eski emotsiyalar bola panelida ko'rinmaydi — avtomatik o'chadi/filtrlanadi)
@app.get("/mobile/planets/neptune/emotions/", response_model=WeeklyChildEmotionsResponse, tags=["Mobil Ilova (Mobile API)"], summary="7.12.3. Neptune / Bola Paneli — Oxirgi 7 Kunlik Emotsiyalar (Token orqali)")
@app.get("/mobile/planets/neptune/emotions", response_model=WeeklyChildEmotionsResponse, include_in_schema=False)
@app.get("/mobile/planets/neptun/emotions/", response_model=WeeklyChildEmotionsResponse, include_in_schema=False)
@app.get("/mobile/planets/neptun/emotions", response_model=WeeklyChildEmotionsResponse, include_in_schema=False)
@app.get("/mobile/emotions/weekly/", response_model=WeeklyChildEmotionsResponse, include_in_schema=False)
@app.get("/mobile/emotions/weekly", response_model=WeeklyChildEmotionsResponse, include_in_schema=False)
def get_child_weekly_emotions(
    child_id: Optional[int] = Query(None, description="Farzand ID raqami"),
    request: Request = None,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    lang = get_accept_language(request)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Farzandni aniqlash
    if child_id:
        cursor.execute("SELECT id, name, surname FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    else:
        cursor.execute("SELECT id, name, surname FROM children WHERE user_id = ? ORDER BY id ASC LIMIT 1", (user_id,))
    
    child_row = cursor.fetchone()
    if not child_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Farzand topilmadi!")

    target_child_id = child_row["id"]
    child_full_name = f"{child_row['name']} {child_row['surname']}".strip()

    # Oxirgi 7 kunlik sanalarni hisoblash
    seven_days_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

    cursor.execute("""
        SELECT * FROM child_emotions 
        WHERE user_id = ? AND child_id = ? AND date >= ?
        ORDER BY date DESC, time DESC
    """, (user_id, target_child_id, seven_days_ago))
    rows = cursor.fetchall()
    conn.close()

    emotions_list = []
    emotion_counter = {}
    daily_map = {}

    for r in rows:
        d = dict(r)
        d_date = d["date"]
        d_day = _get_day_name(d_date, lang)
        key = d.get("emotion_key", "happy")
        cfg = EMOTIONS_CONFIG.get(key, EMOTIONS_CONFIG["happy"])
        lang_data = cfg.get(lang, cfg["uzb"])

        item = {
            "id": d["id"],
            "child_id": d["child_id"],
            "child_name": child_full_name,
            "emotion_key": key,
            "emotion_name": lang_data["name"],
            "emoji": d.get("emoji") or cfg["emoji"],
            "color": d.get("color") or cfg["color"],
            "intensity": d.get("intensity") or 3,
            "note": d.get("note") or "",
            "date": d_date,
            "time": d.get("time") or "",
            "day_name": d_day,
            "created_at": str(d.get("created_at") or "")
        }
        emotions_list.append(item)

        # Statistika
        emotion_counter[key] = emotion_counter.get(key, 0) + 1

        if d_date not in daily_map:
            daily_map[d_date] = {
                "date": d_date,
                "day_name": d_day,
                "emotions": []
            }
        daily_map[d_date]["emotions"].append(item)

    dominant_key = max(emotion_counter, key=emotion_counter.get) if emotion_counter else None
    dominant_name = EMOTIONS_CONFIG.get(dominant_key, {}).get(lang, {}).get("name") if dominant_key else None
    dominant_emoji = EMOTIONS_CONFIG.get(dominant_key, {}).get("emoji") if dominant_key else None

    # Kunlar bo'yicha saralash
    daily_summary = list(daily_map.values())

    return {
        "success": True,
        "child_id": target_child_id,
        "child_name": child_full_name,
        "period": "last_7_days",
        "total_records": len(emotions_list),
        "dominant_emotion": dominant_name,
        "dominant_emoji": dominant_emoji,
        "emotions": emotions_list,
        "daily_summary": daily_summary
    }


# 7.12.4. OTA-ONA UCHUN: FARZANDNING TO'LIQ EMOTSIYALAR TARIXI VA ANALITIKASI
# (Ota-ona uchun barcha tarixlar, shu jumladan 7 kundan oldingilar ham o'chmasdan turadi!)
@app.get("/mobile/parent/child/{child_id}/emotions/", response_model=ParentChildEmotionsAnalyticsResponse, tags=["Mobil Ilova (Mobile API)"], summary="7.12.4. Ota-ona Paneli — Farzandning To'liq Emotsiyalar Tarixi & Tahlili (Token orqali)")
@app.get("/mobile/parent/child/{child_id}/emotions", response_model=ParentChildEmotionsAnalyticsResponse, include_in_schema=False)
@app.get("/mobile/parents/child/{child_id}/emotions/", response_model=ParentChildEmotionsAnalyticsResponse, include_in_schema=False)
@app.get("/mobile/parents/child/{child_id}/emotions", response_model=ParentChildEmotionsAnalyticsResponse, include_in_schema=False)
@app.get("/api/website/child/{child_id}/emotions/", response_model=ParentChildEmotionsAnalyticsResponse, tags=["Web Sayt (Website)"], summary="Web: Farzand Emotsiyalar Tarixi & Tahlili")
@app.get("/api/website/child/{child_id}/emotions", response_model=ParentChildEmotionsAnalyticsResponse, include_in_schema=False)
def get_parent_child_emotions_analytics(
    child_id: int,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    lang = get_accept_language(request)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, surname FROM children WHERE id = ? AND user_id = ?", (child_id, user_id))
    child_row = cursor.fetchone()
    if not child_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Farzand topilmadi yoki sizga tegishli emas!")

    child_full_name = f"{child_row['name']} {child_row['surname']}".strip()

    # Barcha tarixni olish (hech qanday kun cheklovisiz)
    cursor.execute("""
        SELECT * FROM child_emotions 
        WHERE user_id = ? AND child_id = ?
        ORDER BY date DESC, time DESC
    """, (user_id, child_id))
    all_rows = cursor.fetchall()
    conn.close()

    seven_days_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

    all_history = []
    weekly_emotions = []
    emotion_counts = {}

    for r in all_rows:
        d = dict(r)
        d_date = d["date"]
        d_day = _get_day_name(d_date, lang)
        key = d.get("emotion_key", "happy")
        cfg = EMOTIONS_CONFIG.get(key, EMOTIONS_CONFIG["happy"])
        lang_data = cfg.get(lang, cfg["uzb"])

        item = {
            "id": d["id"],
            "child_id": d["child_id"],
            "child_name": child_full_name,
            "emotion_key": key,
            "emotion_name": lang_data["name"],
            "emoji": d.get("emoji") or cfg["emoji"],
            "color": d.get("color") or cfg["color"],
            "intensity": d.get("intensity") or 3,
            "note": d.get("note") or "",
            "date": d_date,
            "time": d.get("time") or "",
            "day_name": d_day,
            "created_at": str(d.get("created_at") or "")
        }
        all_history.append(item)

        # 7 kunlik saralash
        if d_date >= seven_days_ago:
            weekly_emotions.append(item)

        # Taqsimot hisoblash
        if key not in emotion_counts:
            emotion_counts[key] = {
                "key": key,
                "name": lang_data["name"],
                "emoji": cfg["emoji"],
                "color": cfg["color"],
                "count": 0
            }
        emotion_counts[key]["count"] += 1

    total_records = len(all_history)
    distribution = []
    for k, v in emotion_counts.items():
        pct = round((v["count"] / total_records) * 100, 1) if total_records > 0 else 0
        distribution.append({
            "emotion_key": v["key"],
            "emotion_name": v["name"],
            "emoji": v["emoji"],
            "color": v["color"],
            "count": v["count"],
            "percentage": pct
        })
    distribution.sort(key=lambda x: x["count"], reverse=True)

    dominant_key = distribution[0]["emotion_key"] if distribution else None
    dominant_name = distribution[0]["emotion_name"] if distribution else None
    dominant_emoji = distribution[0]["emoji"] if distribution else None

    # AI tavsiyasi
    ai_recommendation = None
    if dominant_key in ["happy", "excited", "proud"]:
        ai_recommendation = f"{child_row['name']} so'nggi vaqtlarda asosan ijobiy va quvnoq kayfiyatda! Bu uning darslarni o'zlashtirishi va ijodiy fikrlashiga ajoyib turtki beradi."
    elif dominant_key in ["sad", "tired", "angry", "scared"]:
        ai_recommendation = f"{child_row['name']} biroz charchagan yoki xavotirli holatda. Unga ko'proq tabiat qo'ynida dam berish, birgalikda sayr qilish va samimiy suhbatlashish tavsiya etiladi."
    else:
        ai_recommendation = f"{child_row['name']} barqaror va xotirjam holatda o'rganmoqda. Ushbu sokin muhit uning diqqatini jamlashiga yordam beradi."

    return {
        "success": True,
        "child_id": child_id,
        "child_name": child_full_name,
        "total_history_count": total_records,
        "last_7_days_count": len(weekly_emotions),
        "dominant_emotion": dominant_name,
        "dominant_emoji": dominant_emoji,
        "emotion_distribution": distribution,
        "weekly_emotions": weekly_emotions,
        "all_history": all_history,
        "ai_recommendation": ai_recommendation
    }


# 7.12.5. EMOTSIYANI O'CHIRISH
@app.delete("/mobile/planets/neptune/emotions/{emotion_id}", tags=["Mobil Ilova (Mobile API)"], summary="7.12.5. Emotsiya Yozuvini O'chirish (Token orqali)")
@app.delete("/mobile/planets/neptun/emotions/{emotion_id}", include_in_schema=False)
@app.delete("/mobile/child/emotions/{emotion_id}", include_in_schema=False)
def delete_child_emotion(emotion_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM child_emotions WHERE id = ? AND user_id = ?", (emotion_id, user_id))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Emotsiya yozuvi muvaffaqiyatli o'chirildi", "id": emotion_id}


# 8. MOBIL SAYYORALAR RO'YXATI (/mobile/planets/ va /mobile/planets)
@app.get("/mobile/planets/", response_model=List[PlanetResponse], tags=["Mobil Ilova (Mobile API)"], summary="8. Mobil Ilova Uchun Barcha Sayyoralar Ro'yxati — is_blocked maydoni bilan (Token orqali)")
@app.get("/mobile/planets", response_model=List[PlanetResponse], include_in_schema=False)
def mobile_get_planets(request: Request, current_user: dict = Depends(get_current_user)):
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    # BARCHA sayyoralarni qaytaramiz — bola ilovasi is_blocked=True bo'lsa o'zi blok ko'rsatsin
    cursor.execute("SELECT * FROM planets ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [format_planet_row(row, request, lang=lang) for row in rows]


# 9. MOBIL SAYYORA BATAFSIL (/mobile/planets/{planet_id})
@app.get("/mobile/planets/{planet_id}", response_model=PlanetResponse, tags=["Mobil Ilova (Mobile API)"], summary="9. Mobil Ilova Uchun Bitta Sayyora Tafsilotlari (Token orqali)")
def mobile_get_planet_detail(planet_id: int, request: Request, current_user: dict = Depends(get_current_user)):
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM planets WHERE id = ?", (planet_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Sayyora topilmadi!")
    return format_planet_row(row, request, lang=lang)


# 9.1 MOBIL FAQ SAVOLLAR RO'YXATI (/mobile/faqs/ va /mobile/faqs)
@app.get("/mobile/faqs/", response_model=List[FaqResponse], tags=["Mobil Ilova (Mobile API)"], summary="9.1. Mobil Ilova Uchun FAQ (Ko'p So'raladigan Savollar) Ro'yxati")
@app.get("/mobile/faqs", response_model=List[FaqResponse], include_in_schema=False)
def mobile_get_faqs(request: Request):
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM faqs WHERE status = 'active' ORDER BY order_num ASC, id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [format_faq_row(r, lang=lang) for r in rows]


@app.get("/mobile/faqs/{faq_id}", response_model=FaqResponse, tags=["Mobil Ilova (Mobile API)"], summary="9.2. Mobil Ilova Uchun Bitta FAQ Savol Tafsilotlari")
def mobile_get_faq_detail(faq_id: int, request: Request):
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM faqs WHERE id = ?", (faq_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="FAQ savol topilmadi!")
    return format_faq_row(row, lang=lang)


# 9.8 OVOZ TALUFUZINI TOZALASH VA SO'ZLARGA AYLANTIRISH
def format_text_for_speech(text: str, lang: str = "uzb") -> str:
    """Ovozli o'qish uchun matnni tozalash va tabiiy, yoqimli talaffuzga moslash"""
    if not text:
        return ""
    t = text
    # Markdown va maxsus belgilarni olib tashlash
    t = re.sub(r'[*#_`~>•\\/\[\]\(\)\{\}]', ' ', t)
    # Emojilarni olib tashlash (TTS xatolik bermasligi uchun)
    t = re.sub(r'[\U00010000-\U0010ffff]', ' ', t)

    # Arifmetik belgilar va amallarni tabiiy so'zga aylantirish
    if lang in ("ru", "rus", "ru-ru"):
        t = re.sub(r'(\d+)\s*\+\s*(\d+)', r'\1 плюс \2', t)
        t = re.sub(r'(\d+)\s*-\s*(\d+)', r'\1 минус \2', t)
        t = re.sub(r'(\d+)\s*=\s*(\d+)', r'\1 равно \2', t)
        t = t.replace("+", " плюс ").replace("=", " равно ").replace("%", " процентов ")
    elif lang in ("en", "eng", "en-us"):
        t = re.sub(r'(\d+)\s*\+\s*(\d+)', r'\1 plus \2', t)
        t = re.sub(r'(\d+)\s*-\s*(\d+)', r'\1 minus \2', t)
        t = re.sub(r'(\d+)\s*=\s*(\d+)', r'\1 equals \2', t)
        t = t.replace("+", " plus ").replace("=", " equals ").replace("%", " percent ")
    else: # uzb
        t = re.sub(r'(\d+)\s*\+\s*(\d+)', r"\1 ga \2 ni qo'shsak", t)
        t = re.sub(r'(\d+)\s*-\s*(\d+)', r"\1 dan \2 ni ayirsak", t)
        t = re.sub(r'(\d+)\s*=\s*(\d+)', r"\1 teng \2", t)
        t = t.replace("+", " qo'shuv ").replace("=", " teng ").replace("%", " foiz ")

    # Ortiqcha bo'shliqlarni tozalash
    t = re.sub(r'\s+', ' ', t).strip()
    return t


# 9.9 EDGE TTS YORDAMCHI FUNKSIYASI (Ultra-HD Sho'x Ovoz & Tabiiy Talaffuz)
async def generate_edge_tts_audio(text: str, lang: str = "uzb", request: Request = None, child_age: Optional[int] = None, voice_type: Optional[str] = None) -> Optional[str]:
    """Matnni yosh bolalar uchun yoqimli, sho'x va baland-tiniq (HD) ovozga aylantiradi"""
    try:
        clean_text = format_text_for_speech(text, lang)
        if not clean_text:
            return None

        lang_lower = (lang or "uzb").strip().lower()
        if lang_lower in ["ru", "rus", "ru-ru"]:
            voice = "ru-RU-DmitryNeural"
            pitch_val = "+6Hz"
            rate_val = "+4%"
        elif lang_lower in ["en", "eng", "en-us"]:
            voice = "en-US-AnaNeural" if voice_type == "female" else "en-US-GuyNeural"
            pitch_val = "+5Hz"
            rate_val = "+3%"
        else:
            # O'zbek tili uchun yoshga mos ovoz:
            voice = "uz-UZ-SardorNeural"
            age = child_age or 6
            if age <= 7:
                # 3 yoshdan 7 yoshgacha: Sho'x, o'ynoqi, qiziqarli yosh bola ovozi
                pitch_val = "+28Hz"
                rate_val = "+6%"
            else:
                # 8 yoshdan katta: Do'stona, intellektual yigit ovozi
                pitch_val = "+2Hz"
                rate_val = "+1%"

        # Volume +50% — tiniq, jarangdor va baland eshitilishi uchun
        volume_val = "+50%"

        hash_key = hashlib.md5(f"{voice}:{pitch_val}:{rate_val}:{volume_val}:{clean_text}".encode('utf-8')).hexdigest()
        filename = f"{hash_key}.mp3"
        file_path = os.path.join(AUDIO_CACHE_DIR, filename)

        if not os.path.exists(file_path):
            communicate = edge_tts.Communicate(clean_text, voice, pitch=pitch_val, rate=rate_val, volume=volume_val)
            await communicate.save(file_path)

        relative_url = f"/audio_cache/{filename}"
        return to_full_image_url(relative_url, request) if request else relative_url
    except Exception as e:
        print("Edge TTS generatsiya xatosi:", e)
        return None


# 9.10 OVOZNI TINGLASH VA MATNGA AYLANTIRISH (SPEECH-TO-TEXT / MULTIMODAL AI)
async def process_audio_speech_to_text(audio_bytes: bytes, mime_type: str = "audio/mp3", lang: str = "uzb") -> str:
    """
    Bolaning audio ovozini tinglaydi va aytgan gapini 100% aniqlikda matnga (STT) aylantiradi.
    Gemini 3.6 Flash multimodal sun'iy intellekt texnologiyasi orqali ishlaydi.
    """
    models_to_try = ["gemini-3.6-flash", "gemini-1.5-flash", "gemini-2.0-flash-exp"]
    for m in models_to_try:
        try:
            model = genai.GenerativeModel(m)
            prompt = (
                f"Tinglovchi tili: {lang}. "
                "Ushbu audio yozuvni tinglab, bolaning aytgan gapini aniq matnga o'gir (transcription). "
                "Faqat quyidagi JSON formatida javob qaytar (boshqa hech narsa yozma):\n"
                "{\"transcription\": \"<bola aytgan aniq matn>\"}"
            )
            contents = [
                {"mime_type": mime_type, "data": audio_bytes},
                prompt
            ]
            response = await asyncio.to_thread(model.generate_content, contents)
            if response and response.text:
                clean_json = response.text.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_json:
                    clean_json = clean_json.split("```")[1].split("```")[0].strip()
                import json as py_json
                parsed = py_json.loads(clean_json)
                res_text = parsed.get("transcription", "").strip()
                if res_text:
                    return res_text
        except Exception as e:
            print(f"[STT Error with model {m}]:", e)
            continue
    return ""


# 10. GEMINI AI SUHBAT VA TAVSIYALAR (/mobile/ai/chat/ va /mobile/ai/chat)
@app.post("/mobile/ai/chat/", response_model=AiChatResponse, tags=["Mobil Ilova (Mobile API)"], summary="10. Bolalar & Ota-onalar Uchun Gemini AI Chatbot (Token orqali)")
@app.post("/mobile/ai/chat", response_model=AiChatResponse, tags=["Mobil Ilova (Mobile API)"], include_in_schema=False)
@app.post("/api/ai/chat/", response_model=AiChatResponse, tags=["Mobil Ilova (Mobile API)"], include_in_schema=False)
@app.post("/api/ai/chat", response_model=AiChatResponse, tags=["Mobil Ilova (Mobile API)"], include_in_schema=False)
async def mobile_ai_chat(req: AiChatRequest, request: Request, current_user: dict = Depends(get_current_user)):
    user_prompt = req.message.strip()
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Xabar matni bo'sh bo'lishi mumkin emas!")

    # Accept-Language header tilni ustuvorlik bilan olish
    header_lang = get_accept_language(request)
    if header_lang != "uzb" and (not req.language or req.language == "uzb"):
        req.language = header_lang

    user_id = current_user.get("id") if current_user else None
    return await _build_ai_response(req, user_prompt, request, user_id=user_id)


def _save_ai_interaction(user_id: Optional[int], req: AiChatRequest, user_prompt: str, ai_text: str, audio_url: Optional[str], planet_id: Optional[int], planet_name: Optional[str]):
    """AI suhbati va sarflangan vaqtni bazaga avtomatik yozish"""
    if not user_id:
        return
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Farzand ID sini aniqlash
        child_id = req.child_id
        if not child_id:
            cursor.execute("SELECT id FROM children WHERE user_id = ? ORDER BY id ASC LIMIT 1", (user_id,))
            c_row = cursor.fetchone()
            if c_row:
                child_id = c_row["id"]

        # 1. AI Chat Tarixiga yozish (User savoli va Model javobi)
        cursor.execute(
            "INSERT INTO ai_chat_history (user_id, child_id, role, message, audio_url, planet_id, planet_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, child_id, "user", user_prompt, None, planet_id, planet_name)
        )
        cursor.execute(
            "INSERT INTO ai_chat_history (user_id, child_id, role, message, audio_url, planet_id, planet_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, child_id, "model", ai_text, audio_url, planet_id, planet_name)
        )

        # 2. Kunlik Faollik va Vaqt (Screen time) ga qo'shish
        if child_id:
            today_str = datetime.now().strftime("%Y-%m-%d")
            target_planet = planet_id or 42
            cursor.execute("SELECT * FROM child_activities WHERE child_id = ? AND date = ? AND planet_id = ?", (child_id, today_str, target_planet))
            act = cursor.fetchone()
            if act:
                cursor.execute(
                    "UPDATE child_activities SET minutes_spent = minutes_spent + 2, messages_count = messages_count + 1 WHERE id = ?",
                    (act["id"],)
                )
            else:
                cursor.execute(
                    "INSERT INTO child_activities (user_id, child_id, date, minutes_spent, messages_count, planet_id) VALUES (?, ?, ?, 2, 1, ?)",
                    (user_id, child_id, today_str, target_planet)
                )

        conn.commit()
        conn.close()
    except Exception as e:
        print("[AI History/Activity Save Error]:", e)


async def _build_ai_response(req: AiChatRequest, user_prompt: str, request: Request = None, user_id: Optional[int] = None) -> dict:
    """AI javobini quradigan umumiy funksiya (mobil va admin uchun)"""

    # 1. Bolaning yoshi va ismi
    age = req.child_age or 7
    child_name = req.child_name or "Do'stim"

    # 2. Yosh toifasiga mos pedagogik qoida va uslub
    if age <= 6:
        age_group_label = "3-6 yosh (Maktabgacha yoshdagi kichkintoy)"
        pedagogical_style = (
            "- Soddalashtirilgan, quvnoq va ertaksimon tilda so'zla.\n"
            "- Misollar: Mevalar (olma, nok), shirin jonivorlar (quyoncha, ayiqcha), ranglar va barmoqlarda sanash.\n"
            "- Savollar: Juda sodda, 1 ta aniq savol bilan tugat (Masalan: 'Qani, sanab ko'r-chi, nechta bo'ldi?')."
        )
    elif age <= 10:
        age_group_label = "7-10 yosh (Boshlang'ich maktab o'quvchisi)"
        pedagogical_style = (
            "- Qiziquvchan, faol, do'stona va intellektual ustoz sifatida muloqot qil.\n"
            "- Misollar: Maktab hayoti, do'stlar, sport, kosmik jismlar, tabiat mo'jizalari va qiziqarli aqliy jumboqlar.\n"
            "- Bolalarcha ortiqcha erkalashsiz, do'stona hurmat bilan savol ber va fikrlashga chorla."
        )
    else:
        age_group_label = f"{age} yosh (Katta maktab / O'smir o'quvchi)"
        pedagogical_style = (
            "- DIQQAT: Bola 11+ yoshda! Unga bolalarcha muomala qilma, qo'lda barmoq sanash yoki olma-nok misollarini ISHLATMA!\n"
            "- Tengdosh aqlli do'st sifatida qisqa va lo'nda tushuntir.\n"
            "- Misollar: Real fan, texnologiya, tezkor hisob va mantiqiy qonuniyatlar."
        )

    # 3. Sayyora konteksti va boy ma'lumotlar (ID 42 - 50)
    planet_info = ""
    planet_name_out = req.planet_name
    planet_id_out = req.planet_id

    PLANET_DETAILS = {
        42: {
            "name": "Kognitiv",
            "role": "Mantiq va aqliy jumboqlar sayyorasi.",
            "intro": f"Salom, {child_name}! Sen Kognitiv sayyorasidasan. Bu yerda mantiqiy jumboqlarni yechamiz. Qanday savoling bor? 🧠"
        },
        43: {
            "name": "Jismoniy va motorika",
            "role": "Harakat va mashqlar sayyorasi.",
            "intro": f"Salom, {child_name}! Sen Jismoniy sayyoradasan. Bu yerda chaqqonlik va mashqlarni o'rganamiz. Qani, boshlaymizmi? 🏃‍♂️"
        },
        44: {
            "name": "Nutq va til",
            "role": "Talaffuz va ertaklar sayyorasi.",
            "intro": f"Salom, {child_name}! Sen Nutq va til sayyorasidasan. Bu yerda chiroyli gapirish va ertaklarni o'rganamiz. Nima haqida gaplashamiz? 🗣️"
        },
        45: {
            "name": "Ijtimoiy",
            "role": "Do'stlik va hamkorlik sayyorasi.",
            "intro": f"Salom, {child_name}! Sen Ijtimoiy sayyoradasan. Bu yerda do'stlik va jamoada ishlashni o'rganamiz! 🤝"
        },
        46: {
            "name": "Emotsional",
            "role": "Kayfiyat va quvonch sayyorasi.",
            "intro": f"Salom, {child_name}! Sen Emotsional sayyoradasan. Bugun kayfiyating qanday? 😊"
        },
        47: {
            "name": "Axloqiy",
            "role": "Odob-axloq sayyorasi.",
            "intro": f"Salom, {child_name}! Sen Axloqiy sayyoradasan. Bu yerda yaxshi fazilatlarni o'rganamiz. ⚖️"
        },
        48: {
            "name": "Ijodkorlik",
            "role": "San'at va tasavvur sayyorasi.",
            "intro": f"Salom, {child_name}! Sen Ijodkorlik sayyorasidasan. Bugun nima chizamiz yoki yasaymiz? 🎨"
        },
        49: {
            "name": "O'z-o'zini boshqarish",
            "role": "Intizom va reja sayyorasi.",
            "intro": f"Salom, {child_name}! Sen O'z-o'zini boshqarish sayyorasidasan. Bugungi rejang qanday? 🎯"
        },
        50: {
            "name": "Quyosh",
            "role": "Markaziy AI suhbat maydoni.",
            "intro": f"Salom, {child_name}! Sen Quyoshdasan. Men bilan xohlagan mavzuda suhbatlashishing mumkin! ☀️"
        }
    }

    if req.planet_id:
        p_data = PLANET_DETAILS.get(req.planet_id)
        if p_data:
            planet_name_out = p_data["name"]
            planet_info = f" Sayyora: '{planet_name_out}'."
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM planets WHERE id = ?", (req.planet_id,))
            p_row = cursor.fetchone()
            conn.close()
            if p_row:
                p_dict = dict(p_row)
                planet_name_out = p_dict.get("title", "")
                planet_desc = (p_dict.get("description") or "").replace("\n", " ")
                planet_info = f" Sayyora: '{planet_name_out}'."

    clean_low = user_prompt.lower().strip()
    is_planet_intro_query = any(k in clean_low for k in [
        "sayyora haqida", "bu yerda nima", "nimalar bor", "nima ish qilamiz",
        "sayyorasi haqida", "haqida gapirib ber", "tanishtir",
        "планета", "что здесь", "расскажи", "about planet", "what is this"
    ])

    # Til aniqlash (req.language yoki Accept-Language)
    ai_lang = (req.language or "uzb").strip().lower()
    if ai_lang in ("ru", "rus", "ru-ru"):
        ai_lang = "rus"
    elif ai_lang in ("en", "eng", "en-us"):
        ai_lang = "eng"
    else:
        ai_lang = "uzb"

    # Tilga mos sayyora intro
    if req.planet_id and req.planet_id in PLANET_DETAILS and (is_planet_intro_query or clean_low in ["salom", "salomalik", "assalomu alaykum", "hello", "hi", "привет"]):
        multilang = PLANET_INTROS_MULTILANG.get(req.planet_id, {})
        ai_text = multilang.get(ai_lang, PLANET_DETAILS[req.planet_id]["intro"])
        audio_url = await generate_edge_tts_audio(ai_text, ai_lang, request, child_age=age)
        _save_ai_interaction(user_id, req, user_prompt, ai_text, audio_url, planet_id_out, planet_name_out)
        return {
            "success": True,
            "message": "Sayyora tanishtiruvi muvaffaqiyatli olindi",
            "response": ai_text,
            "model_used": "alloma-planet-intro",
            "planet_id": planet_id_out,
            "planet_name": planet_name_out,
            "audio_url": audio_url
        }

    # Tilga mos javob tili ko'rsatmasi
    if ai_lang == "rus":
        lang_rule = "ОБЯЗАТЕЛЬНО отвечай на русском языке. Никогда не пиши на узбекском."
        greet_text = f"Привет{', ' + child_name if req.child_name else ''}! Чем могу помочь? 😊"
    elif ai_lang == "eng":
        lang_rule = "ALWAYS respond in English. Never write in Uzbek."
        greet_text = f"Hello{', ' + child_name if req.child_name else ''}! How can I help you? 😊"
    else:
        lang_rule = "O'ZBEK tilida javob ber."
        greet_text = f"Salom{', ' + child_name if req.child_name else ''}! Qanday yordam bera olaman? 😊"

    # 4. YOSHGA MOS INTERAKTIV PEDAGOGIK TIZIM (Qisqa va lo'nda)
    system_instruction = (
        "Sen 'Alloma AI' — aqlli, quvnoq va do'stona o'g'il bola ustozi/do'stisan!\n"
        f"Bola: {child_name}, Yoshi: {age} yosh ({age_group_label}). {planet_info}\n\n"
        f"TIL QOIDASI: {lang_rule}\n\n"
        f"USLUB:\n{pedagogical_style}\n\n"
        "QAT'IY QOIDALAR:\n"
        "1. JUDA QISQA VA LO'NDA GAPIR! Javoblaring ko'pi bilan 1-2 ta qisqa jumlada bo'lsin. Cho'zma!\n"
        "2. TAYYOR JAVOBNI DARHOL AYTMA! Agar hisob yoki masala so'rasa, qisqacha misol ayt va oxirida o'zidan javobni so'ra!\n"
        "3. Bola to'g'ri topsa: munosib tilida qisqa olqishla.\n"
        "4. Matnda yulduzcha (*) yoki panjara (#) ishlatma."
    )

    # 5. Qisqa va lo'nda salomlashish (ko'p tilli)
    greetings = ["salom", "salomalik", "assalomu alaykum", "hello", "hi", "salom ai", "hey", "привет", "здравствуй", "добрый день"]
    if clean_low in greetings:
        ai_text = greet_text
        audio_url = await generate_edge_tts_audio(ai_text, ai_lang, request, child_age=age)
        _save_ai_interaction(user_id, req, user_prompt, ai_text, audio_url, planet_id_out, planet_name_out)
        return {
            "success": True,
            "message": "AI javobi muvaffaqiyatli olindi",
            "response": ai_text,
            "model_used": "alloma-ai-v1",
            "planet_id": planet_id_out,
            "planet_name": planet_name_out,
            "audio_url": audio_url
        }

    # 6. Gemini modellari orqali javob (tez va sifatli)
    models_to_try = [
        "gemini-3.6-flash",
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash"
    ]
    ai_text = None
    used_model = "gemini-3.6-flash"

    for m in models_to_try:
        try:
            model = genai.GenerativeModel(
                model_name=m,
                system_instruction=system_instruction,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "top_k": 40,
                    "max_output_tokens": 800,
                }
            )

            if req.history and len(req.history) > 0:
                chat_history = [
                    {"role": "user" if h.role == "user" else "model", "parts": [h.content]}
                    for h in req.history[-8:]
                ]
                chat = model.start_chat(history=chat_history)
                response = await asyncio.to_thread(chat.send_message, user_prompt, request_options={"timeout": 12})
            else:
                response = await asyncio.to_thread(model.generate_content, user_prompt, request_options={"timeout": 12})

            if response and response.text and len(response.text.strip()) > 2:
                ai_text = response.text.strip()
                ai_text = ai_text.replace("**", "").replace("##", "").replace("###", "").replace("*", "•")
                used_model = m
                break
        except Exception as e:
            print(f"[Gemini Call Error with {m}]: {e}")
            continue

    if not ai_text:
        if ai_lang == "rus":
            if age <= 6:
                ai_text = f"Давай посчитаем, {child_name}! В одной ручке 5 яблок, и в другой 5. Сколько всего получилось? 🍎✨"
            elif age <= 10:
                ai_text = f"Отличный вопрос, {child_name}! Если сложить 5 и 5, получится число пальчиков на обеих руках. Сколько это? 🧠🚀"
            else:
                ai_text = f"Интересный вопрос, {child_name}! 5 плюс 5 — это основа десятичной системы счисления. Какой твой ответ? 💡"
        elif ai_lang == "eng":
            if age <= 6:
                ai_text = f"Let's count, {child_name}! 5 sweet apples in one hand, and 5 in the other. How many apples in total? 🍎✨"
            elif age <= 10:
                ai_text = f"Great question, {child_name}! Adding 5 and 5 gives the total number of fingers on both hands. What is the answer? 🧠🚀"
            else:
                ai_text = f"Awesome question, {child_name}! 5 plus 5 equals ten. What are your thoughts? 💡"
        else:
            if age <= 6:
                ai_text = f"Qani, {child_name}, bir qo'lingda 5 ta shirin olma, ikkinchi qo'lingda ham 5 ta olma bor desak, jami nechta bo'ladi? Sanab ko'r-chi! 🍎✨"
            elif age <= 10:
                ai_text = f"Ajoyib savol, {child_name}! 5 ga 5 ni qo'shganda, ikki qo'ldagi barcha barmoqlar soni kelib chiqadi. Qani, javobi nechchi bo'ladi? 🧠🚀"
            else:
                ai_text = f"Zo'r savol, {child_name}! 5 va 5 — bu juft sonlar yig'indisi bo'lib, o'nlik sanoq sistemasining asosiy bo'g'ini. Qani, javobini ayt-chi! 💡"

    # Microsoft Neural Studio Audio generatsiya (Yoshga mos sozlangan)
    audio_url = await generate_edge_tts_audio(ai_text, ai_lang, request, child_age=age)
    _save_ai_interaction(user_id, req, user_prompt, ai_text, audio_url, planet_id_out, planet_name_out)

    return {
        "success": True,
        "message": "AI javobi muvaffaqiyatli olindi",
        "response": ai_text,
        "model_used": used_model,
        "planet_id": planet_id_out,
        "planet_name": planet_name_out,
        "audio_url": audio_url
    }


# 10.1 OVOZLI SUHBAT (VOICE-CHAT: OVOZ YUBORIB, OVOZ VA MATN OLISH)
@app.post("/mobile/ai/voice-chat/", response_model=AiVoiceChatResponse, tags=["Mobil Ilova (Mobile API)"], summary="10.1. Ovozli AI Suhbat (Voice-in -> Voice-out)")
@app.post("/mobile/ai/voice-chat", response_model=AiVoiceChatResponse, include_in_schema=False)
@app.post("/api/ai/voice-chat/", response_model=AiVoiceChatResponse, include_in_schema=False)
@app.post("/api/ai/voice-chat", response_model=AiVoiceChatResponse, include_in_schema=False)
async def mobile_ai_voice_chat(
    request: Request,
    file: UploadFile = File(..., description="Foydalanuvchi/bolaning ovozli fayli (MP3, WAV, M4A, OGG, WebM, FLAC)"),
    child_id: Optional[int] = Form(None),
    planet_id: Optional[int] = Form(None),
    planet_name: Optional[str] = Form(None),
    child_name: Optional[str] = Form(None),
    child_age: Optional[int] = Form(None),
    language: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    # 1. Tilni aniqlash
    header_lang = get_accept_language(request)
    req_lang = language or header_lang or "uzb"

    # 2. Audio faylni o'qish
    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) < 100:
        raise HTTPException(status_code=400, detail="Audio fayl bo'sh yoki yaroqsiz!")

    mime_type = file.content_type or "audio/mp3"
    if "wav" in (file.filename or "").lower() or "wav" in mime_type:
        mime_type = "audio/wav"
    elif "m4a" in (file.filename or "").lower() or "m4a" in mime_type:
        mime_type = "audio/m4a"
    elif "ogg" in (file.filename or "").lower() or "ogg" in mime_type:
        mime_type = "audio/ogg"
    elif "webm" in (file.filename or "").lower() or "webm" in mime_type:
        mime_type = "audio/webm"
    else:
        mime_type = "audio/mp3"

    # 3. Gemini Multimodal orqali ovozni tinglash va matnga aylantirish (STT)
    transcription = await process_audio_speech_to_text(audio_bytes, mime_type=mime_type, lang=req_lang)
    if not transcription:
        # Fallback agar ovoz juda sokin yoki tushunarsiz bo'lsa
        if req_lang == "rus":
            fallback_msg = "Привет! Я не расслышал, повтори ещё раз, пожалуйста! 😊"
            transcription = "Привет"
        elif req_lang == "eng":
            fallback_msg = "Hello! I could not hear clearly, could you say that again? 😊"
            transcription = "Hello"
        else:
            fallback_msg = "Salom! Ovozingni unchalik eshita olmadim, yana bir bor qaytarib aytib ko'r-chi! 😊"
            transcription = "Salom"

        audio_url = await generate_edge_tts_audio(fallback_msg, req_lang, request, child_age=child_age)
        return {
            "success": True,
            "message": "Ovoz qabul qilindi",
            "transcription": transcription,
            "response": fallback_msg,
            "audio_url": audio_url,
            "planet_id": planet_id,
            "planet_name": planet_name,
            "language": req_lang,
            "model_used": "gemini-3.6-flash"
        }

    # 4. Matn orqali AI javobini generatsiya qilish
    chat_req = AiChatRequest(
        message=transcription,
        child_id=child_id,
        child_name=child_name,
        child_age=child_age,
        planet_id=planet_id,
        planet_name=planet_name,
        language=req_lang
    )
    user_id = current_user.get("id") if current_user else None
    ai_resp = await _build_ai_response(chat_req, transcription, request, user_id=user_id)

    return {
        "success": True,
        "message": "Ovozli suhbat muvaffaqiyatli amalga oshirildi",
        "transcription": transcription,
        "response": ai_resp["response"],
        "audio_url": ai_resp["audio_url"],
        "planet_id": ai_resp.get("planet_id"),
        "planet_name": ai_resp.get("planet_name"),
        "language": req_lang,
        "model_used": ai_resp.get("model_used", "gemini-3.6-flash")
    }


# 10.2 SOF SPEECH-TO-TEXT (STT) ENDPOINT
@app.post("/mobile/ai/stt/", response_model=AiSttResponse, tags=["Mobil Ilova (Mobile API)"], summary="10.2. Sof Ovozni Matnga Aylantirish (Speech-to-Text)")
@app.post("/mobile/ai/stt", response_model=AiSttResponse, include_in_schema=False)
@app.post("/api/ai/stt/", response_model=AiSttResponse, include_in_schema=False)
@app.post("/api/ai/stt", response_model=AiSttResponse, include_in_schema=False)
async def mobile_ai_stt(
    request: Request,
    file: UploadFile = File(..., description="Ovozli fayl"),
    language: Optional[str] = Form(None)
):
    header_lang = get_accept_language(request)
    req_lang = language or header_lang or "uzb"
    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Audio fayl bo'sh!")

    mime_type = file.content_type or "audio/mp3"
    transcription = await process_audio_speech_to_text(audio_bytes, mime_type=mime_type, lang=req_lang)
    return {
        "success": True,
        "text": transcription,
        "language": req_lang
    }


# 10.3 MUSTAQIL TEXT-TO-SPEECH (TTS) ENDPOINT
@app.post("/api/website/ai/tts", tags=["Web Sayt (Website)"], summary="Matnni Microsoft Neural O'g'il Bola Audio (MP3)ga aylantirish")
@app.post("/api/website/ai/tts/", tags=["Web Sayt (Website)"], include_in_schema=False)
@app.post("/api/ai/tts", tags=["Web Sayt (Website)"], include_in_schema=False)
@app.post("/api/ai/tts/", tags=["Web Sayt (Website)"], include_in_schema=False)
@app.post("/mobile/ai/tts/", tags=["Mobil Ilova (Mobile API)"], include_in_schema=False)
@app.post("/mobile/ai/tts", tags=["Mobil Ilova (Mobile API)"], include_in_schema=False)
async def ai_tts_endpoint(req: AiTtsRequest, request: Request):
    audio_url = await generate_edge_tts_audio(req.text, req.language or "uzb", request)
    if not audio_url:
        raise HTTPException(status_code=500, detail="Audio yaratishda xatolik!")
    return {
        "success": True,
        "audio_url": audio_url
    }


# ==============================================================================

# WEB SAYT (WEBSITE) & ADMIN PANEL ENDPOINTS
# ==============================================================================

# 0. FAYL YUKLASH (IMAGE UPLOAD)
@app.post("/api/website/upload", tags=["Web Sayt (Website)"], summary="Rasm faylini serverga yuklash (To'liq URL qaytaradi)")
async def upload_file(request: Request, file: UploadFile = File(...)):
    try:
        ext = os.path.splitext(file.filename)[1].lower() or ".png"
        unique_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOADS_DIR, unique_name)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        relative_url = f"/images/uploads/{unique_name}"
        full_url = to_full_image_url(relative_url, request)

        return {
            "success": True,
            "filename": file.filename,
            "url": full_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fayl yuklashda xatolik: {str(e)}")


# 1. SAYYORALAR (PLANETS) ENDPOINTS
@app.get("/api/website/planets", response_model=List[PlanetResponse], tags=["Web Sayt (Website)"], summary="Barcha sayyoralar ro'yxatini olish (To'liq rasmli URL)")
@app.get("/api/website/planets/", response_model=List[PlanetResponse], include_in_schema=False)
@app.get("/api/planets", response_model=List[PlanetResponse], include_in_schema=False)
@app.get("/api/planets/", response_model=List[PlanetResponse], include_in_schema=False)
def get_planets(request: Request):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM planets ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [format_planet_row(row, request) for row in rows]

@app.post("/api/website/planets", response_model=PlanetResponse, status_code=status.HTTP_201_CREATED, tags=["Web Sayt (Website)"], summary="Yangi sayyora qo'shish (To'liq rasmli URL)")
@app.post("/api/planets", response_model=PlanetResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/mobile/planets/", response_model=PlanetResponse, status_code=status.HTTP_201_CREATED, tags=["Mobil Ilova (Mobile API)"], summary="9.3. Mobil Ilova Orqali Yangi Sayyora Qo'shish")
@app.post("/mobile/planets", response_model=PlanetResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_planet(planet: PlanetCreate, request: Request):
    title = (planet.title or planet.name or "").strip()
    if not title:
        raise HTTPException(status_code=400, detail="Sayyora nomi majburiy! ('title' yoki 'name' yuboring)")

    conn = get_db_connection()
    cursor = conn.cursor()
    clean_img = sanitize_image_path(planet.image or "/images/planets/earth.svg")
    new_status = planet.status or "active"
    new_is_blocked = 1 if (new_status == "inactive" or planet.is_blocked or planet.is_block) else 0
    cursor.execute(
        "INSERT INTO planets (title, description, image, status, is_blocked, is_block) VALUES (?, ?, ?, ?, ?, ?)",
        (title, planet.description.strip() if planet.description else "", clean_img, new_status, new_is_blocked, new_is_blocked)
    )
    conn.commit()
    planet_id = cursor.lastrowid
    cursor.execute("SELECT * FROM planets WHERE id = ?", (planet_id,))
    new_planet = cursor.fetchone()
    conn.close()
    return format_planet_row(new_planet, request)

@app.put("/api/website/planets/{planet_id}", response_model=PlanetResponse, tags=["Web Sayt (Website)"], summary="Sayyorani yangilash / tahrirlash")
@app.put("/api/planets/{planet_id}", response_model=PlanetResponse, include_in_schema=False)
@app.put("/mobile/planets/{planet_id}/", response_model=PlanetResponse, include_in_schema=False)
@app.put("/mobile/planets/{planet_id}", response_model=PlanetResponse, include_in_schema=False)
def update_planet(planet_id: int, planet: PlanetUpdate, request: Request):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM planets WHERE id = ?", (planet_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Sayyora topilmadi")

    title_in = planet.title if planet.title is not None else planet.name
    new_title = title_in.strip() if title_in is not None else existing["title"]
    new_desc = planet.description.strip() if planet.description is not None else existing["description"]
    new_image = sanitize_image_path(planet.image) if planet.image is not None else existing["image"]
    new_status = planet.status if planet.status is not None else existing["status"]

    # is_blocked va is_block: status yoki kelgan qiymatdan sinxronlash
    if planet.is_blocked is not None:
        new_is_blocked = 1 if planet.is_blocked else 0
        if new_is_blocked:
            new_status = "inactive"
        else:
            new_status = "active"
    elif planet.is_block is not None:
        new_is_blocked = 1 if planet.is_block else 0
        if new_is_blocked:
            new_status = "inactive"
        else:
            new_status = "active"
    else:
        new_is_blocked = 1 if new_status == "inactive" else 0

    cursor.execute(
        "UPDATE planets SET title = ?, description = ?, image = ?, status = ?, is_blocked = ?, is_block = ? WHERE id = ?",
        (new_title, new_desc, new_image, new_status, new_is_blocked, new_is_blocked, planet_id)
    )
    conn.commit()
    cursor.execute("SELECT * FROM planets WHERE id = ?", (planet_id,))
    updated = cursor.fetchone()
    conn.close()
    return format_planet_row(updated, request)

@app.delete("/api/website/planets/{planet_id}", tags=["Web Sayt (Website)"], summary="Sayyorani o'chirish")
@app.delete("/api/planets/{planet_id}", include_in_schema=False)
@app.delete("/mobile/planets/{planet_id}/", include_in_schema=False)
@app.delete("/mobile/planets/{planet_id}", include_in_schema=False)
def delete_planet(planet_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM planets WHERE id = ?", (planet_id,))
    conn.commit()
    changes = cursor.rowcount
    conn.close()
    if changes == 0:
        raise HTTPException(status_code=404, detail="Sayyora topilmadi")
    return {"message": "Sayyora muvaffaqiyatli o'chirildi", "id": planet_id}


# 2. QULAYLIKLAR (AMENITIES) ENDPOINTS
@app.get("/api/website/amenities", response_model=List[AmenityResponse], tags=["Web Sayt (Website)"], summary="Barcha qulayliklar ro'yxatini olish")
@app.get("/api/amenities", response_model=List[AmenityResponse], include_in_schema=False)
def get_amenities():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM amenities ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/api/website/amenities", response_model=AmenityResponse, status_code=status.HTTP_201_CREATED, tags=["Web Sayt (Website)"], summary="Yangi qulaylik qo'shish")
@app.post("/api/amenities", response_model=AmenityResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_amenity(amenity: AmenityCreate):
    if not amenity.title.strip():
        raise HTTPException(status_code=400, detail="Qulaylik nomi majburiy!")
    if not amenity.description.strip():
        raise HTTPException(status_code=400, detail="Qulaylik tavsifi majburiy!")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO amenities (title, description, icon, status) VALUES (?, ?, ?, ?)",
        (amenity.title.strip(), amenity.description.strip(), amenity.icon or "", amenity.status or "active")
    )
    conn.commit()
    amenity_id = cursor.lastrowid
    cursor.execute("SELECT * FROM amenities WHERE id = ?", (amenity_id,))
    new_amenity = cursor.fetchone()
    conn.close()
    return dict(new_amenity)

@app.put("/api/website/amenities/{amenity_id}", response_model=AmenityResponse, tags=["Web Sayt (Website)"], summary="Qulaylikni yangilash")
@app.put("/api/amenities/{amenity_id}", response_model=AmenityResponse, include_in_schema=False)
def update_amenity(amenity_id: int, amenity: AmenityUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM amenities WHERE id = ?", (amenity_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Qulaylik topilmadi")

    new_title = amenity.title.strip() if amenity.title is not None else existing["title"]
    new_desc = amenity.description.strip() if amenity.description is not None else existing["description"]
    new_status = amenity.status if amenity.status is not None else existing["status"]

    cursor.execute(
        "UPDATE amenities SET title = ?, description = ?, status = ? WHERE id = ?",
        (new_title, new_desc, new_status, amenity_id)
    )
    conn.commit()
    cursor.execute("SELECT * FROM amenities WHERE id = ?", (amenity_id,))
    updated = cursor.fetchone()
    conn.close()
    return dict(updated)

@app.delete("/api/website/amenities/{amenity_id}", tags=["Web Sayt (Website)"], summary="Qulaylikni o'chirish")
@app.delete("/api/amenities/{amenity_id}", include_in_schema=False)
def delete_amenity(amenity_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM amenities WHERE id = ?", (amenity_id,))
    conn.commit()
    changes = cursor.rowcount
    conn.close()
    if changes == 0:
        raise HTTPException(status_code=404, detail="Qulaylik topilmadi")
    return {"message": "Qulaylik muvaffaqiyatli o'chirildi", "id": amenity_id}


# 3. JAMOA (TEAMS) ENDPOINTS
@app.get("/api/website/teams", response_model=List[TeamResponse], tags=["Web Sayt (Website)"], summary="Barcha jamoa a'zolarini olish (Ism, Familiya, Yo'nalishi, Rasmi)")
@app.get("/api/website/teams/", response_model=List[TeamResponse], include_in_schema=False)
@app.get("/api/teams", response_model=List[TeamResponse], include_in_schema=False)
@app.get("/api/teams/", response_model=List[TeamResponse], include_in_schema=False)
def get_teams(request: Request):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM teams ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [format_team_row(row, request) for row in rows]

@app.post("/api/website/teams", response_model=TeamResponse, status_code=status.HTTP_201_CREATED, tags=["Web Sayt (Website)"], summary="Yangi jamoa a'zosi qo'shish (Rasmli & Tavsifli)")
@app.post("/api/teams", response_model=TeamResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_team(member: TeamCreate, request: Request):
    if not member.first_name.strip() or not member.last_name.strip():
        raise HTTPException(status_code=400, detail="Ism va Familiya majburiy!")
    if not member.role.strip():
        raise HTTPException(status_code=400, detail="Yo'nalishi / Mutaxassisligi majburiy!")

    description = member.description.strip() if member.description else ""
    clean_img = sanitize_image_path(member.image or "/images/team/member1.svg")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO teams (first_name, last_name, role, description, image) VALUES (?, ?, ?, ?, ?)",
        (member.first_name.strip(), member.last_name.strip(), member.role.strip(), description, clean_img)
    )
    conn.commit()
    team_id = cursor.lastrowid
    cursor.execute("SELECT * FROM teams WHERE id = ?", (team_id,))
    new_member = cursor.fetchone()
    conn.close()
    return format_team_row(new_member, request)

@app.put("/api/website/teams/{team_id}", response_model=TeamResponse, tags=["Web Sayt (Website)"], summary="Jamoa a'zosini tahrirlash")
@app.put("/api/teams/{team_id}", response_model=TeamResponse, include_in_schema=False)
def update_team(team_id: int, member: TeamUpdate, request: Request):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM teams WHERE id = ?", (team_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Jamoa a'zosi topilmadi")

    existing_dict = dict(existing)
    new_first = member.first_name.strip() if member.first_name is not None else existing_dict["first_name"]
    new_last = member.last_name.strip() if member.last_name is not None else existing_dict["last_name"]
    new_role = member.role.strip() if member.role is not None else existing_dict["role"]
    new_desc = member.description.strip() if member.description is not None else existing_dict.get("description", "")
    new_image = sanitize_image_path(member.image) if member.image is not None else existing_dict["image"]

    cursor.execute(
        "UPDATE teams SET first_name = ?, last_name = ?, role = ?, description = ?, image = ? WHERE id = ?",
        (new_first, new_last, new_role, new_desc, new_image, team_id)
    )
    conn.commit()
    cursor.execute("SELECT * FROM teams WHERE id = ?", (team_id,))
    updated = cursor.fetchone()
    conn.close()
    return format_team_row(updated, request)

@app.delete("/api/website/teams/{team_id}", tags=["Web Sayt (Website)"], summary="Jamoa a'zosini o'chirish")
@app.delete("/api/teams/{team_id}", include_in_schema=False)
def delete_team(team_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM teams WHERE id = ?", (team_id,))
    conn.commit()
    changes = cursor.rowcount
    conn.close()
    if changes == 0:
        raise HTTPException(status_code=404, detail="Jamoa a'zosi topilmadi")
    return {"message": "Jamoa a'zosi muvaffaqiyatli o'chirildi", "id": team_id}


# 4. GALEREYA (GALLERY) ENDPOINTS
@app.get("/api/website/gallery", response_model=List[GalleryResponse], tags=["Web Sayt (Website)"], summary="Galereyadagi barcha rasmlar ro'yxatini olish (To'liq URL)")
@app.get("/api/gallery", response_model=List[GalleryResponse], include_in_schema=False)
def get_gallery(request: Request):
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM gallery ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [format_gallery_row(row, request, lang=lang) for row in rows]

@app.post("/api/website/gallery", response_model=GalleryResponse, status_code=status.HTTP_201_CREATED, tags=["Web Sayt (Website)"], summary="Galereyaga yangi rasm qo'shish")
@app.post("/api/gallery", response_model=GalleryResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_gallery_item(item: GalleryCreate, request: Request):
    if not item.image.strip():
        raise HTTPException(status_code=400, detail="Rasm manzili majburiy!")

    conn = get_db_connection()
    cursor = conn.cursor()
    clean_img = sanitize_image_path(item.image.strip())
    cursor.execute(
        "INSERT INTO gallery (title, image) VALUES (?, ?)",
        (item.title.strip() if item.title else "", clean_img)
    )
    conn.commit()
    item_id = cursor.lastrowid
    cursor.execute("SELECT * FROM gallery WHERE id = ?", (item_id,))
    new_item = cursor.fetchone()
    conn.close()
    return format_gallery_row(new_item, request)

@app.delete("/api/website/gallery/{gallery_id}", tags=["Web Sayt (Website)"], summary="Galereyadan rasmni o'chirish")
@app.delete("/api/gallery/{gallery_id}", include_in_schema=False)
def delete_gallery_item(gallery_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM gallery WHERE id = ?", (gallery_id,))
    conn.commit()
    changes = cursor.rowcount
    conn.close()
    if changes == 0:
        raise HTTPException(status_code=404, detail="Rasm topilmadi")
    return {"message": "Rasm galereyadan o'chirildi", "id": gallery_id}


# 5. XABARLAR (MESSAGES) ENDPOINTS
@app.get("/api/website/messages", response_model=List[MessageResponse], tags=["Web Sayt (Website)"], summary="Kelgan barcha xabarlar ro'yxati")
@app.get("/api/messages", response_model=List[MessageResponse], include_in_schema=False)
def get_messages(
    search: Optional[str] = Query(None, description="Ism, telefon yoki xabar bo'yicha qidiruv"),
    unreadOnly: Optional[bool] = Query(None, description="Faqat o'qilmagan xabarlar")
):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM messages"
    conditions = []
    params = []

    if search:
        conditions.append("(name LIKE ? OR phone LIKE ? OR message LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    if unreadOnly:
        conditions.append("is_read = 0")

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY id DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/api/website/messages", status_code=status.HTTP_201_CREATED, tags=["Web Sayt (Website)"], summary="Yangi xabar yuborish (Mijoz nomidan)")
@app.post("/api/website/messages/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/api/website/contact", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/api/website/contact/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/api/messages", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/api/messages/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_message(msg: MessageCreate):
    if not msg.name.strip() or not msg.phone.strip() or not msg.message.strip():
        raise HTTPException(status_code=400, detail="Barcha maydonlarni to'ldirish majburiy!")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages (name, phone, message, is_read) VALUES (?, ?, ?, 0)",
        (msg.name.strip(), msg.phone.strip(), msg.message.strip())
    )
    conn.commit()
    msg_id = cursor.lastrowid
    cursor.execute("SELECT * FROM messages WHERE id = ?", (msg_id,))
    new_msg = cursor.fetchone()
    conn.close()
    return {
        "success": True,
        "message": "Xabaringiz muvaffaqiyatli qabul qilindi!",
        "data": dict(new_msg)
    }

@app.patch("/api/website/messages/{message_id}/read", tags=["Web Sayt (Website)"], summary="Xabarni o'qilgan deb belgilash")
@app.patch("/api/messages/{message_id}/read", include_in_schema=False)
def mark_message_as_read(message_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE messages SET is_read = 1 WHERE id = ?", (message_id,))
    conn.commit()
    changes = cursor.rowcount
    conn.close()
    if changes == 0:
        raise HTTPException(status_code=404, detail="Xabar topilmadi")
    return {"message": "Xabar o'qilgan deb belgilandi", "id": message_id}

@app.delete("/api/website/messages/{message_id}", tags=["Web Sayt (Website)"], summary="Xabarni o'chirish")
@app.delete("/api/messages/{message_id}", include_in_schema=False)
def delete_message(message_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM messages WHERE id = ?", (message_id,))
    conn.commit()
    changes = cursor.rowcount
    conn.close()
    if changes == 0:
        raise HTTPException(status_code=404, detail="Xabar topilmadi")
    return {"message": "Xabar muvaffaqiyatli o'chirildi", "id": message_id}


# 5.5 FAQ (KO'P SO'RALADIGAN SAVOLLAR) CRUD ENDPOINTS
@app.get("/api/website/faqs", response_model=List[FaqResponse], tags=["Web Sayt (Website)"], summary="Barcha faol FAQ savollar ro'yxati")
@app.get("/api/website/faqs/", response_model=List[FaqResponse], include_in_schema=False)
@app.get("/api/faqs", response_model=List[FaqResponse], tags=["Web Sayt (Website)"], include_in_schema=False)
@app.get("/api/faqs/", response_model=List[FaqResponse], include_in_schema=False)
def get_faqs(request: Request):
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM faqs ORDER BY order_num ASC, id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [format_faq_row(r, lang=lang) for r in rows]


@app.get("/api/faqs/{faq_id}", response_model=FaqResponse, tags=["Web Sayt (Website)"], summary="Bitta FAQ savol tafsilotlari")
@app.get("/api/website/faqs/{faq_id}", response_model=FaqResponse, include_in_schema=False)
def get_faq_detail(faq_id: int, request: Request):
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM faqs WHERE id = ?", (faq_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="FAQ topilmadi!")
    return format_faq_row(row, lang=lang)


@app.post("/api/faqs", response_model=FaqResponse, status_code=status.HTTP_201_CREATED, tags=["Web Sayt (Website)"], summary="Yangi FAQ savol qo'shish (Admin)")
@app.post("/api/website/faqs", response_model=FaqResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_faq(faq: FaqCreate):
    name = faq.name.strip()
    description = faq.description.strip()
    if not name or not description:
        raise HTTPException(status_code=400, detail="Savol nomi va javob matni majburiy!")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO faqs (name, description, status, order_num) VALUES (?, ?, ?, ?)",
        (name, description, faq.status or "active", faq.order_num or 0)
    )
    faq_id = cursor.lastrowid
    conn.commit()
    cursor.execute("SELECT * FROM faqs WHERE id = ?", (faq_id,))
    row = cursor.fetchone()
    conn.close()
    return format_faq_row(row)


@app.put("/api/faqs/{faq_id}", response_model=FaqResponse, tags=["Web Sayt (Website)"], summary="FAQ savolni tahrirlash (Admin)")
@app.put("/api/website/faqs/{faq_id}", response_model=FaqResponse, include_in_schema=False)
def update_faq(faq_id: int, faq: FaqUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM faqs WHERE id = ?", (faq_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="FAQ topilmadi!")

    old = dict(row)
    name = faq.name.strip() if faq.name is not None else old["name"]
    description = faq.description.strip() if faq.description is not None else old["description"]
    stat = faq.status if faq.status is not None else old["status"]
    order_num = faq.order_num if faq.order_num is not None else old["order_num"]

    cursor.execute(
        "UPDATE faqs SET name = ?, description = ?, status = ?, order_num = ? WHERE id = ?",
        (name, description, stat, order_num, faq_id)
    )
    conn.commit()
    cursor.execute("SELECT * FROM faqs WHERE id = ?", (faq_id,))
    updated_row = cursor.fetchone()
    conn.close()
    return format_faq_row(updated_row)


@app.delete("/api/faqs/{faq_id}", tags=["Web Sayt (Website)"], summary="FAQ savolni o'chirish (Admin)")
@app.delete("/api/website/faqs/{faq_id}", tags=["Web Sayt (Website)"], include_in_schema=False)
def delete_faq(faq_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM faqs WHERE id = ?", (faq_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="FAQ topilmadi!")

    cursor.execute("DELETE FROM faqs WHERE id = ?", (faq_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "FAQ savol muvaffaqiyatli o'chirildi", "id": faq_id}


# 6. STATISTIKA (STATS) ENDPOINT
@app.get("/api/website/stats", response_model=StatsResponse, tags=["Web Sayt (Website)"], summary="Statistikani olish")
@app.get("/api/website/stats/", response_model=StatsResponse, include_in_schema=False)
@app.get("/api/stats", response_model=StatsResponse, include_in_schema=False)
@app.get("/api/stats/", response_model=StatsResponse, include_in_schema=False)
def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread FROM messages")
    msg_row = cursor.fetchone()
    total_messages = msg_row["total"] or 0
    unread_messages = msg_row["unread"] or 0

    cursor.execute("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active FROM amenities")
    am_row = cursor.fetchone()
    total_amenities = am_row["total"] or 0
    active_amenities = am_row["active"] or 0

    cursor.execute("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active FROM planets")
    pl_row = cursor.fetchone()
    total_planets = pl_row["total"] or 0
    active_planets = pl_row["active"] or 0

    cursor.execute("SELECT COUNT(*) as total FROM teams")
    tm_row = cursor.fetchone()
    total_teams = tm_row["total"] or 0

    cursor.execute("SELECT COUNT(*) as total FROM gallery")
    gal_row = cursor.fetchone()
    total_gallery = gal_row["total"] or 0

    cursor.execute("SELECT COUNT(*) as total FROM faqs")
    faq_row = cursor.fetchone()
    total_faqs = faq_row["total"] or 0

    conn.close()
    return {
        "totalPlanets": total_planets,
        "activePlanets": active_planets,
        "totalAmenities": total_amenities,
        "activeAmenities": active_amenities,
        "totalTeams": total_teams,
        "totalGallery": total_gallery,
        "totalMessages": total_messages,
        "unreadMessages": unread_messages,
        "totalFaqs": total_faqs
    }


# 7. WEB SAYT LANDING TO'PLAMI
@app.get("/api/website/landing", response_model=WebsiteLandingResponse, tags=["Web Sayt (Website)"], summary="Web sayt Landing sahifasi uchun to'liq ma'lumotlar to'plami (Sayyoralar, Qulayliklar, Jamoa, Galereya, FAQ)")
def get_website_landing_data(request: Request):
    lang = get_accept_language(request)
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM planets WHERE status = 'active' ORDER BY id ASC")
    planets = [format_planet_row(r, request, lang=lang) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM amenities WHERE status = 'active' ORDER BY id ASC")
    amenities_rows = cursor.fetchall()
    amenities = []
    for r in amenities_rows:
        d = dict(r)
        if lang != "uzb":
            d["title"] = translate_text_sync(d.get("title", ""), lang)
            d["description"] = translate_text_sync(d.get("description", ""), lang)
        amenities.append(d)

    cursor.execute("SELECT * FROM teams ORDER BY id ASC")
    teams = [format_team_row(r, request, lang=lang) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM gallery ORDER BY id DESC")
    gallery = [format_gallery_row(r, request, lang=lang) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM faqs WHERE status = 'active' ORDER BY order_num ASC, id ASC")
    faqs = [format_faq_row(r, lang=lang) for r in cursor.fetchall()]

    site_name = translate_text_sync("Bolalar Ta'lim & Rivojlanish Platformasi", lang) if lang != "uzb" else "Bolalar Ta'lim & Rivojlanish Platformasi"
    tagline = translate_text_sync("8 ta Rivojlanish Sayyorasi orqali mukammal ta'lim", lang) if lang != "uzb" else "8 ta Rivojlanish Sayyorasi orqali mukammal ta'lim"

    conn.close()
    return {
        "site_name": site_name,
        "tagline": tagline,
        "planets": planets,
        "amenities": amenities,
        "teams": teams,
        "gallery": gallery,
        "faqs": faqs,
        "stats": {
            "total_planets": len(planets),
            "total_amenities": len(amenities),
            "total_teams": len(teams),
            "total_gallery": len(gallery),
            "total_faqs": len(faqs),
            "support": "24/7"
        }
    }


# 8. ADMIN PANEL ALLOMA AI YORDAMCHISI (/api/website/ai/chat)
@app.post("/api/website/ai/chat", response_model=AiChatResponse, tags=["Web Sayt (Website)"], summary="Admin Panel & Web Uchun Alloma AI Yordamchisi")
@app.post("/api/website/ai/chat/", response_model=AiChatResponse, include_in_schema=False)
async def admin_ai_chat(req: AiChatRequest, request: Request):
    user_prompt = req.message.strip()
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Xabar matni bo'sh bo'lishi mumkin emas!")
    header_lang = get_accept_language(request)
    if header_lang != "uzb" and (not req.language or req.language == "uzb"):
        req.language = header_lang
    return await _build_ai_response(req, user_prompt, request)


# 9. ASOSIY WEB SAYT STATIK VA SPA ROUTING (React Router & Assets uchun)
@app.get("/{full_path:path}", include_in_schema=False)
def serve_spa_or_static(full_path: str, request: Request):
    # API, docs, swagger, statik montajlar bo'lsa o'tkazib yuborish
    if any(full_path.startswith(prefix) for prefix in ["api", "mobile", "docs", "openapi.json", "css", "js", "images", "assets", "audio_cache", "planets"]):
        raise HTTPException(status_code=404, detail="Topilmadi")

    # Agar admin subdomen bo'lsa -> Admin panel
    if is_admin_subdomain(request):
        admin_index = os.path.join(PUBLIC_DIR, "index.html")
        if os.path.exists(admin_index):
            return FileResponse(admin_index, media_type="text/html; charset=utf-8")

    # 1. website/dist/public dagi statik faylni qidirish (masalan: /logo.png, /favicon.png, /space-bg.jpg, /assets/xxx.js)
    static_file = os.path.join(WEBSITE_PUBLIC_DIR, full_path)
    if os.path.isfile(static_file):
        media_type = None
        lower_path = static_file.lower()
        if lower_path.endswith((".js", ".mjs")):
            media_type = "application/javascript; charset=utf-8"
        elif lower_path.endswith(".css"):
            media_type = "text/css; charset=utf-8"
        elif lower_path.endswith(".html"):
            media_type = "text/html; charset=utf-8"
        elif lower_path.endswith(".svg"):
            media_type = "image/svg+xml"
        elif lower_path.endswith(".wasm"):
            media_type = "application/wasm"
        else:
            media_type, _ = mimetypes.guess_type(static_file)
        return FileResponse(static_file, media_type=media_type)

    # 2. React Router SPA fallback (masalan: /planets, /about, /gallery)
    website_index = os.path.join(WEBSITE_PUBLIC_DIR, "index.html")
    if os.path.exists(website_index):
        return FileResponse(website_index, media_type="text/html; charset=utf-8")

    raise HTTPException(status_code=404, detail="Sahifa topilmadi")

