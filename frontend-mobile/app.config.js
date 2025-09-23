export default {
  expo: {
    name: "Coast-Kavach",
    slug: "coast-kavach",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0369a1"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.coastkavach.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0369a1"
      },
      package: "com.coastkavach.app",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "RECORD_AUDIO",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE",
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // Environment variables will be loaded here
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
      API_BASE_URL: process.env.API_BASE_URL || 'https://api.coast-kavach.com',
      MAPBOX_STYLE_URL: process.env.MAPBOX_STYLE_URL || 'mapbox://styles/mapbox/satellite-streets-v11',
      API_TIMEOUT: process.env.API_TIMEOUT || '30000',
      
      // Government APIs
      IMD_API_URL: process.env.IMD_API_URL || 'https://api.imd.gov.in',
      NDMA_API_URL: process.env.NDMA_API_URL || 'https://api.ndma.gov.in',
      INCOIS_API_URL: process.env.INCOIS_API_URL || 'https://api.incois.gov.in',
      
      // Social Media APIs
      TWITTER_API_KEY: process.env.TWITTER_API_KEY,
      TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
      FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
      
      // Development flags
      NODE_ENV: process.env.NODE_ENV || 'development',
      USE_MOCK_API: process.env.USE_MOCK_API === 'true',
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Coast-Kavach to use your location to show nearby coastal alerts and emergencies.",
          locationAlwaysPermission: "Allow Coast-Kavach to use your location in the background for emergency notifications.",
          locationWhenInUsePermission: "Allow Coast-Kavach to use your location to show nearby coastal alerts.",
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true,
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow Coast-Kavach to access your camera to report coastal emergencies with photos."
        }
      ],
      [
        "expo-av",
        {
          microphonePermission: "Allow Coast-Kavach to access your microphone for voice reports and emergency recordings."
        }
      ]
    ]
  }
};
