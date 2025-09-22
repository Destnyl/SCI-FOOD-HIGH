import { mkdir } from 'fs/promises'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { dir } = body
    
    if (!dir) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Directory path required'
      })
    }
    
    await mkdir(dir, { recursive: true })
    
    return { success: true }
  } catch (error) {
    console.error('Directory creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create directory'
    })
  }
})
