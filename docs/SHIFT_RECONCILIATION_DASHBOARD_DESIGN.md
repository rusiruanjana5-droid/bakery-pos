# Cashier Shift & Reconciliation Dashboard - Design Specification

## Executive Summary
Advanced real-time dashboard for management visibility into active cashiers, shift metrics, sales analytics, and cash drawer reconciliation status with audit trail capabilities.

---

## 1. Database Schema Design

### Enhanced Shift Model
```prisma
model Shift {
  id                  Int      @id @default(autoincrement())
  userId              Int
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  terminalId          String?  // Register/Terminal assignment (e.g., "REG-01")
  openingBalance      Float    @default(0) // Initial float/cash at shift start
  startTime           DateTime @default(now())
  endTime             DateTime?
  breakStartTime      DateTime?
  breakEndTime        DateTime?
  totalBreakDuration  Int      @default(0) // Total break time in minutes
  cashSales           Float    @default(0)
  cardSales           Float    @default(0)
  onlineSales         Float    @default(0)
  totalRevenue        Float    @default(0)
  totalDiscounts      Float    @default(0)
  totalRefunds        Float    @default(0)
  totalVoided         Float    @default(0)
  transactionCount    Int      @default(0)
  cashInHand          Float?   // Physical cash counted at shift end
  discrepancy         Float?   // Difference between expected and actual cash
  discrepancyReasonId Int?     // Foreign key to discrepancy reason
  discrepancyReason   DiscrepancyReason? @relation(fields: [discrepancyReasonId], references: [id])
  notes               String?
  status              ShiftStatus @default(ACTIVE)
  isActive            Boolean  @default(true)
  closedBy            Int?     // Manager who closed the shift
  closedByUser        User?    @relation("ShiftCloser", fields: [closedBy], references: [id])
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  cashDrops           CashDrop[]
  auditLogs           AuditLog[]
  breakLogs           BreakLog[]

  @@index([userId])
  @@index([terminalId])
  @@index([startTime])
  @@index([status])
}

enum ShiftStatus {
  ACTIVE
  ON_BREAK
  CLOSED
  PENDING_APPROVAL
}
```

### Cash Drop Model
```prisma
model CashDrop {
  id          Int      @id @default(autoincrement())
  shiftId     Int
  shift       Shift    @relation(fields: [shiftId], references: [id], onDelete: Cascade)
  amount      Float
  droppedBy   Int      // User who performed the drop
  droppedByUser User    @relation("CashDropper", fields: [droppedBy], references: [id])
  droppedAt   DateTime @default(now())
  verifiedBy  Int?     // Manager who verified the drop
  verifiedAt  DateTime?
  notes       String?
  receiptUrl  String?  // Digital receipt/proof

  @@index([shiftId])
  @@index([droppedAt])
}
```

### Break Log Model
```prisma
model BreakLog {
  id          Int      @id @default(autoincrement())
  shiftId     Int
  shift       Shift    @relation(fields: [shiftId], references: [id], onDelete: Cascade)
  startTime   DateTime @default(now())
  endTime     DateTime?
  duration    Int?     // Duration in minutes
  reason      String?  // "Lunch", "Restroom", "Emergency", etc.
  approvedBy  Int?     // Manager approval for extended breaks
  notes       String?

  @@index([shiftId])
  @@index([startTime])
}
```

### Audit Log Model
```prisma
model AuditLog {
  id          Int      @id @default(autoincrement())
  shiftId     Int
  shift       Shift    @relation(fields: [shiftId], references: [id], onDelete: Cascade)
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  actionType  AuditAction
  description String
  orderId     Int?     // Related order if applicable
  amount      Float?   // Amount involved (discount, refund, etc.)
  ipAddress   String?
  userAgent   String?
  metadata    String?  @db.Text // JSON for additional context
  createdAt   DateTime @default(now())

  @@index([shiftId])
  @@index([userId])
  @@index([actionType])
  @@index([createdAt])
}

enum AuditAction {
  MANUAL_DISCOUNT
  ORDER_VOID
  PRICE_OVERRIDE
  DRAWER_OPEN_NO_SALE
  CASH_DROP
  CASH_PAYOUT
  REFUND_PROCESS
  SHIFT_START
  SHIFT_END
  BREAK_START
  BREAK_END
  CASHIER_SWITCH
}
```

### Discrepancy Reason Model
```prisma
model DiscrepancyReason {
  id          Int      @id @default(autoincrement())
  name        String   @unique // "Shortage - Theft", "Excess - Customer Overpayment", etc.
  category    DiscrepancyCategory
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  shifts      Shift[]

  @@index([category])
}

enum DiscrepancyCategory {
  SHORTAGE
  EXCESS
  THEFT
  ERROR
  OTHER
}
```

### Cash Limit Alert Model
```prisma
model CashLimitAlert {
  id          Int      @id @default(autoincrement())
  threshold   Float    // Cash amount threshold (e.g., 50000)
  isActive    Boolean  @default(true)
  alertType   AlertType @default(DROP_REQUIRED)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive])
}

enum AlertType {
  DROP_REQUIRED
  MANAGER_APPROVAL
}
```

### Terminal/Register Model
```prisma
model Terminal {
  id          Int      @id @default(autoincrement())
  name        String   @unique // "Register 1", "Front Counter", etc.
  code        String   @unique // "REG-01", "FC-01", etc.
  location    String?
  isActive    Boolean  @default(true)
  cashLimit   Float?   // Custom cash limit per terminal
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([code])
}
```

### User Model Enhancements
```prisma
model User {
  // ... existing fields ...
  terminalId  Int?     // Assigned terminal
  terminal    Terminal? @relation(fields: [terminalId], references: [id])
  shifts      Shift[]
  cashDrops   CashDrop[] @relation("CashDropper")
  closedShifts Shift[] @relation("ShiftCloser")
}
```

---

## 2. UI/UX Component Hierarchy

### Page Structure
```
ShiftDashboardPage (Main Container)
├── TopSummaryBar
│   ├── ActiveCashierStatus
│   ├── CashStatusIndicator
│   └── ShiftSummaryCards
├── MainContentGrid
│   ├── LeftColumn
│   │   ├── ActiveCashierModule
│   │   ├── CashDrawerModule
│   │   └── CashDropHistory
│   ├── CenterColumn
│   │   ├── RealTimeTransactionLog
│   │   └── AuditTrailPanel
│   └── RightColumn
│       ├── MultiTerminalView
│       ├── CashLimitAlerts
│       └── QuickActions
└── ShiftEndModal (Overlay)
    ├── BlindReconciliationForm
    ├── DiscrepancyReasonSelector
    └── ReportGenerator
```

### Component Specifications

#### **TopSummaryBar**
```tsx
interface TopSummaryBarProps {
  activeCashiers: ActiveCashier[]
  totalCashInDrawers: number
  totalSalesToday: number
  totalTransactions: number
}

// Layout: Horizontal bar with 4 main sections
// - Left: Active cashier count & status
// - Center: Cash status (Expected vs Actual)
// - Right: Quick stats cards (Sales, Transactions, Avg Time)
// - Far Right: Date/Time & Refresh button
```

#### **ActiveCashierModule**
```tsx
interface ActiveCashierModuleProps {
  cashiers: CashierWithShift[]
  selectedTerminal?: string
  onCashierSwitch: (fromId: number, toId: number) => void
  onBreakToggle: (cashierId: number) => void
}

// Features:
// - List of active cashiers with status badges
// - Real-time shift duration timers
// - Terminal assignment display
// - Quick switch button (requires PIN)
// - Break start/end toggle
// - Multi-drawer handover support
```

#### **CashDrawerModule**
```tsx
interface CashDrawerModuleProps {
  shift: ShiftWithDetails
  onCashDrop: (amount: number) => void
  onDrawerOpen: () => void
  cashLimit: number
}

// Features:
// - Opening balance display
// - Expected cash calculation (formula-based)
// - Actual cash input field
// - Real-time discrepancy calculation
// - Color-coded status (Green/Yellow/Red)
// - Cash drop button with confirmation
// - Blind reconciliation mode toggle
// - Drawer open log
```

#### **RealTimeTransactionLog**
```tsx
interface TransactionLogProps {
  shiftId: number
  autoRefresh: boolean
  onExport: () => void
}

// Features:
// - Live transaction feed (WebSocket/SSE)
// - Filter by payment method, time range
// - Highlight high-risk transactions
// - Click to view order details
// - Export to CSV/PDF
// - Pagination with virtual scroll
```

#### **AuditTrailPanel**
```tsx
interface AuditTrailProps {
  shiftId: number
  filterByAction?: AuditAction
  showOnlyHighRisk: boolean
}

// Features:
// - Timeline view of audit events
// - Color-coded by severity
// - User attribution & timestamps
// - Expandable details
// - Filter by action type
// - "High Risk Only" toggle
```

#### **MultiTerminalView**
```tsx
interface MultiTerminalViewProps {
  terminals: TerminalWithCashier[]
  selectedTerminal: string | null
  onSelectTerminal: (terminalId: string) => void
  viewMode: 'grid' | 'list'
}

// Features:
// - Grid/List toggle
// - Terminal cards with status
// - Cashier assignment
// - Cash drawer status per terminal
// - Quick actions per terminal
// - Aggregate view option
```

#### **CashLimitAlerts**
```tsx
interface CashLimitAlertsProps {
  alerts: CashLimitAlert[]
  onAcknowledge: (alertId: number) => void
  onPerformDrop: (terminalId: string, amount: number) => void
}

// Features:
// - Alert cards with urgency level
// - One-click cash drop action
// - Manager approval workflow
// - Alert history
// - Custom threshold configuration
```

#### **ShiftEndModal**
```tsx
interface ShiftEndModalProps {
  shift: ShiftWithDetails
  onClose: () => void
  onComplete: (reconciliationData: ReconciliationData) => void
}

// Features:
// - Blind reconciliation mode
// - Discrepancy reason selector (required if not tally)
// - Manager PIN for approval
// - Digital signature capture
// - Z-Report generation
// - Email report option
```

### Color Scheme & Styling

#### **Light Mode**
```css
--primary: #f59e0b (Amber)
--success: #10b981 (Green)
--warning: #f59e0b (Yellow/Amber)
--danger: #ef4444 (Red)
--info: #3b82f6 (Blue)
--bg-primary: #ffffff
--bg-secondary: #f3f4f6
--bg-tertiary: #e5e7eb
--text-primary: #111827
--text-secondary: #6b7280
--border: #d1d5db
```

#### **Dark Mode**
```css
--primary: #f59e0b
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--info: #3b82f6
--bg-primary: #1f2937
--bg-secondary: #111827
--bg-tertiary: #374151
--text-primary: #f9fafb
--text-secondary: #9ca3af
--border: #4b5563
```

### Responsive Breakpoints
- **Mobile**: < 640px (Stacked layout, simplified view)
- **Tablet**: 640px - 1024px (2-column layout)
- **Desktop**: > 1024px (Full 3-column layout)
- **Large Desktop**: > 1440px (Expanded cards, more detail)

---

## 3. API Endpoint Structure

### Shift Management Endpoints

#### `GET /api/shifts/active`
**Description**: Get all active shifts with real-time data
**Response**:
```json
{
  "shifts": [
    {
      "id": 1,
      "userId": 5,
      "username": "john_cashier",
      "terminalId": "REG-01",
      "terminalName": "Register 1",
      "startTime": "2026-07-22T08:00:00Z",
      "elapsedDuration": 28400, // seconds
      "status": "ACTIVE",
      "openingBalance": 5000.00,
      "cashSales": 45000.00,
      "cardSales": 32000.00,
      "onlineSales": 8000.00,
      "totalRevenue": 85000.00,
      "transactionCount": 45,
      "expectedCash": 50000.00,
      "cashInDrawer": 50000.00,
      "discrepancy": 0
    }
  ]
}
```

#### `GET /api/shifts/:id/summary`
**Description**: Get detailed shift summary with reconciliation data
**Response**:
```json
{
  "shift": {
    "id": 1,
    "userId": 5,
    "terminalId": "REG-01",
    "startTime": "2026-07-22T08:00:00Z",
    "endTime": null,
    "openingBalance": 5000.00,
    "cashSales": 45000.00,
    "cardSales": 32000.00,
    "onlineSales": 8000.00,
    "totalRevenue": 85000.00,
    "totalDiscounts": 2500.00,
    "totalRefunds": 1500.00,
    "totalVoided": 800.00,
    "transactionCount": 45,
    "averageHandleTime": 120, // seconds
    "cashDrops": [
      {
        "id": 1,
        "amount": 20000.00,
        "droppedAt": "2026-07-22T12:00:00Z",
        "verifiedBy": "manager_user"
      }
    ],
    "breakLogs": [
      {
        "id": 1,
        "startTime": "2026-07-22T12:30:00Z",
        "endTime": "2026-07-22T13:00:00Z",
        "duration": 30,
        "reason": "Lunch"
      }
    ],
    "expectedCash": 50000.00,
    "cashInDrawer": 50000.00,
    "discrepancy": 0
  }
}
```

#### `POST /api/shifts/:id/cash-drop`
**Description**: Perform a cash drop to safe
**Request**:
```json
{
  "amount": 20000.00,
  "notes": "Mid-day drop"
}
```
**Response**:
```json
{
  "success": true,
  "cashDrop": {
    "id": 1,
    "amount": 20000.00,
    "droppedAt": "2026-07-22T12:00:00Z"
  },
  "updatedCashInDrawer": 30000.00
}
```

#### `POST /api/shifts/:id/break`
**Description**: Start or end a break
**Request**:
```json
{
  "action": "start", // or "end"
  "reason": "Lunch"
}
```
**Response**:
```json
{
  "success": true,
  "breakLog": {
    "id": 1,
    "startTime": "2026-07-22T12:30:00Z",
    "endTime": null,
    "reason": "Lunch"
  }
}
```

#### `POST /api/shifts/:id/reconcile`
**Description**: End shift with reconciliation
**Request**:
```json
{
  "cashInHand": 50000.00,
  "discrepancyReasonId": null,
  "notes": "Shift ended normally",
  "managerPin": "1234"
}
```
**Response**:
```json
{
  "success": true,
  "shift": {
    "id": 1,
    "endTime": "2026-07-22T17:00:00Z",
    "cashInHand": 50000.00,
    "discrepancy": 0,
    "status": "CLOSED"
  },
  "reportUrl": "/api/shifts/1/report"
}
```

### Cash Drawer Endpoints

#### `GET /api/cash-drawer/status/:shiftId`
**Description**: Get current cash drawer status
**Response**:
```json
{
  "shiftId": 1,
  "openingBalance": 5000.00,
  "cashSales": 45000.00,
  "cashRefunds": 1500.00,
  "cashPayouts": 1000.00,
  "cashDrops": 20000.00,
  "expectedCash": 27500.00,
  "actualCash": 27500.00,
  "discrepancy": 0,
  "lastUpdated": "2026-07-22T16:45:00Z"
}
```

#### `POST /api/cash-drawer/open`
**Description**: Log drawer open event
**Request**:
```json
{
  "shiftId": 1,
  "reason": "no_sale", // or "change", "refund", etc.
  "orderId": null
}
```

### Audit Log Endpoints

#### `GET /api/audit-logs/:shiftId`
**Description**: Get audit logs for a shift
**Query Parameters**:
- `actionType`: Filter by action type
- `highRiskOnly`: Boolean, show only high-risk events
- `limit`: Number of records
- `offset`: Pagination offset

**Response**:
```json
{
  "logs": [
    {
      "id": 1,
      "actionType": "MANUAL_DISCOUNT",
      "description": "Applied 10% discount on Order #123",
      "userId": 5,
      "username": "john_cashier",
      "amount": 500.00,
      "orderId": 123,
      "createdAt": "2026-07-22T14:30:00Z",
      "metadata": {
        "originalAmount": 5000.00,
        "discountAmount": 500.00,
        "reason": "Customer loyalty"
      }
    }
  ],
  "total": 25,
  "highRiskCount": 3
}
```

#### `POST /api/audit-logs`
**Description**: Create an audit log entry
**Request**:
```json
{
  "shiftId": 1,
  "actionType": "MANUAL_DISCOUNT",
  "description": "Applied 10% discount",
  "orderId": 123,
  "amount": 500.00,
  "metadata": {}
}
```

### Transaction Endpoints

#### `GET /api/transactions/shift/:shiftId`
**Description**: Get all transactions for a shift
**Query Parameters**:
- `paymentMethod`: Filter by payment method
- `startTime`: Filter start time
- `endTime`: Filter end time
- `limit`: Pagination
- `offset`: Pagination offset

**Response**:
```json
{
  "transactions": [
    {
      "id": 123,
      "totalAmount": 5000.00,
      "paymentMethod": "CASH",
      "createdAt": "2026-07-22T14:30:00Z",
      "items": [
        {
          "productId": 45,
          "productName": "Chocolate Cake",
          "quantity": 2,
          "price": 2500.00
        }
      ]
    }
  ],
  "total": 45,
  "summary": {
    "cashCount": 30,
    "cardCount": 12,
    "onlineCount": 3,
    "totalAmount": 85000.00
  }
}
```

### Real-Time Endpoints (SSE/WebSocket)

#### `GET /api/shifts/stream`
**Description**: Server-Sent Events for real-time shift updates
**Response**: Stream of shift updates
```
data: {"type":"shift_update","shiftId":1,"cashSales":45500.00}
data: {"type":"cash_alert","terminalId":"REG-01","message":"Cash limit exceeded"}
data: {"type":"audit_log","actionType":"MANUAL_DISCOUNT","amount":500.00}
```

#### `WS /api/shifts/ws`
**Description**: WebSocket connection for bidirectional real-time updates
**Events**:
- `shift_update`: Shift data updates
- `cash_alert`: Cash limit alerts
- `audit_log`: New audit log entries
- `transaction`: New transaction
- `cashier_status`: Cashier status changes

### Report Endpoints

#### `GET /api/shifts/:id/report`
**Description**: Generate Z-Report/Shift Summary PDF
**Query Parameters**:
- `format`: `pdf` or `json`
- `includeSignature`: Boolean

**Response**: PDF file or JSON report

#### `GET /api/shifts/:id/report/email`
**Description**: Email shift report to manager
**Request**:
```json
{
  "email": "manager@bakery.com",
  "includeSignature": true
}
```

### Configuration Endpoints

#### `GET /api/cash-limits`
**Description**: Get cash limit configuration
**Response**:
```json
{
  "globalLimit": 50000.00,
  "terminalLimits": [
    {
      "terminalId": "REG-01",
      "limit": 40000.00
    }
  ],
  "alerts": [
    {
      "id": 1,
      "threshold": 50000.00,
      "alertType": "DROP_REQUIRED",
      "isActive": true
    }
  ]
}
```

#### `PUT /api/cash-limits`
**Description**: Update cash limit configuration (Admin only)
**Request**:
```json
{
  "globalLimit": 60000.00,
  "terminalLimits": [
    {
      "terminalId": "REG-01",
      "limit": 50000.00
    }
  ]
}
```

#### `GET /api/discrepancy-reasons`
**Description**: Get available discrepancy reasons
**Response**:
```json
{
  "reasons": [
    {
      "id": 1,
      "name": "Shortage - Theft",
      "category": "SHORTAGE",
      "description": "Cash missing due to theft"
    },
    {
      "id": 2,
      "name": "Excess - Customer Overpayment",
      "category": "EXCESS",
      "description": "Customer paid more than required"
    }
  ]
}
```

### Multi-Terminal Endpoints

#### `GET /api/terminals`
**Description**: Get all terminals with current status
**Response**:
```json
{
  "terminals": [
    {
      "id": 1,
      "code": "REG-01",
      "name": "Register 1",
      "location": "Front Counter",
      "isActive": true,
      "currentShift": {
        "id": 1,
        "cashier": "john_cashier",
        "status": "ACTIVE",
        "cashInDrawer": 27500.00
      }
    }
  ]
}
```

#### `POST /api/shifts/switch-cashier`
**Description**: Switch cashier between terminals
**Request**:
```json
{
  "fromShiftId": 1,
  "toUserId": 6,
  "terminalId": "REG-02",
  "pin": "1234"
}
```

---

## 4. Security & Role-Based Access

### Role Permissions

| Feature | Cashier | Manager | Admin |
|---------|---------|---------|-------|
| View own shift | ✅ | ✅ | ✅ |
| View all shifts | ❌ | ✅ | ✅ |
| Start/End own shift | ✅ | ✅ | ✅ |
| Start/End others' shifts | ❌ | ✅ | ✅ |
| Cash drops | ✅ | ✅ | ✅ |
| Edit opening balance | ❌ | ✅ | ✅ |
| View discrepancies | ❌ | ✅ | ✅ |
| Approve discrepancies | ❌ | ✅ | ✅ |
| View audit logs (own) | ✅ | ✅ | ✅ |
| View audit logs (all) | ❌ | ✅ | ✅ |
| Configure cash limits | ❌ | ❌ | ✅ |
| Generate reports | ✅ (own) | ✅ (all) | ✅ (all) |
| Multi-terminal view | ❌ | ✅ | ✅ |

### Authentication Requirements
- All endpoints require valid session
- Manager/Admin actions require PIN verification
- Audit logs track all sensitive actions
- IP address and user agent logging

---

## 5. Implementation Priority

### Phase 1: Core Functionality (Week 1-2)
1. Database schema updates
2. Enhanced Shift model with new fields
3. Basic shift summary API
4. Cash drawer status calculation
5. Simple shift reconciliation modal

### Phase 2: Real-Time Features (Week 3)
1. SSE/WebSocket implementation
2. Live transaction feed
3. Real-time shift timers
4. Cash limit alerts
5. Audit logging integration

### Phase 3: Advanced Features (Week 4)
1. Multi-terminal view
2. Cash drop workflow
3. Break time tracking
4. Discrepancy reason logging
5. Z-Report generation

### Phase 4: Polish & Optimization (Week 5)
1. Performance optimization
2. Mobile responsiveness
3. Dark mode implementation
4. Accessibility improvements
5. Documentation & training

---

## 6. Technical Considerations

### Performance
- Use database indexes for frequent queries
- Implement caching for shift summaries
- Optimize WebSocket message batching
- Use virtual scrolling for large transaction lists

### Scalability
- Support multiple concurrent shifts
- Handle high-frequency transaction updates
- Efficient audit log storage and retrieval
- Database connection pooling

### Reliability
- Transaction integrity for cash operations
- Audit trail for all financial actions
- Backup and recovery procedures
- Error handling and retry logic

### Monitoring
- Track shift start/end times
- Monitor discrepancy rates
- Alert on unusual patterns
- Performance metrics collection
