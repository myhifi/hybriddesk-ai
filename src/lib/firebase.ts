import { initializeApp, getApps } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize App Check
if (typeof window !== "undefined") {
  if (process.env.NODE_ENV === "development") {
  // Use the fixed UUID from .env.local for both standard and incognito windows
  // @ts-expect-error - Firebase App Check debug token is a global
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN || true;
}

  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy"),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.warn("App Check initialization error:", error);
  }
}

export { app };