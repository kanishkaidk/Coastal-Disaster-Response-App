import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export interface MediaFile {
  uri: string;
  type: 'image' | 'video' | 'audio';
  name: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // for video/audio
}

class CameraService {
  async requestPermissions(): Promise<boolean> {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'Camera permission is required to take photos and videos.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Try to get media library permission, but don't fail if it's not available
      try {
        const mediaPermission = await MediaLibrary.requestPermissionsAsync();
        if (mediaPermission.status !== 'granted') {
          console.log('Media library permission not granted, but camera is available');
        }
      } catch (mediaError) {
        console.log('Media library permission not available, continuing with camera only');
      }

      return true;
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  async takePhoto(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: 'image',
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        size: asset.fileSize || 0,
        width: asset.width,
        height: asset.height,
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  async recordVideo(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        videoMaxDuration: 60, // 1 minute max
        quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: 'video',
        name: asset.fileName || `video_${Date.now()}.mp4`,
        size: asset.fileSize || 0,
        width: asset.width,
        height: asset.height,
        duration: asset.duration || 0,
      };
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
      return null;
    }
  }

  async pickFromGallery(type: 'image' | 'video' | 'all' = 'all'): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const mediaTypes = type === 'image' 
        ? ImagePicker.MediaTypeOptions.Images
        : type === 'video'
        ? ImagePicker.MediaTypeOptions.Videos
        : ImagePicker.MediaTypeOptions.All;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsEditing: true,
        aspect: type === 'image' ? [4, 3] : undefined,
        quality: 0.8,
        exif: false,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: asset.type === 'image' ? 'image' : 'video',
        name: asset.fileName || `${asset.type}_${Date.now()}.${asset.type === 'image' ? 'jpg' : 'mp4'}`,
        size: asset.fileSize || 0,
        width: asset.width,
        height: asset.height,
        duration: asset.duration || 0,
      };
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert('Error', 'Failed to pick media from gallery. Please try again.');
      return null;
    }
  }

  async saveToGallery(uri: string, type: 'image' | 'video'): Promise<boolean> {
    try {
      const hasPermission = await MediaLibrary.requestPermissionsAsync();
      if (hasPermission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot save to gallery without permission.');
        return false;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('Coast-Kavach');
      
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('Coast-Kavach', asset, false);
      }

      return true;
    } catch (error) {
      console.error('Error saving to gallery:', error);
      Alert.alert('Error', 'Failed to save to gallery.');
      return false;
    }
  }

  async compressImage(uri: string, quality: number = 0.8): Promise<string> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality,
        base64: false,
      });

      if (result.canceled) return uri;
      return result.assets[0].uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri;
    }
  }

  getFileSizeString(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getDurationString(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

export const cameraService = new CameraService();
export default cameraService;
