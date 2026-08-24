import { apiClient } from './client';
import * as T from './types';

export const parentService = {
  // 6. Ota-ona Profili va Bolalari Ro'yxatini Olish
  getProfile: async () => {
    const response = await apiClient.get<T.ParentProfileResponse>('/api/website/parent/profile/');
    return response.data;
  },

  // 7. Ota-ona Panelidan 4-Xonali Parolni O'zgartirish
  changePasscode: async (data: T.ChangePasscodeRequest) => {
    const response = await apiClient.post<T.ChangePasscodeResponse>('/api/website/parent/change-passcode/', data);
    return response.data;
  }
};
