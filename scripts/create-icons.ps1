Add-Type -AssemblyName System.Drawing

# Create a simple placeholder icon
$bmp = New-Object System.Drawing.Bitmap 256, 256
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Fill with amber background (matching the app theme)
$graphics.Clear([System.Drawing.Color]::FromArgb(245, 158, 11))

# Add "POS" text
$font = New-Object System.Drawing.Font('Arial', 80, [System.Drawing.FontStyle]::Bold)
$graphics.DrawString('POS', $font, [System.Drawing.Brushes]::White, 30, 100)

# Save as PNG
$bmp.Save('assets/icon.png', [System.Drawing.Imaging.ImageFormat]::Png)

# Convert to ICO
$icon = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
$file = New-Object System.IO.FileStream('assets/icon.ico', [System.IO.FileMode]::Create)
$icon.Save($file)
$file.Close()

# Cleanup
$graphics.Dispose()
$bmp.Dispose()

Write-Host "✅ Placeholder icons created in assets/"
