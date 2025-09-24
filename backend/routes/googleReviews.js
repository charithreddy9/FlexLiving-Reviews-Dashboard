const express = require('express');
const router = express.Router();

// Mock Google Reviews data (in a real implementation, this would come from Google Places API)
const mockGoogleReviews = [
  {
    id: "google_rev_001",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    placeName: "Flex Living Downtown",
    authorName: "John Smith",
    rating: 5,
    text: "Excellent service and beautiful properties. The team was very professional and responsive.",
    time: "2024-01-10T10:00:00Z",
    profilePhotoUrl: null,
    relativeTimeDescription: "2 weeks ago"
  },
  {
    id: "google_rev_002", 
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    placeName: "Flex Living Downtown",
    authorName: "Maria Garcia",
    rating: 4,
    text: "Great location and clean accommodations. Would definitely recommend to others.",
    time: "2024-01-08T14:30:00Z",
    profilePhotoUrl: null,
    relativeTimeDescription: "2 weeks ago"
  },
  {
    id: "google_rev_003",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4", 
    placeName: "Flex Living Downtown",
    authorName: "David Lee",
    rating: 3,
    text: "Good overall experience but the check-in process could be smoother.",
    time: "2024-01-05T09:15:00Z",
    profilePhotoUrl: null,
    relativeTimeDescription: "3 weeks ago"
  }
];


router.get('/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { limit = 20, sortBy = 'time', sortOrder = 'desc' } = req.query;


    let reviews = mockGoogleReviews.filter(review => review.placeId === placeId);

    // Apply sorting
    reviews.sort((a, b) => {
      const aValue = new Date(a.time);
      const bValue = new Date(b.time);
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    // Apply limit
    reviews = reviews.slice(0, parseInt(limit));

    // Calculate statistics
    const stats = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0,
      ratingDistribution: reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: {
        placeId,
        reviews,
        stats
      },
      timestamp: new Date().toISOString(),
      note: "This is mock data. In production, this would fetch from Google Places API."
    });

  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Google Reviews',
      message: error.message
    });
  }
});

/**
 * GET /api/google-reviews/search
 * Search for places and their reviews
 */
router.get('/search', async (req, res) => {
  try {
    const { query, location } = req.query;

   

    // Mock search results
    const mockSearchResults = [
      {
        placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
        name: "Flex Living Downtown",
        address: "123 Main St, Downtown",
        rating: 4.2,
        userRatingsTotal: 156,
        reviews: mockGoogleReviews.filter(r => r.placeId === "ChIJN1t_tDeuEmsRUsoyG83frY4")
      }
    ];

    res.json({
      success: true,
      data: {
        results: mockSearchResults,
        query,
        location
      },
      timestamp: new Date().toISOString(),
      note: "This is mock data. In production, this would search Google Places API."
    });

  } catch (error) {
    console.error('Error searching Google Reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search Google Reviews',
      message: error.message
    });
  }
});


router.get('/integration-status', async (req, res) => {
  try {
    const hasApiKey = !!process.env.GOOGLE_PLACES_API_KEY;
    
    res.json({
      success: true,
      data: {
        integrated: hasApiKey,
        apiKeyConfigured: hasApiKey,
        endpoints: {
          placeDetails: hasApiKey ? 'Available' : 'Mock data only',
          textSearch: hasApiKey ? 'Available' : 'Mock data only',
          nearbySearch: hasApiKey ? 'Available' : 'Mock data only'
        },
        setupInstructions: hasApiKey ? null : [
          "1. Get a Google Places API key from Google Cloud Console",
          "2. Enable Places API and Places API (New) in your project",
          "3. Add GOOGLE_PLACES_API_KEY to your .env file",
          "4. Restart the server to use real Google Reviews data"
        ]
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking Google Reviews integration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check integration status',
      message: error.message
    });
  }
});

module.exports = router;
