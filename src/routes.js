import { Router } from 'express';
import upload from './app/middleware/upload';
import TemplateController from './app/controller/TemplateController';

const routes = new Router();


routes.post('/templates', upload.single('page'), TemplateController.store);

routes.get('/templates', TemplateController.index);

routes.get('/templates/:id', TemplateController.show);

routes.delete('/templates/:name', TemplateController.delete);


export default routes;
