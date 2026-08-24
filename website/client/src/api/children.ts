import { apiClient } from './client';
import * as T from './types';

export const childrenService = {
  // 8. Yangi Farzand Qo'shish
  addChild: async (data: T.AddChildRequest) => {
    const response = await apiClient.post<T.AddChildResponse>('/api/website/add-child/', data);
    return response.data;
  },

  // 9. Farzandlar Ro'yxati
  getChildren: async () => {
    const response = await apiClient.get<T.Child[]>('/api/website/my-children/');
    return response.data;
  },

  // 10. Farzand Profili Tafsilotlari
  getChildProfile: async (childId: number) => {
    const response = await apiClient.get<T.Child>(`/api/website/child-profile/${childId}`);
    return response.data;
  },

  // 11. Farzand Profilini Tahrirlash
  updateChild: async (childId: number, data: T.UpdateChildRequest) => {
    const response = await apiClient.put<T.Child>(`/api/website/child-profile/${childId}`, data);
    return response.data;
  },

  // 12. Farzandni O'chirish
  deleteChild: async (childId: number) => {
    const response = await apiClient.delete(`/api/website/child-profile/${childId}`);
    return response.data;
  },

  // 13. Farzand Tilini Tanlash
  setLanguage: async (childId: number, language: string) => {
    const response = await apiClient.post(`/api/website/child-profile/${childId}/set-language/`, { language });
    return response.data;
  }
};
