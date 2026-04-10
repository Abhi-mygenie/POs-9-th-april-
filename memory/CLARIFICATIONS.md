# Clarification Document - MyGenie POS Frontend

## Open Questions for Backend/API Team

---

### 1. Dynamic Table Identifier Origin
**Question:** Where does the table identifier "पq" (or similar Devanagari/special characters) come from?

**Context:**
- Table card shows: `पq piyush ₹1`
- "piyush" appears to be the customer name
- "₹1" is the bill amount
- But what is "पq"? Is it:
  - A table number in Devanagari script?
  - An encoded/hashed table ID?
  - A dynamic table name created by the system?
  - A prefix for walk-in customers?

**Why it matters:** 
- Need to understand the data structure to enable search by customer name
- Currently, tables with such identifiers are not searchable

---

### 2. Dynamic Tables Data Source
**Question:** Where are dynamic/custom-named tables stored in the API response?

**Current Understanding:**
| Data Source | What it contains |
|-------------|------------------|
| `allTablesList` | Physical predefined tables (1, 2, 101, etc.) |
| `walkInOrders` | Auto-generated walk-ins (wc-xxxxx) |
| **??? (Unknown)** | Custom-named tables (पq, etc.) |

**Questions:**
- Are these in `dineInOrders` with a special flag?
- Is there a `tableType`, `isDynamic`, or `isCustomTable` field?
- What API field contains the customer name for these tables?

---

### 3. Table Number vs Customer Name Mapping
**Question:** How is the relationship between table identifier and customer name stored?

**Need to know:**
- API field for the "पq" part (is it `tableNumber`, `tableName`, `tableId`?)
- API field for the "piyush" part (is it `customerName`, `guestName`, `customer`?)

---

### 4. Search Requirements Clarification
**Question:** When searching for "piyush", should the system:
- a) Show the table in search dropdown?
- b) Filter dashboard to show only matching tables?
- c) Both?

**Current behavior:** Neither works for dynamic tables

---

## Pending Implementation (Blocked)

| Feature | Status | Blocker |
|---------|--------|---------|
| Search by customer name for dine-in | Blocked | Need Q1, Q2, Q3 answered |
| Dynamic table search | Blocked | Need data source identified |

---

## 5. Bill Collection During Order Preparation

**Question:** Should users be able to collect bill when the order is still in "Preparing" status?

**Recommendation:** **Option B (Flexible)** — Allow bill anytime after order placed.

**Pending:** Awaiting confirmation from product/backend team.

---

## 6. Order Timeline - API Timestamps (RESOLVED)

**Status:** Implemented. API provides timestamps at item level (`ready_at`, `serve_at`). Order-level timestamps computed from items.

---

## 7. FCM Webpush Payload (RESOLVED — shared with backend)

**Status:** Backend payload structure shared. Backend team has added `webpush` section.

**Pending verification:** User needs to confirm FCM notifications arrive with `data.sound` field.

**Required payload:**
```php
'webpush' => [
    'headers' => ['Urgency' => 'high'],
    'data' => ['sound' => $basename],
    'fcm_options' => ['link' => '/dashboard'],
],
```

---

*Please update this document with answers or direct to relevant API documentation.*

---

## 8. HTTP Response vs Socket Timing for New Order (April 10, 2026)

**Observation:** When placing a new order, the HTTP POST response arrives AFTER socket events.

**Timeline observed:**
| Time | Event |
|------|-------|
| 21:22:16 | Socket: `update-table engage` |
| 21:22:18 | Socket: `new-order` (complete order data) |
| 21:22:18 | HTTP response: `{order_id: 730750, ...}` |

**Question:** Why does HTTP response still return after sockets have already handled everything?

**Current understanding:**
- Sockets are faster and provide complete order data
- HTTP response is now **redundant for success cases**
- HTTP response only needed for **error handling** (if API fails, sockets won't arrive)

**Frontend behavior (April 2026):**
- New Order: Fire HTTP request (don't await), redirect immediately
- Socket `update-table engage` → locks table
- Socket `new-order` → updates OrderContext
- HTTP errors shown via toast if API fails

---
