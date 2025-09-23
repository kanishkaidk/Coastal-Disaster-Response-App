// Mock API endpoints for development
export const MOCK_ENDPOINTS = {
  reports: '/api/mock/community-reports',
  warnings: '/api/mock/marine-warnings', 
  alerts: '/api/mock/official-alerts',
  social: '/api/mock/social-media',
  hotspots: '/api/mock/dynamic-hotspots',
  weather: '/api/mock/marine-weather'
};

// Mock data generators
export const generateMockReports = (count: number = 50) => {
  const types = ['flood', 'storm', 'erosion', 'pollution', 'infrastructure'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const coastalAreas = [
    { name: 'Mumbai Coast', lat: 19.0760, lng: 72.8777 },
    { name: 'Goa Beach', lat: 15.2993, lng: 74.1240 },
    { name: 'Kerala Backwaters', lat: 9.9312, lng: 76.2673 },
    { name: 'Chennai Marina', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata Port', lat: 22.5726, lng: 88.3639 },
    { name: 'Vizag Harbor', lat: 17.6868, lng: 83.2185 },
    { name: 'Puri Beach', lat: 19.8135, lng: 85.8312 },
    { name: 'Kochi Port', lat: 9.9674, lng: 76.2458 }
  ];

  return Array.from({ length: count }, (_, i) => {
    const area = coastalAreas[Math.floor(Math.random() * coastalAreas.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    return {
      id: `report-${i}`,
      type,
      severity,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert`,
      description: `Community report about ${type} in ${area.name} area. Immediate attention required.`,
      latitude: area.lat + (Math.random() - 0.5) * 0.1,
      longitude: area.lng + (Math.random() - 0.5) * 0.1,
      timestamp: timestamp.toISOString(),
      author: `User${Math.floor(Math.random() * 1000)}`,
      trustScore: Math.random() * 100,
      media: Math.random() > 0.7 ? ['photo1.jpg', 'video1.mp4'] : [],
      reportCount: Math.floor(Math.random() * 10) + 1
    };
  });
};

export const generateMockWarnings = (count: number = 20) => {
  const warningTypes = ['cyclone', 'tsunami', 'high-tide', 'storm-surge', 'flood-warning'];
  const severities = ['medium', 'high', 'critical'];
  const coastalAreas = [
    { name: 'Andaman Islands', lat: 11.7401, lng: 92.6586 },
    { name: 'Lakshadweep', lat: 10.5667, lng: 72.6417 },
    { name: 'Odisha Coast', lat: 20.2961, lng: 85.8245 },
    { name: 'Tamil Nadu Coast', lat: 11.1271, lng: 78.6569 }
  ];

  return Array.from({ length: count }, (_, i) => {
    const area = coastalAreas[Math.floor(Math.random() * coastalAreas.length)];
    const type = warningTypes[Math.floor(Math.random() * warningTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const timestamp = new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000);
    
    return {
      id: `warning-${i}`,
      type,
      severity,
      title: `Official ${type.toUpperCase()} Warning`,
      description: `IMD/NDMA official warning for ${area.name}. ${severity.toUpperCase()} severity.`,
      latitude: area.lat + (Math.random() - 0.5) * 0.2,
      longitude: area.lng + (Math.random() - 0.5) * 0.2,
      timestamp: timestamp.toISOString(),
      issuedBy: 'IMD/NDMA',
      trustScore: 95 + Math.random() * 5,
      affectedRadius: Math.random() * 100 + 50, // km
      estimatedImpact: Math.floor(Math.random() * 100000) + 10000
    };
  });
};

export const generateMockSocialMedia = (count: number = 30) => {
  const platforms = ['twitter', 'facebook', 'youtube', 'instagram'];
  const coastalAreas = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Goa', lat: 15.2993, lng: 74.1240 },
    { name: 'Kerala', lat: 9.9312, lng: 76.2673 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 }
  ];

  return Array.from({ length: count }, (_, i) => {
    const area = coastalAreas[Math.floor(Math.random() * coastalAreas.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const timestamp = new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000);
    
    return {
      id: `social-${i}`,
      platform,
      content: `Heavy rainfall and strong winds in ${area.name} coastal area. Stay safe everyone! #CoastalWeather #StaySafe`,
      latitude: area.lat + (Math.random() - 0.5) * 0.05,
      longitude: area.lng + (Math.random() - 0.5) * 0.05,
      timestamp: timestamp.toISOString(),
      author: `@user${Math.floor(Math.random() * 1000)}`,
      engagement: Math.floor(Math.random() * 1000) + 10,
      sentiment: Math.random() > 0.3 ? 'positive' : 'negative'
    };
  });
};

export const generateMockWeather = () => {
  return {
    temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
    humidity: Math.floor(Math.random() * 30) + 70, // 70-100%
    windSpeed: Math.floor(Math.random() * 50) + 10, // 10-60 km/h
    windDirection: Math.floor(Math.random() * 360),
    waveHeight: Math.random() * 3 + 0.5, // 0.5-3.5m
    visibility: Math.floor(Math.random() * 10) + 5, // 5-15km
    pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
    condition: ['clear', 'cloudy', 'rainy', 'stormy'][Math.floor(Math.random() * 4)]
  };
};

// Mock API service
export class MockApiService {
  private static reports = generateMockReports(50);
  private static warnings = generateMockWarnings(20);
  private static socialMedia = generateMockSocialMedia(30);
  private static weather = generateMockWeather();

  static getReports(filters?: any) {
    let filteredReports = [...this.reports];
    
    if (filters?.severity) {
      filteredReports = filteredReports.filter(r => r.severity === filters.severity);
    }
    if (filters?.type) {
      filteredReports = filteredReports.filter(r => r.type === filters.type);
    }
    if (filters?.location) {
      // Filter by location radius (simplified)
      filteredReports = filteredReports.filter(r => 
        Math.abs(r.latitude - filters.location.lat) < 0.5 &&
        Math.abs(r.longitude - filters.location.lng) < 0.5
      );
    }

    return Promise.resolve({
      data: filteredReports,
      total: filteredReports.length,
      timestamp: new Date().toISOString()
    });
  }

  static getWarnings(filters?: any) {
    let filteredWarnings = [...this.warnings];
    
    if (filters?.severity) {
      filteredWarnings = filteredWarnings.filter(w => w.severity === filters.severity);
    }

    return Promise.resolve({
      data: filteredWarnings,
      total: filteredWarnings.length,
      timestamp: new Date().toISOString()
    });
  }

  static getSocialMedia(filters?: any) {
    let filteredSocial = [...this.socialMedia];
    
    if (filters?.platform) {
      filteredSocial = filteredSocial.filter(s => s.platform === filters.platform);
    }

    return Promise.resolve({
      data: filteredSocial,
      total: filteredSocial.length,
      timestamp: new Date().toISOString()
    });
  }

  static getWeather() {
    return Promise.resolve({
      data: this.weather,
      timestamp: new Date().toISOString()
    });
  }

  static getHotspots() {
    // Generate dynamic hotspots based on report density
    const hotspots = [];
    const reportGroups = new Map();
    
    // Group reports by proximity
    this.reports.forEach(report => {
      const key = `${Math.floor(report.latitude * 100)},${Math.floor(report.longitude * 100)}`;
      if (!reportGroups.has(key)) {
        reportGroups.set(key, []);
      }
      reportGroups.get(key).push(report);
    });

    // Create hotspots from groups with 3+ reports
    reportGroups.forEach((reports, key) => {
      if (reports.length >= 3) {
        const avgLat = reports.reduce((sum, r) => sum + r.latitude, 0) / reports.length;
        const avgLng = reports.reduce((sum, r) => sum + r.longitude, 0) / reports.length;
        const maxSeverity = reports.reduce((max, r) => {
          const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          return severityOrder[r.severity] > severityOrder[max] ? r.severity : max;
        }, 'low');
        
        hotspots.push({
          id: `hotspot-${key}`,
          latitude: avgLat,
          longitude: avgLng,
          intensity: Math.min(reports.length / 10, 1),
          severity: maxSeverity,
          reportCount: reports.length,
          radius: reports.length * 5 + 20, // km
          timestamp: new Date().toISOString()
        });
      }
    });

    return Promise.resolve({
      data: hotspots,
      total: hotspots.length,
      timestamp: new Date().toISOString()
    });
  }

  // Simulate real-time updates
  static startRealTimeUpdates(callback: (data: any) => void) {
    setInterval(() => {
      // Randomly add new reports
      if (Math.random() > 0.7) {
        const newReports = generateMockReports(1);
        this.reports.push(...newReports);
        callback({ type: 'new_reports', data: newReports });
      }
      
      // Update weather
      this.weather = generateMockWeather();
      callback({ type: 'weather_update', data: this.weather });
    }, 30000); // Update every 30 seconds
  }
}
