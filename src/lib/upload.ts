import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

interface UploadResultSuccess {
  success: true
  imageUrl: string
  fileName: string
}

interface UploadResultError {
  success: false
  error: string
}

type UploadResult = UploadResultSuccess | UploadResultError

export interface UploadConfig {
  provider: 'local' | 'cloudinary' | 's3'
  maxFileSize: number
  allowedTypes: string[]
}

// Default configuration
export const uploadConfig: UploadConfig = {
  provider: (process.env.UPLOAD_PROVIDER as 'local' | 'cloudinary') || 'local',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}

export class UploadService {
  private config: UploadConfig

  constructor(config: UploadConfig = uploadConfig) {
    this.config = config
  }

  async uploadFile(file: File): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    // Route to appropriate upload method
    switch (this.config.provider) {
      case 'cloudinary':
        return this.uploadToCloudinary(file)
      case 'local':
      default:
        return this.uploadToLocal(file)
    }
  }

  private validateFile(
    file: File
  ): { valid: true } | { valid: false; error: string } {
    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed. Please upload an image file.',
      }
    }

    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File size too large. Maximum ${this.config.maxFileSize / (1024 * 1024)}MB allowed.`,
      }
    }

    return { valid: true }
  }

  private async uploadToLocal(file: File): Promise<UploadResult> {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const fileName = `${timestamp}-${randomString}.${fileExtension}`

      // Save file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filePath = join(uploadsDir, fileName)
      await writeFile(filePath, buffer)

      // Construct proper URL for development
      const baseUrl = process.env.NEXTAUTH_URL
      if (!baseUrl) {
        throw new Error('NEXTAUTH_URL environment variable is not set')
      }
      const imageUrl = `${baseUrl}/uploads/${fileName}`

      return {
        success: true,
        imageUrl,
        fileName,
      }
    } catch (error) {
      console.error('Local upload error:', error)
      return {
        success: false,
        error: 'Failed to upload file to local storage',
      }
    }
  }

  private async uploadToCloudinary(file: File): Promise<UploadResult> {
    // Stubbed implementation for Cloudinary
    console.log(
      'Cloudinary upload stubbed - would upload to Cloudinary:',
      file.name
    )

    // In production, this would:
    // 1. Use Cloudinary SDK
    // 2. Upload with optimization settings
    // 3. Return Cloudinary URL

    return {
      success: false,
      error: 'Cloudinary upload not implemented yet',
    }
  }

  // Image optimization methods (stubbed)
  async optimizeImage(file: File): Promise<File> {
    // Stubbed implementation for image optimization
    console.log('Image optimization stubbed - would optimize image')

    // In production, this would:
    // 1. Resize image to multiple sizes
    // 2. Compress image
    // 3. Convert to WebP if supported
    // 4. Return optimized file

    return file
  }

  // Cleanup methods (stubbed)
  async deleteImage(imageUrl: string): Promise<boolean> {
    // Stubbed implementation for image deletion
    console.log('Image deletion stubbed - would delete:', imageUrl)

    // In production, this would:
    // 1. Delete from cloud storage
    // 2. Clean up local files
    // 3. Return success status

    return true
  }
}

// Export singleton instance
export const uploadService = new UploadService()
