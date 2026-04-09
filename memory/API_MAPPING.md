# Payment Methods - API Mapping Documentation

## Overview

This document describes how the frontend maps API payment types to UI elements.

**Last Updated:** April 9, 2026

---

## API Data Structure

### Source: `useRestaurant().paymentTypes`

```javascript
// API Response: restaurantPaymentTypes
[
  { id: 1, name: 'cash', displayName: 'Cash' },
  { id: 3, name: 'upi', displayName: 'UPI' },
  { id: 6, name: 'dineout', displayName: 'Dineout' },
  { id: 7, name: 'zomato_gold', displayName: 'Zomato Gold' },
  { id: 8, name: 'easy_dinner', displayName: 'Easy Dinner' },
  { id: 9, name: 'partial', displayName: 'Partial Payment' },
  { id: 11, name: 'OTHER', displayName: 'OTHERS' }
]
```

---

## API Name → UI Mapping

### Primary Methods (Row 1 Buttons)

| API `name` | UI Method ID | UI Label | Button |
|------------|--------------|----------|--------|
| `cash` | `cash` | Cash | Row 1, Slot 1 |
| `upi` | `upi` | UPI | Row 1, Slot 2 |
| `card` | `card` | Card | Row 1, Slot 3 (if exists) |

### Action Methods (Row 2)

| API `name` | UI Method ID | UI Label | Position |
|------------|--------------|----------|----------|
| `partial` | `split` | Split | Row 2, Slot 1 |
| *(first dynamic)* | *(from API)* | *(from displayName)* | Row 2, Slot 2 |
| *(remaining)* | - | - | Dropdown |

### Dynamic Types (From API, not hardcoded)

| API `name` | Where Shown |
|------------|-------------|
| `dineout` | Row 2, Slot 2 (first dynamic) |
| `zomato_gold` | Dropdown |
| `easy_dinner` | Dropdown |
| `OTHER` | Dropdown |

---

## Payment API Values (Sent to Backend)

When completing payment, the `payment_method` sent to API:

| UI Selection | API `payment_method` Value |
|--------------|---------------------------|
| Cash | `cash` |
| UPI | `upi` |
| Card | `card` |
| Credit/Tab | `TAB` |
| Split | `partial` |
| To Room | `ROOM` |
| Dineout | `dineout` |
| Zomato Gold | `zomato_gold` |
| Easy Dinner | `easy_dinner` |
| OTHERS | `OTHER` |

---

## Filter Logic

### `getDynamicPaymentTypes(apiPaymentTypes)`

**Purpose:** Extract dynamic payment types that go in Row 2 button + dropdown

**Filters OUT:**
- `cash` (shown in Row 1)
- `upi` (shown in Row 1)
- `card` (shown in Row 1)
- `partial` (mapped to Split button)

**Includes:**
- `dineout`
- `zomato_gold`
- `easy_dinner`
- `OTHER`
- Any other custom types from API

### `filterLayoutByApiTypes(layoutConfig, apiPaymentTypes, hasRooms)`

**Purpose:** Filter configured layout by what's actually available in API

**Logic:**
1. Row 1 methods: Only show if exists in API paymentTypes
2. Split: Only show if `partial` exists in API
3. To Room: Only show if restaurant has rooms
4. Credit: Only show if `tab` or `credit` exists in API

---

## UI Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  💳 PAYMENT METHOD                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ROW 1: [ Cash ]  [ UPI ]  [ Card* ]                       │
│         └── From API: cash, upi, card ──┘                  │
│                                                             │
│  ROW 2: [ Split ]  [ Dineout ]  [ More ▼ ]                 │
│         └── partial ─┘ └─ 1st dynamic ─┘ └─ rest ─┘        │
│                                           ├─ Zomato Gold    │
│                                           ├─ Easy Dinner    │
│                                           └─ OTHERS         │
│                                                             │
│         [ To Room** ]                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

* Card shown only if in API paymentTypes
** To Room shown only if restaurant has rooms
```

---

## Code References

### Registry File
`/app/frontend/src/config/paymentMethods.js`

### Key Functions
- `PAYMENT_METHODS` - Registry of known payment methods
- `getDynamicPaymentTypes()` - Extract dynamic types from API
- `filterLayoutByApiTypes()` - Filter layout by API availability
- `isMethodInApiTypes()` - Check if method exists in API

### Component
`/app/frontend/src/components/order-entry/CollectPaymentPanel.jsx`

### Context
`/app/frontend/src/contexts/SettingsContext.jsx` - Stores `paymentLayoutConfig`

---

## Debug Logging

Console log in CollectPaymentPanel shows:
```javascript
console.log('[CollectPaymentPanel] Payment Debug:', {
  restaurantPaymentMethods,   // undefined (not used)
  restaurantPaymentTypes,     // Array from API
  paymentLayoutConfig,        // {row1, row2, dropdown}
  hasRooms,                   // boolean
  enabledLayout,              // Filtered layout
  dynamicPaymentTypes,        // Dynamic types array
});
```

---

## Known Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Method not showing | Not in API paymentTypes | Add to API or use dynamic types |
| Wrong API value sent | Mapping mismatch | Check `apiValue` in PAYMENT_METHODS |
| OTHERS was missing | Filtered as "known" | Fixed: Only filter primary methods |
