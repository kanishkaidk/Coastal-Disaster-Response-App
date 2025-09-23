# 🚀 Coast-Kavach API Setup Guide

## 📋 Prerequisites

Before running the app with real APIs, you need to obtain API keys and configure environment variables.

## 🔑 Required API Keys

### 1. Mapbox API Key
- **Purpose**: Interactive maps, geocoding, and map tiles
- **Get it**: [Mapbox Account](https://account.mapbox.com/access-tokens/)
- **Cost**: Free tier includes 50,000 map loads/month
- **Required Scopes**: 
  - `styles:read` (for map styles)
  - `fonts:read` (for map fonts)
  - `datasets:read` (for custom data)

### 2. OpenWeatherMap API Key
- **Purpose**: Real-time weather data, marine conditions
- **Get it**: [OpenWeatherMap API](https://openweathermap.org/api)
- **Cost**: Free tier includes 1,000 calls/day
- **Required Plan**: Current Weather Data API

### 3. Government APIs (Optional)
- **IMD API**: Indian Meteorological Department
- **NDMA API**: National Disaster Management Authority  
- **INCOIS API**: Indian National Centre for Ocean Information Services

### 4. Social Media APIs (Optional)
- **Twitter API v2**: Social media monitoring
- **Facebook Graph API**: Social media posts
- **YouTube Data API**: Video content analysis

## ⚙️ Environment Setup

### Step 1: Create Environment File
```bash
# Copy the example file
cp env.example .env

# Edit the .env file with your actual API keys
nano .env
```

### Step 2: Add Your API Keys
```env
# Required APIs
MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Optional APIs
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
FACEBOOK_APP_ID=your_facebook_app_id_here

# Government APIs
IMD_API_URL=https://api.imd.gov.in
NDMA_API_URL=https://api.ndma.gov.in
INCOIS_API_URL=https://api.incois.gov.in
```

### Step 3: Update app.config.js
The app.config.js file automatically loads environment variables from your `.env` file.

### Step 4: Restart Development Server
```bash
# Clear cache and restart
npx expo start --clear

# Or if using npm
npm start -- --reset-cache
```

## 🔄 API Toggle

The app includes a toggle button in the map header to switch between:
- **Mock API** (default): Uses generated data for development
- **Real API**: Uses actual API endpoints with your keys

Look for the cloud icon in the top-right corner:
- 🌩️ **Gray cloud**: Using mock API
- ✅ **Green cloud**: Using real API

## 📊 API Endpoints

### Real API Endpoints (when using real API)
```
GET /reports - Get coastal reports
GET /alerts - Get government alerts  
GET /social - Get social media posts
GET /hotspots - Get danger hotspots
GET /weather - Get weather data
POST /sos - Create emergency alert
WS /ws - Real-time WebSocket updates
```

### Mock API Endpoints (for development)
```
/api/mock/community-reports
/api/mock/marine-warnings
/api/mock/official-alerts
/api/mock/social-media
/api/mock/dynamic-hotspots
/api/mock/marine-weather
```

## 🛠️ Development vs Production

### Development Mode (Default)
- Uses mock data
- No API keys required
- Faster development
- Predictable data

### Production Mode
- Uses real APIs
- Requires valid API keys
- Real-time data
- Live emergency information

## 🚨 Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Check your `.env` file has the correct key names
   - Restart the development server
   - Verify the API key is valid

2. **"Network request failed" error**
   - Check internet connection
   - Verify API endpoints are accessible
   - Check API rate limits

3. **"WebSocket connection failed" error**
   - Real-time updates require WebSocket support
   - App falls back to polling every 30 seconds
   - This is normal behavior

### Debug Mode
Enable debug logging by adding to your `.env`:
```env
DEBUG=true
NODE_ENV=development
```

## 📈 API Usage Monitoring

### Mapbox
- Monitor usage at: [Mapbox Account Usage](https://account.mapbox.com/)
- Free tier: 50,000 map loads/month
- Upgrade if you exceed limits

### OpenWeatherMap
- Monitor usage at: [OpenWeatherMap Dashboard](https://home.openweathermap.org/api_keys)
- Free tier: 1,000 calls/day
- Consider upgrading for production

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
   - `.env` file should be in `.gitignore`
   - Use environment variables in production

2. **Use API key restrictions**
   - Restrict Mapbox keys to specific domains
   - Use environment-specific keys

3. **Monitor API usage**
   - Set up alerts for unusual usage
   - Regularly rotate API keys

## 🚀 Deployment

### For Production Deployment

1. **Set environment variables in your hosting platform**
2. **Update API endpoints to production URLs**
3. **Enable WebSocket support**
4. **Configure proper error handling**

### Example Production Environment Variables
```env
API_BASE_URL=https://api.coast-kavach.com
NODE_ENV=production
USE_MOCK_API=false
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your API keys are valid
3. Check network connectivity
4. Review API documentation for each service

---

**Ready to save lives with real-time coastal data! 🌊⚡🚨**
