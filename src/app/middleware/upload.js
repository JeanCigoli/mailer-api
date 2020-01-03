import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.fieldname === 'page') {
      callback(null, path.resolve(__dirname, '..', '..', 'views', 'layouts'));
    } else if (file.fieldname === 'image') {
      callback(null, path.resolve(__dirname, '..', '..', 'views', 'img'));
    } else if (file.fieldname === 'file') {
      callback(null, path.resolve(__dirname, '..', '..', 'views', 'attachments'));
    }
  },
  filename: (req, file, callback) => {
    if (file.fieldname === 'file') {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}${Math.floor(Math.random() * 100)}${ext}`;

      if (req.body.filenames === undefined) {
        req.body.filenames = [name];
      } else {
        req.body.filenames.push(name);
      }

      callback(null, `${name}`);
    } else {
      callback(null, `${file.originalname}`);
    }
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
});
