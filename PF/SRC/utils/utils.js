import fs from 'fs';
import path from 'path';

import {fileURLToPath} from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const basePath = path.join('public', 'images');

export function setDestination(destination) {
    return (req, res, next) => {
        const destinationPath = path.join(basePath, destination);

        fs.mkdir(destinationPath, { recursive: true }, (err) => {
            if (err) {
                return next(err);
            }
            req.fileDestination = destinationPath;
            next();
        });
    };
}

import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = req.fileDestination || 'public/images/';
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().toISOString().split('T')[0];
        const userName = req.user.user.email || 'UnknownUser';
        const originalName = file.originalname;
        const newFileName = `${timestamp}_${userName}_${originalName}`;
        cb(null, newFileName);
    }
});

export const upLoader = multer ({storage});