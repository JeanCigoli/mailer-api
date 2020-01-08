import { response } from 'express';
import Queue from '../../../lib/Queue';
import SendEmail from '../../jobs/SendMail';
import {
  apiResponse, apiErrorResponse,
} from '../../utils/index';
import { handlerEmail, mailValidate } from './utils';

class MailController {
  async send(req, res) {
    const {
      name, template, from, to, subject,
    } = req.body;

    const mario = mailValidate({
      name, template, from, to, subject,
    });

    if (!mario.status) {
      response = apiErrorResponse({
        message: 'Verifique os atributos',
        errors: mario.errors,
      });

      return res.status(404).json(response);
    }

    const dataEmail = await handlerEmail(req.body);

    try {
      await Queue.add(SendEmail.key, {
        element: dataEmail,
      });

      response = apiResponse({
        message: 'Enviado com sucesso!',
      });

      return res.json(response);
    } catch (error) {
      response = apiErrorResponse({
        message: 'Erro ao enviar o e-mail',
        errors: ['Erro ao enviar o e-mail'],
      });

      return res.status(404).json(response);
    }
  }
}

export default new MailController();
