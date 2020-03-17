import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.fieldname === 'page') {
      callback(null, path.resolve(__dirname, '..', '..', 'views', 'layouts'));
    } else if (file.fieldname === 'attachments') {
      callback(null, path.resolve(__dirname, '..', '..', 'views', 'attachments'));
    } else if (file.fieldname === 'template') {
      callback(null, path.resolve(__dirname, '..', '..', 'views', 'layouts', 'temp'));
    }
  },
  filename: (req, file, callback) => {
    if (file.fieldname === 'attachments') {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}${Math.floor(Math.random() * 100)}${ext}`;

      if (req.body.filenames === undefined) {
        req.body.filenames = [name];
      } else {
        req.body.filenames.push(name);
      }

      callback(null, `${name}`);
    } else if (file.fieldname === 'template') {
      if (req.body.template === undefined) {
        req.body.template = file.originalname;
      }

      callback(null, `${file.originalname}`);
    } else {

      req.body.page = file.originalname;
      callback(null, `${file.originalname}`);
    }
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
});
