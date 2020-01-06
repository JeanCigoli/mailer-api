import { Router } from 'express';
import TemplateController from './app/controller/TemplateController';
import MailController from './app/controller/MailController/index';
import { upload } from './app/middleware/upload';
import AttachmentsController from './app/controller/AttachmentsController';

const routes = new Router();


routes.post('/templates', upload.fields([{ name: 'page', maxCount: 1 }, { name: 'image' }]), TemplateController.store);

routes.get('/templates', TemplateController.index);

routes.get('/templates/:id', TemplateController.show);

routes.delete('/templates/:id', TemplateController.delete);

routes.post('/mail', MailController.send);

routes.post('/attachments', upload.array('file'), AttachmentsController.store);

routes.get('/attachments', AttachmentsController.index);

export default routes;
