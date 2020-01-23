import { response } from 'express';
import Queue from '../../../lib/Queue';
import SendEmail from '../../jobs/SendMail';
import {
  apiResponse, apiErrorResponse,
} from '../../utils/index';
import { handlerEmail, mailValidate, deleteFiles } from './utils';

class MailController {
  async send(req, res) {
    let files;
    const {
      name, template, from, to, subject, filenames, limit, delay_minutes,
    } = req.body;

    const canSend = mailValidate({
      name, template, from, to, subject,
    });

    if (!canSend.status) {
      response = apiErrorResponse({
        message: 'Verifique os atributos',
        errors: canSend.errors,
      });

      return res.status(404).json(response);
    }

    const dataEmail = handlerEmail(req.body);

    let cont = 0;
    let delay = 0;
    const delayMinutes = parseFloat(delay_minutes);

    try {
      dataEmail.forEach(async (mail) => {
        if (cont < limit) {
          Queue.add(SendEmail.key, {
            element: mail,
          }, delay);

          cont += 1;
        } else {
          cont = 0;
          delay += delayMinutes;

          Queue.add(SendEmail.key, {
            element: mail,
          }, delay);
        }
      });

      files = deleteFiles({ template, filenames });

      if (files !== undefined) {
        Queue.add(SendEmail.key, {
          element: {
            status: 'Delete',
            ...files,
          },
        }, delay);

        cont = 0;
        delay = 0;
      }


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
