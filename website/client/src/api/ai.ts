import { apiClient } from './client';
import * as T from './types';

export const aiService = {
  // 16. AI Chat Savol-Javob
  sendChatMessage: async (data: T.AiChatRequest) => {
    const response = await apiClient.post<T.AiChatResponse>('/api/website/ai/chat/', data);
    return response.data;
  },

  // 17. Mustaqil Text-to-Speech
  textToSpeech: async (data: T.TtsRequest) => {
    const response = await apiClient.post<T.TtsResponse>('/api/website/ai/tts/', data);
    return response.data;
  }
};
