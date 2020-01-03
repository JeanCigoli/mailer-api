import { apiResponse } from '../utils/index';
import AttachmentsDao from '../dao/AttachmentsDao';

class AttachmentsController {
  async store(req, res) {
    const { filenames } = req.body;

    const payload = [];

    filenames.forEach((name) => {
      payload.push(AttachmentsDao.insertAttachments({ name }));
    });

    const response = apiResponse({
      message: 'Anexos cadastrado com sucesso',
      payload,
    });

    return res.status(201).json(response);
  }

  async index(req, res) {
    let payload = [];
    let response = '';

    payload = await AttachmentsDao.selectAllAttachments();

    if (payload.length === 0) {
      response = apiResponse({
        message: 'Não possui anexos cadastrados',
      });
    } else {
      response = apiResponse({
        message: 'Lista de anexos cadastrados',
        payload,
      });
    }

    return res.json(response);
  }
}

export default new AttachmentsController();
