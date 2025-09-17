import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

class LocationService {
  private currentLocation: LocationData | null = null;
  private watchId: Location.LocationSubscription | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this app. Please enable it in settings.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        Alert.alert(
          'Background Location',
          'Background location permission is recommended for emergency features.',
          [{ text: 'OK' }]
        );
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        altitude: location.coords.altitude || undefined,
        heading: location.coords.heading || undefined,
        speed: location.coords.speed || undefined,
      };

      this.currentLocation = locationData;
      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your GPS settings.',
        [{ text: 'OK' }]
      );
      return null;
    }
  }

  async watchLocation(
    callback: (location: LocationData) => void,
    options?: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    }
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return false;

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || Location.Accuracy.High,
          timeInterval: options?.timeInterval || 1000,
          distanceInterval: options?.distanceInterval || 1,
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || undefined,
            altitude: location.coords.altitude || undefined,
            heading: location.coords.heading || undefined,
            speed: location.coords.speed || undefined,
          };

          this.currentLocation = locationData;
          callback(locationData);
        }
      );

      return true;
    } catch (error) {
      console.error('Error watching location:', error);
      return false;
    }
  }

  stopWatchingLocation(): void {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  getLastKnownLocation(): LocationData | null {
    return this.currentLocation;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result.length > 0) {
        const address = result[0];
        // Create a more detailed address for Indian locations
        const parts = [];
        
        // Add street/area if available
        if (address.street) {
          parts.push(address.street);
        }
        
        // Add district/city
        if (address.district) {
          parts.push(address.district);
        } else if (address.city) {
          parts.push(address.city);
        }
        
        // Add state
        if (address.region) {
          parts.push(address.region);
        }
        
        // Add postal code if available
        if (address.postalCode) {
          parts.push(address.postalCode);
        }
        
        // Add country
        if (address.country) {
          parts.push(address.country);
        }

        const fullAddress = parts.join(', ');
        
        // If we have a good address, return it
        if (fullAddress.length > 10) {
          return fullAddress;
        }
      }

      // Fallback: Try to get a more specific location using coordinates
      return this.getLocationFromCoordinates(latitude, longitude);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return this.getLocationFromCoordinates(latitude, longitude);
    }
  }

  private getLocationFromCoordinates(latitude: number, longitude: number): string {
    // Indian coastal regions mapping
    const coastalRegions = [
      { lat: 8.0883, lng: 77.5385, name: 'Kanyakumari, Tamil Nadu' },
      { lat: 9.9252, lng: 78.1198, name: 'Madurai, Tamil Nadu' },
      { lat: 11.0168, lng: 76.9558, name: 'Coimbatore, Tamil Nadu' },
      { lat: 12.9716, lng: 77.5946, name: 'Bangalore, Karnataka' },
      { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
      { lat: 15.2993, lng: 74.1240, name: 'Goa' },
      { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana' },
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
      { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar, Odisha' },
      { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal' },
      { lat: 25.5941, lng: 85.1376, name: 'Patna, Bihar' },
      { lat: 28.7041, lng: 77.1025, name: 'New Delhi' },
      { lat: 30.7333, lng: 76.7794, name: 'Chandigarh' },
      { lat: 33.7782, lng: 78.4742, name: 'Leh, Ladakh' }
    ];

    // Find the closest coastal region
    let closestRegion = coastalRegions[0];
    let minDistance = this.calculateDistance(latitude, longitude, closestRegion.lat, closestRegion.lng);

    for (const region of coastalRegions) {
      const distance = this.calculateDistance(latitude, longitude, region.lat, region.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closestRegion = region;
      }
    }

    // If very close to a known region, use that
    if (minDistance < 50) { // Within 50km
      return closestRegion.name;
    }

    // Otherwise return coordinates with region context
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Near ${closestRegion.name})`;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const locationService = new LocationService();
export default locationService;
