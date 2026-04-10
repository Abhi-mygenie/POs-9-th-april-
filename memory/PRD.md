# MyGenie POS Frontend - PRD

## Original Problem Statement
Pull code from https://github.com/Abhi-mygenie/POs-9-th-april-.git branch `v3--payments-`. React frontend only. Build as-is.

## Environment Configuration
```
REACT_APP_API_BASE_URL=https://preprod.mygenie.online/
REACT_APP_SOCKET_URL=https://presocket.mygenie.online
REACT_APP_FIREBASE_API_KEY=<in .env>
REACT_APP_FIREBASE_AUTH_DOMAIN=mygenie-restaurant.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=mygenie-restaurant
REACT_APP_FIREBASE_STORAGE_BUCKET=mygenie-restaurant.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<in .env>
REACT_APP_FIREBASE_APP_ID=<in .env>
REACT_APP_FIREBASE_MEASUREMENT_ID=<in .env>
REACT_APP_FIREBASE_VAPID_KEY=<in .env>
```

## Tech Stack
- React 19 with CRACO
- Tailwind CSS
- Radix UI components
- Socket.io client
- React Router DOM 7.x
- React Hook Form + Zod
- Firebase SDK 12.x (FCM push notifications)

---

## Features Implemented

### Firebase Cloud Messaging - Phase 1 (COMPLETE)
| Component | File | Status |
|-----------|------|--------|
| Firebase config from env vars | `config/firebase.js` | Done |
| Service Worker (background) | `public/firebase-messaging-sw.js` | Done |
| SoundManager (14 wav files) | `utils/soundManager.js` | Done |
| NotificationContext (FCM lifecycle) | `contexts/NotificationContext.jsx` | Done |
| Sound files in public dir | `public/sounds/*.wav` | Done |
| Device token registration API | `api/constants.js` | Done |
| Wired into AppProviders | `contexts/AppProviders.jsx` | Done |

### UX/UI Improvements (Sessions 1-7)
- Login page redesign
- Compact header with filter pills
- Sidebar view/group toggles
- Channel icons on cards
- Order Timeline dot visualization
- Cart KOT/Bill logic fix
- Dynamic tables setting
- Split Bill feature
- Default column layout settings
- Status Configuration page

---

## Pending / Blocked
1. Dynamic table search - blocked on backend data structure clarification
2. Bill collection during Preparing stage - awaiting product decision

## Upcoming Tasks
- Phase 2 Firebase Notifications: Actionable UI (Accept/Reject), deep linking, table highlighting (P2)
- Station API context investigation (P2)

## Test Credentials
- Email: `owner@pav2.com`
- Password: `Qplazm@10`
