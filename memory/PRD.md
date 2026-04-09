# MyGenie POS Frontend App

## Original Problem Statement
Pull code from v3--payments- branch of https://github.com/Abhi-mygenie/POs-9-th-april-.git
React frontend only app, build as-is in dev mode.

## Architecture
- **Type**: React Frontend Only (no backend needed)
- **Build Tool**: Create React App with CRACO
- **UI Framework**: Tailwind CSS + Radix UI components
- **State Management**: React Context (OrderContext)

## Environment Configuration
- REACT_APP_API_BASE_URL=https://preprod.mygenie.online/
- REACT_APP_SOCKET_URL=https://presocket.mygenie.online

## What's Been Implemented (Jan 9, 2026)
- [x] Cloned v3--payments- branch
- [x] Installed dependencies via yarn
- [x] Configured environment variables
- [x] Frontend running in dev mode on port 3000

## Key Features (from branch)
- Order Entry system
- Split Bill functionality (SplitBillModal.jsx)
- Payment collection (CollectPaymentPanel.jsx)
- Room Check-in (RoomCheckInModal.jsx)
- Socket integration for real-time updates

## Prioritized Backlog
- P0: None (frontend-only deployment complete)
- P1: Test split bill button visibility and functionality
- P2: Verify socket connections to presocket.mygenie.online
