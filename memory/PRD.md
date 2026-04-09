# MyGenie POS - Product Requirements Document

## Original Problem Statement
React POS frontend application cloned from GitHub repo (branch: v1). Connected to external APIs at `preprod.mygenie.online` with Socket.IO real-time updates via `presocket.mygenie.online`. Frontend-only project (no backend).

## Architecture
- **Frontend**: React.js 19 on port 3000 (using CRACO)
- **State Management**: React Context API (OrderContext, TableContext, StationContext, etc.)
- **Real-time**: Socket.IO client
- **UI Framework**: Tailwind CSS + Radix UI components
- **External APIs**: preprod.mygenie.online (REST), presocket.mygenie.online (WebSocket)

## Environment Configuration
```
REACT_APP_API_BASE_URL=https://preprod.mygenie.online/
REACT_APP_SOCKET_URL=https://presocket.mygenie.online
```

## Project Structure

### Source Directories
```
/app/frontend/src/
├── api/                  # API services and transforms
│   ├── services/         # orderService, productService, customerService, etc.
│   ├── transforms/       # Data transformation functions
│   └── socket/           # Socket.IO handlers
├── components/           # React components
│   ├── ui/               # Base UI components (Radix-based)
│   ├── cards/            # Card components
│   ├── dashboard/        # Dashboard-specific components
│   ├── guards/           # Route guards (ProtectedRoute, ErrorBoundary)
│   ├── modals/           # Modal dialogs
│   ├── panels/           # Panel components
│   ├── reports/          # Report components
│   └── station-view/     # Station/KDS view components
├── contexts/             # React Context providers
│   ├── AuthContext.jsx
│   ├── OrderContext.jsx
│   ├── TableContext.jsx
│   ├── StationContext.jsx
│   ├── MenuContext.jsx
│   ├── SocketContext.jsx
│   └── SettingsContext.jsx
├── hooks/                # Custom React hooks
├── pages/                # Page components
├── utils/                # Utility functions
├── data/                 # Static data
└── constants/            # App constants
```

### Routes
| Path | Component | Auth Required |
|------|-----------|---------------|
| `/` | LoginPage | No |
| `/loading` | LoadingPage | Yes |
| `/dashboard` | DashboardPage | Yes |
| `/reports/audit` | AllOrdersReportPage | Yes |
| `/reports/summary` | OrderSummaryPage | Yes |
| `/visibility/status-config` | StatusConfigPage | Yes |

## Key Dependencies
- react: ^19.0.0
- react-router-dom: ^7.5.1
- socket.io-client: ^4.7.0
- @radix-ui/* (various UI primitives)
- tailwindcss: ^3.4.17
- axios: ^1.8.4
- recharts: ^3.6.0
- @hello-pangea/dnd: ^18.0.1 (drag-and-drop)

## Build Configuration
- Uses CRACO (Create React App Configuration Override)
- Tailwind CSS with custom configuration
- PostCSS for processing

## Git Repository
- Source: https://github.com/Abhi-mygenie/POs-9-th-april-.git
- Branch: v1
- Note: Repo contains extra folders (frontend_default_backup, frontend_project) - only `frontend/` is used

## Completed Tasks (Jan 9, 2026)
1. Cloned repo from GitHub (branch v1)
2. Configured environment variables
3. Installed dependencies via yarn
4. App running successfully

## What's Been Implemented (Historical)
- Place-order endpoint updated to v2
- Socket payload handler updated to 6-element format with table_info
- Station View panel (KDS/BAR) with Option C UX
- Station View settings in config page
- Default status visibility [7,1,2,5] - YTC, Preparing, Ready, Served
- Channel Visibility settings
- Dashboard channel filtering based on visibility settings

## Parked/Future
- Socket redirection race condition (`waitForTableEngaged`) - awaiting backend changes

## File Count
- Total JS/JSX files: 196
