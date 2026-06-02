# COAST Kavach 🛡️

**COAST Kavach** is an integrated mobile platform designed for real-time disaster management, climate monitoring, and emergency response in coastal regions. Built with an offline-first approach, multi-lingual support, and AI-driven insights, it serves as a crucial bridge between coastal communities, marine workers, and disaster response authorities.

---

## 🚀 Key Features

* **Real-Time Alerts & Hazard Tracking:** Live dashboard displaying high-tide warnings, storm alerts, and local infrastructure damage with crowdsourced trust-verification metrics.
* **AI-Native Coastal Assistant:** An integrated intelligent chatbot providing real-time safety guidance and hazard identification.
* **Quick Emergency Actions:** One-tap **SOS trigger**, crowd-sourced hazard reporting (with photo/video attachments), and direct resource requesting.
* **Interactive Spatial Mapping:** Hybrid coastal maps displaying live disaster points, critical hot-spots, and nearby safety shelters.
* **Accessibility First:** Built-in multi-lingual support, text-to-speech navigation, high-contrast modes, and haptic feedback for field environments.

---

## 📸 Media & Interface

### Application Demo
You can find a comprehensive walkthrough of the application's reporting mechanics, live location mapping, multi-lingual switches, and accessibility settings in the file `WhatsApp Video 2026-06-02 at 11.04.25 PM (2).mp4`.

### Repository Architecture
The overall repository structure and setup can be reviewed in the file structural map `image_3a9a22.png`.

---

## 🛠️ Tech Stack & Architecture

The project is structured as a monorepo containing the mobile application, backend services, and machine learning modules:

```text
├── .expo/               # Expo managed workflow configurations
├── ai-ml-services/      # AI models & backend analytics for hazard verification
├── backend/             # Primary server-side API (verification flows, user management)
├── frontend-mobile/     # React Native mobile application built with Expo & TypeScript
└── seed/                # Database seeding scripts and mock environmental data

## Frontend & Mobile Core
Framework: React Native (Expo Managed Workflow)
Language: TypeScript (.tsx, .ts)
Styling: NativeWind (Tailwind CSS for React Native)
State & Navigation: Expo Router / React Navigation

###⚙️ Getting Started
##Prerequisites
Ensure you have the following installed on your local machine:
```text
Node.js (v18 or higher recommended)
npm or yarn
Expo Go app on your iOS/Android device (for physical testing)

##Installation & Local Setup
Clone the Repository
Bash
```text
   git clone [https://github.com/your-username/coast-kavach.git](https://github.com/your-username/coast-kavach.git)
   cd coast-kavach
Configure Environment Variables
Look for the .env.example file in the root directory. Create your local environment file:
```text
Bash
   cp .env.example .env
Open .env and fill in your backend API URLs, maps keys, and AI service endpoints.

##Install Dependencies
Navigate to the mobile frontend directory (or install from the root if workspaces are configured):
```text
Bash
   cd frontend-mobile
   npm install
Start the Development Server
```text
Bash
   npx expo start
##Run the App

Scan the QR code printed in the terminal using your Expo Go app (Android) or default Camera app (iOS).

Press a for Android Emulator or i for iOS Simulator if they are configured on your machine.

###🧩 Configuration Files
1. app.json: Holds global Expo configurations including app naming, icons, splash screens, and native permission settings (Camera, Location).
2. tailwind.config.js & nativewind-env.d.ts: Configured handles for the Tailwind utility-first styling compiler tailored for mobile layouts.
3. package.json: Manages project dependencies, engines, and automated execution scripts.
