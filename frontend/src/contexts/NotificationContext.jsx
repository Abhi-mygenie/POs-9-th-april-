// NotificationContext - Manages FCM token, incoming notifications, and sound playback
import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import { requestFCMToken, onForegroundMessage } from '../config/firebase';
import soundManager from '../utils/soundManager';
import api from '../api/axios';
import { API_ENDPOINTS } from '../api/constants';

const NotificationContext = createContext(null);

// Storage key for FCM token
const FCM_TOKEN_KEY = 'mygenie_fcm_token';

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, token: authToken } = useAuth();
  const [fcmToken, setFcmToken] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [notifications, setNotifications] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const initializedRef = useRef(false);
  const foregroundUnsubRef = useRef(null);
  const processNotificationRef = useRef(null);

  // =========================================================================
  // PROCESS NOTIFICATION — play sound + add to list
  // =========================================================================
  const processNotification = useCallback((data) => {
    const soundKey = data.sound || data.notification_sound || '';

    // Play sound (SoundManager handles silent, unknown keys, etc.)
    if (soundKey) {
      soundManager.play(soundKey);
    }

    // Don't add silent notifications to the list
    if (soundKey === 'silent') return;

    const notification = {
      id: Date.now().toString(),
      title: data.title || 'Notification',
      body: data.body || '',
      type: data.type || data.notification_type || '',
      sound: soundKey,
      orderId: data.order_id || data.orderId || '',
      tableId: data.table_id || data.tableId || '',
      channel: data.channel || data.order_type || '',
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50));
  }, []);

  // Keep ref in sync
  processNotificationRef.current = processNotification;

  // =========================================================================
  // INITIALIZE FCM ON AUTH
  // =========================================================================
  useEffect(() => {
    if (!isAuthenticated || initializedRef.current) return;
    initializedRef.current = true;

    // Preload sounds
    soundManager.preload();

    const initFCM = async () => {
      if ('Notification' in window) {
        setPermissionStatus(Notification.permission);
      }

      const token = await requestFCMToken();
      if (token) {
        setFcmToken(token);
        const prevToken = localStorage.getItem(FCM_TOKEN_KEY);
        if (token !== prevToken) {
          await registerDeviceToken(token);
          localStorage.setItem(FCM_TOKEN_KEY, token);
        }
      }
    };

    initFCM();

    // Listen for foreground messages
    foregroundUnsubRef.current = onForegroundMessage((payload) => {
      console.log('[Notification] Foreground message:', payload);
      const data = payload.data || {};
      processNotificationRef.current?.(data);
    });

    // Listen for background messages forwarded by service worker
    const handleSWMessage = (event) => {
      if (event.data?.type === 'BACKGROUND_NOTIFICATION') {
        console.log('[Notification] SW forwarded message:', event.data.payload);
        processNotificationRef.current?.(event.data.payload);
      }
    };
    navigator.serviceWorker?.addEventListener('message', handleSWMessage);

    return () => {
      if (foregroundUnsubRef.current) foregroundUnsubRef.current();
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Reset on logout
  useEffect(() => {
    if (!isAuthenticated && initializedRef.current) {
      initializedRef.current = false;
      soundManager.stop();
      setNotifications([]);
    }
  }, [isAuthenticated]);

  // Sync sound enabled state
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // =========================================================================
  // REGISTER DEVICE TOKEN WITH BACKEND
  // =========================================================================
  const registerDeviceToken = async (token) => {
    try {
      await api.post(API_ENDPOINTS.REGISTER_DEVICE, {
        device_token: token,
        device_type: 'web',
      });
      console.log('[Notification] Device token registered with backend');
    } catch (err) {
      // Not critical - backend may not have this endpoint yet
      console.warn('[Notification] Token registration failed:', err.readableMessage || err.message);
    }
  };

  // =========================================================================
  // PUBLIC METHODS
  // =========================================================================
  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const requestPermission = useCallback(async () => {
    const token = await requestFCMToken();
    if (token) {
      setFcmToken(token);
      setPermissionStatus('granted');
      await registerDeviceToken(token);
      localStorage.setItem(FCM_TOKEN_KEY, token);
    }
  }, []);

  // =========================================================================
  // CONTEXT VALUE
  // =========================================================================
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(() => ({
    fcmToken,
    permissionStatus,
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    dismissNotification,
    clearAll,
    markRead,
    requestPermission,
  }), [
    fcmToken,
    permissionStatus,
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    dismissNotification,
    clearAll,
    markRead,
    requestPermission,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;
