import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'

const uploadRouter = Router()
uploadRouter.post(
  '/',
  fileMiddleware.upload.single('file'),
  fileMiddleware.fileSizeCheck,
  uploadFile
)

export default uploadRouter
