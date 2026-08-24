import { apiClient } from './client';
import * as T from './types';

export const statsService = {
  // 18. Bolaning AI Faollik Statistikasi
  getChildActivityStats: async (childId: number) => {
    const response = await apiClient.get<T.ChildActivityStatsResponse>(`/api/website/child/${childId}/activity-stats/`);
    return response.data;
  },

  // 19. Sarflangan Vaqtni Saqlash / Track Time
  trackTime: async (childId: number, data: T.TrackTimeRequest) => {
    const response = await apiClient.post(`/api/website/child/${childId}/track-time/`, data);
    return response.data;
  },

  // 20. Bolaning AI Bilan Yozishgan Tarixi
  getAiHistory: async (childId: number) => {
    const response = await apiClient.get<T.AiHistoryMessage[]>(`/api/website/child/${childId}/ai-history/`);
    return response.data;
  },

  // 21. Suhbat Tarixini Tozalash
  clearAiHistory: async (childId: number) => {
    const response = await apiClient.delete(`/api/website/child/${childId}/ai-history/`);
    return response.data;
  }
};
