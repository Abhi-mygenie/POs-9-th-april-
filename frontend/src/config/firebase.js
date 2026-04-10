// Firebase Configuration - Reads all values from environment variables
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;

// Initialize Firebase
let app = null;
let messaging = null;

try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  console.log('[Firebase] Initialized successfully');
} catch (error) {
  console.error('[Firebase] Init failed:', error.message);
}

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM token or null
 */
export const requestFCMToken = async () => {
  if (!messaging) {
    console.warn('[Firebase] Messaging not initialized');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[Firebase] Notification permission denied');
      return null;
    }

    // Register service worker with Firebase config as query params
    const swParams = new URLSearchParams({
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
    });
    const registration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${swParams.toString()}`
    );
    console.log('[Firebase] Service Worker registered');

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('[Firebase] FCM Token obtained');
      return token;
    }

    console.warn('[Firebase] No FCM token returned');
    return null;
  } catch (error) {
    console.error('[Firebase] Token error:', error.message);
    return null;
  }
};

/**
 * Listen for foreground messages
 * @param {Function} callback - (payload) => void
 * @returns {Function} unsubscribe
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};

export { messaging };
export default app;
