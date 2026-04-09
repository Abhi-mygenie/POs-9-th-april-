# MyGenie POS - Product Requirements Document (PRD)

## Overview
MyGenie POS is a restaurant Point of Sale application built with React frontend connecting to a preprod API backend.

**Last Updated:** April 9, 2026  
**Branch:** v3--payments-  
**Environment:**
- API Base URL: `https://preprod.mygenie.online/`
- Socket URL: `https://presocket.mygenie.online`

---

## Core Features Implemented

### 1. Order Entry System
- **Table Management**: Dine-in with physical tables
- **Walk-In Orders**: Dynamic table creation with custom table name
- **Order Types**: Dine-In, Walk-In, TakeAway, Delivery
- **Category-based Menu**: Searchable categories and items
- **Item Customization**: Add-ons, modifications, notes

### 2. Walk-In Order Flow (NEW)
- Default order type when clicking "Add Order"
- **Table Name Field**: Optional custom table name for Walk-In
- **Label Priority**: Table Name → Customer Name → "Walk-In"
- Creates `dinein` order with `table_id: 0`

### 3. Payment System
- **Dynamic Payment Methods**: From API `paymentTypes`
- **Configurable Layout**: Row 1 (3 buttons) + Row 2 (2 buttons + dropdown)
- **Split Bill**: Item-based splitting, payment opens for selected items
- **To Room Transfer**: For restaurants with rooms

### 4. UI/UX Improvements
- **Header Reorganization**: 
  - Left Panel: Back button + Category search
  - Middle Panel: Food filters (Veg/Non-Veg/Egg) + Action icons (Transfer, Merge, Notes, Customer)
  - Right Panel: Table selector + Cancel + Split
- **Search Enhancement**: Orange-bordered item search, enhanced category search
- **Table Search**: Searchable table dropdown

---

## User Personas

### 1. Restaurant Staff (Primary)
- Takes orders from customers
- Manages table assignments
- Processes payments
- Handles split bills

### 2. Restaurant Manager
- Monitors orders
- Manages settings
- Views reports

---

## Technical Architecture

### Frontend Stack
- React 18 with Create React App (CRACO)
- Tailwind CSS + Radix UI components
- React Context for state management
- Socket.io for real-time updates

### Key Contexts
- `RestaurantContext`: Restaurant settings, payment types
- `TableContext`: Tables and rooms
- `OrderContext`: Active orders
- `SettingsContext`: Payment layout config, cancellation reasons

### API Integration
- Base URL from `REACT_APP_API_BASE_URL`
- Socket from `REACT_APP_SOCKET_URL`
- All endpoints under `/api/v1/` or `/api/v2/`

---

## What's Been Implemented (April 9, 2026)

### Session 1: Initial Setup
- [x] Cloned v3--payments- branch
- [x] Configured environment variables
- [x] Frontend running in dev mode

### Session 2: UI/UX Improvements
- [x] Removed Gluten Free, Jain, Vegan filters
- [x] Reorganized header layout (3-panel structure)
- [x] Moved action icons to middle panel header
- [x] Added table search in dropdown
- [x] Enhanced search box styling (orange border)
- [x] Aligned row heights across panels (py-4)

### Session 3: Walk-In Order Flow
- [x] Fixed auto-select bug (no longer assigns physical table)
- [x] Added Table Name field for Walk-In orders
- [x] Default order type changed to Walk-In

### Session 4: Split Bill Fix
- [x] Payment now opens for SELECTED items (new order)
- [x] Remaining items stay in original order

### Session 5: Payment Methods Architecture
- [x] Created payment methods registry (`/config/paymentMethods.js`)
- [x] Dynamic payment types from API
- [x] Layout: Row 1 (3 methods) + Row 2 (2 buttons + dropdown)
- [x] Fixed OTHERS missing from dropdown

---

## Prioritized Backlog

### P0 (Critical)
- [x] Payment methods from API - DONE
- [x] Split bill opens correct order - DONE

### P1 (High)
- [ ] Hold/Pending payment implementation
- [ ] Settings UI for payment layout configuration
- [ ] Credit button (if in API)

### P2 (Medium)
- [ ] Payment type icons customization
- [ ] Save payment layout config to API
- [ ] Room transfer improvements

### P3 (Low)
- [ ] Animation improvements
- [ ] Offline mode support

---

## Known Issues / Bugs Fixed

| Bug | Status | Fix |
|-----|--------|-----|
| Walk-In auto-selects physical table | ✅ Fixed | Set `table = null` for Walk-In |
| Split bill shows remaining items | ✅ Fixed | Fetch new order, open payment for it |
| Card shows when not in API | ✅ Fixed | Filter by API paymentTypes |
| OTHERS missing from dropdown | ✅ Fixed | Updated getDynamicPaymentTypes |

---

## Next Tasks

1. Test all payment flows end-to-end
2. Implement Hold/Pending payment
3. Add Settings UI for payment layout
4. Remove debug console logs before production
