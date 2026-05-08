// config/multer.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

export type UploadFieldRule = {
    name: string;
    maxCount: number;
    mimeTypes: string[];
};

export const createUploader = (fields: UploadFieldRule[]) => {
    const uploadDir = path.resolve(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Created upload directory: ${uploadDir}`);
    }

    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname);
            const timestamp = Date.now();
            const random = Math.round(Math.random() * 1e9);
            cb(null, `logo-${timestamp}-${random}${ext}`);
        },
    });

    const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const rule = fields.find(f => f.name === file.fieldname);
        if (!rule) {
            return cb(null, false);
        }

        if (!rule.mimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${rule.mimeTypes.join(', ')}`));
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }).single('logo');
};