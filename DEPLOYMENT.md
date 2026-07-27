# RAK System - Bakery POS - Deployment Guide

## Important Limitations & Requirements

### What This Installer Provides
- ✅ Complete Electron desktop application with Next.js server
- ✅ SQLite offline database support
- ✅ All application dependencies bundled
- ✅ One-click Windows installer (.exe)

### External Requirements (User Must Provide)
- ❌ **MySQL Server** - Required for online mode (not bundled)
  - The app can run in offline-only mode using SQLite
  - For full functionality, you need a running MySQL server
  - Connection details configured in `.env` file

### What I Cannot Provide
- ❌ Public hosting/ngrok deployment - I can only run applications locally on your machine
- ❌ Bundled MySQL server runtime - Cannot include full database server in .exe
- ❌ Truly "plug and play" without any external dependencies - MySQL is required for full functionality

---

## Installation Instructions

### 1. Install the Application
1. Run `RAK System - Bakery POS-0.1.0-x64.exe`
2. Follow the installer prompts
3. Choose installation directory (default: `C:\Users\[Username]\AppData\Local\Programs\RAK System - Bakery POS`)
4. Desktop and Start Menu shortcuts will be created automatically

### 2. Configure Database (Optional for Offline Mode)

#### For Online Mode (MySQL Required)
1. Install MySQL Server 8.0+ if not already installed
2. Create a database for the application
3. Locate the installation directory
4. Create/Edit `.env` file in the installation directory with:

```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

#### For Offline Mode (SQLite Only)
- No configuration needed
- SQLite database will be created automatically in:
  - Windows: `%APPDATA%\bakery-pos\bakery-pos-local.db`
- Features limited to offline operations

### 3. Launch the Application
- Double-click the desktop shortcut or Start Menu entry
- Application will start automatically
- First launch may take 10-30 seconds for server initialization

---

## Development Mode Setup

### Prerequisites
- Node.js 18+ installed
- MySQL Server 8.0+ (for online mode)

### Setup Steps
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev

# Or run Electron in development mode
npm run electron:dev
```

---

## Troubleshooting

### Application Won't Start
1. Check if another application is using port 3000
2. Run the application with administrator privileges
3. Check Windows Event Viewer for error logs
4. The app will show error dialogs with diagnostic information

### Database Connection Errors
- **MySQL Connection Failed**: Verify MySQL server is running and credentials are correct
- **SQLite Errors**: Check write permissions in AppData directory
- **Offline Mode**: App will continue without database, but features will be limited

### Blank Screen on Startup
- Wait 30 seconds for server initialization
- Check if firewall is blocking localhost connections
- Restart the application

---

## Production Build Information

### Build Location
- Installer: `dist/RAK System - Bakery POS-0.1.0-x64.exe`
- Unpacked: `dist/win-unpacked/`

### Build Configuration
- Electron version: 43.2.0
- Node.js version: 24.18.0
- Next.js version: 15.1.6
- Output mode: Standalone

### Included Components
- Next.js standalone server
- Prisma ORM with SQLite support
- All application dependencies
- Electron runtime

---

## Security Considerations

### Production Deployment
- Change default admin credentials immediately
- Use strong database passwords
- Enable HTTPS if deploying to web
- Regular database backups

### Database Backups
- Automatic daily backups for SQLite
- Backup location: `%APPDATA%\BakeryPOS\Backups`
- Manual backup: `npm run backup:create`

---

## Support & Maintenance

### Logs Location
- Development: Console output
- Production: Check error dialogs for diagnostic information

### Updates
- To update: Download new installer and run
- Settings and database are preserved during updates

### Uninstallation
- Use Windows Programs and Features
- Database files in AppData are preserved by default

---

## Feature Limitations

### Offline Mode (SQLite Only)
- No real-time sync between devices
- Limited to single-device usage
- No cloud backup

### Online Mode (MySQL Required)
- Requires external MySQL server
- Network connectivity required
- Multi-device sync possible

---

## Contact & Support

For issues or questions:
1. Check this deployment guide
2. Review error dialogs for diagnostic information
3. Check application logs
4. Contact support with error details

---

## Version Information
- Version: 0.1.0
- Build Date: 2026-07-27
- Platform: Windows x64
- License: Proprietary
