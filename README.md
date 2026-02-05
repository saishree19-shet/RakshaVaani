# 🛡️ RakshaVaani - AI Voice Defense System

![RakshaVaani Banner](https://img.shields.io/badge/Status-Active_Defense-orange?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-2.4.0-blue?style=for-the-badge) ![AI](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge)

**RakshaVaani** (Voice Protection) is a cutting-edge, AI-powered communication shield designed to detect and neutralize voice cloning scams and deepfakes in real-time. Built with a "Privacy First" architecture and tailored for the Indian ecosystem, it combines military-grade forensic analysis with an intuitive, multilingual interface.

---

## 🚀 Key Features

### 🧠 Advanced Neural Forensics
*   **Real-Time Audio Analysis**: Instantly detects synthetic voice artifacts, robotic intonation, and deepfake markers.
*   **Scam Script Detection**: Identifies common fraud scripts (e.g., "Bank OTP", "Police Verification", "Lottery Win") using NLP.
*   **Confidence Scoring**: Provides a clear "Safe" vs "Suspicious" rating with detailed forensic breakdown.

### 🌐 Hyper-Localized Security
*   **Multilingual Support**: Fully functional in **English, Hindi, Tamil, Telugu, and Malayalam**.
*   **Cultural Context**: Adjusted specifically for Indian accents and common regional scam patterns.
*   **Hinglish Capable**: Seamlessly understands and responds in mixed Hindi-English commands.

### 🗺️ Live Cyber-Threat Map
*   **Real-Time Visualization**: Interactive dark-mode heatmap showing active scam hotspots across major Indian cities using **Leaflet & OpenStreetMap**.
*   **Community Alerts**: Anonymized reporting nodes to warn users of emerging threats in their area.
*   *(Note: Map is currently in maintenance mode for stability optimization)*

### 📂 Forensic Audit & Reporting
*   **File Upload Analysis**: Upload suspicious audio files (MP3/WAV) for deep scanning.
*   **AI Audit Reports**: Generate and download detailed PDF/Text reports for legal or police verification.
*   **Secure Vault**: Client-side encryption for sensitive data handling.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19, Vite, TailwindCSS v4
*   **Artificial Intelligence**: Google Gemini 1.5 Flash (Multimodal)
*   **Backend API**: Node.js, Express
*   **Visualization**: Leaflet.js, OpenStreetMap, Framer Motion
*   **Security**: Firebase Authentication
*   **Icons**: Lucide React

---

## ⚡ Quick Start

### Prerequisites
*   Node.js (v18+)
*   Google Gemini API Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/rakshavaani.git
    cd rakshavaani
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the System**
    You need to run both the Backend (for AI) and Frontend.
    ```bash
    # Terminal 1: Start Backend
    node server.js

    # Terminal 2: Start Frontend
    npm run dev
    ```

5.  **Access the Terminal**
    Open `http://localhost:5173` to initialize the defense system.

---

## 🔮 Roadmap

- [x] **Phase 1: Core Core (Complete)**
    - Voice Recording & Analysis
    - Scam Probability Scoring
    - Basic Multilingual Support

- [x] **Phase 2: Advanced Integation (Complete)**
    - File Upload Analysis
    - Downloadable Forensic Checks
    - Live Threat Map (Beta)

- [ ] **Phase 3: Future Protocols**
    - **"Panic Mode"**: One-tap fake background noise generator (Police Siren, Network Glitch) to exit calls safely.
    - **WhatsApp Bot**: Direct forwarding of voice notes to RakshaVaani for instant WhatsApp verification.
    - **Offline Mode**: On-device TensorFlow Lite model for basic detection without internet.

---

## 🤝 Contributing

We welcome contributions from the cybersecurity community. Please read our `protocols.md` before submitting a Pull Request.

---

<p align="center">
  <small>© 2026 RakshaVaani Defense Systems. "Silence the Deception".</small>
</p>
