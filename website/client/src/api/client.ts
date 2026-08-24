import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// Define the base URL, defaulting to bo'sh satr (shu saytning o'zidan so'rov ketishi va Vite proxy ishlashi uchun)
// Agar backend alohida domenda bo'lsa, .env faylida VITE_API_URL qilib berish mumkin.
const BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

// Create Axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get token
export const getAuthToken = () => localStorage.getItem('access_token');
export const setAuthToken = (token: string) => localStorage.setItem('access_token', token);
export const removeAuthToken = () => localStorage.removeItem('access_token');

// Request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    // Check if error response has a specific detail message (e.g. from FastAPI)
    const errorMessage = error.response?.data?.detail || "Xatolik yuz berdi. Iltimos qayta urinib ko'ring.";
    
    // Handle 400 and 401 errors nicely
    if (error.response?.status === 400 || error.response?.status === 401) {
      toast.error(errorMessage);
    } else if (error.response?.status === 403) {
      toast.error("Ruxsat etilmagan amal (403)");
    } else if (error.response?.status === 500) {
      toast.error("Server xatosi (500)");
    } else if (!error.response) {
      toast.error("Tarmoq xatosi, internet aloqasini tekshiring.");
    }
    
    // If it's a 401 Unauthorized, we might want to log the user out
    if (error.response?.status === 401) {
      removeAuthToken();
      // Optional: window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
