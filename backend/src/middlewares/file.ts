import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join, extname } from 'path'
 import { faker } from '@faker-js/faker'
import { MAX_FILE_SIZE, MIN_FILE_SIZE } from '../config'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null,
            join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, faker.string.uuid() + extname(file?.originalname))
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

const fileSizeCheck = (req: Request, res: any, next: any) => {
    if (req.file) {
        const fileSize = req.file.size
        if (fileSize < MIN_FILE_SIZE) {
            return res.status(400).send({
                message:
                    'Размер файла слишком мал. Минимальный размер файла — 2 КБ.',
            })
        }
        if (fileSize > MAX_FILE_SIZE) {
            return res.status(400).send({
                message:
                    'Размер файла слишком велик. Максимальный размер файла — 10 МБ.',
            })
        }
    }
    next()
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
})

export default { upload, fileSizeCheck }
