# Image Upload System

A configurable image upload system that supports local storage for development and cloud storage for production.

## Features

- ✅ **Multiple Storage Providers**: Local, Cloudinary, AWS S3
- ✅ **File Validation**: Type and size validation
- ✅ **Image Optimization**: Stubbed methods for production optimization
- ✅ **Security**: Unique filenames, type validation, size limits
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Drag & Drop**: Modern drag & drop interface
- ✅ **Progress Feedback**: Upload progress and status messages

## Quick Start

### Development (Local Storage)

```bash
# No additional setup required
# Files are stored in public/uploads/
```

### Production (Cloudinary)

```bash
npm install cloudinary
```

Add to your `.env`:

```env
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Production (AWS S3)

```bash
npm install @aws-sdk/client-s3
```

Add to your `.env`:

```env
UPLOAD_PROVIDER=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain
```

## Usage

### In Components

```tsx
import ImageUploader from '@/components/ui/ImageUploader'

;<ImageUploader
  existingImageUrl={product.imageUrl}
  onImageUploaded={(url) => setImageUrl(url)}
  onImageRemoved={() => setImageUrl('')}
/>
```

### In API Routes

```tsx
import { uploadService } from '@/lib/upload'

const result = await uploadService.uploadFile(file)
if (result.success) {
  // Use result.imageUrl
}
```

## Architecture

### UploadService Class

- **Configurable**: Environment-based provider selection
- **Extensible**: Easy to add new storage providers
- **Type-safe**: Full TypeScript support
- **Error handling**: Comprehensive error management

### Storage Providers

1. **Local**: Files stored in `public/uploads/`
2. **Cloudinary**: Cloud storage with automatic optimization
3. **AWS S3**: Scalable cloud storage with CDN support

### File Validation

- **Types**: JPEG, PNG, WebP, GIF
- **Size**: Configurable (default: 5MB)
- **Security**: Unique filenames, type checking

## Production Considerations

### Image Optimization

- **Resizing**: Multiple sizes for different use cases
- **Compression**: Automatic quality optimization
- **Format**: WebP conversion for modern browsers
- **CDN**: Fast global delivery

### Security

- **Validation**: File type and size validation
- **Access Control**: Secure URL generation
- **Cleanup**: Orphaned file management
- **Backup**: File backup strategies

### Performance

- **Caching**: Browser and CDN caching
- **Lazy Loading**: On-demand image loading
- **Progressive Loading**: Low-res to high-res
- **Compression**: Automatic image compression

## File Structure

```
src/
├── lib/
│   ├── upload.ts              # Main upload service
│   ├── upload-cloudinary.ts   # Cloudinary implementation
│   └── upload-s3.ts          # AWS S3 implementation
├── app/api/upload/
│   └── route.ts              # Upload API endpoint
└── components/ui/
    └── ImageUploader.tsx     # Upload component

public/
└── uploads/                  # Local storage directory
    └── .gitkeep             # Keep directory in git

docs/
└── UPLOAD_CONFIGURATION.md  # Configuration documentation
```

## Environment Variables

| Variable                | Description           | Default |
| ----------------------- | --------------------- | ------- |
| `UPLOAD_PROVIDER`       | Storage provider      | `local` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | -       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key    | -       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | -       |
| `AWS_ACCESS_KEY_ID`     | AWS access key        | -       |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key        | -       |
| `AWS_REGION`            | AWS region            | -       |
| `AWS_S3_BUCKET`         | S3 bucket name        | -       |
| `AWS_CLOUDFRONT_DOMAIN` | CloudFront domain     | -       |

## Troubleshooting

### Common Issues

1. **Upload fails**: Check file size and type
2. **Images not loading**: Verify storage provider configuration
3. **Permission errors**: Check file system permissions (local) or IAM roles (S3)
4. **CORS errors**: Configure CORS for cloud storage

### Debug Mode

Enable debug logging by setting `DEBUG=true` in your environment.

## Contributing

To add a new storage provider:

1. Create a new class implementing the upload interface
2. Add the provider to the `UploadService` switch statement
3. Update the configuration types
4. Add environment variable documentation
5. Create implementation example

## License

MIT License - see LICENSE file for details.
