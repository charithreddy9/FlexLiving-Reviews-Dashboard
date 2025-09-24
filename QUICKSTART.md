# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Start Development Servers
```bash
npm run dev
```

### 3. Open Your Browser
- **Manager Dashboard**: http://localhost:3000/dashboard
- **Review Display**: http://localhost:3000/reviews/prop_001
- **API Health Check**: http://localhost:5000/api/health

## 🎯 What You'll See

### Manager Dashboard Features
- ✅ View all reviews with filtering options
- ✅ Approve/disapprove reviews with one click
- ✅ Real-time statistics and metrics
- ✅ Filter by property, rating, channel, and date
- ✅ Sort by various criteria

### Review Display Page
- ✅ Property information and amenities
- ✅ Guest reviews with ratings
- ✅ Host responses
- ✅ Rating distribution charts
- ✅ Clean, guest-friendly design

## 🔧 Optional: Google Reviews Integration

1. Get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Copy `backend/env.example` to `backend/.env`
3. Add your API key: `GOOGLE_PLACES_API_KEY=your_key_here`
4. Restart the server

## 📊 Sample Data

The system comes with realistic mock data including:
- 3 properties (Downtown Apartment, Beach House, City Loft)
- 8 reviews across different channels (Airbnb, Booking.com, VRBO)
- Various ratings and categories
- Host responses and approval status

## 🎨 Try These Features

1. **Filter Reviews**: Use the filter panel to narrow down reviews
2. **Approve Reviews**: Click the approval toggle to approve/pending reviews
3. **View Statistics**: Check the stats cards for performance metrics
4. **Navigate Properties**: Use the navigation to switch between dashboard and review display
5. **Sort Data**: Change sorting options to see different views

## 🆘 Need Help?

- Check the full [README.md](README.md) for detailed documentation
- API endpoints are documented in the README
- All components are fully typed with TypeScript
- Error messages provide helpful debugging information

---

**Ready to explore! 🎉**
