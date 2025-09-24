import { 
  ApiResponse, 
  ReviewsResponse, 
  ReviewStats, 
  ReviewFilters,
  GoogleReviewsResponse 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://159.65.73.165:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Reviews API
  async getReviews(filters: ReviewFilters = {}): Promise<ReviewsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/reviews/hostaway${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ReviewsResponse>(endpoint);
  }

  async getReviewStats(listingId?: string): Promise<ReviewStats> {
    const endpoint = listingId 
      ? `/reviews/hostaway/stats?listingId=${listingId}`
      : '/reviews/hostaway/stats';
    
    return this.request<ReviewStats>(endpoint);
  }

  async updateReviewApproval(reviewId: string, isApproved: boolean): Promise<{ reviewId: string; isApproved: boolean; message: string }> {
    return this.request(`/reviews/hostaway/${reviewId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved }),
    });
  }

  // Google Reviews API
  async getGoogleReviews(placeId: string, limit = 20, sortBy = 'time', sortOrder = 'desc'): Promise<GoogleReviewsResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    return this.request<GoogleReviewsResponse>(`/google-reviews/${placeId}?${params}`);
  }

  async getGoogleReviewsIntegrationStatus(): Promise<{
    integrated: boolean;
    apiKeyConfigured: boolean;
    endpoints: Record<string, string>;
    setupInstructions?: string[];
  }> {
    return this.request('/google-reviews/integration-status');
  }

  // Health check
  async getHealthStatus(): Promise<{ status: string; timestamp: string; service: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;