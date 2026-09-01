// --- Auth Types ---
export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  phone: string;
  code: string; // Typically this shouldn't be in response for production, but as per spec it's here
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface VerifyOtpResponse {
  access_token: string;
  token_type: string;
  is_new_user: boolean;
  message: string;
}

export interface CodeAccessRequest {
  code: string;
}

export interface CodeAccessResponse {
  success: boolean;
  valid: boolean;
  is_new_user: boolean;
  child_id?: number;
  child?: Child;
  children?: Child[];
}

// --- Parent & Children Types ---
export interface Child {
  id: number;
  name: string;
  surname: string;
  year: string;
  gender: string;
  age: number;
  gender_label: string;
  language: string;
  avatar: string;
}

export interface ParentProfileResponse {
  user_id: number;
  phone: string;
  has_passcode: boolean;
  children_count: number;
  children: Child[];
}

export interface ChangePasscodeRequest {
  current_passcode: string;
  new_passcode: string;
  confirm_passcode: string;
}

export interface ChangePasscodeResponse {
  success: boolean;
  message: string;
  passcode: string;
  children: Child[];
}

export interface AddChildRequest {
  name: string;
  surname: string;
  year: string;
  gender: string;
}

export interface AddChildResponse {
  success: boolean;
  message: string;
  child: Child;
}

export interface UpdateChildRequest {
  name: string;
  surname: string;
  year: string;
  gender: string;
  language: string;
  avatar: string;
}

export interface SetLanguageRequest {
  language: string;
}

// --- Planets Types ---
export interface Planet {
  id: number;
  title: string;
  description: string;
  image: string;
  status: string;
  is_blocked: boolean;
  ai_intro: string;
  audio_url: string;
}

// --- AI Chat Types ---
export interface AiChatRequest {
  message: string;
  child_id: number;
  child_name: string;
  child_age: number;
  planet_id: number;
  language: string;
  history: AiHistoryMessage[];
}

export interface AiChatResponse {
  success: boolean;
  response: string;
  model_used: string;
  planet_id: number;
  planet_name: string;
  audio_url: string;
}

export interface TtsRequest {
  text: string;
  language: string;
}

export interface TtsResponse {
  success: boolean;
  audio_url: string;
}

// --- Stats Types ---
export interface AiHistoryMessage {
  id: number;
  role: 'user' | 'model';
  message: string;
  audio_url: string | null;
  planet_name: string;
  created_at: string;
}

export interface ChildActivityStatsResponse {
  child_id: number;
  child_name: string;
  daily: {
    date: string;
    minutes: number;
    messages: number;
    formatted: string;
  };
  weekly: {
    total_minutes: number;
    total_hours: string;
    total_messages: number;
    avg_daily_minutes: number;
    days: Array<{
      day: string;
      date: string;
      minutes: number;
      messages: number;
      is_today: boolean;
    }>;
  };
  monthly: {
    month: string;
    total_minutes: number;
    total_hours: string;
    active_days: number;
  };
  favorite_planet: {
    id: number;
    name: string;
    icon: string;
    minutes_spent: number;
  };
}

export interface TrackTimeRequest {
  minutes: number;
  planet_id: number;
}

// --- FAQ Types ---
export interface Faq {
  id: number;
  name: string;
  description: string;
  status: string;
  order_num: number;
}

// --- Team Types ---
export interface Team {
  id: number;
  firstName: string;
  lastName: string;
  direction: string;
  description: string;
  image: string | null;
}
