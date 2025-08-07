import { apiClient } from './client';
import type { ApiResponse } from '../types/api';
import { logger } from '../utils/config';

// Types for scraping API
export interface ScrapingUrl {
  id: string;
  name: string;
  url: string;
  linksCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UrlsResponse {
  urls: ScrapingUrl[];
  pagination: PaginationInfo;
}

export interface GetUrlsParams {
  page?: number;
  limit?: number;
}

class ScrapingService {
  private readonly endpoint = '/scraping';

  /**
   * Get all URLs with pagination
   */
  async getUrls(params: GetUrlsParams = {}): Promise<UrlsResponse> {
    try {
      const { page = 1, limit = 5 } = params;
      
      logger.info('Fetching URLs:', { page, limit });
      
      // Build URL with query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await apiClient.get<ApiResponse<UrlsResponse>>(
        `${this.endpoint}/urls?${queryParams.toString()}`
      );

      logger.info('URLs fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      logger.error('Failed to fetch URLs:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const scrapingService = new ScrapingService();
