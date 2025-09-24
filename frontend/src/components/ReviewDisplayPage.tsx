import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';
import {
  Star,
  LocationOn,
  Bed,
  Bathtub,
  People,
  ArrowBack,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { apiService } from '../services/api';
import { Review, Listing } from '../types';

const ReviewDisplayPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google reviews (mock) state
  const [googleReviews, setGoogleReviews] = useState<any[]>([]);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  useEffect(() => {
    if (listingId) {
      fetchData();
    }
  }, [listingId]);

  useEffect(() => {
    // Load Google Reviews (mock placeId)
    const loadGoogle = async () => {
      try {
        setGoogleLoading(true);
        setGoogleError(null);
        const placeId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
        const res = await apiService.getGoogleReviews(placeId, 5, 'time', 'desc');
        setGoogleReviews(res.reviews || []);
      } catch (e: any) {
        setGoogleError(e?.message || 'Failed to load Google reviews');
      } finally {
        setGoogleLoading(false);
      }
    };
    loadGoogle();
  }, []);

  const fetchData = async () => {
    if (!listingId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const reviewsData = await apiService.getReviews({
        listingId,
        approved: true,
        sortBy: 'date',
        sortOrder: 'desc',
        limit: 50,
      });

      setReviews(reviewsData.reviews);
      setListing(reviewsData.listings.find(l => l.id === listingId) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        sx={{
          color: index < rating ? 'gold' : 'grey.300',
          fontSize: '1.2rem',
        }}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchData}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Property not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => window.history.back()}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      {/* Property Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {listing.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn color="action" />
                <Typography variant="body1" color="text.secondary">
                  {listing.location}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Bed color="action" />
                  <Typography variant="body2">{listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Bathtub color="action" />
                  <Typography variant="body2">{listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <People color="action" />
                  <Typography variant="body2">Up to {listing.maxGuests} guests</Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1, mb: 1 }}>
                {renderStars(Math.round(listing.averageRating))}
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {listing.averageRating.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Based on {listing.totalReviews} review{listing.totalReviews !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Guest Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Alert severity="info">
          No approved reviews available for this property.
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'primary.main',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(review.guestName)}
                    </Avatar>
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 500 }}>
                      {review.guestName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      {renderStars(review.rating)}
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(review.reviewDate), 'MMMM dd, yyyy')}
                      </Typography>
                      <Chip
                        label={review.channel}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {review.reviewText}
                    </Typography>
                    
                    {review.response && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Response from Flex Living
                          </Typography>
                          <Typography variant="body2">
                            {review.response.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {format(new Date(review.response.date), 'MMMM dd, yyyy')}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Google Reviews Section (mock) */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
        Google Reviews
      </Typography>

      {googleLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {googleError && <Alert severity="error" sx={{ mb: 2 }}>{googleError}</Alert>}

      {(!googleLoading && googleReviews.length === 0) ? (
        <Alert severity="info">No Google reviews to display.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {googleReviews.map((gr) => (
            <Card key={gr.id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle2">{gr.authorName}</Typography>
                  <Chip size="small" label={`${gr.rating} ★`} />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {new Date(gr.time).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{gr.text}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ReviewDisplayPage;