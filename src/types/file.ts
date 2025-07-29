import { z } from 'zod'

export const uploadFileResponseSchema = z.object({
  imageUrl: z.string(),
  fileName: z.string(),
})

export type UploadFileResponse = z.infer<typeof uploadFileResponseSchema>
