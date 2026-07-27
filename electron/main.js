const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const { fork } = require('child_process')
const http = require('http')

let mainWindow
let serverProcess = null
let serverReady = false

// Determine if running in development or production
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    show: true, // Explicitly show the window immediately
    skipTaskbar: false, // Ensure window appears in taskbar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'RAK System - Bakery POS'
  })

  // Force show and focus the window
  mainWindow.show()
  mainWindow.focus()
  console.log('BrowserWindow created and shown')

  // Load the Next.js app from localhost
  // Use PORT from environment or default to 3000
  const port = process.env.PORT || process.env.NEXT_PORT || '3000'
  const startUrl = `http://localhost:${port}`
  console.log('Loading app from:', startUrl)
  
  // Health check function to verify server is ready
  const checkServerHealth = () => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/login',
      method: 'HEAD',
      timeout: 2000
    }

    const req = http.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log('Server health check passed:', res.statusCode)
        serverReady = true
        mainWindow.loadURL(startUrl).catch(err => {
          console.error('Failed to load URL after health check:', err)
          setTimeout(checkServerHealth, 2000)
        })
      } else {
        console.log('Server not ready, status:', res.statusCode)
        setTimeout(checkServerHealth, 2000)
      }
    })

    req.on('error', (err) => {
      console.log('Server health check failed:', err.message)
      setTimeout(checkServerHealth, 2000)
    })

    req.on('timeout', () => {
      console.log('Server health check timed out')
      req.destroy()
      setTimeout(checkServerHealth, 2000)
    })

    req.end()
  }
  
  // Start health check
  checkServerHealth()

  // Fallback: Force load URL after 5 seconds if health check hangs
  setTimeout(() => {
    if (!serverReady) {
      console.log('Health check timeout - forcing URL load')
      mainWindow.loadURL(startUrl).catch(err => {
        console.error('Failed to load URL after fallback timeout:', err)
      })
    }
  }, 5000)

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Start Next.js server in production
function startNextServer() {
  return new Promise((resolve, reject) => {
    if (isDev) {
      console.log('Development mode - Next.js dev server should be running separately')
      console.log('Make sure to run "npm run dev" before starting Electron in dev mode')
      resolve()
      return
    }

    console.log('Starting Next.js production server...')
    
    // Setup logging to userData directory
    const userDataPath = app.getPath('userData')
    const logDir = path.join(userDataPath, 'logs')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
    const logFile = path.join(logDir, `nextjs-server-${Date.now()}.log`)
    const logStream = fs.createWriteStream(logFile, { flags: 'a' })
    
    const log = (message) => {
      const timestamp = new Date().toISOString()
      const logMessage = `[${timestamp}] ${message}\n`
      console.log(message)
      logStream.write(logMessage)
    }
    
    log('=== Next.js Server Startup ===')
    log(`Node version: ${process.version}`)
    log(`Electron version: ${process.versions.electron}`)
    log(`Platform: ${process.platform}`)
    log(`Arch: ${process.arch}`)
    log(`Resources path: ${process.resourcesPath}`)
    log(`__dirname: ${__dirname}`)
    log(`app.isPackaged: ${app.isPackaged}`)
    log(`userData: ${userDataPath}`)
    
    // Resolve paths for packaged environment
    let serverScript, appPath
    
    // In production (packaged), the standalone server must be unpacked
    // fork() doesn't work well with asar archives
    const possiblePaths = [
      // Path 1: extraResource as standalone (new electron-builder config)
      {
        script: path.join(process.resourcesPath, 'standalone', 'server.js'),
        appPath: path.join(process.resourcesPath, 'standalone')
      },
      // Path 2: app.asar.unpacked (for asarUnpack configuration)
      {
        script: path.join(__dirname, '..', '.next', 'standalone', 'server.js'),
        appPath: path.join(__dirname, '..')
      },
      // Path 3: resourcesPath direct (.next/standalone)
      {
        script: path.join(process.resourcesPath, '.next', 'standalone', 'server.js'),
        appPath: process.resourcesPath
      },
      // Path 4: app.asar.unpacked with .next prefix
      {
        script: path.join(process.resourcesPath, 'app.asar.unpacked', '.next', 'standalone', 'server.js'),
        appPath: path.join(process.resourcesPath, 'app.asar.unpacked')
      },
      // Path 5: Direct app path
      {
        script: path.join(process.resourcesPath, 'app', '.next', 'standalone', 'server.js'),
        appPath: path.join(process.resourcesPath, 'app')
      }
    ]
    
    log('Checking possible server paths...')
    for (const pathConfig of possiblePaths) {
      log(`  Checking: ${pathConfig.script}`)
      if (fs.existsSync(pathConfig.script)) {
        serverScript = pathConfig.script
        appPath = pathConfig.appPath
        log(`✅ Found standalone server at: ${serverScript}`)
        break
      }
    }
    
    if (!serverScript) {
      log('❌ Standalone server not found in any of the checked paths')
      log('Checked paths:')
      possiblePaths.forEach(p => log(`  - ${p.script}`))
      
      // List what's actually in resourcesPath
      try {
        if (fs.existsSync(process.resourcesPath)) {
          log('Contents of resourcesPath:')
          fs.readdirSync(process.resourcesPath).forEach(item => {
            log(`  - ${item}`)
          })
        }
        // Also check app.asar.unpacked
        const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked')
        if (fs.existsSync(unpackedPath)) {
          log('Contents of app.asar.unpacked:')
          fs.readdirSync(unpackedPath).forEach(item => {
            log(`  - ${item}`)
          })
        }
      } catch (e) {
        log(`Could not read directory: ${e.message}`)
      }
      
      logStream.end()
      reject(new Error('Next.js standalone server not found. Please build with output: "standalone"'))
      return
    }
    
    log(`Using standalone server: ${serverScript}`)
    log(`Working directory: ${appPath}`)
    log(`Environment variables:`)
    log(`  NODE_ENV: production`)
    log(`  PORT: ${process.env.PORT || '3000'}`)
    log(`  DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`)
    log(`  LOCAL_DATABASE_URL: ${process.env.LOCAL_DATABASE_URL ? 'SET' : 'NOT SET'}`)
    
    // Check if port is already in use and handle conflicts
    const port = parseInt(process.env.PORT || '3000', 10)
    log(`Checking if port ${port} is available...`)
    
    // Define serverEnv in outer scope so it's accessible in error handlers
    const serverEnv = {
      ...process.env,
      NODE_ENV: 'production',
      PORT: port.toString(),
      LOCAL_DATABASE_URL: process.env.LOCAL_DATABASE_URL,
      DATABASE_URL: process.env.DATABASE_URL
    }
    
    // Function to check if port is in use
    const isPortInUse = (port) => {
      return new Promise((resolve) => {
        const server = http.createServer()
        server.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            resolve(true)
          } else {
            resolve(false)
          }
        })
        server.once('listening', () => {
          server.close()
          resolve(false)
        })
        server.listen(port)
      })
    }
    
    // Check port and handle conflicts
    isPortInUse(port).then(inUse => {
      if (inUse) {
        log(`⚠️ Port ${port} is already in use. Attempting to find alternative port...`)
        // Try alternative ports
        const alternativePorts = [3001, 3002, 3003, 3004, 3005]
        let foundPort = null
        
        const checkPorts = async (ports) => {
          for (const altPort of ports) {
            const altInUse = await isPortInUse(altPort)
            if (!altInUse) {
              foundPort = altPort
              log(`✅ Found available port: ${altPort}`)
              return altPort
            }
          }
          return null
        }
        
        return checkPorts(alternativePorts).then(altPort => {
          if (!altPort) {
            log('❌ No available ports found in range 3000-3005')
            logStream.end()
            reject(new Error('No available ports. Please close applications using ports 3000-3005'))
            return
          }
          serverEnv.PORT = altPort.toString()
          spawnServer()
        })
      } else {
        log(`✅ Port ${port} is available`)
        spawnServer()
      }
    }).catch(err => {
      log(`Error checking port: ${err.message}`)
      // Continue with default port if check fails
      // Ensure serverEnv is defined for the catch case
      const fallbackServerEnv = {
        ...process.env,
        NODE_ENV: 'production',
        PORT: port.toString(),
        LOCAL_DATABASE_URL: process.env.LOCAL_DATABASE_URL,
        DATABASE_URL: process.env.DATABASE_URL
      }
      spawnServer(fallbackServerEnv)
    })
    
    function spawnServer(envToUse = serverEnv) {
      log('Spawning server process...')
      log(`Final PORT: ${envToUse.PORT}`)
      
      // Kill any existing zombie processes on the target port
      try {
        log('Checking for zombie processes...')
        // On Windows, we can use netstat to find processes using the port
        const { execSync } = require('child_process')
        try {
          const port = envToUse.PORT
          const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' })
          if (result.trim()) {
            log(`Found processes using port ${port}:`)
            log(result)
            // Note: We don't kill them automatically to avoid affecting other applications
            log('⚠️ Port is in use by another process. This may cause conflicts.')
          }
        } catch (e) {
          // No process found on port - this is good
          log(`No existing processes found on port ${envToUse.PORT}`)
        }
      } catch (e) {
        log(`Could not check for zombie processes: ${e.message}`)
      }
      
      serverProcess = fork(serverScript, [], {
        cwd: appPath,
        env: envToUse,
        silent: true
      })

      let serverStarted = false

      serverProcess.stdout.on('data', (data) => {
        const output = data.toString()
        log(`[STDOUT] ${output}`)
        
        // Check for Next.js ready message
        if (output.includes('Ready') || output.includes('listening') || output.includes('started')) {
          if (!serverStarted) {
            serverStarted = true
            log('✅ Next.js server is ready')
            logStream.end()
            resolve()
          }
        }
      })

      serverProcess.stderr.on('data', (data) => {
        const output = data.toString()
        log(`[STDERR] ${output}`)
      })

      serverProcess.on('close', (code) => {
        log(`Server process exited with code ${code}`)
        if (!serverStarted) {
          logStream.end()
          reject(new Error(`Server process exited with code ${code}. Check logs at ${logFile}`))
        }
      })
      
      serverProcess.on('error', (err) => {
        log(`Server process error: ${err.message}`)
        logStream.end()
        reject(err)
      })

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!serverStarted) {
          log('Server startup timeout after 30 seconds')
          logStream.end()
          reject(new Error('Server startup timeout after 30 seconds'))
        }
      }, 30000)
    }
  })
}

// Stop Next.js server
function stopNextServer() {
  if (serverProcess) {
    console.log('Stopping Next.js server...')
    serverProcess.kill('SIGTERM')
    serverProcess = null
  }
}

// Initialize SQLite database on app launch
function initializeSQLiteDatabase() {
  try {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'bakery-pos-local.db')
    
    console.log('🗄️  Initializing SQLite database at:', dbPath)
    
    // Set environment variable for the local database
    process.env.LOCAL_DATABASE_URL = `file:${dbPath}`
    
    // Create userData directory if it doesn't exist
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true })
    }
    
    // Copy Prisma schema to userData if it doesn't exist
    const resourcesPath = process.resourcesPath || path.join(__dirname, '..')
    const sourceSchema = path.join(resourcesPath, 'prisma', 'schema-local.prisma')
    const targetSchema = path.join(userDataPath, 'schema-local.prisma')
    
    if (fs.existsSync(sourceSchema) && !fs.existsSync(targetSchema)) {
      fs.copyFileSync(sourceSchema, targetSchema)
      console.log('✅ Prisma schema copied to userData')
    }
    
    console.log('✅ SQLite database path configured')
    return dbPath
    
  } catch (error) {
    console.error('❌ Failed to initialize SQLite database:', error)
    // Don't throw - allow app to continue even if SQLite fails
    return null
  }
}

app.on('ready', async () => {
  console.log('App ready, initializing...')
  console.log('Node version:', process.version)
  console.log('Electron version:', process.versions.electron)
  console.log('Platform:', process.platform)
  console.log('Arch:', process.arch)
  console.log('Resources path:', process.resourcesPath)
  console.log('__dirname:', __dirname)
  console.log('Development mode:', isDev)
  
  // Initialize SQLite database path
  try {
    initializeSQLiteDatabase()
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error)
    dialog.showErrorBox('Database Initialization Error', 
      `Failed to initialize SQLite database:\n\n${error.message}\n\nThe app will continue but offline features may not work.`)
  }
  
  // Start Next.js server only in production
  if (!isDev) {
    try {
      console.log('Waiting for Next.js server to start...')
      await startNextServer()
      console.log('✅ Next.js server started successfully')
    } catch (error) {
      console.error('Failed to start Next.js server:', error)
      const errorMessage = `Failed to start Next.js server:\n\n${error.message}\n\n` +
        `Resources path: ${process.resourcesPath}\n` +
        `__dirname: ${__dirname}\n\n` +
        `Please check the console logs for more details.`
      dialog.showErrorBox('Server Startup Error', errorMessage)
      app.quit()
      return
    }
  } else {
    console.log('Development mode: Using external Next.js dev server')
  }
  
  // Create window after server is ready
  try {
    createWindow()
  } catch (error) {
    console.error('Failed to create window:', error)
    dialog.showErrorBox('Window Creation Error', 
      `Failed to create application window:\n\n${error.message}`)
    app.quit()
  }
})

app.on('window-all-closed', () => {
  stopNextServer()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopNextServer()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC handlers for database path
ipcMain.handle('get-database-path', () => {
  return app.getPath('userData')
})

ipcMain.handle('get-local-db-path', () => {
  return path.join(app.getPath('userData'), 'bakery-pos-local.db')
})
