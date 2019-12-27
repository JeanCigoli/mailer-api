import { response } from 'express';
import Mail from '../../lib/Mail';
import {
  apiResponse, apiErrorResponse,
} from '../utils/index';

class MailController {
  async send(req, res) {
    const { mail, template } = req.body;

    let context = '';

    template.variables.forEach((element) => {
      context += `${element.key}: '${element.value}',`;
    });

    try {
      const dataEmail = {
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        template: template.name,
        context,
      };

      console.log(dataEmail);

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
