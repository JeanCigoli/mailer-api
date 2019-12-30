import { response } from 'express';
import path from 'path';
import Mail from '../../lib/Mail';
import {
  apiResponse, apiErrorResponse,
} from '../utils/index';
import TemplateDao from '../dao/TemplateDao';

class MailController {
  async send(req, res) {
    const { mail, template } = req.body;

    const arrayVariables = [];

    template.variables.forEach((element) => {
      const { key, value } = element;
      arrayVariables[key] = value;
    });

    const attachments = [];

    const re = /\s*,\s*/;

    const images = await TemplateDao.selectImagesByNameTemplate(`${template.name}.hbs`);

    const imagesName = images[0].images.split(re);

    const pathImage = path.join('src', 'views', 'img', template.name);

    imagesName.forEach((name) => {
      attachments.push({
        filename: name,
        path: path.join(pathImage, name),
        cid: name,
      });
    });

    const context = { ...arrayVariables };

    try {
      const dataEmail = {
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        template: template.name,
        context,
        attachments,
      };

      await Mail.sendEmail(dataEmail);

      response = apiResponse({
        message: 'Enviado com sucesso!',
      });

      res.json(response);
    } catch (error) {
      console.log(error);

      response = apiErrorResponse({
        message: 'Erro ao enviar o e-mail',
        errors: ['Erro ao enviar o e-mail'],
      });

      res.status(404).json(response);
    }
  }
}

export default new MailController();
