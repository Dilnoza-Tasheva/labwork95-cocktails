import multer from "multer";
import path from "path";
import config from "./config";
import {promises as fs} from "fs";
import {randomUUID} from "node:crypto";

const storage = (subdir: 'avatars'|'cocktails') => multer.diskStorage({
    destination: async (_req, _file, callback) => {
        const destDir = path.join(config.publicPath, 'images', subdir);
        await fs.mkdir(destDir, { recursive: true });
        callback(null, destDir);
    },
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname);
        callback(null, randomUUID() + extension);
    }
});

export const avatarUpload = multer({storage: storage('avatars')});
export const cocktailImageUpload = multer({storage: storage('cocktails')});
