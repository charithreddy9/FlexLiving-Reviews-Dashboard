# Flex Living Reviews Dashboard

A comprehensive reviews management system for Flex Living properties, featuring a modern React frontend and Node.js backend with API integration capabilities.

## 🚀 Features

### Backend (Node.js)
- **Hostaway API Integration**: Mock API route (`GET /api/reviews/hostaway`) with data normalization
- **Google Reviews Integration**: Google Places API integration with fallback to mock data
- **Review Management**: Approve/disapprove reviews, statistics, and filtering
- **RESTful API**: Well-structured endpoints with proper error handling
- **Data Normalization**: Structured data parsing by listing, review type, channel, and date

### Frontend (React + TypeScript)
- **Manager Login System**: Secure login page for property managers
- **Manager Dashboard**: User-friendly interface for review management
- **Advanced Filtering**: Filter by rating, category, channel, property, and time
- **Review Approval System**: Toggle review approval status with real-time updates
- **Property Performance**: Per-property performance metrics and statistics
- **Review Display Page**: Private review display for managers
- **Public Property Page**: Public-facing property page with approved reviews
- **Modern UI**: Material-UI components with responsive design
- **Real-time Updates**: Live data updates and statistics
- **Authentication**: Local storage-based manager authentication

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging
- **dotenv** for environment configuration
- **nodemon** for development

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Recharts** for data visualization
- **date-fns** for date formatting
- **node-fetch** for HTTP requests
- **Emotion** for CSS-in-JS styling

## 📁 Project Structure

```
charith-assignment/
├── backend/
│   ├── routes/
│   │   ├── reviews.js          # Hostaway reviews API routes
│   │   └── googleReviews.js    # Google Reviews integration
│   ├── data/
│   │   └── hostaway-mock-data.json  # Mock Hostaway data
│   ├── utils/
│   │   └── reviewUtils.js      # Data processing utilities
│   ├── server.js               # Express server setup
│   ├── package.json
│   └── env.example             # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.tsx           # Manager login page
│   │   │   ├── ManagerDashboard.tsx    # Main dashboard
│   │   │   ├── ReviewDisplayPage.tsx   # Private review display
│   │   │   ├── PublicPropertyPage.tsx  # Public property page
│   │   │   └── Navigation.tsx          # Navigation component
│   │   ├── services/
│   │   │   └── api.ts          # API service layer
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript type definitions
│   │   └── App.tsx             # Main app component
│   └── package.json
├── package.json                # Root package.json for scripts
├── QUICKSTART.md              # Quick start guide
└── README.md
```

## 🚀 Getting Started

> **Quick Start**: For a faster setup, see [QUICKSTART.md](QUICKSTART.md) for a 5-minute guide.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd charith-assignment
   ```

2. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit backend/.env and add your Google Places API key (optional)
   # GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

### Application Routes

**Frontend Routes:**
- `/` - Login page (if not authenticated) or Dashboard (if authenticated)
- `/login` - Manager login page
- `/dashboard` - Manager dashboard (requires authentication)
- `/reviews/:listingId` - Review display page for managers (requires authentication)
- `/property/:listingId` - Public property page (no authentication required)

### Alternative: Run servers separately

**Backend only:**
```bash
cd backend
npm install
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm install
npm start
```

### Available Scripts

**Root level scripts:**
- `npm run dev` - Start both backend and frontend servers
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend server
- `npm run install-all` - Install dependencies for all projects
- `npm run build` - Build frontend for production

## 📊 API Endpoints

### Reviews API (Protected with Admin Access)
- `GET /api/reviews/hostaway` - Fetch and filter reviews with pagination
- `GET /api/reviews/hostaway/stats` - Get review statistics
- `PUT /api/reviews/hostaway/:id/approve` - Approve/disapprove review
- `GET /api/reviews/hostaway/listings` - Get all listings

### Google Reviews API (Public)
- `GET /api/google-reviews/:placeId` - Fetch Google Reviews
- `GET /api/google-reviews/search` - Search for places
- `GET /api/google-reviews/integration-status` - Check integration status

### Health Check
- `GET /api/health` - API health status

### Authentication
- Reviews API requires `X-ADMIN-KEY` header for access
- Configure `ADMIN_ACCESS_CODE` in environment variables

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Admin Access (Optional - for API protection)
ADMIN_ACCESS_CODE=your_admin_access_code_here

# Google Places API (Optional)
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

### Google Places API Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API
   - Places API (New)
4. Create credentials (API Key)
5. Add the API key to your `.env` file

## 🎯 Key Features Explained

### Data Normalization
The system normalizes review data from various sources:
- **Hostaway**: Structured data with listing, guest, rating, and response information
- **Google Reviews**: Place-based reviews with author information
- **Unified Format**: Consistent data structure across all sources

### Manager Dashboard Features
- **Real-time Statistics**: Total reviews, average rating, approval status
- **Advanced Filtering**: Multiple filter combinations for precise data analysis
- **Bulk Operations**: Approve/disapprove reviews with immediate feedback
- **Trend Analysis**: Visual indicators for performance trends
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Authentication**: Secure login system for property managers

### Review Display Page (Manager View)
- **Property-focused**: Shows all reviews for specific properties
- **Management Tools**: Approve/disapprove reviews directly from the page
- **Response Integration**: Shows host responses alongside reviews
- **Rating Distribution**: Visual breakdown of rating patterns
- **Manager-friendly**: Designed for property management workflow

### Public Property Page
- **Guest-focused**: Shows only approved reviews for public viewing
- **Clean Design**: Guest-friendly layout with property information
- **Review Display**: Approved reviews with ratings and responses
- **Property Details**: Amenities, location, and property information
- **Public Access**: No authentication required for viewing

## 🔍 Google Reviews Integration

The system includes comprehensive Google Reviews integration:

### Current Implementation
- **Mock Data**: Fully functional with realistic mock data
- **API Ready**: Prepared for Google Places API integration
- **Fallback System**: Graceful degradation when API key is not available

### Integration Status
Check integration status at: `GET /api/google-reviews/integration-status`

### Setup Instructions
1. Obtain Google Places API key
2. Enable required APIs in Google Cloud Console
3. Add API key to environment variables
4. Restart server to activate real API integration

## 🎨 Design Decisions

### UI/UX Philosophy
- **Manager-First**: Dashboard designed for property managers' workflow
- **Guest-Focused**: Public pages prioritize guest experience
- **Data-Driven**: Statistics and metrics prominently displayed
- **Accessibility**: WCAG-compliant design with proper contrast and navigation

### Technical Architecture
- **Separation of Concerns**: Clear separation between frontend and backend
- **Type Safety**: Full TypeScript implementation for reliability
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance**: Optimized API calls and data processing

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
npm run build

# Start production server
cd backend
npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database (if applicable)
- Set up proper CORS origins
- Configure Google Places API with production restrictions

## 📈 Future Enhancements

### Planned Features
- **Database Integration**: PostgreSQL/MongoDB for persistent storage
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Analytics**: Trend analysis and predictive insights
- **Multi-language Support**: Internationalization for global properties
- **Mobile App**: React Native companion app
- **Email Notifications**: Automated alerts for new reviews
- **Review Templates**: Pre-written response templates

### API Enhancements
- **Rate Limiting**: Implement API rate limiting
- **Authentication**: JWT-based authentication system
- **Caching**: Redis caching for improved performance
- **Webhooks**: Real-time data synchronization

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 5000 is available
- Verify all dependencies are installed
- Check environment variables

**Frontend won't connect to backend:**
- Ensure backend is running on port 5000
- Check CORS configuration in server.js
- Verify API calls are using correct base URL
- Check browser console for CORS errors

**Google Reviews not working:**
- Verify API key is correctly set
- Check API quotas in Google Cloud Console
- Ensure required APIs are enabled

**Authentication issues:**
- Check if `ADMIN_ACCESS_CODE` is set in backend environment
- Verify `X-ADMIN-KEY` header is being sent with API requests
- Clear browser localStorage if login issues persist
- Check browser console for authentication errors

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for Flex Living**
