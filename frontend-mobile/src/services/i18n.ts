import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Translation resources
const resources = {
  en: {
    translation: {
      // App Name
      appName: 'Coast-Kavach',
      tagline: 'Your Coastal Safety Companion',
      
      // Navigation
      home: 'Home',
      map: 'Map',
      report: 'Report',
      resources: 'Resources',
      profile: 'Profile',
      
      // Landing Screen
      welcome: 'Welcome to Coast-Kavach',
      welcomeSubtitle: 'Stay safe, stay connected, stay informed',
      login: 'Login',
      signUp: 'Sign Up',
      adminLogin: 'Admin Login',
      selectLanguage: 'Select Language',
      voiceAssistance: 'Voice Assistance',
      
      // Auth Screen
      enterPhone: 'Enter your phone number',
      phonePlaceholder: '+91 98765 43210',
      sendOtp: 'Send OTP',
      enterOtp: 'Enter OTP',
      otpPlaceholder: '123456',
      verifyOtp: 'Verify OTP',
      resendOtp: 'Resend OTP',
      selectRole: 'Select your role',
      citizen: 'Citizen',
      marineWorker: 'Marine Worker',
      analyst: 'Analyst',
      moderator: 'Moderator',
      admin: 'Administrator',
      emergencyContacts: 'Emergency Contacts',
      addContact: 'Add Contact',
      skip: 'Skip',
      continue: 'Continue',
      
      // Home Screen
      location: 'Location',
      connectivity: 'Connectivity',
      online: 'Online',
      offline: 'Offline',
      mesh: 'Mesh Network',
      sms: 'SMS Only',
      warnings: 'Warnings & Alerts',
      hazardsNearYou: 'Hazards Near You',
      quickActions: 'Quick Actions',
      reportHazard: 'Report Hazard',
      requestResources: 'Request Resources',
      sos: 'SOS',
      socialFeed: 'Social Feed',
      helpline: 'Helpline',
      call: 'Call',
      sendSms: 'Send SMS',
      
      // Map Screen
      legend: 'Legend',
      filters: 'Filters',
      refresh: 'Refresh',
      syncNow: 'Sync Now',
      lastUpdated: 'Last Updated',
      offlineBanner: 'You are offline. Some features may be limited.',
      
      // Report Screen
      selectLocation: 'Select Location',
      useCurrentLocation: 'Use Current Location',
      selectType: 'Select Hazard Type',
      flood: 'Flood',
      storm: 'Storm',
      tsunami: 'Tsunami',
      cyclone: 'Cyclone',
      other: 'Other',
      description: 'Description',
      describeHazard: 'Describe the hazard...',
      addMedia: 'Add Media',
      camera: 'Camera',
      gallery: 'Gallery',
      audio: 'Audio',
      submit: 'Submit Report',
      submitting: 'Submitting...',
      reportSubmitted: 'Report Submitted',
      aiSummary: 'AI Summary',
      translation: 'Translation',
      
      // SOS Screen
      helpMe: 'Help Me!',
      emergency: 'Emergency',
      sendSos: 'Send SOS',
      sending: 'Sending...',
      sosFailed: 'SOS Failed',
      tryingNetwork: 'Trying network...',
      tryingMesh: 'Trying mesh...',
      tryingSms: 'Trying SMS...',
      tryingCall: 'Trying call...',
      
      // Resources Screen
      offerHelp: 'Offer Help',
      resourceType: 'Resource Type',
      quantity: 'Quantity',
      urgency: 'Urgency',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
      
      // Profile Screen
      personalInfo: 'Personal Information',
      name: 'Name',
      phone: 'Phone',
      role: 'Role',
      language: 'Language',
      settings: 'Settings',
      notifications: 'Notifications',
      accessibility: 'Accessibility',
      sync: 'Sync',
      history: 'History',
      reports: 'Reports',
      requests: 'Requests',
      status: 'Status',
      pending: 'Pending',
      synced: 'Synced',
      failed: 'Failed',
      
      // Admin Dashboard
      adminDashboard: 'Admin Dashboard',
      stats: 'Statistics',
      activePosts: 'Active Posts',
      flaggedItems: 'Flagged Items',
      liveMap: 'Live Map',
      moderation: 'Moderation',
      approve: 'Approve',
      flag: 'Flag',
      remove: 'Remove',
      communication: 'Communication',
      sendAlert: 'Send Alert',
      downloadData: 'Download Data',
      exportData: 'Export Data',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      done: 'Done',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      
      // Accessibility
      highContrast: 'High Contrast',
      fontSize: 'Font Size',
      small: 'Small',
      large: 'Large',
      extraLarge: 'Extra Large',
      reducedMotion: 'Reduced Motion',
      hapticFeedback: 'Haptic Feedback',
      soundEffects: 'Sound Effects',
      screenReader: 'Screen Reader',
      
      // AI/ML
      trustScore: 'Trust Score',
      spam: 'Spam',
      abuse: 'Abuse',
      offTopic: 'Off Topic',
      misinformation: 'Misinformation',
      safe: 'Safe',
      why: 'Why?',
      explanation: 'Explanation',
      
      // Errors
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      validationError: 'Please check your input and try again.',
      authError: 'Authentication failed. Please login again.',
      permissionError: 'Permission denied. Please check your settings.',
      
      // Success Messages
      sosSent: 'SOS sent successfully',
      resourceRequested: 'Resource request submitted',
      settingsSaved: 'Settings saved successfully',
      syncCompleted: 'Sync completed successfully',
    },
  },
  hi: {
    translation: {
      // App Name
      appName: 'कोस्ट-कवच',
      tagline: 'आपका तटीय सुरक्षा साथी',
      
      // Navigation
      home: 'होम',
      map: 'मानचित्र',
      report: 'रिपोर्ट',
      resources: 'संसाधन',
      profile: 'प्रोफाइल',
      admin: 'एडमिन',
      sos: 'एसओएस',
      
      // Landing Screen
      welcome: 'कोस्ट-कवच में आपका स्वागत है',
      welcomeSubtitle: 'सुरक्षित रहें, जुड़े रहें, सूचित रहें',
      login: 'लॉगिन',
      signUp: 'साइन अप',
      adminLogin: 'एडमिन लॉगिन',
      selectLanguage: 'भाषा चुनें',
      voiceAssistance: 'वॉइस सहायता',
      
      // Common
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी',
      info: 'जानकारी',
      retry: 'पुनः प्रयास',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      close: 'बंद करें',
      back: 'वापस',
      next: 'अगला',
      previous: 'पिछला',
      done: 'हो गया',
      yes: 'हां',
      no: 'नहीं',
      ok: 'ठीक है',
    },
  },
  ta: {
    translation: {
      // App Name
      appName: 'கோஸ்ட்-கவச்',
      tagline: 'உங்கள் கடற்கரை பாதுகாப்பு துணை',
      
      // Navigation
      home: 'முகப்பு',
      map: 'வரைபடம்',
      report: 'அறிக்கை',
      resources: 'வளங்கள்',
      profile: 'சுயவிவரம்',
      admin: 'நிர்வாகம்',
      sos: 'எஸ்ஓஎஸ்',
      
      // Landing Screen
      welcome: 'கோஸ்ட்-கவச்-க்கு வரவேற்கிறோம்',
      welcomeSubtitle: 'பாதுகாப்பாக இருங்கள், இணைந்திருங்கள், தகவலறிந்திருங்கள்',
      login: 'உள்நுழைவு',
      signUp: 'பதிவு',
      adminLogin: 'நிர்வாக உள்நுழைவு',
      selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      voiceAssistance: 'குரல் உதவி',
      
      // Common
      loading: 'ஏற்றப்படுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      warning: 'எச்சரிக்கை',
      info: 'தகவல்',
      retry: 'மீண்டும் முயற்சி',
      cancel: 'ரத்து செய்',
      save: 'சேமி',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      close: 'மூடு',
      back: 'பின்',
      next: 'அடுத்து',
      previous: 'முந்தைய',
      done: 'முடிந்தது',
      yes: 'ஆம்',
      no: 'இல்லை',
      ok: 'சரி',
    },
  },
  bn: {
    translation: {
      // App Name
      appName: 'কোস্ট-কবচ',
      tagline: 'আপনার উপকূলীয় নিরাপত্তা সঙ্গী',
      
      // Navigation
      home: 'হোম',
      map: 'মানচিত্র',
      report: 'রিপোর্ট',
      resources: 'সম্পদ',
      profile: 'প্রোফাইল',
      admin: 'অ্যাডমিন',
      sos: 'এসওএস',
      
      // Landing Screen
      welcome: 'কোস্ট-কবচে স্বাগতম',
      welcomeSubtitle: 'নিরাপদ থাকুন, সংযুক্ত থাকুন, অবহিত থাকুন',
      login: 'লগইন',
      signUp: 'সাইন আপ',
      adminLogin: 'অ্যাডমিন লগইন',
      selectLanguage: 'ভাষা নির্বাচন করুন',
      voiceAssistance: 'ভয়েস সহায়তা',
      
      // Common
      loading: 'লোড হচ্ছে...',
      error: 'ত্রুটি',
      success: 'সফলতা',
      warning: 'সতর্কতা',
      info: 'তথ্য',
      retry: 'পুনরায় চেষ্টা',
      cancel: 'বাতিল',
      save: 'সংরক্ষণ',
      delete: 'মুছে ফেলুন',
      edit: 'সম্পাদনা',
      close: 'বন্ধ',
      back: 'পিছনে',
      next: 'পরবর্তী',
      previous: 'পূর্ববর্তী',
      done: 'সম্পন্ন',
      yes: 'হ্যাঁ',
      no: 'না',
      ok: 'ঠিক আছে',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export { i18n };
