import { response } from 'express';
import Queue from '../../../lib/Queue';
import SendEmail from '../../jobs/SendMail';
import {
  apiResponse, apiErrorResponse,
} from '../../utils/index';
import { handlerEmail } from './utils';

class MailController {
  async send(req, res) {
    const { mails } = req.body;

    const dataEmail = await handlerEmail(mails);

    try {
      dataEmail.forEach(async (element) => {
        await Queue.add(SendEmail.key, {
          element,
        });
      });


      response = apiResponse({
        message: 'Enviado com sucesso!',
      });

      res.json(response);
    } catch (error) {
      response = apiErrorResponse({
        message: 'Erro ao enviar o e-mail',
        errors: ['Erro ao enviar o e-mail'],
      });

      res.status(404).json(response);
    }
  }
}

export default new MailController();
