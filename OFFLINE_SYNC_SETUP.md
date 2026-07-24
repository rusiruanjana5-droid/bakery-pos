# Offline-First Sync Architecture Setup

This document explains the setup and configuration for the hybrid offline-first sync architecture in the Bakery POS system.

## Overview

The system now supports dual database operations:
- **Cloud MySQL**: Remote database for centralized data storage (existing)
- **Local SQLite**: Local database for offline-first operations (new)

When offline, all operations are saved to the local SQLite database. When online, data is automatically synchronized between local and cloud databases.

## Environment Variables

Add the following environment variable to your `.env` file:

```env
# Cloud MySQL Database (Existing)
DATABASE_URL="mysql://user:password@host:port/database"

# Local SQLite Database (New - for offline-first operations)
LOCAL_DATABASE_URL="file:./prisma/local.db"
```

### Environment Variable Details

- `DATABASE_URL`: Connection string for the remote MySQL cloud database (existing)
- `LOCAL_DATABASE_URL`: Connection string for the local SQLite database (new)
  - Default: `file:./prisma/local.db`
  - Can be customized to any local file path
  - SQLite file will be created automatically on first run

## Initial Setup

### 1. Generate Local Database Schema

Run the following commands to set up the local SQLite database:

```bash
# Generate Prisma client for local schema
npm run db:local:generate

# Push schema to local SQLite database
npm run db:local:push
```

### 2. Verify Setup

You can view the local database using Prisma Studio:

```bash
npm run db:local:studio
```

This will open Prisma Studio connected to your local SQLite database.

## Database Architecture

### Cloud Database (MySQL)
- Primary database for all centralized data
- Used when online
- Contains all models: User, Product, Order, GRN, etc.

### Local Database (SQLite)
- Offline fallback database
- Contains local versions of critical models:
  - `LocalOrder` - Offline order records
  - `LocalProduct` - Cached product data for offline lookup
  - `LocalCategory` - Cached category data
  - `LocalGRN` - Offline GRN records
  - `SyncQueue` - Queue for pending sync operations
  - `SyncMetadata` - Sync status tracking

## Sync Service

The sync service (`src/lib/syncService.ts`) handles:

1. **Connectivity Monitoring**: Detects online/offline status
2. **Automatic Sync**: Syncs pending data when connection is restored
3. **Status Reporting**: Provides sync status to UI components

### Sync Status Indicators

The Header component displays sync status:
- **Online (Synced)**: Connected to cloud, all data synced
- **Online (X pending)**: Connected but X operations pending sync
- **Offline**: No internet connection, using local database

## Usage in Code

### Import Database Clients

```typescript
import prisma, { localPrisma } from '@/db'

// Use cloud database (MySQL)
const cloudProducts = await prisma.product.findMany()

// Use local database (SQLite)
const localProducts = await localPrisma.localProduct.findMany()
```

### Access Sync Service

```typescript
import { getSyncService, type SyncStatus } from '@/lib/syncService'

const syncService = getSyncService()

// Listen for sync status changes
syncService.onStatusChange((status: SyncStatus) => {
  console.log('Sync status:', status)
})

// Queue an operation for sync
await syncService.queueOperation('CREATE', 'Order', '123', orderData)
```

## Sync Flow

### Online Mode
1. Operations write to both cloud and local databases
2. Real-time sync ensures consistency
3. UI shows "Online (Synced)" status

### Offline Mode
1. Operations write to local database only
2. Operations are queued in `SyncQueue`
3. UI shows "Offline" status
4. No cloud database access

### Reconnection
1. Sync service detects connection restoration
2. Pending operations in `SyncQueue` are pushed to cloud
3. Cloud data is pulled to update local caches
4. UI updates to "Online (Synced)"

## Troubleshooting

### Local Database Not Created
- Ensure `LOCAL_DATABASE_URL` is set in `.env`
- Run `npm run db:local:push` to create the database

### Sync Not Working
- Check that `DATABASE_URL` is correctly configured
- Verify network connectivity
- Check browser console for sync errors

### Sync Status Not Updating
- Ensure sync service is initialized in the Header component
- Check that the sync service listener is properly registered

## Development Notes

- The local SQLite database file is created in the `prisma/` directory by default
- Both databases use the same Prisma Client but with different datasources
- The sync service runs as a singleton to manage state across the application
- Sync operations are queued and processed in the background

## Future Enhancements

Potential improvements to the sync architecture:
- Conflict resolution for concurrent edits
- Selective sync (sync only specific tables)
- Manual sync trigger button
- Sync history and audit logs
- Data compression for large sync payloads
