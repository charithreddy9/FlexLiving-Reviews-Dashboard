// Review types
export interface Review {
  id: string;
  listingId: string;
  listingName: string;
  guestName: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
  channel: string;
  category: string;
  response?: {
    text: string;
    date: string;
  } | null;
  isApproved: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
  daysSinceReview: number;
  hasResponse: boolean;
  responseTime?: number | null;
}

export interface Listing {
  id: string;
  name: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  averageRating: number;
  totalReviews: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  channelDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  approvedCount: number;
  pendingCount: number;
}

export interface ReviewFilters {
  listingId?: string;
  rating?: number;
  category?: string;
  channel?: string;
  startDate?: string;
  endDate?: string;
  approved?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
  message?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  listings: Listing[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: ReviewFilters;
}

// Google Reviews types
export interface GoogleReview {
  id: string;
  placeId: string;
  placeName: string;
  authorName: string;
  rating: number;
  text: string;
  time: string;
  profilePhotoUrl?: string | null;
  relativeTimeDescription: string;
}

export interface GoogleReviewsResponse {
  placeId: string;
  reviews: GoogleReview[];
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  };
}

// Filter options
export interface FilterOptions {
  channels: string[];
  categories: string[];
  listings: Array<{ id: string; name: string }>;
  ratings: number[];
}
