// NotificationContext - Manages FCM token, incoming notifications, and sound playback
import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import { onForegroundMessage } from '../config/firebase';
import soundManager from '../utils/soundManager';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
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
  // INITIALIZE ON AUTH — preload sounds + listen for messages
  // =========================================================================
  useEffect(() => {
    if (!isAuthenticated || initializedRef.current) return;
    initializedRef.current = true;

    // Preload sounds
    soundManager.preload();

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

  // =========================================================================
  // CONTEXT VALUE
  // =========================================================================
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    dismissNotification,
    clearAll,
    markRead,
  }), [
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    dismissNotification,
    clearAll,
    markRead,
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
