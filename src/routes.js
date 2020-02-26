import { Router } from 'express';
import TemplateController from './app/controller/TemplateController';
import MailController from './app/controller/MailController/index';
import { upload } from './app/middleware/upload';

const routes = new Router();

routes.post('/templates', upload.fields([{ name: 'page', maxCount: 1 }]), TemplateController.store);

routes.get('/templates', TemplateController.index);

routes.get('/templates/:id', TemplateController.show);

routes.get('/templates/render/:name', TemplateController.render);

routes.delete('/templates/:id', TemplateController.delete);

routes.post('/send', upload.fields([{ name: 'template', maxCount: 1 }, { name: 'attachments' }]), MailController.send);

routes.get('/asset/:name', TemplateController.renderImage);

export default routes;
