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

export interface ScrapingLink {
  id: string;
  urlId: string;
  link: string;
  name: string;
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

export interface LinksResponse {
  links: ScrapingLink[];
  pagination: PaginationInfo;
}

export interface GetUrlsParams {
  page?: number;
  limit?: number;
}

export interface GetLinksParams {
  page?: number;
  limit?: number;
  url: string;
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

  /**
   * Get all links for a specific URL with pagination
   */
  async getLinks(params: GetLinksParams): Promise<LinksResponse> {
    try {
      const { page = 1, limit = 10, url } = params;
      
      logger.info('Fetching links for URL:', { page, limit, url });
      
      // Build URL with query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        url: url
      });
      
      const response = await apiClient.get<ApiResponse<LinksResponse>>(
        `${this.endpoint}/links?${queryParams.toString()}`
      );

      logger.info('Links fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      logger.error('Failed to fetch links:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const scrapingService = new ScrapingService();
