# MyGenie POS - Product Requirements Document

## Original Problem Statement
React POS frontend application cloned from GitHub repo `v10`. Connected to external APIs at `preprod.mygenie.online` with Socket.IO real-time updates via `presocket.mygenie.online`. Frontend-only project (no backend).

## Architecture
- **Frontend**: React.js on port 3000
- **State Management**: React Context API (OrderContext, TableContext, StationContext)
- **Real-time**: Socket.IO client
- **UI Config Persistence**: LocalStorage
- **External APIs**: preprod.mygenie.online (REST), presocket.mygenie.online (WebSocket)

## Key Files
- `/app/frontend/src/pages/DashboardPage.jsx` - Main dashboard with channel/status columns
- `/app/frontend/src/pages/StatusConfigPage.jsx` - Visibility settings (status, station, channel)
- `/app/frontend/src/api/socket/socketHandlers.js` - Socket payload handler (6-element)
- `/app/frontend/src/contexts/StationContext.jsx` - Station view state
- `/app/frontend/src/components/station-view/StationPanel.jsx` - KDS/BAR dashboard panel
- `/app/frontend/src/api/services/stationService.js` - Station queue API

## Completed Features
1. GitHub repo cloned and configured with env vars (DONE)
2. Place-order endpoint updated to v2 (DONE)
3. Socket payload handler updated to 6-element format with table_info (DONE)
4. Station View panel (KDS/BAR) with Option C UX (DONE)
5. Station View settings in config page (DONE)
6. Default status visibility [7,1,2,5] - YTC, Preparing, Ready, Served (DONE)
7. Channel Visibility settings - Override API channels to show/hide Dine-In, TakeAway, Delivery, Room (DONE)
8. Dashboard channel filtering based on visibility settings (DONE)

## Parked/Future
- Socket redirection race condition (`waitForTableEngaged`) - PARKED per user request, awaiting backend changes
