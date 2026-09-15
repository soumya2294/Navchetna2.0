import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

export const uploadMedia = async (req, res) => {
  try {
    const rawImage = req.body.image || req.body.file || req.body.dataUrl

    if (!rawImage) {
      return res.status(400).json({ message: 'No image data provided' })
    }

    const matches = rawImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

    let buffer
    let extension = 'jpg'

    if (matches && matches.length === 3) {
      const mimeType = matches[1]
      const base64Data = matches[2]
      buffer = Buffer.from(base64Data, 'base64')

      if (mimeType.includes('png')) extension = 'png'
      else if (mimeType.includes('webp')) extension = 'webp'
      else if (mimeType.includes('gif')) extension = 'gif'
      else if (mimeType.includes('svg')) extension = 'svg'
      else extension = 'jpg'
    } else {
      buffer = Buffer.from(rawImage, 'base64')
    }

    if (buffer.length > 25 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image size exceeds maximum limit (25MB)' })
    }

    const uniqueName = `media-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`
    const filePath = path.join(uploadsDir, uniqueName)

    await fs.promises.writeFile(filePath, buffer)

    const fileUrl = `/uploads/${uniqueName}`

    return res.status(201).json({
      success: true,
      url: fileUrl,
      filename: uniqueName,
      size: buffer.length
    })
  } catch (error) {
    console.error('Media upload error:', error)
    return res.status(500).json({ message: 'Failed to upload image', error: error.message })
  }
}
