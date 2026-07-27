# App Assets

This directory contains application icons and assets for the Electron desktop app.

## Required Icons

For the Windows .exe installer, you need to provide:

1. **icon.ico** - Windows icon file (256x256 or larger)
   - Place this file as `assets/icon.ico`
   - This will be used for the installer, desktop shortcut, and taskbar

2. **icon.png** - PNG icon (512x512 recommended)
   - Place this file as `assets/icon.png`
   - This will be used for the Electron app window

## How to Create Icons

### Option 1: Use an Online Converter
1. Create a 512x512 PNG image with your logo
2. Use a service like https://convertico.com/ to convert to .ico format
3. Save both files in this directory

### Option 2: Use ImageMagick
```bash
# Convert PNG to ICO
magick convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico
```

### Option 3: Use electron-icon-builder
```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon.png --output=./assets --flatten
```

## Current Status

⚠️ **Placeholder icons needed** - Add your custom icons before building the installer.

The build will fail if the icons are not present. You can use any simple icon as a placeholder for testing.
