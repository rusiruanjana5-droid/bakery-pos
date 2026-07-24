import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `product_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file to public/uploads/products directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    const filepath = path.join(uploadDir, filename)
    
    await writeFile(filepath, buffer)

    // Return the relative path to be stored in database
    const relativePath = `/uploads/products/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      path: relativePath 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
