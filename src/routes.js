import { Router } from 'express';
import upload from './app/middleware/upload';
import MailController from './app/controller/MailController'
import TemplateController from './app/controller/TemplateController'

const routes = new Router();


routes.get('/', (req, res) => {
    return res.status(200).json({
        'api': 'api-email',
        status: 'ativado'
    })
})

routes.post('/templates', upload.single('page'), TemplateController.store)

routes.get('/templates', TemplateController.index)

routes.delete('/templates/:name', TemplateController.delete)


export default routes;
