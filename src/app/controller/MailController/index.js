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
      name, template, from, to, subject, filenames,
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

    try {
      dataEmail.forEach(async (mail) => {
        await Queue.add(SendEmail.key, {
          element: mail,
        });
      });

      files = deleteFiles({ template, filenames });

      if (files !== undefined) {
        await Queue.add(SendEmail.key, {
          element: {
            status: 'Delete',
            ...files,
          },
        });
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
