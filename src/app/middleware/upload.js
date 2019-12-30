import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.fieldname === 'page') {
      callback(null, path.resolve(__dirname, '..', '..', 'views', 'layouts'));
    } else {
      callback(null, path.resolve(__dirname, '..', '..', 'views', 'img'));
    }
  },
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}`);
  },
});

export const upload = multer({ storage });
