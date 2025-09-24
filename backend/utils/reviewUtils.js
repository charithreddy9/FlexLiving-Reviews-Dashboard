

/**
 * Normalize review data from Hostaway API format
 * @param {Array} reviews - Raw review data from Hostaway
 * @returns {Array} Normalized review data
 */
function normalizeReviewData(reviews) {
  return reviews.map(review => {
    // Clamp rating between 0 and 5; coerce invalid values to 0
    let rating = Number(review.rating);
    if (Number.isNaN(rating)) rating = 0;
    rating = Math.max(0, Math.min(5, rating));

    return {
      id: review.id,
      listingId: review.listingId,
      listingName: review.listingName,
      guestName: review.guestName,
      rating: rating,
      reviewText: review.reviewText,
      reviewDate: new Date(review.reviewDate),
      channel: review.channel,
      category: review.category,
      response: review.response ? {
        text: review.response.text,
        date: new Date(review.response.date)
      } : null,
      isApproved: !!review.isApproved,
      sentiment: review.sentiment,
      // Additional computed fields
      daysSinceReview: Math.floor((new Date() - new Date(review.reviewDate)) / (1000 * 60 * 60 * 24)),
      hasResponse: !!review.response,
      responseTime: review.response ? 
        Math.floor((new Date(review.response.date) - new Date(review.reviewDate)) / (1000 * 60 * 60 * 24)) : null
    };
  });
}

/**
 * Filter reviews based on various criteria
 * @param {Array} reviews - Array of normalized reviews
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered reviews
 */
function filterReviews(reviews, filters) {
  let filtered = [...reviews];

  if (filters.listingId) {
    filtered = filtered.filter(review => review.listingId === filters.listingId);
  }

  if (filters.rating) {
    filtered = filtered.filter(review => review.rating === filters.rating);
  }

  if (filters.category) {
    filtered = filtered.filter(review => 
      review.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  }

  if (filters.channel) {
    filtered = filtered.filter(review => 
      review.channel.toLowerCase().includes(filters.channel.toLowerCase())
    );
  }

  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filtered = filtered.filter(review => review.reviewDate >= startDate);
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filtered = filtered.filter(review => review.reviewDate <= endDate);
  }

  if (filters.approved !== null) {
    filtered = filtered.filter(review => review.isApproved === filters.approved);
  }

  return filtered;
}

/**
 * Sort reviews based on specified criteria
 * @param {Array} reviews - Array of reviews to sort
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {Array} Sorted reviews
 */
function sortReviews(reviews, sortBy, sortOrder) {
  const sorted = [...reviews].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = a.reviewDate;
        bValue = b.reviewDate;
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'guestName':
        aValue = a.guestName.toLowerCase();
        bValue = b.guestName.toLowerCase();
        break;
      case 'listingName':
        aValue = a.listingName.toLowerCase();
        bValue = b.listingName.toLowerCase();
        break;
      case 'channel':
        aValue = a.channel.toLowerCase();
        bValue = b.channel.toLowerCase();
        break;
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      default:
        aValue = a.reviewDate;
        bValue = b.reviewDate;
    }

    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }
  });

  return sorted;
}

/**
 * Calculate review statistics
 * @param {Array} reviews - Array of reviews
 * @returns {Object} Statistics object
 */
function calculateReviewStats(reviews) {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {},
      channelDistribution: {},
      categoryDistribution: {},
      approvedCount: 0,
      pendingCount: 0
    };
  }

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const channelDistribution = reviews.reduce((acc, review) => {
    acc[review.channel] = (acc[review.channel] || 0) + 1;
    return acc;
  }, {});

  const categoryDistribution = reviews.reduce((acc, review) => {
    acc[review.category] = (acc[review.category] || 0) + 1;
    return acc;
  }, {});

  const approvedCount = reviews.filter(r => r.isApproved).length;
  const pendingCount = reviews.filter(r => !r.isApproved).length;

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    channelDistribution,
    categoryDistribution,
    approvedCount,
    pendingCount
  };
}

/**
 * Get unique values for filter options
 * @param {Array} reviews - Array of reviews
 * @returns {Object} Filter options
 */
function getFilterOptions(reviews) {
  const channels = [...new Set(reviews.map(r => r.channel))].sort();
  const categories = [...new Set(reviews.map(r => r.category))].sort();
  const listings = [...new Set(reviews.map(r => ({ id: r.listingId, name: r.listingName })))];
  const uniqueListings = listings.filter((listing, index, self) => 
    index === self.findIndex(l => l.id === listing.id)
  );

  return {
    channels,
    categories,
    listings: uniqueListings,
    ratings: [1, 2, 3, 4, 5]
  };
}

module.exports = {
  normalizeReviewData,
  filterReviews,
  sortReviews,
  calculateReviewStats,
  getFilterOptions
};