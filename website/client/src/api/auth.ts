import { apiClient, setAuthToken } from './client';
import * as T from './types';

export const authService = {
  // 1. SMS Kod Yuborish
  sendOtp: async (data: T.SendOtpRequest) => {
    const response = await apiClient.post<T.SendOtpResponse>('/api/website/send-otp/', data);
    return response.data;
  },

  // 2. SMS Kodni Tasdiqlash va Token Olish
  verifyOtp: async (data: T.VerifyOtpRequest) => {
    const response = await apiClient.post<T.VerifyOtpResponse>('/api/website/verify-otp/', data);
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    return response.data;
  },

  // 3. SMS Kodni Qayta Yuborish
  resendOtp: async (data: T.SendOtpRequest) => {
    const response = await apiClient.post<T.SendOtpResponse>('/api/website/resent-otp/', data);
    return response.data;
  },

  // 4. 4-Xonali PIN / Kirish Kodini Tekshirish yoki Saqlash
  verifyPinCode: async (data: T.CodeAccessRequest) => {
    const response = await apiClient.post<T.CodeAccessResponse>('/api/website/code-access/', data);
    return response.data;
  },

  // 5. Random Parolni SMS Orqali Qayta Olish
  regenerateCode: async () => {
    const response = await apiClient.post('/api/website/code-re-generate/');
    return response.data;
  }
};
