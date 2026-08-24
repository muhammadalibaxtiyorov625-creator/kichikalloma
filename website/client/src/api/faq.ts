import { apiClient } from './client';
import * as T from './types';

export const faqService = {
  // 22. Barcha FAQ Savollari
  getFaqs: async () => {
    const response = await apiClient.get<T.Faq[]>('/api/website/faqs/');
    return response.data;
  }
};
