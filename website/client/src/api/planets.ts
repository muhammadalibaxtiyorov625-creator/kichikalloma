import { apiClient } from './client';
import * as T from './types';

export const planetService = {
  // 14. Barcha 9 ta Sayyora Ro'yxati
  getPlanets: async () => {
    const response = await apiClient.get<T.Planet[]>('/api/website/planets/');
    return response.data;
  },

  // 15. Bitta Sayyora Tafsilotlari
  getPlanetDetails: async (planetId: number) => {
    const response = await apiClient.get<T.Planet>(`/api/website/planets/${planetId}`);
    return response.data;
  }
};
