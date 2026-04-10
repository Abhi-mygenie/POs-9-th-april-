# MyGenie POS Frontend - PRD

## Original Problem Statement
Pull code from https://github.com/Abhi-mygenie/POs-9-th-april-.git branch `v5-firebase`. React frontend only. Build as-is.

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

### KOT & Bill Manual Printing — (COMPLETE April 10, 2026)
| Component | File | Status |
|-----------|------|--------|
| Print API endpoint constant | `api/constants.js` | Done |
| printOrder service function | `api/services/orderService.js` | Done |
| TableCard printer icon → KOT | `components/cards/TableCard.jsx` | Done |
| TableCard Bill button → Print Bill | `components/cards/TableCard.jsx` | Done |
| OrderCard printer icon → KOT | `components/cards/OrderCard.jsx` | Done |
| OrderCard Bill button → Print Bill | `components/cards/OrderCard.jsx` | Done |
| Re-Print button → KOT | `components/order-entry/RePrintButton.jsx` | Done |
| CartPanel passes orderId | `components/order-entry/CartPanel.jsx` | Done |

#### Button Mapping
| Location | Button | Action | API Payload |
|----------|--------|--------|-------------|
| Dashboard Cards (Table/Order View) | 🖨️ Printer icon | Manual KOT | `{ order_id, print_type: "kot" }` |
| Dashboard Cards (Table/Order View) | **Bill** (solid green) | Manual Bill print | `{ order_id, print_type: "bill" }` |
| OrderEntry Cart Panel | Re-Print | Manual KOT | `{ order_id, print_type: "kot" }` |

#### API Endpoint
```
POST /api/v1/vendoremployee/order-temp-store
Authorization: Bearer <token>
{ "order_id": <id>, "print_type": "kot" | "bill" }
```

#### UX Behavior
- Button disabled during API call (loading state)
- Success toast: "KOT request sent" / "Bill request sent"
- Error toast: "Failed to send print request"
- Note: This sends request to printer agent via backend socket — actual print confirmation is Phase 2

### Firebase Cloud Messaging — Phase 1 (COMPLETE)
| Component | File | Status |
|-----------|------|--------|
| Firebase config from env vars (zero hardcoding) | `config/firebase.js` | Done |
| Service Worker for background push | `public/firebase-messaging-sw.js` | Done |
| SoundManager (14 local wav files, silent stops) | `utils/soundManager.js` | Done |
| NotificationContext (message processing, sound) | `contexts/NotificationContext.jsx` | Done |
| 14 sound files in public dir | `public/sounds/*.wav` | Done |
| FCM token sent in login payload (`fcm_token`) | `LoginPage.jsx`, `authTransform.js` | Done |
| Top banner UI for notifications (universal color) | `components/layout/NotificationBanner.jsx` | Done |
| Removed local order success toasts | `OrderEntry.jsx` | Done |
| Test Notification panel in Settings | `components/layout/NotificationTester.jsx` | Done |
| Sidebar silent toggle wired to SoundManager | `Sidebar.jsx`, `DashboardPage.jsx` | Done |
| Wired NotificationProvider into AppProviders | `contexts/AppProviders.jsx` | Done |

### Sidebar Silent Mode Toggle
- Bell (green) = Ringer On → notification sounds play
- BellOff (gray) = Silent Mode → banners still show, no sound
- Uses `soundEnabled` / `setSoundEnabled` from NotificationContext (no prop drilling)
- `SoundManager.setEnabled(false)` stops current audio + prevents future playback

### Notification Banner Behavior
- Full-width banner at top of screen (z-200, fixed)
- Universal color (no type-based color mapping — Phase 2)
- Icon + Title + Body, dismiss X on right
- Auto-dismiss after 6 seconds
- Max 3 stacked banners, newest on top
- Slide-in animation from top

### FCM Token Flow
1. User clicks Login → `requestFCMToken()` → browser permission prompt
2. If granted → FCM token obtained → sent as `fcm_token` in login API payload
3. Backend receives token with credentials — no separate device registration API

### FCM Notification Flow
1. Foreground: `onMessage` → `processNotification()` → play sound from `data.sound` + show banner
2. Background: Service Worker shows native notification + forwards to app for sound
3. Silent notification (`sound: 'silent'`) → stops any playing sound

### Backend Payload Requirement
Backend must include `webpush` section in FCM payload for web sound to work:
```php
'webpush' => [
    'headers' => ['Urgency' => 'high'],
    'data' => ['sound' => $basename],  // e.g., 'new_order', 'order_ready', 'silent'
    'fcm_options' => ['link' => '/dashboard'],
],
```
Valid sound values: `new_order`, `swiggy_new_order`, `confirm_order`, `order_accepted`, `order_confirmed`, `order_ready`, `order_rejected`, `attend_table`, `settle_bill`, `item_added`, `five_sec_buzzer`, `ten_sec_buzzer`, `forty_five_sec_buzzer`, `silent`

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

## What's Left to Close FCM Phase 1

### Verification Status (April 10, 2026)
| Item | Status |
|------|--------|
| Browser notification permission | ✅ Working - Shows popup on first login, warns if denied |
| FCM Token obtained | ✅ Working - Token sent to backend in login payload |
| End-to-end notification | ✅ Working - Banner shows, sound plays |
| `payload.data.sound` from backend | ⚠️ PENDING - Backend sends `webpush` but missing `data` section |

### Backend Payload Analysis (April 10, 2026)

**What Backend Sends:**
```php
'webpush' => [
    'notification' => ['title' => $title, 'body' => $message],  // ✅ Working
    'headers' => ['Urgency' => 'high'],                         // ✅ Working
    'fcm_options' => ['link' => url('/dashboard')],             // ✅ Working
    // ❌ MISSING: 'data' => ['sound' => 'new_order']
]
```

**What Frontend Receives:**
```json
{
  "notification": { "title": "There is a new order", "body": "Order ID: 002336..." },
  "fcmOptions": { "link": "https://preprod.mygenie.online/dashboard" },
  "data": undefined  // ← MISSING!
}
```

**Why Sound Still Works (Fragile):**
Frontend has `inferSoundFromContent()` fallback that guesses sound from title/body text:
- "new order" in title → plays `new_order.wav`
- "confirm" in title → plays `confirm_order.wav`
- This is **fragile** — depends on title text matching exactly

**Backend Fix Required — Add `data` section:**
```php
'webpush' => [
    'notification' => ['title' => $title, 'body' => $message],
    'headers' => ['Urgency' => 'high'],
    'fcm_options' => ['link' => url('/dashboard')],
    // ⬇️ ADD THIS FOR EXPLICIT SOUND CONTROL
    'data' => [
        'sound' => 'new_order',  // or 'confirm_order', 'order_ready', etc.
        'order_id' => $orderId,
        'order_type' => $orderType,
    ],
],
```

**Valid sound keys:** `new_order`, `swiggy_new_order`, `confirm_order`, `order_accepted`, `order_confirmed`, `order_ready`, `order_rejected`, `attend_table`, `settle_bill`, `item_added`, `five_sec_buzzer`, `ten_sec_buzzer`, `forty_five_sec_buzzer`, `silent`

### Console Logs Added (Session 9)
- `[Firebase] Current notification permission: granted|denied|default`
- `[Firebase] FCM Token obtained: xxx...`
- `[Login] FCM result: { error, token }`
- `[Notification] ====== INCOMING NOTIFICATION ======`
- `[Notification] Full payload: { ... }`
- `[Notification] Sound - from payload: ... | resolved: ...`

---

## Pending / Blocked (Non-FCM)
1. Dynamic table search — blocked on backend data structure clarification
2. Bill collection during Preparing stage — awaiting product decision

## Upcoming Tasks
- **FCM Phase 2**: Color mapping per notification type, actionable UI (Accept/Reject), deep linking, table highlighting, buzzer loop logic
- Station API context investigation (P2)

## Test Credentials
- Email: `owner@pav2.com`
- Password: `Qplazm@10`
