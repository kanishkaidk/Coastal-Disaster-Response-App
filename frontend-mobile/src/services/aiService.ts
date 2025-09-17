// AI/ML Service for Coast-Kavach
// This service provides AI-powered features for warnings, reports, and content analysis

export interface AIAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high';
  trustScore: number; // 0-100
  isSpam: boolean;
  summary: string;
  translatedText?: string;
  keywords: string[];
  riskLevel: 'minimal' | 'moderate' | 'high' | 'extreme';
}

export interface LocationAnalysis {
  riskZone: 'safe' | 'caution' | 'danger' | 'critical';
  historicalData: {
    floodRisk: number;
    stormRisk: number;
    erosionRisk: number;
  };
  recommendations: string[];
}

class AIService {
  // Analyze warning content for severity and urgency
  analyzeWarning(content: string, location?: { latitude: number; longitude: number }): AIAnalysis {
    const keywords = this.extractKeywords(content);
    const severity = this.calculateSeverity(content, keywords);
    const urgency = this.calculateUrgency(content, keywords);
    const trustScore = this.calculateTrustScore(content, keywords);
    const isSpam = this.detectSpam(content);
    const summary = this.generateSummary(content);
    const riskLevel = this.calculateRiskLevel(severity, urgency, location);

    return {
      severity,
      urgency,
      trustScore,
      isSpam,
      summary,
      keywords,
      riskLevel
    };
  }

  // Analyze report content for validation and categorization
  analyzeReport(content: string, mediaCount: number, location?: { latitude: number; longitude: number }): AIAnalysis {
    const keywords = this.extractKeywords(content);
    const severity = this.calculateSeverity(content, keywords);
    const urgency = this.calculateUrgency(content, keywords);
    const trustScore = this.calculateTrustScore(content, keywords, mediaCount);
    const isSpam = this.detectSpam(content);
    const summary = this.generateSummary(content);
    const riskLevel = this.calculateRiskLevel(severity, urgency, location);

    return {
      severity,
      urgency,
      trustScore,
      isSpam,
      summary,
      keywords,
      riskLevel
    };
  }

  // Analyze location for risk assessment
  analyzeLocation(latitude: number, longitude: number): LocationAnalysis {
    // Mock location analysis based on coordinates
    const isCoastal = this.isCoastalLocation(latitude, longitude);
    const floodRisk = this.calculateFloodRisk(latitude, longitude);
    const stormRisk = this.calculateStormRisk(latitude, longitude);
    const erosionRisk = this.calculateErosionRisk(latitude, longitude);

    const riskZone = this.determineRiskZone(floodRisk, stormRisk, erosionRisk);
    const recommendations = this.generateRecommendations(riskZone, isCoastal);

    return {
      riskZone,
      historicalData: {
        floodRisk,
        stormRisk,
        erosionRisk
      },
      recommendations
    };
  }

  // Translate text to multiple languages
  translateText(text: string, targetLanguage: string): string {
    // Mock translation - in real app, this would call translation API
    const translations: { [key: string]: { [key: string]: string } } = {
      'High tide warning': {
        'hi': 'उच्च ज्वार चेतावनी',
        'bn': 'উচ্চ জোয়ার সতর্কতা',
        'ta': 'உயர் அலை எச்சரிக்கை',
        'te': 'అధిక వేలు హెచ్చరిక',
        'mr': 'उच्च ज्वार चेतावनी'
      },
      'Storm alert': {
        'hi': 'तूफान चेतावनी',
        'bn': 'ঝড় সতর্কতা',
        'ta': 'புயல் எச்சரிக்கை',
        'te': 'తుఫాన్ హెచ్చరిక',
        'mr': 'वादळ चेतावनी'
      },
      'Flood report': {
        'hi': 'बाढ़ रिपोर्ट',
        'bn': 'বন্যা রিপোর্ট',
        'ta': 'வெள்ளம் அறிக்கை',
        'te': 'వరద నివేదిక',
        'mr': 'पूर अहवाल'
      }
    };

    return translations[text]?.[targetLanguage] || text;
  }

  // Calculate expiration time based on severity and type
  calculateExpirationTime(severity: string, type: string): Date {
    const now = new Date();
    let hoursToAdd = 24; // Default 24 hours

    // Severity-based expiration
    switch (severity) {
      case 'critical':
        hoursToAdd = 72; // 3 days for critical warnings
        break;
      case 'high':
        hoursToAdd = 48; // 2 days for high severity
        break;
      case 'medium':
        hoursToAdd = 24; // 1 day for medium
        break;
      case 'low':
        hoursToAdd = 12; // 12 hours for low
        break;
    }

    // Type-based adjustments
    if (type.includes('storm') || type.includes('cyclone')) {
      hoursToAdd = Math.max(hoursToAdd, 72); // Storms last at least 3 days
    } else if (type.includes('tide') || type.includes('flood')) {
      hoursToAdd = Math.max(hoursToAdd, 48); // Tides/floods last at least 2 days
    } else if (type.includes('erosion')) {
      hoursToAdd = Math.max(hoursToAdd, 168); // Erosion warnings last 1 week
    }

    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  }

  // Check if a warning/report should be expired
  shouldExpire(createdAt: Date, severity: string, type: string): boolean {
    const expirationTime = this.calculateExpirationTime(severity, type);
    return new Date() > expirationTime;
  }

  // Get time remaining until expiration
  getTimeUntilExpiration(createdAt: Date, severity: string, type: string): string {
    const expirationTime = this.calculateExpirationTime(severity, type);
    const now = new Date();
    const diffMs = expirationTime.getTime() - now.getTime();

    if (diffMs <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    } else {
      const minutes = Math.floor(diffMs / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
    }
  }

  // Auto-cleanup expired warnings/reports
  cleanupExpiredItems(items: any[]): any[] {
    return items.filter(item => {
      if (!item.createdAt || !item.severity || !item.type) return true;
      
      const createdAt = new Date(item.createdAt);
      return !this.shouldExpire(createdAt, item.severity, item.type);
    });
  }

  // Private helper methods
  private extractKeywords(text: string): string[] {
    const keywords = text.toLowerCase().match(/\b(flood|storm|tide|wave|wind|rain|damage|danger|emergency|evacuate|warning|alert|critical|urgent|coastal|beach|sea|ocean|water|rising|falling|erosion|pollution|infrastructure|bridge|road|building|house|people|safety|rescue|help|sos)\b/g);
    return keywords ? [...new Set(keywords)] : [];
  }

  private calculateSeverity(content: string, keywords: string[]): 'low' | 'medium' | 'high' | 'critical' {
    const criticalWords = ['critical', 'emergency', 'evacuate', 'danger', 'urgent', 'sos'];
    const highWords = ['warning', 'alert', 'flood', 'storm', 'damage'];
    const mediumWords = ['caution', 'rising', 'falling', 'water'];

    const criticalCount = keywords.filter(k => criticalWords.includes(k)).length;
    const highCount = keywords.filter(k => highWords.includes(k)).length;
    const mediumCount = keywords.filter(k => mediumWords.includes(k)).length;

    if (criticalCount > 0) return 'critical';
    if (highCount >= 2) return 'high';
    if (highCount >= 1 || mediumCount >= 2) return 'medium';
    return 'low';
  }

  private calculateUrgency(content: string, keywords: string[]): 'low' | 'medium' | 'high' {
    const urgentWords = ['now', 'immediate', 'urgent', 'emergency', 'evacuate', 'critical'];
    const urgentCount = keywords.filter(k => urgentWords.includes(k)).length;
    
    if (urgentCount >= 2) return 'high';
    if (urgentCount >= 1) return 'medium';
    return 'low';
  }

  private calculateTrustScore(content: string, keywords: string[], mediaCount: number = 0): number {
    let score = 50; // Base score

    // Length bonus
    if (content.length > 50) score += 10;
    if (content.length > 100) score += 10;

    // Keyword bonus
    if (keywords.length > 3) score += 10;
    if (keywords.length > 5) score += 10;

    // Media bonus
    score += mediaCount * 5;

    // Specific keyword bonuses
    if (keywords.includes('flood') || keywords.includes('storm')) score += 10;
    if (keywords.includes('emergency') || keywords.includes('sos')) score += 15;

    return Math.min(100, Math.max(0, score));
  }

  private detectSpam(content: string): boolean {
    const spamIndicators = [
      /(.)\1{4,}/, // Repeated characters
      /[A-Z]{10,}/, // All caps
      /https?:\/\/\S+/, // URLs
      /@\w+/g, // Mentions
      /\$\d+/g // Money amounts
    ];

    return spamIndicators.some(pattern => pattern.test(content));
  }

  private generateSummary(content: string): string {
    // Simple extractive summarization
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length <= 2) return content;
    
    // Take first and most important sentence
    const firstSentence = sentences[0].trim();
    const importantSentence = sentences.find(s => 
      s.toLowerCase().includes('warning') || 
      s.toLowerCase().includes('alert') ||
      s.toLowerCase().includes('danger')
    ) || sentences[1];

    return `${firstSentence}. ${importantSentence.trim()}.`;
  }

  private calculateRiskLevel(severity: string, urgency: string, location?: { latitude: number; longitude: number }): 'minimal' | 'moderate' | 'high' | 'extreme' {
    if (severity === 'critical' || urgency === 'high') return 'extreme';
    if (severity === 'high') return 'high';
    if (severity === 'medium' || urgency === 'medium') return 'moderate';
    return 'minimal';
  }

  private isCoastalLocation(lat: number, lng: number): boolean {
    // Mock coastal detection - in real app, this would use geographic data
    return lat > 8 && lat < 37 && lng > 68 && lng < 97; // India coastal region
  }

  private calculateFloodRisk(lat: number, lng: number): number {
    // Mock flood risk calculation
    return Math.random() * 100;
  }

  private calculateStormRisk(lat: number, lng: number): number {
    // Mock storm risk calculation
    return Math.random() * 100;
  }

  private calculateErosionRisk(lat: number, lng: number): number {
    // Mock erosion risk calculation
    return Math.random() * 100;
  }

  private determineRiskZone(floodRisk: number, stormRisk: number, erosionRisk: number): 'safe' | 'caution' | 'danger' | 'critical' {
    const avgRisk = (floodRisk + stormRisk + erosionRisk) / 3;
    if (avgRisk > 80) return 'critical';
    if (avgRisk > 60) return 'danger';
    if (avgRisk > 30) return 'caution';
    return 'safe';
  }

  private generateRecommendations(riskZone: string, isCoastal: boolean): string[] {
    const recommendations: string[] = [];

    switch (riskZone) {
      case 'critical':
        recommendations.push('Evacuate immediately');
        recommendations.push('Contact emergency services');
        recommendations.push('Avoid coastal areas');
        break;
      case 'danger':
        recommendations.push('Stay indoors');
        recommendations.push('Monitor weather updates');
        recommendations.push('Prepare emergency supplies');
        break;
      case 'caution':
        recommendations.push('Be alert to changing conditions');
        recommendations.push('Avoid unnecessary travel');
        break;
      default:
        recommendations.push('Continue normal activities');
        recommendations.push('Stay informed');
    }

    if (isCoastal) {
      recommendations.push('Monitor tide levels');
      recommendations.push('Check local advisories');
    }

    return recommendations;
  }
}

export const aiService = new AIService();
export default aiService;
