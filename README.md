# HybridDesk AI - Local-First Document Summarizer

HybridDesk AI is a privacy-focused study assistant built for the **#BuildHybridAI 2026** hackathon. It leverages **Firebase AI Logic** to run AI inference locally on the user's device using Gemini Nano, and seamlessly falls back to the Cloud when needed.

## 🚀 The Problem
Most AI tools send all your data to the cloud, raising privacy concerns and requiring an internet connection. Users want fast, private AI for everyday tasks, but also need the power of the cloud for heavier workloads or when their hardware doesn't support local AI.

## 💡 The Solution
HybridDesk AI uses the **Firebase AI Logic Hybrid Inference SDK** (`InferenceMode.PREFER_ON_DEVICE`) to solve this:
- **On-Device (Local):** On supported devices (Chrome v139+ with sufficient hardware), short notes are summarized directly on the machine using Chrome's built-in Gemini Nano model. This is 100% private, offline-capable, and free.
- **Cloud Fallback:** If the local model is unavailable (e.g., unsupported hardware, low VRAM, or Incognito mode), the app seamlessly falls back to the Gemini Flash cloud model.
- **Live Inference Badge:** The UI explicitly shows the user whether their data was processed **On-Device** or in the **Cloud**, building trust and transparency.

*(Note: My current development hardware is flagged by Chrome as `Device Capable: false` due to performance class. The app successfully detects this and falls back to the cloud. A "Simulate On-Device" toggle is included in the UI to demonstrate the visual state when local inference is available.)*

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS
- **AI:** Firebase AI Logic (`firebase/ai` v12.5+)
- **Security:** Firebase App Check (Debug tokens used for the hackathon demo)
- **Hosting:** Vercel

## 🏃‍♂️ How to Run Locally
1. Clone the repository: `git clone https://github.com/myhifi/hybriddesk-ai.git`
2. Run `npm install`.
3. Create a `.env.local` file with your Firebase config (see `.env.local.example`).
4. Run `npm run dev`.

## 🔗 Live Demo
[(https://hybriddesk-ai.vercel.app/)]