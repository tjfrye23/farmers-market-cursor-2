import { uploadFileResponseSchema } from '@/types/file'

export async function uploadFile(file: File): Promise<{
  imageUrl: string
  fileName: string
}> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Upload failed')
  }

  const data = await response.json()

  const result = uploadFileResponseSchema.safeParse(data)

  if (!result.success) {
    throw new Error('Unexpected upload response')
  }

  return result.data
}
