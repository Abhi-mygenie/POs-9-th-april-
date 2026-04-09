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

---

## Session 1 - April 9, 2026

### Initial Setup
- [x] Cloned repository from `v3--payments-` branch
- [x] Installed all dependencies via yarn
- [x] Configured environment variables
- [x] Frontend running successfully on port 3000
- [x] Merged `API_MAPPING.md` into `API_DOCUMENT_V2.md`

### UX Default Changes
| Change | File | Status |
|--------|------|--------|
| Station View default OFF | `StationContext.jsx` | ✅ Done |
| Sidebar collapsed on login | `DashboardPage.jsx` | ✅ Done |
| Default view: Status (not Channel) | `DashboardPage.jsx` | ✅ Done |

### Login Page Updates (`LoginPage.jsx`)
| Change | Status |
|--------|--------|
| Title: "Streamlined Hospitality." (orange) + "Exceptional Experience." (green) | ✅ Done |
| Footer: "© Mygenie 2025. HOSIGENIE HOSPITALITY SERVICES PRIVATE LIMITED. All Rights Reserved." | ✅ Done |
| Hidden "Request for Demo" button and "OR" divider | ✅ Done |
| Remember Me checkbox functionality verified | ✅ Working |

### Loading Page Updates (`LoadingPage.jsx`)
| Change | Status |
|--------|--------|
| Removed "Setting up your POS..." title | ✅ Done |
| Updated to "Please wait while we set up your system" | ✅ Done |

### Header Updates (`Header.jsx`)
| Change | Status |
|--------|--------|
| Filter pills: Subtle gray style (not orange) | ✅ Done |
| Search box: Smaller (`w-48`/`w-64`) and shifted right | ✅ Done |
| ADD button moved to extreme right | ✅ Done |
| Online indicator after ADD button | ✅ Done |
| Removed Table/Status dropdowns (moved to sidebar) | ✅ Done |

### Sidebar Updates (`Sidebar.jsx`)
| Change | Status |
|--------|--------|
| Added View toggles (Table/Order icons) | ✅ Done |
| Added Group toggles (Channel/Status icons) | ✅ Done |
| Active state: Green highlight | ✅ Done |

### Card Updates
| Change | File | Status |
|--------|------|--------|
| Channel icons for all types (Dine-In, Delivery, TakeAway, Room) | `TableCard.jsx`, `OrderCard.jsx` | ✅ Done |
| Walk-In treated same as Dine-In for icons | Both files | ✅ Done |
| Ready button: Orange border + cream bg | `TableCard.jsx`, `OrderCard.jsx` | ✅ Done |
| Serve button: Green border + light green bg | `TableCard.jsx`, `OrderCard.jsx` | ✅ Done |

### Order Entry Updates
| Change | File | Status |
|--------|------|--------|
| Single compact header (merged 2 rows) | `OrderEntry.jsx` | ✅ Done |
| Removed Veg/Non-Veg/Egg filters | `OrderEntry.jsx` | ✅ Done |
| Removed category search | `CategoryPanel.jsx` | ✅ Done |
| Prominent back button (orange filled) | `CategoryPanel.jsx` | ✅ Done |
| Search box smaller with spacing | `OrderEntry.jsx` | ✅ Done |
| Out of menu (+) as first action icon | `OrderEntry.jsx` | ✅ Done |
| Dynamic tables controlled by settings (default OFF) | `CartPanel.jsx`, `SettingsContext.jsx` | ✅ Done |

### Cart Panel Updates (`CartPanel.jsx`, `RePrintButton.jsx`)
| Change | Status |
|--------|--------|
| Re-Print: Only for placed items | ✅ Done |
| KOT/Bill checkboxes: Only for new items | ✅ Done |
| Split into `RePrintOnlyButton` and `KotBillCheckboxes` | ✅ Done |

### Order Timeline Feature (NEW)
| Change | File | Status |
|--------|------|--------|
| Created `OrderTimeline.jsx` component | New file | ✅ Done |
| Compact dot timeline: `●──14m──●──3m──●` | `OrderTimeline.jsx` | ✅ Done |
| Added to Order Card headers | `OrderCard.jsx` | ✅ Done |
| Stage-specific time in Table View | `TableCard.jsx` | ✅ Done |
| Added `readyAt`, `servedAt` to order transform | `orderTransform.js` | ✅ Done |
| Timestamps passed to all card adapters | `DashboardPage.jsx` | ✅ Done |

### Settings Updates
| Change | File | Status |
|--------|------|--------|
| Added `enableDynamicTables` setting | `SettingsContext.jsx` | ✅ Done |
| Added toggle in General Settings | `ViewEditViews.jsx` | ✅ Done |
| Default: OFF, persisted in localStorage | `SettingsContext.jsx` | ✅ Done |

---

## Parked / Clarifications Needed

See `/app/memory/CLARIFICATIONS.md` for:
1. Dynamic table identifier origin ("पq" etc.)
2. Dynamic tables data source in API
3. Table number vs customer name mapping
4. Search requirements for dynamic tables
5. Bill collection during preparation (Recommended: Option B - Flexible)

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `LoginPage.jsx` | Title, footer, removed demo button |
| `LoadingPage.jsx` | Removed title, updated text |
| `DashboardPage.jsx` | Default views, timestamps to adapters |
| `Header.jsx` | Filter style, search, ADD position, removed dropdowns |
| `Sidebar.jsx` | View/Group toggle icons |
| `TableCard.jsx` | Channel icons, stage-specific time |
| `OrderCard.jsx` | Channel icons, timeline component |
| `OrderTimeline.jsx` | **NEW** - Compact dot timeline |
| `OrderEntry.jsx` | Compact header, removed filters |
| `CategoryPanel.jsx` | Removed search, prominent back button |
| `CartPanel.jsx` | KOT/Bill logic, dynamic tables setting |
| `RePrintButton.jsx` | Split into separate components |
| `SettingsContext.jsx` | Added `enableDynamicTables` |
| `ViewEditViews.jsx` | Dynamic tables toggle in settings |
| `orderTransform.js` | Added `readyAt`, `servedAt` |
| `ChannelColumn.jsx` | Fixed orderType for status view |
| `OrderContext.jsx` | Added `fOrderStatus` to orderItemsByTableId |

---

## Test Credentials
- Email: `owner@pav2.com`
- Password: `Qplazm@10`

---

## Status
- Frontend: ✅ Running (compiled with 1 eslint warning)
- All features tested and verified via screenshots
