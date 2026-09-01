import { apiClient } from './client';
import * as T from './types';

export const teamService = {
  // Barcha jamoa a'zolarini olish
  getTeams: async () => {
    const response = await apiClient.get<T.Team[]>('/api/website/teams/');
    return response.data;
  }
};
