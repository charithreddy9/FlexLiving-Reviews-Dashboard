import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
} from '@mui/material';
import {
  Star,
  CheckCircle,
  Cancel,
  FilterList,
  Refresh,
  TrendingUp,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { apiService } from '../services/api';
import { Review, ReviewStats, ReviewFilters, Listing } from '../types';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'date',
    sortOrder: 'desc',
    limit: 10,
    offset: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [reviewsData, statsData] = await Promise.all([
        apiService.getReviews(filters),
        apiService.getReviewStats(filters.listingId),
      ]);

      setReviews(reviewsData.reviews);
      setListings(reviewsData.listings);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0,
      limit: rowsPerPage,
    }));
    setPage(0);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
    setFilters(prev => ({
      ...prev,
      offset: newPage * rowsPerPage,
    }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setFilters(prev => ({
      ...prev,
      limit: newRowsPerPage,
      offset: 0,
    }));
  };

  const handleApprovalToggle = async (reviewId: string, currentApproval: boolean) => {
    try {
      await apiService.updateReviewApproval(reviewId, !currentApproval);
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, isApproved: !currentApproval }
          : review
      ));
      
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          approvedCount: currentApproval ? prev.approvedCount - 1 : prev.approvedCount + 1,
          pendingCount: currentApproval ? prev.pendingCount + 1 : prev.pendingCount - 1,
        } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review approval');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        sx={{
          color: index < rating ? 'gold' : 'grey.300',
          fontSize: '1rem',
        }}
      />
    ));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      default: return 'default';
    }
  };

  // Client-side search within currently fetched page
  const displayedReviews = reviews.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.guestName.toLowerCase().includes(q) ||
      r.reviewText.toLowerCase().includes(q) ||
      r.channel.toLowerCase().includes(q) ||
      r.listingName.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Manager Dashboard
      </Typography>

      {/* Stats Cards */}
      {stats && (
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 200, flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Reviews
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalReviews}
                  </Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 200, flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Average Rating
                  </Typography>
                  <Typography variant="h4">
                    {stats.averageRating.toFixed(1)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderStars(Math.round(stats.averageRating))}
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 200, flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Approved
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.approvedCount}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 200, flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pendingCount}
                  </Typography>
                </Box>
                <Cancel color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          Filters
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Property</InputLabel>
            <Select
              value={filters.listingId || ''}
              label="Property"
              onChange={(e) => handleFilterChange('listingId', e.target.value || undefined)}
            >
              <MenuItem value="">All Properties</MenuItem>
              {listings.map((listing) => (
                <MenuItem key={listing.id} value={listing.id}>
                  {listing.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            disabled={!filters.listingId}
            onClick={() => filters.listingId && navigate(`/property/${filters.listingId}`)}
          >
            Open Property Page
          </Button>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={filters.rating || ''}
              label="Rating"
              onChange={(e) => handleFilterChange('rating', e.target.value || undefined)}
            >
              <MenuItem value="">All Ratings</MenuItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating} Star{rating > 1 ? 's' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Channel</InputLabel>
            <Select
              value={filters.channel || ''}
              label="Channel"
              onChange={(e) => handleFilterChange('channel', e.target.value || undefined)}
            >
              <MenuItem value="">All Channels</MenuItem>
              <MenuItem value="Airbnb">Airbnb</MenuItem>
              <MenuItem value="Booking.com">Booking.com</MenuItem>
              <MenuItem value="VRBO">VRBO</MenuItem>
              <MenuItem value="Direct Booking">Direct Booking</MenuItem>
            </Select>
          </FormControl>

          {/* Date Range */}
          <TextField
            label="Start Date"
            type="date"
            size="small"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.approved === undefined ? '' : filters.approved.toString()}
              label="Status"
              onChange={(e) => handleFilterChange('approved', e.target.value === '' ? undefined : e.target.value === 'true')}
            >
              <MenuItem value="">All Reviews</MenuItem>
              <MenuItem value="true">Approved</MenuItem>
              <MenuItem value="false">Pending</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy || 'date'}
              label="Sort By"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="guestName">Guest Name</MenuItem>
              <MenuItem value="listingName">Property</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.sortOrder || 'desc'}
              label="Order"
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              <MenuItem value="desc">Newest First</MenuItem>
              <MenuItem value="asc">Oldest First</MenuItem>
            </Select>
          </FormControl>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search reviews, guests, properties, channels"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 260 }}
          />
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchData}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Reviews Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Guest</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Review</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedReviews.map((review) => (
                <TableRow key={review.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {review.guestName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {review.listingName}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigate(`/property/${review.listingId}`)}
                      sx={{ mt: 0.5 }}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {renderStars(review.rating)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {review.rating}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" noWrap>
                      {review.reviewText}
                    </Typography>
                    <Chip
                      label={review.sentiment}
                      size="small"
                      color={getSentimentColor(review.sentiment) as any}
                      sx={{ mt: 0.5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={review.channel} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(review.reviewDate), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={review.isApproved ? 'Approved' : 'Pending'}
                      color={review.isApproved ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={review.isApproved ? 'Disapprove' : 'Approve'}>
                      <IconButton
                        onClick={() => handleApprovalToggle(review.id, review.isApproved)}
                        color={review.isApproved ? 'success' : 'default'}
                      >
                        {review.isApproved ? <CheckCircle /> : <Cancel />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={displayedReviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
    </Container>
  );
};

export default ManagerDashboard;