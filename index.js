import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import crypto from 'crypto'
import axios from 'axios'
import dotenv from 'dotenv'
import FormData from 'form-data'
import { uploadFile, getObjectSignedUrl,deleteFile  } from './s3.js'


dotenv.config()

const app = express()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
upload.single('model_bytes')


app.post('/upload', upload.single('model_bytes'), async (req, res) => {
  try {
    const file = req.file
    const { user_id,model_name } = req.body


    const uploadResult = await uploadFile(file.buffer,user_id, model_name, file.mimetype)
    const fileUrl = await getObjectSignedUrl(user_id,model_name)

    
    // Prepare form data for the third-party API
    const formData = new FormData()
    formData.append('user_id', user_id)
    formData.append('model_name', model_name)
    formData.append('model_url', fileUrl)

    // Send file URL and other data to third-party API
    const response = await axios.post(process.env.THIRD_PARTY_API_URL + 'cloth', formData, {
      headers: formData.getHeaders()
    })
    
    console.log('Sended Request to ' + process.env.THIRD_PARTY_API_URL + 'cloth')
    console.log('Request data:')
    console.log(formData)
    res.json({
      message: 'Image uploaded and sent to third-party API successfully',
      data: response.data
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

app.post('/get',upload.single('model_bytes'), async (req, res) => {
  console.log(req.body)
  console.log(req.file)
  try {
    const { user_id,model_name } = req.body
    const fileUrl = await getObjectSignedUrl(user_id,model_name)

    
    res.json({
      message: 'Object url',
      data: fileUrl
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})



// Route to handle file deletion
app.delete('/delete', async (req, res) => {
  try {
    const { user_id, model_name } = req.body
    await deleteFile(user_id, model_name)
    res.json({
      message: `File ${model_name} for user ${user_id} deleted successfully`
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

app.listen(3003, () => console.log('Server is running on port 3003'))
