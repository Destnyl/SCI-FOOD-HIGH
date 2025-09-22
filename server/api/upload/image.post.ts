import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

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

    // Generate unique filename
    const fileExtension = file.filename.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    
    // Create uploads directory in public folder
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadsDir, uniqueFilename)
    
    // Ensure uploads directory exists
    try {
      await $fetch('/api/ensure-dir', {
        method: 'POST',
        body: { dir: uploadsDir }
      })
    } catch (error) {
      // If the ensure-dir endpoint doesn't exist, we'll create it
      const { mkdir } = await import('fs/promises')
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (mkdirError) {
        console.log('Directory might already exist:', mkdirError)
      }
    }
    
    // Write file
    await writeFile(filePath, file.data)
    
    // Return the public URL
    const imageUrl = `/uploads/${uniqueFilename}`
    
    return {
      success: true,
      imageUrl,
      filename: uniqueFilename
    }
    
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload file'
    })
  }
})
