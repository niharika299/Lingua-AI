# 🧠 Lingua AI — Assistive Pediatric Speech-Language & NeuroPlay Hub

> **AI-Powered Accessibility, Speech-Language Therapy & Cognitive Scaffolding Platform**  
> *Designed for children with Developmental Language Disorder (DLD), Dyslexia, Speech Processing Needs, Caregivers, and Educators.*

---

## 📌 Overview (Project Ke Baare Mein)

**Lingua AI** ek comprehensive, AI-driven accessibility platform hai jo un bachhon ke liye banayi gayi hai jo **Developmental Language Disorder (DLD)**, **Dyslexia**, auditory memory challenge, ya speech processing delay ka samna karte hain. 

DLD se grast bachhon ki intelligence bilkul normal hoti hai, lekin unhe syntax structure, multi-step spoken instructions ko yaad rakhne, vocabulary retrieval ("word finding"), aur sentence building mein takleef hoti hai. **Lingua AI** iss gap ko fill karta hai through:
- **Multisensory Scaffolding**: Text, audio, visual icons, aur interactive highlighting.
- **AI-Powered Simplification**: Gemini AI se complex passages ko active, simple, child-friendly sentences mein convert karna.
- **Mobile Camera OCR ("Scan a Book")**: Kitabon ki photoya live camera scan se text extract karke active yellow word-by-word read-aloud playback dena.
- **Age-Tiered Cognitive & Speech Therapy (NeuroPlay Arena)**: Kids (5–11 yrs), Teens (11–18 yrs), aur Adults (18+ yrs) ke liye dedicated clinical challenges.
- **Caregiver & Educator Hubs**: Dedicated **Parent Mode** aur **Teacher Mode** (IEP progress, home support, screening insights).

---

## ✨ Key Features & Modules (App Ke Main Features)

### 1. 🎯 Parent-Guided Daily Adaptive Challenges & Focus Hub (`#parent-mode`)
- **Mood-Based Focus Selection**:
  - 🟢 **Gentle / Low Energy** (5-8 min short listening & picture tasks)
  - 🔵 **Balanced Routine** (10-15 min guided reading & phonemes)
  - 🟣 **High Focus Challenge** (15-20 min brain games & active speech)
- **Custom Parent Control**:
  - Parents mood select karke aaj ke 3 active tasks choose/refresh kar sakte hain.
  - XP rewards customize karne aur daily focus time track karne ke options.

### 2. 🎮 Age-Graded Cognitive & Speech Therapy Arena (NeuroPlay)
Unified age-tier switcher ke saath 3 distinct age categories:
- **🧒 Kids Tier (Ages 5–11)**: Playful, visual, audio TTS, starry confetti rewards (+20 XP).
- **🧑 Teens Tier (Ages 11–18)**: High-tech cyber glass UI, interactive gamified scenarios.
- **💼 Adults Tier (Ages 18+)**: Professional cognitive fitness & workplace communication scaffolding.

**7 Clinical Domain Modules**:
1. **Vocabulary (Word Detective / Shabd Jasoos)**: Clues + 4 visual animal/object cards to prompt specific naming instead of vague words ("woh cheez").
2. **Comprehension (Simon Says Multi-Step Commands)**: Sequential step-by-step auditory listening tasks with check-offs.
3. **Grammar & Sentence Structure**: Recasting past-tense & syntax correction without shame.
4. **Word Retrieval & Naming Speed**: Rapid naming drills with timed picture cues.
5. **Auditory Memory & Sequence Recall**: Matching rhythm beat sequences without visual overload.
6. **Pragmatic Social Communication**: Interactive conversational scenario choices.
7. **Phonological Awareness & Articulation**: Phoneme sound mirror practice (/s/, /ch/, /r/, /th/).

### 3. 📸 "Scan a Book" Mobile Camera OCR & Active Yellow Speech Reader
- **Dual Camera Input**:
  - **Live Stream Viewfinder**: Real-time WebRTC camera stream modal with camera flip (Front/Back).
  - **1-Tap Mobile Camera Capture**: Native `<input capture="environment">` fallback that works seamlessly on mobile phones (Android & iOS).
- **Auto-Downscaling & Image Pre-processing**:
  - High-res mobile camera photos (12MP–48MP) ko auto-downscale karta hai (max dimension 1600px) aur grayscale/high-contrast binarization apply karta hai, jisse WASM crash na ho aur OCR speed 2-3 seconds mein ho.
- **Real-Time Progress Bar**: Floating progress overlay with animated fill and percentage counter (`Processing Book Page... [ 45% ]`).
- **Word-by-Word Active Yellow Highlighting**: Text ko isolated word spans mein split karke real-time voice speech synthesis ke saath highlight karta hai.
- **Playback Speed Controls**: Interactive speed pills (**0.75x**, **1.0x**, **1.25x**, **1.5x**) jo voice rate ko immediately adjust karti hain.
- **Multi-Lingual Translation**: 12+ regional languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, English, etc.) without duplicate label bugs.

### 4. 📖 Read & Listen Studio (Multisensory Scaffolding)
- Child-friendly story library with real-time audio word tracking.
- Syllable breakdown (e.g. `won · der · ful`), friendly definitions, and instant comprehension check-in quizzes powered by Gemini API.

### 5. 📋 Instruction Breaker (Auditory Memory Scaffolding)
- Multi-step spoken directions (e.g., *"Put your blue folder in the backpack, take out your math book, and sit down"*) ko single-action sequential steps mein decompose karta hai.
- Adds temporal markers (*First*, *Next*, *Then*, *Finally*) and visual category icons.

### 6. 👨‍👩‍👧 Parent Mode & Caregiver Hub
- **Clinical Growth Master Profile Card**: Comprehensive overview of the child's active phoneme protocols, target home routines, and speech scaffolding.
- **Acoustic Cueing Tools**: Frequency-filtered auditory clips to assist with phoneme articulation at home.

### 7. 👩‍🏫 Teacher & Educator Portal (`#teacher-mode`)
- Classroom IEP milestone tracking, multi-student speech analytics, visual classroom schedule builder, and 504 accommodation plan export.

### 8. 🔍 Observational Screening & Specialist Referral Guide
- Parent/Educator observation checklist resulting in a strength-based clinical report, actionable home/school strategies, and ready-to-share questions for Speech-Language Pathologists (SLPs).

### 9. 🗣️ Live Speech Assistant & Search Grounding
- **Gemini Live Voice Guide**: Real-time voice interaction (`gemini-3.8-live`).
- **Google Search Grounding**: Fact-based educational explanations with source citation links (`gemini-3.5-flash`).

---

## 🛠️ Tech Stack & Architecture (Kon-Kon Si Technologies Use Huyi Hain)

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19 + TypeScript** | Modular functional components, custom hooks |
| **Build Tool** | **Vite 8** | High-performance ES module bundler |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS with dark mode support |
| **Icons & Animations**| **Lucide React + Motion** | Clean accessibility icons and smooth transitions |
| **Backend Proxy** | **Express.js (Node.js)** | Runs on `server.ts` via `tsx` (Port 3000) |
| **AI SDK** | **`@google/genai` (v2.4.0)**| Server-side Gemini API client integration |
| **AI Models Used** | **Gemini 3.1 Flash Lite**, **Gemini Flash**, **Gemini 3.8 Flash**, **Gemini 3.8 Live**, **Gemini 3.5 Flash Grounding** | Text simplification, instruction breakdown, speech coaching, screening insights |
| **OCR Engine** | **Tesseract.js (v7.0.0)** | Local client-side & server fallback optical character recognition |
| **Speech & Audio** | **Web Speech API** + **Gemini Neural TTS** | Browser `SpeechSynthesisUtterance` with automatic fallback for Gemini TTS quota limits |
| **Database & Auth** | **Firebase Firestore & Auth** | Persistent profile storage and authentication capabilities |

---

## 📂 Project Directory Structure

```
.
├── server.ts                       # Express backend server with Gemini API proxy endpoints
├── index.html                      # HTML5 entry point with responsive viewports
├── metadata.json                   # Applet configuration metadata
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite build and server middleware config
├── src/
│   ├── main.tsx                    # React application entry point
│   ├── App.tsx                     # Main layout & router container
│   ├── index.css                   # Tailwind CSS global styles
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx          # Main navigation bar with "More Sections" dropdown
│   │   │   └── LanguageSelectorModal.tsx
│   │   ├── pages/
│   │   │   ├── BookScanner.tsx     # Scan a Book Mobile Camera OCR & Active Yellow Reader
│   │   │   ├── NeuroPlay.tsx       # Age-Graded Cognitive & Speech Therapy Arena (Kids/Teens/Adults)
│   │   │   ├── ReadListen.tsx      # Multisensory Story Studio
│   │   │   ├── InstructionBreaker.tsx # Auditory Instruction Scaffolding
│   │   │   ├── SpeechLab.tsx       # Speech Coaching & Recasting
│   │   │   ├── CaregiverHub.tsx    # Parent & Educator Clinical Growth Hub
│   │   │   ├── ScreeningTool.tsx   # Observational Screening & SLP Referral
│   │   │   ├── LiveTalk.tsx        # Gemini Live Voice Assistant
│   │   │   ├── ParentModeView.tsx  # Dedicated Parent Mode Hub & Focus Challenges
│   │   │   └── TeacherModeView.tsx # Dedicated Teacher & Educator Portal
│   │   └── ui/                     # Reusable UI primitives
│   ├── utils/
│   │   ├── i18n.ts                 # Supported languages configuration
│   │   └── translationService.ts   # Speech playback, translation & fallback logic
│   └── types/                      # TypeScript interface declarations
└── public/                         # Static assets and icons
```

---

## 🔌 API Endpoints Reference (`server.ts`)

| Endpoint | Method | Purpose | Key Models Used |
| :--- | :--- | :--- | :--- |
| `/api/gemini/simplify` | `POST` | Simplifies complex passages for DLD children | `gemini-3.1-flash-lite`, `gemini-flash-latest` |
| `/api/gemini/scan-book` | `POST` | OCR text extraction and reading level analysis | `gemini-3.1-flash-lite` |
| `/api/gemini/breakdown-instructions` | `POST` | Deconstructs multi-step verbal directions into single steps | `gemini-3.1-flash-lite` |
| `/api/gemini/speech-coach` | `POST` | Provides recasting feedback for child spoken sentences | `gemini-3.1-flash-lite` |
| `/api/gemini/screening-insights` | `POST` | Generates observational screening analysis for SLPs | `gemini-3.1-flash-lite` |
| `/api/gemini/tts` | `POST` | Child-friendly neural speech generation with browser fallback | `gemini-3.8-flash-lite-tts` |
| `/api/gemini/translate` | `POST` | Translates text into regional Indian/global languages | `gemini-3.1-flash-lite` |
| `/api/gemini/explain-word` | `POST` | Generates child-friendly word definitions & syllables | `gemini-3.1-flash-lite` |
| `/api/gemini/search-grounding`| `POST` | Grounded educational Q&A using Google Search | `gemini-3.5-flash` |
| `/api/gemini/live-talk` | `POST` | Real-time conversational voice assistant | `gemini-3.8-live` |

---

## 🚀 Getting Started & Local Setup (Kaise Run Karein)

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)

### 1. Clone & Install
```bash
git clone <repository-url>
cd lingua-ai
npm install
```

### 2. Environment Variables Setup
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```
The app will start at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🛡️ Clinical & Accessibility Principles

1. **Recasting Technique Over Correction**:
   Child ki bataye gaye ideas ki hamesha tareef ki jati hai aur unki bataye baaton ko grammatically rich aur complete sentence mein recast karke sunaya jata hai, bina unhe kisi galti ke liye criticize kiye.
2. **Auditory Processing Wait Time**:
   Visual cues aur progress indicators child ko 5–7 seconds ka processing time dete hain, jisse cognitive overload kam hota hai.
3. **No Dead-Ends & Fail-Safe Fallbacks**:
   Agar kisi reason se Gemini API quota limit exeed ho jaye, toh app automatically browser `SpeechSynthesis` aur rule-based pedagogical fallbacks par shift ho jata hai jisse app kabhi stop na ho.

---

## 📜 License & Credits

Built with ❤️ for children, caregivers, and Speech-Language Pathologists worldwide.  
Powered by **Google AI Studio** and **Gemini API**.
