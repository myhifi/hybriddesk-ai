# HybridDesk AI - Local-First Document Summarizer

**Live Demo:** [https://hybriddesk-ai.vercel.app/](https://hybriddesk-ai.vercel.app/)  
**Demo Video:** [Watch on YouTube](https://youtu.be/gH1UkyyJBB8)  
**Built for:** #BuildHybridAI 2026 Hackathon

HybridDesk AI is a privacy-first, full-stack document summarization web application powered by **Firebase AI Logic**. It bridges the gap between local AI privacy and cloud AI availability by implementing automated hardware-based fallback logic.

## 🚀 The Problem
Most AI tools send all your data to the cloud, raising privacy concerns and requiring an internet connection. Users want fast, private AI for everyday tasks, but also need the power of the cloud for heavier workloads or when their hardware doesn't support local AI.

## 💡 The Solution
HybridDesk AI uses the **Firebase AI Logic Hybrid Inference SDK** (`InferenceMode.PREFER_ON_DEVICE`) to solve this:
- **On-Device (Local):** On supported devices (Chrome v139+ with sufficient hardware), short notes are summarized directly on the machine using Chrome's built-in Gemini Nano model. This is 100% private, offline-capable, and free.
- **Cloud Fallback:** If the local model is unavailable (e.g., unsupported hardware, low VRAM, or Incognito mode), the app seamlessly falls back to the Gemini Flash cloud model without crashing or degrading the user experience.
- **Live Inference Badge:** The UI explicitly shows the user whether their data was processed **On-Device** or in the **Cloud**, building trust and transparency.

*(Note: My current development hardware is flagged by Chrome as `Device Capable: false` due to performance class. The app successfully detects this and falls back to the cloud. A "Simulate On-Device" toggle is included in the UI to demonstrate the visual state when local inference is available.)*

## 🌟 Key Features
- **Smart Hardware Detection:** Automatically checks local GPU/RAM capabilities via Chrome (`Device Capable`).
- **Seamless Cloud Fallback:** If local execution isn't supported, Firebase AI Logic instantly routes prompts to Gemini Flash in the cloud.
- **Simulate On-Device Mode:** An interactive UI toggle that lets developers test and preview the green local-privacy state (Gemini Nano) instantly.
- **Product-Ready Utilities:** One-click summary copying and text file export for study notes.
- **Secure by Default:** Firebase App Check enforced to prevent API abuse.

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS
- **AI:** Firebase AI Logic (`firebase/ai` v12.5+)
- **Security:** Firebase App Check (Debug tokens used for the hackathon demo)
- **Hosting:** Vercel

## ⚙️ How It Uses Firebase AI Logic
The core of the hybrid logic relies on a single configuration:

```typescript
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";

const ai = getAI(app, { backend: new GoogleAIBackend() });

// This is the magic line that enables hybrid inference.
// It tries on-device first, and automatically falls back to the cloud.
const model = getGenerativeModel(ai, { 
  mode: InferenceMode.PREFER_ON_DEVICE 
});
```

The app also calls `initializeDeviceModel()` after a user interaction (button click) to comply with Chrome's user-activation requirement, and uses `result.response.inferenceSource` to determine whether to show the Green or Blue badge.

## 🏃‍♂️ How to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/myhifi/hybriddesk-ai.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your Firebase configuration (see `.env.local.example`).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in Chrome.

## 🔗 Explore the Project
- **Live Demo:** [https://hybriddesk-ai.vercel.app/](https://hybriddesk-ai.vercel.app/)
- **Source Code:** [https://github.com/myhifi/hybriddesk-ai](https://github.com/myhifi/hybriddesk-ai)
- **Demo Video:** [https://youtu.be/gH1UkyyJBB8](https://youtu.be/gH1UkyyJBB8)