import { Router } from 'express';
import multer from 'multer';
import path from 'path'

const routes = new Router();

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, 'views'),
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    }
})

const upload = multer({ storage });

routes.get('/', (req, res) => {
    return res.status(200).json({
        'api': 'api-email',
        status: 'ativado'
    })
})

routes.post('/templates', upload.single('page'), (req, res) => {
    const { pageName, nome, objeto } = req.body;
    return res.render(pageName, { nome, objeto })
})


export default routes;

