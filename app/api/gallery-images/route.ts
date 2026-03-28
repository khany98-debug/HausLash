import { readdirSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

interface GalleryImage {
  id: string
  src: string
  alt: string
}

// Supported image formats for web
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

export async function GET() {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images', 'work')
    
    // Read all files in the directory
    const files = readdirSync(imagesDir)
    
    // Filter for supported image formats only
    const imageFiles = files
      .filter((file) => {
        const ext = file.toLowerCase().substring(file.lastIndexOf('.'))
        return SUPPORTED_FORMATS.includes(ext)
      })
      .sort() // Sort alphabetically
    
    // Generate gallery image objects
    const galleryImages: GalleryImage[] = imageFiles.map((file, index) => ({
      id: `${index + 1}`,
      src: `/images/work/${file}`,
      alt: `Lash lift result - ${file.replace(/\.[^.]+$/, '')}`,
    }))
    
    return NextResponse.json(galleryImages)
  } catch (error) {
    console.error('Error reading gallery images:', error)
    // Return empty array if directory doesn't exist
    return NextResponse.json([])
  }
}
