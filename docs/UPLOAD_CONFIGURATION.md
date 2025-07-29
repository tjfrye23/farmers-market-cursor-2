# Upload Configuration

This document describes how to configure the image upload system for different environments.

## Environment Variables

### UPLOAD_PROVIDER

Controls which upload provider to use:

- `local` (default): Stores files locally in `public/uploads/`
- `cloudinary`: Uses Cloudinary for cloud storage
- `s3`: Uses AWS S3 for cloud storage

## Local Storage (Development)

Default configuration for development:

```env
UPLOAD_PROVIDER=local
```

Files are stored in `public/uploads/` directory and served statically by Next.js.

## Cloudinary (Production)

To use Cloudinary, add these environment variables:

```env
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Implementation Notes

- Install: `npm install cloudinary`
- Configure image transformations for optimization
- Set up automatic WebP conversion
- Configure CDN for better performance

## AWS S3 (Production)

To use AWS S3, add these environment variables:

```env
UPLOAD_PROVIDER=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain
```

### Implementation Notes

- Install: `npm install @aws-sdk/client-s3`
- Set up CloudFront for CDN
- Configure CORS on S3 bucket
- Set up IAM permissions

## Image Optimization

The upload service includes stubbed methods for:

- Image resizing (multiple sizes)
- Compression
- WebP conversion
- Thumbnail generation

## File Cleanup

The service includes stubbed methods for:

- Deleting files from cloud storage
- Cleaning up local files
- Managing orphaned uploads

## Security Considerations

- File type validation
- File size limits
- Unique filename generation
- Secure URL generation
- Access control for uploaded files
