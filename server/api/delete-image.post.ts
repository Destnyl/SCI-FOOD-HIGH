import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { publicId } = body
    if (!publicId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing publicId',
      })
    }
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
    return { success: true, result }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete image from Cloudinary',
    })
  }
})
