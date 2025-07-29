import { NextRequest, NextResponse } from 'next/server'
import { uploadService } from '@/lib/upload'
import { UploadFileResponse } from '@/types/file'

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadFileResponse | { error: string }>> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const result = await uploadService.uploadFile(file)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      imageUrl: result.imageUrl,
      fileName: result.fileName,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
