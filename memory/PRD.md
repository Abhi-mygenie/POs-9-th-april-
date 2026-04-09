# MyGenie POS Frontend - PRD

## Original Problem Statement
Pull code from https://github.com/Abhi-mygenie/POs-9-th-april-.git branch `v3--payments-`. React frontend only. Build as-is.

## Environment Configuration
```
REACT_APP_API_BASE_URL=https://preprod.mygenie.online/
REACT_APP_SOCKET_URL=https://presocket.mygenie.online
```

## Tech Stack
- React 19 with CRACO
- Tailwind CSS
- Radix UI components
- Socket.io client
- React Router DOM 7.x
- React Hook Form + Zod

## What's Been Implemented

### Session 1 (Apr 9, 2026)
- [x] Cloned repository from `v3--payments-` branch
- [x] Installed all dependencies via yarn
- [x] Configured environment variables
- [x] Frontend running successfully on port 3000

### UX Default Changes
- [x] Station View default OFF on login (`StationContext.jsx`)
- [x] Sidebar collapsed on login (`DashboardPage.jsx`)
- [x] Default view: Status (not Channel) (`DashboardPage.jsx`)

### Login Page Updates (`LoginPage.jsx`)
- [x] Title: "Streamlined Hospitality. Exceptional Experience." (two lines, orange + black)
- [x] Footer: "© Mygenie 2025. HOSIGENIE HOSPITALITY SERVICES PRIVATE LIMITED. All Rights Reserved."
- [x] Hidden "Request for Demo" button and "OR" divider
- [x] Remember Me checkbox: Functionality already implemented in `authService.js`

### Loading Page Updates (`LoadingPage.jsx`)
- [x] Removed "Setting up your POS..." title text

### Header Updates (`Header.jsx`)
- [x] Filter pills: Split button style (orange text, orange border when active, cream `#FFF3E8` background)
- [x] Search box: Made smaller (`w-48` unfocused, `w-64` focused)
- [x] Search box: Shifted right (`justify-end` instead of `justify-center`)

## Parked Items
- [ ] Station API context investigation (verify if station-related APIs are loaded in context)

## Files Modified
| File | Changes |
|------|---------|
| `StationContext.jsx` | Default station view OFF |
| `DashboardPage.jsx` | Sidebar collapsed, dashboard view default to status |
| `LoginPage.jsx` | Title, footer, removed demo button |
| `LoadingPage.jsx` | Removed "Setting up your POS..." title |
| `Header.jsx` | Filter pill styling, search box size/position |

## Status
- Frontend: Running (compiled successfully)
- Backend: N/A (frontend-only app connecting to external API)
