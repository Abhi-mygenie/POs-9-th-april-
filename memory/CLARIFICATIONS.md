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

**Screenshot Reference:** See `/app/memory/screenshots/dynamic_table_identifier.png`

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

**Example from UI:**
```
Table Header: पq piyush ₹1
            ↑    ↑      ↑
            ?   customer amount
```

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
| Search by customer name for dine-in | ⏸️ Blocked | Need Q1, Q2, Q3 answered |
| Dynamic table search | ⏸️ Blocked | Need data source identified |

---

## Document History

| Date | Update |
|------|--------|
| 2026-04-10 | Initial creation with dynamic table questions |

---

*Please update this document with answers or direct to relevant API documentation.*
