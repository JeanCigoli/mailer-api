import { Router } from 'express';
import upload from './app/middleware/upload';
import TemplateController from './app/controller/TemplateController';
import MailController from './app/controller/MailController';

const routes = new Router();


routes.post('/templates', upload.single('page'), TemplateController.store);

routes.get('/templates', TemplateController.index);

routes.get('/templates/:id', TemplateController.show);

routes.delete('/templates/:name', TemplateController.delete);

routes.post('/mail', MailController.send);


export default routes;
