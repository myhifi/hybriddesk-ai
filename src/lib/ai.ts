import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { app } from "./firebase";

// Initialize the Gemini Developer API backend
export const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a GenerativeModel instance preferring on-device inference
// If Gemini Nano is unavailable, it automatically falls back to the cloud
export const model = getGenerativeModel(ai, { 
  mode: InferenceMode.PREFER_ON_DEVICE 
});