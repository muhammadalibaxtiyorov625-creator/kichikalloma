from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
import re

# ==========================================
# SAYYORALAR (PLANETS) SCHEMAS
# ==========================================
class PlanetBase(BaseModel):
    title: Optional[str] = Field(None, example="Kognitiv", description="Sayyora nomi (title)")
    name: Optional[str] = Field(None, example="Kognitiv", description="Sayyora nomi (name)")
    description: Optional[str] = Field("", example="Fikrlash, o'rganish va muammo yechish.", description="Sayyora vazifasi va tavsifi")
    image: Optional[str] = Field("/images/planets/earth.svg", example="/images/planets/earth.svg", description="Sayyora rasmining URL manzili")
    status: Optional[str] = Field("active", example="active", description="Sayyora holati ('active' yoki 'inactive')")
    is_blocked: Optional[bool] = Field(False, example=False, description="Sayyora bloklanganmi (True/False)")
    is_block: Optional[bool] = Field(False, example=False, description="Sayyora bloklanganmi (is_blocked bilan bir xil)")

class PlanetCreate(PlanetBase):
    pass

class PlanetUpdate(BaseModel):
    title: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    status: Optional[str] = None
    is_blocked: Optional[bool] = None
    is_block: Optional[bool] = None

class PlanetResponse(PlanetBase):
    id: int
    created_at: str
    ai_intro: Optional[str] = Field(None, example="Salom! Sen Kognitiv sayyorasidasan. Bu yerda aqliy jumboqlarni yechamiz. 🧠", description="Sayyora haqida Alloma AI ning ovozli tushuntirish matni")
    audio_url: Optional[str] = Field(None, example="http://localhost:3009/audio_cache/abc123.mp3", description="Alloma AI ning ushbu sayyora uchun tayyor ovozli MP3 audio havolasi")

# ==========================================
# QULAYLIKLAR (AMENITIES) SCHEMAS
# ==========================================
class AmenityBase(BaseModel):
    title: str = Field(..., example="Ota-ona nazorati", description="Qulaylik nomi")
    description: Optional[str] = Field("", example="Farzandingizning kunlik va haftalik faolligini kuzatib boring.", description="Qulaylik tavsifi")
    status: Optional[str] = Field("active", example="active", description="Qulaylik holati")

class AmenityCreate(AmenityBase):
    pass

class AmenityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class AmenityResponse(AmenityBase):
    id: int
    icon: Optional[str] = ""
    created_at: str

# ==========================================
# JAMOA A'ZOLARI (TEAMS) SCHEMAS
# ==========================================
class TeamBase(BaseModel):
    first_name: str = Field(..., example="Aziz", description="Jamoa a'zosi ismi")
    last_name: str = Field(..., example="Rahimov", description="Jamoa a'zosi familiyasi")
    role: str = Field(..., example="Bosh Ta'lim Metodisti", description="Yo'nalishi / Mutaxassisligi / Kasbi")
    description: Optional[str] = Field("", example="Bolalar ta'limi va metodikasi bo'yicha yetakchi mutaxassis.", description="Jamoa a'zosi tavsifi / ma'lumoti (Description)")
    image: Optional[str] = Field("http://localhost:3009/images/team/member1.svg", example="http://localhost:3009/images/team/member1.svg", description="Jamoa a'zosi rasmining to'liq URL manzili")

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None

class TeamResponse(TeamBase):
    id: int
    full_name: str = Field(..., example="Aziz Rahimov", description="To'liq ismi va familiyasi")
    created_at: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    direction: Optional[str] = None

# ==========================================
# GALEREYA (GALLERY) SCHEMAS (FAQAT RASMLAR RO'YXATI)
# ==========================================
class GalleryBase(BaseModel):
    image: str = Field(..., example="http://localhost:3009/images/gallery/photo1.svg", description="Galereya rasmining to'liq URL manzili")
    title: Optional[str] = Field("", example="Dars jarayoni", description="Rasm sarlavhasi yoki tavsifi (ixtiyoriy)")

class GalleryCreate(GalleryBase):
    pass

class GalleryResponse(GalleryBase):
    id: int
    created_at: str

# ==========================================
# XABARLAR (MESSAGES) SCHEMAS
# ==========================================
class MessageCreate(BaseModel):
    name: str = Field(..., example="Anvar Qodirov", description="Mijozning ismi")
    phone: str = Field(..., example="+998 90 123 45 67", description="Mijozning telefon raqami")
    message: str = Field(..., example="Farzandim uchun ta'lim dasturlari bo'yicha ma'lumot olmoqchi edim.", description="Murojaat matni")

class MessageResponse(BaseModel):
    id: int
    name: str
    phone: str
    message: str
    is_read: int
    created_at: str

# ==========================================
# FAQ (KO'P SO'RALADIGAN SAVOLLAR) SCHEMAS
# ==========================================
class FaqCreate(BaseModel):
    name: str = Field(..., example="Kichik Alloma nima?", description="Savol yoki FAQ sarlavhasi")
    description: str = Field(..., example="Kichik Alloma — bu bolalar uchun mo'ljallangan interaktiv ta'lim platformasi.", description="Javob yoki tavsif")
    status: Optional[str] = Field("active", example="active", description="'active' yoki 'inactive'")
    order_num: Optional[int] = Field(0, example=1, description="Tartib raqami")

class FaqUpdate(BaseModel):
    name: Optional[str] = Field(None, example="Kichik Alloma nima?")
    description: Optional[str] = Field(None, example="Yangi tavsif...")
    status: Optional[str] = Field(None, example="active")
    order_num: Optional[int] = Field(None, example=1)

class FaqResponse(BaseModel):
    id: int
    name: str
    description: str
    title: Optional[str] = None
    answer: Optional[str] = None
    status: str = "active"
    order_num: int = 0
    created_at: str

# ==========================================
# STATISTIKA (STATS) SCHEMA
# ==========================================
class StatsResponse(BaseModel):
    totalPlanets: int = Field(..., example=8)
    activePlanets: int = Field(..., example=8)
    totalAmenities: int = Field(..., example=5)
    activeAmenities: int = Field(..., example=5)
    totalTeams: int = Field(..., example=4)
    totalGallery: int = Field(..., example=4)
    totalMessages: int = Field(..., example=4)
    unreadMessages: int = Field(..., example=3)
    totalFaqs: int = Field(0, example=4)

# ==========================================
# WEB SAYT (WEBSITE) LANDING SCHEMA
# ==========================================
class WebsiteLandingResponse(BaseModel):
    site_name: str = Field("Bolalar Ta'lim & Rivojlanish Platformasi", example="Bolalar Ta'lim Platformasi")
    tagline: str = Field("8 ta Rivojlanish Sayyorasi orqali mukammal ta'lim", example="8 ta Rivojlanish Sayyorasi")
    planets: List[PlanetResponse]
    amenities: List[AmenityResponse]
    teams: List[TeamResponse]
    gallery: List[GalleryResponse]
    faqs: Optional[List[FaqResponse]] = []
    stats: Dict[str, Any]

# ==========================================
# MOBIL AUTH & FARZANDLAR (MOBILE API SCHEMAS)
# ==========================================

class SendOtpRequest(BaseModel):
    phone: str = Field(..., example="+998934472477", description="Foydalanuvchi telefon raqami (+998934472477 formatda)")

class VerifyOtpRequest(BaseModel):
    phone: str = Field(..., example="+998934472477", description="Foydalanuvchi telefon raqami")
    code: str = Field(..., example="9283", description="4 xonali SMS tasdiqlash kodi")

class VerifyOtpResponse(BaseModel):
    access_token: str = Field(..., description="JWT autentifikatsiya tokeni")
    token_type: str = Field("bearer", description="Token turi")
    is_new_user: bool = Field(..., description="Yangi foydalanuvchi bo'lsa True, mavjud bo'lsa False")
    message: str = Field("Muvaffaqiyatli tasdiqlandi", description="Javob xabari")

class CodeAccessRequest(BaseModel):
    code: str = Field(..., example="2345", description="4 xonali maxfiy kirish kodi / PIN")

class ChangePasscodeRequest(BaseModel):
    current_passcode: str = Field(..., example="1234", description="Joriy 4 xonali kirish kodi")
    new_passcode: str = Field(..., example="5678", description="Yangi 4 xonali kirish kodi")
    confirm_passcode: str = Field(..., example="5678", description="Yangi 4 xonali kirish kodini tasdiqlash")

    @validator('current_passcode', 'new_passcode', 'confirm_passcode')
    def validate_pin_format(cls, v):
        clean = v.strip()
        if not clean.isdigit() or len(clean) != 4:
            raise ValueError("Parol aniq 4 ta raqamdan iborat bo'lishi kerak!")
        return clean

# ==========================================
# TIL (LANGUAGE) SCHEMAS
# ==========================================
class LanguageOption(BaseModel):
    code: str = Field(..., example="uzb", description="Til kodi: 'uzb', 'rus', 'eng'")
    name: str = Field(..., example="O'zbek tili", description="Til nomi")
    native_name: str = Field(..., example="O'zbekcha", description="Asl nomi")
    flag: str = Field(..., example="🇺🇿", description="Bayroq belgisi")

class SetLanguageRequest(BaseModel):
    language: str = Field(..., example="uzb", description="Tanlangan til: 'uzb' (O'zbek), 'rus' (Rus), 'eng' (Ingliz)")

    @validator('language')
    def validate_language(cls, v):
        clean_v = v.strip().lower()
        if clean_v in ['uz', 'uzb', "o'zbek", "uzbek"]:
            return 'uzb'
        elif clean_v in ['ru', 'rus', 'русский', 'russian']:
            return 'rus'
        elif clean_v in ['en', 'eng', 'english', 'ingliz']:
            return 'eng'
        raise ValueError("Noto'g'ri til! Faqat 'uzb', 'rus' yoki 'eng' qabul qilinadi.")

class AddChildRequest(BaseModel):
    name: str = Field(..., example="Ali", description="Farzand ismi")
    surname: str = Field(..., example="Valiyev", description="Farzand familiyasi")
    year: str = Field(..., example="15/08/2018", description="Tug'ilgan sana (DD/MM/YYYY formatda) yoki tug'ilgan yil")
    gender: str = Field(..., example="male", description="Farzand jinsi: 'male' (o'g'il) yoki 'female' (qiz)")


class UpdateChildProfileRequest(BaseModel):
    name: Optional[str] = Field(None, example="Ali", description="Farzand ismi")
    surname: Optional[str] = Field(None, example="Valiyev", description="Farzand familiyasi")
    year: Optional[str] = Field(None, example="15/08/2018", description="Tug'ilgan sana (DD/MM/YYYY formatda)")
    gender: Optional[str] = Field(None, example="male", description="Farzand jinsi (male/female)")
    language: Optional[str] = Field(None, example="uzb", description="Tanlangan til: 'uzb', 'rus', 'eng'")
    avatar: Optional[str] = Field(None, example="/images/avatars/boy1.png", description="Profil rasmi")

    @validator('language')
    def validate_child_language(cls, v):
        if v:
            clean_v = v.strip().lower()
            if clean_v in ['uz', 'uzb']:
                return 'uzb'
            elif clean_v in ['ru', 'rus']:
                return 'rus'
            elif clean_v in ['en', 'eng']:
                return 'eng'
            raise ValueError("Til faqat 'uzb', 'rus' yoki 'eng' bo'lishi kerak!")
        return v

class ChildResponse(BaseModel):
    id: int
    user_id: int
    name: str
    surname: str
    year: str
    gender: str
    age: Optional[int] = Field(7, description="Farzandning yoshi (avtomatik hisoblangan)")
    gender_label: Optional[str] = Field("O'g'il bola", description="O'zbekcha jins nomi: 'O'g'il bola' yoki 'Qiz bola'")
    language: str = "uzb"
    avatar: Optional[str] = "/images/avatars/boy1.png"
    created_at: str

class ParentProfileResponse(BaseModel):
    user_id: int
    phone: str
    has_passcode: bool = Field(True, description="Foydalanuvchi 4 xonali parol o'rnatganmi")
    children_count: int
    children: List[ChildResponse]

# ==========================================
# VAQT VA FAOLLIK STATISTIKASI SCHEMAS
# ==========================================
class TrackTimeRequest(BaseModel):
    minutes: int = Field(1, example=5, description="AI da foydalanilgan vaqt (daqiqalarda)")
    planet_id: Optional[int] = Field(42, example=42, description="Sayyora ID si")

class ChildActivityStatsResponse(BaseModel):
    child_id: int
    child_name: str
    daily: Dict[str, Any] = Field(..., description="Bugungi kunlik faollik statistikasi")
    weekly: Dict[str, Any] = Field(..., description="Joriy haftalik (Dush-Yak) faollik statistikasi")
    monthly: Dict[str, Any] = Field(..., description="Oylik jami faollik statistikasi")
    favorite_planet: Optional[Dict[str, Any]] = Field(None, description="Eng ko'p kirilgan sevimli sayyora")

# ==========================================
# AI INTEGRATSIYASI (GEMINI AI SCHEMAS)
# ==========================================
class ChatHistoryItem(BaseModel):
    role: str = Field("user", example="user", description="Xabar egasi: 'user' yoki 'model'")
    content: str = Field(..., example="5+5 nechi?", description="Xabar matni")

class AiChatHistoryItemResponse(BaseModel):
    id: int
    role: str = Field(..., description="'user' yoki 'model'")
    message: str
    audio_url: Optional[str] = None
    planet_id: Optional[int] = None
    planet_name: Optional[str] = None
    created_at: str

class AiChatRequest(BaseModel):
    message: str = Field(..., example="5 + 5 nechi bo'ladi?", description="Foydalanuvchi yoki bolaning AI ga savoli")
    child_id: Optional[int] = Field(None, example=1, description="Farzand ID si (tarix va statistika uchun)")
    history: Optional[List[ChatHistoryItem]] = Field(default=[], description="Oldingi suhbat tarixi")
    child_name: Optional[str] = Field(None, example="Ali", description="Farzand ismi (ixtiyoriy)")
    child_age: Optional[int] = Field(None, example=6, description="Farzand yoshi (ixtiyoriy)")
    planet_id: Optional[int] = Field(None, example=42, description="Sayyora ID raqami (Masalan: 42 - Kognitiv, 43 - Jismoniy, 44 - Nutq va til)")
    planet_name: Optional[str] = Field(None, example="Kognitiv", description="Sayyora nomi")
    language: Optional[str] = Field("uzb", example="uzb", description="Ovoz va javob tili: 'uzb', 'rus', 'eng'")

class AiChatResponse(BaseModel):
    success: bool = True
    message: str = "AI javobi muvaffaqiyatli olindi"
    response: str = Field(..., description="Bolalar uchun moslashtirilgan qiziqarli, qisqa va muloyim AI javobi")
    model_used: str = "gemini-3.6-flash"
    planet_id: Optional[int] = None
    planet_name: Optional[str] = None
    audio_url: Optional[str] = Field(None, description="Haqiqiy o'g'il bola Microsoft Neural HD audio havolasi (MP3)")

class AiTtsRequest(BaseModel):
    text: str = Field(..., example="Salom!", description="Ovozga aylantiriladigan matn")
    language: Optional[str] = Field("uzb", example="uzb", description="'uzb' (Sardor), 'rus' (Dmitry), 'eng' (Guy)")

class AiVoiceChatResponse(BaseModel):
    success: bool = True
    message: str = "Ovozli xabar muvaffaqiyatli tahlil qilindi va AI javob qaytardi"
    transcription: str = Field(..., description="Bola aytgan ovozli gapning aniq matni (STT)")
    response: str = Field(..., description="Alloma AI ning bolalar uchun moslashtirilgan javobi")
    audio_url: Optional[str] = Field(None, description="AI ning Microsoft Neural HD ovozli javobi (MP3)")
    planet_id: Optional[int] = None
    planet_name: Optional[str] = None
    language: Optional[str] = "uzb"
    model_used: str = "gemini-3.6-flash"

class AiSttResponse(BaseModel):
    success: bool = True
    text: str = Field(..., description="Ovozdan ajratib olingan aniq matn")
    language: Optional[str] = "uzb"

# ==========================================
# NEPTUNE / EMOTIONS SCHEMAS (EMOTSIYALAR VA KAYFIYAT)
# ==========================================
class EmotionOption(BaseModel):
    key: str = Field(..., example="happy", description="Emotsiya kaliti (masalan: happy, calm, excited, tired, sad, angry, scared, surprised, proud)")
    name: str = Field(..., example="Xursand", description="Emotsiya nomi")
    emoji: str = Field(..., example="😊", description="Emotsiya emojisi")
    color: str = Field(..., example="#FFD166", description="Emotsiya foni/rangi HEX")
    description: str = Field(..., example="Quvnoq va xushchaqchaq kayfiyat", description="Emotsiya tavsifi")

class RecordEmotionRequest(BaseModel):
    child_id: int = Field(..., example=1, description="Farzand ID raqami")
    emotion_key: str = Field(..., example="happy", description="Tanlangan emotsiya kaliti (happy, calm, excited, tired, sad, angry, scared, surprised, proud)")
    emoji: Optional[str] = Field(None, example="😊", description="Emoji (agar berilmasa, kalitdan olinadi)")
    intensity: Optional[int] = Field(3, ge=1, le=5, example=3, description="His qilish darajasi (1 dan 5 gacha)")
    note: Optional[str] = Field("", example="Bugun maktabda '5' baho oldim!", description="Bola yozgan sabab yoki izoh")
    date: Optional[str] = Field(None, example="2026-08-26", description="Sana (YYYY-MM-DD), berilmasa bugungi sana")
    time: Optional[str] = Field(None, example="14:30:00", description="Vaqt (HH:MM:SS), berilmasa hozirgi vaqt")

class EmotionItemResponse(BaseModel):
    id: int
    child_id: int
    child_name: Optional[str] = None
    emotion_key: str
    emotion_name: str
    emoji: str
    color: str = "#4FACFE"
    intensity: int = 3
    note: str = ""
    date: str
    time: str
    day_name: Optional[str] = None
    created_at: str

class WeeklyChildEmotionsResponse(BaseModel):
    success: bool = True
    child_id: int
    child_name: str
    period: str = "last_7_days"
    total_records: int
    dominant_emotion: Optional[str] = None
    dominant_emoji: Optional[str] = None
    emotions: List[EmotionItemResponse]
    daily_summary: List[dict]

class ParentChildEmotionsAnalyticsResponse(BaseModel):
    success: bool = True
    child_id: int
    child_name: str
    total_history_count: int
    last_7_days_count: int
    dominant_emotion: Optional[str] = None
    dominant_emoji: Optional[str] = None
    emotion_distribution: List[dict]
    weekly_emotions: List[EmotionItemResponse]
    all_history: List[EmotionItemResponse]
    ai_recommendation: Optional[str] = None
