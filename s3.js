import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

export const uploadFile = async (buffer,userId, fileName, mimeType) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${userId}/${fileName}`,
    Body: buffer,
    ContentType: mimeType
  }

  return s3.upload(params).promise()
}

export const getObjectSignedUrl = async (userId,fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${userId}/${fileName}`,
    Expires: 60 * 60 // 1 hour
  }

  return s3.getSignedUrlPromise('getObject', params)
}

export const deleteFile = async (userId, fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${userId}/${fileName}`
  }

  return s3.deleteObject(params).promise()
}

export const renameFile = async (userId, oldFileName, newFileName) => {
  const copyParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    CopySource: `${process.env.S3_BUCKET_NAME}/${userId}/${oldFileName}`,
    Key: `${userId}/${newFileName}`
  }

  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${userId}/${oldFileName}`
  }

  try {
    // Copy the object to the new key
    await s3.copyObject(copyParams).promise()
    // Delete the original object
    await s3.deleteObject(deleteParams).promise()
    console.log(`File renamed from ${oldFileName} to ${newFileName}`)
    return true
  } catch (error) {
    console.error(`Error renaming file from ${oldFileName} to ${newFileName}:`, error)
    throw error
  }
}