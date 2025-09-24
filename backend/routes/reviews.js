const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'hostaway-mock-data.json');
const hostawayData = require('../data/hostaway-mock-data.json');
const { normalizeReviewData, filterReviews, sortReviews } = require('../utils/reviewUtils');

// GET /api/reviews/hostaway - Fetch and normalize Hostaway review data
router.get('/hostaway', async (req, res) => {
  try {
    const { 
      listingId, 
      rating, 
      category, 
      channel, 
      startDate, 
      endDate,
      approved,
      sortBy = 'date',
      sortOrder = 'desc',
      limit = 50,
      offset = 0
    } = req.query;

    // Normalize the review data
    const normalizedReviews = normalizeReviewData(hostawayData.reviews);
    
    // Apply filters
    let filteredReviews = filterReviews(normalizedReviews, {
      listingId,
      rating: rating ? Math.min(5, Math.max(0, parseInt(rating))) : null,
      category,
      channel,
      startDate,
      endDate,
      approved: approved !== undefined ? approved === 'true' : null
    });

    // Apply sorting
    filteredReviews = sortReviews(filteredReviews, sortBy, sortOrder);

    // Apply pagination
    const totalCount = filteredReviews.length;
    const paginatedReviews = filteredReviews.slice(offset, offset + parseInt(limit));

    // Get listing information
    const listings = hostawayData.listings;

    res.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        listings: listings,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + parseInt(limit) < totalCount
        },
        filters: {
          listingId,
          rating,
          category,
          channel,
          startDate,
          endDate,
          approved
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching Hostaway reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
});

// GET /api/reviews/hostaway/stats - Get review statistics
router.get('/hostaway/stats', async (req, res) => {
  try {
    const { listingId } = req.query;
    
    let reviews = hostawayData.reviews;
    if (listingId) {
      reviews = reviews.filter(review => review.listingId === listingId);
    }

    // Use normalized + utility for safe math (zero-review friendly)
    const { normalizeReviewData, calculateReviewStats } = require('../utils/reviewUtils');
    const normalized = normalizeReviewData(reviews);
    const stats = calculateReviewStats(normalized);

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch review statistics',
      message: error.message
    });
  }
});

// PUT /api/reviews/hostaway/:reviewId/approve - Approve/disapprove a review
router.put('/hostaway/:reviewId/approve', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;

    const review = hostawayData.reviews.find(r => r.id === reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Update in-memory (affects current process immediately)
    review.isApproved = !!isApproved;

    // Persist change to JSON file
    const newContent = JSON.stringify(hostawayData, null, 2);
    await fs.writeFile(dataFilePath, newContent, 'utf8');

    res.json({
      success: true,
      data: {
        reviewId,
        isApproved: review.isApproved,
        message: `Review ${review.isApproved ? 'approved' : 'disapproved'} successfully`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating review approval:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review approval',
      message: error.message
    });
  }
});

module.exports = router;