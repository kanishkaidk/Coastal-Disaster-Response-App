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

### 📺 Video Walkthrough
Click the thumbnail below to play the live application demonstration on the web (opens in a new tab):

> 🔗 **Direct Web Link:** [Watch the COAST Kavach Demo on YouTube](https://youtube.com/shorts/N2yGBQdC-2A?feature=share)

### 📁 Repository Architecture
The overall directory layout and project setup can be reviewed in the file structural map `image_3a9a22.png`.

---

## 🛠️ Tech Stack & Architecture

The project is structured as a monorepo containing the mobile application, backend services, and machine learning modules:

```text
├── .expo/               # Expo managed workflow configurations
├── ai-ml-services/      # AI models & backend analytics for hazard verification
├── backend/             # Primary server-side API (verification flows, user management)
├── frontend-mobile/     # React Native mobile application built with Expo & TypeScript
└── seed/                # Database seeding scripts and mock environmental data
```

### Frontend & Mobile Core
* **Framework:** React Native (Expo Managed Workflow)
* **Language:** TypeScript (`.tsx`, `.ts`)
* **Styling:** NativeWind (Tailwind CSS for React Native)
* **State & Navigation:** Expo Router / React Navigation

---

## ⚙️ Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**
* **Expo Go** app on your iOS/Android device (for physical testing)

### Installation & Local Setup

1. **Clone the Repository**
```bash
   git clone [https://github.com/your-username/coast-kavach.git](https://github.com/your-username/coast-kavach.git)
   cd coast-kavach
```
### ⚙️ Configure Environment Variables
Look for the `.env.example` file in the root directory. Create your local environment file:

```bash
cp .env.example .env
```
### Install Dependencies
Navigate to the mobile frontend directory (or install from the root if workspaces are configured):
```bash
cd frontend-mobile
npm install
```
### Start the Development Server
```bash
npx expo start
```

### Run the App
Scan the QR code printed in the terminal using your Expo Go app (Android) or default Camera app (iOS).
Press a for Android Emulator or i for iOS Simulator if they are configured on your machine.

---
## Configuration Files
1. app.json: Holds global Expo configurations including app naming, icons, splash screens, and native permission settings (Camera, Location).
2. tailwind.config.js & nativewind-env.d.ts: Configured handles for the Tailwind utility-first styling compiler tailored for mobile layouts.
3. package.json: Manages project dependencies, engines, and automated execution scripts.

