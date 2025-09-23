
import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

// Configure Cloudinary (use environment variables in production)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
})

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const file = formData[0]
    
    if (!file.filename || !file.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data'
      })
    }

    // Upload buffer to Cloudinary using a Promise
    const uploadToCloudinary = (buffer: Buffer) => {
      return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'sci-food-high',
            resource_type: 'image',
          },
          (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              reject(error || new Error('Cloudinary upload failed'));
            } else {
              resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
          }
        );
        stream.end(buffer);
      });
    };

    const result = await uploadToCloudinary(file.data);

    return {
      success: true,
      imageUrl: result.secure_url,
      filename: result.public_id,
    };
    
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload file'
    })
  }
})
