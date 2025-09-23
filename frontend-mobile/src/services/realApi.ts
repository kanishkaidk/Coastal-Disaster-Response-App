import Constants from 'expo-constants';

// Get environment variables
const getEnvVar = (key: string): string => {
  return Constants.expoConfig?.extra?.[key] || process.env[key] || '';
};

export const API_CONFIG = {
  MAPBOX_ACCESS_TOKEN: getEnvVar('MAPBOX_ACCESS_TOKEN'),
  OPENWEATHER_API_KEY: getEnvVar('OPENWEATHER_API_KEY'),
  API_BASE_URL: getEnvVar('API_BASE_URL') || 'https://api.coast-kavach.com',
  MAPBOX_STYLE_URL: getEnvVar('MAPBOX_STYLE_URL') || 'mapbox://styles/mapbox/satellite-streets-v11',
  API_TIMEOUT: parseInt(getEnvVar('API_TIMEOUT') || '30000'),
  
  // Government APIs
  IMD_API_URL: getEnvVar('IMD_API_URL') || 'https://city.imd.gov.in/api/cityweather.php?id=42182',
  NDMA_API_URL: getEnvVar('NDMA_API_URL') || 'https://sachet.ndma.gov.in',
  INCOIS_LAS_URL: getEnvVar('INCOIS_LAS_URL') || 'https://las.incois.gov.in/thredds/catalog.xml',
  INCOIS_ERDDAP_URL: getEnvVar('INCOIS_ERDDAP_URL') || 'https://erddap.incois.gov.in/erddap/index.json',
  INCOIS_PFZ_URL: getEnvVar('INCOIS_PFZ_URL') || 'https://incois.gov.in/MarineFisheries/PfzAdvisory',
  
  // Social Media APIs
  TWITTER_API_KEY: getEnvVar('TWITTER_API_KEY'),
  TWITTER_API_SECRET: getEnvVar('TWITTER_API_SECRET'),
  FACEBOOK_APP_ID: getEnvVar('FACEBOOK_APP_ID'),
};

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface CoastalReport {
  id: string;
  type: 'hazard' | 'warning' | 'sos' | 'forum' | 'social';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  author?: string;
  trustScore?: number;
  media?: string[];
  reportCount?: number;
  affectedRadius?: number;
  estimatedImpact?: number;
  platform?: string;
  engagement?: number;
  sentiment?: string;
}

export interface Hotspot {
  id: string;
  latitude: number;
  longitude: number;
  intensity: number;
  severity: string;
  reportCount: number;
  radius: number;
  timestamp: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  visibility: number;
  pressure: number;
  condition: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube';
  content: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  author: string;
  engagement: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  hashtags: string[];
  mediaUrls: string[];
}

export interface GovernmentAlert {
  id: string;
  type: 'cyclone' | 'tsunami' | 'flood' | 'storm-surge' | 'high-tide';
  severity: 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  affectedRadius: number;
  estimatedImpact: number;
  timestamp: string;
  issuedBy: string;
  trustScore: number;
  evacuationZones: Array<{
    latitude: number;
    longitude: number;
    radius: number;
  }>;
}

// Real API Service Class
export class RealApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.API_BASE_URL;
    this.timeout = API_CONFIG.API_TIMEOUT;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Coastal Reports API
  async getReports(filters?: {
    type?: string;
    severity?: string;
    location?: { lat: number; lng: number; radius?: number };
    timeRange?: { start: string; end: string };
    limit?: number;
  }): Promise<ApiResponse<CoastalReport[]>> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.location) {
      params.append('lat', filters.location.lat.toString());
      params.append('lng', filters.location.lng.toString());
      if (filters.location.radius) {
        params.append('radius', filters.location.radius.toString());
      }
    }
    if (filters?.timeRange) {
      params.append('start', filters.timeRange.start);
      params.append('end', filters.timeRange.end);
    }

    return this.makeRequest<CoastalReport[]>(`/reports?${params.toString()}`);
  }

  async createReport(report: Omit<CoastalReport, 'id' | 'timestamp'>): Promise<ApiResponse<CoastalReport>> {
    return this.makeRequest<CoastalReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  // Government Alerts API using IMD APIs
  async getGovernmentAlerts(filters?: {
    severity?: string;
    type?: string;
    location?: { lat: number; lng: number; radius?: number };
  }): Promise<ApiResponse<GovernmentAlert[]>> {
    try {
      // Use IMD District Wise Warning API
      const response = await fetch('https://mausam.imd.gov.in/api/warnings_district_api.php');
      
      if (!response.ok) {
        throw new Error(`IMD API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform IMD data to our format
      const alerts: GovernmentAlert[] = data.map((item: any, index: number) => ({
        id: `imd-alert-${index}`,
        type: 'cyclone', // Default type, could be parsed from item
        severity: 'high', // Default severity
        title: item.title || 'IMD Weather Warning',
        description: item.description || 'Weather warning from IMD',
        latitude: item.lat || 0,
        longitude: item.lng || 0,
        affectedRadius: 50, // Default radius
        estimatedImpact: 10000,
        timestamp: new Date().toISOString(),
        issuedBy: 'IMD',
        trustScore: 95,
        evacuationZones: []
      }));

      return {
        data: alerts,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('IMD API error:', error);
      // Fallback to mock data
      return this.getMockAlerts();
    }
  }

  private async getMockAlerts(): Promise<ApiResponse<GovernmentAlert[]>> {
    // Return some mock IMD-style alerts
    const mockAlerts: GovernmentAlert[] = [
      {
        id: 'imd-mock-1',
        type: 'cyclone',
        severity: 'high',
        title: 'Cyclone Warning - Coastal Areas',
        description: 'IMD has issued a cyclone warning for coastal districts. Citizens are advised to take precautions.',
        latitude: 19.0760,
        longitude: 72.8777,
        affectedRadius: 100,
        estimatedImpact: 50000,
        timestamp: new Date().toISOString(),
        issuedBy: 'IMD',
        trustScore: 95,
        evacuationZones: []
      }
    ];

    return {
      data: mockAlerts,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  // Weather API - Try IMD first, fallback to OpenWeather
  async getWeatherData(location: { latitude: number; longitude: number }): Promise<ApiResponse<WeatherData>> {
    try {
      // Try IMD Current Weather API first
      const imdResponse = await fetch('https://mausam.imd.gov.in/api/current_wx_api.php');
      
      if (imdResponse.ok) {
        const imdData = await imdResponse.json();
        
        // Transform IMD data to our format
        const weatherData: WeatherData = {
          temperature: imdData.temperature || 25,
          humidity: imdData.humidity || 70,
          windSpeed: imdData.wind_speed || 10,
          windDirection: imdData.wind_direction || 0,
          waveHeight: 1.5, // Default wave height for coastal areas
          visibility: 10, // Default visibility
          pressure: imdData.mslp || 1013,
          condition: 'clear', // Default condition
          location: {
            name: imdData.station || 'Coastal Station',
            latitude: location.latitude,
            longitude: location.longitude,
          },
        };

        return {
          data: weatherData,
          success: true,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (imdError) {
      console.log('IMD Weather API not available, trying OpenWeather...');
    }

    // Fallback to OpenWeather if IMD fails
    if (API_CONFIG.OPENWEATHER_API_KEY) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_CONFIG.OPENWEATHER_API_KEY}&units=metric`
        );

        if (response.ok) {
          const data = await response.json();
          
          const weatherData: WeatherData = {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
            windDirection: data.wind.deg,
            waveHeight: 1.5, // Default for coastal areas
            visibility: data.visibility / 1000, // Convert m to km
            pressure: data.main.pressure,
            condition: data.weather[0].main.toLowerCase(),
            location: {
              name: data.name,
              latitude: data.coord.lat,
              longitude: data.coord.lon,
            },
          };

          return {
            data: weatherData,
            success: true,
            timestamp: new Date().toISOString(),
          };
        }
      } catch (openWeatherError) {
        console.log('OpenWeather API also failed');
      }
    }

    // Final fallback to mock data
    return this.getMockWeatherData(location);
  }

  private async getMockWeatherData(location: { latitude: number; longitude: number }): Promise<ApiResponse<WeatherData>> {
    const weatherData: WeatherData = {
      temperature: 28,
      humidity: 75,
      windSpeed: 15,
      windDirection: 180,
      waveHeight: 2.0,
      visibility: 8,
      pressure: 1013,
      condition: 'partly-cloudy',
      location: {
        name: 'Coastal Station',
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };

    return {
      data: weatherData,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  // INCOIS Ocean Data API
  async getOceanData(filters?: {
    location?: { lat: number; lng: number; radius?: number };
    dataType?: 'sst' | 'chlorophyll' | 'wave' | 'current';
  }): Promise<ApiResponse<any[]>> {
    try {
      // Use INCOIS ERDDAP for ocean data
      const response = await fetch(API_CONFIG.INCOIS_ERDDAP_URL);
      
      if (!response.ok) {
        throw new Error(`INCOIS API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform INCOIS data to our format
      const oceanData = data.datasets?.map((dataset: any, index: number) => ({
        id: `incois-${index}`,
        type: 'ocean_data',
        title: dataset.title || 'Ocean Data',
        description: dataset.summary || 'INCOIS oceanographic data',
        latitude: filters?.location?.lat || 0,
        longitude: filters?.location?.lng || 0,
        severity: 'low',
        timestamp: new Date().toISOString(),
        dataType: filters?.dataType || 'sst',
        source: 'INCOIS',
        trustScore: 98
      })) || [];

      return {
        data: oceanData,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('INCOIS API error:', error);
      return this.getMockOceanData();
    }
  }

  private async getMockOceanData(): Promise<ApiResponse<any[]>> {
    const mockData = [
      {
        id: 'incois-mock-1',
        type: 'ocean_data',
        title: 'Sea Surface Temperature',
        description: 'Current SST readings from INCOIS',
        latitude: 19.0760,
        longitude: 72.8777,
        severity: 'low',
        timestamp: new Date().toISOString(),
        dataType: 'sst',
        source: 'INCOIS',
        trustScore: 98
      }
    ];

    return {
      data: mockData,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  // Social Media API (Twitter/X only for now)
  async getSocialMediaPosts(filters?: {
    platform?: string;
    location?: { lat: number; lng: number; radius?: number };
    hashtags?: string[];
    timeRange?: { start: string; end: string };
    limit?: number;
  }): Promise<ApiResponse<SocialMediaPost[]>> {
    const params = new URLSearchParams();
    
    if (filters?.platform) params.append('platform', filters.platform);
    if (filters?.location) {
      params.append('lat', filters.location.lat.toString());
      params.append('lng', filters.location.lng.toString());
      if (filters.location.radius) {
        params.append('radius', filters.location.radius.toString());
      }
    }
    if (filters?.hashtags) {
      params.append('hashtags', filters.hashtags.join(','));
    }
    if (filters?.timeRange) {
      params.append('start', filters.timeRange.start);
      params.append('end', filters.timeRange.end);
    }
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return this.makeRequest<SocialMediaPost[]>(`/social?${params.toString()}`);
  }

  // Hotspots API
  async getHotspots(filters?: {
    location?: { lat: number; lng: number; radius?: number };
    minIntensity?: number;
    severity?: string;
  }): Promise<ApiResponse<Hotspot[]>> {
    const params = new URLSearchParams();
    
    if (filters?.location) {
      params.append('lat', filters.location.lat.toString());
      params.append('lng', filters.location.lng.toString());
      if (filters.location.radius) {
        params.append('radius', filters.location.radius.toString());
      }
    }
    if (filters?.minIntensity) params.append('minIntensity', filters.minIntensity.toString());
    if (filters?.severity) params.append('severity', filters.severity);

    return this.makeRequest<Hotspot[]>(`/hotspots?${params.toString()}`);
  }

  // SOS Emergency API
  async createSOSAlert(alert: {
    latitude: number;
    longitude: number;
    message: string;
    emergencyType: string;
    contactInfo: string;
  }): Promise<ApiResponse<CoastalReport>> {
    return this.makeRequest<CoastalReport>('/sos', {
      method: 'POST',
      body: JSON.stringify({
        ...alert,
        type: 'sos',
        severity: 'critical',
        title: 'SOS Emergency Alert',
      }),
    });
  }

  async getSOSAlerts(status?: 'active' | 'resolved'): Promise<ApiResponse<CoastalReport[]>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    return this.makeRequest<CoastalReport[]>(`/sos?${params.toString()}`);
  }

  // Real-time updates via WebSocket
  startRealTimeUpdates(callback: (data: any) => void): WebSocket | null {
    if (!this.baseURL.includes('wss://') && !this.baseURL.includes('ws://')) {
      console.warn('Real-time updates require WebSocket support. Using polling instead.');
      // Fallback to polling every 30 seconds
      setInterval(async () => {
        try {
          const [reports, alerts, hotspots] = await Promise.all([
            this.getReports({ limit: 10 }),
            this.getGovernmentAlerts(),
            this.getHotspots(),
          ]);
          
          callback({
            type: 'update',
            data: {
              reports: reports.data,
              alerts: alerts.data,
              hotspots: hotspots.data,
            },
          });
        } catch (error) {
          console.error('Real-time update failed:', error);
        }
      }, 30000);
      
      return null;
    }

    try {
      const wsUrl = this.baseURL.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
      const ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('WebSocket message parsing failed:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          this.startRealTimeUpdates(callback);
        }, 5000);
      };

      return ws;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const realApiService = new RealApiService();
