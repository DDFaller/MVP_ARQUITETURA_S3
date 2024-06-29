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